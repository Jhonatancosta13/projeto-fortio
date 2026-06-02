import { Router } from 'express';
import { ClienteController } from '../controller/cliente.controller';

const router = Router();
const clienteController = new ClienteController();

router.post("/clientes", clienteController.create);
router.get("/clientes", clienteController.getAll);
router.get("/clientes/:id", clienteController.getById);
router.delete("/clientes/:id", clienteController.deleteCliente);
router.put("/clientes/:id", clienteController.update);

export default router;