interface AffiliateLink {
    id: string;
    originalUrl: string;
    shortUrl: string;
    network: string;
    productName: string;
    commissionRate: number;
    niche: string;
    createdAt: Date;
}
interface LinkClick {
    id: string;
    linkId: string;
    platform: string;
    referrer: string;
    userAgent: string;
    ipAddress: string;
    clickedAt: Date;
}
interface Conversion {
    id: string;
    linkId: string;
    clickId: string;
    amount: number;
    commission: number;
    network: string;
    status: 'pending' | 'confirmed' | 'paid';
    convertedAt: Date;
}
declare class AffiliateTracker {
    private links;
    private clicks;
    private conversions;
    /**
     * Create a shortened affiliate link
     */
    createAffiliateLink(originalUrl: string, network: string, productName: string, commissionRate: number, niche: string): AffiliateLink;
    /**
     * Track a click on an affiliate link
     */
    trackClick(linkId: string, platform: string, referrer: string, userAgent: string, ipAddress: string): LinkClick;
    /**
     * Record a conversion
     */
    recordConversion(linkId: string, clickId: string, amount: number, network: string): Conversion;
    /**
     * Get link statistics
     */
    getLinkStats(linkId: string): {
        link: AffiliateLink;
        clicks: number;
        conversions: number;
        totalCommission: number;
        conversionRate: number;
    };
    /**
     * Get earnings summary
     */
    getEarningsSummary(): {
        totalClicks: number;
        totalConversions: number;
        totalEarnings: number;
        byNetwork: Record<string, number>;
        byNiche: Record<string, number>;
    };
    /**
     * Get top performing links
     */
    getTopLinks(limit?: number): Array<{
        link: AffiliateLink;
        clicks: number;
        conversions: number;
        commission: number;
    }>;
    /**
     * Generate a short URL
     */
    private generateShortUrl;
}
declare const _default: AffiliateTracker;
export default _default;
//# sourceMappingURL=affiliateTracker.d.ts.map