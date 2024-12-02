import { NextFunction, Request, Response } from "express";

export type SortOrderType = "asc" | "desc";

import AppError from "./appError";
import { sessionModel } from "../models/userModel";

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessionId = req.headers["session-id"] as string;

    if (!sessionId) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized: No session ID provided",
      });
      return;
    }

    const existingSession = await sessionModel.findOne({
      where: { sid: sessionId },
    });

    if (!existingSession) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized: Invalid or expired session",
      });
      return;
    }

    if (existingSession) {
      if (new Date(existingSession.dataValues.expire) < new Date()) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized: Invalid or expired session",
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const handleError = (
  res: Response,
  status: number,
  message: string,
  error?: any
) => {
  return res.status(status).json({ status: message, error });
};

export function getPagination(
  next: NextFunction,
  page: string | number,
  limit: string | number
): { limit: number; offset: number } {
  if (
    isNaN(Number(page)) ||
    isNaN(Number(limit)) ||
    Number(page) <= 0 ||
    Number(limit) <= 0
  ) {
    return next(new AppError("Invalid pagination parameters", 400)) as any;
  }

  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const offset = (pageNumber - 1) * pageSize;

  return {
    limit: pageSize,
    offset,
  };
}

export function getSortOrder(sortDirection: SortOrderType) {
  return sortDirection === "desc" ? "DESC" : "ASC";
}

export function oneDayFromNow() {
  const addOneDay = 24 * 60 * 60 * 1000;
  return new Date(Date.now() + addOneDay);
}
