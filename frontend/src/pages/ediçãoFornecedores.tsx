import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import type { Fornecedor } from '../types/fornecedor';
import { ArrowLeft, Building2, MapPin, Shield, UserCircle, PlusCircle, Loader2 } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const EdiçãoFornecedores = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState<Omit<Fornecedor, 'id' | 'status'>>({
    name: "",
    cnpj: "",
    stateRegistration: "",
    address: {
      street: "",
      number: "",
      city: "",
      complement: "",
      state: "",
      cep: "",
      neighborhood: "",
    },
    EnvironmentalLicense: {
      numero: "",
      IssuingBody: "",
      validity: "",
    },
    LegalRepresentative: {
      name: "",
      cpf: "",
      rg: "",
      position: "",
      phone: "",
      email: "",
    },
    Phone: "",
    capacity: "",
    email: "",
    observacoes: "",
    legalNature: "",
  });

  // 1. CARREGAR DADOS DO FORNECEDOR AO ABRIR A PÁGINA
  useEffect(() => {
    const fetchFornecedor = async () => {
      try {
        setFetching(true);
        const response = await api.get(`/fornecedores/${id}`);
        // Preenche o formulário com os dados que vêm do banco
        setFormData(prev => ({
          ...prev,
          ...response.data,
          address: { ...prev.address, ...response.data.address },
          EnvironmentalLicense: { ...prev.EnvironmentalLicense, ...response.data.EnvironmentalLicense },
          LegalRepresentative: { ...prev.LegalRepresentative, ...response.data.LegalRepresentative }
        }));
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados deste fornecedor.');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchFornecedor();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!id) throw new Error("Fornecedor não encontrado")
      await api.put(`/fornecedores/${id}`, formData);
      alert("Dados atualizados com sucesso!")
      navigate('/fornecedores');
    } catch (err) {
      setError('Erro ao cadastrar fornecedor. Verifique os dados ou conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-white" size={40} />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--color-primary)] transition-colors mb-4"
      >
        <ArrowLeft size={20} /> Voltar para listagem
      </button>

      <Card className="border-none shadow-2xl bg-white ">
        <CardHeader className="border-b ">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <PlusCircle className="text-[var(--color-primary)]" />
            Cadastrar Novo Fornecedor
          </CardTitle>
          <p className="text-sm text-muted-foreground">Preencha os dados abaixo para registrar um novo parceiro no sistema.</p>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Seção 1: Dados Básicos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <Building2 size={18} /> Dados da Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome Fantasia</Label>
                  <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" required placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail Corporativo</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="Phone">Telefone</Label>
                  <Input id="Phone" required value={formData.Phone} onChange={(e) => setFormData({ ...formData, Phone: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                  <Input id="stateRegistration" value={formData.stateRegistration} onChange={(e) => setFormData({ ...formData, stateRegistration: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Seção 2: Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <MapPin size={18} /> Localização
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="street">Logradouro (Rua/Av)</Label>
                  <Input id="street" required value={formData.address?.street || ""} onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, street: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" required value={formData.address.number} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, number: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" required value={formData.address.neighborhood} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, neighborhood: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" required value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">Estado (UF)</Label>
                  <Input id="state" required value={formData.address.state} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} />
                </div>
              </div>
            </div>

            {/* Seção 3: Licenciamento e Capacidade */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <Shield size={18} /> Licenciamento Ambiental
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="LicenseNumber">Nº da Licença</Label>
                  <Input id="LicenseNumber" value={formData.EnvironmentalLicense.numero} onChange={(e) => setFormData({ ...formData, EnvironmentalLicense: { ...formData.EnvironmentalLicense, numero: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="IssuingBody">Órgão Emissor</Label>
                  <Input id="IssuingBody" placeholder="Ex: INEA" value={formData.EnvironmentalLicense.IssuingBody} onChange={(e) => setFormData({ ...formData, EnvironmentalLicense: { ...formData.EnvironmentalLicense, IssuingBody: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="Validity">Validade</Label>
                  <Input id="Validity" type="date" value={formData.EnvironmentalLicense.validity} onChange={(e) => setFormData({ ...formData, EnvironmentalLicense: { ...formData.EnvironmentalLicense, validity: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacidade Geração (T/Mês)</Label>
                  <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Seção 4: Representante Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <UserCircle size={18} /> Representante Legal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="legalName">Nome Completo</Label>
                  <Input id="legalName" value={formData.LegalRepresentative.name} onChange={(e) => setFormData({ ...formData, LegalRepresentative: { ...formData.LegalRepresentative, name: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="legalEmail">E-mail de Contato</Label>
                  <Input id="legalEmail" value={formData.LegalRepresentative.email} onChange={(e) => setFormData({ ...formData, LegalRepresentative: { ...formData.LegalRepresentative, email: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="legalPhone">Telefone Direto</Label>
                  <Input id="legalPhone" value={formData.LegalRepresentative.phone} onChange={(e) => setFormData({ ...formData, LegalRepresentative: { ...formData.LegalRepresentative, phone: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="legalPhone">CPF</Label>
                  <Input id="legalPhone" value={formData.LegalRepresentative.cpf} onChange={(e) => setFormData({ ...formData, LegalRepresentative: { ...formData.LegalRepresentative, cpf: e.target.value } })} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/fornecedores')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-primary)] px-10">
                {loading ? "Salvando..." : "Salvar Fornecedor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EdiçãoFornecedores;