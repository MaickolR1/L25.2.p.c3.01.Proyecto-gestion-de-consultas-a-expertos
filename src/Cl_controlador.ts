import Cl_mSistema from "./Cl_mSistema.js";
import Cl_vSistema from "./Cl_vSistema.js";
import Cl_mExperto, { iExperto } from "./Cl_mExperto.js";
import Cl_mGrupo, { iGrupo } from "./Cl_mGrupo.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_controlador {
  public modelo: Cl_mSistema;
  public vista: Cl_vSistema;

  constructor(modelo: Cl_mSistema, vista: Cl_vSistema) {
    this.modelo = modelo;
    this.vista = vista;
  }

  addExperto({
    dtExperto,
    callback,
  }: {
    dtExperto: iExperto;
    callback: (error: string | false) => void;
  }): void {
    this.modelo.addExperto({ dtExperto, callback });
  }

  editExperto({
    dtExperto,
    callback,
  }: {
    dtExperto: iExperto;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.editExperto({ dtExperto, callback });
  }

  deleteExperto({
    id,
    callback,
  }: {
    id: number;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.deleteExperto({ id, callback });
  }

  experto(id: number): Cl_mExperto | null {
    let exp = this.modelo.experto(id);
    return exp ? new Cl_mExperto(exp.toJSON()) : null;
  }

  get dtExpertos(): iExperto[] {
    return this.modelo.dtExpertos().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  addGrupo({
    dtGrupo,
    callback,
  }: {
    dtGrupo: iGrupo;
    callback: (error: string | false) => void;
  }): void {
    this.modelo.addGrupo({ dtGrupo, callback });
  }

  editGrupo({
    dtGrupo,
    callback,
  }: {
    dtGrupo: iGrupo;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.editGrupo({ dtGrupo, callback });
  }

  deleteGrupo({
    id,
    callback,
  }: {
    id: number;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.deleteGrupo({ id, callback });
  }

  grupo(id: number): Cl_mGrupo | null {
    let grp = this.modelo.grupo(id);
    return grp ? new Cl_mGrupo(grp.toJSON()) : null;
  }

  get dtGrupos(): iGrupo[] {
    return this.modelo.dtGrupos().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  hacerPregunta({
    idGrupo,
    idExperto,
    pregunta,
    callback,
  }: {
    idGrupo: number;
    idExperto: number;
    pregunta: string;
    callback: (error: string | boolean) => void;
  }): void {
    let grupo = this.modelo.grupo(idGrupo);
    
    if (!grupo) {
        callback("El grupo no existe.");
        return;
    }

    // Agregamos la consulta al objeto Grupo en memoria
    if (grupo.agregarConsulta(idExperto, pregunta)) {
        // Persistimos el cambio guardando el grupo completo
        this.modelo.editGrupo({
            dtGrupo: grupo.toJSON(),
            callback: (error) => callback(error)
        });
    } else {
        callback("Error al registrar la pregunta.");
    }
  }

  /**
   * Registra la respuesta de un Experto a una consulta específica
   */
  responderPregunta({
    idGrupo,
    idConsulta,
    respuesta,
    callback,
  }: {
    idGrupo: number;
    idConsulta: number;
    respuesta: string;
    callback: (error: string | boolean) => void;
  }): void {
    let grupo = this.modelo.grupo(idGrupo);

    if (!grupo) {
        callback("No se encontró el grupo origen de la consulta.");
        return;
    }

    // Registramos la respuesta en memoria
    if (grupo.responderConsulta(idConsulta, respuesta)) {
        // Persistimos el cambio
        this.modelo.editGrupo({
            dtGrupo: grupo.toJSON(),
            callback: (error) => callback(error)
        });
    } else {
        callback("Error al guardar la respuesta.");
    }
  }

  activarVista({
    vista,
    opcion,
    objeto,
  }: {
    vista: string;
    opcion?: opcionFicha;
    objeto?: Cl_mExperto | Cl_mGrupo;
  }): void {
    this.vista.activarVista({ vista, opcion, objeto });
  }
}