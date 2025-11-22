import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vGrupos extends Cl_vGeneral {
    constructor() {
        super({ formName: "grupos" }); // Asegúrate de tener <div id="grupos"> en tu HTML
        this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
            onclick: () => this.addGrupo(),
        });
        this.btVolver = this.crearHTMLButtonElement("btVolver", {
            // Vuelve al menú principal del sistema
            onclick: () => this.controlador.activarVista({ vista: "sistema" }),
        });
        this.divGrupos = this.crearHTMLElement("divGrupos", {
            type: tHTMLElement.CONTAINER,
            refresh: () => this.mostrarGrupos(),
        });
    }
    mostrarGrupos() {
        var _a;
        this.divGrupos.innerHTML = "";
        let grupos = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtGrupos;
        if (!grupos)
            return;
        // Cabecera de la tabla
        this.divGrupos.innerHTML += `
        <thead>
            <tr>
                <th>Nombre Grupo/Usuario</th>
                <th>Consultas Realizadas</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>`;
        grupos.forEach((grupo, index) => {
            const cantConsultas = grupo.consultas ? grupo.consultas.length : 0;
            this.divGrupos.innerHTML += `
            <tr>
                <td>${grupo.nombre}</td>
                <td style="text-align:center">${cantConsultas}</td>
                <td>
                    <button id="grupos_btEditar_${index}">Editar</button>
                    <button id="grupos_btEliminar_${index}">X</button>
                </td>
            </tr>`;
        });
        this.divGrupos.innerHTML += `</tbody>`;
        // Asignación de eventos dinámicos a los botones de la tabla
        grupos.forEach((grupo, index) => {
            this.crearHTMLButtonElement(`btEditar_${index}`, {
                onclick: () => this.editarGrupo(grupo.id),
            });
            this.crearHTMLButtonElement(`btEliminar_${index}`, {
                onclick: () => this.deleteGrupo(grupo.id),
            });
        });
    }
    addGrupo() {
        var _a;
        (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.activarVista({
            vista: "grupo",
            opcion: opcionFicha.add,
        });
    }
    editarGrupo(id) {
        var _a, _b;
        let grupo = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.grupo(id);
        if (grupo)
            (_b = this.controlador) === null || _b === void 0 ? void 0 : _b.activarVista({
                vista: "grupo",
                opcion: opcionFicha.edit,
                objeto: grupo,
            });
    }
    deleteGrupo(id) {
        var _a;
        if (confirm(`¿Está seguro de eliminar este grupo?`))
            (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.deleteGrupo({
                id, // Ojo: en Cl_controlador definimos deleteGrupo({id, callback})
                callback: (error) => {
                    if (error)
                        alert(`No se pudo eliminar.\n${error}`);
                    else
                        this.mostrarGrupos();
                },
            });
    }
    show({ ver }) {
        super.show({ ver });
        if (ver)
            this.mostrarGrupos();
    }
}
