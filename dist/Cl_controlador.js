import Cl_mExperto from "./Cl_mExperto.js";
import Cl_mGrupo from "./Cl_mGrupo.js";
export default class Cl_controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
    }
    addExperto({ dtExperto, callback, }) {
        this.modelo.addExperto({ dtExperto, callback });
    }
    editExperto({ dtExperto, callback, }) {
        this.modelo.editExperto({ dtExperto, callback });
    }
    deleteExperto({ id, callback, }) {
        this.modelo.deleteExperto({ id, callback });
    }
    experto(id) {
        let exp = this.modelo.experto(id);
        return exp ? new Cl_mExperto(exp.toJSON()) : null;
    }
    get dtExpertos() {
        return this.modelo.dtExpertos().sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    addGrupo({ dtGrupo, callback, }) {
        this.modelo.addGrupo({ dtGrupo, callback });
    }
    editGrupo({ dtGrupo, callback, }) {
        this.modelo.editGrupo({ dtGrupo, callback });
    }
    deleteGrupo({ id, callback, }) {
        this.modelo.deleteGrupo({ id, callback });
    }
    grupo(id) {
        let grp = this.modelo.grupo(id);
        return grp ? new Cl_mGrupo(grp.toJSON()) : null;
    }
    get dtGrupos() {
        return this.modelo.dtGrupos().sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    hacerPregunta({ idGrupo, idExperto, pregunta, callback, }) {
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
        }
        else {
            callback("Error al registrar la pregunta.");
        }
    }
    /**
     * Registra la respuesta de un Experto a una consulta específica
     */
    responderPregunta({ idGrupo, idConsulta, respuesta, callback, }) {
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
        }
        else {
            callback("Error al guardar la respuesta.");
        }
    }
    activarVista({ vista, opcion, objeto, }) {
        this.vista.activarVista({ vista, opcion, objeto });
    }
}
