import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/content";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts(locale);

  return (
    <div className="min-h-dvh py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold text-vermillion mb-3">
            {t("title")}
          </h1>
          <p className="text-paper-muted text-lg">{t("subtitle")}</p>
        </div>

        {/* Post List */}
        {posts.length === 0 ? (
          <p className="text-center text-paper-muted">{t("noPosts")}</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <article className="border border-ink-lighter rounded-lg p-6 transition-colors hover:border-vermillion/30 hover:bg-ink-light/30">
                  <h2 className="text-xl font-serif font-bold text-paper group-hover:text-vermillion transition-colors mb-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-paper-muted mb-3">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="text-ink-lighter">|</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <p className="text-paper-muted leading-relaxed">
                    {post.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
