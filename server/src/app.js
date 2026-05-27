import cors from "cors";
import express from "express";
import helmet from "helmet";

import env from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// El router de API va primero; not-found y error-handler cierran el pipeline.
app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
