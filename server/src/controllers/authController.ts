import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { prisma } from "../server";

function generateToken(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    {
      userId,
      email,
      role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "60m" }
  );
  const refreshToken = "";
  return { accessToken, refreshToken };
}

async function setToken(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "User with email already Exists",
      });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newlyCreatedUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
        role: "USER",
      },
    });
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      userId: newlyCreatedUser.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const extractCurrentUser = await prisma.user.findUnique({
      where: { email },
    });

    if (
      !extractCurrentUser ||
      !(await bcrypt.compare(password, extractCurrentUser.password))
    ) {
      res.status(401).json({
        success: false,
        error: "User with Email Address Not Found and invalid credential",
      });
      return;
    }
    const { accessToken, refreshToken } = generateToken(
      extractCurrentUser.id,
      extractCurrentUser.email,
      extractCurrentUser.role
    );
    await setToken(res, accessToken, refreshToken);
    res.status(201).json({
      success: true,
      message: "Login Successful",
      user: {
        id: extractCurrentUser.id,
        email: extractCurrentUser.email,
        name: extractCurrentUser.name,
        role: extractCurrentUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Unable to Login ! Please try again Later",
    });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({
      success: false,
      error: "Invalid refresh Token",
    });
    return;
  }
  try {
    const user = await prisma.user.findFirst({
      where: { refreshToken: refreshToken },
    });
    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not Found",
      });
      return;
    }
    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      user.id,
      user.email,
      user.role
    );
    await setToken(res, accessToken, newRefreshToken);
    res.status(201).json({
      success: true,
      message: "Refresh token Refreshed Successfully",
    });
  } catch (error) {
    console.error;
    res.status(500).json({
      success: false,
      error: "unable to refesh Access Token",
    });
  }
};

export const logOut = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({
    success: true,
    message: "Logout Successfully",
  });
};
