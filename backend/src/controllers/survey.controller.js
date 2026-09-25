import { surveyService } from '../services/survey.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const surveyController = {
  createSurvey: asyncHandler(async (req, res) => {
    const { title, description, questions, status } = req.body;
    const organizationId = req.user.organizationId;

    const survey = await surveyService.createSurvey(organizationId, {
      title,
      description,
      questions,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      data: survey,
    });
  }),

  getSurveys: asyncHandler(async (req, res) => {
    const organizationId = req.user.organizationId;
    const result = await surveyService.getSurveys(organizationId);

    res.status(200).json({
      success: true,
      data: result.surveys,
      avgCsat: result.avgCsat,
    });
  }),

  getSurveyById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const survey = await surveyService.getSurveyById(id, organizationId);

    if (!survey) {
      throw new ApiError(404, 'Survey not found');
    }

    res.status(200).json({
      success: true,
      data: survey,
    });
  }),

  updateSurvey: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const survey = await surveyService.updateSurvey(id, organizationId, req.body);

    if (!survey) {
      throw new ApiError(404, 'Survey not found');
    }

    res.status(200).json({
      success: true,
      message: 'Survey updated successfully',
      data: survey,
    });
  }),

  deleteSurvey: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const result = await surveyService.deleteSurvey(id, organizationId);

    if (!result || result.deletedCount === 0) {
      throw new ApiError(404, 'Survey not found');
    }

    res.status(200).json({
      success: true,
      message: 'Survey deleted successfully',
    });
  }),

  publishSurvey: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const survey = await surveyService.publishSurvey(id, organizationId);

    if (!survey) {
      throw new ApiError(404, 'Survey not found');
    }

    res.status(200).json({
      success: true,
      message: 'Survey published successfully',
      data: survey,
    });
  }),

  getPublicSurvey: asyncHandler(async (req, res) => {
    const { organizationSlug, surveySlug } = req.params;
    const survey = await surveyService.getPublicSurvey(organizationSlug, surveySlug);

    if (!survey) {
      throw new ApiError(404, 'Survey not found or is currently inactive');
    }

    res.status(200).json({
      success: true,
      data: survey,
    });
  }),
};