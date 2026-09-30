export const validateCreateResponse = (req) => {
  const { answers } = req.body;
  const errors = [];

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    errors.push({ field: 'answers', message: 'Answers array is required and cannot be empty' });
  }

  return errors;
};

export const validateUpdateResponseStatus = (req) => {
  const { status } = req.body;
  const errors = [];

  if (status && !['open', 'in_progress', 'resolved'].includes(status)) {
    errors.push({ field: 'status', message: 'Status must be open, in_progress, or resolved' });
  }

  return errors;
};
