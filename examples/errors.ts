import {parsePackageJson} from "~/index";

try {
    const foo = parsePackageJson("examples/unparsable");
} catch (err) {
    console.log(err)
}

console.log();
console.log(`--------------------------`);
console.log();

try {
    parsePackageJson("examples/wrong-type");
} catch (err) {
    console.log(err)
}
