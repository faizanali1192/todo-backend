import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import todosRouter from "./routes/todosRoutes";
import userRouter from "./routes/userRoutes";
import AppError from "./utils/appError";
import { catchAsync } from "./utils/catchAsync";

const app = express();
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:4000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", userRouter);
app.use("/api/todos", todosRouter);

app.use(
  "*",
  catchAsync(async (req: Request) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.send("Woo Server is Up!");
});

app.listen(port, () => console.log(`Todo app listening on port ${port}!`));
