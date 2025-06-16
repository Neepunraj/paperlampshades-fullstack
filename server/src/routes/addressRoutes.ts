import express from "express";
import { autheticateJwt } from "../middleware/authMiddleware";
import {
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../controllers/addressController";
const router = express.Router();
router.post("/add-address", autheticateJwt, createAddress);
router.get("/get-address", autheticateJwt, getAddress);
router.put("/update-address/:id", autheticateJwt, updateAddress);
router.delete("/delete-address/:id", autheticateJwt, deleteAddress);
export default router;
