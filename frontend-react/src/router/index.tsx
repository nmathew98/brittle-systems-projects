import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";

import {
	ifAuthenticated,
	ifIncorrectLocation,
	ifUnauthenticated,
} from "./hooks";
import { SignIn as _SignIn } from "../pages/Auth/SignIn";
import { SignUp as _SignUp } from "../pages/Auth/SignUp";
import { Home as _Home } from "../pages/Home";
import { Profile as _Profile } from "../pages/Profile";
import { Settings as _Settings } from "../pages/Settings";
import { Article as _Article } from "../pages/Article";
import { ArticleCreate as _ArticleCreate } from "../pages/Article/Create";
import { ArticleEdit as _ArticleEdit } from "../pages/Article/Edit";

const REDIRECT_PATH = Date.now();

const NoMatch = () => <div>Ahhh!!!</div>;

const Redirect = () => {
	const location = useLocation();

	return <Navigate to={location.state.to} replace />;
};

export const redirect = hook => Component =>
	function ComponentWithRedirect(props) {
		const from = new URL(window.location.href);
		const details = hook(from);

		if (details?.redirect && details?.to)
			return (
				<Navigate to={`/${REDIRECT_PATH}`} state={{ to: details.to }} replace />
			);

		return <Component {...props} />;
	};

const hideIfUnauth = redirect(ifUnauthenticated);
const hideIfAuth = redirect(ifAuthenticated);
const checkLocationValidity = redirect(ifIncorrectLocation);

const Home = checkLocationValidity(_Home);
const Profile = checkLocationValidity(_Profile);
const SignIn = hideIfAuth(_SignIn);
const SignUp = hideIfAuth(_SignUp);
const Settings = hideIfUnauth(_Settings);
const Article = _Article;
const ArticleCreate = hideIfUnauth(_ArticleCreate);
const ArticleEdit = hideIfUnauth(_ArticleEdit);

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/">
			<Route index element={<Home />} />
			<Route path={`${REDIRECT_PATH}`} element={<Redirect />} />
			<Route path="login" element={<SignIn />} />
			<Route path="register" element={<SignUp />} />
			<Route path="profile">
				<Route path=":username" element={<Profile />} />
			</Route>
			<Route path="article">
				<Route path=":slug" element={<Article />} />
				<Route path="create" element={<ArticleCreate />} />
				<Route path="edit">
					<Route path=":slug" element={<ArticleEdit />} />
				</Route>
			</Route>
			<Route path="settings" element={<Settings />} />
			<Route path="*" element={<NoMatch />} />
		</Route>,
	),
);
