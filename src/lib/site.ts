import { title, words } from "./lorem";

// Sitemap mirrors the reference's information architecture; every label is lorem.
export const slugs = {
  solutions: ["lorem", "ipsum", "dolor", "amet", "elit", "tempor"],
  products: ["consectetur", "adipiscing", "eiusmod", "incididunt", "labore", "magna", "aliqua"],
  stories: ["veniam", "nostrud", "ullamco", "laboris"],
  posts: ["commodo", "consequat", "irure", "voluptate", "cillum", "fugiat"],
  legal: ["privacy", "cookies", "terms", "deposits", "eligibility", "complaints", "sustainability", "anti-bribery"],
};

export type NavLink = { href: string; label: string; desc?: string; icon?: string };
export type NavGroup = { label: string; links: NavLink[] };
export type NavItem = { label: string; href?: string; groups?: NavGroup[] };

const icons = ["bank", "frame", "trend", "shield", "people", "eye", "swap", "code", "book", "pulse", "chat"];

export const nav: NavItem[] = [
  {
    label: "Products",
    groups: [
      { label: words(2, 1), links: [{ href: `/products/${slugs.products[4]}`, label: title(3, 2), desc: words(4, 3), icon: "bank" }] },
      { label: words(2, 4), links: slugs.products.slice(0, 4).map((s, i) => ({ href: `/products/${s}`, label: title(3, 5 + i), desc: words(5, 9 + i), icon: icons[1 + i] })) },
      { label: words(1, 8), links: [{ href: `/products/${slugs.products[5]}`, label: title(1, 12), desc: words(5, 13), icon: "eye" }] },
      { label: words(1, 14), links: [{ href: `/products/${slugs.products[6]}`, label: title(1, 15), desc: words(3, 16), icon: "swap" }] },
    ],
  },
  { label: "Solutions", groups: [{ label: "", links: slugs.solutions.map((s, i) => ({ href: `/solutions/${s}`, label: title(3, 20 + i), desc: words(4, 26 + i), icon: icons[i % icons.length] })) }] },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Developers",
    groups: [{ label: "", links: [
      { href: "/onboarding", label: title(2, 30), desc: words(4, 31), icon: "code" },
      { href: "/onboarding", label: title(1, 32), desc: words(4, 33), icon: "book" },
      { href: "/onboarding", label: title(2, 34), desc: words(5, 35), icon: "pulse" },
      { href: "/onboarding", label: title(2, 36), desc: words(3, 37), icon: "chat" },
    ] }],
  },
  {
    label: "Company",
    groups: [{ label: "", links: [
      { href: "/about", label: "About" }, { href: "/team", label: "Team" }, { href: "/culture", label: "Culture" },
      { href: "/careers", label: "Careers" }, { href: "/reports", label: title(2, 40) }, { href: "/company-facts", label: title(2, 41) }, { href: "/contact", label: "Contact" },
    ] }],
  },
  {
    label: "Resources",
    groups: [{ label: "", links: [
      { href: "/blog", label: "Blog" }, { href: "/customer-stories", label: title(2, 42) }, { href: "/podcast", label: "Podcast" },
      { href: "/onboarding", label: title(1, 43) }, { href: "/reports", label: title(1, 44) },
    ] }],
  },
];

export const footer: { label: string; links: NavLink[] }[] = [
  { label: "Products", links: [{ href: "/pricing", label: "Pricing" }, ...slugs.products.map((s, i) => ({ href: `/products/${s}`, label: title(2, 50 + i) }))] },
  { label: "Company", links: [["/about", "About"], ["/team", "Team"], ["/culture", "Culture"], ["/careers", "Careers"], ["/blog", "Blog"], ["/reports", title(2, 60)], ["/company-facts", title(2, 61)], ["/contact", "Contact"]].map(([href, label]) => ({ href, label })) },
  { label: "Policies", links: slugs.legal.map((s, i) => ({ href: `/legal/${s}`, label: title(i % 2 ? 2 : 1, 70 + i) })) },
  { label: "Developers", links: ["Sandbox", "Docs", "Changelog", "Status", "Community"].map((l) => ({ href: "/onboarding", label: l })) },
];
