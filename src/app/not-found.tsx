import Link from "next/link";
export default function NotFound() {
  return (
    <section className="inner-page">
      <p className="micro">404 / A SPACE YET TO BE DESIGNED</p>
      <h1>A little off plan.</h1>
      <p className="page-lead">
        We couldn’t find that page. Let’s bring you back to familiar ground.
      </p>
      <Link className="text-link" href="/">
        Back to FORMA <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
