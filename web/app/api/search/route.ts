import { NextRequest, NextResponse } from "next/server";
import { searchInvoices } from "@/lib/invoice";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await searchInvoices(q);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("search error", err);
    return NextResponse.json(
      { error: "Search failed", results: [] },
      { status: 500 },
    );
  }
}
