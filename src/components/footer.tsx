import Link from "next/link";

export function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="py-8 md:px-8 border-t bg-background">
            <div className="container flex flex-col items-center justify-center gap-6">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
                    <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
                    <Link href="/feedback" className="hover:text-foreground transition-colors">Feedback</Link>
                    <Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
                </div>
                 <p className="text-center text-sm leading-loose text-muted-foreground">
                    &copy; {year} PeaceMind Sanctuary. All Rights Reserved.
                </p>
                 <p className="text-center text-xs text-muted-foreground/80 max-w-3xl">
                    <strong>Disclaimer:</strong> PeaceMind Sanctuary is a mental wellness support tool and does not provide medical advice, diagnosis, or treatment. It is not a substitute for professional care. If you are in crisis, please contact a helpline or a qualified professional immediately.
                </p>
            </div>
        </footer>
    )
}
