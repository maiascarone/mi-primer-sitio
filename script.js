/* =========================================================
   PSICOLOGÍA DEL DEPORTE
   SCRIPT.JS
   Funciones generales de todo el sitio
   ========================================================= */


/* =========================================================
   1. ESPERAR A QUE CARGUE LA PÁGINA
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* Ejecutamos todas las funciones */
    iniciarModoOscuro();
    iniciarNavegacion();
    iniciarAnimaciones();
    iniciarBotonArriba();
    iniciarTest();
    iniciarBotones();
    marcarPaginaActual();

});


/* =========================================================
   2. MODO OSCURO / MODO CLARO
   ========================================================= */

function iniciarModoOscuro() {

    const themeButton = document.querySelector(".theme-button");

    /* Recuperar el tema guardado */
    const temaGuardado = localStorage.getItem("tema");

    if (temaGuardado === "dark") {
        document.body.classList.add("dark-mode");
        actualizarBotonTema();
    }

    if (temaGuardado === "light") {
        document.body.classList.remove("dark-mode");
        actualizarBotonTema();
    }

    /* Si existe el botón */
    if (themeButton) {

        themeButton.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            const modoOscuroActivo =
                document.body.classList.contains("dark-mode");

            /* Guardar elección */
            if (modoOscuroActivo) {
                localStorage.setItem("tema", "dark");
            } else {
                localStorage.setItem("tema", "light");
            }

            actualizarBotonTema();
        });
    }
}


/* Cambiar el texto/icono del botón */
function actualizarBotonTema() {

    const themeButton = document.querySelector(".theme-button");

    if (!themeButton) return;

    const modoOscuro =
        document.body.classList.contains("dark-mode");

    if (modoOscuro) {
        themeButton.innerHTML = "☀️ Modo claro";
        themeButton.setAttribute("aria-label", "Activar modo claro");
    } else {
        themeButton.innerHTML = "🌙 Modo oscuro";
        themeButton.setAttribute("aria-label", "Activar modo oscuro");
    }
}


/* =========================================================
   3. NAVEGACIÓN
   ========================================================= */

function iniciarNavegacion() {

    const enlaces = document.querySelectorAll(".nav-links a");

    enlaces.forEach(function (enlace) {

        enlace.addEventListener("click", function () {

            /* Guardamos cuál fue la página seleccionada */
            localStorage.setItem(
                "ultimaPagina",
                enlace.getAttribute("href")
            );

        });

    });

}


/* =========================================================
   4. MARCAR LA PÁGINA ACTUAL
   ========================================================= */

function marcarPaginaActual() {

    const enlaces = document.querySelectorAll(".nav-links a");

    /* Obtener el nombre del archivo actual */
    let paginaActual =
        window.location.pathname.split("/").pop();

    /* Si estamos en la raíz */
    if (paginaActual === "") {
        paginaActual = "index.html";
    }

    enlaces.forEach(function (enlace) {

        const href = enlace.getAttribute("href");

        if (href === paginaActual) {
            enlace.classList.add("active");
        }

    });

}


/* =========================================================
   5. ANIMACIONES AL HACER SCROLL
   ========================================================= */

function iniciarAnimaciones() {

    const elementos = document.querySelectorAll(
        ".info-card, .technique-card, .role-card, " +
        ".distraction-card, .step, .source-card, " +
        ".highlight-section, .definition-box"
    );

    /* Si el navegador no soporta IntersectionObserver */
    if (!("IntersectionObserver" in window)) {

        elementos.forEach(function (elemento) {
            elemento.classList.add("visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15
        }
    );

    elementos.forEach(function (elemento) {
        observer.observe(elemento);
    });

}


/* =========================================================
   6. BOTÓN "VOLVER ARRIBA"
   ========================================================= */

function iniciarBotonArriba() {

    /* Crear el botón */
    const botonArriba = document.createElement("button");

    botonArriba.className = "back-to-top";
    botonArriba.innerHTML = "↑";
    botonArriba.setAttribute(
        "aria-label",
        "Volver al principio de la página"
    );

    /* Estilos básicos para que funcione aunque no estén
       definidos en el CSS */
    botonArriba.style.position = "fixed";
    botonArriba.style.bottom = "25px";
    botonArriba.style.right = "25px";
    botonArriba.style.width = "48px";
    botonArriba.style.height = "48px";
    botonArriba.style.borderRadius = "50%";
    botonArriba.style.border = "none";
    botonArriba.style.cursor = "pointer";
    botonArriba.style.zIndex = "999";
    botonArriba.style.display = "none";

    document.body.appendChild(botonArriba);

    /* Mostrar cuando bajamos */
    window.addEventListener("scroll", function () {

        if (window.scrollY > 400) {
            botonArriba.style.display = "block";
        } else {
            botonArriba.style.display = "none";
        }

    });

    /* Volver arriba */
    botonArriba.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   7. TEST DE PSICOLOGÍA DEPORTIVA
   ========================================================= */

function iniciarTest() {

    const testForm =
        document.getElementById("sportPsychologyTest");

    /* Si esta página no tiene test, no hacemos nada */
    if (!testForm) return;


    /* Elementos del resultado */
    const testResult =
        document.getElementById("testResult");

    const resultScore =
        document.getElementById("resultScore");

    const resultDescription =
        document.getElementById("resultDescription");


    /* -----------------------------------------------------
       ENVIAR TEST
       ----------------------------------------------------- */

    testForm.addEventListener("submit", function (event) {

        event.preventDefault();


        /* Buscar todas las preguntas */
        const preguntas =
            [...new Set(
                [...testForm.querySelectorAll('input[type="radio"]')]
                    .map(input => input.name)
                    .filter(Boolean)
            )];


        /* Comprobar preguntas sin responder */
        const preguntasSinResponder = [];

        preguntas.forEach(function (nombre) {

            const respuesta =
                testForm.querySelector(
                    `input[name="${nombre}"]:checked`
                );

            if (!respuesta) {
                preguntasSinResponder.push(nombre);
            }

        });


        /* Si falta alguna respuesta */
        if (preguntasSinResponder.length > 0) {

            alert(
                "Antes de ver el resultado tenés que responder todas las preguntas."
            );

            /* Buscar la primera pregunta incompleta */
            const primeraPregunta =
                testForm.querySelector(
                    `input[name="${preguntasSinResponder[0]}"]`
                );

            if (primeraPregunta) {

                const tarjeta =
                    primeraPregunta.closest(".question-card");

                if (tarjeta) {

                    tarjeta.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }

            return;
        }


        /* -------------------------------------------------
           CALCULAR PUNTAJE
           ------------------------------------------------- */

        let puntaje = 0;

        preguntas.forEach(function (nombre) {

            const respuesta =
                testForm.querySelector(
                    `input[name="${nombre}"]:checked`
                );

            if (respuesta) {
                puntaje += Number(respuesta.value) || 0;
            }

        });


        /* Buscar puntaje máximo */
        let puntajeMaximo = 0;

        preguntas.forEach(function (nombre) {

            const opciones =
                testForm.querySelectorAll(
                    `input[name="${nombre}"]`
                );

            opciones.forEach(function (opcion) {

                const valor =
                    Number(opcion.value) || 0;

                if (valor > puntajeMaximo) {
                    /* No usamos este valor directamente porque
                       necesitamos el máximo por pregunta */
                }

            });

        });


        /* Calcular correctamente el máximo */
        let maximo = 0;

        preguntas.forEach(function (nombre) {

            const opciones =
                [...testForm.querySelectorAll(
                    `input[name="${nombre}"]`
                )];

            const valores =
                opciones.map(function (opcion) {
                    return Number(opcion.value) || 0;
                });

            if (valores.length > 0) {
                maximo += Math.max(...valores);
            }

        });


        /* Porcentaje */
        let porcentaje = 0;

        if (maximo > 0) {
            porcentaje =
                Math.round((puntaje / maximo) * 100);
        }


        /* Mostrar puntaje */
        if (resultScore) {

            resultScore.textContent =
                `${puntaje} / ${maximo} (${porcentaje}%)`;

        }


        /* -------------------------------------------------
           RESULTADO SEGÚN PUNTAJE
           ------------------------------------------------- */

        let tituloResultado = "";
        let descripcionResultado = "";


        /*
         * IMPORTANTE:
         * Este test es orientativo.
         * No diagnostica problemas psicológicos.
         */


        if (porcentaje <= 39) {

            tituloResultado =
                "Hay aspectos que podés seguir desarrollando";

            descripcionResultado =
                "Tus respuestas muestran que algunas habilidades " +
                "psicológicas relacionadas con el deporte todavía " +
                "pueden trabajarse. Podés empezar con objetivos " +
                "pequeños, rutinas antes de competir, respiración, " +
                "concentración y diálogo interno positivo.";

        } else if (porcentaje <= 69) {

            tituloResultado =
                "Tenés una buena base psicológica";

            descripcionResultado =
                "Tus respuestas muestran una base positiva en varias " +
                "habilidades mentales relacionadas con el deporte. " +
                "Seguir practicando concentración, manejo de la " +
                "ansiedad, motivación y confianza puede ayudarte a " +
                "fortalecer estas habilidades.";

        } else {

            tituloResultado =
                "Mostrás varias habilidades psicológicas desarrolladas";

            descripcionResultado =
                "Tus respuestas muestran una tendencia favorable " +
                "hacia diferentes habilidades psicológicas deportivas. " +
                "Recordá que estas capacidades pueden variar según " +
                "la situación, el entrenamiento y el contexto de " +
                "cada competencia.";

        }


        /* Mostrar el resultado */
        if (resultDescription) {

            resultDescription.innerHTML =
                `<strong>${tituloResultado}</strong><br><br>` +
                descripcionResultado +
                `<br><br><small>` +
                `Este resultado es educativo y orientativo. ` +
                `No constituye un diagnóstico psicológico.` +
                `</small>`;

        }


        if (testResult) {

            testResult.classList.add("show");

            /* Desplazarse hasta el resultado */
            setTimeout(function () {

                testResult.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 150);

        }

    });


    /* -----------------------------------------------------
       BOTÓN PARA REINICIAR EL TEST
       ----------------------------------------------------- */

    const resetButton =
        document.getElementById("resetTest");

    if (resetButton) {

        resetButton.addEventListener("click", function () {

            testForm.reset();

            if (testResult) {
                testResult.classList.remove("show");
            }

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

}


/* =========================================================
   8. BOTONES GENERALES
   ========================================================= */

function iniciarBotones() {

    const botones =
        document.querySelectorAll(".btn");

    botones.forEach(function (boton) {

        boton.addEventListener("click", function () {

            /* Pequeño efecto visual */
            boton.classList.add("clicked");

            setTimeout(function () {
                boton.classList.remove("clicked");
            }, 200);

        });

    });

}


/* =========================================================
   9. SMOOTH SCROLL PARA ENLACES INTERNOS
   ========================================================= */

document.addEventListener("click", function (event) {

    const enlace =
        event.target.closest('a[href^="#"]');

    if (!enlace) return;

    const destino =
        enlace.getAttribute("href");

    if (!destino || destino === "#") return;

    const elemento =
        document.querySelector(destino);

    if (!elemento) return;

    event.preventDefault();

    elemento.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


/* =========================================================
   10. EFECTO EN LAS OPCIONES DEL TEST
   ========================================================= */

document.addEventListener("change", function (event) {

    const input = event.target;

    if (
        input.matches(
            '.answer-option input[type="radio"], ' +
            '.answer-option input[type="checkbox"]'
        )
    ) {

        const contenedor =
            input.closest(".answer-option");

        if (contenedor) {

            /* Quitar selección visual de las demás */
            const grupo =
                input.closest(".question-card");

            if (grupo && input.type === "radio") {

                grupo
                    .querySelectorAll(".answer-option")
                    .forEach(function (opcion) {
                        opcion.classList.remove("selected");
                    });

            }

            /* Marcar seleccionada */
            if (input.checked) {
                contenedor.classList.add("selected");
            }

        }

    }

});


/* =========================================================
   11. PREVENIR ENVÍOS ACCIDENTALES
   ========================================================= */

document.addEventListener("keydown", function (event) {

    /* Si se presiona Enter dentro de un campo del test,
       no enviamos accidentalmente el formulario */
    if (
        event.key === "Enter" &&
        event.target.matches(
            '#sportPsychologyTest input[type="radio"]'
        )
    ) {

        event.preventDefault();

    }

});


/* =========================================================
   12. MENSAJE DE BIENVENIDA EN LA PÁGINA PRINCIPAL
   ========================================================= */

function mensajeBienvenida() {

    const bienvenida =
        document.querySelector(".welcome-message");

    if (!bienvenida) return;

    setTimeout(function () {

        bienvenida.classList.add("show");

    }, 300);

}


/* =========================================================
   13. DETECTAR SI EL USUARIO ESTÁ EN CELULAR
   ========================================================= */

function detectarDispositivo() {

    const esMovil =
        window.innerWidth <= 768;

    if (esMovil) {
        document.body.classList.add("mobile-device");
    } else {
        document.body.classList.remove("mobile-device");
    }

}


/* Ejecutar al cargar */
detectarDispositivo();


/* Ejecutar si cambia el tamaño de la ventana */
window.addEventListener(
    "resize",
    detectarDispositivo
);



```javascript
// ======================================
// COMPARTIR EXPERIENCIA
// ======================================

const experienceForm = document.getElementById("experienceForm");
const experiencesContainer = document.getElementById("experiencesContainer");

experienceForm.addEventListener("submit", function(event) {

    // Evita que la página se recargue
    event.preventDefault();

    // Obtener los datos escritos
    const name = document.getElementById("name").value.trim();
    const sport = document.getElementById("sport").value.trim();
    const experience = document.getElementById("experience").value.trim();

    // Crear la tarjeta
    const card = document.createElement("article");
    card.className = "experience-card";

    // Primera letra del nombre
    const initial = name.charAt(0).toUpperCase();

    card.innerHTML = `
        <div class="person-info">

            <div class="avatar">
                ${initial}
            </div>

            <div>
                <h3>${name}</h3>
                <span>${sport}</span>
            </div>

        </div>

        <p class="experience-text">
            ${experience}
        </p>

        <div class="comments">

            <h4>Comentarios</h4>

            <div class="comment-list">
                <p class="no-comments">
                    Sé el primero en comentar.
                </p>
            </div>

            <form class="comment-form">

                <input
                    type="text"
                    placeholder="Escribí un comentario..."
                    class="comment-input"
                >

                <button type="submit">
                    Comentar
                </button>

            </form>

        </div>
    `;

    // Agregar la nueva experiencia arriba de las demás
    experiencesContainer.prepend(card);

    // Vaciar formulario
    experienceForm.reset();

    // Llevar al usuario a la experiencia publicada
    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});


// ======================================
// COMENTARIOS
// ======================================

document.addEventListener("submit", function(event) {

    if (!event.target.classList.contains("comment-form")) {
        return;
    }

    // Evitar que se recargue la página
    event.preventDefault();

    const form = event.target;

    const input = form.querySelector(".comment-input");

    const commentText = input.value.trim();

    if (commentText === "") {
        return;
    }

    const commentList = form.parentElement.querySelector(".comment-list");

    // Si decía "Sé el primero en comentar", lo sacamos
    const noComments = commentList.querySelector(".no-comments");

    if (noComments) {
        noComments.remove();
    }

    // Crear comentario
    const comment = document.createElement("div");

    comment.className = "comment";

    comment.innerHTML = `
        <strong>Vos:</strong>
        ${commentText}
    `;

    // Agregar comentario
    commentList.appendChild(comment);

    // Limpiar input
    input.value = "";

});
```


/* =========================================================
   14. ACCESIBILIDAD
   ========================================================= */

function mejorarAccesibilidad() {

    const enlaces =
        document.querySelectorAll("a");

    enlaces.forEach(function (enlace) {

        /* Si abre en una pestaña nueva */
        if (enlace.target === "_blank") {

            enlace.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        }

    });

}


/* Ejecutar */
mejorarAccesibilidad();


/* =========================================================
   15. MENSAJE DE CONSOLA
   ========================================================= */

console.log(
    "🧠 Psicología del Deporte | Sitio web cargado correctamente."
);

console.log(
    "Todas las funciones de JavaScript están activas."
);
