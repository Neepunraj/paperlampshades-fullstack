import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const createCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { code, discountPercent, startDate, endDate, usageLimit } = req.body;
    const createCoupon = await prisma.coupon.create({
      data: {
        code,
        discountPercent: parseFloat(discountPercent),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: parseInt(usageLimit),
        usageCount: 0,
      },
    });
    res.status(200).json({
      success: true,
      coupon: createCoupon,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error failed to create coupon" });
  }
};
export const fetchAllCoupons = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const allCoupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.status(201).json({
      success: true,
      couponList: allCoupons,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error failed to create coupon" });
  }
};

export const deleteCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    res.status(201).json({ success: true, id: id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error failed to create coupon" });
  }
};
