import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";

// Interfaz para la consulta individual (sub-registro)
export interface iConsulta {
  id: number; // Identificador único de la pregunta
  idExperto: number; // A quién se le preguntó
  pregunta: string;
  respuesta: string | null; // Null si aún no responden
}

// Interfaz para el Grupo (Usuario)
export interface iGrupo {
  id: number| null;
  creadoEl: string | null;
  alias: string | null;
  nombre: string;
  consultas?: iConsulta[]; // Array de preguntas hechas por este grupo
}

export default class Cl_mGrupo extends Cl_mTablaWeb {
  private _nombre: string = "";
  private _consultas: iConsulta[] = [];

  constructor({ id, creadoEl, alias, nombre }: iGrupo = {
    id: null,
    creadoEl: null,
    alias: null,
    nombre: "",
  }) {
    super({ id, creadoEl, alias });
    this.nombre = nombre;
  }

  set nombre(nombre: string) {
    this._nombre = nombre.trim();
  }
  get nombre(): string {
    return this._nombre;
  }

  // Validaciones
  get nombreOk(): boolean {
    return this.nombre.length > 2;
  }
  
  get grupoOk(): string | true {
    if (!this.nombreOk) return "El nombre del grupo/usuario es muy corto";
    return true;
  }

  get cntConsultas(): number {
    return this._consultas.length;
  }

  get consultas(): iConsulta[] {
    return this._consultas;
  }

  /**
   * Registra una nueva pregunta para un experto
   */
  agregarConsulta(idExperto: number, textoPregunta: string): boolean {
    // Validar que la pregunta no esté vacía
    if (!textoPregunta || textoPregunta.length < 5) return false;

    const nuevaConsulta: iConsulta = {
      id: Date.now(), // Generamos un ID simple basado en tiempo
      idExperto: idExperto,
      pregunta: textoPregunta,
      respuesta: null // Nace sin respuesta
    };

    this._consultas.push(nuevaConsulta);
    return true;
  }

  /**
   * Permite buscar una consulta específica dentro de este grupo
   */
  buscarConsulta(idConsulta: number): iConsulta | undefined {
    return this._consultas.find(c => c.id === idConsulta);
  }

  responderConsulta(idConsulta: number, textoRespuesta: string): boolean {
    let consulta = this.buscarConsulta(idConsulta);
    if (!consulta) return false;

    consulta.respuesta = textoRespuesta;
    return true;
  }

  /**
   * Elimina una consulta (opcional)
   */
  eliminarConsulta(idConsulta: number): boolean {
    let index = this._consultas.findIndex(c => c.id === idConsulta);
    if (index === -1) return false;
    
    this._consultas.splice(index, 1);
    return true;
  }

  toJSON(): iGrupo {
    return {
      ...super.toJSON(),
      nombre: this._nombre,
      consultas: this._consultas,
    };
  }
}