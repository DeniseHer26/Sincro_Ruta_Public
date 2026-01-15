export interface Servicios {
  idServicio: number;
  idChofer: number;
  fechaHoraProgramada: Date;
  fechaHoraLlegadaEstimada: Date;
  puntoOrigen: string;
  puntoDestino: string;
  descripcionMercancia: string;
  temperaturaMinimaReq: number;
  temperaturaMaximaReq: number;
  equipamientoReq: string;
  fechaHorarInicialReal: Date;
  fechaHorarFinalReal: Date;
  estatusServicio: EstatusServicio;
  peso: number;
  tiempo: string;
  costo: number;
  createdAt: Date;
  updatedAt: Date;
  facturas?: any[];
  evidenciasEntrega?: any[];
  monioreoRuta?: any[];
  detalles?: any[];
  empresa?: any[];
  choferes?: any[];
  unidadTransporte?: any[];
}
