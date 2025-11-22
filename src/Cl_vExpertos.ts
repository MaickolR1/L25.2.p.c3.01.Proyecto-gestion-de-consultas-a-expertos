import { iExperto } from "./Cl_mExperto.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_vExpertos extends Cl_vGeneral {
  private btAgregar: HTMLButtonElement;
  private btVolver: HTMLButtonElement; // Para volver al menú principal
  private divExpertos: HTMLDivElement;

  constructor() {
    super({ formName: "expertos" });
    
    this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
      onclick: () => this.addExperto(),
    });
    
    this.btVolver = this.crearHTMLButtonElement("btVolver", {
      onclick: () => this.controlador!.activarVista({ vista: "sistema" }),
    });

    this.divExpertos = this.crearHTMLElement("divExpertos", {
      type: tHTMLElement.CONTAINER,
      refresh: () => this.mostrarExpertos(),
    }) as HTMLDivElement;
  }

 mostrarExpertos() {
    this.divExpertos.innerHTML = "";
    let expertos = this.controlador?.dtExpertos;

    if (!expertos || expertos.length === 0) {
        this.divExpertos.innerHTML = "<p>No hay expertos registrados.</p>";
        return;
    }

    // 1. Iniciar la estructura de la tabla con el encabezado (<thead>)
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Área</th>
                    <th>Cargo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // 2. Llenar el cuerpo de la tabla (<tbody>)
    expertos.forEach(
        (experto: iExperto, index: number) => {
            html += `
                <tr>
                    <td>${experto.nombre}</td>
                    <td>${experto.area}</td>
                    <td>${experto.cargo}</td>
                    <td>
                        <button id="expertos_btEditar_${index}">Editar</button>
                        <button id="expertos_btEliminar_${index}">X</button>
                    </td>
                </tr>
            `;
        }
    );

    // 3. Cerrar la tabla y asignar todo al DIV
    html += `</tbody></table>`;
    this.divExpertos.innerHTML = html;

    // 4. Asignar eventos (ESTO DEBE IR DESPUÉS de asignar el HTML)
    expertos.forEach((experto: iExperto, index) => {
        this.crearHTMLButtonElement(`btEditar_${index}`, {
            onclick: () => this.editarExperto(experto.id!),
        });
        this.crearHTMLButtonElement(`btEliminar_${index}`, {
            onclick: () => this.deleteExperto(experto.id!),
        });
    });
}

  addExperto() {
    this.controlador?.activarVista({
      vista: "experto",
      opcion: opcionFicha.add,
    });
  }

  editarExperto(id: number) {
    let experto = this.controlador?.experto(id);
    if (experto)
      this.controlador?.activarVista({
        vista: "experto",
        opcion: opcionFicha.edit,
        objeto: experto,
      });
  }

  deleteExperto(id: number) {
    if (confirm(`¿Está seguro de eliminar este experto?`))
      this.controlador?.deleteExperto({
        id,
        callback: (error) => {
          if (error)
            alert(`No se pudo eliminar.\n${error}`);
          else this.mostrarExpertos();
        },
      });
  }

  show({ ver }: { ver: boolean }): void {
    super.show({ ver });
    if (ver) this.mostrarExpertos();
  }
}