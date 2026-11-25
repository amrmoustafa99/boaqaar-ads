# Office flow: handover notes

Notes for whoever connects the office screens (`/office/*`) to the real API.
The screens run on local mock data in `lib/office.ts` and a client store in
`components/office/office-store.tsx`.

## Must change when the API is connected

- **`MOCK_TODAY` (`lib/office.ts`).** The marketer status tag on the details
  screen (`سارية` / `منتهية`) compares `validUntil` against this fixed date
  (`25-11-2026`), not the real clock. A fixed date keeps the prerendered HTML
  and the browser render identical. Replace it with the real current date
  (ideally the server's date, sent with the data) when the API is connected.
- **Mock data and actions.** `createScenarioData`, the reducer actions
  (`purchase`, `activate`, `transfer`) and the toasts after each action stand
  in for API calls. Purchase and activation have no payment gateway: "pay"
  applies the result immediately.
- **Mock coupon (`MOCK_COUPON_CODE`, `isValidCoupon`, `couponDiscountKwd`).**
  `BUAQAR10` gives 10% off the order total (package + marketer fees); any
  other code shows `كود الخصم غير صحيح`. Validation and the discount amount
  must come from the API.
- **Purchase validity date.** A mock purchase sets the package's
  `validUntil` to the real date + 30 days in the browser. The API should
  return it.

## Known behaviour, accepted for now

- **Tab flash on direct links to marketer details.** Pages under
  `/office/marketers/[marketerId]` are prerendered, and the prerendered HTML
  cannot know `?tab=`. Opening a link such as `?tab=transfers` directly shows
  the `البيانات` tab until the page hydrates, then switches. Tab clicks and
  in-app navigation are not affected. Fix, if needed: read `searchParams` on
  the server so the right tab is in the first HTML (the page is then rendered
  per request instead of prerendered).
