import type { MDXComponents } from "mdx/types";
import { Prose } from "@/components/mdx/Prose";
import { CustomLink } from "@/components/mdx/CustomLink";
import { CtaButton } from "@/components/mdx/CtaButton";

export function getMdxComponents(): MDXComponents {
  return {
    wrapper: Prose,
    a: CustomLink,
    CtaButton,
  };
}
