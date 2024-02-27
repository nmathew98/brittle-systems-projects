import { createRouter } from "h3";

import getTags from "./get-tags";

export const Tags = createRouter().get("/tags", getTags);
