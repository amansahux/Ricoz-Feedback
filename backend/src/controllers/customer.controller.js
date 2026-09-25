import { customerService } from "../services/customer.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Controller: Get all customers for the authenticated organization
 */
export const getCustomers = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const { search, limit, skip, sortBy, sortOrder } = req.query;

  const result = await customerService.getCustomers(organizationId, {
    search,
    limit,
    skip,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    success: true,
    data: result.customers,
    totalCount: result.totalCount,
    limit: result.limit,
    skip: result.skip,
  });
});

/**
 * Controller: Get a single customer by ID with their complete response history
 */
export const getCustomerDetails = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const { customerId } = req.params;

  const data = await customerService.getCustomerDetails(customerId, organizationId);

  if (!data) {
    throw new ApiError(404, 'Customer not found');
  }

  res.status(200).json({
    success: true,
    data,
  });
});