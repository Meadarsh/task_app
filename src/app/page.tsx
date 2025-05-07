"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Task App Logo"
          width={180}
          height={38}
          priority
        />

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome to the Task Management App
        </h1>

        <p className="text-muted-foreground max-w-xl text-base sm:text-lg">
          Organize your work, manage your team, and track progress in real-time. Designed for productivity, built with modern tools.
        </p>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Button onClick={() => router.push("/login")}>
            Login to Continue
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              window.open("https://github.com/Meadarsh/task_app", "_blank")
            }
          >
            View on GitHub
          </Button>
        </div>
      </main>

      <footer className="row-start-3 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Task Management App. All rights reserved.
      </footer>
    </div>
  );
}
