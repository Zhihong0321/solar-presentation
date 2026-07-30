import Link from "next/link";
import { headers } from "next/headers";
import { getInvoiceByToken } from "@/lib/invoice";
import { logVisit } from "@/lib/activityLog";
import Deck from "./Deck";

export const dynamic = "force-dynamic";

export default async function PresentationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getInvoiceByToken(token);

  if (!data) {
    return (
      <div className="phone">
        <div className="search-wrap">
          <div className="search-brand">Eternalgy Solar</div>
          <div className="search-hero">
            <h1>Proposal not found</h1>
            <p>
              This link is invalid, expired, or the proposal has no package
              attached yet.
            </p>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/" className="result-card" style={{ textAlign: "center" }}>
              <span className="result-name">← Search for a proposal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Log visitor activity
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || undefined;
  const userAgent = headersList.get("user-agent") || undefined;
  const referer = headersList.get("referer") || undefined;

  logVisit({
    token,
    invoiceId: data.shareToken,
    invoiceNumber: data.invoiceNumber || undefined,
    customerName: data.customerName || undefined,
    ip,
    userAgent,
    referer,
  }).catch((err) => console.error("Visit logging failed:", err));

  return <Deck data={data} />;
}
