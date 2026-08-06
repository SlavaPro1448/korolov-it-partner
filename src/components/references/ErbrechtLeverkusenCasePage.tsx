import { CaseDetailPage } from "@/components/references/CaseDetailPage";
import { getCaseBySlug } from "@/data/cases";

const item = getCaseBySlug("erbrecht-leverkusen")!;

export default function ErbrechtLeverkusenCasePage() {
  return <CaseDetailPage item={item} />;
}
