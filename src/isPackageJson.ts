import { If, indexOf, isArray, IsObject, isObject, isString, PackageJson } from "inferred-types";
import { Json } from "./types";

const REC_PROPS = [
    "scripts",
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
    "resolutions",
    "directories",
    "exports",
    "pnpm",
    "publishConfig",
    "prettier",
    "eslintConfig"
];

const STR_ARRAY = [
    "keywords",
    "os",
    "cpu",
    "files"
];

const BOOL_PROP = [
    "private"
]

const STR_PROP = [
    "name",
    "main",
    "module",
    "description",
    "version",
    "types",
    "style"
]

const STR_OR_STR_ARRAY = [
    "man",
    "license"
]

/**
 * **isPackageJson**`(val, [...required])`
 * 
 * type guard which tests that `val` is either an object in the
 * shape of a `PackageJson` or a `string` which can be _parsed_
 * into a `PackageJson` structure.
 * 
 * - you may optionally express the props in the file which you
 * require to be present.
 * - beyond any "required props", validation is done on the properties
 * expressed being of the right type
 */
export function isPackageJson<
    T,
    P extends (keyof PackageJson & string)[]
>(
    val: T,
    ...required: P
): val is IsObject<T> extends true
    ? PackageJson & T
    : Json<PackageJson> & T
{
    if (isString(val) || isObject(val)) {
        let obj: Object;
        if (isString(val)) {
            try {
                obj = JSON.parse(val);
                if (!isObject(obj)) {
                    return false;
                }
            } catch {
                return false;
            }
        } else {
            obj = val;
        }
        type Key = (keyof typeof obj) & string;
        const keys = Object.keys(obj) as Key[];

        if (!required.every(i => keys.includes(i as Key))) {
            return false;
        }
        
        if(
            !STR_PROP.every(
                i => !keys.includes(i as Key) || typeof indexOf(obj, i) === "string"
            ) 
            || !BOOL_PROP.every(
                i => !keys.includes(i as Key) || typeof indexOf(obj, i) === "boolean"
            )
            || !REC_PROPS.every(
                i => !keys.includes(i as Key) || isObject(indexOf(obj, i))
            )
            || !STR_ARRAY.every(
                i => !keys.includes(i as Key) 
                    || (
                        isArray(indexOf(obj, i)) 
                        && (indexOf(obj, i) as unknown as unknown[]).every(i => isString(i))
                    )
            )
            || !STR_OR_STR_ARRAY.every(
                i => !keys.includes(i as Key) 
                    || isString(indexOf(obj, i)) 
                    || (
                        isArray(indexOf(obj, i)) 
                        && (indexOf(obj, i) as unknown as unknown[]).every(i => isString(i))
                    )        
            )
        ) {
            return false;
        }

        return true;
        
    }

    return false;
}
