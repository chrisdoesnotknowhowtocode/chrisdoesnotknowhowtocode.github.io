const form = document.getElementById("search-form");
const input = document.getElementById("country-input");
const searchButton = document.getElementById("search-button");
const message = document.getElementById("message");
const details = document.getElementById("country-details");
const mapPanel = document.getElementById("map-panel");

let map;
let marker;

function showMessage(text, colour) {
  message.textContent = text;
  message.className = "mb-3 text-" + colour;
}

function addDetail(label, value) {
  const paragraph = document.createElement("p");
  const heading = document.createElement("strong");

  heading.textContent = label + ": ";
  paragraph.appendChild(heading);
  paragraph.appendChild(document.createTextNode(value));

  details.appendChild(paragraph);
}

function showCountry(country) {
  details.textContent = "";

  const heading = document.createElement("h2");
  heading.textContent = country.name;
  details.appendChild(heading);

  const flag = document.createElement("img");
  flag.src = country.flags.png;
  flag.alt = "Flag of " + country.name;
  details.appendChild(flag);

  const languages = country.languages
    .map(language => language.name)
    .join(", ");

  const currencies = country.currencies
    .map(currency => currency.name)
    .join(", ");

  addDetail("Capital", country.capital || "Not available");
  addDetail("Region", country.region || "Not available");
  addDetail("Population", Number(country.population).toLocaleString());
  addDetail("Area", Number(country.area).toLocaleString() + " km²");
  addDetail("Languages", languages || "Not available");
  addDetail("Currencies", currencies || "Not available");

  details.hidden = false;
}

function showMap(country) {
  mapPanel.hidden = false;

  if (!map) {
    map = L.map("map");

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  }

  map.invalidateSize();
  map.setView(country.latlng, 4);

  if (marker) {
    marker.setLatLng(country.latlng);
  } else {
    marker = L.marker(country.latlng).addTo(map);
  }
}

async function searchCountry(event) {
  event.preventDefault();

  const name = input.value.trim();

  details.textContent = "";
  details.hidden = true;
  mapPanel.hidden = true;

  if (name === "") {
    showMessage("Please enter a country name.", "danger");
    return;
  }

  showMessage("Loading country details...", "primary");
  searchButton.disabled = true;
  input.disabled = true;

  try {
    const url =
      "https://countries.dev/name/" + encodeURIComponent(name);

    const response = await fetch(url);

    if (response.status === 404) {
      showMessage(
        "No matching country found. Check the spelling and try again.",
        "danger"
      );
      return;
    }

    if (!response.ok) {
      throw new Error("Country request failed.");
    }

    const countries = await response.json();

    if (countries.length === 0) {
      showMessage(
        "No matching country found. Try another name.",
        "danger"
      );
      return;
    }

    const country = countries[0];

    showCountry(country);
    showMap(country);

    showMessage("Showing " + country.name + ".", "success");
  } catch (error) {
    details.hidden = true;
    mapPanel.hidden = true;

    showMessage(
      "Could not load the country. Check your internet connection and try again.",
      "danger"
    );
  } finally {
    searchButton.disabled = false;
    input.disabled = false;
  }
}

form.addEventListener("submit", searchCountry);