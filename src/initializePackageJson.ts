import { PackageJson } from "./types";

export function initializePackageJson(
    options: PackageJson = {}
) {

    

    return {
        type: "module",
        ...options
    } satisfies PackageJson
}

