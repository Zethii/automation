interface ScheduledPost {
    id: string;
    content: string;
    platforms: string[];
    scheduledTime: Date;
    affiliateLinks: Record<string, string>;
}
declare class SocialScheduler {
    private jobs;
    /**
     * Schedule a post to be published at a specific time
     */
    schedulePost(post: ScheduledPost): void;
    /**
     * Publish a post to multiple platforms
     */
    private publishPost;
    /**
     * Publish to a specific platform
     */
    private publishToPlatform;
    /**
     * Platform-specific publishing methods
     */
    private publishToInstagram;
    private publishToTikTok;
    private publishToTwitter;
    private publishToFacebook;
    private publishToYouTube;
    private publishToPinterest;
    /**
     * Cancel a scheduled post
     */
    cancelPost(postId: string): boolean;
    /**
     * Get all scheduled posts
     */
    getScheduledPosts(): string[];
    /**
     * Reschedule a post
     */
    reschedulePost(postId: string, newTime: Date): boolean;
}
declare const _default: SocialScheduler;
export default _default;
//# sourceMappingURL=socialScheduler.d.ts.map