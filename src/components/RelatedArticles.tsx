import { Link } from '@/i18n/navigation';
import { PostMeta } from '@/lib/content';

interface RelatedArticlesProps {
  posts: PostMeta[];
  locale: string;
  heading?: string;
}

export default function RelatedArticles({ posts, locale, heading }: RelatedArticlesProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-ink-lighter">
      <h2 className="text-2xl font-serif font-bold text-vermillion mb-6">
        {heading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-ink-light border border-ink-lighter rounded-lg p-5 transition-all duration-200 hover:border-vermillion hover:scale-[1.02] hover:shadow-lg hover:shadow-vermillion/10"
          >
            <h3 className="text-lg font-serif font-bold text-paper group-hover:text-gold transition-colors mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-paper-muted line-clamp-2 mb-3 leading-relaxed">
              {post.description.length > 120
                ? `${post.description.slice(0, 120)}...`
                : post.description}
            </p>
            <span className="inline-block text-xs px-2 py-1 bg-ink rounded text-gold">
              {post.readingTime}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
