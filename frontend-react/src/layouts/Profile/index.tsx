import { useParams } from "react-router-dom";

import { LayoutBase } from "../";
import { ProfileHeader } from "../../components/Profile/Header";
import { useUser } from "../../hooks/user/useUser";

// ArticleNavigation = ArticleTabContainer + ArticleTabItem
export const LayoutProfile = ({ children }) => (
	<LayoutBase>
		<div className="profile-page">
			<div className="user-info">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-md-10 offset-md-1">
							<Header />
						</div>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-xs-12 col-md-10 offset-md-1">{children}</div>
				</div>
			</div>
		</div>
	</LayoutBase>
);

const Header = () => {
	const params = useParams();

	const username = params?.username?.replace("@", "");
	const { profile } = useUser({ username, slug: null });

	if (!profile) return null;

	return (
		<ProfileHeader
			username={profile.username}
			bio={profile.bio}
			image={profile.image}
		/>
	);
};
