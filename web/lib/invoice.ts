// Invoice data access + derived presentation metrics.
// Data model: invoice -> package (linked_package = package.bubble_id)
//   -> product (package.panel / inverter_1 = product.bubble_id)
//   -> customer (invoice.linked_customer = customer.customer_id)
import "server-only";
import { sql } from "./db";

export type InvoiceSearchResult = {
  shareToken: string;
  invoiceNumber: string | null;
  customerName: string | null;
  customerPhone: string | null;
  totalAmount: number | null;
  status: string | null;
};

export type PresentationData = {
  // identity
  shareToken: string;
  invoiceNumber: string | null;
  // customer
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  // bill / savings
  currentBill: number | null; // customer_average_tnb
  newBill: number | null; // estimated_new_bill_amount
  monthlySaving: number | null; // estimated_saving
  savingPercent: number | null; // derived
  sunPeakHour: number | null;
  morningUsagePercent: number | null;
  monthlyGenerationKwh: number | null; // derived (not stored)
  // package
  packageName: string | null;
  panelQty: number | null;
  panelName: string | null;
  panelWatt: number | null;
  panelWarranty: string | null;
  inverterName: string | null;
  inverterWarranty: string | null;
  systemKwp: number | null; // derived
  // price
  listPrice: number | null; // package.price
  finalPrice: number | null; // invoice.total_amount
  discountPercent: number | null;
  discountFixed: number | null;
  paybackYears: number | null; // derived
};

type Row = Record<string, unknown>;

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};
const str = (v: unknown): string | null =>
  v === null || v === undefined ? null : String(v);

const round = (n: number, dp = 2) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

export async function searchInvoices(
  query: string,
): Promise<InvoiceSearchResult[]> {
  const q = query.trim();
  if (!q) return [];
  const like = `%${q}%`;
  const rows = await sql<Row>(
    `select i.share_token, i.invoice_number, i.total_amount, i.status,
            c.name as customer_name, c.phone as customer_phone
       from invoice i
       left join customer c on c.customer_id = i.linked_customer
      where coalesce(i.is_deleted, false) = false
        and i.linked_package is not null
        and i.share_token is not null
        and (i.invoice_number ilike $1 or c.name ilike $1 or c.phone ilike $1)
      order by i.created_at desc
      limit 25`,
    [like],
  );
  return rows.map((r) => ({
    shareToken: String(r.share_token),
    invoiceNumber: str(r.invoice_number),
    customerName: str(r.customer_name),
    customerPhone: str(r.customer_phone),
    totalAmount: num(r.total_amount),
    status: str(r.status),
  }));
}

export async function getInvoiceByToken(
  token: string,
): Promise<PresentationData | null> {
  const requireEnabled = process.env.REQUIRE_SHARE_ENABLED === "true";
  const rows = await sql<Row>(
    `select
        i.share_token, i.invoice_number,
        i.customer_average_tnb, i.estimated_new_bill_amount, i.estimated_saving,
        i.solar_sun_peak_hour, i.solar_morning_usage_percent,
        i.total_amount, i.discount_percent, i.discount_fixed,
        c.name as customer_name, c.phone as customer_phone, c.address as customer_address,
        pkg.package_name, pkg.panel_qty, pkg.price as list_price,
        panel.name as panel_name, panel.solar_output_rating as panel_watt,
        panel.product_warranty_desc as panel_warranty,
        inv.name as inverter_name, inv.product_warranty_desc as inverter_warranty
       from invoice i
       left join customer c on c.customer_id = i.linked_customer
       left join package pkg on pkg.bubble_id = i.linked_package
       left join product panel on panel.bubble_id = pkg.panel
       left join product inv on inv.bubble_id = pkg.inverter_1
      where i.share_token = $1
        and coalesce(i.is_deleted, false) = false
        ${requireEnabled ? "and i.share_enabled = true" : ""}
      limit 1`,
    [token],
  );
  if (rows.length === 0) return null;
  const r = rows[0];

  const currentBill = num(r.customer_average_tnb);
  const newBill = num(r.estimated_new_bill_amount);
  const monthlySaving =
    num(r.estimated_saving) ??
    (currentBill !== null && newBill !== null ? round(currentBill - newBill) : null);
  const savingPercent =
    currentBill && currentBill > 0 && monthlySaving !== null
      ? round((monthlySaving / currentBill) * 100, 1)
      : null;

  const panelQty = num(r.panel_qty);
  const panelWatt = num(r.panel_watt);
  const systemKwp =
    panelQty !== null && panelWatt !== null
      ? round((panelQty * panelWatt) / 1000)
      : null;

  const sunPeakHour = num(r.solar_sun_peak_hour);
  // Not stored anywhere — estimated as kWp x peak-sun-hours x 30 days.
  const monthlyGenerationKwh =
    systemKwp !== null && sunPeakHour !== null
      ? Math.round(systemKwp * sunPeakHour * 30)
      : null;

  const finalPrice = num(r.total_amount);
  const paybackYears =
    finalPrice !== null && monthlySaving && monthlySaving > 0
      ? round(finalPrice / (monthlySaving * 12), 1)
      : null;

  return {
    shareToken: String(r.share_token),
    invoiceNumber: str(r.invoice_number),
    customerName: str(r.customer_name),
    customerPhone: str(r.customer_phone),
    customerAddress: str(r.customer_address),
    currentBill,
    newBill,
    monthlySaving,
    savingPercent,
    sunPeakHour,
    morningUsagePercent: num(r.solar_morning_usage_percent),
    monthlyGenerationKwh,
    packageName: str(r.package_name),
    panelQty,
    panelName: str(r.panel_name)?.trim() ?? null,
    panelWatt,
    panelWarranty: str(r.panel_warranty),
    inverterName: str(r.inverter_name),
    inverterWarranty: str(r.inverter_warranty),
    systemKwp,
    listPrice: num(r.list_price),
    finalPrice,
    discountPercent: num(r.discount_percent),
    discountFixed: num(r.discount_fixed),
    paybackYears,
  };
}
