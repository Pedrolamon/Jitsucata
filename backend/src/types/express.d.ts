// src/types/express.d.ts

import { Request } from 'express';
// Não precisa mais importar JwtPayload nem definir DecodedUser separadamente,
// se você for usar 'any' para o 'user'

declare module 'express' {
  interface Request {
    user?: any; // Altere para 'any'
  }
}

export interface User {
  id: string;
  name: string;
  password: string;
  role: string;
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
  latitude?: number;
  longitude?: number;
  password
}