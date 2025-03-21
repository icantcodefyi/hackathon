import { execSync } from "child_process";
import chalk from "chalk";

export const initializeGit = (projectDir: string): boolean => {
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
        try {
            execSync(`git init --initial-branch=${branchName}`, { cwd: projectDir });
        } catch {
            execSync('git init', { cwd: projectDir });
            execSync(`git checkout -b ${branchName}`, { cwd: projectDir });
        }
        execSync('git add .', { cwd: projectDir });
        execSync('git commit -m "Initial commit"', { cwd: projectDir });
        console.log(chalk.green("Successfully initialized and staged git repository"));
        return true;
    }

    return false;
}; 