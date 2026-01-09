export interface Empresa {
  idEmpresa: number;
  nombreEmpresa: string;
  razonSocial?: string;
  giroEmpresarial: string;
  rfc: string,
  direccion: string;
  representanteLegal?: string;
  curp?: string;
  correoElectronico: string;
  numeroTelefonico: string;
  logo?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  servicios?: any[];
}
