import express from 'express';
import cors from 'cors';
import clienteRoutes from './routes/cliente.routes';

const app = express();
const PORT = process.env.PORT || 3013;

app.use(cors());
app.use(express.json());

app.use(clienteRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});