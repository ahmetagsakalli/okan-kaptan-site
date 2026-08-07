"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CmsFaqItem } from "../lib/cms-types";
import { faqItems } from "../lib/site-data";

type FaqSectionProps = {
  items?: CmsFaqItem[];
};

export function FaqSection({ items = faqItems }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string>(items[0]?.id ?? "");
  const midpoint = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, midpoint);
  const rightColumn = items.slice(midpoint);
  const columns = [
    { id: "left", items: leftColumn },
    { id: "right", items: rightColumn },
  ];

  return (
    <section className="faq-section reveal-item" id="sss" aria-labelledby="sss-title">
      <div className="section-heading compact">
        <h2 id="sss-title">Bunları bilmek isteyebilirsiniz</h2>
      </div>
      <div className="faq-grid">
        {columns.map((column) => (
          <div className="faq-column" key={column.id}>
            {column.items.map((item) => {
              const isOpen = openId === item.id;
              const answerId = `${item.id}-answer`;

              return (
                <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.id}>
                  <button
                    className="faq-question"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenId(isOpen ? "" : item.id)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={20} aria-hidden="true" />
                  </button>
                  <div className="faq-answer" id={answerId}>
                    <p>{item.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
