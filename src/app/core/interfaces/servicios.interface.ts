import { EstatusServicio } from "../enums/estatus-servicio.enum";
import { Chofer } from "./chofer.interface";
import { Empresa } from "./empresa.interface";
import { UnidadTransporte } from "./unidades-transporte.interface";

export interface Servicios {
  idServicio: number;
  idEmpresa: number;
  empresa?: Empresa;

  idUnidadTransporte: number | null;
  unidadTransporte?: UnidadTransporte | null;

  idChofer: number | null;
  chofer?: Chofer | null;

  // Fechas y Horarios
  fechaHoraProgramada: Date;
  fechaHoraLlegadaEstimada: Date;
  fechaHorarInicialReal?: Date;
  fechaHorarFinalReal?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Detalles de Ruta y Carga
  puntoOrigen: string;
  puntoDestino: string;
  descripcionMercancia: string;
  peso: number;
  tiempo?: string;
  costo: number;

  // Requerimientos Técnicos
  temperaturaMinimaReq?: number;
  temperaturaMaximaReq?: number;
  equipamientoReq?: string;
  estatusServicio: EstatusServicio;

  // Relaciones OneToMany (Opcionales en la vista general)
  facturas?: any[];
  evidenciasEntrega?: any[];
  monioreoRuta?: any[];
  detalles?: any[];
}
