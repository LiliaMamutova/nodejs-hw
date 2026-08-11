import express from "express";
import "dotenv/config";
import cors from 'cors';
import pino from 'pino-http';

const PORT = process.env.PORT;
const app = express();
// JSON parsing Middleware
app.use(express.json());
app.use(cors());
app.use(pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// time logging
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

//list all notes
app.get("/notes", (req, res) => {
  res.status(200).json({
    "message": "Retrieved all notes"
  });
});

// note by id
app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    "message": `Retrieved note with ID: ${noteId}`,
  });
});

// middleware error testing rout
app.get("/test-error", (req, res) => {
  throw new Error("Simulated server error");
});

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// Middleware 404 (after all routes)
app.use((req, res) => {
  res.status(404).json({message: "Route not found"})
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

