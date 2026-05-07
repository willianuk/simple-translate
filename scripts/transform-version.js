const fs = require("fs")
const path = require("path")

const packagePath = path.join(__dirname, "..", "package.json")

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
const originalVersion = packageJson.version

let transformedVersion = originalVersion

const prereleaseMatch = originalVersion.match(/^(\d+\.\d+\.\d+)-.+$/)

if (prereleaseMatch) {
    const [, baseVersion] = prereleaseMatch
    transformedVersion = baseVersion
    console.log(
        `[transform-version] ${originalVersion} -> ${transformedVersion}`
    )

    packageJson.version = transformedVersion
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4) + "\n")

    console.log("[transform-version] ✓ Version transformed successfully")
} else {
    console.log(
        `[transform-version] Version ${originalVersion} does not need transformation`
    )
}
