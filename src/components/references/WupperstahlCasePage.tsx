import { CaseDetailPage } from "@/components/references/CaseDetailPage";
import { getCaseBySlug } from "@/data/cases";

const item = getCaseBySlug("wupperstahl")!;

export default function WupperstahlCasePage() {
  return <CaseDetailPage item={item} />;
}
