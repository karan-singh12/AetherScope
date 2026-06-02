import express, { Application } from "express";
import routes from "./routes";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";


const app: Application = express();

// Middleware
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/public", express.static("public"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// API routes
app.use("/api", routes);

export default app;
