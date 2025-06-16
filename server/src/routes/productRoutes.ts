import express from "express";
import { autheticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleWare";
import {
  createProduct,
  deleteProduct,
  fetAllProductsforAdmin,
  getProductbyId,
  getProductsForClient,
  updateProduct,
} from "../controllers/productController";
const router = express.Router();

router.post(
  "/create-new-product",
  autheticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  createProduct
);
router.get(
  "/fetch-admin-products",
  autheticateJwt,
  isSuperAdmin,
  fetAllProductsforAdmin
);
router.get("/fetch-client-products", autheticateJwt, getProductsForClient);
router.get("/:id", autheticateJwt, getProductbyId);
router.put("/:id", autheticateJwt, isSuperAdmin, updateProduct);
router.delete("/:id", autheticateJwt, isSuperAdmin, deleteProduct);
export default router;
