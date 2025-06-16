import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const createAddress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthenticated User",
      });
      return;
    }
    const { name, address, city, country, postalCode, phone, isDefault } =
      req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    const newlyCreatedAddress = await prisma.address.create({
      data: {
        userId,
        name,
        address,
        postalCode,
        country,
        city,
        phone,
        isDefault: isDefault || false,
      },
    });
    res.status(201).json({
      success: true,
      address: newlyCreatedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server Error , unable to create order",
    });
  }
};
export const getAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User is not aunthenticated",
      });
      return;
    }
    const findAddresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      address: findAddresses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error geting Address , server error" });
  }
};

export const updateAddress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { name, address, city, country, postalCode, phone, isDefault } =
      req.body;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not authorized",
      });
      return;
    }
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });
    if (!existingAddress) {
      res.status(404).json({
        success: false,
        error: "Unable to find the Address",
      });
      return;
    }
    const updateAddress = await prisma.address.update({
      where: { id },
      data: {
        name,
        address,
        city,
        country,
        postalCode,
        phone,
        isDefault: isDefault || false,
      },
    });
    res.status(200).json({
      success: true,
      address: updateAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to update, erver erro",
    });
  }
};
export const deleteAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized user",
      });
      return;
    }
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });
    if (!existingAddress) {
      res.status(404).json({
        success: false,
        error: "Address not found",
      });
      return;
    }
    await prisma.address.delete({
      where: { id },
    });
    res.status(200).json({
      success: true,
      message: "Address Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to delete , server error",
    });
  }
};
