interface DataInsight {
    id: string;
    type: string;
    source: string;
    title: string;
    description: string;
    data: Record<string, any>;
    price: number;
    status: 'draft' | 'published' | 'sold';
    createdAt: Date;
    updatedAt: Date;
}
interface ScrapedData {
    source: string;
    timestamp: Date;
    data: Record<string, any>;
}
declare class DataInsights {
    private insights;
    private scrapedData;
    /**
     * Create a new data insight
     */
    createInsight(type: string, source: string, title: string, description: string, data: Record<string, any>, price: number): DataInsight;
    /**
     * Publish an insight for sale
     */
    publishInsight(insightId: string): DataInsight;
    /**
     * Scrape data from a website (ethical scraping)
     */
    scrapeData(url: string, selectors: Record<string, string>): Promise<ScrapedData>;
    /**
     * Analyze market trends
     */
    analyzeMarketTrends(niche: string): {
        trend: string;
        direction: 'up' | 'down' | 'stable';
        confidence: number;
        insights: string[];
    };
    /**
     * Get competitor insights
     */
    getCompetitorInsights(niche: string): {
        competitors: Array<{
            name: string;
            marketShare: number;
            strengths: string[];
            weaknesses: string[];
        }>;
        opportunities: string[];
    };
    /**
     * Get audience demographics
     */
    getAudienceDemographics(platform: string): {
        platform: string;
        totalUsers: number;
        demographics: {
            ageGroups: Record<string, number>;
            genders: Record<string, number>;
            topCountries: Record<string, number>;
        };
    };
    /**
     * Get all insights
     */
    getAllInsights(): DataInsight[];
    /**
     * Get published insights
     */
    getPublishedInsights(): DataInsight[];
    /**
     * Get insights by type
     */
    getInsightsByType(type: string): DataInsight[];
    /**
     * Generate market report
     */
    generateMarketReport(niche: string): {
        niche: string;
        trends: any;
        competitors: any;
        demographics: any;
        recommendations: string[];
    };
}
declare const _default: DataInsights;
export default _default;
//# sourceMappingURL=dataInsights.d.ts.map