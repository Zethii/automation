interface ContentRequest {
    niche: 'tech' | 'finance' | 'lifestyle';
    platform: 'tiktok' | 'instagram' | 'twitter' | 'youtube' | 'facebook' | 'pinterest';
    affiliateLinks?: string[];
}
interface GeneratedContent {
    title: string;
    content: string;
    hashtags: string[];
    callToAction: string;
}
declare class ContentGenerator {
    private openaiApiKey;
    constructor();
    /**
     * Generate AI content for a specific niche and platform
     */
    generateContent(request: ContentRequest): Promise<GeneratedContent>;
    /**
     * Generate multiple content pieces for batch scheduling
     */
    generateBatch(niche: string, count: number, platforms: string[]): Promise<GeneratedContent[]>;
    /**
     * Curate content from external sources
     */
    curateContent(niche: string): Promise<GeneratedContent>;
    /**
     * Build prompt for AI content generation
     */
    private buildPrompt;
    /**
     * Generate template content (demo)
     */
    private generateTemplateContent;
}
declare const _default: ContentGenerator;
export default _default;
//# sourceMappingURL=contentGenerator.d.ts.map