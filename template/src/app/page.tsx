import Link from "next/link";
import { UserProfile } from "~/components/user-profile";
import { LoginButton } from "~/components/login";
import { headers } from "next/headers";
import { auth } from "~/server/auth";
import { Posts } from "~/components/posts";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="container relative mx-auto px-4 py-16 sm:py-24">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              Build Your Next
              <span className="bg-gradient-to-r from-[hsl(280,100%,70%)] to-[hsl(280,100%,50%)] bg-clip-text text-transparent">
                {" "}Hackathon Project
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/70">
              A modern full-stack starter with Prisma, Zustand, and React Query. Ship faster with the T3 Stack.
            </p>
            <div className="mt-8 flex items-center gap-4">
              {session?.user ? (
                <UserProfile user={session.user} />
              ) : (
                <LoginButton />
              )}
              <Link
                href="https://github.com/t3-oss/create-t3-app"
                target="_blank"
                className="rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/20"
              >
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Posts Section */}
          <div className="lg:col-span-2">
            {session?.user ? (
              <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                <Posts />
              </div>
            ) : (
              <div className="rounded-xl bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                  <h2 className="text-2xl font-bold">Ready to Build?</h2>
                  <div className="flex flex-col items-center space-y-4">
                    <LoginButton />
                    <p className="text-sm text-white/60">Sign in to start building your next project</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-xl font-semibold">Get Started</h2>
              <div className="space-y-4">
                <Link
                  className="block rounded-lg bg-white/10 p-4 text-white transition-all hover:bg-white/20 hover:shadow-lg hover:shadow-white/5"
                  href="https://create.t3.gg/en/usage/first-steps"
                  target="_blank"
                >
                  <h3 className="text-lg font-semibold">First Steps →</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Set up your database and authentication
                  </p>
                </Link>
                <Link
                  className="block rounded-lg bg-white/10 p-4 text-white transition-all hover:bg-white/20 hover:shadow-lg hover:shadow-white/5"
                  href="https://create.t3.gg/en/introduction"
                  target="_blank"
                >
                  <h3 className="text-lg font-semibold">Documentation →</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Learn more about the T3 Stack
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
