import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { convertToCSV } from '@/lib/csv';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'this-month'; // today, this-week, this-month, last-month, this-year, custom
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const exportCsv = searchParams.get('export') === 'csv';

    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (range === 'this-week') {
      const firstDayOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.setDate(firstDayOfWeek));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
    } else if (range === 'this-month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (range === 'last-month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    } else if (range === 'this-year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    } else if (range === 'custom' && startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
    } else {
      // Default all time or recent 30 days
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date();
    }

    const dateFilter = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // 1. Fetch Orders in range
    const orders = await prisma.order.findMany({
      where: dateFilter,
      include: { items: true },
    });

    // 2. Fetch Sales Records in range
    const salesRecords = await prisma.salesRecord.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // 3. Fetch Expenses in range
    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // 4. Products & Stock counts
    const products = await prisma.product.findMany();
    const lowStockSetting = await prisma.setting.findUnique({ where: { key: 'low_stock_threshold' } });
    const threshold = parseInt(lowStockSetting?.value || '5');

    const inStockCount = products.filter((p: any) => p.stock > 0).length;
    const lowStockCount = products.filter((p: any) => p.stock > 0 && p.stock <= threshold).length;

    // 5. Calculations
    const validOrders = orders.filter((o: any) => o.orderStatus !== 'CANCELLED');
    const totalSales = validOrders.reduce((sum: number, o: any) => sum + o.total, 0);

    let totalCost = 0;
    validOrders.forEach((o: any) => {
      o.items.forEach((item: any) => {
        totalCost += item.costPrice * item.quantity;
      });
    });

    const grossProfit = totalSales - totalCost;
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const netProfit = grossProfit - totalExpenses;

    const totalOrdersCount = orders.length;
    const pendingOrdersCount = orders.filter((o: any) => o.orderStatus === 'PENDING').length;

    // CSV Export requested
    if (exportCsv) {
      const csvData = salesRecords.map((s: any) => ({
        Date: new Date(s.date).toISOString().split('T')[0],
        Type: s.type,
        Category: s.categoryName,
        Product: s.productName,
        Quantity: s.quantity,
        CostPrice: s.costPrice,
        SellingPrice: s.sellingPrice,
        Total: s.total,
        Profit: s.profit,
        PaymentMethod: s.paymentMethod,
        Customer: s.customerName,
      }));

      const csvString = convertToCSV(csvData);
      return new Response(csvString, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="zaris-financial-report-${range}.csv"`,
        },
      });
    }

    // 6. Chart Datasets
    // A. Sales & Profit over time (group by date string)
    const salesMap: Record<string, { date: string; sales: number; profit: number }> = {};
    salesRecords.forEach((s: any) => {
      const day = new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!salesMap[day]) {
        salesMap[day] = { date: day, sales: 0, profit: 0 };
      }
      salesMap[day].sales += s.total;
      salesMap[day].profit += s.profit;
    });
    const salesOverTime = Object.values(salesMap);

    // B. Expenses breakdown by Category
    const expenseMap: Record<string, number> = {};
    expenses.forEach((e: any) => {
      expenseMap[e.category] = (expenseMap[e.category] || 0) + e.amount;
    });
    const expensesByCategory = Object.entries(expenseMap).map(([category, amount]) => ({
      category,
      amount,
    }));

    // C. Best-Selling Products
    const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
    salesRecords.forEach((s: any) => {
      if (!productSalesMap[s.productName]) {
        productSalesMap[s.productName] = { name: s.productName, quantity: 0, revenue: 0 };
      }
      productSalesMap[s.productName].quantity += s.quantity;
      productSalesMap[s.productName].revenue += s.total;
    });
    const bestSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // D. Order Status Distribution
    const statusMap: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      READY_TO_SHIP: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    orders.forEach((o: any) => {
      statusMap[o.orderStatus] = (statusMap[o.orderStatus] || 0) + 1;
    });
    const orderStatusDistribution = Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    }));

    return NextResponse.json({
      summary: {
        totalSales,
        totalCost,
        grossProfit,
        totalExpenses,
        netProfit,
        totalOrders: totalOrdersCount,
        pendingOrders: pendingOrdersCount,
        inStockProducts: inStockCount,
        lowStockProducts: lowStockCount,
        profitMargin: totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) + '%' : '0%',
      },
      charts: {
        salesOverTime,
        expensesByCategory,
        bestSellingProducts,
        orderStatusDistribution,
      },
    });
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ error: 'Failed to compile report metrics' }, { status: 500 });
  }
}
