import express from "express";
import termsController from "../controllers/termsController";

const router = express.Router();

// GET /api/terms/:type
router.get("/:type", termsController.getTerms);

export default router;
