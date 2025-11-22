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
    
    if (!expertos) return;

    // Cabecera simple
    this.divExpertos.innerHTML += `
        <tr>
            <th>Nombre</th>
            <th>Área</th>
            <th>Cargo</th>
            <th>Acciones</th>
        </tr>`;

    expertos.forEach(
      (experto: iExperto, index: number) =>
        (this.divExpertos.innerHTML += `<tr>
            <td>${experto.nombre}</td>
            <td>${experto.area}</td>
            <td>${experto.cargo}</td>
            <td>
                <button id="expertos_btEditar_${index}">Editar</button>
                <button id="expertos_btEliminar_${index}">X</button>
            </td>
        </tr>`)
    );

    // Asignar eventos
    expertos.forEach((experto: iExperto, index) => {
      this.crearHTMLButtonElement(`btEditar_${index}`, {
        onclick: () => this.editarExperto(experto.id!), // Usamos ID o Nombre como key
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