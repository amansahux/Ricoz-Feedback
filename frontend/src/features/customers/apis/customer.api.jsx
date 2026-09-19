import apiClient from "../../../../config/axiosInsstance";

/**
 * Submit a customer feedback response to a public survey.
 * @param {string} organizationSlug - Organization slug identifier
 * @param {string} surveySlug - Survey slug identifier
 * @param {Object} responseData - Response payload
 * @param {string} [responseData.name] - Optional customer name
 * @param {string} [responseData.email] - Optional customer email
 * @param {Array<{questionId: string, value: any}>} responseData.answers - Array of question answers
 * @param {'link'|'qr'|'widget'} [responseData.source='link'] - Response source channel
 * @returns {Promise<any>}
 */
export const createResponse = async (organizationSlug, surveySlug, responseData) => {
  try {
    const response = await apiClient.post(
      `/responses/public/surveys/${organizationSlug}/${surveySlug}`,
      responseData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating customer response:", error);
    throw error;
  }
};

/**
 * Fetch public survey details for respondents.
 * @param {string} organizationSlug
 * @param {string} surveySlug
 * @returns {Promise<any>}
 */
export const getPublicSurvey = async (organizationSlug, surveySlug) => {
  try {
    const response = await apiClient.get(
      `/surveys/public/${organizationSlug}/${surveySlug}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching public survey:", error);
    throw error;
  }
};


