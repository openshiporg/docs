import { ProductCard } from "@/components/ProductCard";

const ethosCards = [
  {
    title: "Ethos",
    href: "/docs/openfront/ethos",
    theme: "purple" as const,
    product: "opensupport" as const,
  },
];

const openshipCards = [
  {
    title: "Openship",
    href: "/docs/openship/ecommerce",
    theme: "amber" as const,
    product: "openship" as const,
  },
  {
    title: "Openship",
    href: "/docs/openship/ecommerce/getting-started",
    theme: "cyan" as const,
    product: "openship" as const,
  },
  {
    title: "Openship",
    href: "/docs/openship/ecommerce/api-reference",
    theme: "blue" as const,
    product: "openship" as const,
  },
];

const openfrontCards = [
  {
    title: "Dealerships",
    href: "/docs/openfront/dealership",
    theme: "red" as const,
    product: "openfront" as const,
  },
  {
    title: "E-commerce",
    href: "/docs/openfront/ecommerce",
    theme: "blue" as const,
    product: "openfront" as const,
  },
  {
    title: "Grocery",
    href: "/docs/openfront/grocery",
    theme: "green" as const,
    product: "openfront" as const,
  },
  {
    title: "Fitness",
    href: "/docs/openfront/gym",
    theme: "emerald" as const,
    product: "openfront" as const,
  },
  {
    title: "Healthcare",
    href: "/docs/openfront/hospital",
    theme: "pink" as const,
    product: "openfront" as const,
  },
  {
    title: "Hotels",
    href: "/docs/openfront/hotel",
    theme: "fuchsia" as const,
    product: "openfront" as const,
  },
  {
    title: "Restaurants",
    href: "/docs/openfront/restaurant",
    theme: "amber" as const,
    product: "openfront" as const,
  },
];

export default function HomePage() {
  return (
    <main className="px-4 py-8 space-y-8">
      {/* Ethos Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ethosCards.map((card, index) => (
            <div key={`${card.title}-${index}`} className="w-full h-48">
              <ProductCard
                title={card.title}
                href={card.href}
                theme={card.theme}
                product={card.product}
              />
            </div>
          ))}
        </div>
      </section>

      {/* OpenShip Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {openshipCards.map((card, index) => (
            <div key={`${card.title}-${index}`} className="w-full h-48">
              <ProductCard
                title={card.title}
                href={card.href}
                theme={card.theme}
                product={card.product}
              />
            </div>
          ))}
        </div>
      </section>

      {/* OpenFront Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {openfrontCards.map((card, index) => (
            <div key={`${card.title}-${index}`} className="w-full h-48">
              <ProductCard
                title={card.title}
                href={card.href}
                theme={card.theme}
                product={card.product}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
