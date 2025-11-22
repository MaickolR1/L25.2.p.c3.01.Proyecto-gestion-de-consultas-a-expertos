import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vExpertos extends Cl_vGeneral {
    constructor() {
        super({ formName: "expertos" });
        this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
            onclick: () => this.addExperto(),
        });
        this.btVolver = this.crearHTMLButtonElement("btVolver", {
            onclick: () => this.controlador.activarVista({ vista: "sistema" }),
        });
        this.divExpertos = this.crearHTMLElement("divExpertos", {
            type: tHTMLElement.CONTAINER,
            refresh: () => this.mostrarExpertos(),
        });
    }
    mostrarExpertos() {
        var _a;
        this.divExpertos.innerHTML = "";
        let expertos = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtExpertos;
        if (!expertos)
            return;
        // Cabecera simple
        this.divExpertos.innerHTML += `
        <tr>
            <th>Nombre</th>
            <th>Área</th>
            <th>Cargo</th>
            <th>Acciones</th>
        </tr>`;
        expertos.forEach((experto, index) => (this.divExpertos.innerHTML += `<tr>
            <td>${experto.nombre}</td>
            <td>${experto.area}</td>
            <td>${experto.cargo}</td>
            <td>
                <button id="expertos_btEditar_${index}">Editar</button>
                <button id="expertos_btEliminar_${index}">X</button>
            </td>
        </tr>`));
        // Asignar eventos
        expertos.forEach((experto, index) => {
            this.crearHTMLButtonElement(`btEditar_${index}`, {
                onclick: () => this.editarExperto(experto.id), // Usamos ID o Nombre como key
            });
            this.crearHTMLButtonElement(`btEliminar_${index}`, {
                onclick: () => this.deleteExperto(experto.id),
            });
        });
    }
    addExperto() {
        var _a;
        (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.activarVista({
            vista: "experto",
            opcion: opcionFicha.add,
        });
    }
    editarExperto(id) {
        var _a, _b;
        let experto = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.experto(id);
        if (experto)
            (_b = this.controlador) === null || _b === void 0 ? void 0 : _b.activarVista({
                vista: "experto",
                opcion: opcionFicha.edit,
                objeto: experto,
            });
    }
    deleteExperto(id) {
        var _a;
        if (confirm(`¿Está seguro de eliminar este experto?`))
            (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.deleteExperto({
                id,
                callback: (error) => {
                    if (error)
                        alert(`No se pudo eliminar.\n${error}`);
                    else
                        this.mostrarExpertos();
                },
            });
    }
    show({ ver }) {
        super.show({ ver });
        if (ver)
            this.mostrarExpertos();
    }
}
