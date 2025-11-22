// En Cl_vGrupos.ts

import { iGrupo } from "./Cl_mGrupo.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_vGrupos extends Cl_vGeneral {
  private btAgregar: HTMLButtonElement;
  private btVolver: HTMLButtonElement;
  private divGrupos: HTMLDivElement;

  constructor() {
    super({ formName: "grupos" });
    
    // CAMBIO: Este botón ahora activa la vista de Registro de Consulta (grupo)
    this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
      onclick: () => this.controlador!.activarVista({ vista: "grupo" }),
    });
    
    this.btVolver = this.crearHTMLButtonElement("btVolver", {
      onclick: () => this.controlador!.activarVista({ vista: "sistema" }),
    });

    this.divGrupos = this.crearHTMLElement("divGrupos", {
      type: tHTMLElement.CONTAINER,
      refresh: () => this.mostrarGrupos(),
    }) as HTMLDivElement;
  }

  mostrarGrupos() {
    this.divGrupos.innerHTML = "";
    let grupos = this.controlador?.dtGrupos;
    
    // ... (El resto de la función mostrarGrupos permanece igual, listando los grupos)
    
    if (!grupos) return;

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
    grupos.forEach(
        (grupo: iGrupo, index: number) => {
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
        }
    );

    html += `</tbody></table>`;
    this.divGrupos.innerHTML = html;

    // Asignación de eventos dinámicos a los botones de la tabla
    grupos.forEach((grupo: iGrupo, index) => {
        this.crearHTMLButtonElement(`btEditar_${index}`, {
            onclick: () => this.editarGrupo(grupo.id!),
        });
        this.crearHTMLButtonElement(`btEliminar_${index}`, {
            onclick: () => this.deleteGrupo(grupo.id!),
        });
    });
  }

  addGrupo() {
    this.controlador?.activarVista({
      vista: "grupo", // 'grupo' es el formulario de REGISTRO DE CONSULTA
      opcion: opcionFicha.add,
    });
  }

  /**
   * Navega al formulario para editar un Grupo/Usuario existente.
   */
  editarGrupo(id: number) {
    let grupo = this.controlador?.grupo(id);
    if (grupo)
      this.controlador?.activarVista({
        vista: "grupo",
        opcion: opcionFicha.edit,
        objeto: grupo,
      });
  }
  deleteGrupo(id: number) {
    if (confirm(`¿Está seguro de eliminar este Grupo/Usuario (ID: ${id})?`))
      this.controlador?.deleteGrupo({
        id,
        callback: (error) => {
          if (!error) this.controlador!.activarVista({ vista: "grupos" });
          else alert(`Error al eliminar: ${error}`);
        },
      });
  }
}