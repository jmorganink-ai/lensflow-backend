import { spawn } from "node:child_process";

const corepack = process.platform === "win32" ? "corepack.cmd" : "corepack";

function run(args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(corepack, ["pnpm@10.19.0", ...args], {
      env: { ...process.env, ...env },
      shell: false,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed: corepack pnpm@10.19.0 ${args.join(" ")}`));
      }
    });
  });
}

await run(["install", "--no-frozen-lockfile", "--prod=false"]);
await run(["--filter", "@workspace/api-server", "run", "build"]);
await run(["--filter", "@workspace/lensflow-site", "run", "build"], {
  PORT: "3000",
  BASE_PATH: "/",
});
await run(["--filter", "@workspace/lensflow", "run", "build"], {
  PORT: "3001",
  BASE_PATH: "/pipeline/",
});
