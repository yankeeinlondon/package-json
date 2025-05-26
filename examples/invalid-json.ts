import {parsePackageJson} from "~/index";

try {
    const foo = parsePackageJson("examples/test");
} catch (err) {
    console.log(err)
}

