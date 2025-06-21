import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import fs from "fs";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";

export const addFeatureBanner = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(404).json({
        success: false,
        error: "No Files Provided",
      });
      return;
    }
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ecommerce-banner-images",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const banners = await Promise.all(
      uploadResults.map((res) =>
        prisma.featureBanner.create({
          data: {
            imageUrl: res.secure_url,
          },
        })
      )
    );
    files.forEach((file) => fs.unlinkSync(file.path));
    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchFeatureBanner = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const fetchFeatureBanner = await prisma.featureBanner.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(201).json({
      success: true,
      fetchFeatureBanner,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error " });
  }
};

export const updatefeatureProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds) || productIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid Product Id or too many requests",
      });
      return;
    }
    /* reset */
    await prisma.product.updateMany({
      data: {
        isFeatured: false,
      },
    });
    /* selected feature */
    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: {
        isFeatured: true,
      },
    });
    res
      .status(200)
      .json({ success: true, message: "Feature Product Updated Successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const getFeaturedProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
    });
    res.status(200).json({ success: true, featuredProducts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Some Error oCcured and server Error" });
  }
};
