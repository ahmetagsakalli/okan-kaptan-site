import { ContactSection } from "./components/content-sections";
import { HomeExperience } from "./components/home-experience";
import { getSiteContent } from "./lib/cms-content";
import { structuredData } from "./lib/site-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  const homeStructuredData = {
    ...structuredData,
    "@graph": structuredData["@graph"].map((item) => {
      if (item["@type"] !== "FAQPage") {
        return item;
      }

      return {
        ...item,
        mainEntity: content.faqItems.map((faqItem) => ({
          "@type": "Question",
          name: faqItem.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faqItem.answer,
          },
        })),
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
      <main className="site-shell">
        <HomeExperience content={content} />
        <ContactSection />
      </main>
    </>
  );
}
