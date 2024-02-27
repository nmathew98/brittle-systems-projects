import { Graph as SudokuGraph } from "@entities/sudoku/sudoku";
import Graphology from "graphology";

// The types for Graphology changed
// I am too lazy to update it but you get the idea
const Graph: SudokuGraph = {
	create: options => {
		return new Graphology();
	},
	size: (graph: any) => {
		return graph.size;
	},
	addEdge: (x, y, graph: any) => {
		graph.addEdge(x, y);
	},
	addNode: (node, attributes, graph: any) => {
		graph.addNode(~node, attributes);
	},
	setNodeAttribute: (node, attribute, value, graph: any) => {
		graph.setNodeAttribute(node, attribute, value);
	},
	getNodeAttribute: (node, attribute, graph: any) => {
		return graph.getNodeAttribute(node, attribute);
	},
	clearEdges: (graph: any) => {
		graph.clearEdges();
	},
	neighbors: (node, graph: any) => {
		return graph.neighbors(node).map((node: any) => ~node);
	},
	mapNodes: (callback, graph: any) => {
		return graph.mapNodes(callback);
	},
};

export default {
	name: "Graph",
	builder: () => Graph,
};
