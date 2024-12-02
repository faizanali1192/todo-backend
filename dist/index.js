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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const todosRoutes_1 = __importDefault(require("./routes/todosRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const appError_1 = __importDefault(require("./utils/appError"));
const catchAsync_1 = require("./utils/catchAsync");
// import { jsonErrorHandler } from "./utils/helperFunctions";
const app = (0, express_1.default)();
const port = 4000;
app.use((0, cors_1.default)({
    origin: "http://localhost:4000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable credentials (if needed)
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use("/api/users", userRoutes_1.default);
app.use("/api/todos", todosRoutes_1.default);
app.use("*", (0, catchAsync_1.catchAsync)((req) => __awaiter(void 0, void 0, void 0, function* () {
    throw new appError_1.default(`Can't find ${req.originalUrl} on this server`, 404);
})));
app.get("/", (_req, res) => {
    res.send("Woo Server is Up!");
});
app.listen(port, () => console.log(`Todo app listening on port ${port}!`));
