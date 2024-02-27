import { Collection } from ".";

export class Tag extends Collection {
	private static _null?: EmptyTag;
	public value: string;
	public uuid: string | null = null;

	constructor(data: TagDBSchema) {
		super();

		this.value = data.tag;
		this.uuid = data.uuid || null;
	}

	static get null() {
		if (!Tag._null) Tag._null = new EmptyTag();

		return Tag._null;
	}
}

export const toTagsResponse = (tags: InstanceType<typeof Tag>[]) => ({
	tags: tags.map(tag => tag.value),
});

class EmptyTag extends Tag {
	constructor() {
		super({
			uuid: "EmptyTag",
			tag: "EmptyTag",
		});
	}
}

interface TagDBSchema {
	tag: string;
	uuid?: string;
}
