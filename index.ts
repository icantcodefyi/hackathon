import { text, confirm } from "@clack/prompts";
import chalk from "chalk";
import fs from "node:fs/promises";
import path from "node:path";
import ora, { type Ora } from "ora";
import { execSync } from "child_process";
import { execa } from "execa";
import { getPkgManager } from "./utils/getPkgManager";

const TITLE = `
______  __            ______        ___________                    _______                 
___  / / /_____ _________  /_______ __  /___  /______________      ___    |_______________ 
__  /_/ /_  __ \`/  ___/_  //_/  __ \`/  __/_  __ \\  __ \\_  __ \\     __  /| |__  __ \\__  __ \\
_  __  / / /_/ // /__ _  ,<  / /_/ // /_ _  / / / /_/ /  / / /     _  ___ |_  /_/ /_  /_/ /
/_/ /_/  \\__,_/ \\___/ /_/|_| \\__,_/ \\__/ /_/ /_/\\____//_/ /_/      /_/  |_|  .___/_  .___/ 
                                                                          /_/     /_/      
`;

const pkgManager = getPkgManager()

console.log(chalk.green(TITLE));

const projectName = await text({
    message: "What will your project be called?",
    validate: (value) => {
        if (!value) return "Please enter a project name";
        return value.toLowerCase().replace(/\s+/g, "-") === value
            ? undefined
            : "Project name must be lowercase with hyphens for spaces";
    },
    placeholder: "my-project",
}) as string;

const initalizeGit = await confirm({
    message: "Should we initialize a Git repository and stage the changes?",
    initialValue: true,
});

const installPkg = await confirm({
    message: `Should we run '${pkgManager}${pkgManager === "yarn" ? "'" : " install'"} for you?`,
    initialValue: false,
});

const execWithSpinner = async (
    projectDir: string,
    pkgManager: string,
    options: {
        args?: string[];
        stdout?: "pipe" | "ignore" | "inherit";
        onDataHandle?: (spinner: Ora) => (data: Buffer) => void;
    }
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

const runInstallCommand = async (
    pkgManager: string,
    projectDir: string
): Promise<Ora | null> => {
    switch (pkgManager) {
        // When using npm, inherit the stderr stream so that the progress bar is shown
        case "npm":
            await execa(pkgManager, ["install"], {
                cwd: projectDir,
                stderr: "inherit",
            });
            return null;
        // When using yarn or pnpm, use the stdout stream and ora spinner to show the progress
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
        // When using bun, the stdout stream is ignored and the spinner is shown
        case "bun":
            return execWithSpinner(projectDir, pkgManager, { stdout: "ignore" });
        default:
            return null;
    }
};

(async () => {
    const template = await fs.readdir(path.join(__dirname, "template"));

    const spinner = ora(`Boilerplating ${projectName}...`).start();
    for (const file of template) {
        await fs.cp(path.join(__dirname, "template", file), path.join(__dirname, projectName, file), { recursive: true });
    }

    const packageJson = await fs.readFile(path.join(__dirname, projectName, "package.json"), "utf-8");
    const packageJsonData = JSON.parse(packageJson);
    packageJsonData.name = projectName;

    await fs.writeFile(path.join(__dirname, projectName, "package.json"), JSON.stringify(packageJsonData, null, 2));

    spinner.succeed("Successfully created project files");

    if (initalizeGit) {
        const projectDir = path.join(__dirname, projectName);
        
        // Check if git is installed
        const isGitInstalled = () => {
            try {
                execSync("git --version", { cwd: projectDir });
                return true;
            } catch {
                console.warn(chalk.yellow("Git is not installed. Skipping Git initialization."));
                return false;
            }
        };

        // Get default branch name
        const getDefaultBranch = () => {
            const stdout = execSync("git config --global init.defaultBranch || echo main")
                .toString()
                .trim();
            return stdout;
        };

        if (isGitInstalled()) {
            const branchName = getDefaultBranch();
            execSync(`git init --initial-branch=${branchName}`, { cwd: projectDir });
            execSync('git add .', { cwd: projectDir });
            execSync('git commit -m "Initial commit"', { cwd: projectDir });
            console.log(chalk.green("Successfully initialized and staged git repository"));
        }
    }

    if (installPkg) {
        const projectDir = path.join(__dirname, projectName);
        const installSpinner = await runInstallCommand(pkgManager, projectDir);
        (installSpinner ?? ora()).succeed(chalk.green("Successfully installed dependencies!\n"));
    }

    console.log(chalk.blue("\n🎉 Project created successfully! Here's how to get started:\n"));
    console.log(chalk.white(`1. Navigate to your project directory:`));
    console.log(chalk.gray(`   cd ${projectName}\n`));
    console.log(chalk.white(`2. Start the development server:`));
    console.log(chalk.gray(`   ${pkgManager} dev\n`));
    console.log(chalk.white(`3. Open your browser and visit:`));
    console.log(chalk.gray(`   http://localhost:3000\n`));
    console.log(chalk.white(`4. Start editing! The main page is at:`));
    console.log(chalk.gray(`   src/app/page.tsx\n`));
    console.log(chalk.blue("Happy coding!\n"));
})();
