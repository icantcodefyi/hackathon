import fs from "node:fs/promises";
import path from "node:path";
import ora from "ora";

export const createProject = async (projectName: string, templateDir: string, projectDir: string) => {
    const spinner = ora(`Boilerplating ${projectName}...`).start();
    
    try {
        // Check if directory exists and is not empty
        try {
            const files = await fs.readdir(projectDir);
            if (files.length > 0) {
                spinner.fail(`Project directory ${projectDir} is not empty. Please choose an empty directory.`);
                return false;
            }
        } catch (error) {
            // Directory doesn't exist, which is fine
            await fs.mkdir(projectDir, { recursive: true });
        }

        const template = await fs.readdir(templateDir);

        for (const file of template) {
            await fs.cp(
                path.join(templateDir, file), 
                path.join(projectDir, file), 
                { recursive: true }
            );
        }

        const packageJsonPath = path.join(projectDir, "package.json");
        const packageJson = await fs.readFile(packageJsonPath, "utf-8");
        const packageJsonData = JSON.parse(packageJson);
        packageJsonData.name = projectName;

        await fs.writeFile(packageJsonPath, JSON.stringify(packageJsonData, null, 2));

        spinner.succeed("Successfully created project files");
        return true;
    } catch (error) {
        spinner.fail(`Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`);
        return false;
    }
}; 