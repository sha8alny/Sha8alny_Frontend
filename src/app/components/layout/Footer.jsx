export default function Footer() {
  return (
    <footer className="bg-background border border-[#111] rounded-2xl p-4 mt-2">
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
