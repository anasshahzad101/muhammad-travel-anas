import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import TrustPoints from "@/components/TrustPoints";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/metadata";
import { activeLicences, fullAddress, operatorDisclosure, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Muhammad Travels — Umrah Travel Agency in Lahore",
  absoluteTitle: true,
  description:
    "Muhammad Travels is a Lahore umrah travel agency serving pilgrims across Pakistan. How we price, who we are, and how to check our registration before you pay.",
  path: "/about/",
  image: "nabawiUmbrellas",
});

export default function AboutPage() {
  const licences = activeLicences();
  return (
    <>
      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x grid gap-10 py-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-16">
          <div>
            <Breadcrumbs items={[{ name: "About", path: "/about/" }]} />
            <p className="eyebrow mt-6">About us</p>
            <h1 className="mt-3 text-[2.4rem] leading-[1.06] sm:text-5xl">An Umrah agency that shows you everything up front</h1>
            <p className="mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-ink-700">
              {site.name} arranges Umrah for pilgrims across Pakistan from our office in {site.contact.address.city}. We
              handle the visa, flights, hotels and transport as one package, and we publish the full price and the real
              hotel distance for every package — because that is exactly what families told us they couldn&apos;t get
              elsewhere.
            </p>
          </div>
          <div className="arch relative mx-auto aspect-[4/5] w-full max-w-sm">
            <Image src={images.nabawiPortrait.src} alt={images.nabawiPortrait.alt} fill priority sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div className="prose-mt">
          <h2>How we work</h2>
          <p>
            Umrah is often the largest single expense a Pakistani family makes after a wedding, and it is usually paid
            to an agent the family has never met. So we run the business on things you can check rather than things you
            have to take on trust:
          </p>
          <ul>
            <li>
              <strong>The whole price, per person, in rupees</strong> — visa, flights, hotels and transport together, with
              the room type stated.
            </li>
            <li>
              <strong>The hotel distance in metres</strong>, or &ldquo;shuttle&rdquo; when it is one. The voucher you
              receive names the exact hotel before you pay the balance.
            </li>
            <li>
              <strong>A written invoice before any payment</strong>, and payment only to the bank account in our business
              name shown on it.
            </li>
            <li>
              <strong>Your visa, e-tickets and hotel vouchers in hand</strong> before you leave Pakistan, with a number to
              call while you are in Saudi Arabia.
            </li>
          </ul>

          <h2>Umrah only</h2>
          <p>
            We arrange Umrah and Umrah-related services: visas, flights, hotels, transport and ziyarat. We do not sell
            Hajj packages. In Pakistan, Hajj is arranged through the Government Hajj Scheme or through Hajj Group
            Organisers licensed by the Ministry of Religious Affairs.
          </p>

          <h2>Registration</h2>
          <p>
            Since July 2026, only umrah companies verified by Pakistan&apos;s Ministry of Religious Affairs (MoRA) may
            provide umrah services, and MoRA publishes the approved list. Always check an agent against it before paying.
          </p>
          {operatorDisclosure() && (
            <p>
              <strong>{operatorDisclosure()}</strong>
            </p>
          )}
          {licences.length > 0 ? (
            <ul>
              {licences.map((l) => (
                <li key={l.label}>
                  <strong>{l.label}:</strong> {l.value}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              Ask us for our registration documents on WhatsApp or at the office — we will share them before you pay
              anything. You should ask any agent for the same.
            </p>
          )}
          <p>
            {site.name} is a private travel agency, not affiliated with the Ministry of Hajj and Umrah of Saudi Arabia,
            Nusuk, or the Government of Pakistan. Umrah visas are issued at the discretion of the Saudi authorities.
          </p>

          <h2>Visit us</h2>
          <p>
            {fullAddress() || `${site.contact.address.city}, Pakistan`}. {site.contact.hoursSummary}.{" "}
            <Link href="/contact/">Directions and contact details</Link>.
          </p>
        </div>
        <aside className="space-y-4">
          <TrustPoints />
        </aside>
      </section>

      <CtaBand title="Speak to us before you book anywhere" />
    </>
  );
}
