import express from "express";
import cors from "cors";
//db
import { connectDB } from "./database";

//routes
import fornecedorRoutes from "./routes/fornecedores";
import authRoutes from "./routes/auth"
import priceRoutes from "./routes/prices"
import user from "./routes/user"
import metas from "./routes/metas"
import inventory from "./routes/inventory"
import pagementosRoutes from "./routes/pagemento"

const app = express();

// 1. Middleware de Log (Para ver se a requisição chegou no terminal)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

// 2. Registro correto das rotas
app.use('/api', fornecedorRoutes);
app.use('/api', authRoutes);
app.use('/api', priceRoutes)
app.use("/api", user)
app.use("/api", metas)
app.use("/api", inventory)
app.use("/api", pagementosRoutes)
const PORT = 3333;

app.get('/', (req, res) => res.send('API Jitsucata Online!'));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("ERRO NO SERVIDOR:", err.stack);
  res.status(500).json({ error: "Erro interno no servidor" });
});

async function startServer() {
  try {
    console.log("Tentando conectar ao banco de dados...");
    await connectDB();
    console.log("✅ Banco de dados conectado!");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha Crítica:', error);
    process.exit(1);
  }
}

startServer();