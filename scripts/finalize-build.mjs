import {
  access,
  copyFile,
  cp,
  mkdir,
  readdir
} from "node:fs/promises";
import path from "node:path";

const projectDir = process.cwd();
const distDir = path.join(projectDir, "dist");
const clientDir = path.join(distDir, "client");
const serverDir = path.join(distDir, "server");

async function findWorkerEntry(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "client" || entry.name === "server") {
      continue;
    }

    const candidate = path.join(directory, entry.name, "index.js");
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Keep looking in the remaining build environments.
    }
  }

  throw new Error("Cloudflare Worker build entry was not generated.");
}

await mkdir(clientDir, { recursive: true });
await cp(path.join(projectDir, "img"), path.join(clientDir, "img"), {
  recursive: true,
  force: true
});

for (const filename of ["index.html", "styles.css", "app.js"]) {
  await copyFile(path.join(projectDir, filename), path.join(clientDir, filename));
}

const workerEntry = await findWorkerEntry(distDir);
await mkdir(serverDir, { recursive: true });
await copyFile(workerEntry, path.join(serverDir, "index.js"));
