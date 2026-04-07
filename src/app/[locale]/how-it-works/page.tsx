import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getPage } from "@/lib/content";
import { getMdxComponents } from "@/lib/mdx-components";
import { CtaButton } from "@/components/mdx/CtaButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = getPage(locale, "how-it-works");
  if (!page) return {};

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    keywords: page.frontmatter.keywords,
  };
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = getPage(locale, "how-it-works");
  if (!page) notFound();

  return (
    <div className="min-h-dvh py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <MDXRemote
          source={page.content}
          components={getMdxComponents()}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
        <div className="mt-12 text-center">
          <CtaButton href="/ritual">
            {locale === "en"
              ? "Begin the Ritual"
              : locale === "zh-TW"
                ? "開始儀式"
                : "开始仪式"}
          </CtaButton>
        </div>
      </div>
    </div>
  );
}
