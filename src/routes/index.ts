import { Router } from "express";
import userRouter from "./user";
import authRouter from "./auth.route";
import chatRouter from "./chat.route";
import conversationsRouter from "./conversations.route";
import dashboardRouter from "./dashboard.route";
import logsRouter from "./logs.route";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/conversations", authMiddleware, conversationsRouter);
router.use("/chat", authMiddleware, chatRouter);
router.use("/dashboard", authMiddleware, dashboardRouter);
router.use("/logs", authMiddleware, logsRouter);

export default router;
