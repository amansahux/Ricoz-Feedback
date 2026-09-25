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

  if (status && !['new', 'reviewed', 'resolved', 'ignored'].includes(status)) {
    errors.push({ field: 'status', message: 'Status must be new, reviewed, resolved, or ignored' });
  }

  return errors;
};
