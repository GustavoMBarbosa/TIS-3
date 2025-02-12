import express from "express";
import cors from "cors";
import "dotenv/config";
import swaggerDocs from "./swagger/swagger.js";
import swaggerUi from "swagger-ui-express";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import animalsRouter from "./routes/animalsRoutes.js";
import gestacaoRouter from "./routes/gestacaoRoutes.js";
import workerRouter from './routes/workerRoutes.js';
import gadoRouter from './routes/gadoRoutes.js';
import despesasRouter from './routes/despesasRoutes.js';
import lucroRouter from './routes/lucroRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import NotificationRouter from './routes/notificationRoutes.js'
import importRouter from './routes/importRoutes.js'

const app = express();
const PORT = process.env.PORT;


app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://cresca-conosco.queirozrocha.com",
            "https://cresca-conosco-develop.vercel.app",
            "https://cresca-conosco-staging.onrender.com",
            "https://cresca-conosco.onrender.com",
            "http://localhost:3000",
        ],
        credentials: true,
    })
)
    .use(express.json())
    .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
    .use("/user", userRouter)
    .use("/auth", authRouter)
    .use("/animals", animalsRouter)
    .use("/gestacao", gestacaoRouter)
    .use('/mao-de-obra', workerRouter)
    .use('/gado', gadoRouter)
    .use('/despesas', despesasRouter)
    .use('/lucro', lucroRouter)
    .use('/finance', financeRoutes)
    .use('/notification', NotificationRouter)
    .use('/import', importRouter)

app.listen(PORT, () => {
    console.log(process.env.POSTGRES_USER);
    console.log(`Listening to http://localhost:${PORT}`);
});

export default app;
