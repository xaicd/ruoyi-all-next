const { writeGeneratedContracts } = require("./lib/rpc-contracts.cjs")
const { writeSeamGraph, SEAM_GRAPH_REL } = require("./lib/seam-graph.cjs")

const written = writeGeneratedContracts()
const seam = writeSeamGraph()
console.log(`[domain-contracts] wrote ${written.length} domain contracts:`)
for (const file of written) console.log(`  ${file}`)
console.log(`[domain-contracts] wrote ${seam} (${SEAM_GRAPH_REL})`)
