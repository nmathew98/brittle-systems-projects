import { createRouter } from "h3";

import followUser from "./follow-user";
import getProfile from "./get-profile";
import unfollowUser from "./unfollow-user";

export const Profiles = createRouter()
	.get("/profiles/:username", getProfile)
	.post("/profiles/:username/follow", followUser)
	.delete("/profiles/:username/follow", unfollowUser);
