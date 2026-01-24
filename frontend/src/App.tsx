import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

//auth
import Login from './pages/auth/Login';

import PriceList from './pages/Tabela-preço';
import PaymentHistory from './pages/payment-history';
import MaterialClassification from "./pages/material/Classificação"
import Payments from './pages/pagamentos';
import Inventory from './pages/inventory';
import FinancialControl from './pages/supplier-pages/financial-control';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import FornecedoresList from './pages/FornecedoresList';
import RegistrarMaterial from './pages/material/RegistrarMaterial';
import MeusMateriais from './pages/Material-mercado';
import CriarRota from './pages/logistics/CriarZonas';
import ListarRotas from './pages/logistics/Rotas';
import DetalhesRota from './pages/logistics/DetalhesRota';
import MetasColeta from './pages/MetasColeta';
import Alertas from './pages/Alertas';
import Usuarios from './pages/Usuarios';
import TrocarSenha from './pages/auth/TrocarSenha';
import RecuperarSenha from './pages/auth/RecuperarSenha';
import Register from './pages/auth/Register';
import NovoFornecedor from './pages/novoFornecedor';
import Aprovar from './pages/Aprovar';
import EdiçãoFornecedores from './pages/ediçãoFornecedores';


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              // <PrivateRoute> inutil tem que criar 
              <Layout>
                <Dashboard />
              </Layout>
              // </PrivateRoute>
            }
          />
          <Route
            path="/fornecedores"
            element={
              // <PrivateRoute> tem nada
              <Layout>
                <FornecedoresList />
              </Layout>
              //</PrivateRoute>
            }
          /><Route
            path="/fornecedores/aprovar"
            element={
              // <PrivateRoute> tem nada
              <Layout>
                <Aprovar />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/fornecedores/:id"
            element={
              // <PrivateRoute> 
              <Layout>
                <EdiçãoFornecedores />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/fornecedores/novo"
            element={
              // <PrivateRoute> tem nada
              <Layout>
                <NovoFornecedor />
              </Layout>
              //</PrivateRoute>
            }
          />

          <Route
            path="/registrar-material"
            element={
              // <PrivateRoute perfil="fornecedor"> inicio de algo
              <Layout>
                <RegistrarMaterial />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/pagamentos"
            element={
              // <PrivateRoute perfil="fornecedor"> inicio de algo
              <Layout>
                <Payments />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              // <PrivateRoute perfil="fornecedor"> inicio de algo
              <Layout>
                <Inventory />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/controle-financeiro"
            element={
              // <PrivateRoute perfil="fornecedor"> inicio de algo
              <Layout>
                <FinancialControl />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/tabela-preços"
            element={
              // <PrivateRoute perfil="fornecedor"> inicio de algo
              <Layout>
                <PriceList />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/Classificação"
            element={
              // <PrivateRoute perfil="fornecedor"> inicio de algo
              <Layout>
                <MaterialClassification />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/historico-pagamento"
            element={
              // <PrivateRoute perfil="fornecedor"> inicio de algo
              <Layout>
                <PaymentHistory />
              </Layout>
              //</PrivateRoute>
            }
          />

          <Route
            path="/materialMercado"
            element={
              //<PrivateRoute perfil="fornecedor"> tem nada
              <Layout>
                <MeusMateriais />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/rotas/criarZonas"
            element={
              //<PrivateRoute perfil="admin"> tem nada 
              <Layout>
                <CriarRota />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/rotas"
            element={
              //<PrivateRoute perfil="admin"> tem nada 
              <Layout>
                <ListarRotas />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/rotas/:id"
            element={
              //<PrivateRoute perfil="admin">
              <Layout>
                <DetalhesRota />
              </Layout>
              //</PrivateRoute>
            }
          />

          <Route
            path="/metas"
            element={
              //<PrivateRoute perfil="admin"> inicio de algo 
              <Layout>
                <MetasColeta />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/alertas"
            element={
              //<PrivateRoute perfil="admin"> inicio de algo 
              <Layout>
                <Alertas />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              //<PrivateRoute perfil="admin"> inicio de algo 
              <Layout>
                <Usuarios />
              </Layout>
              //  </PrivateRoute>
            }
          />
          <Route
            path="/trocar-senha"
            element={
              //<PrivateRoute> inicio de algo 
              <Layout>
                <TrocarSenha />
              </Layout>
              //</PrivateRoute>
            }
          />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
