import { User, UserRecord } from "../entities/user/user";

export const buildCreateUser = ({ User }: { User: User }) => {
	return async (user: UserRecord) => {
		const uuid = await User.save(user);

		return !!uuid;
	};
};
