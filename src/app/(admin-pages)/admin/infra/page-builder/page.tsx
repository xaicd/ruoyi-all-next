import { redirect } from "next/navigation"

/** The legacy Puck prototype is retired; all new work starts from Online Definitions. */
export default function LegacyPageBuilderRedirect() {
  redirect("/admin/infra/online-definitions")
}
