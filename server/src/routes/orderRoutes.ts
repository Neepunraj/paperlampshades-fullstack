import express from "express";
import {
  capturePaypalOrder,
  createFinalOrder,
  createPaypalOrder,
  getAllordersForAdmin,
  getOrder,
  getOrdersbyUserID,
  updateOrderStatus,
} from "../controllers/orderController";
import { autheticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
const router = express.Router();
router.post("/create-paypal-order", autheticateJwt, createPaypalOrder);
router.post("/capture-paypal-order", autheticateJwt, capturePaypalOrder);
router.post("/create-final-order", autheticateJwt, createFinalOrder);
router.get("/get-single-order/:orderId", getOrder);
router.get("/get-order-by-user-id", autheticateJwt, getOrdersbyUserID);
router.get(
  "/get-all-orders-for-admin",
  autheticateJwt,
  isSuperAdmin,
  getAllordersForAdmin
);
router.put("/:orderId/status", autheticateJwt, isSuperAdmin, updateOrderStatus);
export default router;
