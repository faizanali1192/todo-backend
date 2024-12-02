import { NextFunction, Request, Response } from "express";
import { todosModel } from "../models/todoModel";
import {
  getPagination,
  getSortOrder,
  SortOrderType,
} from "../utils/helperFunctions";

interface TodoParams {
  id: string;
}
interface TodoBody {
  title: string;
}

const createTodo = async (req: Request, res: Response) => {
  const { title } = req.body;

  try {
    const newTodo = await todosModel.create({
      title,
    });
    res.status(201).json({ status: "Todo created", data: newTodo });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error creating todo", error });
  }
};

const getTodos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      pageLimit: limit = 10,
      sortDirection = "asc",
    } = req.query;

    const { limit: pageSize, offset } = getPagination(
      next,
      page as unknown as string,
      limit as unknown as string
    );
    const sortOrder = getSortOrder(sortDirection as SortOrderType);

    const { count, rows } = await todosModel.findAndCountAll({
      offset,
      limit: pageSize,
      order: [["id", sortOrder]],
    });

    res.status(200).json({
      status: "success",
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: Number(page),
        pageSize,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error fetching todos", error });
  }
};

const getTodoById = async (req: Request<TodoParams>, res: Response) => {
  const { id } = req.params;

  try {
    const todo = await todosModel.findOne({ where: { id } });

    if (!todo) {
      return res
        .status(404)
        .json({ status: "error", message: "Todo not found" });
    }

    return res.status(200).json({ status: "success", data: todo });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error fetching todo", error });
  }
};

const updateTodo = async (
  req: Request<TodoParams, {}, TodoBody>,
  res: Response
) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const todo = await todosModel.findOne({
      where: { id },
    });

    if (!todo) {
      return res
        .status(404)
        .json({ status: "error", message: "Todo not found" });
    }

    todo.title = title;
    await todo.save();

    res.status(200).json({ status: "success", data: todo });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error updating todo", error });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const todo = await todosModel.findOne({ where: { id } });

    if (!todo) {
      return res
        .status(404)
        .json({ status: "error", message: "Todo not found" });
    }

    await todo.destroy();
    res.status(200).json({ status: "success", message: "Todo deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error deleting todo", error });
  }
};

export { createTodo, deleteTodo, getTodoById, getTodos, updateTodo };
