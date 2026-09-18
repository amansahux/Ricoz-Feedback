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
 * Get all responses for the authenticated organization with optional filters.
 * @param {Object} [filters={}] - Query filters (surveyId, sentiment, status, npsScore)
 * @returns {Promise<any>}
 */
export const getResponses = async (filters = {}) => {
  try {
    const response = await apiClient.get("/responses", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error getting responses:", error);
    throw error;
  }
};

/**
 * Get a specific response by ID (including populated customer and survey details).
 * @param {string} id - Response ID
 * @returns {Promise<any>}
 */
export const getResponseById = async (id) => {
  try {
    const response = await apiClient.get(`/responses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting response by id ${id}:`, error);
    throw error;
  }
};

/**
 * Update response status and add follow-up notes.
 * @param {string} id - Response ID
 * @param {Object} updateData - Data to update
 * @param {'open'|'in_progress'|'resolved'} [updateData.status] - New response status
 * @param {string} [updateData.followUpNote] - Follow up note
 * @returns {Promise<any>}
 */
export const updateResponseById = async (id, updateData) => {
  try {
    const response = await apiClient.patch(`/responses/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating response ${id}:`, error);
    throw error;
  }
};
