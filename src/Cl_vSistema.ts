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
  private vGrupo: Cl_vGrupo;

  // Botones del Menú Principal
  private btGestionExpertos: HTMLButtonElement;
  private btGestionGrupos: HTMLButtonElement;
  private lblMensaje: HTMLLabelElement;

  constructor() {
    super({ formName: "sistema" }); // Asegúrate de tener <div id="sistema"> en tu HTML

    // 1. Instanciar las sub-vistas
    this.vExpertos = new Cl_vExpertos();
    this.vExpertos.show({ ver: false });

    this.vExperto = new Cl_vExperto();
    this.vExperto.show({ ver: false });

    this.vGrupos = new Cl_vGrupos();
    this.vGrupos.show({ ver: false });

    this.vGrupo = new Cl_vGrupo();
    this.vGrupo.show({ ver: false });

    // 2. Crear controles del menú principal (Panel de Administración)
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

  // 4. Lógica de Navegación Central
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

    // 4.2. Módulo Expertos
    this.vExpertos.show({ ver: vista === "expertos" });
    this.vExperto.show({ 
      ver: vista === "experto", 
      experto: vista === "experto" ? (objeto as Cl_mExperto) : undefined, 
      opcion 
    });

    // 4.3. Módulo Grupos
    this.vGrupos.show({ ver: vista === "grupos" });
    this.vGrupo.show({ 
      ver: vista === "grupo", 
      grupo: vista === "grupo" ? (objeto as Cl_mGrupo) : undefined, 
      opcion 
    });
  }
}