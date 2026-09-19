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
      const question = survey.questions.find(
        q => q._id && answer.questionId && q._id.toString() === answer.questionId.toString()
      );
      
      if (question) {
        if (question.type === 'nps') {
          response.npsScore = Number(answer.value);
        }
        if (question.type === 'csat' || question.type === 'rating') {
          response.csatScore = Number(answer.value);
        }
        if (question.type === 'ces') {
          response.cesScore = Number(answer.value);
        }
      }
    });

    // Analyze text feedback
    const textAnswer = answers.find(a => {
      const question = survey.questions.find(
        q => q._id && a.questionId && q._id.toString() === a.questionId.toString()
      );
      return question && (question.type === 'text' || question.type === 'textarea');
    });

    if (textAnswer && textAnswer.value) {
      response.sentiment = analyzeSentiment(textAnswer.value);
      response.topics = detectTopics(textAnswer.value);
    }

    await response.save();
    return response;
  },

  /**
   * Get all responses for an organization populated with customer, survey and enriched answers
   */
  async getResponses(organizationId, filters = {}) {
    const query = { organizationId };

    if (filters.surveyId) query.surveyId = filters.surveyId;
    if (filters.sentiment) query.sentiment = filters.sentiment;
    if (filters.status) query.status = filters.status;
    if (filters.npsScore !== undefined) query.npsScore = filters.npsScore;

    const responses = await Response.find(query)
      .populate('customerId', 'name email phone')
      .populate('surveyId', 'title slug status questions')
      .sort({ createdAt: -1 })
      .lean();

    return responses.map(response => this.formatResponseData(response));
  },

  /**
   * Get a single response by ID with full customer, survey, and enriched question answers
   */
  async getResponseById(responseId, organizationId) {
    const response = await Response.findOne({ _id: responseId, organizationId })
      .populate('customerId', 'name email phone')
      .populate('surveyId', 'title slug status questions')
      .lean();

    if (!response) {
      return null;
    }

    return this.formatResponseData(response);
  },

  /**
   * Enrich response answers with questionText, type, and options from survey definition
   */
  formatResponseData(response) {
    const survey = response.surveyId;
    const surveyQuestions = (survey && Array.isArray(survey.questions)) ? survey.questions : [];

    const enrichedAnswers = (response.answers || []).map(answer => {
      const matchedQuestion = surveyQuestions.find(
        q => q._id && answer.questionId && q._id.toString() === answer.questionId.toString()
      );

      return {
        questionId: answer.questionId,
        questionText: matchedQuestion ? matchedQuestion.question : 'Question',
        type: matchedQuestion ? matchedQuestion.type : 'text',
        options: matchedQuestion?.options || [],
        value: answer.value,
      };
    });

    return {
      _id: response._id,
      organizationId: response.organizationId,
      customerId: response.customerId || {
        _id: null,
        name: 'Anonymous Respondent',
        email: '—',
      },
      surveyId: survey
        ? {
            _id: survey._id,
            title: survey.title,
            slug: survey.slug,
            status: survey.status,
          }
        : null,
      csatScore: response.csatScore ?? null,
      npsScore: response.npsScore ?? null,
      cesScore: response.cesScore ?? null,
      sentiment: response.sentiment || 'neutral',
      topics: response.topics || [],
      source: response.source || 'link',
      status: response.status || 'open',
      followUpNote: response.followUpNote || '',
      resolvedAt: response.resolvedAt || null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      answers: enrichedAnswers,
    };
  },

  async updateResponseStatus(responseId, organizationId, status, followUpNote = null) {
    const update = { status };
    if (status === 'resolved') {
      update.resolvedAt = new Date();
    }
    if (followUpNote !== undefined && followUpNote !== null) {
      update.followUpNote = followUpNote;
    }

    const updatedDoc = await Response.findOneAndUpdate(
      { _id: responseId, organizationId },
      update,
      { new: true }
    )
      .populate('customerId', 'name email phone')
      .populate('surveyId', 'title slug status questions')
      .lean();

    if (!updatedDoc) return null;
    return this.formatResponseData(updatedDoc);
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
