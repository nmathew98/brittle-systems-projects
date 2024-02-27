import { User, UserRecord } from "../entities/user/user";

export const buildDeleteUser = ({ User }: { User: User }) => {
	return async (user: Pick<UserRecord, "uuid">) => {
		await User.delete({ uuid: user.uuid });
	};
};
