import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import { getDB } from "../config/db.config";
import { error } from "console";

interface DecodedToken extends JwtPayload {
    _id: string;
    role?: string;
}

interface AuthenticatedSocket extends Socket {
    user?: any;
    role?: "user" | "admin" | "streamer";
}

export const verifySocketToken = async (socket: AuthenticatedSocket, next: (err?: Error) => void): Promise<void> => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;

        const role = socket.handshake.auth?.role || socket.handshake.query?.role;

        if (!token || typeof token !== "string") {
            return next(new Error("AUTH_TOKEN_REQUIRED"));
        }

        if (!role || !["user", "admin", "streamer"].includes(role)) {
            return next(new Error("AUTH_ROLE_REQUIRED"));
        }

        let secret: string | undefined;

        switch (role) {
            case "user":
                secret = process.env.TOKEN_SECRET_KEY_2;
                break;
            case "admin":
                secret = process.env.TOKEN_SECRET_KEY_1;
                break;
            case "streamer":
                secret = process.env.TOKEN_SECRET_KEY_3;
                break;
        }

        if (!secret) {
            return next(new Error("AUTH_SECRET_NOT_CONFIGURED"));
        }

        let decoded: DecodedToken;

        try {
            decoded = jwt.verify(token, secret) as DecodedToken;
        } catch (error) {
            return next(new Error("AUTH_INVALID_TOKEN"));
        }

        if (!decoded._id) {
            return next(new Error("AUTH_INVALID_PAYLOAD"));
        }

        const db = getDB();
        let user: any = null;

        if (role === "admin") {
            user = await db("admins")
                .where("id", decoded._id)
                .where("status", "!=", 2)
                .first();
        }

        if (role === "user") {
            const userId = Number(decoded._id);
            if (Number.isNaN(userId)) {
                return next(new Error("AUTH_INVALID_USER_ID"));
            }

            user = await db("users")
                .where("id", userId)
                .where("role", "user")
                .where("status", "!=", 2)
                .first();
        }

        if (role === "streamer") {
            const streamerId = Number(decoded._id);
            if (Number.isNaN(streamerId)) {
                return next(new Error("AUTH_INVALID_STREAMER_ID"));
            }

            user = await db("users as s")
                .where("s.id", streamerId)
                .where("s.role", "streamer")
                .where("s.status", "!=", 2)
                .first();
        }

        if (!user) {
            return next(new Error("AUTH_USER_NOT_FOUND"));
        }

        delete user.password;

        socket.user = user;
        socket.role = role;

        return next();
    } catch (err) {
        console.error("Socket Auth Error:", err);
        return next(new Error("AUTH_FAILED"));
    }
};
