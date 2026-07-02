// Bridges the in-memory reactive stores (loan/expense/savings services) to the
// SQLite-backed server functions.
//
// - hydrate(): fetches the full DB snapshot ONCE (client-side only) and fans it
//   out to every service that registered a handler. Running client-only keeps
//   the SSR render identical to the client's first paint (both use mock seed
//   data), avoiding a hydration mismatch; the DB values are applied right after
//   mount.
// - persist(): fire-and-forget write-through. Mutations stay synchronous for the
//   UI; the DB write happens in the background and only logs on failure.

import { loadAllData } from "./dataFns";

export type DbSnapshot = Awaited<ReturnType<typeof loadAllData>>;

let snapshotPromise: Promise<DbSnapshot> | undefined;

export function hydrate(apply: (snap: DbSnapshot) => void) {
  if (typeof window === "undefined") return; // client only
  if (!snapshotPromise) snapshotPromise = loadAllData();
  snapshotPromise
    .then(apply)
    .catch((err) => console.error("[sqlite] hydrate failed", err));
}

export function persist(op: () => Promise<unknown>) {
  op().catch((err) => console.error("[sqlite] write failed", err));
}
