import dotenv from "dotenv";
import express from "express";
import connectDB from "./utils/db.js";
import integrationRoutes from "./routes/integrationRoute.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;
const DB_URI = process.env.MONGODB_URI;

// Routes
app.use("/api/integrations/esp", integrationRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	connectDB(DB_URI);
});

export default app;
