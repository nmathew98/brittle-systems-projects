import { User, UserRecord } from "../entities/user/user";

export const buildUpdateUser = ({ User }: { User: User }) => {
	return async (identifiers: Partial<UserRecord>, user: Partial<UserRecord>) =>
		await User.update(identifiers, user);
};
