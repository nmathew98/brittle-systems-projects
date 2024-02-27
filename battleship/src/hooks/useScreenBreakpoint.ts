export const DEFAULT_BREAKPOINTS = {
	Mobile: Symbol("mobile"),
	Tablet: Symbol("tablet"),
	Desktop: Symbol("desktop"),
};

const DEFAULT_MEDIA_QUERIES = {
	"(max-width: 768px)": DEFAULT_BREAKPOINTS.Mobile,
	"(min-width: 768px) and (max-width: 1024px)": DEFAULT_BREAKPOINTS.Tablet,
	"(min-width: 1024px)": DEFAULT_BREAKPOINTS.Desktop,
};

const determineBreakpoint = (mediaQueries: MediaQueries) => {
	for (const [query, breakpoint] of Object.entries(mediaQueries))
		if (window.matchMedia(query).matches) return breakpoint;
};

export const useScreenBreakpoint = (
	mediaQueries: MediaQueries = DEFAULT_MEDIA_QUERIES,
) => {
	const [currentBreakpoint, setCurrentBreakpoint] = useState(
		determineBreakpoint(mediaQueries),
	);

	useEffect(() => {
		window.addEventListener("resize", () => {
			setCurrentBreakpoint(determineBreakpoint(mediaQueries));
		});
	}, []);

	return {
		currentBreakpoint,
	};
};

export interface MediaQueries {
	[key: string]: symbol;
}
