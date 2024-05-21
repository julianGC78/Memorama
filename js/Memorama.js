let contadorCartas = 0;

window.onload = function () {
  let home = document.querySelector(".home ");
  home.addEventListener("click", function () { // funcion para redigir a index.
    window.location.pathname = "index.html";
  });


  const tablero = document.querySelector(".tablero");

  const botonNivel1 = document.querySelector(".nivel1");
  const botonNivel2 = document.querySelector(".nivel2");
  const botonNivel3 = document.querySelector(".nivel3");

  botonNivel1.addEventListener("click", function () {
    iniciarJuego(5, "75%",4);
    mostrarMensaje("Estas en el nivel 1", 2000);
  });

  botonNivel2.addEventListener("click", function () {
    iniciarJuego(9, "85%",10);
    mostrarMensaje("Estas en el nivel 2", 2000); 
  });

  botonNivel3.addEventListener("click", function () {
    iniciarJuego(12, "80%",20);
    mostrarMensaje("Estas en el nivel 3", 2000);
  });

  // funcion para iniciar juego que le pasamos tres parametros
  function iniciarJuego(numCartas, anchoTablero,inicioContador) {
    juego(numCartas);
    tablero.style.width = anchoTablero;
    contadorCartas=inicioContador;
  }

  // funcion principal donde se crea todo el juego y su logica
  let juego = async (numCartas) => {
    // Limpiar el tablero
    document.querySelector(".tablero").innerHTML = "";
    let listaIconos;

    // Obtenemos los elementos del archivo JSON y los almacenamos en la variable 'listaIconos
    try {
      const response = await fetch("../datos/iconos.json");
      const data = await response.json();

      listaIconos = data[0].iconos;
      const tablero = document.querySelector(".tablero");
      let i = 0;

      // Selecionamos iconos unicos aleatorimente y los duplicamos con contac
      const iconosSeleccionados = seleccionarIconos(listaIconos);
      let cartas = iconosSeleccionados.concat(iconosSeleccionados);

      mezclar(cartas);

      //Creamos las cartas y las agregamos al tablero
      //Creamos un fragmento para optimizar la creacion y no sobrecargar la pagina
      const fragmento = document.createDocumentFragment();
      for (const carta of cartas) {
        const contenedorCarta = createCard(carta, i++);
        fragmento.append(contenedorCarta);
      }

      tablero.append(fragmento);
    } catch (error) {
      console.error("Error al cargar JSON:", error);
    }

    // Funcion para selecionar iconos unicos aleatorios
    function seleccionarIconos(iconos) {
      const iconosSeleccionados = [];
      while (iconosSeleccionados.length < numCartas) {
        const indice = Math.floor(Math.random() * iconos.length);
        if (!iconosSeleccionados.includes(iconos[indice])) {
          iconosSeleccionados.push(iconos[indice]);
        }
      }
      return iconosSeleccionados;
    }

    // Función para mezclar un array utilizando el algoritmo de Fisher-Yates
    // Fuente: https://keepcoding.io/blog/algoritmo-de-barajado-de-fisher-yates-en-js/
    function mezclar(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    // Fucnion para crear el elemnto HTML de una carta
    function createCard(carta, index) {
      const conjuntoCarta = document.createElement("div");
      conjuntoCarta.classList.add("conjuntoCarta");
      conjuntoCarta.draggable = true;
      conjuntoCarta.dataset.icono = carta;
      conjuntoCarta.id = "carta" + index;
      conjuntoCarta.addEventListener("dragstart", dragStart);
      conjuntoCarta.addEventListener("dragover", dragOver);
      conjuntoCarta.addEventListener("drop", drop);
      const cartaFrontal = document.createElement("div");
      const cartaTrasera = document.createElement("div");
      cartaFrontal.classList.add("cartaFrontal");
      cartaTrasera.classList.add("cartaTrasera");
      cartaFrontal.innerHTML = carta;
      cartaTrasera.innerHTML = `<i class="fa-regular fa-circle-question"></i>`;

      conjuntoCarta.append(cartaFrontal, cartaTrasera);

      return conjuntoCarta;
    }

    const cartasEnTablero = document.querySelectorAll(".conjuntoCarta");
    let bloqueoClick = false;

    // Funcion maneja el clic de una carta, para voltearla
    function click() {
      if (!bloqueoClick) {
        bloqueoClick = true;
        flipped(this);
        setTimeout(() => {
          flipped(this);
          bloqueoClick = false;
        }, 600);
      }
    }
    for (let carta of cartasEnTablero) {
      carta.addEventListener("click", click);
    }

    // Funcion para girar las cartas
    function flipped(carta) {
      carta.children[0].classList.toggle("giraback");
      carta.children[1].classList.toggle("girafront");
    }

    //=============================//
    // Eventos Drag and Dop       //
    //===========================//

    // Inicia el arrastre y recupera el id del target
    function dragStart(e) {
      e.dataTransfer.setData("text/plain", e.target.id);
    }

    // Durante el arrastre evita el comportamiento prederterminado
    function dragOver(e) {
      e.preventDefault();
      e.target.classList.add("dragover");
    }

    // Maneja al soltar la carta, compruebe si el id e el mismo tanto en carta inicio como
    // destino y le aplica unos estilo. Se 
    function drop(e) {
      e.preventDefault();
      const idCartaArrastrada = e.dataTransfer.getData("text/plain");
      const cartaArrastrada = document.getElementById(idCartaArrastrada);
      const cartaDestino = e.target.closest(".conjuntoCarta");

      if (
        cartaArrastrada.dataset.icono === cartaDestino.dataset.icono &&
        cartaArrastrada.id !== cartaDestino.id
      ) {
        flipped(cartaArrastrada);
        flipped(cartaDestino);
        cartaArrastrada.removeAttribute("draggable");
        cartaDestino.removeAttribute("draggable");
        cartaArrastrada.removeEventListener("click", click);
        cartaDestino.removeEventListener("click", click);
        cartaArrastrada.querySelector(".cartaFrontal").style.cursor =
          "not-allowed";
        cartaDestino.querySelector(".cartaFrontal").style.cursor =
          "not-allowed";
        cartaArrastrada.querySelector(".cartaFrontal").style.backgroundColor =
          "#31e23d";
        cartaDestino.querySelector(".cartaFrontal").style.backgroundColor =
          "#31e23d";
        contadorCartas++;
        // console.log("Número de cartas emparejadas: " + contadorCartas);
      } else {
        // Si las cartas no coinciden, agrega una clase de temblor temporalmente
        cartaDestino.classList.add("temblor");
        setTimeout(() => {
          cartaDestino.classList.remove("temblor");
        }, 500);
      }
      // Evalúa el contador de cartas para determinar el siguiente nivel o mensaje
      switch (contadorCartas) {
        case 3:
          iniciarJuego(5, "68%",4);
          mostrarMensaje("¡Pasaste al nivel 1!", 2000);
          break;
        case 9:
          iniciarJuego(9, "80%",10);
          mostrarMensaje("¡Pasaste al nivel 2!", 2000);
          break;
        case 19:
          iniciarJuego(12, "80%",20);
          mostrarMensaje("¡Pasaste al nivel 3!", 2000);
          break;
        case 32:   
          mensajeGanador();
          break;
      }
    }

    // Voltea las cartas segun incia el juego durante tiempo predertminado
    setTimeout(() => {
      for (const carta of cartasEnTablero) {
        flipped(carta);
      }
    }, 4000);
  };

  function mensajeGanador() {
    mostrarMensaje("¡Has superado el juego, enhorabuena! 😊", 0, true);
  }

  // Funcion para crear mensaje, se pasara el mensaje, que se creara dinamicamente
  // el tiempo se controlara con setTimeout, crearemos uhn boton de reinicio
  function mostrarMensaje(mensaje, tiempo, BotonReiniciar) {
    const contenedorVelo = document.createElement("div");
    contenedorVelo.classList.add("velo");

    const contenedorMensaje = document.createElement("div");
    contenedorMensaje.classList.add("mensaje");
    const mensajeElement = document.createElement("h2");
    mensajeElement.textContent = mensaje;
    contenedorMensaje.append(mensajeElement);

    // Si al pasar funcion botonReinicio es true se agregab al mensaje
    if (BotonReiniciar) {
      const botonReinicio = document.createElement("button");
      botonReinicio.classList.add("botonReinicio");
      botonReinicio.textContent = "Reiniciar Juego";
      botonReinicio.addEventListener("clik", function () {
        contenedorVelo.remove();
        contenedorMensaje.remove();
        iniciarJuego(3, "30%", 0);
      });
      contenedorMensaje.append(botonReinicio);
    }

    document.body.append(contenedorVelo, contenedorMensaje);

    // Mostramos velo
    setTimeout(() => {
      contenedorVelo.classList.add("mostrar");
      contenedorMensaje.classList.add("mostrar");
    }, 500);

   // Si el tiempo es mayor que 0, elimina los elementos después del tiempo especificado 
    if (tiempo > 0) {
      setTimeout(() => {
        contenedorVelo.remove();
        contenedorMensaje.remove();
      }, tiempo);
    }
  }

  iniciarJuego(3, "30%", 0);
};
