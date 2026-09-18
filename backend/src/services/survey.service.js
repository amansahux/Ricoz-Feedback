import { Organization } from "../models/organization.model.js";
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
      questions: (data.questions || []).map((q) => ({
        ...q,
      })),
      status: data.status || "draft",
    });

    // Ensure questions carry their parent surveyId
    if (Array.isArray(survey.questions)) {
      survey.questions.forEach((q) => {
        q.surveyId = survey._id;
      });
    }

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
    if (data.questions && Array.isArray(data.questions)) {
      data.questions = data.questions.map((q) => ({
        ...q,
        surveyId: q.surveyId || surveyId,
      }));
    }

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
    const org = await Organization.findOne({ slug: organizationSlug });
    if (!org) return null;

    const survey = await Survey.findOne({
      slug: surveySlug,
      organizationId: org._id,
      status: 'published',
    }).populate('organizationId');

    return survey;
  },

  async getResponseCount(surveyId) {
    return Response.countDocuments({ surveyId });
  },
};