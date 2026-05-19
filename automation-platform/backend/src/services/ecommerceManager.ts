import { v4 as uuidv4 } from 'uuid';
import { logger } from '../index';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  cost: number;
  sku: string;
  imageUrls: string[];
  platforms: Record<string, string>;
  inventoryCount: number;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  platform: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

class EcommerceManager {
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();

  /**
   * Create a new product
   */
  createProduct(
    title: string,
    description: string,
    price: number,
    cost: number,
    sku: string,
    imageUrls: string[],
    inventoryCount: number
  ): Product {
    const productId = uuidv4();
    const product: Product = {
      id: productId,
      title,
      description,
      price,
      cost,
      sku,
      imageUrls,
      platforms: {},
      inventoryCount,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.set(productId, product);
    logger.info(`Created product: ${title} (${sku})`);
    return product;
  }

  /**
   * List product on a platform
   */
  listProductOnPlatform(productId: string, platform: string, platformProductId: string): Product {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    product.platforms[platform] = platformProductId;
    product.updatedAt = new Date();

    logger.info(`Listed product ${productId} on ${platform}`);
    return product;
  }

  /**
   * Update product inventory
   */
  updateInventory(productId: string, quantity: number): Product {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    product.inventoryCount = Math.max(0, product.inventoryCount + quantity);
    product.updatedAt = new Date();

    logger.info(`Updated inventory for ${productId}: ${product.inventoryCount}`);
    return product;
  }

  /**
   * Create an order
   */
  createOrder(productId: string, quantity: number, platform: string): Order {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    if (product.inventoryCount < quantity) {
      throw new Error('Insufficient inventory');
    }

    const orderId = uuidv4();
    const totalPrice = product.price * quantity;

    const order: Order = {
      id: orderId,
      productId,
      quantity,
      totalPrice,
      platform,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.set(orderId, order);
    this.updateInventory(productId, -quantity);

    logger.info(`Created order: ${orderId} - ${quantity}x ${product.title}`);
    return order;
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: Order['status']): Order {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    order.status = status;
    order.updatedAt = new Date();

    logger.info(`Updated order ${orderId} status to ${status}`);
    return order;
  }

  /**
   * Get product details
   */
  getProduct(productId: string): Product | undefined {
    return this.products.get(productId);
  }

  /**
   * Get all products
   */
  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  /**
   * Get product by SKU
   */
  getProductBySku(sku: string): Product | undefined {
    return Array.from(this.products.values()).find((p) => p.sku === sku);
  }

  /**
   * Get sales statistics
   */
  getSalesStats(): {
    totalOrders: number;
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    averageOrderValue: number;
    byPlatform: Record<string, { orders: number; revenue: number }>;
  } {
    const allOrders = Array.from(this.orders.values());
    const completedOrders = allOrders.filter((o) => o.status === 'delivered');

    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalCost = completedOrders.reduce((sum, o) => {
      const product = this.products.get(o.productId);
      return sum + (product ? product.cost * o.quantity : 0);
    }, 0);

    const byPlatform: Record<string, { orders: number; revenue: number }> = {};
    completedOrders.forEach((order) => {
      if (!byPlatform[order.platform]) {
        byPlatform[order.platform] = { orders: 0, revenue: 0 };
      }
      byPlatform[order.platform].orders += 1;
      byPlatform[order.platform].revenue += order.totalPrice;
    });

    return {
      totalOrders: allOrders.length,
      totalRevenue,
      totalCost,
      totalProfit: totalRevenue - totalCost,
      averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
      byPlatform,
    };
  }

  /**
   * Sync inventory across platforms
   */
  syncInventory(productId: string): boolean {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    // In production, this would sync with actual platform APIs
    logger.info(`Synced inventory for ${productId} across ${Object.keys(product.platforms).length} platforms`);
    return true;
  }

  /**
   * Get low stock alerts
   */
  getLowStockAlerts(threshold: number = 10): Product[] {
    return Array.from(this.products.values()).filter((p) => p.inventoryCount <= threshold && p.status === 'active');
  }
}

export default new EcommerceManager();
