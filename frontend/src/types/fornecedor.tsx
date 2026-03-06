export interface Fornecedor {
  id: string;
  name: string;
  cnpj: string;
  stateRegistration?: string;
  address:{
    street: string;
    number: string;
    city:string;
    complement?: string;
    state?: string;
    cep: string;
    neighborhood: string;
    latitude?: number;
    longitude?: number
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
  capacity:string;
  email: string;
  observacoes?: string;
  status?: boolean;
  legalNature: string;
 criadoEm?: string;
 latitude?: number;
 longitude?: number;
}