
import { Customer } from '../models/customer.model.js';
import { Response } from '../models/response.model.js';
import { Survey } from '../models/survey.model.js';
import { analyzeSentiment, detectTopics } from './sentiment.service.js';

export const responseService = {
  async createResponse(organizationId, surveyId, customerId, answers) {
    const response = new Response({
      organizationId,
      surveyId,
      customerId,
      answers,
      status: 'open',
    });

    // Process answers to extract metrics
    const survey = await Survey.findById(surveyId);
    answers.forEach(answer => {
      const question = survey.questions.find(q => q._id.toString() === answer.questionId.toString());
      
      if (question.type === 'nps') {
        response.npsScore = answer.value;
      }
      if (question.type === 'csat') {
        response.csatScore = answer.value;
      }
      if (question.type === 'ces') {
        response.cesScore = answer.value;
      }
    });

    // Analyze text feedback
    const textAnswer = answers.find(a => {
      const question = survey.questions.find(q => q._id.toString() === a.questionId.toString());
      return question && (question.type === 'text' || question.type === 'textarea');
    });

    if (textAnswer && textAnswer.value) {
      response.sentiment = analyzeSentiment(textAnswer.value);
      response.topics = detectTopics(textAnswer.value);
    }

    await response.save();
    return response;
  },

  async getResponses(organizationId, filters = {}) {
    const query = { organizationId };

    if (filters.surveyId) query.surveyId = filters.surveyId;
    if (filters.sentiment) query.sentiment = filters.sentiment;
    if (filters.status) query.status = filters.status;
    if (filters.npsScore !== undefined) query.npsScore = filters.npsScore;

    return Response.find(query)
      .populate('customerId')
      .sort({ createdAt: -1 });
  },

  async getResponseById(responseId, organizationId) {
    return Response.findOne({ _id: responseId, organizationId })
      .populate('customerId')
      .populate('surveyId');
  },

  async updateResponseStatus(responseId, organizationId, status, followUpNote = null) {
    const update = { status };
    if (status === 'resolved') {
      update.resolvedAt = new Date();
    }
    if (followUpNote) {
      update.followUpNote = followUpNote;
    }

    return Response.findOneAndUpdate(
      { _id: responseId, organizationId },
      update,
      { new: true }
    );
  },

  async findOrCreateCustomer(organizationId, email, name) {
    if (!email) {
      // Create anonymous customer
      const customer = new Customer({
        organizationId,
        name: name || 'Anonymous',
      });
      await customer.save();
      return customer;
    }

    let customer = await Customer.findOne({ organizationId, email });
    
    if (!customer) {
      customer = new Customer({
        organizationId,
        email,
        name: name || email,
      });
      await customer.save();
    }

    return customer;
  },
};
