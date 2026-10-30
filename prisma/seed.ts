import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ZARIS by Zakia database...');

  // 1. Clean existing data
  await prisma.salesRecord.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.inventoryTransaction.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Zakia Sultana',
      email: 'admin@zaris.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created Admin User:', admin.email);

  // 3. Settings
  const settings = [
    { key: 'brand_name', value: 'ZARIS by Zakia', description: 'Brand Display Name' },
    { key: 'tagline', value: 'Little Details. Lasting Impressions.', description: 'Brand Slogan' },
    { key: 'phone', value: '+880 1700-123456', description: 'Contact Phone Number' },
    { key: 'email', value: 'info@zaris.com.bd', description: 'Support Email Address' },
    { key: 'facebook_url', value: 'https://facebook.com/zaris.byzakia', description: 'Facebook Page URL' },
    { key: 'instagram_url', value: 'https://instagram.com/zaris_byzakia', description: 'Instagram Profile URL' },
    { key: 'address', value: 'Daffodil Smart City, Ashulia, Dhaka, Bangladesh', description: 'Business Address' },
    { key: 'inside_dhaka_delivery', value: '70', description: 'Delivery Charge Inside Dhaka (BDT)' },
    { key: 'outside_dhaka_delivery', value: '130', description: 'Delivery Charge Outside Dhaka (BDT)' },
    { key: 'diu_free_delivery', value: 'true', description: 'Enable Free Delivery for DIU Students' },
    { key: 'low_stock_threshold', value: '5', description: 'Low Stock Alert Threshold' },
    { key: 'currency_symbol', value: '৳', description: 'Currency Symbol' },
    { key: 'order_prefix', value: 'ZARIS-2026-', description: 'Order ID Prefix' },
  ];

  for (const setting of settings) {
    await prisma.setting.create({ data: setting });
  }

  // 4. Categories
  const categoriesData = [
    {
      name: 'Rings',
      slug: 'rings',
      description: 'Elegant adjustable, vintage & delicate everyday gold-toned rings.',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      description: 'Sophisticated stud, hoop, drop and hand-painted enamel earrings.',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Layered chains, delicate pendant necklaces and pearl chokers.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Minimalist gold chain bracelets, crystal charms and bangles.',
      image: 'https://images.unsplash.com/photo-1611591475143-be232935f478?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Bangles',
      slug: 'bangles',
      description: 'Traditional metal work, handcrafted statement cuff bangles.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Stone Rings',
      slug: 'stone-rings',
      description: 'Authentic semi-precious stone embedded gold and silver band rings.',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Enamel Bangles',
      slug: 'enamel-bangles',
      description: 'Hand-carved meenakari and royal enamel artisan bangles.',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Jewelry Sets',
      slug: 'jewelry-sets',
      description: 'Perfect matching necklace & earring ensembles for celebrations.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Gift Boxes',
      slug: 'gift-boxes',
      description: 'Curated luxury velvet gift boxes with custom greeting notes.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: "Premium Men's Gift Boxes",
      slug: 'mens-gift-boxes',
      description: 'Sophisticated cufflink, signet ring & genuine leather wallet sets.',
      image: 'https://images.unsplash.com/photo-1622445268465-843dcb07a4a2?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const categoriesMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoriesMap.set(cat.slug, created.id);
  }

  // 5. Products Data
  const productsData = [
    {
      name: 'Golden Solstice Pearl Drop Earrings',
      slug: 'golden-solstice-pearl-drop-earrings',
      sku: 'EAR-001',
      description: 'Exquisite freshwater pearl drops suspended from 18k gold-plated hypoallergenic posts. Lightweight and effortlessly regal for special celebrations or elevated daily wear.',
      price: 350,
      costPrice: 160,
      discountPrice: 299,
      stock: 24,
      categoryId: categoriesMap.get('earrings')!,
      featured: true,
      bestSeller: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['pearl', 'gold', 'earrings', 'best-seller', 'trending']),
      specs: JSON.stringify({ Material: '18k Gold Plated Brass', Gemstone: 'Freshwater Pearl', Weight: '6g', Hypoallergenic: 'Yes' }),
      careInfo: 'Keep away from perfumes, hairsprays, and harsh water. Store in Zaris airtight pouch after use.',
    },
    {
      name: 'Aura Vintage Opal Stone Ring',
      slug: 'aura-vintage-opal-stone-ring',
      sku: 'RNG-001',
      description: 'An ethereal synthetic opal set inside an intricate antique golden frame. Adjustable band design fits sizes 5 through 9 seamlessly.',
      price: 140,
      costPrice: 50,
      discountPrice: 120,
      stock: 40,
      categoryId: categoriesMap.get('stone-rings')!,
      featured: true,
      bestSeller: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['ring', 'opal', 'vintage', 'stone', 'student-favorite']),
      specs: JSON.stringify({ Band: 'Adjustable Gold Alloy', Stone: 'IR Opal', Finish: 'Antiqued Polish' }),
      careInfo: 'Avoid contact with soaps or chemical cleaners.',
    },
    {
      name: 'Celestial Layered Coin Pendant Necklace',
      slug: 'celestial-layered-coin-pendant-necklace',
      sku: 'NCK-001',
      description: 'Double-layered delicate chain featuring a vintage coin charm and a tiny starburst crystal. Adds an instant effortless chic finish to shirt tops and ethnic wear.',
      price: 450,
      costPrice: 200,
      discountPrice: 390,
      stock: 18,
      categoryId: categoriesMap.get('necklaces')!,
      featured: true,
      bestSeller: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['necklace', 'layered', 'coin', 'gold']),
      specs: JSON.stringify({ Length: '40cm + 5cm extension', Coating: 'Anti-tarnish Lacquer' }),
      careInfo: 'Store flat in dry Zaris signature box.',
    },
    {
      name: 'Royal Meenakari Floral Enamel Bangle',
      slug: 'royal-meenakari-floral-enamel-bangle',
      sku: 'BNG-001',
      description: 'Hand-painted enamel floral motifs on gold-polished brass with intricate hand-carved details. Designed for festive celebrations and everyday elegance.',
      price: 550,
      costPrice: 250,
      discountPrice: null,
      stock: 12,
      categoryId: categoriesMap.get('enamel-bangles')!,
      featured: true,
      bestSeller: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['bangle', 'enamel', 'meenakari', 'traditional']),
      specs: JSON.stringify({ Size: '2.4 / 2.6', Craft: 'Hand Painted Meenakari' }),
      careInfo: 'Wipe with soft velvet microfiber cloth after wearing.',
    },
    {
      name: 'Minimalist Starlight Gold Studs',
      slug: 'minimalist-starlight-gold-studs',
      sku: 'EAR-002',
      description: 'Tiny star-shaped cz studded ear studs designed for understated charm. Perfect for daily university classes or work.',
      price: 80,
      costPrice: 30,
      discountPrice: null,
      stock: 50,
      categoryId: categoriesMap.get('earrings')!,
      featured: false,
      bestSeller: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['studs', 'everyday', 'budget-friendly', 'diu-popular']),
      specs: JSON.stringify({ Size: '6mm x 6mm', Closure: 'Push Back' }),
      careInfo: 'Water resistant design.',
    },
    {
      name: 'Champagne Crystal Charm Bracelet',
      slug: 'champagne-crystal-charm-bracelet',
      sku: 'BRC-001',
      description: 'Delicate gold chain adorned with faceted champagne crystal drops and a heart charm. Includes adjustable clasp extension.',
      price: 280,
      costPrice: 110,
      discountPrice: 240,
      stock: 15,
      categoryId: categoriesMap.get('bracelets')!,
      featured: false,
      bestSeller: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611591475143-be232935f478?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['bracelet', 'crystal', 'champagne', 'gift']),
      specs: JSON.stringify({ Length: '16cm + 4cm', Crystal: 'Austrian Faceted Glass' }),
      careInfo: 'Clean gently with micro-fiber polish cloth.',
    },
    {
      name: 'Velvet Romance Jewelry Gift Box Set',
      slug: 'velvet-romance-jewelry-gift-box-set',
      sku: 'GFT-001',
      description: 'Complete romantic gift box featuring a gold pendant necklace, matching pearl studs, a customized handwritten card, and a luxury Zaris velvet box wrapper.',
      price: 1250,
      costPrice: 580,
      discountPrice: 1090,
      stock: 8,
      categoryId: categoriesMap.get('gift-boxes')!,
      featured: true,
      bestSeller: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['gift-box', 'birthday-gift', 'anniversary', 'premium']),
      specs: JSON.stringify({ Includes: 'Necklace + Earrings + Greeting Card + Velvet Box', Ribbon: 'Gold Satin' }),
      careInfo: 'Ready to gift with signature gold wax seal stamp.',
    },
    {
      name: "Gentleman's Royal Signet & Cufflink Gift Ensemble",
      slug: 'gentlemans-royal-signet-cufflink-gift-ensemble',
      sku: 'GFT-MEN-001',
      description: 'Sophisticated men gift set including a matte black onyx signet ring, matching stainless steel cufflinks, and a premium Zaris magnetic box.',
      price: 1850,
      costPrice: 850,
      discountPrice: 1650,
      stock: 6,
      categoryId: categoriesMap.get('mens-gift-boxes')!,
      featured: true,
      bestSeller: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1622445268465-843dcb07a4a2?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['mens-gift', 'cufflinks', 'signet-ring', 'luxury']),
      specs: JSON.stringify({ RingSize: 'Adjustable', CufflinkMaterial: 'Stainless Steel & Black Enamel' }),
      careInfo: 'Wipe metal parts clean after evening events.',
    },
    {
      name: 'Empress Emerald Crystal Bridal Jewelry Set',
      slug: 'empress-emerald-crystal-bridal-jewelry-set',
      sku: 'SET-001',
      description: 'Grand festive choker necklace and heavy statement earrings embellished with simulated deep emerald stones and cz teardrops.',
      price: 2200,
      costPrice: 950,
      discountPrice: 1950,
      stock: 4,
      categoryId: categoriesMap.get('jewelry-sets')!,
      featured: true,
      bestSeller: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['jewelry-set', 'emerald', 'bridal', 'party-wear']),
      specs: JSON.stringify({ SetType: 'Choker + Earrings', Plating: 'High Polish 24k Gold Dip' }),
      careInfo: 'Store in padded velvet display box.',
    },
    {
      name: 'Minimalist Gold Wave Stacking Ring Set (3 Pcs)',
      slug: 'minimalist-gold-wave-stacking-ring-set',
      sku: 'RNG-002',
      description: 'Trio of versatile slim textured wave rings designed to be worn stacked together or solo across multiple fingers.',
      price: 100,
      costPrice: 40,
      discountPrice: null,
      stock: 35,
      categoryId: categoriesMap.get('rings')!,
      featured: false,
      bestSeller: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
      ]),
      tags: JSON.stringify(['ring-set', 'stackable', 'minimal', 'budget-friendly']),
      specs: JSON.stringify({ Count: '3 Rings', Sizes: 'Mixed 6, 7, 8' }),
      careInfo: 'Durable electro-plating.',
    }
  ];

  const createdProducts = [];
  for (const prod of productsData) {
    const created = await prisma.product.create({ data: prod });
    createdProducts.push(created);

    // Add initial inventory transaction
    await prisma.inventoryTransaction.create({
      data: {
        productId: created.id,
        stockIn: prod.stock,
        stockOut: 0,
        remainingStock: prod.stock,
        reason: 'Initial Batch Inventory Setup',
        reference: 'INIT-STOCK',
        adminName: 'Zakia Sultana',
      },
    });
  }
  console.log(`Created ${createdProducts.length} Products & Inventory logs.`);

  // 6. Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Nusrat Jahan (DIU Student)',
      phone: '01711223344',
      email: 'nusrat.diu@gmail.com',
      address: 'Daffodil Smart City, Female Hall 2, Ashulia',
      district: 'Dhaka',
      area: 'Daffodil International University (DIU)',
      totalOrders: 2,
      totalSpent: 1440,
      notes: 'DIU Regular Customer - Free Delivery Applied',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Tanvir Hossain',
      phone: '01899887766',
      email: 'tanvir.h@yahoo.com',
      address: 'House 42, Road 11, Banani',
      district: 'Dhaka',
      area: 'Inside Dhaka',
      totalOrders: 1,
      totalSpent: 1720,
      notes: 'Ordered Men Gift Box',
    },
  });

  // 7. Orders & Sales Records & Expenses
  const order1Id = 'ZARIS-2026-0001';
  const order1 = await prisma.order.create({
    data: {
      orderId: order1Id,
      customerId: customer1.id,
      customerName: customer1.name,
      phone: customer1.phone,
      email: customer1.email,
      address: customer1.address,
      district: 'Dhaka',
      area: 'Daffodil International University (DIU)',
      deliveryNote: 'Please deliver near DIU Knowledge Tower during lunch hour.',
      deliveryCharge: 0,
      subtotal: 1380,
      total: 1380,
      paymentMethod: 'COD',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      notes: 'DIU Free Delivery',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            productName: createdProducts[0].name,
            sku: createdProducts[0].sku,
            price: 299,
            costPrice: 160,
            quantity: 1,
            subtotal: 299,
          },
          {
            productId: createdProducts[6].id,
            productName: createdProducts[6].name,
            sku: createdProducts[6].sku,
            price: 1081,
            costPrice: 580,
            quantity: 1,
            subtotal: 1081,
          },
        ],
      },
    },
  });

  // Sales Record for Order 1
  await prisma.salesRecord.create({
    data: {
      type: 'SALE',
      categoryName: 'Gift Boxes',
      productId: createdProducts[6].id,
      productName: createdProducts[6].name,
      quantity: 1,
      costPrice: 580,
      sellingPrice: 1081,
      total: 1081,
      profit: 501,
      paymentMethod: 'COD',
      customerName: customer1.name,
      notes: `Order #${order1Id}`,
    },
  });

  await prisma.salesRecord.create({
    data: {
      type: 'SALE',
      categoryName: 'Earrings',
      productId: createdProducts[0].id,
      productName: createdProducts[0].name,
      quantity: 1,
      costPrice: 160,
      sellingPrice: 299,
      total: 299,
      profit: 139,
      paymentMethod: 'COD',
      customerName: customer1.name,
      notes: `Order #${order1Id}`,
    },
  });

  const order2Id = 'ZARIS-2026-0002';
  await prisma.order.create({
    data: {
      orderId: order2Id,
      customerId: customer2.id,
      customerName: customer2.name,
      phone: customer2.phone,
      email: customer2.email,
      address: customer2.address,
      district: 'Dhaka',
      area: 'Inside Dhaka',
      deliveryCharge: 70,
      subtotal: 1650,
      total: 1720,
      paymentMethod: 'BKASH',
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      notes: 'bKash TrxID: 9H7X8192A',
      items: {
        create: [
          {
            productId: createdProducts[7].id,
            productName: createdProducts[7].name,
            sku: createdProducts[7].sku,
            price: 1650,
            costPrice: 850,
            quantity: 1,
            subtotal: 1650,
          },
        ],
      },
    },
  });

  // 8. Business Expenses
  const expensesData = [
    {
      category: 'PACKAGING',
      description: 'Custom Gold Embossed Zaris Velvet Pouches & Boxes (500 Pcs)',
      amount: 4500,
      paymentMethod: 'BANK',
      notes: 'Local Dhaka Box Artisan Batch 3',
    },
    {
      category: 'MARKETING',
      description: 'Instagram & Facebook Ads Campaign - Eid Collection Showcase',
      amount: 2800,
      paymentMethod: 'CARD',
      notes: 'Targeting DIU & Dhaka female students',
    },
    {
      category: 'DELIVERY',
      description: 'Steadfast Courier Monthly Rider Settlement',
      amount: 1400,
      paymentMethod: 'BKASH',
      notes: 'Dispatched 28 packages',
    },
    {
      category: 'RAW_MATERIALS',
      description: 'Freshwater Pearls & 18k Gold Plated Plating Materials',
      amount: 6200,
      paymentMethod: 'BANK',
      notes: 'Imported findings',
    },
  ];

  for (const exp of expensesData) {
    await prisma.expense.create({ data: exp });
  }

  // 9. Customer Reviews
  const reviewsData = [
    {
      productId: createdProducts[0].id,
      customerName: 'Samira A.',
      rating: 5,
      comment: 'Absolutely in love with these pearl earrings! Got them delivered right inside DIU campus within 24 hours. The packaging feels super luxury!',
      isApproved: true,
    },
    {
      productId: createdProducts[1].id,
      customerName: 'Faria H.',
      rating: 5,
      comment: 'The stone shines so beautifully under light. Extremely good quality for only 120 taka!',
      isApproved: true,
    },
    {
      productId: createdProducts[6].id,
      customerName: 'Ayesha K.',
      rating: 5,
      comment: 'Bought this gift box for my sister’s birthday. She was thrilled! The velvet box and custom card were stunning.',
      isApproved: true,
    },
  ];

  for (const rev of reviewsData) {
    await prisma.review.create({ data: rev });
  }

  console.log('ZARIS by Zakia Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
