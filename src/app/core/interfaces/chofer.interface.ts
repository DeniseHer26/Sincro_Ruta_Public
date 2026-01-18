import { Empresa } from "./empresa.interface";
import { UnidadTransporte } from "./unidades-transporte.interface";

export interface Chofer {
  idChofer: number;
  servicios?: any[];
  idEmpresa: number;
  empresa?: Empresa;
  unidadTransporte?: UnidadTransporte | null;
  idUnidadTransporte?: number | null;
  nombre: string;
  licencia: string;
  telefono: string;
  active: boolean;
}
