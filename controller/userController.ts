import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { sessionModel, userModel } from "../models/userModel";
import { catchAsync } from "../utils/catchAsync";
import { handleError, oneDayFromNow } from "../utils/helperFunctions";
import { v4 as uuidv4 } from "uuid";

interface RegisterRequestType {
  username: string;
  password: string;
}

interface RegisterResponseType {
  status: string;
  data?: object;
  error?: any;
}

interface LoginRequestType extends RegisterRequestType {}
interface LoginResponseType {
  status: string;
  data?: {
    sessionId: string;
    expiresAt: Date;
  };
  error?: any;
}

interface LogoutRequestType {}
interface LogoutResponseType {
  status: string;
  error?: any;
}

interface CustomRequest<TBody = any> extends Request {
  session: Session &
    Partial<SessionData> & { user?: any; authorized?: boolean }; // Add userId to session directly here
}

const registerUser = catchAsync(
  async (
    req: Request<{}, {}, RegisterRequestType>,
    res: Response<RegisterResponseType>
  ) => {
    const { username, password } = req.body;

    try {
      const existingUser = await userModel.findOne({ where: { username } });
      if (existingUser) {
        return handleError(res, 400, "User already exists with this username");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        username,
        password: hashedPassword,
      });

      res.status(201).json({ status: "User registered", data: { user } });
    } catch (error) {
      handleError(res, 500, "User can't be created", error);
    }
  }
);

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return handleError(res, 400, "Username and password are required");
  }

  try {
    const user = await userModel.findOne({ where: { username } });

    if (!user) {
      return handleError(res, 404, "User not found");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.dataValues.password
    );
    if (!isValidPassword) {
      return handleError(res, 401, "Invalid password");
    }

    const sessionId = req.headers["session-id"] as string;

    if (sessionId) {
      const existingSession = await sessionModel.findOne({
        where: { sid: sessionId },
      });
      if (existingSession) {
        await existingSession.destroy();
      }
    }

    const newSessionRes = await sessionModel.create({
      sid: uuidv4(),
      userId: user.dataValues.id,
      expire: oneDayFromNow(), // Session expiry in 24 hours
    });

    res.json({
      status: "Login successful",
      data: {
        sessionId: newSessionRes.dataValues.sid,
        expiresAt: newSessionRes.dataValues.expire,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    handleError(res, 500, "Error logging in. Please try again later.", error);
  }
});

const logoutUser = catchAsync(
  async (
    req: Request<{}, {}, LogoutRequestType>,
    res: Response<LogoutResponseType>
  ) => {
    try {
      const sessionId = req.headers["session-id"] as string;
      console.log("sessionId", sessionId);

      if (!sessionId) {
        return handleError(res, 400, "Session ID not found");
      }

      const existingSession = await sessionModel.findOne({
        where: { sid: sessionId },
      });

      if (!existingSession) {
        return handleError(res, 404, "Session not found");
      }

      await existingSession.destroy();

      res.json({
        status: "Logout successful",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      handleError(res, 500, "Error logging out", error);
    }
  }
);

export { loginUser, logoutUser, registerUser };
