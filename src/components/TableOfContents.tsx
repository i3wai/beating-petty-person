interface TableOfContentsProps {
  headings: { text: string; id: string }[];
  title?: string;
}

export default function TableOfContents({ headings, title = "Table of Contents" }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="mb-10 p-6 bg-ink-light border border-ink-lighter rounded-lg">
      <h2 className="text-lg font-serif font-bold text-vermillion mb-4">
        {title}
      </h2>
      <ol className="space-y-2">
        {headings.map((heading, i) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-gold hover:text-gold-light transition-colors text-sm leading-relaxed underline-offset-2 hover:underline"
            >
              <span className="text-paper-muted mr-2">{i + 1}.</span>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
