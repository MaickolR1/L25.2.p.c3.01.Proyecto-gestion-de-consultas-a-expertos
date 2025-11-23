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
    super({ formName: "sistema" });

    // 1. Instanciar las sub-vistas
    this.vExpertos = new Cl_vExpertos();
    this.vExpertos.show({ ver: false });

    this.vExperto = new Cl_vExperto();
    this.vExperto.show({ ver: false });

    this.vGrupos = new Cl_vGrupos();
    this.vGrupos.show({ ver: false });

    this.vGrupo = new Cl_vGrupo();
    this.vGrupo.show({ ver: false });

    // 2. Crear controles del menú principal
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
  // Esto es vital para que las otras pantallas "conozcan" al controlador
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
    
    // Primero ocultamos la vista principal para limpiar la pantalla
    this.show({ ver: vista === "sistema" });

    // Gestión de EXPERTOS
    this.vExpertos.show({ ver: vista === "expertos" });
    
    this.vExperto.show({
      ver: vista === "experto",
      // Verificamos si el objeto es un Experto antes de pasarlo
      experto: objeto instanceof Cl_mExperto ? objeto : undefined,
      opcion,
    });

    // Gestión de GRUPOS / CONSULTAS
    this.vGrupos.show({ ver: vista === "grupos" });
    
    this.vGrupo.show({
      ver: vista === "grupo",
      // Verificamos si el objeto es un Grupo antes de pasarlo.
      // Esto soluciona el error "El literal de objeto solo puede especificar propiedades conocidas"
      grupo: objeto instanceof Cl_mGrupo ? objeto : undefined,
      opcion,
    });
  }
}