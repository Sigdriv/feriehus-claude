const API_BASE = "http://localhost:3000";

function buildPropertyCard(p, index) {
  const label = p.type === "rent" ? "Leie" : "Salg";
  const price =
    p.type === "rent"
      ? `kr ${Number(p.price).toLocaleString("nb-NO")}/natt`
      : `kr ${Number(p.price).toLocaleString("nb-NO")}`;
  const delay = ((index % 6) + 1) * 100;

  return `
    <div class="col-xl-4 col-md-6" data-aos="fade-up" data-aos-delay="${delay}">
      <div class="card h-100">
        <img src="${p.image_url || "assets/img/properties/property-1.jpg"}"
             alt="${p.name}" class="img-fluid"
             style="height:220px;object-fit:cover;">
        <div class="card-body">
          <span class="sale-rent">${label} | ${price}</span>
          <h3>
            <a href="property-single.html?id=${p.id}" class="stretched-link">
              ${p.name}
            </a>
          </h3>
          <p class="text-muted small mb-2">
            <i class="bi bi-geo-alt"></i> ${p.location}
          </p>
          <div class="card-content d-flex flex-column justify-content-center text-center">
            <div class="row propery-info">
              <div class="col">Areal</div>
              <div class="col">Soverom</div>
              <div class="col">Bad</div>
              <div class="col">Garasje</div>
            </div>
            <div class="row">
              <div class="col">${p.area_m2 ?? "–"}m²</div>
              <div class="col">${p.beds ?? "–"}</div>
              <div class="col">${p.baths ?? "–"}</div>
              <div class="col">${p.garages ?? "–"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

async function loadProperties() {
  const grid = document.getElementById("properties-grid");

  const type = document.getElementById("filter-type").value;
  const maxPrice = document.getElementById("filter-max-price").value;

  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (maxPrice) params.set("maxPrice", maxPrice);

  try {
    const res = await fetch(`${API_BASE}/api/properties?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.length === 0) {
      grid.innerHTML =
        '<div class="col-12 text-center py-5 text-muted">Ingen eiendommer funnet.</div>';
      return;
    }

    grid.innerHTML = data.map(buildPropertyCard).join("");

    if (window.AOS) AOS.refresh();
  } catch (err) {
    grid.innerHTML = `<div class="col-12 text-center py-5 text-danger">
      Kunne ikke laste eiendommer. Sjekk at API-serveren kjører.<br>
      <small class="text-muted">${err.message}</small>
    </div>`;
    console.error("API-feil:", err);
  }
}

document.getElementById("filter-btn").addEventListener("click", loadProperties);
loadProperties();
