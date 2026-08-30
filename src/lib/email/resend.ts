import "server-only";
import { Resend } from "resend";
import { SUPPORT_EMAIL } from "@/lib/site-config";

let resend: Resend | undefined;

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY não está definido.");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

export async function sendIconPackPurchaseEmail(input: {
  to: string;
  packName: string;
  downloadUrl: string;
}): Promise<void> {
  await getResend().emails.send({
    from: getFromAddress(),
    to: input.to,
    subject: `A sua compra: ${input.packName}`,
    html: `
      <p>Obrigado pela sua compra!</p>
      <p><strong>${input.packName}</strong> já está pronto a descarregar:</p>
      <p><a href="${input.downloadUrl}">${input.downloadUrl}</a></p>
      <p>Este link é válido por 7 dias. Se tiver uma conta (ou criar uma com
      este mesmo email em /login), pode voltar a descarregar a qualquer altura
      em "A minha conta".</p>
    `,
  });
}

export async function sendContactMessage(input: {
  name: string;
  fromEmail: string;
  message: string;
}): Promise<void> {
  // NOTE: Resend's shared "onboarding@resend.dev" sender can only deliver to
  // the Resend account's own verified email until a custom domain is
  // verified (resend.com/domains) — NOT to SUPPORT_EMAIL if it differs, and
  // NOT to arbitrary customer addresses (this also currently blocks real
  // purchase confirmation emails in sendIconPackPurchaseEmail above). Switch
  // this back to SUPPORT_EMAIL once a domain is verified.
  const notificationRecipient = process.env.RESEND_NOTIFICATION_EMAIL || SUPPORT_EMAIL;

  await getResend().emails.send({
    from: getFromAddress(),
    to: notificationRecipient,
    replyTo: input.fromEmail,
    subject: `Novo contacto de ${input.name}`,
    html: `
      <p><strong>Nome:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.fromEmail)}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>
    `,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
