import fs from "node:fs/promises";
import path from "node:path";
import ora from "ora";

export const createProject = async (projectName: string, templateDir: string, projectDir: string) => {
    const spinner = ora(`Boilerplating ${projectName}...`).start();
    
    try {
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