const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req) => {
  const { name, email, password, organizationName } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Full name is required' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (!organizationName || typeof organizationName !== 'string' || organizationName.trim().length === 0) {
    errors.push({ field: 'organizationName', message: 'Organization / workspace name is required' });
  }

  return errors;
};

export const validateLogin = (req) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
};

export const validateVerifyEmail = (req) => {
  const token = req.body?.token || req.query?.token;
  const errors = [];

  if (!token || typeof token !== 'string') {
    errors.push({ field: 'token', message: 'Verification token is required' });
  }

  return errors;
};

export const validateResendVerification = (req) => {
  const { email } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  return errors;
};

export const validateForgotPassword = (req) => {
  const { email } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  return errors;
};

export const validateResetPassword = (req) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
    errors.push({ field: 'otp', message: 'A 6-digit OTP code is required' });
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters' });
  }

  if (confirmPassword !== undefined && newPassword !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return errors;
};

export const validateChangePassword = (req) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const errors = [];

  if (!currentPassword || typeof currentPassword !== 'string') {
    errors.push({ field: 'currentPassword', message: 'Current password is required' });
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters' });
  }

  if (confirmPassword !== undefined && newPassword !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'New passwords do not match' });
  }

  return errors;
};

export const validateUpdateProfile = (req) => {
  const { name, organizationName, primaryColor } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    errors.push({ field: 'name', message: 'Name cannot be empty' });
  }

  if (organizationName !== undefined && (typeof organizationName !== 'string' || organizationName.trim().length === 0)) {
    errors.push({ field: 'organizationName', message: 'Organization name cannot be empty' });
  }

  if (primaryColor !== undefined && typeof primaryColor !== 'string') {
    errors.push({ field: 'primaryColor', message: 'Invalid primary color format' });
  }

  return errors;
};
