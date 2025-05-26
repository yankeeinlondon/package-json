import { createKindError } from "@yankeeinlondon/kind-error";

export const WrongType = createKindError(
  "WrongType",
  { library: "@yankeeinlondon/package-json" },
);

export const InvalidFile = createKindError(
  "InvalidFile",
  { library: "@yankeeinlondon/package-json" },
);
