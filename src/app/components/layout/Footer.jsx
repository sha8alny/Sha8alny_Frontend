/**
 * @namespace layout
 * @module layout
 */
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
        <a href="#" className="hover:text-secondary">
          About
        </a>
        <span>•</span>
        <a href="#" className="hover:text-secondary">
          Terms
        </a>
        <span>•</span>
        <a href="#" className="hover:text-secondary">
          Privacy Policy
        </a>
        <span>•</span>
        <a href="#" className="hover:text-secondary">
          Cookie Policy
        </a>
      </div>
      <p className="text-xs text-primary mt-2">
        © 2025 Shaغalny. All rights reserved.
      </p>
    </footer>
  );
}
