import Cl_mGrupo from "./Cl_mGrupo.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_vGrupo extends Cl_vGeneral {
  private inNombre: HTMLInputElement;
  private btAceptar: HTMLButtonElement;
  private btCancelar: HTMLButtonElement;
  private lblOpcion: HTMLLabelElement;
  private opcion: opcionFicha | null;
  private grupo: Cl_mGrupo;

  constructor() {
    super({ formName: "grupo" }); // Asegúrate de tener <div id="grupo"> en tu HTML
    this.opcion = null;
    this.grupo = new Cl_mGrupo();

    this.lblOpcion = this.crearHTMLLabelElement("lblOpcion", {
      refresh: () =>
        (this.lblOpcion.innerHTML =
          this.opcion === opcionFicha.add ? "Registrar Grupo/Usuario" : "Editar Grupo"),
    });

    this.inNombre = this.crearHTMLInputElement("inNombre", {
      oninput: () => {
        // Asignamos valor al modelo y refrescamos para validar
        this.grupo.nombre = this.inNombre.value; 
        this.refresh();
      },
      refresh: () =>
        (this.inNombre.style.borderColor = this.grupo.nombreOk ? "" : "red"),
    });

    this.btAceptar = this.crearHTMLButtonElement("btAceptar", {
      onclick: () => this.aceptar(),
      refresh: () => {
        // Deshabilitar botón si las validaciones del modelo fallan
        this.btAceptar.disabled = this.grupo.grupoOk !== true;
      },
    });

    this.btCancelar = this.crearHTMLButtonElement("btCancelar", {
      // Al cancelar, volvemos a la lista de grupos
      onclick: () => this.controlador!.activarVista({ vista: "grupos" }),
    });
  }

  aceptar() {
    if (this.opcion === opcionFicha.add)
      this.controlador!.addGrupo({
        dtGrupo: this.grupo.toJSON(),
        callback: (error) => {
          if (!error) this.controlador!.activarVista({ vista: "grupos" });
          else alert(`Error: ${error}`);
        },
      });
    else {
      this.controlador!.editGrupo({
        dtGrupo: this.grupo.toJSON(),
        callback: (error) => {
          if (!error) this.controlador!.activarVista({ vista: "grupos" });
          else alert(`Error: ${error}`);
        },
      });
    }
  }

 show({
    ver,
    grupo,
    opcion,
  }: {
    ver: boolean;
    grupo?: Cl_mGrupo;
    opcion?: opcionFicha;
  } = { ver: false, grupo: new Cl_mGrupo() }): void {
    super.show({ ver });
    
    if (opcion) {
      this.opcion = opcion;

      if (grupo) {
        // Si es editar, cargamos los datos del grupo existente
        this.grupo = new Cl_mGrupo(grupo.toJSON());
        this.inNombre.value = this.grupo.nombre;
      } else {
        // Si es agregar, creamos uno vacío
        this.grupo = new Cl_mGrupo();
        this.inNombre.value = "";
      }
      
      this.refresh();
    }
  }
}