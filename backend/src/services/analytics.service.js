
import mongoose from 'mongoose';
import { Response } from '../models/response.model.js';

const parseRangeDays = (range) => {
  switch (range) {
    case '7d':
      return 7;
    case '90d':
      return 90;
    case '30d':
    default:
      return 30;
  }
};

const calculatePercentChange = (current, previous) => {
  if (previous === null || previous === undefined || previous === 0) {
    if (current === 0 || current === null || current === undefined) return 0;
    return 100;
  }
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
};

export const analyticsService = {
  async getOverview(organizationId, range = '30d') {
    const days = parseRangeDays(range);
    const orgId = typeof organizationId === 'string' ? new mongoose.Types.ObjectId(organizationId) : organizationId;

    const now = new Date();
    const currentStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const previousStart = new Date(now.getTime() - 2 * days * 24 * 60 * 60 * 1000);

    // Run aggregation for both periods
    const [currentPeriodData, prevPeriodData] = await Promise.all([
      Response.aggregate([
        {
          $match: {
            organizationId: orgId,
            createdAt: { $gte: currentStart, $lte: now },
          },
        },
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalResponses: { $sum: 1 },
                  // NPS
                  npsCount: {
                    $sum: {
                      $cond: [{ $and: [{ $ne: ['$npsScore', null] }, { $gte: ['$npsScore', 0] }] }, 1, 0],
                    },
                  },
                  promoters: {
                    $sum: { $cond: [{ $gte: ['$npsScore', 9] }, 1, 0] },
                  },
                  passives: {
                    $sum: {
                      $cond: [
                        { $and: [{ $gte: ['$npsScore', 7] }, { $lte: ['$npsScore', 8] }] },
                        1,
                        0,
                      ],
                    },
                  },
                  detractors: {
                    $sum: {
                      $cond: [
                        { $and: [{ $ne: ['$npsScore', null] }, { $lte: ['$npsScore', 6] }] },
                        1,
                        0,
                      ],
                    },
                  },
                  // CSAT
                  csatCount: {
                    $sum: {
                      $cond: [{ $and: [{ $ne: ['$csatScore', null] }, { $gte: ['$csatScore', 1] }] }, 1, 0],
                    },
                  },
                  satisfied: {
                    $sum: { $cond: [{ $gte: ['$csatScore', 4] }, 1, 0] },
                  },
                  csatSum: {
                    $sum: {
                      $cond: [{ $ne: ['$csatScore', null] }, '$csatScore', 0],
                    },
                  },
                  // CES
                  cesCount: {
                    $sum: {
                      $cond: [{ $and: [{ $ne: ['$cesScore', null] }, { $gte: ['$cesScore', 1] }] }, 1, 0],
                    },
                  },
                  cesSum: {
                    $sum: {
                      $cond: [{ $ne: ['$cesScore', null] }, '$cesScore', 0],
                    },
                  },
                  effortless: {
                    $sum: { $cond: [{ $gte: ['$cesScore', 5] }, 1, 0] },
                  },
                  // Sentiment
                  positiveSentiment: {
                    $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] },
                  },
                  neutralSentiment: {
                    $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] },
                  },
                  negativeSentiment: {
                    $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] },
                  },
                },
              },
            ],
            dailyVolume: [
              {
                $group: {
                  _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                  },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
            topics: [
              { $unwind: { path: '$topics', preserveNullAndEmptyArrays: false } },
              { $match: { topics: { $ne: '' } } },
              {
                $group: {
                  _id: '$topics',
                  count: { $sum: 1 },
                },
              },
              { $sort: { count: -1 } },
              { $limit: 10 },
            ],
          },
        },
      ]),
      Response.aggregate([
        {
          $match: {
            organizationId: orgId,
            createdAt: { $gte: previousStart, $lt: currentStart },
          },
        },
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalResponses: { $sum: 1 },
                  npsCount: {
                    $sum: {
                      $cond: [{ $and: [{ $ne: ['$npsScore', null] }, { $gte: ['$npsScore', 0] }] }, 1, 0],
                    },
                  },
                  promoters: {
                    $sum: { $cond: [{ $gte: ['$npsScore', 9] }, 1, 0] },
                  },
                  detractors: {
                    $sum: {
                      $cond: [
                        { $and: [{ $ne: ['$npsScore', null] }, { $lte: ['$npsScore', 6] }] },
                        1,
                        0,
                      ],
                    },
                  },
                  csatCount: {
                    $sum: {
                      $cond: [{ $and: [{ $ne: ['$csatScore', null] }, { $gte: ['$csatScore', 1] }] }, 1, 0],
                    },
                  },
                  satisfied: {
                    $sum: { $cond: [{ $gte: ['$csatScore', 4] }, 1, 0] },
                  },
                  cesCount: {
                    $sum: {
                      $cond: [{ $and: [{ $ne: ['$cesScore', null] }, { $gte: ['$cesScore', 1] }] }, 1, 0],
                    },
                  },
                  cesSum: {
                    $sum: {
                      $cond: [{ $ne: ['$cesScore', null] }, '$cesScore', 0],
                    },
                  },
                  effortless: {
                    $sum: { $cond: [{ $gte: ['$cesScore', 5] }, 1, 0] },
                  },
                },
              },
            ],
            dailyVolume: [
              {
                $group: {
                  _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                  },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ]),
    ]);

    const currentSummary = currentPeriodData[0]?.summary[0] || {};
    const prevSummary = prevPeriodData[0]?.summary[0] || {};

    const totalResponsesCur = currentSummary.totalResponses || 0;
    const totalResponsesPrev = prevSummary.totalResponses || 0;

    // NPS Calculation
    const npsCountCur = currentSummary.npsCount || 0;
    const promotersCur = currentSummary.promoters || 0;
    const passivesCur = currentSummary.passives || 0;
    const detractorsCur = currentSummary.detractors || 0;

    const promoterPercentCur = npsCountCur > 0 ? Math.round((promotersCur / npsCountCur) * 100) : 0;
    const passivePercentCur = npsCountCur > 0 ? Math.round((passivesCur / npsCountCur) * 100) : 0;
    const detractorPercentCur = npsCountCur > 0 ? Math.round((detractorsCur / npsCountCur) * 100) : 0;
    const npsValueCur = npsCountCur > 0 ? promoterPercentCur - detractorPercentCur : null;

    const npsCountPrev = prevSummary.npsCount || 0;
    const promotersPrev = prevSummary.promoters || 0;
    const detractorsPrev = prevSummary.detractors || 0;
    const promoterPercentPrev = npsCountPrev > 0 ? Math.round((promotersPrev / npsCountPrev) * 100) : 0;
    const detractorPercentPrev = npsCountPrev > 0 ? Math.round((detractorsPrev / npsCountPrev) * 100) : 0;
    const npsValuePrev = npsCountPrev > 0 ? promoterPercentPrev - detractorPercentPrev : null;

    // CSAT Calculation
    const csatCountCur = currentSummary.csatCount || 0;
    const satisfiedCur = currentSummary.satisfied || 0;
    const csatSumCur = currentSummary.csatSum || 0;
    const csatValueCur = csatCountCur > 0 ? Math.round((satisfiedCur / csatCountCur) * 100) : null;
    const csatAvgRatingCur = csatCountCur > 0 ? Number((csatSumCur / csatCountCur).toFixed(1)) : null;

    const csatCountPrev = prevSummary.csatCount || 0;
    const satisfiedPrev = prevSummary.satisfied || 0;
    const csatValuePrev = csatCountPrev > 0 ? Math.round((satisfiedPrev / csatCountPrev) * 100) : null;

    // CES Calculation
    const cesCountCur = currentSummary.cesCount || 0;
    const cesSumCur = currentSummary.cesSum || 0;
    const effortlessCur = currentSummary.effortless || 0;
    const cesValueCur = cesCountCur > 0 ? Number((cesSumCur / cesCountCur).toFixed(1)) : null;
    const effortlessPercentCur = cesCountCur > 0 ? Math.round((effortlessCur / cesCountCur) * 100) : 0;

    const cesCountPrev = prevSummary.cesCount || 0;
    const cesSumPrev = prevSummary.cesSum || 0;
    const cesValuePrev = cesCountPrev > 0 ? Number((cesSumPrev / cesCountPrev).toFixed(1)) : null;

    // Response Volume Day-by-Day (current vs previous period aligned by day offset)
    const currentVolumeMap = new Map(
      (currentPeriodData[0]?.dailyVolume || []).map((item) => [item._id, item.count])
    );
    const prevVolumeMap = new Map(
      (prevPeriodData[0]?.dailyVolume || []).map((item) => [item._id, item.count])
    );

    const responseVolume = [];
    for (let i = days - 1; i >= 0; i--) {
      const curDateObj = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const prevDateObj = new Date(curDateObj.getTime() - days * 24 * 60 * 60 * 1000);

      const curDateStr = curDateObj.toISOString().split('T')[0];
      const prevDateStr = prevDateObj.toISOString().split('T')[0];

      responseVolume.push({
        date: curDateStr,
        current: currentVolumeMap.get(curDateStr) || 0,
        previous: prevVolumeMap.get(prevDateStr) || 0,
      });
    }

    // Top Topics
    const rawTopics = currentPeriodData[0]?.topics || [];
    const totalTopicOccurrences = rawTopics.reduce((acc, t) => acc + t.count, 0);
    const topTopics = rawTopics.map((t) => ({
      topic: t._id,
      count: t.count,
      percentage: totalTopicOccurrences > 0 ? Math.round((t.count / totalTopicOccurrences) * 100) : 0,
    }));

    // Sentiment Breakdown
    const posSentiment = currentSummary.positiveSentiment || 0;
    const neuSentiment = currentSummary.neutralSentiment || 0;
    const negSentiment = currentSummary.negativeSentiment || 0;
    const totalSentiment = posSentiment + neuSentiment + negSentiment;

    const sentiment = {
      positive: {
        count: posSentiment,
        percentage: totalSentiment > 0 ? Math.round((posSentiment / totalSentiment) * 100) : 0,
      },
      neutral: {
        count: neuSentiment,
        percentage: totalSentiment > 0 ? Math.round((neuSentiment / totalSentiment) * 100) : 0,
      },
      negative: {
        count: negSentiment,
        percentage: totalSentiment > 0 ? Math.round((negSentiment / totalSentiment) * 100) : 0,
      },
    };

    // NPS Breakdown
    const npsBreakdown = {
      detractors: {
        count: detractorsCur,
        percentage: detractorPercentCur,
      },
      passives: {
        count: passivesCur,
        percentage: passivePercentCur,
      },
      promoters: {
        count: promotersCur,
        percentage: promoterPercentCur,
      },
    };

    return {
      range,
      summary: {
        totalResponses: {
          value: totalResponsesCur,
          changePercent: calculatePercentChange(totalResponsesCur, totalResponsesPrev),
        },
        nps: {
          value: npsValueCur,
          promoterPercent: promoterPercentCur,
          detractorPercent: detractorPercentCur,
          changePercent:
            npsValueCur !== null && npsValuePrev !== null
              ? calculatePercentChange(npsValueCur, npsValuePrev)
              : 0,
        },
        csat: {
          value: csatValueCur,
          averageRating: csatAvgRatingCur,
          changePercent:
            csatValueCur !== null && csatValuePrev !== null
              ? calculatePercentChange(csatValueCur, csatValuePrev)
              : 0,
        },
        ces: {
          value: cesValueCur,
          scale: 7,
          effortlessPercent: effortlessPercentCur,
          changePercent:
            cesValueCur !== null && cesValuePrev !== null
              ? calculatePercentChange(cesValueCur, cesValuePrev)
              : 0,
        },
      },
      responseVolume,
      npsBreakdown,
      topTopics,
      sentiment,
    };
  },

  async getTrends(organizationId, days = 30) {
    const orgId = typeof organizationId === 'string' ? new mongoose.Types.ObjectId(organizationId) : organizationId;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const responses = await Response.find({
      organizationId: orgId,
      createdAt: { $gte: startDate },
    });

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

    responses.forEach((r) => {
      const dateStr = r.createdAt.toISOString().split('T')[0];
      if (dailyData[dateStr]) {
        dailyData[dateStr].count += 1;
      }
    });

    return Object.values(dailyData);
  },
};