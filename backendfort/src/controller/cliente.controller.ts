import { Request, Response } from 'express';
import { ClienteService } from '../service/cliente.service';

export class ClienteController {
    private clienteService: ClienteService;

    constructor() {
        this.clienteService = new ClienteService();
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const clientes = await this.clienteService.getAll();
            res.status(200).json(clientes);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Erro ao listar clientes' });
        }
    };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string);
      const data = await this.clienteService.getById(id);
      
      if (!data) {
        res.status(404).json({ error: 'Cliente não encontrado' });
        return;
      }
      
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Erro ao buscar cliente' });
    }
  };

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('Inicio criação de cliente');
            const cliente = await this.clienteService.create(req.body);
            res.status(201).json(cliente);

        } catch (error: any) {
            console.error('Erro ao criar cliente:', error);
            let status = 500;
            if (error.message.includes('obrigatório')) status = 400;
            if (error.code === '23505') status = 409;
        
            res.status(status).json({ error: error.message || 'Erro ao criar cliente' });
        }
    };

    update = async (req: Request, res: Response): Promise<Response> => {
    try {
      
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const clienteAtualizado = await this.clienteService.update(id, req.body);

      if (!clienteAtualizado) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      return res.status(200).json(clienteAtualizado);

    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error);
      return res.status(500).json({ error: error.message || 'Erro interno ao atualizar cliente' });
    }
  };

    deleteCliente = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string);
            const deleted = await this.clienteService.deleteCliente(id);

            if (!deleted) {
                res.status(404).json({ error: 'Cliente não encontrado' });
                return;
            }
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Erro ao deletar cliente' });
        }
    };
}
