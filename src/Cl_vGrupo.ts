import Cl_mGrupo from "./Cl_mGrupo.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
import { iExperto } from "./Cl_mExperto.js";

export default class Cl_vGrupo extends Cl_vGeneral {
  // Solo necesitamos estos dos inputs
  private inExperto: HTMLSelectElement;
  private inPregunta: HTMLTextAreaElement = document.createElement('textarea');

  private btAceptar: HTMLButtonElement;
  private btCancelar: HTMLButtonElement;
  private lblOpcion: HTMLLabelElement;
  
  private opcion: opcionFicha | null;
  // Mantenemos la propiedad grupo solo por compatibilidad de tipos
  private grupo: Cl_mGrupo | null; 

  constructor() {
    super({ formName: "grupo" });
    this.opcion = null;
    this.grupo = null;

    this.inExperto = this.crearHTMLElement("inExperto", { type: "select" }) as HTMLSelectElement;
    this.inPregunta = this.crearHTMLElement("inPregunta", { type: "textarea" }) as HTMLTextAreaElement;
    this.btAceptar = this.crearHTMLButtonElement("btAceptar");
    this.btCancelar = this.crearHTMLButtonElement("btCancelar");

    this.lblOpcion = this.crearHTMLLabelElement("lblOpcion", {
      refresh: () => { this.lblOpcion.innerHTML = "Realizar Consulta"; }
    });

    // 1. SELECT PARA ELEGIR EXPERTO
    this.inExperto = this.crearHTMLElement("inExperto", {
      type: tHTMLElement.SELECT,
      refresh: () => {
        this.inExperto.style.borderColor = this.inExperto.value !== "" ? "" : "red";
      },
      onchange: () => this.refresh(),
    }) as HTMLSelectElement;
    
    // 2. TEXTAREA PARA LA PREGUNTA
   const inPregunta = this.crearHTMLElement("inPregunta", {
  type: "textarea",
  refresh: () => {
    // Validación: la pregunta debe tener al menos 10 caracteres
    this.inPregunta.style.borderColor = 
      this.inPregunta.value.length >= 5 ? "" : "red";
  },
}) as HTMLTextAreaElement;

inPregunta.oninput = (): void => this.refresh();

    this.btAceptar = this.crearHTMLButtonElement("btAceptar", {
      onclick: () => this.aceptar(),
      refresh: () => {
        // Solo valida que haya experto y pregunta. No pide nombre de grupo.
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
      // Solo manejamos el registro de CONSULTA
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
  show({ 
    ver, 
    grupo, 
    opcion 
  }: { 
    ver: boolean; 
    grupo?: Cl_mGrupo; // <--- Al poner esto aquí, el error en Cl_vSistema desaparece
    opcion?: opcionFicha; 
  } = { ver: false }): void {
    
    super.show({ ver });
    
    if (ver) {
        this.opcion = opcion || null;
        
        // Siempre cargamos la lista de expertos
        if (this.controlador) {
            this.cargarExpertos(this.controlador.dtExpertos);
        }

        // Limpiamos los campos para una nueva pregunta
        this.inExperto.value = "";
        this.inPregunta.value = "";
        
        this.refresh();
    }
  }
}