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
exports.handleError = exports.authorize = void 0;
exports.getPagination = getPagination;
exports.getSortOrder = getSortOrder;
exports.oneDayFromNow = oneDayFromNow;
const appError_1 = __importDefault(require("./appError"));
const userModel_1 = require("../models/userModel");
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.headers["session-id"];
        if (!sessionId) {
            res.status(401).json({
                status: "error",
                message: "Unauthorized: No session ID provided",
            });
            return;
        }
        const existingSession = yield userModel_1.sessionModel.findOne({
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
    }
    catch (error) {
        console.error("Authorization error:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});
exports.authorize = authorize;
const handleError = (res, status, message, error) => {
    return res.status(status).json({ status: message, error });
};
exports.handleError = handleError;
function getPagination(next, page, limit) {
    if (isNaN(Number(page)) ||
        isNaN(Number(limit)) ||
        Number(page) <= 0 ||
        Number(limit) <= 0) {
        return next(new appError_1.default("Invalid pagination parameters", 400));
    }
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const offset = (pageNumber - 1) * pageSize;
    return {
        limit: pageSize,
        offset,
    };
}
function getSortOrder(sortDirection) {
    return sortDirection === "desc" ? "DESC" : "ASC";
}
function oneDayFromNow() {
    const addOneDay = 24 * 60 * 60 * 1000;
    return new Date(Date.now() + addOneDay);
}
