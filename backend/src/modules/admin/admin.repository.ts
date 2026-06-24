import { prisma } from '../../database/prisma';

export class AdminRepository {
  async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      paidOrders,
      totalRevenue,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { estado: 'PENDIENTE' } }),
      prisma.order.count({ where: { estado: 'PAGADO' } }),
      prisma.order.aggregate({
        where: { estado: { in: ['PAGADO', 'ENVIADO', 'ENTREGADO'] } },
        _sum: { total: true },
      }),
      prisma.inventory.count({ where: { stock: { lte: 5 } } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { nombre: true, email: true } },
          items: { select: { id: true } },
        },
      }),
    ]);

    const ordersByStatus = await prisma.order.groupBy({
      by: ['estado'],
      _count: { id: true },
    });

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { cantidad: true },
      orderBy: { _sum: { cantidad: 'desc' } },
      take: 5,
    });

    const productDetails = await Promise.all(
      topProducts.map(async (tp) => {
        const product = await prisma.product.findUnique({
          where: { id: tp.productId },
          select: { id: true, nombre: true, imagen: true },
        });
        return { ...product, totalSold: tp._sum.cantidad };
      })
    );

    return {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        paidOrders,
        totalRevenue: Number(totalRevenue._sum.total ?? 0),
        lowStockProducts,
      },
      ordersByStatus: ordersByStatus.map((o) => ({
        estado: o.estado,
        count: o._count.id,
      })),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        total: Number(o.total),
        estado: o.estado,
        fecha: o.fecha,
        user: o.user,
        itemCount: o.items.length,
      })),
      topProducts: productDetails,
    };
  }

  async getOperationLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.operationLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.operationLog.count(),
    ]);

    return { logs, total, page, limit };
  }
}

export const adminRepository = new AdminRepository();
