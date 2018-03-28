import dagre from 'dagre'

export const test = () => {
  // Create a new directed graph
  var g = new dagre.graphlib.Graph()

  // Set an object for the graph label
  g.setGraph({
    rankdir: 'LR',
    ranker: 'longest-path',
    //nodesep: 0,
    //edgesep: 0,
    //ranksep: 0
  });
  //

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function() { return {}; });

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  g.setNode("kspacey",    { label: "Kevin Spacey",  width: 144, height: 100 });
  g.setNode("swilliams",  { label: "Saul Williams", width: 160, height: 100 });
  g.setNode("bpitt",      { label: "Brad Pitt",     width: 108, height: 100 });
  g.setNode("hford",      { label: "Harrison Ford", width: 168, height: 100 });
  g.setNode("lwilson",    { label: "Luke Wilson",   width: 144, height: 100 });
  g.setNode("kbacon",     { label: "Kevin Bacon",   width: 121, height: 100 });
  g.setNode("artur",     { label: "Artur",   width: 121, height: 100 });

  // Add edges to the graph.
  g.setEdge("kspacey",   "swilliams");
  g.setEdge("swilliams", "kbacon");
  g.setEdge("bpitt",     "kbacon");
  g.setEdge("hford",     "lwilson");
  g.setEdge("hford",     "artur");
  g.setEdge("lwilson",   "kbacon");
  g.setEdge("hford",     "kbacon");

  g.nodes().forEach(function(v) {
    console.log("Node " + v + ": " + JSON.stringify(g.node(v)), g.node(v));
  });

  g.edges().forEach(function(e) {
    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
  });

  dagre.layout(g)

  console.log('---------------------------------------')

  g.nodes().forEach(function(v) {
    console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
  });

  g.edges().forEach(function(e) {
    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
  });

  return g
}


