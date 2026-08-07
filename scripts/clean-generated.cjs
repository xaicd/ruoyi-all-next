/**
 * 删除代码生成器产出的文件，准备重新生成
 * 只删除生成器模式的文件（有 XxxService.page/get/create/update/delete 的 service，
 * 以及引用这些 service 的 route.ts）
 */
const fs = require("fs")
const path = require("path")

const APP_API = path.join(__dirname, "..", "src", "app", "api", "admin")
const APP_PAGES = path.join(__dirname, "..", "src", "app", "(admin)", "admin")
const MODULES = path.join(__dirname, "..", "src", "modules")

// Domains that had code generated
const DOMAINS = ["system","infra","bpm","pay","report","mp","mall","member","crm","erp","wms","mes","ai","iot","im"]

let deleted = 0

function deleteGeneratedRoutes() {
  // Delete route files that were generated (they import from @/modules/<domain>/backend/services/<entity>.service)
  for (const domain of DOMAINS) {
    const apiDir = path.join(APP_API, domain)
    if (!fs.existsSync(apiDir)) continue

    const entries = fs.readdirSync(apiDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const routeFile = path.join(apiDir, entry.name, "route.ts")
      if (fs.existsSync(routeFile)) {
        const content = fs.readFileSync(routeFile, "utf-8")
        // Only delete if it matches codegen pattern (imports from services/<entity>.service)
        if (content.includes(".service") && content.includes("Service.page")) {
          fs.unlinkSync(routeFile)
          // Remove empty dir
          try { fs.rmdirSync(path.join(apiDir, entry.name)) } catch {}
          deleted++
        }
      }
    }
  }
}

function deleteGeneratedPages() {
  for (const domain of DOMAINS) {
    const pageDir = path.join(APP_PAGES, domain)
    if (!fs.existsSync(pageDir)) continue

    const entries = fs.readdirSync(pageDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const pageFile = path.join(pageDir, entry.name, "page.tsx")
      if (fs.existsSync(pageFile)) {
        const content = fs.readFileSync(pageFile, "utf-8")
        // Only delete codegen pages (single import + export)
        if (content.includes(".page") && content.split("\n").length <= 5) {
          fs.unlinkSync(pageFile)
          try { fs.rmdirSync(path.join(pageDir, entry.name)) } catch {}
          deleted++
        }
      }
    }
  }
}

function deleteGeneratedServices() {
  for (const domain of DOMAINS) {
    const servicesDir = path.join(MODULES, domain, "backend", "services")
    if (!fs.existsSync(servicesDir)) continue

    const entries = fs.readdirSync(servicesDir)
    for (const file of entries) {
      if (!file.endsWith(".service.ts")) continue
      const full = path.join(servicesDir, file)
      const content = fs.readFileSync(full, "utf-8")
      // Only delete codegen services (have MOCK_DATA pattern)
      if (content.includes("MOCK_DATA") && content.includes("let nextId = 100")) {
        fs.unlinkSync(full)
        deleted++
      }
    }
  }
}

function deleteGeneratedModulePages() {
  for (const domain of DOMAINS) {
    const pagesDir = path.join(MODULES, domain, "frontend", "pages")
    if (!fs.existsSync(pagesDir)) continue

    const entries = fs.readdirSync(pagesDir)
    for (const file of entries) {
      if (!file.endsWith(".page.tsx")) continue
      const full = path.join(pagesDir, file)
      const content = fs.readFileSync(full, "utf-8")
      // Only delete codegen pages (AdminListPageTemplate pattern)
      if (content.includes("AdminListPageTemplate") && content.includes("endpoint=")) {
        fs.unlinkSync(full)
        deleted++
      }
    }
  }
}

console.log("=== Cleaning generated files ===")
deleteGeneratedRoutes()
deleteGeneratedPages()
deleteGeneratedServices()
deleteGeneratedModulePages()
console.log("Done. Deleted " + deleted + " files.")
