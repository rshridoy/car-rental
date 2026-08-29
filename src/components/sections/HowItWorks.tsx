import { PROCESS_STEPS } from "@/data/landing";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          A high-performing web-based car rental system for any rent-a-car company and website
        </p>

        <div className="relative mt-20">
          <svg
            viewBox="0 0 800 60"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-9 hidden h-16 w-full text-line-strong lg:block"
            aria-hidden="true"
          >
            <path
              d="M65 10 C 250 10, 250 55, 400 55 C 550 55, 550 10, 735 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>

          <div className="relative grid grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-8">
            {PROCESS_STEPS.map((step) => (
              <div key={step.title} className="flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                  <step.icon className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
