import apiClient from "../../../../config/axiosInsstance";

export const createSurvey = async (data) => {
  try {
    const response = await apiClient.post("/surveys", data);
    return response.data;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};

export const getAllSurveys = async () => {
  try {
    const response = await apiClient.get("/surveys");
    return response.data;
  } catch (error) {
    console.error("Error getting surveys:", error);
    throw error;
  }
};

export const getSurveyById = async (surveyId) => {
  try {
    const response = await apiClient.get(`/surveys/${surveyId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting survey:", error);
    throw error;
  }
};

export const updateSurvey = async (surveyId, surveyData) => {
  try {
    const response = await apiClient.patch(`/surveys/${surveyId}`, surveyData);
    return response.data;
  } catch (error) {
    console.error("Error updating survey:", error);
    throw error;
  }
};

export const deleteSurvey = async (surveyId) => {
  try {
    const response = await apiClient.delete(`/surveys/${surveyId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting survey:", error);
    throw error;
  }
};

export const publishSurvey = async (surveyId) => {
  try {
    const response = await apiClient.post(`/surveys/${surveyId}/publish`);
    return response.data;
  } catch (error) {
    console.error("Error publishing survey:", error);
    throw error;
  }
};