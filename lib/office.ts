export type OfficePackageStatus = "valid" | "expired" | "none";

/**
 * not_activated: no balance in the current office package, can be selected for activation.
 * active: activated in the current office package, can receive transfers.
 * locked: holds a balance from a previous office package, cannot receive
 * transfers until it expires.
 */
export type MarketerStatus = "not_activated" | "active" | "locked";

export const OFFICE_PACKAGES = [
  { id: "starter", name: "Starter", ads: 10, priceKwd: 30 },
  { id: "premium", name: "Premium", ads: 40, priceKwd: 86 },
  { id: "business-plus", name: "Business +", ads: 100, priceKwd: 140 },
] as const;

export type OfficePackageOffer = (typeof OFFICE_PACKAGES)[number];
export type OfficePackageId = OfficePackageOffer["id"];

export const OFFICE_PACKAGE_VALIDITY_DAYS = 30;
export const OFFICE_AD_VALIDITY_DAYS = 30;
export const MARKETER_ACTIVATION_FEE_KWD = 5;

export const TRANSFER_SOURCE_OFFICE = "تحويل من باقة المكتب";
export const TRANSFER_SOURCE_PURCHASE = "مع شراء الباقة";

export type CurrentOfficePackage = {
  packageId: OfficePackageId;
  name: string;
  status: OfficePackageStatus;
  /** dd-mm-yyyy */
  validUntil: string;
  /** dd-mm-yyyy, only when status is "expired" */
  expiredOn: string | null;
  availableAds: number;
  transferredAds: number;
  unusedAds: number;
};

export type MarketerTransfer = {
  id: string;
  amount: number;
  /** dd-mm-yyyy */
  date: string;
  source: string;
};

export type Marketer = {
  id: string;
  name: string;
  phone: string;
  status: MarketerStatus;
  balance: number;
  /** dd-mm-yyyy, null when the marketer has no balance period */
  validUntil: string | null;
  /** dd-mm-yyyy */
  joinedOn: string;
  transfers: MarketerTransfer[];
};

export type OfficeScenario = "valid" | "expired" | "noMarketers";

export const OFFICE_SCENARIOS: readonly { id: OfficeScenario; label: string }[] = [
  { id: "valid", label: "باقة سارية" },
  { id: "expired", label: "باقة منتهية" },
  { id: "noMarketers", label: "بدون مسوقين" },
];

const MOCK_MARKETERS: readonly Marketer[] = [
  {
    id: "m1",
    name: "حبيب الصفار",
    phone: "50202200",
    status: "not_activated",
    balance: 0,
    validUntil: null,
    joinedOn: "13-07-2026",
    transfers: [],
  },
  {
    id: "m2",
    name: "ياسر",
    phone: "95576357",
    status: "not_activated",
    balance: 0,
    validUntil: null,
    joinedOn: "02-08-2026",
    transfers: [],
  },
  {
    id: "m3",
    name: "يوسف",
    phone: "95578170",
    status: "not_activated",
    balance: 0,
    validUntil: null,
    joinedOn: "10-08-2026",
    transfers: [],
  },
  {
    id: "m4",
    name: "شوبين",
    phone: "94017607",
    status: "locked",
    balance: 5,
    validUntil: "18-12-2026",
    joinedOn: "01-05-2026",
    transfers: [],
  },
  {
    id: "m5",
    name: "منصور",
    phone: "50342220",
    status: "locked",
    balance: 5,
    validUntil: "18-12-2026",
    joinedOn: "03-05-2026",
    transfers: [],
  },
  {
    id: "m6",
    name: "ماجد",
    phone: "97578455",
    status: "active",
    balance: 0,
    validUntil: "18-12-2026",
    joinedOn: "19-04-2026",
    transfers: [
      { id: "t3", amount: 5, date: "20-11-2026", source: TRANSFER_SOURCE_OFFICE },
      { id: "t2", amount: 3, date: "12-11-2026", source: TRANSFER_SOURCE_OFFICE },
      { id: "t1", amount: 2, date: "02-11-2026", source: TRANSFER_SOURCE_PURCHASE },
    ],
  },
];

/** Every marketer id in the mock data, for prerendering detail pages. */
export const MOCK_MARKETER_IDS = MOCK_MARKETERS.map((marketer) => marketer.id);

const VALID_PACKAGE: CurrentOfficePackage = {
  packageId: "premium",
  name: "Premium",
  status: "valid",
  validUntil: "18-12-2026",
  expiredOn: null,
  availableAds: 40,
  transferredAds: 10,
  unusedAds: 6,
};

export function createScenarioData(scenario: OfficeScenario): {
  currentPackage: CurrentOfficePackage;
  marketers: Marketer[];
} {
  const marketers = MOCK_MARKETERS.map((marketer) => ({
    ...marketer,
    transfers: [...marketer.transfers],
  }));

  if (scenario === "expired") {
    return {
      currentPackage: {
        ...VALID_PACKAGE,
        status: "expired",
        expiredOn: "18-11-2026",
        availableAds: 0,
      },
      marketers,
    };
  }

  if (scenario === "noMarketers") {
    return { currentPackage: { ...VALID_PACKAGE }, marketers: [] };
  }

  return { currentPackage: { ...VALID_PACKAGE }, marketers };
}

export function isOfficePackageId(value: string): value is OfficePackageId {
  return OFFICE_PACKAGES.some((item) => item.id === value);
}

export function findOfficePackage(id: OfficePackageId): OfficePackageOffer {
  return OFFICE_PACKAGES.find((item) => item.id === id) ?? OFFICE_PACKAGES[0];
}

const STATUS_ORDER: Record<MarketerStatus, number> = {
  not_activated: 0,
  locked: 1,
  active: 2,
};

/** not_activated → locked → active, keeping the mock order inside each group. */
export function sortMarketers(marketers: readonly Marketer[]): Marketer[] {
  return [...marketers].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  );
}

export function marketerPackageLabel(status: MarketerStatus) {
  return status === "not_activated" ? "لا توجد باقة سارية" : "رصيد محول";
}

export function totalTransferred(marketer: Marketer) {
  return marketer.transfers.reduce((sum, transfer) => sum + transfer.amount, 0);
}

export function sumValues(values: Readonly<Record<string, number>>) {
  return Object.values(values).reduce((sum, value) => sum + value, 0);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** Formats a date as dd-mm-yyyy, the format used across the office screens. */
export function formatOfficeDate(date: Date) {
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const MOCK_COUPON_CODE = "BUAQAR10";
export const MOCK_COUPON_RATE = 0.1;

export function isValidCoupon(code: string) {
  return code.trim().toUpperCase() === MOCK_COUPON_CODE;
}

export const MARKETER_TABS = [
  { id: "data", label: "البيانات" },
  { id: "ads", label: "الإعلانات" },
  { id: "transfers", label: "التحويلات" },
] as const;

export type MarketerTabId = (typeof MARKETER_TABS)[number]["id"];

export function parseMarketerTab(value: string | null): MarketerTabId {
  return MARKETER_TABS.find((tab) => tab.id === value)?.id ?? "data";
}

/** Parses dd-mm-yyyy into a local Date at midnight. */
export function parseOfficeDate(value: string) {
  const [day, month, year] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Status of a marketer's balance period: none when it never had one,
 * otherwise valid until the end of its `validUntil` day.
 */
export function marketerBalanceStatus(
  marketer: Marketer,
  today: Date,
): "valid" | "expired" | null {
  if (marketer.validUntil === null) return null;
  const end = parseOfficeDate(marketer.validUntil);
  end.setDate(end.getDate() + 1);
  return today < end ? "valid" : "expired";
}

/**
 * Fixed "today" for status tags in the mock data. Rendering with the real
 * clock would differ between the prerendered HTML and the browser.
 */
export const MOCK_TODAY = "25-11-2026";
