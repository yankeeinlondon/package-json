import type { EmptyObject } from "inferred-types";
import type { PackageJson } from "./types";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  stripTrailing,

} from "inferred-types";
import { InvalidFile, WrongType } from "./error";
import { isPackageJson } from "./isPackageJson";

/**
 * Parses the `package.json` in the passed in folder.
 *
 * - returns a structured `PackageJson` object if file exists
 * (and is parsable)
 * - returns an empty object if the file did not exist
 *
 * #### Errors
 * - if the file exists but is of the wrong **Type** for a `PackageJson`
 * then a `WrongType` error will be thrown
 * - if the file exists but couldn't be parsed by JSON then an `InvalidFile` error will be thrown.
 */
export function parsePackageJson(
  folder: string,
): PackageJson | EmptyObject {
  const file = join(stripTrailing(folder, "/package.json"), "package.json");
  let pkg: object;
  if (existsSync(file)) {
    const data = readFileSync(file, "utf-8");
    try {
      pkg = JSON.parse(data);
    }
    catch (err) {
      throw InvalidFile(`There was a package.json file in "${folder}" but it could not be parsed by JSON!`, { folder, data, error: err as Error });
    }

    if (isPackageJson(pkg)) {
      return pkg as PackageJson;
    }
    else {
      throw WrongType(`The package.json file in "${folder}" was parsed but the types of certain properties were invalid!`, {
        pkg,
        folder,
      });
    }
  }
  else {
    return {} as EmptyObject;
  }
}
