import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import issuesRoutes from "./routes/issuesRoutes";
import { initDb } from "./db";

dotenv.config();

async function bootstrap(): Promise<void> {
    const app: Application = express();
    const port = process.env.PORT || 4000;

    app.use(cors());
    app.use(express.json());

    app.get("/health", (req: Request, res: Response) => {
        res.json({ status: "ok" });
    });

    app.use("/api/issues", issuesRoutes);

    // Basic global error handler
    app.use(
        (err: Error, req: Request, res: Response, next: NextFunction): void => {
            console.error(err);
            res.status(500).json({ error: err.message || "Internal server error" });
        }
    );

    await initDb();

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

bootstrap().catch((err) => {
    console.error("Failed to start server:", err);
});
