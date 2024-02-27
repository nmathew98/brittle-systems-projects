import { createRouter } from "h3";

import { Articles } from "./articles";
import { Profiles } from "./profiles";
import { Tags } from "./tags";
import { Users } from "./users";

export const Router = createRouter()
	.add("/user", Users.handler)
	.add("/users", Users.handler)
	.add("/users/*", Users.handler)
	.add("/profiles", Profiles.handler)
	.add("/profiles/**", Profiles.handler)
	.add("/tags", Tags.handler)
	.add("/tags/**", Tags.handler)
	.add("/articles", Articles.handler)
	.add("/articles/**", Articles.handler);
