import { makeExecutableSchema } from "@graphql-tools/schema";

import type {
	GraphQLResolver,
	GraphQLSchemaDefinition,
} from "./define-schema-definition";
import { Logger } from "../../adapter/internal/logger/logger";
import { schemaDefinitionStore, useStore } from "../../utilities/store";
import { SCHEMA_DEFINITION_TYPES } from "../../utilities/constants";

export const useSchema = async () => {
	const [schema, setSchema] = useStore("local-schema");

	if (schema) return schema;

	const schemaDefinitions = [
		collateFields(SCHEMA_DEFINITION_TYPES.Types),
		collateFields(SCHEMA_DEFINITION_TYPES.Query),
		collateFields(SCHEMA_DEFINITION_TYPES.Mutation),
		collateFields(SCHEMA_DEFINITION_TYPES.Subscription),
	].filter(definition => !!definition);

	// Here if every schema definition is falsy
	// or if `Query` is falsy we do not go further
	// If there are no schema definitions then there is no schema
	// If there is no `Query` then the schema is invalid
	if (schemaDefinitions.length === 0) return null;

	const directives = collateDirectives();

	const typeDefs = schemaDefinitions
		.filter(schemaDef => !!schemaDef?.types)
		.map(schemaDef => schemaDef?.types)
		.join("\n");
	const resolvers = schemaDefinitions
		.filter(schemaDef => !!schemaDef?.resolve)
		.reduce(
			(accumulator, schemaDef) => ({
				...accumulator,
				...schemaDef?.resolve,
			}),
			Object.create(null),
		);
	const configuration = {
		typeDefs,
		resolvers,
	};

	let executableSchema = makeExecutableSchema(configuration);

	if (directives) {
		// For reference on how directives should be defined
		// https://www.graphql-tools.com/docs/schema-directives
		executableSchema = Object.keys(directives).reduce(
			(updated, directive) => directives[directive](updated),
			makeExecutableSchema(configuration),
		);
	}

	setSchema(executableSchema);
	schemaDefinitionStore.clear();

	return executableSchema;
};

const collateDirectives = () => {
	const isPromise = (o: any): o is Promise<any> =>
		typeof o === "object" && !!o.then && typeof o.then === "function";

	const [schemaDefs] =
		useStore<Partial<GraphQLSchemaDefinition>[]>("Directives");

	if (!schemaDefs) return null;

	const hasDefinitions = schemaDefs.every(schemaDef => !!schemaDef.definition);
	const hasResolver = schemaDefs.every(
		schemaDef => !!schemaDef.resolve && typeof schemaDef.resolve === "function",
	);
	const hasPromises = schemaDefs
		.filter(schemaDef => !!schemaDef.resolve)
		.some(schemaDef => isPromise(schemaDef.resolve));

	if (!hasDefinitions)
		return Logger.error(
			"Every directive must provide its name in the definition",
		);

	if (!hasResolver)
		return Logger.error("Every directive must provide a resolver");

	if (hasPromises)
		return Logger.error("Directive resolvers cannot return Promises");

	return schemaDefs.reduce(
		(accumulator, schemaDef) => ({
			...accumulator,
			[schemaDef.definition as string]: (
				schemaDef.resolve as unknown as () => any
			)(),
		}),
		Object.create(null),
	);
};

const collateFields = (root: string) => {
	const [schemaDefs] = useStore<Partial<GraphQLSchemaDefinition>[]>(
		root,
		schemaDefinitionStore,
	);

	if (!schemaDefs) return null;

	const hasDefinitions = schemaDefs.some(schemaDef => !!schemaDef.definition);

	const types = schemaDefs
		.filter(schemaDef => !!schemaDef.types)
		.map(schemaDef => schemaDef.types)
		.join("\n");

	if (root === SCHEMA_DEFINITION_TYPES.Types) return { types };

	// Collate all the fields for a Query, Mutation
	// or Subscription and build the type definition
	let fields = "";
	if (hasDefinitions)
		fields = [
			`type ${root} {`,
			schemaDefs
				.filter(schemaDef => !!schemaDef.definition)
				.map(schemaDef => `\t${schemaDef.definition}`)
				.join("\n"),
			"}",
		].join("\n");

	/**
	 * For something like type Query
	 * We will get an object like
	 * Query: {
	 * 	[key: string]: Function
	 * }
	 */
	const getFieldName = (definition: string) => definition.match(/\w*/)?.pop();
	const collateFields = (
		accumulator: Record<string, any>,
		schemaDef: Partial<GraphQLSchemaDefinition>,
	) => {
		if (!schemaDef.definition) throw new Error("Invalid schema definition");

		const fieldName = getFieldName(schemaDef.definition);

		if (!fieldName) throw new Error("Invalid field name");

		const _resolver = async (_: any, args: any, context: any) =>
			(schemaDef.resolve as GraphQLResolver)(args, context);

		return {
			...accumulator,
			[fieldName]: _resolver,
		};
	};

	let resolvers = null;
	if (hasDefinitions)
		resolvers = {
			[root]: schemaDefs
				.filter(schemaDef => !!schemaDef.resolve)
				.reduce(collateFields, Object.create(null)),
		};

	return {
		// We put the types before the field definitions
		types: [types, fields].join("\n"),
		resolve: resolvers,
	};
};
