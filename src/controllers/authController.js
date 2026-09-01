import User from "../models/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import Session from "../models/session.js";
import {createSession, setSessionCookies} from "../services/auth.js";


export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if(existingUser) {
    throw createHttpError(409, `Email ${email} in use`);
  }

  // hashing password
  const hashedPassword = await bcrypt.hash(password, 10);

  // creating new user
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const session = await createSession(newUser._id);
  setSessionCookies(res, session);

  res.status(201).json(newUser);
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // compare if a user with this email exists
  const user = await User.findOne({ email });
  if(!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  // compare password hashes
  const isValidPassword = await bcrypt.compare(password, user.password);
  if(!isValidPassword) {
    throw createHttpError(401, "Invalid credentials")
  }

  // Видаляємо стару сесію користувача
  await Session.deleteOne({ userId: user._id });

  // Створюємо нову сесію
  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};


export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if(!sessionId || !refreshToken) {
    throw createHttpError(401, "Missing session credentials");
  }

  // 1. Знаходимо поточну сесію за id сесії та рефреш токеном
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  // 2. Якщо такої сесії нема, повертаємо помилку
  if(!session) {
    throw createHttpError(401, " Session not found");
  }

  // 3. Якщо сесія існує, перевіряємо валідність рефреш токена
  const isSessionTokenExpired = session.efreshTokenValidUntil < new Date();

  // Якщо термін дії рефреш токена вийшов,
  // видаляємо сесію і повертаємо помилку
  if(isSessionTokenExpired) {
    await session.deleteOne();
    res.clearCookie("sessionId");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw createHttpError(401, "Session token expired");
  }

  // 4. Якщо всі перевірки пройшли добре, видаляємо поточну сесію
  await session.deleteOne();

  // 5. Створюємо нову сесію та додаємо кукі
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: "Session refreshed"
  });
};


export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if(sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie("sessionId");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(204).send();
};
