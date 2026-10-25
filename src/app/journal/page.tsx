import Image from "next/image";
import Link from "next/link";
import { articles } from "@/data/articles";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "South African Workplace Design Journal",
  "Four original perspectives on Cape Town workplace design, hybrid offices, natural materials and collaboration. Editorial for the fictional FORMA studio portfolio.",
  "/journal"
);
export default function Journal() {
  return (
    <section className="inner-page journal-index">
      <p className="micro">NOTES FROM THE STUDIO</p>
      <h1>Room for thought.</h1>
      <p className="page-lead">
        Perspectives on the places we work, the materials we choose and the
        connections we make. Original editorial from our fictional Cape Town
        studio.
      </p>
      <div className="journal-grid">
        {articles.map((article, index) => (
          <article key={article.slug} data-reveal>
            <Link
              href={`/journal/${article.slug}`}
              className="journal-card-image"
              aria-label={`Read ${article.title}`}
            >
              <Image
                src={article.image}
                alt={article.alt}
                fill
                sizes="(max-width:700px) 90vw, 45vw"
                priority={index === 0}
              />
              <span aria-hidden="true">Read ↗</span>
            </Link>
            <p className="micro">
              {article.category} / {article.date}
            </p>
            <h2>
              <Link href={`/journal/${article.slug}`}>{article.title}</Link>
            </h2>
            <p>{article.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
