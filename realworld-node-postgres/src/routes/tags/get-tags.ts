import type { H3Event } from "h3";

import { findTags } from "../../entities/tag/read";

export default eventHandler(async function getTags(
	this: Context,
	event: H3Event,
) {
	return toTagsResponse(await findTags.call(this));
});
