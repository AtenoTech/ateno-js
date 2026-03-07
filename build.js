import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const src = path.join(__dirname, "src")
const dist = path.join(__dirname, "dist")

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true })
}

for (const file of fs.readdirSync(src)) {
  const source = path.join(src, file)
  const target = path.join(dist, file)
  fs.copyFileSync(source, target)
}

console.log("SDK build complete")