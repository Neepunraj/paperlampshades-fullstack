import { Response } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import fs from "fs";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
export const addFeatureBanner = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "banner",
      })
    );
    const uploadResults = await Promise.all(uploadPromises);
    const banners = await Promise.all(
      uploadResults.map((result) =>
        prisma.featureBanner.create({
          data: {
            imageUrl: result.secure_url,
          },
        })
      )
    );
    files.forEach((file) => fs.unlinkSync(file.path));
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
