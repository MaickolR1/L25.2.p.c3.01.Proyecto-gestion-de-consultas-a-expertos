import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";
export default class Cl_mExperto extends Cl_mTablaWeb {
    constructor({ id, creadoEl, alias, nombre, area, cargo } = {
        id: null,
        creadoEl: null,
        alias: null,
        nombre: "",
        area: "",
        cargo: "",
    }) {
        super({ id, creadoEl, alias });
        this._nombre = "";
        this._area = "";
        this._cargo = "";
        this.nombre = nombre;
        this.area = area;
        this.cargo = cargo;
    }
    set nombre(nombre) {
        this._nombre = nombre.trim().toUpperCase();
    }
    get nombre() {
        return this._nombre;
    }
    set area(area) {
        this._area = area;
    }
    get area() {
        return this._area;
    }
    set cargo(cargo) {
        this._cargo = cargo.trim();
    }
    get cargo() {
        return this._cargo;
    }
    // Validaciones
    get nombreOk() {
        return this.nombre.length > 3;
    }
    get areaOk() {
        return this.area !== ""; // Asumiendo que debe seleccionar una
    }
    get expertoOk() {
        if (!this.nombreOk)
            return "El nombre es muy corto";
        if (!this.areaOk)
            return "Debe seleccionar un área";
        return true;
    }
    get cargoOk() {
        if (this.cargo.length < 3)
            return "El cargo es muy corto";
        return true;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { nombre: this._nombre, area: this._area, cargo: this._cargo });
    }
}
