import { ConnectionPool } from "mssql";

export interface OrdenDeTrabajo {
  numeroOrden: number;
  idPersonalIngreso: number;
  tipoOrden: string;
  estadoOrden: string;
  numeroBus: number;
  patente: string;
  fechaIngreso: Date;
  fechaProgramada: Date | null;
  fechaEnEjecucion: Date | null;
  fechaEjecutada: Date | null;
  fechaRechazo: Date | null;
  fechaCierre: Date | null;
  kilometraje: number | null;
  codigoFlota: string;
  alerta: number | null;
  nuevo: number | null;
  codigoTaller: number | null;
  nombreTerminal: string | null;
  ultMantencion: Date | null;
  total_filas_afectadas: number;
}

export interface GetOrdenesTrabajoInput {
  pool: ConnectionPool;
  nroOT?: number;
  codTaller?: number;
  nroBus?: number;
  estadoOT?: number;
  tipoOT?: number;
  fechaIngreso?: string | Date;
  fechaSalida?: string | Date;
  nroManager?: number;
  pagina?: number;
}

// item = 0 || Órdenes de trabajo
export interface OrdenTrabajoFiltro {
  id_orden_trabajo: number;
}

// item = 1 || Buses (flota)
export interface BusFiltro {
  numero_interno: number;
  placa_patente: string;
  codigo_flota: number;
}

// item = 3 || Talleres
export interface TallerFiltro {
  codigo_taller: number;
  nombre_taller: string;
}

// item = 11 || Estados de OT
export interface EstadoOTFiltro {
  id_estado_solicitud: number;
  detalle_estado_solicitud: string;
}

// item = 12 || Tipos de OT
export interface TipoOTFiltro {
  id_tipo_orden: number;
  detalle_tipo_orden: string;
}

// item = 13 || Nros Manager
export interface ManagerFiltro {
  ot_manager: number;
}

// item = 14 || Falla Principal
export interface FallaPrincipalFiltro {
  id_falla_principal: number;
  detalle_falla_principal: string;
}

// item = 15 || Falla Secundaria
export interface FallaSecundariaFiltro {
  id_falla_secundaria: number;
  id_falla_principal: number;
  detalle_falla_secundaria: string;
}

// item = 16 || Mecánicos
export interface MecanicoFiltro {
  idPersonal: number;
  nombrePersonal: string;
  descripcionCargo: string;
  rut: string;
}

// item = 17 || Servicios
export interface ServicioFiltro {
  codigoServicio: number;
  nombreServicio: string;
}

// ---- Respuesta agrupada de los types creados mas el services ----
export interface DataFiltrosMant {
  OTs: OrdenTrabajoFiltro[];
  talleres: TallerFiltro[];
  buses: BusFiltro[];
  estadosOt: EstadoOTFiltro[];
  tiposOt: TipoOTFiltro[];
  nrosManager: ManagerFiltro[];
  fallaPrincipal: FallaPrincipalFiltro[];
  fallaSecundaria: FallaSecundariaFiltro[];
  mecanicos: MecanicoFiltro[];
  servicios: ServicioFiltro[];
}

//// Types de Sistemas y subsistemas por ejemplo: || carroceria - choque propio || etc

export interface SistemaFiltro {
  id_falla_principal: number;
  detalle_falla_principal: string;
}

export interface SubSistemaFiltro {
  id_falla_secundaria: number;
  id_falla_principal: number;
  detalle_falla_secundaria: string;
}

// CREAR UNA OT DE TRABAJO //

export interface FallaInput {
  id_falla_principal: number | null;
  id_falla_secundaria?: number | null;
  id_personal_falla_principal?: number | null;
  id_personal_falla_secundaria?: number | null;
  id_perfil_principal?: number | null;
  id_perfil_secundaria?: number | null;
}

export interface CreateOrdenTrabajoInput {
  id_personal_ingreso: number;
  id_tipo_orden: number;
  codigo_flota: number;
  detalle_ingreso: string;
  fecha_programada?: string;
  codigo_taller: number;
  servicio?: string;
  fallas: FallaInput[];
}

export interface OrdenTrabajoCreada {
  idSolicitudIngresada: number;
  bus: string;
  ppu: string;
  ingreso: string;
}

export interface SoftDeleteResponse {
  respuesta: number; // 1 = OK, 0 = no existe, -1 = error
  mensaje: string;
}

// TYPES PARA VER DETALLES DE OT CORRECTIVO Y OT PREVENTIVO SEGUN ID_ORDE_TRABAJO //
export type OrdenTrabajoBasic = {
  numeroOrden: number;
  numeroBus: number;
  patente: string;
  fechaIngreso: string;
  fechaCierre?: string;
  detalleIngreso: string;
  detalleCierre?: string;
  tecnicoResponsable?: string;
  conductor?: string;
  tipoOrden: "Correctiva" | "Preventiva";
  estadoCodigo: number;
  estadoDescripcion: string;
  kilometraje?: number;
  fechaUltimaMantencion?: string;
  codigoFlota: number;
  comentarioEntrada?: string;
  otManager?: number;
  nombreTaller?: string;
  horaIngreso?: string;
  horaCierre?: string;
};

export type OrdenTrabajoSistema = {
  tipo: "Correctiva" | "Preventiva";
  idRelacionFalla?: number; // si viene de correctiva
  idSistemaPreventiva?: number; // si viene de preventiva
  detalleFallaPrincipal?: string;
  detalleFallaSecundaria?: string;
  detalleSistemaPreventiva?: string;
  mecanicoAsignado?: string;
  idMecanicoAsignado?: number;
};

export type OrdenTrabajoInsumoNormalizado = {
  tipo: "Correctiva" | "Preventiva";
  idInsumo: number;
  codigoInsumo: string;
  descripcionInsumo: string;
  cantidad: number;
  estado: number;
  estadoManager?: number;
  idSiglas?: number;
};

export type OrdenTrabajoPersonalNormalizado = {
  idPersonal: number;
  nombrePersonal: string;
  cargoPersonal?: string;
  descripcionFalla?: string;
  estadoFalla?: boolean;
  tecnicoVidrio?: string;
  idTecnicoVidrio?: number;
};

export type OrdenTrabajoDetailsNormalizado = {
  basic: OrdenTrabajoBasic;
  sistemas: OrdenTrabajoSistema[];
  insumos: OrdenTrabajoInsumoNormalizado[];
  personal: OrdenTrabajoPersonalNormalizado[];
};

// types/OT/OrdenTrabajoFallas.ts

// Payload de entrada para crear/editar una falla
export interface UpdateFallaInput {
  idOrden: number;
  idRelacionFalla?: number | null; // si viene null => inserta, si trae valor => update
  idFallaPrincipal: number;
  idFallaSecundaria?: number | null;
  idPersonalPrincipal?: number | null;
  idPersonalSecundaria?: number | null;
  idPerfilPrincipal?: number | null;
  idPerfilSecundaria?: number | null;
}

// Respuesta del SP sp_updOrderFailuresNew
export interface UpdateFallaResponse {
  success: number; // 1 = ok, 0 = error
  action: "INSERT" | "UPDATE" | "NO_CHANGE" | "ERROR";
  affected_rows: number;
  message: string;
}

export type DeleteFallaInput = {
  item: number;
  idRelacionFalla: number;
};

export type DeleteFallaResponse = {
  success: boolean;
  message: string;
  supplies_deleted: number;
  staff_deleted: number;
  failures_deleted: number;
};

// TYPES PARA VER DETALLES DE OT PREVENTIVO SEGUN NUMERO DE BUS //

export interface MantencionPreventiva {
  codigoFlota: number;
  ppu: string;
  numeroBus: number;
  numInternoPPU: string;
  codigoTerminal: number;
  estadoRegistro: string | null;
  nombreTerminal: string;
  terminalAbreviado: string | null;
  direccionTerminal: string | null;
  codigoZona: number | null;
  codigoTaller: number | null;
  detalle_modelo_chasis: string | null;
  marcaBus: string | null;
  kilometrajeProgramado: number | null;
  fechaUltimaMantencion: string | null;
  kilometrajeProximaMantencion: number | null;
  estadoMantencion: string | null;
  kilometrajeActual: number | null;
  siglaProxMant: string | null;
  idSigla: number | null;
}

export interface SiglaPreventiva {
  id_man_prev: number;
  siglas_preventivo: string;
}
