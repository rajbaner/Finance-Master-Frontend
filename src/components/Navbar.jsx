import { Zap } from 'lucide-react';

const NAV_LINKS = ['Home', 'About', 'Services'];

/**
 * Navbar
 * Pixel-matched to reference: pill-shaped nav with active
 * "Home" state on a translucent white pill, logo at left,
 * dark "Contact Us" button at right.
 */
export default function Navbar() {
  return (
    <header className="relative z-20 flex items-center justify-between px-8 py-6 md:px-16">
      {/* Logo */}
      <a href="#" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fm-orange">
          <Zap className="h-4 w-4 fill-fm-bg text-fm-bg" strokeWidth={0} />
        </span>
        <span className="text-lg font-semibold text-fm-white">
          Finance Master
        </span>
      </a>

      {/* Center nav pill */}
      <nav className="hidden items-center gap-1 rounded-full border border-fm-border bg-white/5 p-1 md:flex">
        {NAV_LINKS.map((link, i) => (
          <a
            key={link}
            href="#"
            className={`rounded-full px-4 py-2 text-sm transition-colors ${i === 0
              ? 'bg-white/10 text-fm-white'
              : 'text-fm-silver hover:text-fm-white'
              }`}
          >
            {link}
          </a>
        ))}
      </nav>

      {/* Contact button */}
      <a
        href="#contact"
        className="flex items-center gap-1.5 rounded-full bg-fm-white px-5 py-2.5 text-sm font-medium text-fm-bg transition-opacity hover:opacity-90"
      >
        Contact Us
        <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
