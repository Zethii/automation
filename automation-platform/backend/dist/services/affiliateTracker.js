import { v4 as uuidv4 } from 'uuid';
import { logger } from '../index';
class AffiliateTracker {
    constructor() {
        this.links = new Map();
        this.clicks = new Map();
        this.conversions = new Map();
    }
    /**
     * Create a shortened affiliate link
     */
    createAffiliateLink(originalUrl, network, productName, commissionRate, niche) {
        const linkId = uuidv4();
        const shortUrl = this.generateShortUrl(linkId);
        const link = {
            id: linkId,
            originalUrl,
            shortUrl,
            network,
            productName,
            commissionRate,
            niche,
            createdAt: new Date(),
        };
        this.links.set(linkId, link);
        logger.info(`Created affiliate link: ${shortUrl}`);
        return link;
    }
    /**
     * Track a click on an affiliate link
     */
    trackClick(linkId, platform, referrer, userAgent, ipAddress) {
        const link = this.links.get(linkId);
        if (!link) {
            throw new Error(`Link not found: ${linkId}`);
        }
        const clickId = uuidv4();
        const click = {
            id: clickId,
            linkId,
            platform,
            referrer,
            userAgent,
            ipAddress,
            clickedAt: new Date(),
        };
        this.clicks.set(clickId, click);
        logger.info(`Tracked click on link ${linkId} from ${platform}`);
        return click;
    }
    /**
     * Record a conversion
     */
    recordConversion(linkId, clickId, amount, network) {
        const link = this.links.get(linkId);
        if (!link) {
            throw new Error(`Link not found: ${linkId}`);
        }
        const commission = (amount * link.commissionRate) / 100;
        const conversionId = uuidv4();
        const conversion = {
            id: conversionId,
            linkId,
            clickId,
            amount,
            commission,
            network,
            status: 'pending',
            convertedAt: new Date(),
        };
        this.conversions.set(conversionId, conversion);
        logger.info(`Recorded conversion: ${conversionId} - Commission: $${commission}`);
        return conversion;
    }
    /**
     * Get link statistics
     */
    getLinkStats(linkId) {
        const link = this.links.get(linkId);
        if (!link) {
            throw new Error(`Link not found: ${linkId}`);
        }
        const linkClicks = Array.from(this.clicks.values()).filter((c) => c.linkId === linkId);
        const linkConversions = Array.from(this.conversions.values()).filter((c) => c.linkId === linkId);
        const totalCommission = linkConversions.reduce((sum, c) => sum + c.commission, 0);
        const conversionRate = linkClicks.length > 0 ? (linkConversions.length / linkClicks.length) * 100 : 0;
        return {
            link,
            clicks: linkClicks.length,
            conversions: linkConversions.length,
            totalCommission,
            conversionRate,
        };
    }
    /**
     * Get earnings summary
     */
    getEarningsSummary() {
        const allClicks = Array.from(this.clicks.values());
        const allConversions = Array.from(this.conversions.values());
        const totalEarnings = allConversions.reduce((sum, c) => sum + c.commission, 0);
        const byNetwork = {};
        const byNiche = {};
        allConversions.forEach((conversion) => {
            const link = this.links.get(conversion.linkId);
            if (link) {
                byNetwork[link.network] = (byNetwork[link.network] || 0) + conversion.commission;
                byNiche[link.niche] = (byNiche[link.niche] || 0) + conversion.commission;
            }
        });
        return {
            totalClicks: allClicks.length,
            totalConversions: allConversions.length,
            totalEarnings,
            byNetwork,
            byNiche,
        };
    }
    /**
     * Get top performing links
     */
    getTopLinks(limit = 10) {
        const stats = Array.from(this.links.values())
            .map((link) => {
            const linkClicks = Array.from(this.clicks.values()).filter((c) => c.linkId === link.id);
            const linkConversions = Array.from(this.conversions.values()).filter((c) => c.linkId === link.id);
            const commission = linkConversions.reduce((sum, c) => sum + c.commission, 0);
            return {
                link,
                clicks: linkClicks.length,
                conversions: linkConversions.length,
                commission,
            };
        })
            .sort((a, b) => b.commission - a.commission)
            .slice(0, limit);
        return stats;
    }
    /**
     * Generate a short URL
     */
    generateShortUrl(linkId) {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return `${baseUrl}/link/${linkId.substring(0, 8)}`;
    }
}
export default new AffiliateTracker();
//# sourceMappingURL=affiliateTracker.js.map