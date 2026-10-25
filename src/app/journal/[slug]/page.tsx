import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/data/articles";
import { pageMetadata } from "@/lib/metadata";
import { MagneticLink } from "@/components/magnetic-link";
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = getArticle((await params).slug);
  return pageMetadata(
    article?.title ?? "Article not found",
    article
      ? article.excerpt +
          " Original editorial from a fictional Cape Town studio portfolio."
      : "This article could not be found.",
    article ? `/journal/${article.slug}` : undefined,
  );
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const next = articles[(articles.indexOf(article) + 1) % articles.length];
  return (
    <article className="journal-article">
      <header className="inner-page article-heading">
        <Link className="text-link" href="/journal">
          ← All journal notes
        </Link>
        <p className="micro">
          {article.category} / {article.date}
        </p>
        <h1>{article.title}</h1>
        <p className="page-lead">{article.excerpt}</p>
        <p className="article-byline">
          FORMA editorial · Fictional studio portfolio
        </p>
      </header>
      <div className="article-image">
        <Image
          src={article.image}
          alt={article.alt}
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="article-layout">
        <nav aria-label="Article contents">
          <p className="micro">IN THIS NOTE</p>
          {article.sections.map((section, i) => (
            <a href={`#section-${i}`} key={section.heading}>
              {String(i + 1).padStart(2, "0")} / {section.heading}
            </a>
          ))}
        </nav>
        <div className="article-body">
          {article.sections.map((section, i) => (
            <section id={`section-${i}`} key={section.heading} data-reveal>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <p className="concept-note">
            An original design perspective for this fictional portfolio, not a
            commissioned project report or technical specification. Images are
            illustrative.
          </p>
        </div>
      </div>
      <section className="section next-project">
        <p className="micro">CONTINUE READING</p>
        <h2>{next.title}</h2>
        <MagneticLink href={`/journal/${next.slug}`}>
          Read the next note
        </MagneticLink>
      </section>
    </article>
  );
}
