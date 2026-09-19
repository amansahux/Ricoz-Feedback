import { Customer } from "../models/customer.model.js";
import { Response } from "../models/response.model.js";

export const customerService = {
  /**
   * Get all customers for an organization with optional search and aggregated stats
   */
  async getCustomers(organizationId, query = {}) {
    const { search, limit = 50, skip = 0, sortBy = "createdAt", sortOrder = -1 } = query;

    const filter = { organizationId };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = Number(sortOrder) || -1;

    const customers = await Customer.find(filter)
      .sort(sortOptions)
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    const totalCount = await Customer.countDocuments(filter);

    // Fetch response stats for each customer
    const customerIds = customers.map((c) => c._id);
    const responses = await Response.find({
      organizationId,
      customerId: { $in: customerIds },
    })
      .select("customerId sentiment status createdAt npsScore csatScore cesScore")
      .sort({ createdAt: -1 })
      .lean();

    // Map stats to each customer
    const customersWithStats = customers.map((customer) => {
      const customerResponses = responses.filter(
        (r) => r.customerId && r.customerId.toString() === customer._id.toString()
      );

      const totalResponses = customerResponses.length;
      const latestResponse = customerResponses[0] || null;

      // Calculate sentiment counts
      const positiveCount = customerResponses.filter((r) => r.sentiment === "positive").length;
      const negativeCount = customerResponses.filter((r) => r.sentiment === "negative").length;
      const neutralCount = customerResponses.filter((r) => r.sentiment === "neutral").length;

      // Calculate average NPS / CSAT if available
      const npsResponses = customerResponses.filter((r) => r.npsScore != null);
      const avgNps = npsResponses.length
        ? (npsResponses.reduce((acc, r) => acc + r.npsScore, 0) / npsResponses.length).toFixed(1)
        : null;

      const csatResponses = customerResponses.filter((r) => r.csatScore != null);
      const avgCsat = csatResponses.length
        ? (csatResponses.reduce((acc, r) => acc + r.csatScore, 0) / csatResponses.length).toFixed(1)
        : null;

      return {
        ...customer,
        stats: {
          totalResponses,
          latestResponseAt: latestResponse ? latestResponse.createdAt : null,
          latestSentiment: latestResponse ? latestResponse.sentiment : null,
          latestStatus: latestResponse ? latestResponse.status : null,
          sentimentBreakdown: {
            positive: positiveCount,
            negative: negativeCount,
            neutral: neutralCount,
          },
          avgNps: avgNps ? Number(avgNps) : null,
          avgCsat: avgCsat ? Number(avgCsat) : null,
        },
      };
    });

    return {
      customers: customersWithStats,
      totalCount,
      limit: Number(limit),
      skip: Number(skip),
    };
  },

  /**
   * Get single customer details with their complete feedback response history
   */
  async getCustomerDetails(customerId, organizationId) {
    const customer = await Customer.findOne({ _id: customerId, organizationId }).lean();

    if (!customer) {
      return null;
    }

    // Fetch complete response history with survey details
    const responses = await Response.find({
      organizationId,
      customerId,
    })
      .populate("surveyId", "title slug status")
      .sort({ createdAt: -1 })
      .lean();

    // Summary calculations
    const totalResponses = responses.length;
    const resolvedResponses = responses.filter((r) => r.status === "resolved").length;
    const openResponses = responses.filter((r) => r.status === "open").length;

    const npsValues = responses.filter((r) => r.npsScore != null).map((r) => r.npsScore);
    const avgNps = npsValues.length
      ? (npsValues.reduce((a, b) => a + b, 0) / npsValues.length).toFixed(1)
      : null;

    const csatValues = responses.filter((r) => r.csatScore != null).map((r) => r.csatScore);
    const avgCsat = csatValues.length
      ? (csatValues.reduce((a, b) => a + b, 0) / csatValues.length).toFixed(1)
      : null;

    return {
      customer,
      summary: {
        totalResponses,
        resolvedResponses,
        openResponses,
        avgNps: avgNps ? Number(avgNps) : null,
        avgCsat: avgCsat ? Number(avgCsat) : null,
      },
      responses,
    };
  },
};

export const getCustomersService = customerService.getCustomers;
export const getCustomerDetailService = customerService.getCustomerDetails;
