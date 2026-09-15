import { responseService } from '../services/response.service.js';
import { surveyService } from '../services/survey.service.js';

export const responseController = {
  async createResponse(req, res, next) {
    try {
      const { organizationSlug, surveySlug } = req.params;
      const { name, email, answers, source = 'link' } = req.body;

      // Get survey
      const survey = await surveyService.getPublicSurvey(organizationSlug, surveySlug);

      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found',
        });
      }

      // Find or create customer
      const customer = await responseService.findOrCreateCustomer(
        survey.organizationId,
        email,
        name
      );

      // Validate answers
      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Answers required',
        });
      }

      // Create response
      const response = await responseService.createResponse(
        survey.organizationId,
        survey._id,
        customer._id,
        answers
      );

      // Update source
      response.source = source;
      await response.save();

      res.status(201).json({
        success: true,
        message: 'Response submitted',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },

  async getResponses(req, res, next) {
    try {
      const organizationId = req.user.organizationId;
      const { surveyId, sentiment, status } = req.query;

      const responses = await responseService.getResponses(organizationId, {
        surveyId,
        sentiment,
        status,
      });

      res.status(200).json({
        success: true,
        data: responses,
      });
    } catch (error) {
      next(error);
    }
  },

  async getResponseById(req, res, next) {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;

      const response = await responseService.getResponseById(id, organizationId);

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Response not found',
        });
      }

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateResponseStatus(req, res, next) {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;
      const { status, followUpNote } = req.body;

      const response = await responseService.updateResponseStatus(
        id,
        organizationId,
        status,
        followUpNote
      );

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Response not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Response updated',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
};