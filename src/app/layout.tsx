import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZARIS by Zakia | Jewellery • Accessories • Gifts',
  description:
    'Little Details. Lasting Impressions. Explore handcrafted Bangladeshi luxury earrings, rings, necklaces, bangles, and gift boxes. Free delivery for Daffodil International University (DIU).',
  keywords: [
    'Zaris',
    'Zaris by Zakia',
    'Jewelry Bangladesh',
    'Accessories',
    'DIU Free Delivery',
    'Gift Boxes',
    'Rings',
    'Earrings',
    'Dhaka Online Shop',
  ],
  openGraph: {
    title: 'ZARIS by Zakia | Luxury Jewellery & Gift Shop',
    description: 'Little Details. Lasting Impressions. Shipping all over Bangladesh.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#070709] text-zinc-100 antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
