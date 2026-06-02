import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Typography, Button, TextField, Grid, Card, CardContent, 
  CardActions, Box, Divider, Snackbar, Alert 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../services/api';

// Funções de Máscara (Regex)
const mascaraCNPJ = (valor: string) => {
  return valor
    .replace(/\D/g, '') 
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1'); 
};

const mascaraCEP = (valor: string) => {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export default function CadastroClientes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nome: '', cnpj: '', segmento: '', cep: '', endereco: '', numero: '', bairro: '', cidade: '', estado: ''
  });

  const [toast, setToast] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (isEdit) buscarCliente();
  }, [id]);

  const buscarCliente = async () => {
    try {
      const response = await api.get(`/clientes/${id}`);
      setFormData(response.data);
    } catch (error) {
      setToast({ open: true, message: 'Erro ao carregar dados.', type: 'error' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    if (name === 'cnpj') value = mascaraCNPJ(value);
    if (name === 'cep') value = mascaraCEP(value);

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/clientes/${id}`, formData);
        setToast({ open: true, message: 'Cliente atualizado com sucesso!', type: 'success' });
      } else {
        await api.post('/clientes', formData);
        setToast({ open: true, message: 'Cliente cadastrado com sucesso!', type: 'success' });
      }
      setTimeout(() => navigate('/clientes'), 1500);
    } catch (error: any) {
      setToast({ open: true, message: error.response?.data?.error || 'Erro ao salvar cliente', type: 'error' });
    }
  };

  return (
    <>
      <Card elevation={4} sx={{ maxWidth: 800, margin: '0 auto', borderRadius: '12px', overflow: 'hidden' }}>
        <Box sx={{ p: 3, pb: 2, backgroundColor: '#fdfaef', borderBottom: '1px solid #eee' }}>
          <Typography variant="h5" sx={{ color: '#a855f7', fontWeight: 'bold' }}>
            {isEdit ? 'Editar Cliente' : 'Novo Cadastro de Cliente'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preencha os dados abaixo para salvar no sistema.
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <CardContent sx={{ p: 4, backgroundColor: 'rgba(255,255,255,0.9)' }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Nome da Empresa" name="nome" value={formData.nome} onChange={handleChange} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleChange} required placeholder="00.000.000/0000-00" />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Segmento" name="segmento" value={formData.segmento} onChange={handleChange} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="CEP" name="cep" value={formData.cep} onChange={handleChange} required placeholder="00000-000" />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {/* Aqui está a correção com o slotProps para o Material UI v6 */}
                <TextField 
                  fullWidth 
                  label="Estado (UF)" 
                  name="estado" 
                  value={formData.estado} 
                  onChange={handleChange} 
                  required 
                  slotProps={{ htmlInput: { maxLength: 2 } }} 
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 9 }}>
                <TextField fullWidth label="Endereço (Rua/Av)" name="endereco" value={formData.endereco} onChange={handleChange} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField fullWidth label="Número" name="numero" value={formData.numero} onChange={handleChange} required />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} required />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end', p: 3, backgroundColor: '#fafafa' }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clientes')} sx={{ mr: 1, color: '#666' }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} sx={{ borderRadius: '8px', fontWeight: 'bold' }}>
              {isEdit ? 'Atualizar Dados' : 'Salvar Cadastro'}
            </Button>
          </CardActions>
        </form>
      </Card>

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
    </>
  );
}