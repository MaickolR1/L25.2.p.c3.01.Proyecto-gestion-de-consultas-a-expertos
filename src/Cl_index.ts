/**Enunciado del Proyecto: Gestor de Consultas a Expertos (ExpertQ) 
Desarrollar una aplicación en TypeScript para gestionar un sistema de consultas donde los usuarios pueden
enviar preguntas a expertos en diversas áreas, con un límite estricto en la cantidad de preguntas que cada 
experto puede tener pendientes. 
Requisitos de la Interfaz de Usuario (UI) 
La aplicación debe presentar tres secciones principales o “ventanas” (componentes/vistas) interconectadas: 
Lista de Expertos (Expert List): 
Muestra una lista de todos los expertos disponibles. 
Por cada experto, se debe visualizar su Nombre, Especialidad (por ejemplo, ‘Frontend’, ‘Backend’, ‘Bases de Datos’),
 y el Número de Consultas Pendientes que tiene asignadas actualmente. 
Debe indicar claramente el Límite Máximo de Consultas Pendientes para ese experto (por ejemplo, 5). 
Lista de Consultas Pendientes (Pending Queries): 
Muestra todas las consultas que han sido enviadas y aún no han sido asignadas a un experto (o están en una cola general). 
Por cada consulta, se debe ver un ID de Consulta, el Área de la Consulta (que debe coincidir con la especialidad de un experto),
y el Texto de la Pregunta (o un resumen). 
Debe tener una función para Asignar la consulta a un experto disponible. 
Detalle/Gestión de Preguntas (Question Management): 
Una vista que muestra todas las preguntas actualmente asignadas a un experto en particular. 
Debe permitir al experto Responder o Cerrar una pregunta. Al cerrarse, la pregunta
sale de su lista de pendientes y su contador se reduce.  */

import Cl_controlador from "./Cl_controlador.js";
import Cl_vSistema from "./Cl_vSistema.js";
import Cl_mSistema from "./Cl_mSistema.js";


export default class Cl_index {
  constructor() {
    let modelo = new Cl_mSistema();
    modelo.cargar((error: string | false) => {
      if (error) alert(error);
      if (error) throw new Error(error);
      let vista = new Cl_vSistema();
      let controlador = new Cl_controlador(modelo, vista);
      vista.controlador = controlador;
      vista.refresh();
    });
  }
}














