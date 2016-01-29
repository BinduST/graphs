var ld=require('lodash');

var graphs = {
	WeightedGraph : function () {
		this.w_graph = {};
	},
	Edge : function(edge,from,to,weight){
		this.edgeName = edge;
		this.from = from;
		this.to = to;
		this.weight = weight;
	}
}

function removeVertex(vertices,minVertex){
	vertices.filter(function(vertex,i){
		if(vertex == minVertex){
			return vertices.splice(i,1);
		}
	});
	return vertices;
}

function findPath(source, from, to, paths){
	paths = paths || [];
	if(from == to)
		return paths.concat(from);
	if(paths.indexOf(to)==-1){
		var vertex = source[to];
		var path = findPath(source,from,vertex,paths.concat(to));
	}
	return path;
}

function findEdges(graph,vertices){
	var edges = [];
	vertices.map(function(vertex){
		return Object.keys(graph[vertex]).forEach(function(adjVertex){
			edges.push(graph[vertex][adjVertex]);
		});
	});
	return edges;
}

function findAdjEdgesOf(from,allEdges){
	return allEdges.filter(function(eachEdge){
		return eachEdge.from == from;
	})
}

graphs.WeightedGraph.prototype = {
	addVertex : function(vertex){
		this.w_graph[vertex] = {};
	},
	addEdge : function(edge){
		var from = edge.from;
		if(!this.w_graph[from])	this.addVertex(from);
		this.w_graph[from][edge.to] = this.w_graph[from][edge.to] || edge;
	},
	shortestPath : function(from,to){
		var vertices = Object.keys(this.w_graph);
		var edges = findEdges(this.w_graph,vertices);
		var distances = {}, parent = {}, path = [];
		vertices.forEach(function(vertex){
			if(vertex == from){
				distances[vertex] = 0;
				parent[vertex] = from;
			}else{
				distances[vertex] = Infinity;
				parent[vertex] = '';
			}
		});
		while(vertices.length > 0){
			var minVertex = vertices.reduce(function(vertex1,vertex2){	
				return distances[vertex1] <= distances[vertex2] ? vertex1 : vertex2;  
			});
			vertices = removeVertex(vertices,minVertex);
			var adjVertices = findAdjEdgesOf(minVertex,edges);
			adjVertices.forEach(function(adjVertex){
				if(distances[adjVertex.to] > distances[minVertex] + adjVertex.weight){
					distances[adjVertex.to] = distances[minVertex] + adjVertex.weight;
					parent[adjVertex.to] = minVertex;
				}
			});
		}
		var pathArr = findPath(parent,from,to).reverse();
		edges.filter(function(edge){
			pathArr.forEach(function(vertex,i){
				if(edge.from == vertex && edge.to == pathArr[i+1])
					path.push(edge);
			});
		});
		return path;
	}
}

module.exports = graphs;
