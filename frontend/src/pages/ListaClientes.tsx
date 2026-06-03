import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Box,
  TextField, InputAdornment, Snackbar, Alert,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle // <-- Novos imports do Modal!
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';

import { api } from '../services/api';

interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  segmento: string;
}

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });
  const navigate = useNavigate();

  
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteParaDeletar, setClienteParaDeletar] = useState<number | null>(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      setToast({ open: true, message: 'Erro ao buscar clientes.', type: 'error' });
    }
  };

  // 1. Função que apenas abre o modal e guarda quem vai ser excluído
  const cliqueDeletar = (id: number) => {
    setClienteParaDeletar(id);
    setModalAberto(true);
  };

  // 2. Função que fecha o modal se o usuário desistir
  const fecharModal = () => {
    setModalAberto(false);
    setClienteParaDeletar(null);
  };

  // 3. Função que realmente vai no banco e apaga
  const confirmarDelecao = async () => {
    if (clienteParaDeletar === null) return;

    try {
      await api.delete(`/clientes/${clienteParaDeletar}`);
      setClientes(clientes.filter(cliente => cliente.id !== clienteParaDeletar));
      setToast({ open: true, message: 'Cliente excluído com sucesso!', type: 'success' });
    } catch (error) {
      setToast({ open: true, message: 'Erro ao excluir o cliente.', type: 'error' });
    } finally {
      fecharModal(); // Fecha o modal indepentende de dar sucesso ou erro
    }
  };

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) || 
    cliente.cnpj.includes(busca)
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#333', fontWeight: 'bold' }}>
          Gestão de Clientes
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/cadastro')}
          sx={{ borderRadius: '8px', fontWeight: 'bold' }}
        >
          Cadastrar
        </Button>
      </Box>

      {/* BARRA DE PESQUISA */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar por nome ou CNPJ..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '8px' }
            }
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#111111' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>CNPJ</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Segmento</TableCell>
              <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: 'rgba(255,255,255, 0.9)' }}>
            
            {clientesFiltrados.map((cliente) => (
              <TableRow key={cliente.id} hover>
                <TableCell>{cliente.id}</TableCell>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.cnpj}</TableCell>
                <TableCell>{cliente.segmento}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/cadastro/${cliente.id}`)} title="Editar">
                    <EditIcon />
                  </IconButton>
                  {/* O botão chama a função que abre o Modal */}
                  <IconButton color="error" onClick={() => cliqueDeletar(cliente.id)} title="Excluir">
                    <RemoveIcon sx={{ border: '2px solid', borderRadius: '50%', p: 0.2 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            
            {clientesFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#666' }}>
                  {busca !== '' 
                    ? `Nenhum resultado encontrado para "${busca}".` 
                    : 'Ainda não existem clientes cadastrados. Clique no botão + para adicionar.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/*NOVO MODAL DE EXCLUSÃO*/}
      <Dialog
        open={modalAberto}
        onClose={fecharModal}
        slotProps={{ paper: { sx: { borderRadius: '12px', padding: '10px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este cliente permanentemente? Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ paddingRight: '20px', paddingBottom: '15px' }}>
          <Button onClick={fecharModal} sx={{ color: '#666', fontWeight: 'bold' }}>
            Cancelar
          </Button>
          <Button onClick={confirmarDelecao} variant="contained" color="error" sx={{ borderRadius: '8px', fontWeight: 'bold' }}>
            Sim, Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast de Notificações */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.type} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}