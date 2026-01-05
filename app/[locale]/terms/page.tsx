import Link from "next/link";

export default async function TermsPage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-black text-white/80 font-sans">
            <div className="max-w-2xl space-y-8">
                <Link href="/" className="text-sm uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
                    ← Return to Moment Zero
                </Link>

                <h1 className="text-4xl md:text-5xl font-display text-white mb-8">Terms & Conditions</h1>

                <div className="space-y-6 text-sm md:text-base leading-relaxed opacity-70">
                    <p>
                        <strong>1. The Moment.</strong> Moment Zero is a digital experience designed to capture intentions for the future. By using this service, you agree to participate in this shared global moment responsibly.
                    </p>
                    <p>
                        <strong>2. Data Preservation.</strong> We use local storage and cloud databases to preserve your capsule. While we strive for permanence, time is unpredictable. We do our best to ensure your wish reaches the future.
                    </p>
                    <p>
                        <strong>3. Cookies.</strong> We use cookies solely to remember your identity and theme preferences across sessions. No tracking for advertising is performed.
                    </p>
                    <p>
                        <strong>4. Content.</strong> You retain ownership of your wish. By posting publicly, you grant us a license to display your anonymous wish as part of the global aggregate (e.g., "Someone from US locked a wish").
                    </p>
                    <p>
                        <strong>5. Contact.</strong> For inquiries, reach out through our official channels.
                    </p>
                </div>

                <div className="pt-8 border-t border-white/10 text-xs opacity-40">
                    Last updated: January 2026
                </div>
            </div>
        </div>
    );
}
