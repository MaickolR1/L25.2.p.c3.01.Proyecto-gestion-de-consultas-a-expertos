import Cl_mExperto from "./Cl_mExperto.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vExperto extends Cl_vGeneral {
    constructor() {
        super({ formName: "experto" });
        this.opcion = null;
        this.experto = new Cl_mExperto();
        this.lblOpcion = this.crearHTMLLabelElement("lblOpcion", {
            refresh: () => (this.lblOpcion.innerHTML =
                this.opcion === opcionFicha.add ? "Registrar Experto" : "Editar Experto"),
        });
        // Input Nombre
        this.inNombre = this.crearHTMLInputElement("inNombre", {
            oninput: () => {
                this.inNombre.value = this.experto.nombre = this.inNombre.value.toUpperCase();
                this.refresh();
            },
            refresh: () => (this.inNombre.style.borderColor = this.experto.nombreOk ? "" : "red"),
        });
        // Input Area (Select)
        // Nota: Asumo que tienes un método genérico o usas cast a HTMLSelectElement
        this.inArea = document.getElementById("experto_inArea");
        // Si tu framework crea selects dinámicos, ajusta aquí. Simularé asignación de evento:
        if (this.inArea) {
            this.inArea.onchange = () => {
                this.experto.area = this.inArea.value;
                this.refresh();
            };
        }
        // Input Cargo
        this.inCargo = this.crearHTMLInputElement("inCargo", {
            oninput: () => {
                this.experto.cargo = this.inCargo.value;
            },
        });
        this.btAceptar = this.crearHTMLButtonElement("btAceptar", {
            onclick: () => this.aceptar(),
            refresh: () => {
                this.btAceptar.disabled = this.experto.expertoOk !== true;
            },
        });
        this.btCancelar = this.crearHTMLButtonElement("btCancelar", {
            onclick: () => this.controlador.activarVista({ vista: "expertos" }),
        });
    }
    aceptar() {
        if (this.opcion === opcionFicha.add)
            this.controlador.addExperto({
                dtExperto: this.experto.toJSON(),
                callback: (error) => {
                    if (!error)
                        this.controlador.activarVista({ vista: "expertos" });
                    else
                        alert(`Error: ${error}`);
                },
            });
        else {
            this.controlador.editExperto({
                dtExperto: this.experto.toJSON(),
                callback: (error) => {
                    if (!error)
                        this.controlador.activarVista({ vista: "expertos" });
                    else
                        alert(`Error: ${error}`);
                },
            });
        }
    }
    show({ ver, experto, opcion, } = { ver: false, experto: new Cl_mExperto() }) {
        super.show({ ver });
        if (opcion) {
            this.opcion = opcion;
            this.experto.nombre = this.inNombre.value = experto.nombre;
            this.experto.area = this.inArea.value = experto.area; // Asegúrate que el select tenga options
            this.experto.cargo = this.inCargo.value = experto.cargo;
            this.refresh();
        }
    }
}
