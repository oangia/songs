const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

async function build(inputFiles, outputFile) {
    try {
        // Read and combine files
        let combined = "";

        for (const file of inputFiles) {
            const filePath = path.resolve(file);
            const content = fs.readFileSync(filePath, "utf8");
            combined += content + "\n";
        }

        // Minify
        const result = await minify(combined);

        if (result.error) {
            console.error("Minify error:", result.error);
            process.exit(1);
        }

        // Ensure dist folder exists
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });

        // Write output
        fs.writeFileSync(outputFile, result.code, "utf8");

        console.log("Build successful:", outputFile);
    } catch (err) {
        console.error("Build failed:", err);
        process.exit(1);
    }
}

build([
    "js/utils/loading.js",
    "js/utils/toast.js",
    "js/utils/cookie.js",
    "js/event.js",
    "js/auth.js",
    "js/validator.js",
    "js/CUrl.js",
    "js/form.js",
    "js/app.js"
], "public/js/bundle.min.js");

build([
    "js/firebase/firebase.js"
], "public/js/firebase.min.js");
