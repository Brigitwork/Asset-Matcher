import { Link } from "wouter";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#040404] text-white selection:bg-pink-500/30 font-sans p-6 md:p-24">
      <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
        <Link href="/" className="text-white/50 hover:text-white transition flex items-center gap-2 group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          Back to Drop
        </Link>
        
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50 font-bold">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Privacy Policy</h1>
        </div>

        <div className="space-y-8 text-white/70 leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white/90">Information We Collect</h2>
            <p>When you join our founders list, we collect your email address and optional location information. This data is used solely to communicate about your preorder and future drops.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white/90">How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Send pricing details and payment instructions to founders list members</li>
              <li>Provide order updates and shipping notifications</li>
              <li>Announce future Tampa Army drops (you can unsubscribe anytime)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white/90">Data Storage</h2>
            <p>Your information is stored securely and is never sold to third parties. We may use trusted service providers for email delivery and payment processing.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white/90">Your Rights</h2>
            <p>You can request deletion of your data at any time by contacting us. We will remove your information from our systems within 30 days of your request.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white/90">Contact</h2>
            <p>For privacy-related questions, reach us at <a href="mailto:support@brigit.work" className="text-white hover:text-pink-400 transition underline underline-offset-4">support@brigit.work</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
