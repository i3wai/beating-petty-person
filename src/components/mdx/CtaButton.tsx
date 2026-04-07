import { Link } from "@/i18n/navigation";

type CtaButtonProps = {
  href: string;
  variant?: "vermillion" | "gold";
  children: React.ReactNode;
};

export function CtaButton({ href, variant = "vermillion", children }: CtaButtonProps) {
  const baseClasses =
    "inline-block px-8 py-3 rounded-lg font-serif font-bold text-lg transition-all duration-200 hover:scale-105";

  const variantClasses =
    variant === "gold"
      ? "bg-gold text-ink hover:bg-gold-light"
      : "bg-vermillion-dark text-paper hover:bg-vermillion";

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </Link>
  );
}
