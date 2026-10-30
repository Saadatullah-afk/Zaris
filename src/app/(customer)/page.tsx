import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Gift, Truck, Heart, Star } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/common/Icons';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    take: 6,
    include: { _count: { select: { products: true } } },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
    include: { category: true },
  });

  const bestSellers = await prisma.product.findMany({
    where: { bestSeller: true },
    take: 8,
    include: { category: true },
  });

  const giftCollection = await prisma.product.findMany({
    where: {
      category: {
        slug: { in: ['gift-boxes', 'mens-gift-boxes', 'jewelry-sets'] },
      },
    },
    take: 4,
    include: { category: true },
  });

  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    take: 3,
    include: { product: { select: { name: true } } },
  });

  return (
    <div className="space-y-20 pb-20">
      {/* 1. LUXURY HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#D4AF37]/20">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=80"
            alt="Zaris Luxury Background"
            className="w-full h-full object-cover object-center opacity-25 filter brightness-75 scale-105 transform animate-pulse duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/90 via-transparent to-[#070709]/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1813] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handcrafted Bangladeshi Luxury</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[0.2em] gold-gradient-text uppercase drop-shadow-2xl">
              ZARIS
            </h1>
            <p className="text-xs sm:text-sm tracking-[0.4em] text-zinc-400 font-light uppercase">
              by zakia
            </p>
            <p className="text-xs sm:text-sm tracking-[0.3em] text-[#D4AF37]/80 uppercase font-medium pt-2">
              JEWELLERY | ACCESSORIES | GIFTS
            </p>
          </div>

          <p className="font-serif-luxury italic text-2xl sm:text-3xl lg:text-4xl text-zinc-200 tracking-wide font-normal max-w-2xl mx-auto">
            &ldquo;Little Details. Lasting Impressions.&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/shop"
              className="w-full sm:w-auto gold-gradient-bg text-black font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-lg hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/categories"
              className="w-full sm:w-auto bg-[#161822] hover:bg-[#1f2230] text-zinc-100 border border-[#D4AF37]/40 font-semibold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Categories</span>
            </Link>
          </div>

          {/* DIU Badge Banner */}
          <div className="pt-8 flex justify-center">
            <div className="bg-[#14120B] border border-[#D4AF37]/40 rounded-2xl px-6 py-3.5 inline-flex items-center gap-3 text-left max-w-md shadow-xl gold-border-glow">
              <Truck className="w-6 h-6 text-[#D4AF37] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">
                  Campus Special Offer
                </span>
                <p className="text-xs text-amber-100 font-semibold">
                  FREE DELIVERY AT DAFFODIL INTERNATIONAL UNIVERSITY (DIU)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-zinc-100 tracking-wider">
            Explore By Category
          </h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto opacity-70" />
          <p className="text-xs text-zinc-400 max-w-xl mx-auto uppercase tracking-widest">
            From subtle ring stacks to extravagant gift sets
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-[#101117] border border-[#D4AF37]/20 p-4 text-center hover:border-[#D4AF37] transition-all duration-300 flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/30 group-hover:scale-110 transition-transform">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif-luxury text-base font-semibold text-zinc-200 group-hover:text-[#D4AF37] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-0.5">
                  {cat._count.products} Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="font-serif-luxury text-3xl font-bold text-zinc-100 tracking-wider">
              Most Loved & Best Sellers
            </h2>
            <p className="text-xs text-zinc-400 tracking-widest uppercase">
              Top picks chosen by Zaris lovers
            </p>
          </div>
          <Link
            href="/shop?bestSeller=true"
            className="text-xs text-[#D4AF37] hover:underline uppercase tracking-wider font-semibold flex items-center gap-1"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((product: any) => {
            const images = JSON.parse(product.images || '[]');
            const mainImg = images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={product.id}
                className="group bg-[#101117] border border-[#D4AF37]/20 rounded-2xl overflow-hidden hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
              >
                <Link href={`/shop/${product.category.slug}/${product.slug}`} className="relative block overflow-hidden aspect-square bg-[#070709]">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.discountPrice && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      SALE
                    </span>
                  )}
                  {product.stock <= 0 && (
                    <span className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-red-400 uppercase tracking-widest">
                      Out of Stock
                    </span>
                  )}
                </Link>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block font-medium">
                      {product.category.name}
                    </span>
                    <Link
                      href={`/shop/${product.category.slug}/${product.slug}`}
                      className="font-serif-luxury text-base font-semibold text-zinc-100 hover:text-[#D4AF37] line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold text-[#D4AF37]">
                      ৳{product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="text-xs text-zinc-500 line-through">
                        ৳{product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE ZARIS (4 CARDS) */}
      <section className="bg-[#0C0D13] border-y border-[#D4AF37]/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-zinc-100 tracking-wider">
              Why Choose Zaris?
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto opacity-70" />
            <p className="text-xs text-zinc-400 max-w-xl mx-auto uppercase tracking-widest">
              Uncompromising quality, royal packaging, and student-friendly pricing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#12131C] border border-[#D4AF37]/20 rounded-2xl p-6 text-center space-y-3 gold-border-glow">
              <div className="w-12 h-12 rounded-full bg-[#1A1813] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">Premium Quality</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hyper-curated hypoallergenic metals, non-tarnish polishes, and authentic gemstones.
              </p>
            </div>

            <div className="bg-[#12131C] border border-[#D4AF37]/20 rounded-2xl p-6 text-center space-y-3 gold-border-glow">
              <div className="w-12 h-12 rounded-full bg-[#1A1813] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">Beautiful Packaging</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every order comes wrapped in signature Zaris gold embossed pouches and greeting notes.
              </p>
            </div>

            <div className="bg-[#12131C] border border-[#D4AF37]/20 rounded-2xl p-6 text-center space-y-3 gold-border-glow">
              <div className="w-12 h-12 rounded-full bg-[#1A1813] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">Fast & Safe Delivery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Reliable express courier service across all 64 districts in Bangladesh + Free DIU delivery.
              </p>
            </div>

            <div className="bg-[#12131C] border border-[#D4AF37]/20 rounded-2xl p-6 text-center space-y-3 gold-border-glow">
              <div className="w-12 h-12 rounded-full bg-[#1A1813] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">Made With Love</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Designed by Zakia with heartfelt passion for small details that leave lasting impressions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GIFT COLLECTION HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-gradient-to-r from-[#18150E] via-[#111219] to-[#18150E] border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
              Curated Gift Sets
            </span>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-zinc-100 leading-tight">
              Looking for the Perfect Gift?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Explore our hand-wrapped Velvet Gift Boxes and Men&apos;s Royal Ensembles. Personalize with custom handwritten greeting notes for your special someone.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=gift-boxes"
                className="inline-flex items-center gap-2 gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg hover:scale-105 transition-all"
              >
                <span>Shop Gift Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-serif-luxury text-3xl font-bold text-zinc-100 tracking-wider">
            Customer Love
          </h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto opacity-70" />
          <p className="text-xs text-zinc-400 uppercase tracking-widest">
            Real feedback from our happy buyers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev: any) => (
            <div
              key={rev.id}
              className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-2xl space-y-4"
            >
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 italic leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>
              <div className="border-t border-zinc-800 pt-3 flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-200">{rev.customerName}</span>
                <span className="text-[10px] text-zinc-500 uppercase">{rev.product?.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SOCIAL MEDIA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="space-y-2">
          <span className="text-xs text-[#D4AF37] uppercase tracking-[0.25em] font-bold">
            Follow Our Journey
          </span>
          <h2 className="font-serif-luxury text-3xl font-bold text-zinc-100">
            @Zaris_byzakia on Instagram & Facebook
          </h2>
        </div>

        <div className="flex items-center justify-center gap-4">
          <a
            href="https://facebook.com/zaris.byzakia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-[#12131C] px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-200 hover:text-[#D4AF37] transition-all"
          >
            <FacebookIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>Facebook: Zaris by Zakia</span>
          </a>
          <a
            href="https://instagram.com/zaris_byzakia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-[#12131C] px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-200 hover:text-[#D4AF37] transition-all"
          >
            <InstagramIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>Instagram: Zaris_byzakia</span>
          </a>
        </div>
      </section>
    </div>
  );
}
