import bcrypt from 'bcrypt';
import { Organization } from '../models/organization.model.js';
import { generateUniqueSlug } from '../utils/generateSlug.js';
import { User } from '../models/user.models.js';
import { generateToken } from '../utils/generateToken.js';


export const authService = {
  async register(name, email, password, organizationName) {
    // Check if email exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create organization
    const org = new Organization({
      name: organizationName,
      slug: generateUniqueSlug(organizationName),
    });
    await org.save();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      organizationId: org._id,
    });
    await user.save();

    // Generate token
    const token = generateToken(user._id, org._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: org._id,
      },
      organization: {
        id: org._id,
        name: org.name,
        slug: org.slug,
      },
    };
  },

  async login(email, password) {
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id, user.organizationId);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
    };
  },

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const organization = await Organization.findById(user.organizationId);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
      organization: {
        id: organization._id,
        name: organization.name,
        slug: organization.slug,
        logo: organization.logo,
        primaryColor: organization.primaryColor,
      },
    };
  },
  async update(userId, name, organizationName, primaryColor, logoUrl) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const organization = await Organization.findById(user.organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    user.name = name;
    organization.name = organizationName;
    organization.primaryColor = primaryColor;
    organization.logoUrl = logoUrl;

    await user.save();
    await organization.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
      organization: {
        id: organization._id,
        name: organization.name,
        slug: organization.slug,
        logo: organization.logo,
        primaryColor: organization.primaryColor,
      },
    };
  },
};