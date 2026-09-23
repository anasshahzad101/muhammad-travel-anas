/** Navigation groups, shared by the header mega-menu, the mobile menu and the footer. */

export type NavLink = { href: string; label: string };

export const packageNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "From your city",
    links: [
      { href: "/umrah-packages/lahore/", label: "Lahore" },
      { href: "/umrah-packages/karachi/", label: "Karachi" },
      { href: "/umrah-packages/islamabad/", label: "Islamabad" },
    ],
  },
  {
    heading: "By number of days",
    links: [
      { href: "/umrah-packages/7-days/", label: "7 days" },
      { href: "/umrah-packages/10-days/", label: "10 days" },
      { href: "/umrah-packages/15-days/", label: "15 days" },
      { href: "/umrah-packages/21-days/", label: "21 days" },
      { href: "/umrah-packages/28-days/", label: "28 days" },
    ],
  },
  {
    heading: "By hotel",
    links: [
      { href: "/umrah-packages/economy/", label: "Economy (cheap)" },
      { href: "/umrah-packages/3-star/", label: "3-Star" },
      { href: "/umrah-packages/4-star/", label: "4-Star" },
      { href: "/umrah-packages/5-star/", label: "5-Star & VIP" },
    ],
  },
  {
    heading: "Travelling as",
    links: [
      { href: "/umrah-packages/family/", label: "Family" },
      { href: "/umrah-packages/couples/", label: "Couples" },
      { href: "/umrah-packages/group/", label: "Group" },
    ],
  },
  {
    heading: "Season",
    links: [
      { href: "/umrah-packages/december/", label: "December 2026" },
      { href: "/umrah-packages/ramadan/", label: "Ramadan 2027" },
    ],
  },
];

export const mainNav: NavLink[] = [
  { href: "/umrah-visa/", label: "Umrah Visa" },
  { href: "/umrah-tickets/", label: "Tickets" },
  { href: "/guides/", label: "Guides" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export const guideNav: NavLink[] = [
  { href: "/guides/how-to-perform-umrah/", label: "How to perform Umrah" },
  { href: "/guides/umrah-duas/", label: "Umrah duas" },
  { href: "/guides/umrah-cost-from-pakistan/", label: "Umrah cost from Pakistan" },
  { href: "/guides/umrah-packing-list/", label: "Umrah packing list" },
];

export const legalNav: NavLink[] = [
  { href: "/faq/", label: "FAQs" },
  { href: "/refund-policy/", label: "Refund & cancellation" },
  { href: "/terms-and-conditions/", label: "Terms & conditions" },
  { href: "/privacy-policy/", label: "Privacy policy" },
];
