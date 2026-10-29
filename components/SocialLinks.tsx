import { site } from "@/lib/site";
import { FacebookIcon, InstagramIcon } from "./Icons";

/**
 * The business's social profiles as icon links, read from site.social. The same
 * URLs are emitted as sameAs in the TravelAgency schema, so the visible links
 * and the structured data always match.
 */
export default function SocialLinks({ className }: { className?: string }) {
  const links = [
    { key: "facebook", label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
    { key: "instagram", label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  ].filter((l): l is typeof l & { href: string } => l.href !== null);

  if (links.length === 0) return null;

  return (
    <ul className={`flex gap-3 ${className ?? ""}`}>
      {links.map(({ key, label, href, Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="me noopener"
            aria-label={`${site.name} on ${label}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 text-gold-300 transition hover:border-gold-300 hover:text-white"
          >
            <Icon className="h-[1.1rem] w-[1.1rem]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
