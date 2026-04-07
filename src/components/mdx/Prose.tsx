import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-mx-auto prose-mx-auto max-w-3xl">
      <div
        className="
          text-paper leading-relaxed
          [&_h1]:text-3xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-vermillion [&_h1]:mt-12 [&_h1]:mb-6
          [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-vermillion [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-ink-lighter
          [&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-vermillion [&_h3]:mt-8 [&_h3]:mb-3
          [&_p]:mb-6 [&_p]:leading-relaxed
          [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-gold-light [&_a]:transition-colors
          [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-6 [&_ul]:space-y-1 [&_ul]:text-paper-muted
          [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-6 [&_ol]:space-y-1 [&_ol]:text-paper-muted
          [&_li]:mb-1
          [&_blockquote]:border-l-2 [&_blockquote]:border-vermillion [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-paper-muted [&_blockquote]:my-6
          [&_code]:bg-ink-light [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-gold
          [&_pre]:bg-ink-light [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-6 [&_pre]:text-sm
          [&_strong]:font-bold [&_strong]:text-paper
          [&_em]:text-paper-muted [&_em]:italic
          [&_hr]:border-ink-lighter [&_hr]:my-8
          [&_img]:rounded-lg [&_img]:my-6
          [&_table]:w-full [&_table]:mb-6
          [&_th]:text-left [&_th]:p-2 [&_th]:border-b [&_th]:border-ink-lighter [&_th]:text-paper-muted [&_th]:font-bold
          [&_td]:p-2 [&_td]:border-b [&_td]:border-ink-lighter
        "
      >
        {children}
      </div>
    </div>
  );
}
