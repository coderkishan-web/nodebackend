const SocialMediaSubscription = require('../models/SocialMediaSubscription');
const SocialMediaContent = require('../models/SocialMediaContent');

const getDashboard = async (req, res) => {
    try {
        const subscriptionId = req.params.subscriptionId;
        const subscription = await SocialMediaSubscription.getById(subscriptionId);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        const contentUsage = await SocialMediaContent.getContentUsage(subscriptionId);

        // Limits
        const contentLimits = {
            posts: { limit: parseInt(subscription.posts_limit), used: 0, remaining: parseInt(subscription.posts_limit) },
            carousels: { limit: parseInt(subscription.carousels_limit), used: 0, remaining: parseInt(subscription.carousels_limit) },
            reels: { limit: parseInt(subscription.reels_limit), used: 0, remaining: parseInt(subscription.reels_limit) },
            stories: { limit: parseInt(subscription.stories_limit), used: 0, remaining: parseInt(subscription.stories_limit) === 0 ? '∞' : parseInt(subscription.stories_limit) },
            blogs: { limit: parseInt(subscription.blogs_limit), used: 0, remaining: parseInt(subscription.blogs_limit) }
        };

        contentUsage.forEach(usage => {
            let key = usage.content_type;
            if (contentLimits[key + 's']) key = key + 's';
            if (contentLimits[key]) {
                contentLimits[key].used = parseInt(usage.used_count);
                if (contentLimits[key].limit > 0) {
                    contentLimits[key].remaining = contentLimits[key].limit - contentLimits[key].used;
                }
            }
        });

        // Pipeline
        const pipelineData = await SocialMediaContent.getByStages(subscriptionId);
        const pipelineStatus = { idea: 0, script: 0, design: 0, scheduled: 0, posted: 0 };
        pipelineData.forEach(stage => {
            pipelineStatus[stage.stage] = parseInt(stage.count);
        });

        const upcomingScheduled = await SocialMediaContent.getUpcomingScheduled(subscriptionId, 5);
        const stuckInPipeline = await SocialMediaContent.getStuckContent(subscriptionId, 7);

        res.json({
            subscription: {
                id: subscription.id,
                client_name: subscription.client_name,
                plan_name: subscription.plan_name,
                plan_price: subscription.plan_price,
                currency: subscription.currency,
                start_date: subscription.start_date,
                end_date: subscription.end_date,
                status: subscription.status
            },
            content_limits: contentLimits,
            pipeline_status: pipelineStatus,
            upcoming_scheduled: upcomingScheduled,
            stuck_in_pipeline: stuckInPipeline
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching dashboard', error: err.message });
    }
};

const getCalendar = async (req, res) => {
    try {
        const { subscriptionId, month } = req.params;
        const content = await SocialMediaContent.getAll({ subscription_id: subscriptionId, month });

        const events = content
            .filter(item => item.scheduled_date || item.posted_date)
            .map(item => ({
                id: item.id,
                title: item.title,
                content_type: item.content_type,
                date: item.scheduled_date || (item.posted_date ? new Date(item.posted_date).toISOString().split('T')[0] : null),
                stage: item.stage,
                status: item.status
            }));

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching calendar', error: err.message });
    }
};

const getStats = async (req, res) => {
    try {
        const allContent = await SocialMediaContent.getBySubscriptionId(req.params.subscriptionId);

        const stats = {
            total_content: allContent.length,
            by_type: {},
            by_stage: {},
            by_status: {}
        };

        allContent.forEach(item => {
            // Type
            stats.by_type[item.content_type] = (stats.by_type[item.content_type] || 0) + 1;
            // Stage
            stats.by_stage[item.stage] = (stats.by_stage[item.stage] || 0) + 1;
            // Status
            stats.by_status[item.status] = (stats.by_status[item.status] || 0) + 1;
        });

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats', error: err.message });
    }
};

module.exports = { getDashboard, getCalendar, getStats };
