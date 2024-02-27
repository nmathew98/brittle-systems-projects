import type { NodeIncomingMessage, NodeServerResponse } from "h3";

import type { Keys } from "../../utilities/constants";
import { SCHEMA_DEFINITION_TYPES } from "../../utilities/constants";
import { schemaDefinitionStore, useStore } from "../../utilities/store";

export const defineSchemaDefinition = (
	type: Keys<typeof SCHEMA_DEFINITION_TYPES>,
	definition: Partial<GraphQLSchemaDefinition>,
) => {
	const [schemaDefs, setSchemaDefs] = useStore(type, schemaDefinitionStore);

	const filterDuplicateDefinition = (
		schemaDef: Partial<GraphQLSchemaDefinition>,
	) => schemaDef?.definition !== definition?.definition;

	const updated = ([] as Partial<GraphQLSchemaDefinition>[])
		.concat(schemaDefs ?? [])
		.filter(filterDuplicateDefinition)
		.concat(Object.freeze(definition));

	setSchemaDefs(updated);
};

export const defineQuery = (definition: GraphQLQueryDefinition) => async () =>
	defineSchemaDefinition(SCHEMA_DEFINITION_TYPES.Query, definition);

export const defineSubscription =
	(definition: GraphQLSubscriptionDefinition) => async () =>
		defineSchemaDefinition(SCHEMA_DEFINITION_TYPES.Subscription, definition);

export const defineMutation =
	(definition: GraphQLMutationDefinition) => async () =>
		defineSchemaDefinition(SCHEMA_DEFINITION_TYPES.Mutation, definition);

export const defineType = (definition: GraphQLTypeDefinition) => async () =>
	defineSchemaDefinition(SCHEMA_DEFINITION_TYPES.Types, definition);

export const defineDirective =
	(definition: GraphQLDirectiveDefinition) => async () =>
		defineSchemaDefinition(SCHEMA_DEFINITION_TYPES.Directives, definition);

export interface GraphQLSchemaDefinition {
	definition: string;
	types: string;
	resolve: GraphQLResolver;
}

export type GraphQLResolver = (
	args: Record<string, any>,
	context: GraphQLResolverContext,
) => any;
interface GraphQLResolverContext {
	req: NodeIncomingMessage;
	res: NodeServerResponse;
	useModule: (key: string | symbol) => any;
}

type GraphQLQueryDefinition = Omit<GraphQLSchemaDefinition, "types"> &
	Partial<Pick<GraphQLSchemaDefinition, "types">>;
type GraphQLMutationDefinition = Omit<GraphQLSchemaDefinition, "types"> &
	Partial<Pick<GraphQLSchemaDefinition, "types">>;
type GraphQLSubscriptionDefinition = Omit<GraphQLSchemaDefinition, "types"> &
	Partial<Pick<GraphQLSchemaDefinition, "types">>;
type GraphQLDirectiveDefinition = Omit<GraphQLSchemaDefinition, "definition">;
type GraphQLTypeDefinition = Pick<GraphQLSchemaDefinition, "types">;
