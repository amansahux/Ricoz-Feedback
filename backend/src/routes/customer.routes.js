import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCustomerDetails, getCustomers } from "../controllers/customer.controller.js";

const router = Router()

router.get('/customers', authMiddleware, getCustomers)
router.get('/customers/:customerId', authMiddleware, getCustomerDetails)


export default router
