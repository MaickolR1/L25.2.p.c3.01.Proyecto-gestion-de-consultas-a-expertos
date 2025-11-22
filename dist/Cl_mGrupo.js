import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";
export default class Cl_mGrupo extends Cl_mTablaWeb {
    constructor({ id, creadoEl, alias, nombre } = {
        id: null,
        creadoEl: null,
        alias: null,
        nombre: "",
    }) {
        super({ id, creadoEl, alias });
        this._nombre = "";
        this._consultas = [];
        this.nombre = nombre;
    }
    set nombre(nombre) {
        this._nombre = nombre.trim();
    }
    get nombre() {
        return this._nombre;
    }
    // Validaciones
    get nombreOk() {
        return this.nombre.length > 2;
    }
    get grupoOk() {
        if (!this.nombreOk)
            return "El nombre del grupo/usuario es muy corto";
        return true;
    }
    get cntConsultas() {
        return this._consultas.length;
    }
    get consultas() {
        return this._consultas;
    }
    /**
     * Registra una nueva pregunta para un experto
     */
    agregarConsulta(idExperto, textoPregunta) {
        // Validar que la pregunta no esté vacía
        if (!textoPregunta || textoPregunta.length < 5)
            return false;
        const nuevaConsulta = {
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
    buscarConsulta(idConsulta) {
        return this._consultas.find(c => c.id === idConsulta);
    }
    responderConsulta(idConsulta, textoRespuesta) {
        let consulta = this.buscarConsulta(idConsulta);
        if (!consulta)
            return false;
        consulta.respuesta = textoRespuesta;
        return true;
    }
    /**
     * Elimina una consulta (opcional)
     */
    eliminarConsulta(idConsulta) {
        let index = this._consultas.findIndex(c => c.id === idConsulta);
        if (index === -1)
            return false;
        this._consultas.splice(index, 1);
        return true;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { nombre: this._nombre, consultas: this._consultas });
    }
}
