const API_BASE = "http://localhost:3000";

async function loadProperty() {
  const id = new URLSearchParams(window.location.search).get("id");
  const detail = document.getElementById("property-detail");

  if (!id) {
    detail.innerHTML =
      '<p class="text-danger text-center py-5">Ingen eiendoms-ID oppgitt i URL.</p>';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/properties/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const p = await res.json();

    const label = p.type === "rent" ? "Til leie" : "Til salgs";
    const price =
      p.type === "rent"
        ? `kr ${Number(p.price).toLocaleString("nb-NO")}/natt`
        : `kr ${Number(p.price).toLocaleString("nb-NO")}`;

    const slideImages =
      p.images && p.images.length
        ? p.images
        : [p.image_url || "assets/img/property-slide/property-slide-1.jpg"];

    const slides = slideImages
      .map(
        (url) =>
          `<div class="swiper-slide"><img src="${url}" alt="${p.name}"></div>`,
      )
      .join("");

    detail.innerHTML = `
      <div class="portfolio-details-slider swiper init-swiper">
        <script type="application/json" class="swiper-config">
          {"loop":true,"speed":600,"autoplay":{"delay":5000},"slidesPerView":"auto",
           "navigation":{"nextEl":".swiper-button-next","prevEl":".swiper-button-prev"},
           "pagination":{"el":".swiper-pagination","type":"bullets","clickable":true}}
        <\/script>
        <div class="swiper-wrapper align-items-center">${slides}</div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
      </div>

      <div class="row justify-content-between gy-4 mt-4">

        <div class="col-lg-8">
          <div class="portfolio-description">
            <h2>${p.name}</h2>
            <p class="text-muted"><i class="bi bi-geo-alt"></i> ${p.location}</p>
            <p>${p.description || ""}</p>
          </div>

          <ul class="nav nav-pills mb-3">
            <li><a class="nav-link active" data-bs-toggle="pill" href="#tab-location">Kart</a></li>
            <li><a class="nav-link" data-bs-toggle="pill" href="#tab-plan">Plantegning</a></li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade show active" id="tab-location">
              <p class="text-muted">(Kart lastes inn her via Google Maps / Kartverket API)</p>
            </div>
            <div class="tab-pane fade" id="tab-plan">
              <img src="assets/img/floor-plan.jpg" alt="Plantegning" class="img-fluid">
            </div>
          </div>
        </div>

        <div class="col-lg-3">
          <div class="portfolio-info">
            <h3>Sammendrag</h3>
            <ul>
              <li><strong>ID:</strong> ${p.id}</li>
              <li><strong>Sted:</strong> ${p.location}</li>
              <li><strong>Status:</strong> ${label}</li>
              <li><strong>Pris:</strong> ${price}</li>
              <li><strong>Areal:</strong> ${p.area_m2 ?? "–"} m²</li>
              <li><strong>Soverom:</strong> ${p.beds ?? "–"}</li>
              <li><strong>Bad:</strong> ${p.baths ?? "–"}</li>
              <li><strong>Garasje:</strong> ${p.garages ?? "–"}</li>
            </ul>
            <a href="contact.html" class="btn btn-primary w-100 mt-3">Ta kontakt</a>
          </div>
        </div>

      </div>`;

    if (window.Swiper) {
      document.querySelectorAll(".swiper.init-swiper").forEach((el) => {
        const cfg = JSON.parse(el.querySelector(".swiper-config").textContent);
        new Swiper(el, cfg);
      });
    }
  } catch (err) {
    detail.innerHTML = `<p class="text-danger text-center py-5">
      Kunne ikke laste eiendom.<br><small>${err.message}</small>
    </p>`;
    console.error("API-feil:", err);
  }
}

loadProperty();
