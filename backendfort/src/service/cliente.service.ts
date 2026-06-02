import { ClienteDto } from '../controller/dto/clienteDto';
import { ClienteRepository } from '../repository/cliente.repository';

export class ClienteService {
    private repository: ClienteRepository;

    constructor() {
        this.repository = new ClienteRepository();
    }

    async getAll(): Promise<ClienteDto[]> {
        return await this.repository.getAll();
    }

    async getById(id: number): Promise<ClienteDto | null> {
        if (!id || id <= 0) {
            throw new Error('ID inválido');
        }
        return await this.repository.getById(id);
    }

    async create(data: ClienteDto): Promise<ClienteDto> {
        try{
            if (!data) throw new Error('Dados do cliente são obrigatórios');
            if (!data.nome) throw new Error('Nome é obrigatório');
            if (!data.cnpj) throw new Error('CNPJ é obrigatório');
            if (!data.segmento) throw new Error('Segmento é obrigatório');
            if (!data.cep) throw new Error('CEP é obrigatório');

            return await this.repository.create(data);
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    }

    async update(id: number, cliente: any): Promise<ClienteDto | null> {
        return await this.repository.update(id, cliente);
    }

    async deleteCliente(id: number): Promise<boolean> {
        if (!id || id <= 0) throw new Error('ID inválido');
        return await this.repository.deleteCliente(id);
    }
}