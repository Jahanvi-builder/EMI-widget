import { EmiChatWidget } from "@/components/emi-chat-widget";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-background px-6 py-12 text-foreground">
      <section className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
        <article className="rounded-2xl border bg-card p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Sofas & Sectionals
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Osaka Sectional Sofa</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Premium Fabric • 5-Seater • 280cm • 4.8 rating (214)
          </p>
          <div className="mt-5 text-3xl font-semibold tracking-tight">₹74,999</div>
          <p className="mt-1 text-sm text-muted-foreground line-through">₹89,999</p>
          <div className="mt-6 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
            This demo keeps focus only on the EMI widget interaction.
          </div>
        </article>

        <aside className="space-y-4">
          <EmiChatWidget />
        </aside>
      </section>
    </main>
  );
}
