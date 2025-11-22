import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";
export default class Cl_mConsulta extends Cl_mTablaWeb {
    constructor({ id, creadoEl, alias, nombregrupo, area, texto, estado, }) {
        super({ id, creadoEl, alias });
        this._nombregrupo = nombregrupo;
        this._area = area;
        this._texto = texto;
        this._estado = estado;
    }
    set nombregrupo(nombregrupo) {
        this._nombregrupo = nombregrupo;
    }
    get nombregrupo() {
        return this._nombregrupo;
    }
    set area(area) {
        this._area = area;
    }
    get area() {
        return this._area;
    }
    set texto(texto) {
        this._texto = texto;
    }
    get texto() {
        return this._texto;
    }
    set estado(estado) {
        this._estado = estado;
    }
    get estado() {
        return this._estado;
    }
    set expertoAsignado(expertoAsignado) {
        this._expertoAsignado = expertoAsignado;
    }
    get expertoAsignado() {
        return this._expertoAsignado || null;
    }
    error() {
        if (this._area.trim().length === 0) {
            return "El área de la consulta no puede estar vacía.";
        }
        if (this._texto.trim().length === 0) {
            return "El texto de la consulta no puede estar vacío.";
        }
        return false;
    }
    asignarAExperto(idExperto) {
        this.expertoAsignado = idExperto;
        this.estado = 'asignada';
    }
    cerrar() {
        this.estado = 'cerrada';
    }
}
