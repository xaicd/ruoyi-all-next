const fs = require("fs")
const path = require("path")

const binDir = path.join(__dirname, "..", "node_modules", ".bin")
if (!fs.existsSync(binDir)) {
  console.log("node_modules/.bin not found")
  process.exit(0)
}

const files = fs.readdirSync(binDir)
for (const file of files) {
  // Matches e.g. .prisma.cmd-KGAY6sYV -> prisma.cmd
  const match = file.match(/^\.([a-zA-Z0-9_\-\.]+?)(?:\.[a-zA-Z0-9]+)?-[a-zA-Z0-9]+$/)
  if (file.startsWith(".") && file.includes("-")) {
    const cleanName = file.replace(/^\./, "").replace(/-[a-zA-Z0-9]+$/, "")
    const targetPath = path.join(binDir, cleanName)
    const srcPath = path.join(binDir, file)
    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(srcPath, targetPath)
      console.log(`Restored: ${file} -> ${cleanName}`)
    }
  }
}

// Ensure prisma.cmd specifically exists
const prismaCmd = path.join(binDir, "prisma.cmd")
if (!fs.existsSync(prismaCmd)) {
  const content = `@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\\node.exe" (
  SET "_prog=%dp0%\\node.exe"
) ELSE (
  SET "_prog=node"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

endLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "%dp0%\\..\\prisma\\build\\index.js" %*
`
  fs.writeFileSync(prismaCmd, content, "utf8")
  console.log("Created prisma.cmd")
}

console.log("node_modules/.bin shims verified.")
