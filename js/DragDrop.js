window.onload = function () {
  let home=document.querySelector('.home ');
  home.addEventListener('click',function(){
    window.location.pathname='index.html'
  });
  
  // Funcion para crear elementos dinamicamente
  function crearElementos(contenedor, id, claseContenedor, claseElemento, icono, cantidad) {
    const contenedorElementos = document.createElement("div");
    contenedorElementos.classList.add(claseContenedor);

    for (let i = 1; i <= cantidad; i++) {
      let elemento = document.createElement("div");
      elemento.id = id + i;
      elemento.draggable = true;
      elemento.classList.add(claseElemento);

      if (icono.length > 0) {
        const iconoElemento = document.createElement("i");
        iconoElemento.classList.add(...icono.split(" "));

        elemento.append(iconoElemento);
      }
      contenedorElementos.append(elemento);
    }
    contenedor.append(contenedorElementos);
  }
  // Agregar elementos creados al documento
  const tablero = document.querySelector(".tablero");

  crearElementos(tablero, "x", "contenedor-x", "x", "fa-solid fa-xmark", 5);
  crearElementos(tablero,'box','contenedorBox', 'box','',9);
  crearElementos(tablero,'c','contenedor-circulo','circulo',"fa-regular fa-circle",5);

  const xElements = document.querySelectorAll(".x");
  const circuloElements = document.querySelectorAll(".circulo");
  const botonReinicio = document.querySelector("button");
  const veloPagina = document.querySelector(".velo-pagina");

  // Función que se ejecuta cuando se inicia el arrastre
  function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id); // Establece el ID del elemento como dato de transferencia
  }
  // Añade el evento 'dragstart' a todos los elementos 'x'
  for (const x of xElements) {
    x.addEventListener("dragstart", dragStart);
    // x.addEventListener('dragend', dragEnd);
  }
  // Añade el evento 'dragstart' a todos los elementos 'circulo'
  for (const circulo of circuloElements) {
    circulo.addEventListener("dragstart", dragStart);
  }

  // Selecciona todos los elementos con la clase 'box'
  const boxes = document.querySelectorAll(".box");

  // Añade los eventos de arrastre a todos los elementos 'box'
  for (const box of boxes) {
    box.addEventListener("dragenter", dragEnter);
    box.addEventListener("dragover", dragOver);
    box.addEventListener("drop", drop);
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragOver(e) {
    e.preventDefault();
    e.target.classList.add("drag-over");
  }

  //Función que se ejecuta cuando se suelta el elemento arrastrado
  function drop(e) {
    const id = e.dataTransfer.getData("text/plain");
    const draggable = document.getElementById(id);

    e.target.append(draggable);
    mostrarGanador();
  }

  // Función para verificar el ganador
  function verificarGanador() {
    const comGanadoras = [
      // Filas
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columnas
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonales
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Verifica si alguna de las combinaciones ganadoras se ha logrado
    for (const combinacion of comGanadoras) {
      const [a, b, c] = combinacion;

      // Comprobamos que la casilla tenga un elemnto i y que ese elemnto sea X ó O
      if (
        boxes[a].querySelector("i") &&
        boxes[a].querySelector("i").classList.contains("fa-xmark") &&
        boxes[b].querySelector("i") &&
        boxes[b].querySelector("i").classList.contains("fa-xmark") &&
        boxes[c].querySelector("i") &&
        boxes[c].querySelector("i").classList.contains("fa-xmark")
      ) {
        return " Gana la X";
      } else if (
        boxes[a].querySelector("i") &&
        boxes[a].querySelector("i").classList.contains("fa-circle") &&
        boxes[b].querySelector("i") &&
        boxes[b].querySelector("i").classList.contains("fa-circle") &&
        boxes[c].querySelector("i") &&
        boxes[c].querySelector("i").classList.contains("fa-circle")
      ) {
        return " Gana el Circulo";
      }
    }
    let todasOcupadas = true;
    for (let i = 0; i < boxes.length; i++) {
      if (!boxes[i].querySelector("i")) {
        todasOcupadas = false;
        break;
      }
    }
    if (todasOcupadas) {
      return "Tablas";
    }

    return null;
  }

  // Funcion para mostrar el ganador
  function mostrarGanador() {
    const ganador = verificarGanador();
    if (ganador !== null) {
      // Creamos elementos para mostrar al ganador
      let section = document.querySelector("section");

      let fraseGanador = document.createElement("h2");
      fraseGanador.classList.add("fraseGanador");
      section.append(fraseGanador);

      fraseGanador.textContent = `${ganador}`;

      // Eliminamos eventos de arrastyre cuando hay un ganador
      for (const x of xElements) {
        x.removeEventListener("dragstart", dragStart);
      }
      for (const circulo of circuloElements) {
        circulo.removeEventListener("dragstart", dragStart);
      }

      for (box of boxes) {
        box.removeEventListener("dragenter", dragEnter);
        box.removeEventListener("dragover", dragOver);
        box.removeEventListener("drop", drop);
      }
      veloPagina.classList.toggle("pon-velo");
    }
  }

  botonReinicio.addEventListener("click", function () {
    // Elimina la frase del ganador
    let fraseGanador = document.querySelector(".fraseGanador");
    if (fraseGanador) {
      fraseGanador.remove();
    }
    // Muestra el mensaje durante 2 segundos
    const jugadorInicial = Math.random() < 0.5 ? " La X" : "  El Círculo";

    // Crear un elemento para mostrar el mensaje
    let section = document.querySelector("section");
    let mensajeInicio = document.createElement("h2");
    mensajeInicio.classList.add("mensajeInicio");
    section.append(mensajeInicio);
    mensajeInicio.textContent = `Empieza: ${jugadorInicial}`;

    // Espera 2 segundos antes de recargar la página
    setTimeout(function () {
      location.reload();
    }, 2000);
  });
};