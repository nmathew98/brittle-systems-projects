import type { Collection } from "../records";

const makePipe = (context: Context) => {
	const toFnWithContext = (fn, index) => {
		if (index === 0) return fn.bind(context);

		// We're taking args as a spread array so that unit tests don't become convoluted,
		// flattening just in case
		return (...records: Collection[]) =>
			fn.call(context, undefined, ...records.flat());
	};

	const pipe =
		<I extends FnWithContext, F extends FnWithContext>(
			...fns: FnWithContext[]
		) =>
		(initial?: Parameters<I>[0]) =>
			fns.reduce(
				async (runningResult: unknown, fn, index) =>
					toFnWithContext(fn, index).call(undefined, await runningResult),
				initial,
			) as unknown as Promise<ReturnType<F>>;

	return pipe;
};

const makeToPipeable =
	(context: Context) =>
	<F extends FnWithContext>(f: F, args?: Parameters<F>[0]) =>
	(...records: Collection[]) =>
		f.call(context, args, ...records);

export const pipe = makePipe(CONTEXT);
export const toPipeable = makeToPipeable(CONTEXT);

export type FnWithContext = (
	this: Context,
	args?: any,
	...records: Collection[]
) => Promise<Collection | Collection[] | void>;
