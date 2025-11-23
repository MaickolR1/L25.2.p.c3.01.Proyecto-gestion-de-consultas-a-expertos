import Cl_mGrupo from "./Cl_mGrupo.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
import { iExperto } from "./Cl_mExperto.js";

export default class Cl_vGrupo extends Cl_vGeneral {
  private inExperto: HTMLSelectElement;
  private inPregunta: HTMLTextAreaElement; // La variable interna
  private btAceptar: HTMLButtonElement;
  private btCancelar: HTMLButtonElement;
  private lblOpcion: HTMLLabelElement;
  
  private opcion: opcionFicha | null;
  private grupo: Cl_mGrupo | null; 

  constructor() {
    super({ formName: "grupo" }); // Prefijo 'grupo_'
    this.opcion = null;
    this.grupo = null;

    this.lblOpcion = this.crearHTMLLabelElement("lblOpcion", {
      refresh: () => { this.lblOpcion.innerHTML = "Realizar Consulta"; }
    });

    this.inExperto = this.crearHTMLElement("inExperto", {
      type: tHTMLElement.SELECT,
      refresh: () => {
        this.inExperto.style.borderColor = this.inExperto.value !== "" ? "" : "red";
      },
      onchange: () => this.refresh(),
    }) as HTMLSelectElement;
    
    // CORRECCIÓN AQUÍ: 
    // Usamos "inPregunta" para que busque el id="grupo_inPregunta"
    // Si tenías "textarea", cámbialo a "inPregunta"
    this.inPregunta = this.crearHTMLElement("inPregunta", {
      type: tHTMLElement.TEXTAREA,
      oninput: () => this.refresh(),
      refresh: () => {
        this.inPregunta.style.borderColor = this.inPregunta.value.length >= 5 ? "" : "red";
      },
    }) as HTMLTextAreaElement;

    this.btAceptar = this.crearHTMLButtonElement("btAceptar", {
      onclick: () => this.aceptar(),
      refresh: () => {
        this.btAceptar.disabled = this.inExperto.value === "" || this.inPregunta.value.length < 5;
      },
    });

    this.btCancelar = this.crearHTMLButtonElement("btCancelar", {
      onclick: () => this.controlador!.activarVista({ vista: "sistema" }),
    });
  }

  cargarExpertos(expertos: iExperto[]) {
    this.inExperto.innerHTML = '<option value="">-- Seleccione un Experto --</option>';
    expertos.forEach(exp => {
      let option = document.createElement("option");
      option.value = exp.id!.toString();
      option.textContent = `${exp.nombre} (${exp.area})`;
      this.inExperto.appendChild(option);
    });
  }

  aceptar() {
      const idExperto = parseInt(this.inExperto.value);
      const pregunta = this.inPregunta.value;
      
      this.controlador!.registrarConsulta({
          idExperto,
          pregunta,
          callback: (error) => {
              if (!error) {
                  alert("Consulta enviada correctamente.");
                  this.controlador!.activarVista({ vista: "sistema" });
              } else {
                  alert(`Error: ${error}`);
              }
          }
      });
  }

  show({ ver, grupo, opcion }: { ver: boolean; grupo?: Cl_mGrupo; opcion?: opcionFicha } = { ver: false }): void {
    super.show({ ver });
    if (ver) {
        this.opcion = opcion || null;
        if (this.controlador) {
            this.cargarExpertos(this.controlador.dtExpertos);
        }
        this.inExperto.value = "";
        this.inPregunta.value = "";
        this.refresh();
    }
  }
}