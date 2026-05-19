import { v4 as uuidv4 } from 'uuid';
import { logger } from '../index';

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

class AffiliateTracker {
  private links: Map<string, AffiliateLink> = new Map();
  private clicks: Map<string, LinkClick> = new Map();
  private conversions: Map<string, Conversion> = new Map();

  /**
   * Create a shortened affiliate link
   */
  createAffiliateLink(
    originalUrl: string,
    network: string,
    productName: string,
    commissionRate: number,
    niche: string
  ): AffiliateLink {
    const linkId = uuidv4();
    const shortUrl = this.generateShortUrl(linkId);

    const link: AffiliateLink = {
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
  trackClick(
    linkId: string,
    platform: string,
    referrer: string,
    userAgent: string,
    ipAddress: string
  ): LinkClick {
    const link = this.links.get(linkId);
    if (!link) {
      throw new Error(`Link not found: ${linkId}`);
    }

    const clickId = uuidv4();
    const click: LinkClick = {
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
  recordConversion(
    linkId: string,
    clickId: string,
    amount: number,
    network: string
  ): Conversion {
    const link = this.links.get(linkId);
    if (!link) {
      throw new Error(`Link not found: ${linkId}`);
    }

    const commission = (amount * link.commissionRate) / 100;
    const conversionId = uuidv4();

    const conversion: Conversion = {
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
  getLinkStats(linkId: string): {
    link: AffiliateLink;
    clicks: number;
    conversions: number;
    totalCommission: number;
    conversionRate: number;
  } {
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
  getEarningsSummary(): {
    totalClicks: number;
    totalConversions: number;
    totalEarnings: number;
    byNetwork: Record<string, number>;
    byNiche: Record<string, number>;
  } {
    const allClicks = Array.from(this.clicks.values());
    const allConversions = Array.from(this.conversions.values());

    const totalEarnings = allConversions.reduce((sum, c) => sum + c.commission, 0);

    const byNetwork: Record<string, number> = {};
    const byNiche: Record<string, number> = {};

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
  getTopLinks(limit: number = 10): Array<{
    link: AffiliateLink;
    clicks: number;
    conversions: number;
    commission: number;
  }> {
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
  private generateShortUrl(linkId: string): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return `${baseUrl}/link/${linkId.substring(0, 8)}`;
  }
}

export default new AffiliateTracker();
