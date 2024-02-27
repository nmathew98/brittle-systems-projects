import passport from "passport";
import passportLocal from "passport-local";
import { UserRecord } from "@entities/user/user";
import {
	sendError,
	sendSuccess,
	setCookie,
	Authorization,
	defineRoute,
	readBody,
} from "@skulpture/serve";
import { IncomingMessage, ServerResponse } from "h3";

const LocalStategy = passportLocal.Strategy;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export default defineRoute({
	route: "/auth/login",
	method: ["post"],
	use: async (e, useModule) => {
		const Authorization: Authorization = useModule("Authorization");

		{
			passport.use(
				new LocalStategy(
					{ usernameField: "email", passwordField: "password" },
					async (
						email: string,
						password: string,
						done: (error: any, user?: Partial<UserRecord>) => void,
					) => {
						const User = useModule("User");
						const Hasher = useModule("Hasher");

						const findUser = buildFindUser({ User });

						try {
							const users = await findUser({ email });

							if (!users || users.length > 1)
								return done(new Error("Invalid email/password"));

							const user = users.pop() as UserRecord;
							const isUserValid = await Hasher.verify(password, user?.password);

							if (!isUserValid)
								return done(new Error("Invalid email/password"));

							const result = { ...user } as Record<string, any>;
							delete result.password;

							return done(null, result);
						} catch (error: any) {
							return done(new Error(error.message));
						}
					},
				),
			);
		}

		try {
			const user = (await passportAuthenticatePromisified(
				e.req,
				e.res,
			)) as UserRecord;

			const body = await readBody(e);

			const accessToken = (await Authorization.get(e.req, {
				sub: user.uuid,
				secret: ACCESS_TOKEN_SECRET,
				expiresIn: body.rememberMe ? "1 hour" : "7 days",
			})) as string;
			const refreshToken = (await Authorization.get(e.req, {
				sub: user.uuid,
				secret: REFRESH_TOKEN_SECRET,
				expiresIn: "7 days",
			})) as string;

			e.res.statusCode = 200;
			setCookie(e, "authorization", accessToken, {
				secure: process.env.NODE_ENV === "production",
				maxAge: body.rememberMe ? oneHourFromNow() : sevenDaysFromNow(),
			});
			setCookie(e, "refresh", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				maxAge: sevenDaysFromNow(),
			});

			return sendSuccess(e, `${user.uuid} successfully authenticated`);
		} catch (error: any) {
			return sendError(e, error.message, error.statusCode);
		}
	},
});

function oneHourFromNow() {
	const oneHour = 60 * 60 * Math.pow(10, 3);

	return Date.now() + oneHour;
}

function sevenDaysFromNow() {
	const sevenDays = 7 * 24 * 60 * 60 * Math.pow(10, 3);

	return Date.now() + sevenDays;
}

function passportAuthenticatePromisified(
	request: IncomingMessage,
	response: ServerResponse,
): Promise<Partial<UserRecord> | undefined> {
	return new Promise((resolve, reject) => {
		readBody(request).then(body => {
			if (typeof body !== "object") return reject(new Error("Invalid request"));
			if (!body.email || !body.password)
				return reject(new Error("Invalid request"));

			passport.authenticate(
				"local",
				(error: any, user?: Partial<UserRecord>) => {
					if (error) return reject(error);

					return resolve(user);
				},
			)({ ...request.req, body }, response.res);
		});
	});
}
