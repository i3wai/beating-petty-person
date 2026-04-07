import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content");
const VALID_LOCALES = ["en", "zh-TW", "zh-Hans"];

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  keywords?: string[];
  ogImage?: string;
  slug: string;
  readingTime: string;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

function validateLocale(locale: string): void {
  if (!VALID_LOCALES.includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
}

function getContentPath(locale: string, ...segments: string[]): string {
  return path.join(CONTENT_DIR, locale, ...segments);
}

export function getAllPosts(locale: string): PostMeta[] {
  validateLocale(locale);

  const blogDir = getContentPath(locale, "blog");
  if (!fs.existsSync(blogDir)) return [];

  const files = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .reverse(); // newest first (assuming date-prefixed or alphabetical newest)

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
    const { data, content } = matter(raw);
    const stats = readingTime(content);

    return {
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      keywords: data.keywords ?? [],
      ogImage: data.ogImage,
      slug: file.replace(/\.mdx$/, ""),
      readingTime: stats.text,
    };
  }).filter((post) => post.title && post.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(
  locale: string,
  slug: string,
): { frontmatter: PostMeta; content: string } | null {
  validateLocale(locale);

  const filePath = getContentPath(locale, "blog", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    frontmatter: {
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      keywords: data.keywords ?? [],
      ogImage: data.ogImage,
      slug,
      readingTime: stats.text,
    },
    content,
  };
}

export function getPage(
  locale: string,
  page: string,
): { frontmatter: PageMeta; content: string } | null {
  validateLocale(locale);

  const filePath = getContentPath(locale, `${page}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: {
      title: data.title ?? "",
      description: data.description ?? "",
      keywords: data.keywords ?? [],
      ogImage: data.ogImage,
    },
    content,
  };
}

export function getAllBlogSlugs(): { locale: string; slug: string }[] {
  const slugs: { locale: string; slug: string }[] = [];

  for (const locale of VALID_LOCALES) {
    const blogDir = getContentPath(locale, "blog");
    if (!fs.existsSync(blogDir)) continue;

    const files = fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith(".mdx"));

    for (const file of files) {
      slugs.push({ locale, slug: file.replace(/\.mdx$/, "") });
    }
  }

  return slugs;
}
