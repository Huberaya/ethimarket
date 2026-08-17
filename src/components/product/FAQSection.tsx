import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SectionTitle } from './GuaranteesSection';
import { useI18n } from '../../lib/i18n';
import { PRODUCT_PAGE_CONTENT } from '../../lib/i18n/content/productPage';

export default function FAQSection() {
  const { locale } = useI18n();
  const c = PRODUCT_PAGE_CONTENT[locale].faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-12 border-t border-gray-100">
      <SectionTitle icon={HelpCircle} title={c.sectionTitle} />

      <div className="mt-8 space-y-3">
        {c.items.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors"
              >
                <span className="font-bold text-sm text-gray-900">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
