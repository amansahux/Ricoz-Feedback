import { responseService } from "../services/response.service.js";
import { surveyService } from "../services/survey.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const responseController = {
  createResponse: asyncHandler(async (req, res) => {
    const { organizationSlug, surveySlug } = req.params;
    const { name, email, answers, source = 'link' } = req.body;

    // Get survey
    const survey = await surveyService.getPublicSurvey(organizationSlug, surveySlug);

    if (!survey) {
      throw new ApiError(404, 'Survey not found or is inactive');
    }

    // Find or create customer
    const customer = await responseService.findOrCreateCustomer(
      survey.organizationId,
      email,
      name
    );

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
      message: 'Response submitted successfully',
      data: response,
    });
  }),

  getResponses: asyncHandler(async (req, res) => {
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
  }),

  getResponseById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const response = await responseService.getResponseById(id, organizationId);

    if (!response) {
      throw new ApiError(404, 'Response not found');
    }

    res.status(200).json({
      success: true,
      data: response,
    });
  }),

  updateResponseStatus: asyncHandler(async (req, res) => {
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
      throw new ApiError(404, 'Response not found');
    }

    res.status(200).json({
      success: true,
      message: 'Response status updated successfully',
      data: response,
    });
  }),
};