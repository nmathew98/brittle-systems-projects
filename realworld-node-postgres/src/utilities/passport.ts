import type {
	VerifyFunctionWithRequest,
	IStrategyOptionsWithRequest,
} from "passport-local";
import type { H3Event, NodeIncomingMessage, NodeServerResponse } from "h3";
import { setCookie } from "h3";
import { Strategy as LocalStrategy } from "passport-local";
import _passport from "passport";

import { makeUser } from "../entities/user/create";

// Setup passport
use(verify);

export const usePassport = ({
	event,
	body,
}: {
	event: H3Event;
	body: Record<string, any>;
}) => authenticate(event, body) as Promise<InstanceType<typeof User>>;

function use(verify: VerifyFunctionWithRequest) {
	const strategyOptions: IStrategyOptionsWithRequest = {
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true,
	};

	const strategy = new LocalStrategy(strategyOptions, verify);

	return _passport.use(strategy);
}

async function verify(req: any, email: string, password: string, done: any) {
	try {
		const user = await makeUser.bind(CONTEXT)({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			generateTokens: true,
		});

		done(null, user);
	} catch (error: unknown) {
		done(error);
	}
}

const passportAuthenticatePromisified = (
	strategy: string,
	req: NodeIncomingMessage,
	res: NodeServerResponse,
	body: Record<string, any>,
) =>
	new Promise((resolve, reject) => {
		const authenticator = _passport.authenticate(strategy, (error, data) => {
			if (error) return reject(error);

			return resolve(data);
		});

		// Can't seem to use nested properties with `passport-local`
		authenticator({ ...req, body: body.user }, res);
	});

const authenticate = async (event: H3Event, body: Record<string, any>) => {
	const user = (await passportAuthenticatePromisified(
		"local",
		event.node.req,
		event.node.res,
		body,
	)) as InstanceType<typeof User>;

	setCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.AccessToken,
		user?.tokens?.accessToken.value as string,
		{
			secure: process.env.NODE_ENV === "production",
			maxAge: user?.tokens?.accessToken.expiresIn,
		},
	);

	setCookie(
		event,
		AUTHENTICATION_COOKIE_KEYS.RefreshToken,
		user?.tokens?.refreshToken.value as string,
		{
			secure: process.env.NODE_ENV === "production",
			maxAge: user?.tokens?.refreshToken.expiresIn,
			httpOnly: true,
		},
	);

	return user;
};
