
import { Request } from 'express';
// se você for usar 'any' para o 'user'

declare module 'express' {
  interface Request {
    user?: any;
  }
}

export type Perfil = 'admin' | 'fornecedor' | 'financeiro';

export interface Usuario {
  nome: string;
  email: string;
  perfil: Perfil;
  senha?: string;
}

export interface Fornecedor {
  id?: string;
  name: string;
  cnpj: string;
  stateRegistration?: string;
  address: {
    street: string;
    number: string;
    city: string;
    complement?: string;
    state?: string;
    cep: string;
    neighborhood: string;
    latitude?: number;
    longitude?: number;
  }
  EnvironmentalLicense: {
    numero: string;
    IssuingBody: string;
    validity: string;
  },
  LegalRepresentative: {
    name: string;
    cpf: string;
    rg: string;
    position: string;
    phone: string;
    email: string;
  },
  Phone?: string;
  capacity: string;
  email: string;
  observacoes?: string;
  status?: boolean;
  legalNature: string;
  criadoEm?: string;
  password
}