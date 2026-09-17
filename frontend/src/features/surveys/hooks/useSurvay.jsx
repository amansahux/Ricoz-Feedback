import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  deleteSurvey,
  publishSurvey,
  updateSurvey,
} from "../apis/surveys.api.jsx";

export const useSurveys = () => {
  const queryClient = useQueryClient();

  // 1. Get All Surveys
  const useGetAllSurveys = () =>
    useQuery({
      queryKey: ["surveys"],
      queryFn: getAllSurveys,
      staleTime: 1000 * 60 * 5,
    });

  // 2. Get Survey by ID
  const useGetSurveyById = (surveyId) =>
    useQuery({
      queryKey: ["surveys", surveyId],
      queryFn: () => getSurveyById(surveyId),
      enabled: Boolean(surveyId),
    });

  // 3. Create Survey
  const useCreateSurvey = () =>
    useMutation({
      mutationFn: (data) => createSurvey(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["surveys"] });
      },
    });

  // 4. Update Survey
  const useUpdateSurvey = () =>
    useMutation({
      mutationFn: ({ surveyId, data }) => updateSurvey(surveyId, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["surveys"] });
        queryClient.invalidateQueries({ queryKey: ["surveys", variables.surveyId] });
      },
    });

  // 5. Delete Survey
  const useDeleteSurvey = () =>
    useMutation({
      mutationFn: (surveyId) => deleteSurvey(surveyId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["surveys"] });
      },
    });

  // 6. Publish Survey
  const usePublishSurvey = () =>
    useMutation({
      mutationFn: (surveyId) => publishSurvey(surveyId),
      onSuccess: (_, surveyId) => {
        queryClient.invalidateQueries({ queryKey: ["surveys"] });
        queryClient.invalidateQueries({ queryKey: ["surveys", surveyId] });
      },
    });

  return {
    useGetAllSurveys,
    useGetSurveyById,
    useCreateSurvey,
    useUpdateSurvey,
    useDeleteSurvey,
    usePublishSurvey,
  };
};

export default useSurveys;
