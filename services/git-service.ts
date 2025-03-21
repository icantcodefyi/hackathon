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

    // Check if there are changes to commit
    const hasChangesToCommit = () => {
        try {
            const status = execSync('git status --porcelain', { cwd: projectDir }).toString();
            return status.length > 0;
        } catch {
            return false;
        }
    };

    if (isGitInstalled()) {
        const branchName = getDefaultBranch();
        try {
            execSync(`git init --initial-branch=${branchName}`, { cwd: projectDir });
        } catch {
            // If --initial-branch flag fails, use the old method
            execSync('git init', { cwd: projectDir });
            try {
                execSync(`git checkout -b ${branchName}`, { cwd: projectDir });
            } catch {
                // Branch might already exist, try switching to it
                execSync(`git checkout ${branchName}`, { cwd: projectDir });
            }
        }
        
        execSync('git add .', { cwd: projectDir });
        
        if (hasChangesToCommit()) {
            execSync('git commit -m "Initial commit"', { cwd: projectDir });
            console.log(chalk.green("Successfully initialized and staged git repository"));
        } else {
            console.log(chalk.yellow("Git repository already initialized with no changes to commit"));
        }
        return true;
    }

    return false;
}; 