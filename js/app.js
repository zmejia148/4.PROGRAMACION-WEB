$(document).ready(function () {
  const $loader = $('#loader');
  const $lista = $('#lista-peliculas');
  const trailerModal = new bootstrap.Modal(document.getElementById('trailerModal'));
  const $iframe = $('#modalTrailerIframe');
  const $modalTitle = $('#trailerModalTitle');

  // Mostrar loader y simular retraso de 5 segundos
  $lista.hide();
  $loader.show();

  // Carga AJAX con retraso artificial (5s)
  $.ajax({
    url: "data/peliculas.json",
    method: "GET",
    dataType: "json",
    success: function (peliculas) {
      // Simulamos 5s de retraso antes de renderizar
      setTimeout(() => {
        renderPeliculas(peliculas);
        $loader.fadeOut(300, function() {
          $lista.find('.card').each(function (i) {
          $(this).delay(150 * i).queue(function (next) {
            $(this).addClass('mostrada');
            next();
          });
        });
        });
      }, 5000);
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

  function renderPeliculas(peliculas) {
    let html = "";
    const hoy = new Date();

    peliculas.forEach(function (peli) {
      // Parsear fecha de estreno
      const estrenoDate = new Date(peli.estreno);
      const diffMs = hoy - estrenoDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Lógica de estado/price:
      // Si hoy < estrenoDate => "Próximo estreno" (precio estreno)
      // Si 0 <= diffDays <= 29 => "Estreno" (precio estreno)
      // Si diffDays > 29 => "En cartelera regular" (precio normal)
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

      // Generar etiquetas de géneros
      const generoHtml = (peli.generos || []).map(g => `<span class="badge bg-secondary me-1">${g}</span>`).join(' ');

      html += `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
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
    });

    $lista.html(html);

    // Handler para botones de tráiler (abrir modal y cargar iframe)
    $('.btn-trailer').on('click', function () {
      const trailerUrl = $(this).data('trailer');
      const titulo = $(this).data('titulo') || 'Tráiler';
      $modalTitle.text(titulo);
      // Usar parámetro ?autoplay=1 solo si es youtube embebido
      let src = trailerUrl;
      if (trailerUrl.includes('youtube.com') && !trailerUrl.includes('autoplay')) {
        src = trailerUrl + (trailerUrl.includes('?') ? '&autoplay=1' : '?autoplay=1');
      }
      $iframe.attr('src', src);
      trailerModal.show();
    });

    // Limpiar iframe cuando se cierra el modal (para detener autoplay)
    $('#trailerModal').on('hidden.bs.modal', function () {
      $iframe.attr('src', '');
    });
  }
});
