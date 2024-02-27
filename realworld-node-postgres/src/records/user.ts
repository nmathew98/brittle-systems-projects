import { Collection } from ".";

export class User extends Collection {
	public uuid: string;
	public username: string | null = null;
	public email: string | null = null;
	public image: string | null = null;
	public bio: string | null = null;
	public tokens: UserTokens | null = null;
	public isFollowing: boolean = false;

	constructor(data: UserDBSchema & AdditionalData) {
		super();

		this.uuid = data.uuid;
		this.username = data.username || null;
		this.email = data.email || null;
		this.image = data.image || null;
		this.bio = data.bio || null;
		this.tokens = data.tokens || null;
		this.isFollowing = !!data.isFollowing;
	}
}

export const toUserResponse = (user: InstanceType<typeof User>) => ({
	user: {
		email: user.email,
		token: user.tokens?.accessToken?.value,
		username: user.username,
		bio: user.bio,
		image: user.image,
	},
});

export const toProfileResponse = (user: InstanceType<typeof User>) => ({
	profile: {
		username: user.username,
		bio: user.bio,
		image: user.image,
		following: !!user.isFollowing,
	},
});

interface UserDBSchema {
	uuid: string;
	username?: string;
	email?: string;
	password?: string;
	bio?: string;
	image?: string;
}

interface AdditionalData {
	tokens?: UserTokens;
	isFollowing?: boolean;
}

export interface UserTokens {
	accessToken: {
		value: string;
		expiresIn: number;
	};
	refreshToken: {
		value: string;
		expiresIn: number;
	};
}
