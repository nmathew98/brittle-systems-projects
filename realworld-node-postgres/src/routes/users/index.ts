import { createRouter } from "h3";

import login from "./login";
import currentUser from "./current-user";
import registration from "./registration";
import update from "./update";

export const Users = createRouter()
	.post("/users", registration)
	.post("/users/login", login)
	.get("/user", currentUser)
	.put("/user", update);
