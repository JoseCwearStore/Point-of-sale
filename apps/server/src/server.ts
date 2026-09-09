import express from "express";
import { apiRouter } from "./routes";

const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api", apiRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});