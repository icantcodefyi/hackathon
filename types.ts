import { type Ora } from "ora";

export interface ExecOptions {
    args?: string[];
    stdout?: "pipe" | "ignore" | "inherit";
    onDataHandle?: (spinner: Ora) => (data: Buffer) => void;
}

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun"; 