import express from "express";
import {
  addtoCart,
  clearEntireCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../controllers/cartController";
import { autheticateJwt } from "../middleware/authMiddleware";

const router = express.Router();
router.get("/fetch-cart", autheticateJwt, getCart);
router.post("/add-to-cart", autheticateJwt, addtoCart);
router.delete("/romove/:id", autheticateJwt, removeFromCart);
router.put("/update/:id", autheticateJwt, updateCartItemQuantity);
router.delete("/clear-cart", autheticateJwt, clearEntireCart);
export default router;
