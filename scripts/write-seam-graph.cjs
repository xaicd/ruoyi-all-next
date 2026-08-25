const { writeSeamGraph, SEAM_GRAPH_REL } = require("./lib/seam-graph.cjs")

const written = writeSeamGraph()
console.log(`[domain-seams] wrote ${written} (${SEAM_GRAPH_REL})`)
