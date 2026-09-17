import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  deleteSurvey,
  publishSurvey,
  updateSurvey,
} from "../apis/surveys.api.jsx";

export const useSurveys = (surveyId) => {
  const queryClient = useQueryClient();

  // 1. Get All Surveys
  const getAllSurveysQuery = useQuery({
    queryKey: ["surveys"],
    queryFn: getAllSurveys,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Get Survey by ID
  const getSurveyByIdQuery = useQuery({
    queryKey: ["surveys", surveyId],
    queryFn: () => getSurveyById(surveyId),
    enabled: Boolean(surveyId),
    staleTime: 1000 * 60 * 10,
  });

  // 3. Create Survey
  const createSurveyMutation = useMutation({
    mutationFn: (data) => createSurvey(data),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });

  // 4. Update Survey
  const updateSurveyMutation = useMutation({
    mutationFn: ({ surveyId: id, data }) => updateSurvey(id, data),
    retry: false,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({
        queryKey: ["surveys", variables.surveyId],
      });
    },
  });

  // 5. Delete Survey
  const deleteSurveyMutation = useMutation({
    mutationFn: (id) => deleteSurvey(id),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });

  // 6. Publish Survey
  const publishSurveyMutation = useMutation({
    mutationFn: (id) => publishSurvey(id),
    retry: false,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({ queryKey: ["surveys", id] });
    },
  });

  return {
    getAllSurveysQuery,
    getSurveyByIdQuery,
    createSurveyMutation,
    updateSurveyMutation,
    deleteSurveyMutation,
    publishSurveyMutation,
  };
};

export default useSurveys;
