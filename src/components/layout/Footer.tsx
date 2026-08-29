import { FOOTER_COLUMNS } from "@/data/landing";

const SOCIALS = [
  {
    label: "Facebook",
    path: "M14 8.6h2.4V5.3h-2.4c-2.1 0-3.6 1.6-3.6 3.7v1.7H8.2v3.3h2.2V21h3.3v-7h2.4l.5-3.3h-2.9V9.4c0-.5.3-.8.9-.8z",
  },
  {
    label: "Twitter",
    path: "M21 6.4c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.6-2.1-.7.4-1.5.8-2.4.9a3.7 3.7 0 0 0-6.4 3.4 10.6 10.6 0 0 1-7.6-3.9 3.7 3.7 0 0 0 1.1 5 3.6 3.6 0 0 1-1.7-.5v.1c0 1.8 1.3 3.3 3 3.7-.5.1-1.1.2-1.6.1a3.7 3.7 0 0 0 3.4 2.6A7.4 7.4 0 0 1 3 17.9a10.5 10.5 0 0 0 5.7 1.7c6.9 0 10.6-5.7 10.6-10.6v-.5c.7-.5 1.3-1.2 1.7-2z",
  },
];

export function Footer() {
  return (
    <footer className="bg-surface-muted">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 lg:px-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-2xl font-bold tracking-tight text-foreground">Logo</p>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Our vision is to provide convenience and help increase your sales business.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-muted"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-muted"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="font-semibold text-foreground">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line-strong pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>©2026 Best Auto. All rights reserved</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground">
              Privacy &amp; Policy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms &amp; Condition
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
