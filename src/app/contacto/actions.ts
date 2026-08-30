"use server";

import { redirect } from "next/navigation";
import { sendContactMessage } from "@/lib/email/resend";

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    redirect("/contacto?error=1");
  }

  try {
    await sendContactMessage({ name, fromEmail: email, message });
  } catch (err) {
    console.error("Falha ao enviar mensagem de contacto:", err);
    redirect("/contacto?error=1");
  }

  redirect("/contacto?sent=1");
}
