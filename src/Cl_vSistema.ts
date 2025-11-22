import Cl_controlador from "./Cl_controlador.js";
import Cl_mExperto from "./Cl_mExperto.js";
import Cl_mGrupo from "./Cl_mGrupo.js";
import Cl_vExperto from "./Cl_vExperto.js";
import Cl_vExpertos from "./Cl_vExpertos.js";
import Cl_vGrupo from "./Cl_vGrupo.js";
import Cl_vGrupos from "./Cl_vGrupos.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_vSistema extends Cl_vGeneral {
  // Sub-vistas (Módulos del sistema)
  private vExpertos: Cl_vExpertos;
  private vExperto: Cl_vExperto;
  private vGrupos: Cl_vGrupos;
  private vGrupo: Cl_vGrupo; // Formulario de Consulta/Edición de Grupo

  // Botones del Menú Principal
  private btGestionExpertos: HTMLButtonElement;
  private btGestionGrupos: HTMLButtonElement;
  private lblMensaje: HTMLLabelElement;

  constructor() {
    super({ formName: "sistema" });

    // 1. Instanciar las sub-vistas y ocultarlas
    this.vExpertos = new Cl_vExpertos();
    this.vExpertos.show({ ver: false });

    this.vExperto = new Cl_vExperto();
    this.vExperto.show({ ver: false });

    this.vGrupos = new Cl_vGrupos();
    this.vGrupos.show({ ver: false });

    this.vGrupo = new Cl_vGrupo();
    this.vGrupo.show({ ver: false });

    // 2. Botones del menú principal
    this.btGestionExpertos = this.crearHTMLButtonElement("btGestionExpertos", {
      onclick: () => this.controlador!.activarVista({ vista: "expertos" }),
    });

    this.btGestionGrupos = this.crearHTMLButtonElement("btGestionGrupos", {
      onclick: () => this.controlador!.activarVista({ vista: "grupos" }),
    });

    this.lblMensaje = this.crearHTMLLabelElement("lblMensaje", {
      refresh: () => {},
    });
  }

  // 3. Propagación del Controlador a las sub-vistas
  set controlador(controlador: Cl_controlador) {
    super.controlador = controlador;
    this.vExpertos.controlador = controlador;
    this.vExperto.controlador = controlador;
    this.vGrupos.controlador = controlador;
    this.vGrupo.controlador = controlador;
  }

  get controlador(): Cl_controlador | null {
    return super.controlador;
  }

  // 4. Lógica de Navegación Central (¡CORRECCIÓN AQUÍ!)
  activarVista({
    vista,
    opcion,
    objeto,
  }: {
    vista: string;
    opcion?: opcionFicha;
    objeto?: Cl_mExperto | Cl_mGrupo;
  }): void {

    // 4.1. Vista Principal (Menú)
    this.show({ ver: vista === "sistema" });

    // 4.2. Módulo Expertos (Listado y Formulario)
    this.vExpertos.show({ ver: vista === "expertos" });
    this.vExperto.show({
      ver: vista === "experto",
      // FIX: Solo pasamos 'experto' si el objeto existe y es una instancia de Cl_mExperto
      experto: objeto instanceof Cl_mExperto ? objeto : undefined, 
      opcion,
    });

    // 4.3. Módulo Grupos (Listado y Formulario de Consulta/Edición)
    this.vGrupos.show({ ver: vista === "grupos" });
    this.vGrupo.show({
      ver: vista === "grupo",
      // FIX: Solo pasamos 'grupo' si el objeto existe y es una instancia de Cl_mGrupo
      grupo: objeto instanceof Cl_mGrupo ? objeto : undefined, 
      opcion,
    });
    
    // Refrescar el sistema (siempre al final de un cambio de vista)
    this.refresh();
  }
}