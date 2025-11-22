import Cl_mExperto from "./Cl_mExperto.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
import { tHTMLElement } from "./tools/Cl_vGeneral.js";
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
        // Input Área
        this.inArea = this.crearHTMLElement("inArea", {
            type: tHTMLElement.SELECT,
            onchange: () => {
                this.experto.area = this.inArea.value;
                this.refresh();
            },
            refresh: () => (this.inArea.style.borderColor = this.experto.areaOk ? "" : "red"),
        });
        // Input Cargo
        this.inCargo = this.crearHTMLInputElement("inCargo", {
            oninput: () => {
                this.experto.cargo = this.inCargo.value;
                this.refresh();
            },
            refresh: () => (this.inCargo.style.borderColor = this.experto.cargoOk ? "" : "red"),
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
    // MÉTODO CORREGIDO
    show({ ver, experto, opcion, } = { ver: false }) {
        super.show({ ver });
        // Solo actualizamos los inputs si la vista se está mostrando (ver: true)
        if (ver) {
            this.opcion = opcion || null; // Capturamos la opción de operación (add/edit)
            if (opcion === opcionFicha.add) {
                // FIX CRÍTICO: Creamos una instancia limpia para la opción "Agregar"
                this.experto = new Cl_mExperto();
            }
            else if (opcion === opcionFicha.edit && experto) {
                // Modo Editar: Usamos el modelo que fue pasado como parámetro
                this.experto = experto;
            }
            // Asignamos los valores (ahora this.experto siempre es un objeto)
            this.inNombre.value = this.experto.nombre;
            this.inArea.value = this.experto.area;
            this.inCargo.value = this.experto.cargo;
            this.refresh();
        }
    }
}
