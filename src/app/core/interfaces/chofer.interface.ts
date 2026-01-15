import { Empresa } from "./empresa.interface";
import { unidadesTransporte } from "./unidades-transporte.interface";

export interface Chofer {
  idChofer: number;
  servicios?: any[];
  idEmpresa: number;
  empresa?: Empresa;
  unidadTransporte?: unidadesTransporte | null;
  idUnidadTransporte?: number | null;
  nombre: string;
  licencia: string;
  telefono: string;
  active: boolean;
}
