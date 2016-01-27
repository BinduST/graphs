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

var allPaths = function(obj, from, to, visiting, paths){
	visiting = visiting || [];
	paths = paths || [];
	if(from == to){
		return paths.push(visiting.concat());
	}
	if(visiting.indexOf(from)==-1){
		var adjVertices = Object.keys(obj[from]);
		for(var index in adjVertices){
			var vertex = adjVertices[index];
			allPaths(obj,vertex,to,visiting.concat(obj[from][vertex]),paths);
		}
	}
	return paths;
}

function calculateTotalWeight(arrOfPaths){
	var totalWeight = 0;
	arrOfPaths.forEach(function(path){
		totalWeight += path.weight;
	});
	return totalWeight;
}

graphs.WeightedGraph.prototype = {
	addVertex : function(vertex){
		this.w_graph[vertex] = {};
	},
	addEdge : function(edge){
		var from = edge.from;
		if(!this.w_graph[from])	this.addVertex(edge.from);
		this.w_graph[from][edge.to] = this.w_graph[from][edge.to] || [edge];
	},
	shortestPath : function(from,to){
		var paths = allPaths(this.w_graph,from,to);
    	var result = paths.sort(function(path1,path2){
    		return calculateTotalWeight(path1) - calculateTotalWeight(path2);
    	})[0];
    	return result;
	}
}

module.exports = graphs;
