import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestSeller');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');

    const where: any = {};

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (featured === 'true') where.featured = true;
    if (bestSeller === 'true') where.bestSeller = true;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };
    if (sort === 'best-selling') orderBy = { bestSeller: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      price,
      costPrice,
      discountPrice,
      stock,
      categoryId,
      featured,
      bestSeller,
      status,
      images,
      tags,
      specs,
      careInfo,
    } = body;

    if (!name || !sku || price === undefined || costPrice === undefined || !categoryId) {
      return NextResponse.json({ error: 'Name, SKU, Price, Cost Price, and Category are required' }, { status: 400 });
    }

    const generatedSlug = slug
      ? slug.trim().toLowerCase().replace(/\s+/g, '-')
      : name.trim().toLowerCase().replace(/\s+/g, '-');

    const product = await prisma.$transaction(async (tx: any) => {
      const newProduct = await tx.product.create({
        data: {
          name,
          slug: `${generatedSlug}-${Date.now().toString().slice(-4)}`,
          sku,
          description: description || '',
          price: parseFloat(price),
          costPrice: parseFloat(costPrice),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          stock: parseInt(stock) || 0,
          categoryId,
          featured: Boolean(featured),
          bestSeller: Boolean(bestSeller),
          status: status || 'ACTIVE',
          images: typeof images === 'string' ? images : JSON.stringify(images || []),
          tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
          specs: typeof specs === 'string' ? specs : JSON.stringify(specs || {}),
          careInfo,
        },
      });

      if (parseInt(stock) > 0) {
        await tx.inventoryTransaction.create({
          data: {
            productId: newProduct.id,
            stockIn: parseInt(stock),
            stockOut: 0,
            remainingStock: parseInt(stock),
            reason: 'Product Created Stock Addition',
            reference: `PRODUCT-CREATE-${newProduct.sku}`,
            adminName: session.name || 'Admin',
          },
        });
      }

      return newProduct;
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
