export const doseTour = [
  { id:'peso', title:'Peso del animal', message:'Comienza escribiendo el peso del animal. Con este dato se calcula la cantidad de producto que corresponde al paciente.', tip:'El botón de unidad permite alternar entre libras y kilogramos.' },
  { id:'dosis', title:'Dosis recomendada', message:'Escribe la dosis indicada por el profesional o por la etiqueta del medicamento. Revisa que la unidad corresponda al dato que tienes.' },
  { id:'concentracion', title:'Concentración del producto', message:'Introduce cuántos mg contiene cada mL o cada g del producto. Usa mg/mL para obtener mL, o mg/g para obtener g.' },
  { id:'calcular', title:'Calcular la dosis', message:'Cuando completes los tres campos, este botón calculará el resultado. Durante el recorrido no se cambian ni se envían tus datos.' },
  { id:'resultado', title:'Consulta el resultado', message:'Aquí aparecerá la cantidad calculada. Contrasta el resultado y las unidades con la etiqueta antes de utilizarlo.' },
  { id:'acciones', title:'Guardar, imprimir o limpiar', message:'Desde estos botones puedes limpiar el formulario o imprimir. Con tu cuenta, los resultados completos se guardan automáticamente; como invitado no se conserva la actividad.' },
  { id:'inicio', title:'Volver al inicio', message:'Este botón te lleva al menú de herramientas. Puedes repetir este recorrido cuando quieras desde “Guía paso a paso”.' },
];
export const pearsonTour = [
  { id:'proteico', title:'Elige la fuente proteica', message:'Selecciona el ingrediente que aporta más proteína. El buscador te permite encontrarlo por su nombre; debajo se muestra su porcentaje de proteína bruta.' },
  { id:'nutreico', title:'Elige la fuente energética', message:'Selecciona el segundo ingrediente. Para construir la mezcla, su porcentaje de proteína debe ser menor que el objetivo.' },
  { id:'deseado', title:'Define tu objetivo', message:'Escribe el porcentaje de proteína deseado. Debe quedar entre los porcentajes de las dos fuentes. Los resultados se actualizan automáticamente.' },
  { id:'cuadrado', title:'Lee el cuadrado de Pearson', message:'A la izquierda están los porcentajes de los ingredientes y al centro el objetivo. Las restas diagonales producen las partes que aparecen a la derecha.' },
  { id:'resultados', title:'Revisa la mezcla', message:'Este panel muestra cuánto usar de cada ingrediente por cada 100 lb y el aporte de proteína de la mezcla.' },
  { id:'acciones', title:'Conserva tus resultados', message:'Con sesión iniciada, los cálculos completos se guardan automáticamente en tu cuenta. Aquí también puedes imprimir o limpiar para comenzar otra mezcla.' },
  { id:'inicio', title:'Regresa a las herramientas', message:'Vuelve al menú principal desde aquí. Puedes saltar o repetir el tutorial sin perder los datos que ya escribiste.' },
];
export function kardexTour(method) {
  const prefix = id => `${method}.${id}`;
  return [
    { id:prefix('producto'), title:'Identifica el producto', message:'Escribe nombre, código y unidad de medida. Estos datos identifican la tarjeta de inventario que vas a trabajar.' },
    { id:prefix('movimiento'), title:'Completa el movimiento', message:'Primero registra el inventario inicial. Después podrás elegir entradas o salidas. Completa fecha, detalle, cantidad y, en las entradas, costo unitario.' },
    { id:prefix('registrar'), title:'Registra la operación', message:'Este botón aplica el movimiento al inventario. Una venta no puede superar las existencias disponibles.' },
    { id:prefix('resumen'), title:'Comprueba las existencias', message:'Aquí se actualizan las unidades disponibles y el valor de tu inventario según el método seleccionado.' },
    { id:prefix('tabla'), title:'Consulta los movimientos', message:'La tabla conserva las entradas, salidas y saldos de esta tarjeta. Desliza horizontalmente si no ves todas las columnas.' },
    { id:prefix('acciones'), title:'Guarda o imprime la tarjeta', message:'Las tarjetas con movimientos se guardan automáticamente con tu cuenta. También puedes imprimirlas o limpiar para empezar otra. En modo invitado no se guarda la actividad.' },
    { id:'inicio', title:'Volver al inicio', message:'Regresa al menú principal desde este botón. El recorrido está disponible para cada método de Kardex.' },
  ];
}
