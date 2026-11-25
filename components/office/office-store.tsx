"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { Toast } from "@/components/shared/toast";
import {
  addDays,
  createScenarioData,
  findOfficePackage,
  formatOfficeDate,
  OFFICE_PACKAGE_VALIDITY_DAYS,
  TRANSFER_SOURCE_OFFICE,
  TRANSFER_SOURCE_PURCHASE,
  type CurrentOfficePackage,
  type Marketer,
  type OfficePackageId,
  type OfficeScenario,
} from "@/lib/office";

export type MarketerAllocation = { marketerId: string; ads: number };

type ToastMessage = { id: number; message: string };

type OfficeState = {
  scenario: OfficeScenario;
  currentPackage: CurrentOfficePackage;
  marketers: Marketer[];
  toast: ToastMessage | null;
  /** Increments on every change, used to build unique transfer ids. */
  revision: number;
};

type OfficeAction =
  | { type: "setScenario"; scenario: OfficeScenario }
  | {
      type: "purchase";
      packageId: OfficePackageId;
      allocations: MarketerAllocation[];
      today: string;
      validUntil: string;
    }
  | { type: "activate"; marketerIds: string[] }
  | { type: "transfer"; allocations: MarketerAllocation[]; today: string }
  | { type: "showToast"; message: string }
  | { type: "hideToast"; id: number };

function initialState(scenario: OfficeScenario): OfficeState {
  return {
    scenario,
    ...createScenarioData(scenario),
    toast: null,
    revision: 0,
  };
}

function allocationMap(allocations: MarketerAllocation[]) {
  return new Map(allocations.map((item) => [item.marketerId, item.ads]));
}

function reducer(state: OfficeState, action: OfficeAction): OfficeState {
  const revision = state.revision + 1;

  switch (action.type) {
    case "setScenario":
      return { ...initialState(action.scenario), revision };

    case "purchase": {
      const plan = findOfficePackage(action.packageId);
      const allocated = allocationMap(action.allocations);
      const transferred = action.allocations.reduce((sum, item) => sum + item.ads, 0);

      const marketers = state.marketers.map((marketer): Marketer => {
        const ads = allocated.get(marketer.id);
        if (ads !== undefined) {
          return {
            ...marketer,
            status: "active",
            balance: ads,
            validUntil: action.validUntil,
            transfers:
              ads > 0
                ? [
                    {
                      id: `t${revision}-${marketer.id}`,
                      amount: ads,
                      date: action.today,
                      source: TRANSFER_SOURCE_PURCHASE,
                    },
                    ...marketer.transfers,
                  ]
                : marketer.transfers,
          };
        }
        // Marketers active in the previous package keep their remaining
        // balance until it expires, so they become locked for the new one.
        if (marketer.status === "active") {
          return marketer.balance > 0
            ? { ...marketer, status: "locked" }
            : { ...marketer, status: "not_activated", validUntil: null };
        }
        return marketer;
      });

      return {
        ...state,
        revision,
        marketers,
        currentPackage: {
          packageId: plan.id,
          name: plan.name,
          status: "valid",
          validUntil: action.validUntil,
          expiredOn: null,
          availableAds: plan.ads - transferred,
          transferredAds: transferred,
          unusedAds: plan.ads - transferred,
        },
      };
    }

    case "activate": {
      const ids = new Set(action.marketerIds);
      return {
        ...state,
        revision,
        marketers: state.marketers.map((marketer) =>
          ids.has(marketer.id) && marketer.status === "not_activated"
            ? {
                ...marketer,
                status: "active",
                balance: 0,
                validUntil: state.currentPackage.validUntil,
              }
            : marketer,
        ),
      };
    }

    case "transfer": {
      const allocated = allocationMap(action.allocations.filter((item) => item.ads > 0));
      const total = [...allocated.values()].reduce((sum, ads) => sum + ads, 0);
      if (total === 0 || total > state.currentPackage.availableAds) return state;

      return {
        ...state,
        revision,
        currentPackage: {
          ...state.currentPackage,
          availableAds: state.currentPackage.availableAds - total,
          transferredAds: state.currentPackage.transferredAds + total,
        },
        marketers: state.marketers.map((marketer) => {
          const ads = allocated.get(marketer.id);
          if (ads === undefined || marketer.status !== "active") return marketer;
          return {
            ...marketer,
            balance: marketer.balance + ads,
            transfers: [
              {
                id: `t${revision}-${marketer.id}`,
                amount: ads,
                date: action.today,
                source: TRANSFER_SOURCE_OFFICE,
              },
              ...marketer.transfers,
            ],
          };
        }),
      };
    }

    case "showToast":
      return { ...state, revision, toast: { id: revision, message: action.message } };

    case "hideToast":
      return state.toast?.id === action.id ? { ...state, toast: null } : state;
  }
}

type OfficeStore = {
  state: OfficeState;
  setScenario: (scenario: OfficeScenario) => void;
  purchase: (packageId: OfficePackageId, allocations: MarketerAllocation[]) => void;
  activate: (marketerIds: string[]) => void;
  transfer: (allocations: MarketerAllocation[]) => void;
  showToast: (message: string) => void;
};

const OfficeStoreContext = createContext<OfficeStore | null>(null);

export function OfficeStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, "valid", initialState);

  const hideToast = useCallback((id: number) => dispatch({ type: "hideToast", id }), []);

  const store = useMemo<OfficeStore>(
    () => ({
      state,
      setScenario: (scenario) => dispatch({ type: "setScenario", scenario }),
      purchase: (packageId, allocations) => {
        const now = new Date();
        dispatch({
          type: "purchase",
          packageId,
          allocations,
          today: formatOfficeDate(now),
          validUntil: formatOfficeDate(addDays(now, OFFICE_PACKAGE_VALIDITY_DAYS)),
        });
      },
      activate: (marketerIds) => dispatch({ type: "activate", marketerIds }),
      transfer: (allocations) =>
        dispatch({ type: "transfer", allocations, today: formatOfficeDate(new Date()) }),
      showToast: (message) => dispatch({ type: "showToast", message }),
    }),
    [state],
  );

  return (
    <OfficeStoreContext value={store}>
      {children}
      {state.toast ? (
        <Toast
          key={state.toast.id}
          id={state.toast.id}
          message={state.toast.message}
          onDone={hideToast}
        />
      ) : null}
    </OfficeStoreContext>
  );
}

export function useOfficeStore() {
  const store = useContext(OfficeStoreContext);
  if (!store) {
    throw new Error("useOfficeStore must be used inside OfficeStoreProvider");
  }
  return store;
}
