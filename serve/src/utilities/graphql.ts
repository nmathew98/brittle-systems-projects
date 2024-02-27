import type { DocumentNode, ExecutionArgs, GraphQLArgs, Source } from "graphql";
import { graphql as _graphql, parse, print } from "graphql";
import { compileQuery, isCompiledQuery } from "graphql-jit";

export const graphql = async (
	args: GraphQLArgs | ExecutionArgs,
): ReturnType<typeof _graphql> => {
	const query =
		(args as GraphQLArgs)?.source ?? (args as ExecutionArgs).document;
	const document = parse(queryToString(query));

	const compiledQuery = compileQuery(args.schema, document);

	if (!isCompiledQuery(compiledQuery)) return _graphql(args as GraphQLArgs);
	else return compiledQuery.query(null, args.contextValue, args.variableValues);
};

const queryToString = (query: string | Source | DocumentNode) => {
	let _query;
	// All DocumentNode's have a kind property
	if (typeof query !== "string" && !!(query as any)?.kind)
		_query = print(query as DocumentNode);
	else _query = query as string | Source;

	return _query;
};
