"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Result = {
  shareToken: string;
  invoiceNumber: string | null;
  customerName: string | null;
  customerPhone: string | null;
  totalAmount: number | null;
  status: string | null;
};

const rm = (n: number | null) =>
  n === null ? "—" : `RM ${n.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`;

export default function SearchPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setTouched(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const json = await res.json();
        setResults(json.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q]);

  return (
    <div className="phone">
      <div className="search-wrap">
        <div className="search-brand">Eternalgy Solar</div>

        <div className="search-hero">
          <h1>Open a proposal</h1>
          <p>Search by invoice number, customer name, or phone to start the presentation.</p>
        </div>

        <div className="search-box">
          <input
            autoFocus
            inputMode="search"
            placeholder="e.g. INV-1010822, Ah di, 0125757852"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="search-hint">Type at least 2 characters.</div>

        <div className="results">
          {results.map((r) => (
            <button
              key={r.shareToken}
              className="result-card"
              onClick={() => router.push(`/p/${r.shareToken}`)}
            >
              <div className="result-name">{r.customerName ?? "Unnamed customer"}</div>
              <div className="result-meta">
                <span>{r.invoiceNumber ?? "—"}</span>
                <span>·</span>
                <span>{rm(r.totalAmount)}</span>
                {r.customerPhone ? (
                  <>
                    <span>·</span>
                    <span>{r.customerPhone}</span>
                  </>
                ) : null}
                {r.status ? <span className="result-badge">{r.status}</span> : null}
              </div>
            </button>
          ))}
        </div>

        {loading ? <div className="state-msg">Searching…</div> : null}
        {!loading && touched && q.trim().length >= 2 && results.length === 0 ? (
          <div className="state-msg">No proposals match “{q.trim()}”.</div>
        ) : null}
      </div>
    </div>
  );
}
