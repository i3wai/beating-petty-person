import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getPostBySlug, getAllBlogSlugs } from "@/lib/content";
import { getMdxComponents } from "@/lib/mdx-components";
import { Link } from "@/i18n/navigation";

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
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      url: `${siteUrl}/${locale}/blog/${slug}`,
      images: post.frontmatter.ogImage
        ? [{ url: post.frontmatter.ogImage }]
        : undefined,
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

  return (
    <div className="min-h-dvh py-16 px-4">
      <article className="max-w-3xl mx-auto">
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
