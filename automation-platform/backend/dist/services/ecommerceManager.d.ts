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
declare class EcommerceManager {
    private products;
    private orders;
    /**
     * Create a new product
     */
    createProduct(title: string, description: string, price: number, cost: number, sku: string, imageUrls: string[], inventoryCount: number): Product;
    /**
     * List product on a platform
     */
    listProductOnPlatform(productId: string, platform: string, platformProductId: string): Product;
    /**
     * Update product inventory
     */
    updateInventory(productId: string, quantity: number): Product;
    /**
     * Create an order
     */
    createOrder(productId: string, quantity: number, platform: string): Order;
    /**
     * Update order status
     */
    updateOrderStatus(orderId: string, status: Order['status']): Order;
    /**
     * Get product details
     */
    getProduct(productId: string): Product | undefined;
    /**
     * Get all products
     */
    getAllProducts(): Product[];
    /**
     * Get product by SKU
     */
    getProductBySku(sku: string): Product | undefined;
    /**
     * Get sales statistics
     */
    getSalesStats(): {
        totalOrders: number;
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
        averageOrderValue: number;
        byPlatform: Record<string, {
            orders: number;
            revenue: number;
        }>;
    };
    /**
     * Sync inventory across platforms
     */
    syncInventory(productId: string): boolean;
    /**
     * Get low stock alerts
     */
    getLowStockAlerts(threshold?: number): Product[];
}
declare const _default: EcommerceManager;
export default _default;
//# sourceMappingURL=ecommerceManager.d.ts.map