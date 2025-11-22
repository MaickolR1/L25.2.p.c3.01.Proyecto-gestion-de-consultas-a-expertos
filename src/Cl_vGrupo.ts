// En Cl_vGrupo.ts (Registro de Consulta / Edición de Grupo)

import Cl_mGrupo from "./Cl_mGrupo.js"; 
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
import { iExperto } from "./Cl_mExperto.js"; 

export default class Cl_vGrupo extends Cl_vGeneral {
  
  // Para REGISTRO DE CONSULTA (modo 'add' de Cl_vSistema)
  private inExperto: HTMLSelectElement; 
  private inPregunta: HTMLTextAreaElement; 

  // Para EDICIÓN DE GRUPO/USUARIO (modo 'edit' de Cl_vSistema)
  private inNombre: HTMLInputElement; // Re-introducimos el campo nombre si mantienes la edición de Grupos
  
  private btAceptar: HTMLButtonElement;
  private btCancelar: HTMLButtonElement;
  private lblOpcion: HTMLLabelElement;
  private opcion: opcionFicha | null;
  private grupo: Cl_mGrupo; 

  constructor() {
    super({ formName: "grupo" }); 
    this.opcion = null;
    this.grupo = new Cl_mGrupo();
    this.inPregunta = this.crearHTMLElement("textarea") as HTMLTextAreaElement;

    this.lblOpcion = this.crearHTMLLabelElement("lblOpcion", {
      refresh: () => {
          // El texto cambia según si estamos añadiendo una consulta o editando un grupo
          if (this.opcion === opcionFicha.add) {
              this.lblOpcion.innerHTML = "Registrar Nueva Consulta";
          } else {
              this.lblOpcion.innerHTML = "Editar Grupo/Usuario";
          }
      }
    });

    // 1. SELECT PARA ELEGIR EXPERTO (Solo visible en modo 'add')
    this.inExperto = this.crearHTMLElement("inExperto", {
      type: tHTMLElement.SELECT,
      refresh: () => {
        this.inExperto.style.borderColor = 
          (this.opcion === opcionFicha.add && this.inExperto.value === "") ? "red" : "";
        this.inExperto.style.display = this.opcion === opcionFicha.add ? 'block' : 'none';
      },
      onchange: () => this.refresh(),
    }) as HTMLSelectElement;
    
    // 2. TEXTAREA PARA LA PREGUNTA (Solo visible en modo 'add')
   const inPregunta = this.crearHTMLElement("inPregunta", {
  type: "textarea",
  refresh: () => {
    // Validación: la pregunta debe tener al menos 10 caracteres
    this.inPregunta.style.borderColor = 
      this.inPregunta.value.length >= 10 ? "" : "red";
  },
}) as HTMLTextAreaElement;

inPregunta.oninput = (): void => this.refresh();

    // 3. INPUT NOMBRE GRUPO (Solo visible en modo 'edit')
    this.inNombre = this.crearHTMLInputElement("inNombre", {
        oninput: () => {
            this.grupo.nombre = this.inNombre.value; 
            this.refresh();
        },
        refresh: () => {
            this.inNombre.style.borderColor = this.grupo.nombreOk ? "" : "red";
            this.inNombre.style.display = this.opcion === opcionFicha.edit ? 'block' : 'none';
        }
    });


    this.btAceptar = this.crearHTMLButtonElement("btAceptar", {
      onclick: () => this.aceptar(),
      refresh: () => {
        let esValido: boolean = false;
        
        if (this.opcion === opcionFicha.add) {
            // Validar para Registro de Consulta
            esValido = this.inExperto.value !== "" && this.inPregunta.value.length >= 10;
        } else if (this.opcion === opcionFicha.edit) {
            // Validar para Edición de Grupo
            esValido = this.grupo.nombreOk;
        }

        this.btAceptar.disabled = !esValido;
      },
    });

    this.btCancelar = this.crearHTMLButtonElement("btCancelar", {
      // Volvemos a la lista de grupos, que es la vista que tiene el botón de consulta
      onclick: () => this.controlador!.activarVista({ vista: "grupos" }), 
    });
  }
  
  // --- Métodos de Lógica (Adaptados) ---

  cargarExpertos(expertos: iExperto[]) {
    // ... (Lógica de carga de select experto)
    this.inExperto.innerHTML = '<option value="">-- Seleccione un Experto --</option>';
    expertos.forEach(exp => {
      let option = document.createElement("option");
      option.value = exp.id!.toString();
      option.textContent = `${exp.nombre} (${exp.area})`;
      this.inExperto.appendChild(option);
    });
  }

  aceptar() {
      if (this.opcion === opcionFicha.add) {
          // Lógica de Registro de CONSULTA
          const idExperto = parseInt(this.inExperto.value);
          const pregunta = this.inPregunta.value;
          
          this.controlador!.registrarConsulta({
              idExperto,
              pregunta,
              callback: (error) => {
                  if (!error) {
                      alert("Consulta registrada.");
                      this.controlador!.activarVista({ vista: "grupos" }); // Volvemos a la lista de Grupos/Consultas
                  } else {
                      alert(`Error al registrar consulta: ${error}`);
                  }
              }
          });
      } else if (this.opcion === opcionFicha.edit) {
          // Lógica de Edición de GRUPO/USUARIO
          this.controlador!.editGrupo({
              dtGrupo: this.grupo.toJSON(),
              callback: (error) => {
                  if (!error) this.controlador!.activarVista({ vista: "grupos" });
                  else alert(`Error: ${error}`);
              }
          });
      }
  }

  // ===========================================
  // 🎯 FIX CRÍTICO PARA EL ERROR EN Cl_vSistema.ts
  // ===========================================
  show({ 
    ver,
    grupo, // <--- DEBE ESTAR EN LA DESTRUCTURACIÓN
    opcion,
  }: {
    ver: boolean;
    grupo?: Cl_mGrupo; // <--- DEBE ESTAR EN LA INTERFAZ DE TIPOS
    opcion?: opcionFicha;
  } = { ver: false }): void { // <--- Valor por defecto simple
    super.show({ ver });
    
    if (ver) {
        this.opcion = opcion || null; 

        if (this.opcion === opcionFicha.edit && grupo) {
            // Modo Edición de Grupo/Usuario
            this.grupo = grupo;
            this.inNombre.value = this.grupo.nombre;
            // Ocultar campos de consulta
            this.inExperto.value = '';
            this.inPregunta.value = '';
        } else if (this.opcion === opcionFicha.add) {
            // Modo Registro de Consulta
            this.grupo = new Cl_mGrupo(); // Inicializamos un grupo temporal (o simplemente no lo usamos)
            this.cargarExpertos(this.controlador!.dtExpertos); 
            this.inExperto.value = ''; 
            this.inPregunta.value = '';
        }
        
        this.refresh();
    }
  }
}