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

  // --- NAVEGACIÓN ---
  activarVista(opcion: { vista: string; opcion?: opcionFicha; objeto?: Cl_mExperto | Cl_mGrupo; }): void {
    this.vista.activarVista(opcion);
  }

  // --- EXPERTOS ---
  addExperto({ dtExperto, callback }: { dtExperto: iExperto; callback: (error: string | false) => void; }): void {
    this.modelo.addExperto({ dtExperto, callback });
  }
  editExperto({ dtExperto, callback }: { dtExperto: iExperto; callback: (error: string | boolean) => void; }): void {
    this.modelo.editExperto({ dtExperto, callback });
  }
  deleteExperto({ id, callback }: { id: number; callback: (error: string | boolean) => void; }): void {
    this.modelo.deleteExperto({ id, callback });
  }
  experto(id: number): Cl_mExperto | null {
    let exp = this.modelo.experto(id);
    return exp ? new Cl_mExperto(exp.toJSON()) : null;
  }
  get dtExpertos(): iExperto[] {
    return this.modelo.dtExpertos();
  }

  // --- GRUPOS (Solo lectura/listado para el admin) ---
  get dtGrupos(): iGrupo[] {
    return this.modelo.dtGrupos();
  }
  grupo(id: number): Cl_mGrupo | null {
    let grp = this.modelo.grupo(id);
    return grp ? new Cl_mGrupo(grp.toJSON()) : null;
  }
  // (Opcional) Métodos deleteGrupo/editGrupo si quieres borrar spam, pero no registrar.
  deleteGrupo({ id, callback }: { id: number; callback: (error: string | boolean) => void; }): void {
      this.modelo.deleteGrupo({ id, callback });
  }
  editGrupo({ dtGrupo, callback }: { dtGrupo: iGrupo; callback: (error: string | boolean) => void; }): void {
      this.modelo.editGrupo({ dtGrupo, callback });
  }


  // --- LÓGICA PRINCIPAL DE CONSULTAS ---
  registrarConsulta({
    idExperto,
    pregunta,
    callback,
  }: {
    idExperto: number;
    pregunta: string;
    callback: (error: string | false) => void;
  }): void {

    // 1. Buscamos si ya existe un "Buzón" (Grupo) para guardar las preguntas
    let grupos = this.modelo.dtGrupos();
    let grupoContenedor;

    if (grupos.length === 0) {
        // AUTOMÁTICO: Si no hay grupos, creamos uno invisible al usuario
        let nuevoGrupo = {
            id: Date.now(),
            creadoEl: new Date().toISOString(),
            alias: null,
            nombre: "Buzón de Consultas", // Nombre fijo automático
            consultas: []
        };
        
        // Lo guardamos en BD sin pedirle nada al usuario
        this.modelo.addGrupo({ 
            dtGrupo: nuevoGrupo, 
            callback: (err) => {
                 if (err) callback(err); 
            }
        });
        grupoContenedor = this.modelo.grupo(nuevoGrupo.id!);
    } else {
        // Si ya existe, usamos el primero que haya
        grupoContenedor = this.modelo.grupo(grupos[0].id!);
    }

    if (!grupoContenedor) {
        callback("Error interno: No se pudo asignar lugar para la consulta.");
        return;
    }

    // 2. Guardamos la pregunta en ese grupo automático
    if (grupoContenedor.agregarConsulta(idExperto, pregunta)) {
        this.modelo.editGrupo({
            dtGrupo: grupoContenedor.toJSON(),
            callback: (error) => {
                if (!error && this.vista) this.vista.refresh();
                callback(error as string | false);
            }
        });
    } else {
        callback("Error: Pregunta inválida.");
    }
  }

  responderPregunta({ idGrupo, idConsulta, respuesta, callback }: any): void {
    // (Misma lógica de respuesta que tenías)
    let grupo = this.modelo.grupo(idGrupo);
    if (grupo && grupo.responderConsulta(idConsulta, respuesta)) {
        this.modelo.editGrupo({
            dtGrupo: grupo.toJSON(),
            callback: (error) => callback(error)
        });
    } else {
        callback("Error al responder.");
    }
  }
}