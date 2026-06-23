import { Zap } from 'lucide-react';

const LINKS = ['Privacy Policy', 'Terms of Use', 'Security'];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-fm-border px-6 py-8 md:px-8">
      {/* CHANGED: Swapped `flex` for `grid md:grid-cols-3` on desktop. 
          This guarantees the navigation block occupies the exact mathematical center of the footer.
      */}
      <div className="mx-auto grid w-full max-w-none grid-cols-1 items-center justify-items-center gap-6 md:grid-cols-3">

        {/* Left Column (Left-aligned on desktop) */}
        <a href="#" className="flex items-center gap-2 md:justify-self-start">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-fm-orange">
            <Zap className="h-3.5 w-3.5 fill-fm-bg text-fm-bg" strokeWidth={0} />
          </span>
          <span className="text-sm font-semibold text-fm-white">
            Finance Master
          </span>
        </a>

        {/* Middle Column (Centered everywhere) */}
        <nav className="flex flex-wrap items-center justify-center gap-6 md:justify-self-center">
          {LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-fm-silver transition-colors hover:text-fm-white"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right Column (Right-aligned on desktop) */}
        <p className="text-sm text-fm-silver/70 md:justify-self-end">
          © 2026 Finance Master Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}