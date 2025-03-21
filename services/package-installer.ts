import { execa } from "execa";
import ora, { type Ora } from "ora";
import type { ExecOptions, PackageManager } from "../types";

const execWithSpinner = async (
    projectDir: string,
    pkgManager: string,
    options: ExecOptions
) => {
    const { onDataHandle, args = ["install"], stdout = "pipe" } = options;

    const spinner = ora(`Running ${pkgManager} install...`).start();
    const subprocess = execa(pkgManager, args, { cwd: projectDir, stdout });

    await new Promise<void>((res, rej) => {
        if (onDataHandle) {
            subprocess.stdout?.on("data", onDataHandle(spinner));
        }

        void subprocess.on("error", (e) => rej(e));
        void subprocess.on("close", () => res());
    });

    return spinner;
};

export const runInstallCommand = async (
    pkgManager: PackageManager,
    projectDir: string
): Promise<Ora | null> => {
    switch (pkgManager) {
        case "npm":
            await execa(pkgManager, ["install"], {
                cwd: projectDir,
                stderr: "inherit",
            });
            return null;
        case "pnpm":
            return execWithSpinner(projectDir, pkgManager, {
                onDataHandle: (spinner) => (data) => {
                    const text = data.toString();
                    if (text.includes("Progress")) {
                        spinner.text = text.includes("|")
                            ? text.split(" | ")[1] ?? ""
                            : text;
                    }
                },
            });
        case "yarn":
            return execWithSpinner(projectDir, pkgManager, {
                onDataHandle: (spinner) => (data) => {
                    spinner.text = data.toString();
                },
            });
        case "bun":
            return execWithSpinner(projectDir, pkgManager, { stdout: "ignore" });
        default:
            return null;
    }
}; 