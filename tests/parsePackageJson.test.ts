import { describe, it, expect, vi, afterEach } from "vitest";
import { parsePackageJson } from "../src/parsePackageJson";
import { InvalidFile, WrongType } from "../src/error";

// Mock fs at the top-level
vi.mock("fs", () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn()
}));

import * as fs from "fs";

describe("parsePackageJson", () => {
    const validPkg = { name: "foo", version: "1.0.0" };
    const validPkgStr = JSON.stringify(validPkg);

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("returns parsed object for valid package.json", () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.readFileSync as any).mockReturnValue(validPkgStr);

        const result = parsePackageJson("/fake/path");
        expect(result).toEqual(validPkg);
    });

    it("returns empty object if file does not exist", () => {
        (fs.existsSync as any).mockReturnValue(false);

        const result = parsePackageJson("/fake/path");
        expect(result).toEqual({});
    });

    it("throws InvalidFile if JSON is invalid", () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.readFileSync as any).mockReturnValue("{ invalid json }");

        expect(() => parsePackageJson("/fake/path")).toThrowError(`There was a package.json file in "/fake/path" but it could not be parsed by JSON!`);
    });

    it("throws WrongType if types are wrong", () => {
        const wrongPkg = { name: 123, version: "1.0.0" };
        (fs.existsSync as any).mockReturnValue(true);
        (fs.readFileSync as any).mockReturnValue(JSON.stringify(wrongPkg));

        expect(() => parsePackageJson("/fake/path")).toThrowError(`The package.json file in "/fake/path" was parsed but the types of certain properties were invalid!`);
    });
});
