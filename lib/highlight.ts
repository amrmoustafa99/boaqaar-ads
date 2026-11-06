export const MIN_HIGHLIGHT_DAYS = 1;
export const MAX_HIGHLIGHT_DAYS = 25;
export const DEFAULT_HIGHLIGHT_DAYS = 2;

export const HIGHLIGHT_DURATION_NOTE = `الحد الأقصى ${MAX_HIGHLIGHT_DAYS} يوماً، وهي مدة صلاحية الإعلان`;

export const HIGHLIGHT_PHRASES = [
  { id: "sheikh-site", label: "موقع شيخ" },
  { id: "featured-property", label: "عقار مميز" },
  { id: "bargain-price", label: "سعر لقطة" },
  { id: "good-offer", label: "خوش عرض" },
  { id: "fine-classy", label: "طيب راقي" },
] as const;

export type HighlightPhraseId = (typeof HIGHLIGHT_PHRASES)[number]["id"];

export const DEFAULT_HIGHLIGHT_PHRASE_ID: HighlightPhraseId =
  "featured-property";

/**
 * Listed price for this screen, in Kuwaiti dinars.
 * This project has no highlight rate card, so the amount is not
 * calculated from the selected duration or phrase.
 */
export const HIGHLIGHT_PRICE_KWD = 4;

const kwdAmountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export function formatKwdAmount(amount: number) {
  return kwdAmountFormatter.format(amount);
}

export function highlightDayUnit(days: number) {
  if (days === 1) return "يوم";
  if (days >= 3 && days <= 10) return "أيام";
  if (days >= 11) return "يوماً";
  return "أيام";
}

export function highlightPhraseLabel(id: HighlightPhraseId) {
  return HIGHLIGHT_PHRASES.find((phrase) => phrase.id === id)?.label ?? "";
}
