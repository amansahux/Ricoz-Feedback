import apiClient from "../../../../config/axiosInsstance";

export const createResponse = async (organizationSlug, surveySlug) => {
  apiClient.post(
    `/responses/public/surveys/:${organizationSlug}/:${surveySlug}`,
  );
};
export const getResponses = async () => {};
export const getResponsebyId = async () => {};
export const updateResponsebyId = async () => {};
