export type Point = [number, number];

export class CartesianGrid {
	private _generator: ReturnType<typeof coordinates> | null = null;

	constructor(rows = 10, columns = 10) {
		this._generator = coordinates(rows, columns);
	}

	get next(): Point | null {
		const next = this._generator?.next();

		if (!this._generator || next?.done) return null;

		return next?.value as Point;
	}
}

function* coordinates(rows: number, columns: number) {
	for (let i = 0; i < rows; i++)
		for (let j = 0; j < columns; j++) yield [i, j];
}
