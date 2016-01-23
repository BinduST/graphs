var ld = require('lodash');

var graphs = {
	DirectedGraph : function () {
		this.d_graph = {};
	},
	UndirectedGraph : function () {
		this.u_graph = {};
	}
}

graphs.DirectedGraph.prototype = {
	addVertex : function(vertex){
		this.d_graph[vertex] = [];
	},
	addEdge : function(from,to){
		if(!this.d_graph[from])	this.d_graph[from] = [];
		this.d_graph[from].push(to);
	},
	hasEdgeBetween : function(from,to){
		return this.d_graph[from].indexOf(to)>=0;
	},
	order : function(){
		return Object.keys(this.d_graph).length;
	},
	size : function(){
		var graph = this.d_graph;
		return Object.keys(graph).reduce(function(size,vertex){
			return size+graph[vertex].length;
		},0);
	},
	pathBetween : function(from,to,visit){
		var visiting = visit || [];
		if(from == to){
			return visiting.concat(from);
		}
		if(visiting.indexOf(from)==-1){
			for(var index in this.d_graph[from]){
				var vertex = this.d_graph[from][index];
				var path = this.pathBetween(vertex,to,visiting.concat(from));
				if(path[path.length-1]==to) return path;
			}
		}
		return [];
	},
	farthestVertex : function(vertex){
		var pathLength = 0,vertices = Object.keys(this.d_graph);
		for (var index in vertices) {
			var fartherLength = this.pathBetween(vertex,vertices[index]).length;
			if(fartherLength > pathLength){
				pathLength = fartherLength;
				var fartherVertex = vertices[index];
			}
		};
		return fartherVertex;
	}
};

graphs.UndirectedGraph.prototype = {
	addVertex : function(vertex){
		this.u_graph[vertex] = [];
	},
	addEdge : function(from,to){
		if(!this.u_graph[from])	this.u_graph[from] = [];
		if(!this.u_graph[to])	this.u_graph[to] = [];
		this.u_graph[from].push(to);
		this.u_graph[to].push(from);
	},
	hasEdgeBetween : function(from,to){
		return this.u_graph[from].indexOf(to)>=0;
	},
	order : function(){
		return Object.keys(this.u_graph).length;
	},
	size : function(){
		var graph = this.u_graph;
		return Object.keys(graph).reduce(function(size,vertex){
			return size+graph[vertex].length/2;
		},0);
	},
	pathBetween : function(from,to,visit){
		var visiting = visit || [];
		if(from == to){
			return visiting.concat(from);
		}
		if(visiting.indexOf(from)==-1){
			for(var index in this.u_graph[from]){
				var vertex = this.u_graph[from][index];
				var path = this.pathBetween(vertex,to,visiting.concat(from));
				if(path[path.length-1]==to) return path;
			}
		}
		return [];
	},
	farthestVertex : function(vertex){
		var pathLength = 0,vertices = Object.keys(this.u_graph);
		for (var index in vertices) {
			var fartherLength = this.pathBetween(vertex,vertices[index]).length;
			if(fartherLength > pathLength){
				pathLength = fartherLength;
				var fartherVertex = vertices[index];
			}
		};
		return fartherVertex;
	}
};

module.exports = graphs;