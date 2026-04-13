import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getPostBySlug, getAllBlogSlugs, getRelatedPosts, extractHeadings } from "@/lib/content";
import { getMdxComponents } from "@/lib/mdx-components";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd, howToJsonLd } from "@/lib/json-ld";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedArticles from "@/components/RelatedArticles";
import TableOfContents from "@/components/TableOfContents";

export async function generateStaticParams() {
  return getAllBlogSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) return {};

  const siteUrl = "https://beatpetty.com";

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.keywords,
    alternates: {
      canonical: `${siteUrl}/${locale}/blog/${slug}`,
      languages: {
        en: `${siteUrl}/en/blog/${slug}`,
        "zh-TW": `${siteUrl}/zh-TW/blog/${slug}`,
        "zh-Hans": `${siteUrl}/zh-Hans/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.updatedDate || post.frontmatter.date,
      url: `${siteUrl}/${locale}/blog/${slug}`,
      siteName: "BeatPetty",
      images: post.frontmatter.ogImage
        ? [{ url: `${siteUrl}${post.frontmatter.ogImage}`, width: 1200, height: 630 }]
        : [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: post.frontmatter.ogImage
        ? [`${siteUrl}${post.frontmatter.ogImage}`]
        : [`${siteUrl}/og-image.png`],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });

  const articleUrl = `https://beatpetty.com/${locale}/blog/${slug}`;
  const articleSchema = articleJsonLd(post.frontmatter, locale, articleUrl);
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", url: `https://beatpetty.com/${locale}` },
    { name: "The Grimoire", url: `https://beatpetty.com/${locale}/blog` },
    { name: post.frontmatter.title, url: articleUrl },
  ]);
  const headings = extractHeadings(post.content);
  const faqs = post.frontmatter.faqs;
  const steps = post.frontmatter.steps;

  return (
    <div className="min-h-dvh py-16 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* FAQPage schema */}
      {faqs && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs)) }}
        />
      )}
      {/* HowTo schema */}
      {steps && steps.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToJsonLd(
              post.frontmatter.title,
              post.frontmatter.description,
              steps,
              articleUrl,
              post.frontmatter.ogImage
            ))
          }}
        />
      )}
      <article className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: t("breadcrumb.home"), href: "/" },
            { label: t("breadcrumb.blog"), href: "/blog" },
            { label: post.frontmatter.title },
          ]}
        />

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-vermillion mb-4">
            {post.frontmatter.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-paper-muted">
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-ink-lighter">|</span>
            <span>{post.frontmatter.readingTime}</span>
          </div>
        </header>

        {/* Table of Contents */}
        <TableOfContents headings={headings} title={t("tocTitle")} />

        {/* MDX Content */}
        <MDXRemote
          source={post.content}
          components={getMdxComponents()}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
          <section className="mt-12 pt-8 border-t border-ink-lighter">
            <h2 className="text-2xl font-serif font-bold text-vermillion mb-6">
              {t("faqTitle")}
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-lg font-serif font-bold text-paper mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-paper-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Articles */}
        <RelatedArticles
          posts={getRelatedPosts(locale, slug)}
          locale={locale}
          heading={t("relatedArticles")}
        />

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-ink-lighter">
          <Link
            href="/blog"
            className="text-gold hover:text-gold-light transition-colors underline underline-offset-4"
          >
            &larr; {t("backToBlog")}
          </Link>
        </div>
      </article>
    </div>
  );
}
