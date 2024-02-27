import { formatISO } from "date-fns";
import { Collection } from ".";

export class Comment extends Collection {
	public uuid: string;
	public createdAt: Date | null = null;
	public updatedAt: Date | null = null;
	public body: string | null = null;
	public author: string | null = null;
	public username: string | null = null;
	public bio: string | null = null;
	public image: string | null = null;
	public isFollowing: boolean | null = null;

	constructor(data: CommentDBSchema) {
		super();

		this.uuid = data.uuid;
		this.body = data.body || null;
		this.author = data.author || null;
		this.username = data.username || null;
		this.bio = data.bio || null;
		this.image = data.image || null;
		this.isFollowing = !!data.is_following;

		const createdAt = Number(data.created_at);
		const updatedAt = Number(data.updated_at);

		this.createdAt = createdAt ? new Date(createdAt) : null;
		this.updatedAt = updatedAt ? new Date(updatedAt) : null;
	}
}

export const toCommentResponse = (comment: InstanceType<typeof Comment>) => ({
	comment: {
		id: comment.uuid,
		createdAt: comment.createdAt ? formatISO(comment.createdAt) : null,
		updatedAt: comment.updatedAt ? formatISO(comment.updatedAt) : null,
		body: comment.body,
		author: {
			username: comment.username,
			bio: comment.bio,
			image: comment.image,
			following: comment.isFollowing,
		},
	},
});

export const toCommentsResponse = (
	comments: InstanceType<typeof Comment>[],
) => ({
	comments: comments.map(comment => toCommentResponse(comment).comment),
});

interface CommentDBSchema {
	uuid: string;
	created_at?: number;
	updated_at?: number;
	body?: string;
	author?: string;
	username?: string;
	bio?: string;
	image?: string;
	is_following?: string;
}
