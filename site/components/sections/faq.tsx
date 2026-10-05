import { ChevronDown } from 'lucide-react';
import { faq } from '@/lib/site';

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl divide-y rounded-xl border bg-card">
      {faq.map((item) => (
        <details key={item.q} className="group px-5 py-1 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium">
            {item.q}
            <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="pb-5 text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
