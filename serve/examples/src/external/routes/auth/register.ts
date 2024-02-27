import {
	sendError,
	sendSuccess,
	Authorization,
	defineRoute,
	readBody,
	setCookie,
} from "@skulpture/serve";
import { User, UserRecord } from "@entities/user/user";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export default defineRoute({
	route: "/auth/register",
	method: ["post"],
	use: async (e, useModule) => {
		const Authorization: Authorization = useModule("Authorization");

		try {
			const User: User = useModule("User");
			const findUser = buildFindUser({ User });
			const createUser = buildCreateUser({ User });

			const body = await readBody(e);

			if (!body.password) return sendError(e, "Invalid user");

			await createUser(body);

			const foundUsers = await findUser({ email: body.email });

			if (!foundUsers) return sendError(e, "Unexpected error occured");

			const user = foundUsers.pop() as UserRecord;

			const accessToken = (await Authorization.get(e.req, {
				sub: user.uuid,
				secret: ACCESS_TOKEN_SECRET,
				expiresIn: "1 hour",
			})) as string;
			const refreshToken = (await Authorization.get(e.req, {
				sub: user.uuid,
				secret: REFRESH_TOKEN_SECRET,
				expiresIn: "7 days",
			})) as string;

			e.res.statusCode = 200;
			setCookie(e, "authorization", accessToken, {
				secure: process.env.NODE_ENV === "production",
				maxAge: oneHourFromNow(),
			});
			setCookie(e, "refresh", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				maxAge: sevenDaysFromNow(),
			});

			return sendSuccess(e, `${user.uuid} successfully registered`);
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
