# package-json

A lightweight CJS/ESM library for working with `package.json` files. Includes:

- `PackageJson` - a type which represents the key/value pairs of a `package.json` file
- `isPackageJson()` - type guard for validating content as being a valid `package.json` format.
- `parsePackageJson()` - attempts to load the package.json file from a specified directory, reports appropriate errors when encountered, validates and types results on success
- `initializePackageJson()` - interogates the system to pre-populate sensible defaults for a new `package.json` while allowing programatic overrides.


