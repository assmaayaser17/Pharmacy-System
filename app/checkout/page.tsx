import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = { title: "إتمام الطلب" };

export default async function CheckoutPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/checkout");
  const d = db();
  const addresses = d.addresses.filter((a) => a.userId === user.id);
  const prescriptions = d.prescriptions.filter((p) => p.userId === user.id && p.status !== "rejected").reverse();
  return <CheckoutClient user={{ name: user.name, phone: user.phone }} addresses={addresses} prescriptions={prescriptions} />;
}
