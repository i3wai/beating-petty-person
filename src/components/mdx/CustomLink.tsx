import { Link } from "@/i18n/navigation";

export function CustomLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  if (!href) return <span {...props}>{children}</span>;

  // Internal links: use i18n Link
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  // External links: new tab
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
