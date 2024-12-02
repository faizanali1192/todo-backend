import { Request, Response, NextFunction } from "express";

type AsyncHandler = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync = (fn: AsyncHandler) => {
  const errorHandler = (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

  return errorHandler;
};
