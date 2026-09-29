import { describe, expect, it } from "vitest"
import { collectClientPackageLayoutErrors } from "../client-package-layout"

describe("clientPackageLayout", () => {
  it("keeps standalone client packages on the shared app/shared/modules layout", () => {
    expect(collectClientPackageLayoutErrors(process.cwd())).toEqual([])
  })
})
