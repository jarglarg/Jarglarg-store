import Link from 'next/link';
import { prisma } from '@/lib/db';

// This function runs at build time to generate the static page
async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      take: 8,
    });
    return products;
  } catch (error) {
    console.error("Database Error:", error);
    return []; // Return empty array if there's an error (e.g., no database connection for build)
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  const calculateDiscount = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 py-16 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">JargLarg Store</h1>
        <p className="text-xl">Everything You Need, For Less!</p>
        <a href="#products" className="mt-6 inline-block bg-white text-rose-600 font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          View Super Deals
        </a>
      </div>

      {/* Super Deals Section */}
      <div id="products" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-2">🔥 Super Deals</h2>
        <p className="text-gray-600 text-center mb-8">Prices so low, they&apos;re JargLarg!</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  {/* Discount Badge */}
                  {product.originalPrice > product.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {calculateDiscount(Number(product.originalPrice), Number(product.price))}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-rose-600">${product.price.toString()}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice.toString()}
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-rose-500 text-white py-2 px-4 rounded-md text-sm font-medium text-center">
                    View Deal
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No super deals yet! Check back soon.</p>
            <p className="text-sm text-gray-400 mt-2">(The database is empty. Products will appear here once added.)</p>
          </div>
        )}
      </div>
    </div>
  );
}
