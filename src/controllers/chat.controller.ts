import { Request, Response } from 'express';
import * as service from '../services/chat.service';
import { createConversation } from '../services/conversation.service';
import * as apiRes from '../utils/apiResponse';
import { LLM } from '../utils/responseMssg';

const mapLLMErrorToUserMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return LLM.generalError;
  }

  const msg = error.message || "";

  if (msg.includes("not configured") || msg.includes("key is not configured")) {
    return LLM.unconfigured;
  }

  if (
    msg.includes("503") ||
    msg.includes("high demand") ||
    msg.includes("temporary") ||
    msg.includes("UNAVAILABLE")
  ) {
    return LLM.highDemand;
  }

  if (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("billing") ||
    msg.includes("limit")
  ) {
    return LLM.quotaExceeded;
  }

  if (
    msg.includes("401") ||
    msg.includes("invalid key") ||
    msg.includes("Authorization") ||
    msg.includes("API key is invalid")
  ) {
    return LLM.quotaExceeded;
  }

  if (msg.includes("500") || msg.includes("502") || msg.includes("504")) {
    return LLM.unavailable;
  }

  return LLM.generalError;
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, prompt } = req.body;
    const authUser = (req as any).user as { userId: string } | undefined;
    const userId = authUser?.userId;
    if (!userId) return apiRes.unauthorizedResponse(res, 'Unauthorized');

    const conversation = conversationId
      ? conversationId
      : (await createConversation(userId)).id;

    const message = await service.sendMessage(conversation, prompt);
    console.log(message, "yaha message ayga dekhna ")
    return apiRes.successResponse(res, 'Message sent', message);
  } catch (error: unknown) {
    const userFriendlyMessage = mapLLMErrorToUserMessage(error);
    return apiRes.errorResponse(res, userFriendlyMessage, 400);
  }
};

