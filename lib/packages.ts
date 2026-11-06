export const AD_PACKAGES = [
  {
    id: "one",
    name: "One",
    title: "إعلان عادي",
    count: 1,
    priceKwd: 9,
    adValidityDays: 30,
    packageValidityDays: 30,
    featuredDays: null,
    pinnedNote: null,
    directNote: null,
  },
  {
    id: "one-plus",
    name: "One +",
    title: "إعلان مميز",
    count: 1,
    priceKwd: 10,
    adValidityDays: 7,
    packageValidityDays: null,
    featuredDays: 7,
    pinnedNote: "إعلان مثبت يضمن ظهور أكثر وتفاعل أكبر",
    directNote:
      "إعلان مميز داخل التطبيق مباشرة بعد اعتماده — دون دفع تمييز إضافي",
  },
] as const;

export type AdPackage = (typeof AD_PACKAGES)[number];
export type AdPackageId = AdPackage["id"];

export const DEFAULT_PACKAGE_ID: AdPackageId = "one-plus";

export function findPackage(id: AdPackageId) {
  const match = AD_PACKAGES.find((item) => item.id === id);
  if (!match) return AD_PACKAGES[0];
  return match;
}
