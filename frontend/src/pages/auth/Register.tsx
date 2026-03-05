import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Fornecedor } from "../../types/fornecedor";
import { cn } from "../../lib/utils";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<Omit<Fornecedor, "id">>({
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
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        ...formData,
        status: true,
        password: password,
        perfil: "fornecedor",
      });
      navigate("/login");
    } catch (err) {
      setError("E-mail ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen min-w-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 font-sans",
      )}
    >
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <form className="p-6 md:p-8 " onSubmit={handleSubmit}>
              <div className="flex flex-col items-center text-center">
                <h1 className="font-bold mb-8">Crie sua conta</h1>
              </div>
              <div className=" gap-6 grid md:grid-cols-2">
                {error && (
                  <div className="text-sm text-center text-red-500">
                    {error}
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="name">Nome fantasia</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nome da empresa"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="Phone">Celular</Label>
                  <Input
                    id="Phone"
                    type="tel"
                    placeholder="(xx)xxxxxxxxx"
                    required
                    value={formData.Phone}
                    onChange={(e) =>
                      setFormData({ ...formData, Phone: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="cnpj"> CNPJ</Label>
                  <Input
                    id="cnpj"
                    type="text"
                    placeholder="cnpj"
                    required
                    value={formData.cnpj}
                    onChange={(e) =>
                      setFormData({ ...formData, cnpj: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="stateRegistration">Inscrição estadual</Label>
                  <Input
                    id="stateRegistration"
                    type="text"
                    placeholder="Rio de Janeiro"
                    required
                    value={formData.stateRegistration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stateRegistration: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="street">Endereço</Label>
                  <Input
                    id="street"
                    type="text"
                    placeholder="Rua"
                    required
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          street: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    type="text"
                    placeholder="Ex 258"
                    required
                    value={formData.address.number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          number: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    type="text"
                    placeholder="Bairro da Empresa"
                    required
                    value={formData.address.neighborhood}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          neighborhood: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Volta redonda"
                    required
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    type="text"
                    placeholder="xxxxx-xxx"
                    required
                    value={formData.address.cep}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, cep: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    type="text"
                    placeholder=""
                    value={formData.address.complement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          complement: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="Rio de janeiro"
                    required
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="capacity">Capacidade (T)</Label>
                  <Input
                    id="Capacity"
                    type="text"
                    placeholder="Capacitade mensal geração mensal"
                    required
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="legalNature">Natureza legal</Label>
                  <Input
                    id="legalNature"
                    type="text"
                    value={formData.legalNature}
                    onChange={(e) =>
                      setFormData({ ...formData, legalNature: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input
                    id="observacoes"
                    type="text"
                    placeholder=""
                    required
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData({ ...formData, observacoes: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="LicenseNumber">Número de licenciamento</Label>
                  <Input
                    id="LicenseNumber"
                    type="text"
                    placeholder=""
                    value={formData.EnvironmentalLicense.numero}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        EnvironmentalLicense: {
                          ...formData.EnvironmentalLicense,
                          numero: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="IssuingBody">Órgão Emissor</Label>
                  <Input
                    id="IssuingBody"
                    type="text"
                    placeholder="Inea"
                    value={formData.EnvironmentalLicense.IssuingBody}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        EnvironmentalLicense: {
                          ...formData.EnvironmentalLicense,
                          IssuingBody: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="Validity">Validade da licensa</Label>
                  <Input
                    id="Validity"
                    type="date"
                    value={formData.EnvironmentalLicense.validity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        EnvironmentalLicense: {
                          ...formData.EnvironmentalLicense,
                          validity: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="m-4 border-b pb-2 flex justify-center  ">
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                  Informações do representante legal
                </h2>
              </div>

              <div className="gap-6 grid md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="legalName">Nome</Label>
                  <Input
                    id="legalName"
                    type="text"
                    placeholder="Nome do representante legal"
                    value={formData.LegalRepresentative.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        LegalRepresentative: {
                          ...formData.LegalRepresentative,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="legalcpf">CPF</Label>
                  <Input
                    id="legalcpf"
                    type="text"
                    placeholder="CPF do Representante legal"
                    value={formData.LegalRepresentative.cpf}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        LegalRepresentative: {
                          ...formData.LegalRepresentative,
                          cpf: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="legalposition">Cargo</Label>
                  <Input
                    id="legaposition"
                    type="text"
                    placeholder="Cargo"
                    value={formData.LegalRepresentative.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        LegalRepresentative: {
                          ...formData.LegalRepresentative,
                          position: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="legalPhone">Telefone</Label>
                  <Input
                    id="legalPhone"
                    type="text"
                    placeholder="(xx)xxxxxxxxx"
                    value={formData.LegalRepresentative.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        LegalRepresentative: {
                          ...formData.LegalRepresentative,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="legalEmail">E-mail</Label>
                  <Input
                    id="legalEmail"
                    type="text"
                    value={formData.LegalRepresentative.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        LegalRepresentative: {
                          ...formData.LegalRepresentative,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full m-4 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar Conta"}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"></div>
              <div className="text-center text-sm">
                já tem conta?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking enter, you agree to our{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>{" "}
          .
        </div>
      </div>
    </div>
  );
};

export default Register;
