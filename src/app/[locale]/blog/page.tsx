import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPostsByCluster } from "@/lib/content";
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

  const clusterAPosts = getPostsByCluster(locale, "A");
  const clusterBPosts = getPostsByCluster(locale, "B");
  const clusterCPosts = getPostsByCluster(locale, "C");

  // Helper function to render a cluster section
  function ClusterSection({
    clusterPosts,
    clusterKey,
  }: {
    clusterPosts: Array<{
      title: string;
      description: string;
      date: string;
      readingTime: string;
      slug: string;
    }>;
    clusterKey: string;
  }) {
    const pillarPost = clusterPosts[0];
    const spokePosts = clusterPosts.slice(1);

    if (clusterPosts.length === 0) return null;

    return (
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-bold text-vermillion mb-6">
          {t(clusterKey)}
        </h2>

        {/* Pillar Post (Featured) */}
        {pillarPost && (
          <Link
            href={`/blog/${pillarPost.slug}`}
            className="block group mb-6"
          >
            <article className="relative bg-ink-light border-2 border-vermillion/20 rounded-lg p-8 transition-all duration-200 hover:border-vermillion hover:shadow-lg hover:shadow-vermillion/20">
              <div className="absolute -top-3 left-6 bg-vermillion text-paper text-xs font-bold px-3 py-1 rounded-full">
                {t("featured")}
              </div>
              <h3 className="text-2xl font-serif font-bold text-paper group-hover:text-gold transition-colors mb-3 mt-2">
                {pillarPost.title}
              </h3>
              <p className="text-paper-muted leading-relaxed mb-4">
                {pillarPost.description}
              </p>
              <div className="flex items-center gap-3 text-sm text-paper-muted">
                <time dateTime={pillarPost.date}>
                  {new Date(pillarPost.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="text-ink-lighter">|</span>
                <span>{pillarPost.readingTime}</span>
              </div>
            </article>
          </Link>
        )}

        {/* Spoke Posts (Grid) */}
        {spokePosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spokePosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <article className="border border-ink-lighter rounded-lg p-5 transition-colors hover:border-vermillion/50 hover:bg-ink-light/30">
                  <h4 className="text-lg font-serif font-bold text-paper group-hover:text-gold transition-colors mb-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-paper-muted">
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
                  <p className="text-sm text-paper-muted mt-2 line-clamp-2">
                    {post.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="min-h-dvh py-16 px-4 bg-ink">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-vermillion mb-4">
            {t("title")}
          </h1>
          <p className="text-paper-muted text-lg max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Intro Paragraph with Keywords */}
        <p className="text-paper text-center mb-16 max-w-2xl mx-auto leading-relaxed text-lg">
          {t("intro")}
        </p>

        {/* Cluster Sections */}
        <ClusterSection clusterPosts={clusterAPosts} clusterKey="clusterA" />
        <ClusterSection clusterPosts={clusterBPosts} clusterKey="clusterB" />
        <ClusterSection clusterPosts={clusterCPosts} clusterKey="clusterC" />

        {/* Bottom CTA */}
        <div className="mt-16 text-center pt-12 border-t border-ink-lighter">
          <p className="text-paper-muted mb-6 text-lg">
            {t("bottomCtaPrompt")}
          </p>
          <Link
            href="/ritual"
            className="inline-block px-8 py-4 bg-vermillion-dark text-paper rounded-lg font-serif font-bold text-lg transition-all duration-200 hover:bg-vermillion hover:scale-105 hover:shadow-lg hover:shadow-vermillion/30"
          >
            {t("cta.button")} →
          </Link>
        </div>
      </div>
    </div>
  );
}
