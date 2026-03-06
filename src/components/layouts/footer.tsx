import Link from "next/link";

const footerLinks = [
  {
    heading: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Sale", href: "/products?status=USED" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Shipping & Returns", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-black text-white mt-24">
      <div className="container mx-auto px-6 py-14">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <span className="text-xl font-black uppercase tracking-tight text-white">
              Brutal Shop
            </span>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
              Premium products. Brutally good prices.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {col.heading}
              </span>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-medium">
            © {new Date().getFullYear()} Brutal Shop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-gray-500 hover:text-white transition-colors font-medium"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
