"use client"
import { signIn } from "~/lib/auth-client";

export const LoginButton = () => {
    return (
        <button
            onClick={() => signIn.social({ provider: "discord" })}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        >
            Log In
        </button>
    );
};