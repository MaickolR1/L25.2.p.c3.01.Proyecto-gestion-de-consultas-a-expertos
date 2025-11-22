// En Cl_vGrupos.ts
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vGrupos extends Cl_vGeneral {
    constructor() {
        super({ formName: "grupos" });
        // CAMBIO: Este botón ahora activa la vista de Registro de Consulta (grupo)
        this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
            onclick: () => this.controlador.activarVista({ vista: "grupo" }),
        });
        this.btVolver = this.crearHTMLButtonElement("btVolver", {
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
        // ... (El resto de la función mostrarGrupos permanece igual, listando los grupos)
        if (!grupos)
            return;
        // Cabecera de la tabla
        let html = `
        <table>
            <thead>
                <tr>
                    <th>Nombre Grupo/Usuario</th>
                    <th># Consultas</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
        // Llenar el cuerpo de la tabla
        grupos.forEach((grupo, index) => {
            const cantConsultas = grupo.consultas ? grupo.consultas.length : 0;
            html += `
                <tr>
                    <td>${grupo.nombre}</td>
                    <td style="text-align:center">${cantConsultas}</td>
                    <td>
                        <button id="grupos_btEditar_${index}">Editar</button>
                        <button id="grupos_btEliminar_${index}">X</button>
                    </td>
                </tr>
            `;
        });
        html += `</tbody></table>`;
        this.divGrupos.innerHTML = html;
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
            vista: "grupo", // 'grupo' es el formulario de REGISTRO DE CONSULTA
            opcion: opcionFicha.add,
        });
    }
    /**
     * Navega al formulario para editar un Grupo/Usuario existente.
     */
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
        if (confirm(`¿Está seguro de eliminar este Grupo/Usuario (ID: ${id})?`))
            (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.deleteGrupo({
                id,
                callback: (error) => {
                    if (!error)
                        this.controlador.activarVista({ vista: "grupos" });
                    else
                        alert(`Error al eliminar: ${error}`);
                },
            });
    }
}
