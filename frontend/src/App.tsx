import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { 
  CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, 
  Button, Box, Container, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, IconButton, GlobalStyles 
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import ListaClientes from "./pages/ListaClientes";
import CadastroClientes from "./pages/CadastroClientes";

// 1. Configuração de Cores baseada na imagem
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#a855f7", // O roxo vibrante da imagem
    },
    error: {
      main: "#ef4444", // Vermelho intenso para o botão de excluir
    },
    background: {
      default: "transparent", // Transparente para o degradê aparecer
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

function App() {
  // Controle de abrir/fechar do Menu Lateral
  const [menuAberto, setMenuAberto] = useState(false);
  const toggleMenu = () => setMenuAberto(!menuAberto);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 

      {/* 2. Fundo Degradê Roxo suave inspirado na imagem */}
      <GlobalStyles styles={{
        body: {
          background: 'linear-gradient(135deg, #ffffff 0%, #f3e8ff 50%, #d8b4fe 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }
      }} />

      <BrowserRouter>

        {/* 3. CABEÇALHO ESCURO (Estilo BizBud) */}
        <AppBar position="static" elevation={0} sx={{ backgroundColor: '#111111', color: '#fff' }}>
          <Toolbar>
            {/* Ícone que abre a Barra Lateral */}
            <IconButton color="inherit" edge="start" onClick={toggleMenu} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
              Fortio
            </Typography>

            {/* Links Centrais (Visíveis apenas em telas maiores) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, mr: 4 }}>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#a855f7' } }}>Início</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#a855f7' } }}>Serviços</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#a855f7' } }}>Clientes</Typography>
            </Box>

            {/* Botão Roxo Arredondado */}
            <Button variant="contained" color="primary" sx={{ borderRadius: '20px', px: 4, textTransform: 'none', fontWeight: 'bold' }}>
              Ligar
            </Button>
          </Toolbar>
        </AppBar>

        {/* 4. BARRA LATERAL (Drawer) */}
        <Drawer anchor="left" open={menuAberto} onClose={toggleMenu}>
          <Box sx={{ width: 260, pt: 2 }} onClick={toggleMenu}>
            <Typography variant="h6" sx={{ px: 2, pb: 2, fontWeight: 'bold', color: '#a855f7' }}>
              Painel Administrativo
            </Typography>
            <List>
              <ListItem disablePadding>
                {/* Ao clicar aqui, ele abre a tela de Listagem */}
                <ListItemButton component={Link} to="/clientes">
                  <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Lista de Clientes" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* CONTEÚDO PRINCIPAL (Tabelas e Formulários) */}
        <Box sx={{ py: 5 }}>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/" element={<Navigate to="/clientes" replace />} />
              <Route path="/clientes" element={<ListaClientes />} />
              <Route path="/cadastro" element={<CadastroClientes />} />
              <Route path="/cadastro/:id" element={<CadastroClientes />} />
            </Routes>
          </Container>
        </Box>

      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;