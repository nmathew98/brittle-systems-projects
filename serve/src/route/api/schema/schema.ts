import type { SubschemaConfig } from "@graphql-tools/delegate";
import type { GraphQLSchema } from "graphql";
import crypto from "node:crypto";
import { introspectSchema } from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";
import {
	lexicographicSortSchema,
	print,
	printSchema,
	stripIgnoredCharacters,
} from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

import type { GraphQLSubgraph, ServeConfig } from "../../../serve/serve";
import { Logger } from "../../../adapter/internal/logger/logger";
import { useStore } from "../../../utilities/store";
import { gql } from "../../utilities";
import { useSchema } from "../use-schema-definition";
import { config } from "../../../utilities/config";
import { INTERNAL_ROUTES } from "../../../utilities/constants";

export const hsrSchema = gql`
	type Query {
		reloadAllEndpoints: Boolean!
	}
`;

export const hsrResolvers = {
	Query: {
		reloadAllEndpoints: async () => {
			const c = (await config()) as ServeConfig;

			await createStitchedSchema(c);

			return true;
		},
	},
};

export const createStitchedSchema = async (config: ServeConfig) => {
	const [, setSchema] = useStore("schema");

	const subgraphs = await fetchSubschemas(config);

	const localSchema = await useSchema();

	const hsr = makeExecutableSchema({
		typeDefs: hsrSchema,
		resolvers: hsrResolvers,
	});

	const subschemas = [...subgraphs, { schema: hsr }];
	if (localSchema)
		subschemas.push({
			schema: localSchema,
		});

	const schema = setSchema(
		stitchSchemas({
			subschemas,
		}),
	);

	registerSchema(schema);
};

export const fetchSubschemas = async (config: ServeConfig) => {
	let subgraphs: any[] = [];

	if (config?.routes?.[INTERNAL_ROUTES.Api]?.subgraphs) {
		if (Array.isArray(config?.routes?.[INTERNAL_ROUTES.Api]?.subgraphs)) {
			const createRemoteExecuter =
				(location: string, headers: Record<string, any>) =>
				async ({ document, variables }: any) => {
					const query = print(document);

					const fetchResult = await fetch(location, {
						method: "POST",
						headers: {
							...headers,
							"Content-Type": "application/json",
							body: JSON.stringify({ query, variables }),
						},
					});

					return fetchResult.json();
				};

			subgraphs = await Promise.all(
				(config?.routes?.[INTERNAL_ROUTES.Api]?.subgraphs ?? []).map(
					async (subgraph: GraphQLSubgraph): Promise<SubschemaConfig> => {
						const remoteExecutor = createRemoteExecuter(
							subgraph.location,
							subgraph?.headers ?? Object.create(null),
						);

						return {
							schema: await introspectSchema(remoteExecutor),
							executor: remoteExecutor,
							transforms: subgraph?.transforms ?? [],
						};
					},
				),
			);
		}
	}

	return subgraphs;
};

export const registerSchema = (schema: GraphQLSchema) => {
	// Implementation of schema reporting from
	// https://www.apollographql.com/docs/studio/schema/schema-reporting-protocol
	if (
		!process.env.APOLLO_KEY ||
		!process.env.APOLLO_GRAPH_REF ||
		!process.env.APOLLO_SCHEMA_REPORTING
	)
		return;

	const normalizeSchema = (schema: GraphQLSchema) =>
		stripIgnoredCharacters(printSchema(lexicographicSortSchema(schema)));

	const schemaReporting =
		"https://schema-reporting.api.apollographql.com/api/graphql";
	const variant = process.env?.APOLLO_GRAPH_VARIANT ?? "current";
	const graphRef = `${process.env.APOLLO_GRAPH_REF}@${variant}`;
	const bootID = crypto.randomBytes(16).toString("hex");

	const schemaString = normalizeSchema(schema);
	const schemaHash = crypto
		.createHash("sha256")
		.update(schemaString)
		.digest("hex");
	const report = {
		bootID,
		coreSchemaHash: schemaHash,
		graphRef,
	};

	const reportSchema = async (
		coreSchema: string | null,
		report: {
			bootID: string;
			coreSchemaHash: string;
			graphRef: string;
		},
	) => {
		const reportSchemaMutation = stripIgnoredCharacters(gql`
			mutation ReportSchemaMutation(
				$coreSchema: String
				$report: SchemaReport!
			) {
				reportSchema(coreSchema: $coreSchema, report: $report) {
					inSeconds
					withCoreSchema
					... on ReportSchemaError {
						code
						message
					}
				}
			}
		`);

		const result = await fetch(schemaReporting, {
			headers: new Headers({
				"X-API-Key": process.env.APOLLO_KEY as string,
			}),
			body: JSON.stringify({
				query: reportSchemaMutation,
				variables: {
					coreSchema,
					report,
				},
			}),
		});

		if (result.status >= 200 && result.status < 300) return await result.json();

		// If reportSchema fails with a non-2xx response
		// then retry after 20 seconds
		// We need to sleep here instead of setTimeout directly so that
		// the function does not return
		await sleep(20 * Math.pow(10, 3));
		reportSchema(coreSchema, report);
	};

	const sendReport = async (withSchema = false) => {
		const coreSchema = withSchema ? schemaString : null;

		try {
			const response = await reportSchema(coreSchema, report);

			// We should not arrive to this case until we get a response
			const withSchema = response.withExecutableSchema;

			setTimeout(
				() => sendReport.apply(null, [withSchema]),
				response.inSeconds,
			);
		} catch (error: any) {
			Logger.error("Unable to report schema to Apollo Studio");
		}
	};

	sendReport();
	Logger.success(`Reporting GraphQL Schema to ${schemaReporting}`);
	Logger.log(`Graph ref: ${graphRef}`);
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
