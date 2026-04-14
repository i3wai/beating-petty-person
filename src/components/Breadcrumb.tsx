import { Link } from '@/i18n/navigation';
import { breadcrumbJsonLd } from '@/lib/json-ld';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLdItems = items.map((item) => ({
    name: item.label,
    url: item.href ? `https://beatpetty.com${item.href}` : '',
  }));

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(jsonLdItems)) }}
      />
      <ol className="flex items-center text-sm text-paper-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && <span className="mx-2 text-ink-lighter">›</span>}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-gold transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-paper-dark">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
