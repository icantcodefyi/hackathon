import { text, confirm, isCancel } from "@clack/prompts";
import chalk from "chalk";
import type { PackageManager } from "../types";

export const getProjectName = async (): Promise<string> => {
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

    if (!projectName || projectName.length === 0 || isCancel(projectName)) {
        console.log(chalk.red("❌ Project name is required. Exiting..."));
        process.exit(1);
    }

    return projectName;
};

export const shouldInitGit = async (): Promise<boolean> => {
    const initalizeGit = await confirm({
        message: "Should we initialize a Git repository and stage the changes?",
        initialValue: true,
    });

    if (isCancel(initalizeGit)) {
        console.log(chalk.red("❌ Git initialization cancelled. Exiting..."));
        process.exit(1);
    }

    return initalizeGit;
};

export const shouldInstallDeps = async (pkgManager: PackageManager): Promise<boolean> => {
    const installPkg = await confirm({
        message: `Should we run '${pkgManager}${pkgManager === "yarn" ? "'" : " install'"} for you?`,
        initialValue: false,
    });

    if (isCancel(installPkg)) {
        console.log(chalk.red("❌ Dependency installation cancelled. Exiting..."));
        process.exit(1);
    }

    return installPkg;
}; 