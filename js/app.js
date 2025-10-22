$(document).ready(function () {
  const $loader = $('#loader');
  const $lista = $('#lista-peliculas');
  const trailerModal = new bootstrap.Modal(document.getElementById('trailerModal'));
  const $iframe = $('#modalTrailerIframe');
  const $modalTitle = $('#trailerModalTitle');

  // Ocultar lista y mostrar loader
  $lista.hide();
  $loader.show();

  // Carga de películas con retraso artificial de 5 segundos
  $.ajax({
    url: "data/peliculas.json",
    method: "GET", 
    dataType: "json",
    success: function (peliculas) {
      console.log("Datos recibidos:", peliculas.length, "películas");

      setTimeout(() => {
    renderPeliculas(peliculas);

    // Primero ocultamos loader
    $loader.fadeOut(300, function() {
        // Luego mostramos lista
        $lista.fadeIn(400, function() {
            // Animar cada tarjeta
            $lista.find('.card').each(function(i) {
                $(this).delay(150 * i).queue(function(next) {
                    $(this).addClass('mostrada');
                    next();
                });
            });
        });
    });
}, 500); // Pon 0 mientras pruebas


    },
    error: function (xhr, status, error) {
      console.error("Error al cargar las películas:", error);
      $loader.hide();
      $lista.html(`
        <div class="col-12">
          <div class="alert alert-danger text-center" role="alert">
            No se pudo cargar la lista de películas. Intenta nuevamente más tarde.
          </div>
        </div>
      `).show();
    }
  });

  // Función que renderiza las películas
  function renderPeliculas(peliculas) {
    if (!peliculas || peliculas.length === 0) {
      $lista.html('<div class="col-12"><p class="text-center">No hay películas disponibles.</p></div>');
      return;
    }

    let html = "";
    const hoy = new Date();

    peliculas.forEach(function (peli) {
      try {
        const estrenoDate = new Date(peli.estreno);
        const diffMs = hoy - estrenoDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let estado = '';
        let precioActual = peli.precios.normal;

        if (isNaN(estrenoDate.getTime())) {
          estado = 'Fecha no disponible';
        } else if (hoy < estrenoDate) {
          estado = 'Próximo estreno';
          precioActual = peli.precios.estreno;
        } else if (diffDays >= 0 && diffDays <= 29) {
          estado = 'Estreno';
          precioActual = peli.precios.estreno;
        } else {
          estado = 'En cartelera regular';
          precioActual = peli.precios.normal;
        }

        const generoHtml = (peli.generos || [])
          .map(g => `<span class="badge bg-secondary me-1">${g}</span>`)
          .join(' ');

        html += `
          <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
              <img src="img/${peli.imagen}" class="card-img-top" alt="${peli.titulo}">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${peli.titulo}</h5>
                <p class="card-text mb-1">${generoHtml}</p>
                <p class="card-text small text-muted mb-2">Precio: $${precioActual.toFixed(2)}</p>
                <div class="mt-auto">
                  <span class="badge ${estado === 'Estreno' || estado === 'Próximo estreno' ? 'bg-danger' : 'bg-success'} mb-2">${estado}</span>
                  <div class="d-flex gap-2">
                    <a href="pages/detalle.html?id=${peli.id}" class="btn btn-primary btn-sm">Ver más</a>
                    <button class="btn btn-outline-secondary btn-sm btn-trailer" data-trailer="${peli.trailer}" data-titulo="${peli.titulo}">Ver tráiler</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      } catch (e) {
        console.error("Error al procesar película:", e);
      }
    });

    $lista.html(html);

    // Evento para mostrar tráiler
    $('.btn-trailer').on('click', function () {
      const trailerUrl = $(this).data('trailer');
      const titulo = $(this).data('titulo') || 'Tráiler';
      $modalTitle.text(titulo);
      let src = trailerUrl;
      if (trailerUrl.includes('youtube.com') && !trailerUrl.includes('autoplay')) {
        src = trailerUrl + (trailerUrl.includes('?') ? '&autoplay=1' : '?autoplay=1');
      }
      $iframe.attr('src', src);
      trailerModal.show();
    });

    $('#trailerModal').on('hidden.bs.modal', function () {
      $iframe.attr('src', '');
    });
  }
});
