import {query} from "../config/database";
import { ClienteDto } from "../controller/dto/clienteDto";

export class ClienteRepository {
    async getAll(): Promise<ClienteDto[]> {
        const result = await query('SELECT * FROM clientes ORDER BY id DESC');
        return result.rows;
    }

    async getById(id: number): Promise<ClienteDto | null> {
        const result = await query('SELECT * FROM clientes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }

    async create(data: ClienteDto): Promise<ClienteDto> {
        const result = await query(
            `INSERT INTO clientes (nome, cnpj, segmento, cep, endereco, numero, bairro, cidade, estado)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [data.nome, data.cnpj, data.segmento, data.cep, data.endereco, data.numero, data.bairro, data.cidade, data.estado]
        );
        return result.rows[0];
    }

    async update(id: number, cliente: any): Promise<any> {
        const result = await query ('UPDATE clientes SET nome = $1, cnpj = $2, segmento = $3, cep = $4, endereco = $5, numero = $6, bairro = $7, cidade = $8, estado = $9 WHERE id = $10 RETURNING *', [
            cliente.nome, cliente.cnpj, cliente.segmento, cliente.cep, cliente.endereco, cliente.numero, cliente.bairro, cliente.cidade, cliente.estado, id
        ]);
        return result.rows[0];
    }

    async deleteCliente(id: number): Promise<boolean> { 
        const result = await query('DELETE FROM clientes WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;

    }
}