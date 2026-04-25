import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Layout } from '../../components/Layout';

/**
 * Страница, на которую NOWPayments возвращает пользователя после
 * успешной оплаты (success_url в createNowPaymentsInvoice_).
 * IPN-уведомление о статусе платежа приходит асинхронно на Apps Script.
 */
export default function ThankYou() {
  return (
    <Layout title="Thank you" description="IPAS membership application received">
      <div className="container-p py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-brand-gold/30
                        bg-surface-muted p-8 text-center shadow-glow">
          <CheckCircle2 size={56} className="mx-auto text-brand-gold" />
          <h1 className="mt-4 font-display text-3xl sm:text-4xl">
            Thank you for your application
          </h1>
          <p className="mt-3 text-sm text-fg-muted">
            Your payment is being confirmed on the blockchain. Once received,
            the IPAS Council will review your credentials and contact you within
            3–5 working days.
          </p>
          <Link href="/" className="btn-primary mt-6 justify-center">
            Back to home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
