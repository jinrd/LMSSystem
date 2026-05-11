import { Request, Response, NextFunction } from "express";
import termsService from "../services/termsService";
import catchAsync from "../utils/catchAsync";

const getTerms = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.params;
  const content = termsService.getTermsByType(type);
  
  res.status(200).json({
    type,
    content,
  });
});

export default {
  getTerms,
};
