import type { PackageManager } from "../types";

export const getPkgManager = (): PackageManager => {
    const userAgent = process.env.npm_config_user_agent;

    if (userAgent) {
        if (userAgent.startsWith("yarn")) {
            return "yarn";
        } else if (userAgent.startsWith("pnpm")) {
            return "pnpm";
        } else if (userAgent.startsWith("bun")) {
            return "bun";
        }
    }
    
    return "npm";
}; 