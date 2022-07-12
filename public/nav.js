const menu = document.querySelector(".menu");
const toggle = document.querySelector(".toggle");

// toggle menu for mobile view
function toggleMenu() {
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");

    // add menu (hamburger) icon
    toggle.querySelector("a").innerHTML = "<i class='fas fa-bars'></i>";
  } else {
    menu.classList.add("active");

    // add menu close (x) icon
    toggle.querySelector("a").innerHTML = "<i class='fas fa-times'></i>";
  }
}

// add event listener to toggle
toggle.addEventListener("click", toggleMenu);
