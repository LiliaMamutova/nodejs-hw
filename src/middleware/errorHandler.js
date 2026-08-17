import {HttpError} from "http-errors";

export const errorHandler = (err, req, res, next) => {
  console.error("Error MiddleWare: ", err);

  // if error create by http-errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name
    });
  }

  const isProd = process.env.NODE_ENV === "production";

  // all other errors
  res.status(500).json({
    message:
      isProd
        ? "Something went wrong. Please try again later."
        : err.message
  });
};
