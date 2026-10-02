import { ROLES, MEMBER_STATUS } from '../config/roles.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateInviteMember = (req) => {
  const { email, role } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (role && ![ROLES.ADMIN, ROLES.SUPPORT_AGENT].includes(role)) {
    errors.push({ field: 'role', message: 'Role must be either admin or support_agent' });
  }

  return errors;
};

export const validateUpdateRole = (req) => {
  const { role } = req.body;
  const errors = [];

  if (!role || ![ROLES.ADMIN, ROLES.SUPPORT_AGENT].includes(role)) {
    errors.push({ field: 'role', message: 'Role must be either admin or support_agent' });
  }

  return errors;
};

export const validateUpdateStatus = (req) => {
  const { status } = req.body;
  const errors = [];

  if (!status || ![MEMBER_STATUS.ACTIVE, MEMBER_STATUS.INACTIVE].includes(status)) {
    errors.push({ field: 'status', message: 'Status must be either active or inactive' });
  }

  return errors;
};
