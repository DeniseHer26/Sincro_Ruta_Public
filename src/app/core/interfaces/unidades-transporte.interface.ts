import { EstadoOperativo } from "../enums/estado-operativo.enum";
import { Chofer } from "./chofer.interface";
import { Empresa } from "./empresa.interface";

export interface UnidadTransporte {
  idUnidadTransporte: number;
  placas: string;
  altura: number;
  largo: number;
  tipoUnidad: string;
  estadoOperativo: EstadoOperativo;
  capacidadCarga: number;
  tieneRefrigeracion: boolean;
  active: boolean;

  // Relacioness
  idEmpresa: number;
  empresa?: Empresa;
  idChofer: number | null;
  chofer?: Chofer | null;
  servicios?: any[];
}
