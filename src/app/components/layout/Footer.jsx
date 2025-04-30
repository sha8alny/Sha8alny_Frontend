/**
 * @namespace layout
 * @module layout
 */

import Link from "next/link";

/**
 * Footer component that renders the site's footer section.
 *
 * Displays navigation links for About, Terms, Privacy Policy, and Cookie Policy,
 * along with a copyright notice.
 *
 * @returns {JSX.Element} A footer element with navigation links and copyright information
 */
export default function Footer() {
  return (
    <footer className="bg-foreground w-full border dark:border-[#111] rounded-2xl shadow-md p-4 mt-2 mb-4">
      <div className="flex flex-wrap gap-2 text-xs text-muted">
        <Link className="hover:text-secondary hover:underline" href="/about">
          About
        </Link>
        <span>•</span>
        <Link className="hover:text-secondary hover:underline" href="/terms">
          Terms
        </Link>
        <span>•</span>
        <Link className="hover:text-secondary hover:underline" href="/privacy-policy">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link className="hover:text-secondary hover:underline" href="/cookie-policy">
          Cookie Policy
        </Link>
      </div>
      <p className="text-xs text-primary mt-2">
        © {new Date().getFullYear} Shaغalny. All rights reserved.
      </p>
    </footer>
  );
}
