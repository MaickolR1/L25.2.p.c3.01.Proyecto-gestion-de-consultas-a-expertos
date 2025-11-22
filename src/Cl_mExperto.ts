import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";

export interface iExperto {
  id: number | null;
  creadoEl: string | null;
  alias: string | null;
  nombre: string;
  area: string;
  cargo: string;
}

export default class Cl_mExperto extends Cl_mTablaWeb {
  private _nombre: string = "";
  private _area: string = "";
  private _cargo: string = "";

  constructor(
    { id, creadoEl, alias, nombre, area, cargo }: iExperto = {
      id: null,
      creadoEl: null,
      alias: null,
      nombre: "",
      area: "",
      cargo: "",
    }
  ) {
    super({ id, creadoEl, alias });
    this.nombre = nombre;
    this.area = area;
    this.cargo = cargo;
  }

  set nombre(nombre: string) {
    this._nombre = nombre.trim().toUpperCase();
  }
  get nombre(): string {
    return this._nombre;
  }

  set area(area: string) {
    this._area = area;
  }
  get area(): string {
    return this._area;
  }

  set cargo(cargo: string) {
    this._cargo = cargo.trim();
  }
  get cargo(): string {
    return this._cargo;
  }

  // Validaciones
  get nombreOk(): boolean {
    return this.nombre.length > 3;
  }
  get areaOk(): boolean {
    return this.area !== ""; // Asumiendo que debe seleccionar una
  }
  
  get expertoOk(): string | true {
    if (!this.nombreOk) return "El nombre es muy corto";
    if (!this.areaOk) return "Debe seleccionar un área";
    return true;
  }

  toJSON(): iExperto {
    return {
      ...super.toJSON(),
      nombre: this._nombre,
      area: this._area,
      cargo: this._cargo,
    };
  }
}