import { surveyService } from '../services/survey.service.js';

export const surveyController = {
  async createSurvey(req, res, next) {
    try {
      const { title, description, questions, status } = req.body;
      const organizationId = req.user.organizationId;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Survey title required',
        });
      }

      const survey = await surveyService.createSurvey(organizationId, {
        title,
        description,
        questions,
        status
      });

      res.status(201).json({
        success: true,
        message: 'Survey created Sucessfully',
        data: survey,
      });
    } catch (error) {
      next(error);
    }
  },

  async getSurveys(req, res, next) {
    try {
      const organizationId = req.user.organizationId;
      const surveys = await surveyService.getSurveys(organizationId);

      res.status(200).json({
        success: true,
        data: surveys,
      });
    } catch (error) {
      next(error);
    }
  },

  async getSurveyById(req, res, next) {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;

      const survey = await surveyService.getSurveyById(id, organizationId);

      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found',
        });
      }

      res.status(200).json({
        success: true,
        data: survey,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSurvey(req, res, next) {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;

      const survey = await surveyService.updateSurvey(id, organizationId, req.body);

      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Survey updated',
        data: survey,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteSurvey(req, res, next) {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;

      const result = await surveyService.deleteSurvey(id, organizationId);

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Survey deleted',
      });
    } catch (error) {
      next(error);
    }
  },

  async publishSurvey(req, res, next) {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;

      const survey = await surveyService.publishSurvey(id, organizationId);

      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Survey published',
        data: survey,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPublicSurvey(req, res, next) {
    try {
      const { organizationSlug, surveySlug } = req.params;
      const survey = await surveyService.getPublicSurvey(organizationSlug, surveySlug);

      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found or inactive',
        });
      }

      res.status(200).json({
        success: true,
        data: survey,
      });
    } catch (error) {
      next(error);
    }
  },
};