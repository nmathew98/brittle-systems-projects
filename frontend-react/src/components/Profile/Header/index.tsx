import { ButtonAction } from "../../Button/Action";

const EMPTY_AVATAR = "https://api.realworld.io/images/smiley-cyrus.jpeg";

export const ProfileHeader = ({
	username,
	bio,
	image,
	onClickFollow,
}: ProfileHeaderProps) => (
	<>
		<img src={image ?? EMPTY_AVATAR} className="user-img" />
		<h4>{username}</h4>
		<p>{bio}</p>
		{!onClickFollow ? null : (
			<ButtonAction icon="ion-plus-round" onClick={onClickFollow}>
				Follow {name}
			</ButtonAction>
		)}
	</>
);

interface ProfileHeaderProps {
	username: string;
	bio: string;
	image: string;
	onClickFollow?: () => any;
}
