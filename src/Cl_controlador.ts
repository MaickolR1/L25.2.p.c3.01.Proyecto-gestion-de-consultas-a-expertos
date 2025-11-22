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

  // =========================================
  //           SISTEMA / VISTAS
  // =========================================

  /**
   * Llama a la vista principal para cambiar la pantalla activa.
   */
  activarVista(opcion: {
    vista: string;
    opcion?: opcionFicha;
    objeto?: Cl_mExperto | Cl_mGrupo;
  }): void {
    this.vista.activarVista(opcion);
  }

  // =========================================
  //           GESTIÓN DE EXPERTOS (CRUD)
  // =========================================

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
    // Aquí podrías agregar una validación si el experto tiene consultas asignadas
    this.modelo.deleteExperto({ id, callback });
  }

  experto(id: number): Cl_mExperto | null {
    let experto = this.modelo.experto(id);
    // Devuelve una copia del objeto
    if (experto) return new Cl_mExperto(experto.toJSON());
    else return null;
  }

  get dtExpertos(): iExperto[] {
    return this.modelo.dtExpertos();
  }

  // =========================================
  //           GESTIÓN DE GRUPOS/USUARIOS (CRUD)
  // =========================================
  
  // NOTA: Estos métodos CRUD de Grupos son para administrar los "Usuarios" o "Grupos"
  // que registran las consultas, no para administrar las consultas en sí.

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
    // Aquí podrías validar si el grupo tiene consultas
    this.modelo.deleteGrupo({ id, callback });
  }

  grupo(id: number): Cl_mGrupo | null {
    let grupo = this.modelo.grupo(id);
    if (grupo) return new Cl_mGrupo(grupo.toJSON());
    else return null;
  }

  get dtGrupos(): iGrupo[] {
    return this.modelo.dtGrupos();
  }


  // =========================================
  //           LÓGICA DE CONSULTAS (NUEVA FUNCIÓN)
  // =========================================

  /**
   * Registra una consulta asociándola a un experto y la guarda en el primer grupo/usuario disponible.
   */
  registrarConsulta({
    idExperto,
    pregunta,
    callback,
  }: {
    idExperto: number;
    pregunta: string;
    callback: (error: string | false) => void;
  }): void {

    const grupos = this.modelo.dtGrupos();
    if (grupos.length === 0) {
        callback("Error: No existen Grupos/Usuarios para registrar la consulta. Cree uno primero (en la vista de 'Consultas Pendientes').");
        return;
    }

    // 1. Usamos el ID del primer grupo encontrado como origen de la consulta (Usuario que pregunta)
    const GRUPO_ID_ORIGEN = grupos[0].id!; 
    let grupoOrigen = this.modelo.grupo(GRUPO_ID_ORIGEN);

    if (!grupoOrigen) {
        callback("Error interno: Grupo origen no encontrado.");
        return;
    }

    // 2. Agregamos la consulta al objeto Grupo en memoria
    if (grupoOrigen.agregarConsulta(idExperto, pregunta)) {
        
        // 3. Persistimos el cambio guardando el grupo completo
        this.modelo.editGrupo({
            dtGrupo: grupoOrigen.toJSON(),
            callback: (error) => {
                if (!error) this.vista.refresh(); // Refrescamos la vista del sistema tras guardar
                callback(error as string | false);
            }
        });
    } else {
        // Esto captura errores de validación de la pregunta (e.g., muy corta) en Cl_mGrupo.ts
        callback("Error al registrar la pregunta. Asegúrese de que el texto no esté vacío y sea suficientemente largo (mínimo 5 caracteres).");
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

    // Registramos la respuesta en memoria (Cl_mGrupo.ts debe tener responderConsulta)
    if (grupo.responderConsulta(idConsulta, respuesta)) {
        // Persistimos el cambio
        this.modelo.editGrupo({
            dtGrupo: grupo.toJSON(),
            callback: (error) => {
                if (!error) this.vista.refresh();
                callback(error);
            }
        });
    } else {
        callback("Error al guardar la respuesta. La consulta podría no existir o la respuesta está vacía.");
    }
  }
}