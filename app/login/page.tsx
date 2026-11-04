import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safe = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  if (await getUser()) redirect(safe);
  return (
    <div className="container-x py-10 lg:py-16">
      <div className="max-w-md mx-auto card p-6 sm:p-8">
        <LoginForm next={safe} />
      </div>
    </div>
  );
}
