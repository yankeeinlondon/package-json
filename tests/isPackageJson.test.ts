import { describe, it, expect } from "vitest";
import { isPackageJson } from "~/isPackageJson";

// tests/isPackageJson.test.ts

describe("isPackageJson", () => {
    it("accepts a minimal valid package.json object", () => {
        const obj = { name: "foo", version: "1.0.0" };
        expect(isPackageJson(obj)).toBe(true);
    });

    it("accepts a valid package.json string", () => {
        const str = JSON.stringify({ name: "foo", version: "1.0.0" });
        expect(isPackageJson(str)).toBe(true);
    });

    it("rejects if required properties are missing", () => {
        const obj = { name: "foo" };
        expect(isPackageJson(obj, "version")).toBe(false);
    });

    it("accepts if all required properties are present", () => {
        const obj = { name: "foo", version: "1.0.0" };
        expect(isPackageJson(obj, "name", "version")).toBe(true);
    });

    it("rejects if a string property is not a string", () => {
        const obj = { name: 123, version: "1.0.0" };
        expect(isPackageJson(obj)).toBe(false);
    });

    it("rejects if a boolean property is not a boolean", () => {
        const obj = { name: "foo", version: "1.0.0", private: "yes" };
        expect(isPackageJson(obj)).toBe(false);
    });

    it("accepts if a boolean property is a boolean", () => {
        const obj = { name: "foo", version: "1.0.0", private: true };
        expect(isPackageJson(obj)).toBe(true);
    });

    it("accepts if a STR_ARRAY property is an array of strings", () => {
        const obj = { name: "foo", version: "1.0.0", keywords: ["a", "b"] };
        expect(isPackageJson(obj)).toBe(true);
    });

    it("rejects if a STR_ARRAY property is not an array of strings", () => {
        const obj = { name: "foo", version: "1.0.0", keywords: [1, 2] };
        expect(isPackageJson(obj)).toBe(false);
    });

    it("accepts if a REC_PROPS property is an object", () => {
        const obj = { name: "foo", version: "1.0.0", scripts: { build: "tsc" } };
        expect(isPackageJson(obj)).toBe(true);
    });

    it("rejects if a REC_PROPS property is not an object", () => {
        const obj = { name: "foo", version: "1.0.0", scripts: "tsc" };
        expect(isPackageJson(obj)).toBe(false);
    });

    it("accepts if STR_OR_STR_ARRAY is a string", () => {
        const obj = { name: "foo", version: "1.0.0", license: "MIT" };
        expect(isPackageJson(obj)).toBe(true);
    });

    it("accepts if STR_OR_STR_ARRAY is an array of strings", () => {
        const obj = { name: "foo", version: "1.0.0", license: ["MIT", "Apache-2.0"] };
        expect(isPackageJson(obj)).toBe(true);
    });

    it("rejects if STR_OR_STR_ARRAY is an array of non-strings", () => {
        const obj = { name: "foo", version: "1.0.0", license: [1, 2] };
        expect(isPackageJson(obj)).toBe(false);
    });

    it("accepts unknown extra properties", () => {
        const obj = { name: "foo", version: "1.0.0", foo: 123 };
        expect(isPackageJson(obj)).toBe(true);
    });

    it("rejects invalid JSON string", () => {
        expect(isPackageJson("{name:foo}")).toBe(false);
    });

    it("rejects null", () => {
        expect(isPackageJson(null)).toBe(false);
    });

    it("rejects undefined", () => {
        expect(isPackageJson(undefined)).toBe(false);
    });

    it("rejects numbers", () => {
        expect(isPackageJson(123)).toBe(false);
    });

    it("rejects arrays", () => {
        expect(isPackageJson([])).toBe(false);
    });
});
