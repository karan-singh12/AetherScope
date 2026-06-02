import { NextFunction, Request, Response } from "express";
import prisma from "../../../config/prisma";
import { PasswordService } from "../../../services/auth/password.service";
import { TokenService } from "../../../services/auth/token.service";
import { config } from "../../../config";
import { USER } from "../../../utils/responseMssg";
import * as apiRes from "../../../utils/apiResponse";
import { log } from "../../../utils/logger";

const userTokenSecret = config.auth.secrets.user;
const userTokenExpiry = config.auth.userTokenExpire;

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const name = (req.body.name || "").trim();
        const email = (req.body.email || "").toLowerCase();
        const password = req.body.password;

        if (!email) {
            apiRes.errorResponse(res, USER.emailRequired);
            return;
        }

        if (!password) {
            apiRes.errorResponse(res, USER.passwordRequired);
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            apiRes.errorResponse(res, USER.emailAlreadyExists);
            return;
        }

        const passwordHash = await PasswordService.hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });

        if (!userTokenSecret) {
            throw new Error("Missing user token secret in environment");
        }

        const { token } = TokenService.generateAccessToken(user.id, userTokenSecret, userTokenExpiry, user.email);

        apiRes.successResponse(res, USER.signupSuccess, {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        log(error?.message || error);
        apiRes.errorResponse(res, error?.message || "Signup failed");
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const email = (req.body.email || "").toLowerCase();
        const password = req.body.password;

        if (!email) {
            apiRes.errorResponse(res, USER.emailRequired);
            return;
        }

        if (!password) {
            apiRes.errorResponse(res, USER.passwordRequired);
            return;
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            apiRes.errorResponse(res, USER.invalidLogin);
            return;
        }

        const passwordMatches = await PasswordService.verifyPassword(password, user.passwordHash);
        if (!passwordMatches) {
            apiRes.errorResponse(res, USER.invalidLogin);
            return;
        }

        if (!userTokenSecret) {
            throw new Error("Missing user token secret in environment");
        }

        const { token } = TokenService.generateAccessToken(user.id, userTokenSecret, userTokenExpiry, user.email);

        apiRes.successResponse(res, USER.loginSuccess, {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        log(error?.message || error);
        apiRes.errorResponse(res, error?.message || "Login failed");
    }
};
