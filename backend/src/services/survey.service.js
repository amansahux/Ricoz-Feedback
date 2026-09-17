import { Response } from "../models/response.model.js";
import { Survey } from "../models/survey.model.js";
import { generateUniqueSlug } from "../utils/generateSlug.js";


export const surveyService = {
  async createSurvey(organizationId, data) {
    const survey = new Survey({
      organizationId,
      title: data.title,
      description: data.description,
      slug: generateUniqueSlug(data.title),
      questions: data.questions || [],
      status: data.status || "draft",
    });

    await survey.save();
    return survey;
  },

  async getSurveys(organizationId) {
    return Survey.find({ organizationId }).sort({ createdAt: -1 });
  },

  async getSurveyById(surveyId, organizationId) {
    return Survey.findOne({ _id: surveyId, organizationId });
  },

  async updateSurvey(surveyId, organizationId, data) {
    return Survey.findOneAndUpdate(
      { _id: surveyId, organizationId },
      data,
      { new: true }
    );
  },

  async deleteSurvey(surveyId, organizationId) {
    return Survey.deleteOne({ _id: surveyId, organizationId });
  },

  async publishSurvey(surveyId, organizationId) {
    return Survey.findOneAndUpdate(
      { _id: surveyId, organizationId },
      { status: 'published' },
      { new: true }
    );
  },

  async getPublicSurvey(organizationSlug, surveySlug) {
    return Survey.findOne({
      slug: surveySlug,
      status: 'published',
    }).populate({
      path: 'organizationId',
      match: { slug: organizationSlug },
    });
  },

  async getResponseCount(surveyId) {
    return Response.countDocuments({ surveyId });
  },
};