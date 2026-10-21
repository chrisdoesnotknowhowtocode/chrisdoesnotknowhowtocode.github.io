const button = document.getElementById("project-button");
const details = document.getElementById("project-details");

let detailsVisible = false;

button.addEventListener("click", function () {
  detailsVisible = !detailsVisible;

  details.hidden = !detailsVisible;
  button.setAttribute("aria-expanded", detailsVisible);

  if (detailsVisible) {
    button.textContent = "Hide project details";
  } else {
    button.textContent = "Show project details";
  }
});