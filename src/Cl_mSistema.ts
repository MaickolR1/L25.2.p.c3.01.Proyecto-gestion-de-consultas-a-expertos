import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mExperto, { iExperto } from "./Cl_mExperto.js";
import Cl_mGrupo, { iGrupo } from "./Cl_mGrupo.js"; // Importamos el nuevo modelo

// Interfaces para las respuestas de la API
interface iResultExpertos {
  objects: [iExperto] | null;
  error: string | false;
}
interface iResultGrupos {
  objects: [iGrupo] | null;
  error: string | false;
}

export default class Cl_mSistema {
  private db: Cl_dcytDb;
  
  // Listas locales en memoria
  private expertos: Cl_mExperto[];
  private grupos: Cl_mGrupo[]; 

  // Nombres de las tablas en la "Base de Datos"
  readonly tbExperto: string = "tb_expertos_proy"; 
  readonly tbGrupo: string = "tb_grupos_proy";   

  constructor() {
    this.db = new Cl_dcytDb({ aliasCuenta: "CodeBreakers" }); // Pon tu alias aquí si tienes uno
    this.expertos = [];
    this.grupos = [];
  }

  // ==========================================
  //            GESTIÓN DE EXPERTOS
  // ==========================================

  addExperto({
    dtExperto,
    callback,
  }: {
    dtExperto: iExperto;
    callback: (error: string | false) => void;
  }): void {
    let experto = new Cl_mExperto(dtExperto);
    
    if (this.expertos.find((e) => e.nombre === dtExperto.nombre))
      callback(`El experto ${dtExperto.nombre} ya existe.`);
    else if (!experto.expertoOk) callback(experto.expertoOk as string);
    else
      this.db.addRecord({
        tabla: this.tbExperto,
        registroAlias: dtExperto.nombre,
        object: experto,
        callback: ({ objects: expertos, error }) => {
          if (!error) this.llenarExpertos(expertos);
          callback?.(error);
        },
      });
  }

  editExperto({
    dtExperto,
    callback,
  }: {
    dtExperto: iExperto;
    callback: (error: string | boolean) => void;
  }): void {
    let experto = new Cl_mExperto(dtExperto);
    if (!experto.expertoOk) callback(experto.expertoOk as string);
    else
      this.db.editRecord({
        tabla: this.tbExperto,
        object: experto,
        callback: ({ objects: expertos, error }) => {
          if (!error) this.llenarExpertos(expertos);
          callback?.(error);
        },
      });
  }

  deleteExperto({
    id,
    callback,
  }: {
    id: number;
    callback: (error: string | boolean) => void;
  }): void {
    let indice = this.expertos.findIndex((e) => e.id === id);
    if (indice === -1) callback("El experto no existe.");
    else {
        this.db.deleteRecord({
          tabla: this.tbExperto,
          object: this.expertos[indice],
          callback: ({ objects: expertos, error }) => {
            if (!error) this.llenarExpertos(expertos);
            callback?.(error);
          },
        });
    }
  }

  addGrupo({
    dtGrupo,
    callback,
  }: {
    dtGrupo: iGrupo;
    callback: (error: string | false) => void;
  }): void {
    let grupo = new Cl_mGrupo(dtGrupo);
    
    // Validar duplicados (opcional, por nombre)
    if (this.grupos.find((g) => g.nombre === dtGrupo.nombre))
      callback(`El grupo/usuario ${dtGrupo.nombre} ya existe.`);
    else if (!grupo.grupoOk) callback(grupo.grupoOk as string);
    else
      this.db.addRecord({
        tabla: this.tbGrupo,
        registroAlias: dtGrupo.nombre,
        object: grupo,
        callback: ({ objects: grupos, error }) => {
          if (!error) this.llenarGrupos(grupos);
          callback?.(error);
        },
      });
  }

  /**
   * IMPORTANTE: Este método se usa tanto para editar el nombre del grupo
   * COMO para guardar nuevas preguntas o respuestas. 
   * (Porque las preguntas viven dentro del objeto Grupo)
   */
  editGrupo({
    dtGrupo,
    callback,
  }: {
    dtGrupo: iGrupo;
    callback: (error: string | boolean) => void;
  }): void {
    let grupo = new Cl_mGrupo(dtGrupo);
    if (!grupo.grupoOk) callback(grupo.grupoOk as string);
    else
      this.db.editRecord({
        tabla: this.tbGrupo,
        object: grupo,
        callback: ({ objects: grupos, error }) => {
          if (!error) this.llenarGrupos(grupos);
          callback?.(error);
        },
      });
  }

  deleteGrupo({
    id,
    callback,
  }: {
    id: number;
    callback: (error: string | boolean) => void;
  }): void {
    let indice = this.grupos.findIndex((g) => g.id === id);
    if (indice === -1) callback("El grupo no existe.");
    else {
        this.db.deleteRecord({
          tabla: this.tbGrupo,
          object: this.grupos[indice],
          callback: ({ objects: grupos, error }) => {
            if (!error) this.llenarGrupos(grupos);
            callback?.(error);
          },
        });
    }
  }
  // Métodos getters para Data Transfer (JSON)
  dtExpertos(): iExperto[] {
    return this.expertos.map((e) => e.toJSON());
  }

  dtGrupos(): iGrupo[] { // Nuevo
    return this.grupos.map((g) => g.toJSON());
  }

  // Búsqueda de objetos
  experto(id: number): Cl_mExperto | null {
    return this.expertos.find((e) => e.id === id) || null;
  }

  grupo(id: number): Cl_mGrupo | null { // Nuevo
    return this.grupos.find((g) => g.id === id) || null;
  }

  /**
   * Carga inicial de datos. 
   * Usa el patrón "Callback Hell" controlado: Carga A -> Si ok, Carga B -> Fin
   */
  cargar(callback: (error: string | false) => void): void {
    // 1. Cargar Expertos
    this.db.listRecords({
      tabla: this.tbExperto,
      callback: ({ objects: objExpertos, error: errExpertos }: iResultExpertos) => {
        if (errExpertos) callback(`Error cargando expertos: ${errExpertos}`);
        else {
            // 2. Si expertos cargó bien, Cargar Grupos
            this.db.listRecords({
                tabla: this.tbGrupo,
                callback: ({ objects: objGrupos, error: errGrupos }: iResultGrupos) => {
                    if (errGrupos) callback(`Error cargando grupos: ${errGrupos}`);
                    else {
                        // Todo cargó bien, llenamos los arrays locales
                        this.llenarExpertos(objExpertos ?? []);
                        this.llenarGrupos(objGrupos ?? []);
                        callback(false);
                    }
                }
            });
        }
      },
    });
  }

  // Helpers para llenar arrays
  private llenarExpertos(expertos: iExperto[]): void {
    this.expertos = [];
    expertos.forEach((e) => this.expertos.push(new Cl_mExperto(e)));
  }

  private llenarGrupos(grupos: iGrupo[]): void {
    this.grupos = [];
    grupos.forEach((g) => this.grupos.push(new Cl_mGrupo(g)));
  }
}