import apiClient from "../../../../config/axiosInsstance";

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