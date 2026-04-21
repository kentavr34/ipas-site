import Link from 'next/link';
import { Layout } from '../components/Layout';

export default function About() {
  return (
    <Layout
      title="About"
      description="About the International Psychotherapy Association — mission, values and leadership."
    >
      <article className="container-p py-10 prose prose-invert max-w-3xl
                          prose-headings:font-display prose-a:text-brand-gold
                          sm:py-16">
        <header className="not-prose mb-8">
          <div className="text-xs uppercase tracking-widest text-brand-gold">
            About IPAS
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">
            A professional learning community
          </h1>
        </header>

        <p>
          The <strong>International Psychotherapy Association (IPAS)</strong> is a
          professional community dedicated to psychotherapy education, continuing
          training and mutual support of practicing clinicians.
        </p>

        <h2>Mission</h2>
        <p>
          We provide vibrant learning opportunities in theory and clinical skills,
          foster an inclusive atmosphere sensitive to sociocultural contexts, and
          ensure accessible training for professionals at all experience levels —
          from students taking their first courses to senior faculty leading
          international programs.
        </p>

        <h2>Our approach</h2>
        <p>
          Our curricula are grounded in contemporary psychodynamic and object
          relations theory, complemented by modern approaches such as cognitive
          behavioural therapy, applied behaviour analysis, and clinical child
          and adolescent psychology. We integrate intellectual and experiential
          learning so that practitioners deepen both their understanding and their
          therapeutic stance.
        </p>

        <h2>Leadership</h2>
        <p>
          The Association is governed by a Council. Certificates are signed by
          <strong> Robin Mackay, President of the Council</strong>. Country
          Ambassadors represent IPAS in their regions and support local chapters.
          Kenan Rahimov serves as Ambassador for Azerbaijan.
        </p>

        <h2>Collaboration</h2>
        <p>
          IPAS works in collaboration with the broader international psychotherapy
          community. Educational resources curated on this site — including video
          lessons, weekend conferences and free libraries — are sourced in part
          from partner organisations, with source attribution provided on each
          resource card.
        </p>

        <h2>Values</h2>
        <ul>
          <li>Honouring heterogeneity and standing with marginalised communities.</li>
          <li>Cultivating open inquiry and clinical rigor.</li>
          <li>Acknowledging how marginalisation impacts emotional well-being.</li>
          <li>Committing to continued excellence in psychotherapy training worldwide.</li>
        </ul>

        <hr className="gold" />

        <p className="not-prose">
          <Link href="/membership" className="btn-primary">
            Become a Member →
          </Link>
        </p>
      </article>
    </Layout>
  );
}
