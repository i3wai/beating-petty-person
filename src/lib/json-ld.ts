import { PostMeta } from '@/lib/content';

const BASE_URL = 'https://beatpetty.com';

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BeatPetty",
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.png`,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: BASE_URL,
    name: "BeatPetty",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/en/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(post: PostMeta, locale: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: {
      "@type": "ImageObject",
      url: post.ogImage ? `${BASE_URL}${post.ogImage}` : `${BASE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    author: { "@type": "Organization", name: "BeatPetty" },
    publisher: { "@type": "Organization", name: "BeatPetty", logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` } },
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    mainEntityOfPage: url,
    inLanguage: locale,
    wordCount: post.wordCount,
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function howToJsonLd(name: string, description: string, steps: { name: string; text: string }[], url?: string, image?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    url,
    image: image ? { "@type": "ImageObject", url: `${BASE_URL}${image}`, width: 1200, height: 630 } : undefined,
    totalTime: "PT5M",
    step: steps.map(step => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
    })),
  };
}
