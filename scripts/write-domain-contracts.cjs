const { writeGeneratedContracts } = require("./lib/rpc-contracts.cjs")

const written = writeGeneratedContracts()
console.log(`[domain-contracts] wrote ${written.length} domain contracts:`)
for (const file of written) console.log(`  ${file}`)
