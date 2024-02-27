export class Counter {
	private _counter: ReturnType<typeof makeCounter>;

	constructor(start?: number) {
		this._counter = makeCounter(start);
	}

	get next(): number {
		return this._counter.next().value as number;
	}
}

function* makeCounter(start = 0) {
	for (let i = start; true; ) {
		yield ++i;
	}
}
