import { EstatusServicio } from "../enums/estatus-servicio.enum";

export interface FilterServiciosDto {
  estatus?: EstatusServicio[];
  fechaInicio?: string;
  fechaFin?: string;
}
