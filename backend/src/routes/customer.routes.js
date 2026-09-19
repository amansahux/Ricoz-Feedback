import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCustomerDetails, getCustomers } from "../controllers/customer.controller.js";

const router = Router();

// Routes are mounted at /api/customers in app.js
router.get("/", authMiddleware, getCustomers);
router.get("/:customerId", authMiddleware, getCustomerDetails);

export default router;
