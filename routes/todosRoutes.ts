import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../controller/todoController";
import { authorize } from "../utils/helperFunctions";

const router = express.Router();

router.post("/", authorize, createTodo);
router.get("/", authorize, getTodos);
router.get("/:id", authorize, getTodoById);
router.put("/:id", authorize, updateTodo);
router.delete("/:id", authorize, deleteTodo);

export default router;
