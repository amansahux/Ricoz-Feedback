
import { Response } from '../models/response.model.js';
import { calculateNPS, calculateCSAT, calculateCES } from '../utils/calculateMetrics.js';

export const analyticsService = {
  async getOverview(organizationId) {
    const responses = await Response.find({ organizationId });

    const nps = calculateNPS(responses);
    const csat = calculateCSAT(responses);
    const ces = calculateCES(responses);

    const sentiments = {
      positive: responses.filter(r => r.sentiment === 'positive').length,
      neutral: responses.filter(r => r.sentiment === 'neutral').length,
      negative: responses.filter(r => r.sentiment === 'negative').length,
    };

    const topics = {};
    responses.forEach(r => {
      if (r.topics) {
        r.topics.forEach(topic => {
          topics[topic] = (topics[topic] || 0) + 1;
        });
      }
    });

    return {
      totalResponses: responses.length,
      nps,
      csat,
      ces,
      sentiments,
      topTopics: Object.entries(topics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([topic, count]) => ({ topic, count })),
    };
  },

  async getTrends(organizationId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const responses = await Response.find({
      organizationId,
      createdAt: { $gte: startDate },
    });

    // Group by date
    const dailyData = {};
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        count: 0,
        nps: null,
        csat: null,
        ces: null,
      };
    }

    responses.forEach(r => {
      const dateStr = r.createdAt.toISOString().split('T')[0];
      if (dailyData[dateStr]) {
        dailyData[dateStr].count += 1;
      }
    });

    return Object.values(dailyData);
  },
};