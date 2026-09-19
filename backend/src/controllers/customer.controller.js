import { customerService } from "../services/customer.service.js";

/**
 * Controller: Get all customers for the authenticated organization
 */
export const getCustomers = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get a single customer by ID with their complete response history
 */
export const getCustomerDetails = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { customerId } = req.params;

    const data = await customerService.getCustomerDetails(customerId, organizationId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};