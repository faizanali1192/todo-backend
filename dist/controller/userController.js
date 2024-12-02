"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.logoutUser = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = require("../models/userModel");
const catchAsync_1 = require("../utils/catchAsync");
const helperFunctions_1 = require("../utils/helperFunctions");
const uuid_1 = require("uuid");
const registerUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const existingUser = yield userModel_1.userModel.findOne({ where: { username } });
        if (existingUser) {
            return (0, helperFunctions_1.handleError)(res, 400, "User already exists with this username");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield userModel_1.userModel.create({
            username,
            password: hashedPassword,
        });
        res.status(201).json({ status: "User registered", data: { user } });
    }
    catch (error) {
        (0, helperFunctions_1.handleError)(res, 500, "User can't be created", error);
    }
}));
exports.registerUser = registerUser;
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return (0, helperFunctions_1.handleError)(res, 400, "Username and password are required");
    }
    try {
        const user = yield userModel_1.userModel.findOne({ where: { username } });
        if (!user) {
            return (0, helperFunctions_1.handleError)(res, 404, "User not found");
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.dataValues.password);
        if (!isValidPassword) {
            return (0, helperFunctions_1.handleError)(res, 401, "Invalid password");
        }
        const sessionId = req.headers["session-id"];
        if (sessionId) {
            const existingSession = yield userModel_1.sessionModel.findOne({
                where: { sid: sessionId },
            });
            if (existingSession) {
                yield existingSession.destroy();
            }
        }
        const newSessionRes = yield userModel_1.sessionModel.create({
            sid: (0, uuid_1.v4)(),
            userId: user.dataValues.id,
            expire: (0, helperFunctions_1.oneDayFromNow)(), // Session expiry in 24 hours
        });
        res.json({
            status: "Login successful",
            data: {
                sessionId: newSessionRes.dataValues.sid,
                expiresAt: newSessionRes.dataValues.expire,
            },
        });
    }
    catch (error) {
        console.error("Error logging in:", error);
        (0, helperFunctions_1.handleError)(res, 500, "Error logging in. Please try again later.", error);
    }
}));
exports.loginUser = loginUser;
const logoutUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.headers["session-id"];
        console.log("sessionId", sessionId);
        if (!sessionId) {
            return (0, helperFunctions_1.handleError)(res, 400, "Session ID not found");
        }
        const existingSession = yield userModel_1.sessionModel.findOne({
            where: { sid: sessionId },
        });
        if (!existingSession) {
            return (0, helperFunctions_1.handleError)(res, 404, "Session not found");
        }
        yield existingSession.destroy();
        res.json({
            status: "Logout successful",
        });
    }
    catch (error) {
        console.error("Error logging out:", error);
        (0, helperFunctions_1.handleError)(res, 500, "Error logging out", error);
    }
}));
exports.logoutUser = logoutUser;
