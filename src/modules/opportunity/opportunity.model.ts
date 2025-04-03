import type { Opportunity } from "@merkl/api";
import type { Columns } from "dappkit";

export type OpportuntyLibraryOverride<T extends string = "table" | "cell", R extends boolean = true> = {
  [Column: string]:
    | (Columns[string] & { [K in T]: (opportunity: Opportunity) => JSX.Element })
    | (R extends true ? true : never);
};
