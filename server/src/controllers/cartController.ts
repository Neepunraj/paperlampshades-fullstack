import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const addtoCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, quantity, size, color } = req.body;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User Not Authenticated",
      });
      return;
    }
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size: size || null,
          color: color || null,
        },
      },
      update: { quantity: { increment: quantity } },
      create: {
        cartId: cart.id,
        productId,
        quantity,
        size,
        color,
      },
    });
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        name: true,
        price: true,
        images: true,
      },
    });

    const responseItem = {
      id: cartItem.id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0],
      quantity: cartItem.quantity,
      productId: cartItem.productId,
      color: cartItem.color,
      size: cartItem.size,
    };
    res.status(200).json({
      success: true,
      data: responseItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        succes: false,
        error: "User not Authenticated",
      });
      return;
    }
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });
    if (!cart) {
      res.json({
        success: false,
        message: "No items found in the cart",
        data: [],
      });
      return;
    }
    const cartITemsWithProduct = await Promise.all(
      cart.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            price: true,
            images: true,
          },
        });
        return {
          id: item.id,
          productId: item.productId,
          name: product?.name,
          price: product?.price,
          image: product?.images[0],
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        };
      })
    );
    res.status(200).json({
      success: true,
      data: cartITemsWithProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error failed to fetch",
    });
  }
};
export const removeFromCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not Authorized",
      });
      return;
    }
    await prisma.cartItem.delete({
      where: { id, cart: { userId } },
    });
    res.status(200).json({
      success: true,
      message: "Items is removed from the cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error unable to remove from cart",
    });
  }
};
export const updateCartItemQuantity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    console.log(userId);
    const { id } = req.params;
    const { quantity } = req.body;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not Authenticated ",
      });
      return;
    }
    const updateItem = await prisma.cartItem.update({
      where: { id, cart: { userId } },
      data: {
        quantity,
      },
    });
    const product = await prisma.product.findUnique({
      where: { id: updateItem.productId },
      select: {
        name: true,
        price: true,
        images: true,
      },
    });
    const responseItem = {
      id: updateItem.id,
      productId: updateItem.productId,
      name: product?.name,
      price: product?.price,
      image: product?.images[0],
      quantity: updateItem.quantity,
      size: updateItem.size,
      color: updateItem.color,
    };
    res.status(200).json({
      success: true,
      date: responseItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server eroror and unable to update",
    });
  }
};

export const clearEntireCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: "User not Aunticated",
      });
      return;
    }
    await prisma.cartItem.deleteMany({
      where: { cart: { userId } },
    });
    res
      .status(200)
      .json({ success: true, message: "Cart Cleared SuccessFully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error and unable to clear entire cart",
    });
  }
};
