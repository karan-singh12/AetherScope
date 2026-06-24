import { NextFunction, Request, Response } from 'express';
import * as apiRes from '../utils/apiResponse';
import { SYSTEM } from '../utils/responseMssg';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error caught in global handler:", err);

  if (err instanceof Error) {
    const errMsg = err.message || "";

    // Catch Prisma and general database connection issues
    if (
      errMsg.includes("Can't reach database server") ||
      errMsg.includes("PrismaClientInitializationError") ||
      errMsg.includes("PrismaClientKnownRequestError") ||
      errMsg.includes("database connection") ||
      errMsg.includes("connection pool")
    ) {
      return apiRes.internalServerErrorResponse(res, SYSTEM.databaseError);
    }

    // Protect sensitive server details in production
    if (process.env.NODE_ENV === 'production') {
      return apiRes.internalServerErrorResponse(res, SYSTEM.internalServerError);
    }

    return apiRes.internalServerErrorResponse(res, errMsg);
  }

  return apiRes.internalServerErrorResponse(res, SYSTEM.internalServerError);
};
