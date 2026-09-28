import type { Schema } from "./schema.gen.js";

declare module "@rocicorp/zero" {
  interface DefaultTypes {
    schema: Schema;
  }
}

// Side-effect-only module — no named exports.
// Imported via "export * from './zero-types.js'" in index.ts.
export type {};
