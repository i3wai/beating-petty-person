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
      <ol className="flex items-center text-sm text-gray-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && <span className="mx-2 text-gray-600">›</span>}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-[#d4a017] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-300">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
