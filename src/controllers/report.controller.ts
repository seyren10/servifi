import { NextFunction, Request, Response } from "express";
import receiptModel from "../models/receipt.model";
import { Parser as Json2csvParser } from "json2csv";
import { addDays, format, parseISO, startOfDay } from "date-fns";
import { Product } from "../types/product";
export const getTransactionReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topN = parseInt(req.query.top as string) || 3;

    // Parse optional date filters
    const from = req.query.from ? new Date(req.query.from as string) : null;
    const to = req.query.to ? new Date(req.query.to as string) : null;

    const matchStage: any = {};

    if (from && to) {
      matchStage.createdAt = { $gte: from, $lte: to };
    } else if (from) {
      matchStage.createdAt = { $gte: from };
    } else if (to) {
      matchStage.createdAt = { $lte: to };
    }

    // Full aggregation pipeline:
    const pipeline: any[] = [];

    if (Object.keys(matchStage).length) {
      pipeline.push({ $match: matchStage });
    }

    // Add a stage to unwind products
    pipeline.push({ $unwind: "$products" });

    // Stats stage
    pipeline.push({
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: {
                  $multiply: ["$products.total", "$products.quantity"],
                },
              },
              totalQuantity: { $sum: "$products.quantity" },
              totalReceipts: { $addToSet: "$_id" },
            },
          },
          {
            $project: {
              _id: 0,
              totalRevenue: 1,
              totalQuantity: 1,
              totalReceipts: { $size: "$totalReceipts" },
            },
          },
        ],
        topProducts: [
          {
            $group: {
              _id: "$products.productId",
              quantity: { $sum: "$products.quantity" },
            },
          },
          { $sort: { quantity: -1 } },
          { $limit: topN },
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          { $unwind: "$productInfo" },
          {
            $project: {
              productId: "$_id",
              productName: "$productInfo.name",
              quantity: 1,
            },
          },
        ],
      },
    });

    const result = await receiptModel.aggregate(pipeline);

    const stats = result[0]?.totals[0] || {
      totalRevenue: 0,
      totalQuantity: 0,
      totalReceipts: 0,
    };

    const topProducts = result[0]?.topProducts || [];

    res.json({
      ...stats,
      topProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadTransactionReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter: Record<string, any> = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};

      if (startDate) {
        const start = startOfDay(parseISO(startDate as string));
        dateFilter.createdAt.$gte = start;
      }

      if (endDate) {
        const end = startOfDay(parseISO(endDate as string));
        dateFilter.createdAt.$lt = addDays(end, 1);
      }
    }

    const receipts = await receiptModel
      .find(dateFilter)
      .populate("products.productId")
      .lean();

    const rows: any[] = [];

    let totalQuantity = 0;
    let totalProductAmount = 0;

    receipts.forEach((receipt) => {
      receipt.products.forEach((product) => {
        const quantity = product.quantity || 0;
        const productTotal = product.total || 0;
        const productModel = product.productId as unknown as Product;

        totalQuantity += quantity;
        totalProductAmount += quantity * productTotal;

        rows.push({
          receiptId: receipt._id.toString(),
          productName: productModel.name || "",
          quantity: quantity,
          productTotal: productTotal,
          receiptTotal: quantity * productTotal,
          createdAt: format(new Date(receipt.createdAt!), "yyyy-MM-dd HH:mm:ss"),
        });
      });
    });

    // Add summary row — using calculated totalProductAmount
    rows.push({
      receiptId: "TOTALS",
      productName: "",
      quantity: totalQuantity,
      productTotal: "", // Optional: leave empty if you want
      receiptTotal: totalProductAmount,
      createdAt: "",
    });

    const fields = [
      "receiptId",
      "productName",
      "quantity",
      "productTotal",
      "receiptTotal",
      "createdAt",
    ];

    const parser = new Json2csvParser({ fields });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment(`receipts_report_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
