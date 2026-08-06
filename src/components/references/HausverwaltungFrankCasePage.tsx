import { CaseDetailPage } from "@/components/references/CaseDetailPage";
import { getCaseBySlug } from "@/data/cases";

const item = getCaseBySlug("hausverwaltung-frank")!;

export default function HausverwaltungFrankCasePage() {
  return <CaseDetailPage item={item} />;
}
