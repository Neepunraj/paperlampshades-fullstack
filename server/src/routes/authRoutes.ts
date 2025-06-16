import express from "express";
import {
  login,
  logOut,
  refreshAccessToken,
  register,
} from "../controllers/authController";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logOut);

export default router;
