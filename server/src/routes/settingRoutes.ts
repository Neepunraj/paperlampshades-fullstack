import express from "express";
import { autheticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleWare";
import {
  addFeatureBanner,
  fetchFeatureBanner,
  getFeaturedProduct,
  updatefeatureProduct,
} from "../controllers/setttingsController";

const router = express.Router();
router.get("/get-banners", autheticateJwt, fetchFeatureBanner);
router.post(
  "/banners",
  autheticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  addFeatureBanner
);
router.post(
  "/update-feature-products",
  autheticateJwt,
  isSuperAdmin,
  updatefeatureProduct
);
router.get("/fetch-feature-products", autheticateJwt, getFeaturedProduct);
export default router;
