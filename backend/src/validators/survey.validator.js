export const validateCreateSurvey = (req) => {
  const { title, questions } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Survey title is required' });
  }

  if (questions !== undefined && !Array.isArray(questions)) {
    errors.push({ field: 'questions', message: 'Questions must be an array' });
  }

  return errors;
};

export const validateUpdateSurvey = (req) => {
  const { title, questions, status } = req.body;
  const errors = [];

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    errors.push({ field: 'title', message: 'Survey title cannot be empty' });
  }

  if (questions !== undefined && !Array.isArray(questions)) {
    errors.push({ field: 'questions', message: 'Questions must be an array' });
  }

  if (status !== undefined && !['draft', 'published', 'archived'].includes(status)) {
    errors.push({ field: 'status', message: 'Status must be draft, published, or archived' });
  }

  return errors;
};
