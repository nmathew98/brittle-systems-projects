export const usePreviousValueEffect = (f, to) => {
	const previousValue = useRef(to);

	useEffect(() => {
		const effect = f(previousValue.current, to);

		if (effect !== undefined) previousValue.current = effect;
		if (effect === undefined) previousValue.current = to;
	}, [to]);
};
