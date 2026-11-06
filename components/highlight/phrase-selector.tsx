import {
  HIGHLIGHT_PHRASES,
  type HighlightPhraseId,
} from "@/lib/highlight";

type PhraseSelectorProps = {
  value: HighlightPhraseId;
  onChange: (value: HighlightPhraseId) => void;
};

export function PhraseSelector({ value, onChange }: PhraseSelectorProps) {
  return (
    <section aria-labelledby="phrase-heading">
      <h2
        id="phrase-heading"
        className="mb-1.5 text-[14px] font-semibold text-slate-600"
      >
        اختر عبارة التمييز
      </h2>
      <div
        role="radiogroup"
        aria-labelledby="phrase-heading"
        className="overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)]"
      >
        {HIGHLIGHT_PHRASES.map((phrase, index) => {
          const selected = phrase.id === value;

          return (
            <div key={phrase.id}>
              <label
                dir="ltr"
                className="flex min-h-[56px] cursor-pointer items-center gap-3 px-4 py-4 outline-none hover:bg-slate-50/80 [&:has(:focus-visible)]:bg-orange-50"
              >
                <span
                  className={
                    selected
                      ? "flex-1 text-right text-[15px] font-bold text-slate-900"
                      : "flex-1 text-right text-[15px] font-medium text-slate-700"
                  }
                >
                  {phrase.label}
                </span>
                <input
                  type="radio"
                  name="highlight-phrase"
                  value={phrase.id}
                  checked={selected}
                  onChange={() => onChange(phrase.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={
                    selected
                      ? "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 border-orange-500"
                      : "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 border-[#cfd6da]"
                  }
                >
                  {selected ? (
                    <span className="h-3 w-3 rounded-full bg-orange-500" />
                  ) : null}
                </span>
              </label>
              {index < HIGHLIGHT_PHRASES.length - 1 ? (
                <div className="me-4 ms-10 border-b border-[#eef0f2]" />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
