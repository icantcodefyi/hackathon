#!/usr/bin/env node
import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import { getPkgManager } from "./utils/getPkgManager";
import { getProjectName, shouldInitGit, shouldInstallDeps } from "./cli/prompts";
import { createProject } from "./services/project-service";
import { initializeGit } from "./services/git-service";
import { runInstallCommand } from "./services/package-installer";

const TITLE = `
______  __            ______        ___________                    _______                 
___  / / /_____ _________  /_______ __  /___  /______________      ___    |_______________ 
__  /_/ /_  __ \`/  ___/_  //_/  __ \`/  __/_  __ \\  __ \\_  __ \\     __  /| |__  __ \\__  __ \\
_  __  / / /_/ // /__ _  ,<  / /_/ // /_ _  / / / /_/ /  / / /     _  ___ |_  /_/ /_  /_/ /
/_/ /_/  \\__,_/ \\___/ /_/|_| \\__,_/ \\__/ /_/ /_/\\____//_/ /_/      /_/  |_|  .___/_  .___/ 
                                                                          /_/     /_/      
`;

(async () => {
    const pkgManager = getPkgManager();
    console.log(chalk.green(TITLE));

    const projectName = await getProjectName();
    const shouldGitInit = await shouldInitGit();
    const shouldInstall = await shouldInstallDeps(pkgManager);

    const templateDir = path.join(__dirname, "template");
    const projectDir = path.join(__dirname, projectName);

    // Create project files
    const projectCreated = await createProject(projectName, templateDir, projectDir);
    if (!projectCreated) {
        process.exit(1);
    }

    // Initialize git if requested
    if (shouldGitInit) {
        initializeGit(projectDir);
    }

    // Install dependencies if requested
    if (shouldInstall) {
        const installSpinner = await runInstallCommand(pkgManager, projectDir);
        (installSpinner ?? ora()).succeed(chalk.green("Successfully installed dependencies!\n"));
    }

    // Print success message
    console.log(chalk.blue("\n🎉 Project created successfully! Here's how to get started:\n"));
    console.log(chalk.white(`1. Navigate to your project directory:`));
    console.log(chalk.gray(`   cd "${projectName}"\n`));
    console.log(chalk.white(`2. Start the development server:`));
    console.log(chalk.gray(`   ${pkgManager}${pkgManager === "npm" ? " run" : ""} dev\n`));
    console.log(chalk.white(`3. Open your browser and visit:`));
    console.log(chalk.gray(`   http://localhost:3000\n`));
    console.log(chalk.white(`4. Start editing! The main page is at:`));
    console.log(chalk.gray(`   src${path.sep}app${path.sep}page.tsx\n`));
    console.log(chalk.blue("Happy coding!\n"));
})(); 