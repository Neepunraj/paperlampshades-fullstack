import express from "express";
import { isSuperAdmin, autheticateJwt } from "../middleware/authMiddleware";
import {
  createCoupon,
  deleteCoupon,
  fetchAllCoupons,
} from "../controllers/couponController";
const router = express.Router();
router.post("/create-coupon", autheticateJwt, isSuperAdmin, createCoupon);
router.get("/fetch-all-coupons", fetchAllCoupons);
router.delete("/:id", autheticateJwt, isSuperAdmin, deleteCoupon);

export default router;
