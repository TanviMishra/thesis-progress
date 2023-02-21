//GENERAL FUNCTIONS
import * as helpers from "./helpers.js";
import * as stylers from "./styleHelpers.js";
import * as frontend from "./frontendFns.js";

let DomGridContainer = document.querySelector("#grid");
let DomGridWidth = DomGridContainer.offsetWidth;
let DomUnitWidth;
let selectedCoordinates = [];
let localMap = {};
// CLIENT SHIT
const socket = io();
socket.on("connect", () => {
  console.log(`${socket.id} Connected to server`);
});
socket.on("start", (data) => {
  localMap = JSON.parse(JSON.stringify(data));
  DomUnitWidth = localMap[0].length;
  drawMap(localMap);
  addEventListeners();
});
socket.on("mapChange", (data) => {
  localMap = JSON.parse(JSON.stringify(data));
  drawMap(localMap);
  addEventListeners();
});
//FUNCTIONSc
stylers.applyStyle(document.querySelector("#hoverText"), "display", "none");
function drawMap(arr) {
  if (!arr) {
    console.log("Error: array is not defined");
    return;
  }
  DomGridContainer.replaceChildren();
  arr.forEach((row, i) => {
    row.forEach((pixel, j) => {
      let value = pixel.landType;
      // sumArray[value] = ++sumArray[value] || 0;
      let gridUnit = document.createElement("div");
      if (value != "Water") {
        gridUnit.classList.add("Land");
        gridUnit.addEventListener("mouseover", function () {
          hoverInfo(document.querySelector("#hoverText"), pixel);
        });
        gridUnit.addEventListener("click", function () {
          select(gridUnit);
          selectedCoordinates.push({
            x: i,
            y: j,
          });
        });
      } else {
        addWaterDepth(gridUnit, arr, i, j);
        gridUnit.addEventListener("mouseover", function () {
          hoverInfo(document.querySelector("#hoverText"), pixel, "none");
        });
      }
      gridUnit.classList.add("gridUnit", value);
      gridUnit.style.width = DomGridWidth / DomUnitWidth + "px";
      gridUnit.style.height = DomGridWidth / DomUnitWidth + "px";

      DomGridContainer.append(gridUnit);
    });
  });
}
function hoverInfo(domElement, data, display = "block") {
  stylers.applyStyle(domElement, "top", event.clientY + 10, "px");
  stylers.applyStyle(domElement, "left", event.clientX + 10, "px");
  stylers.applyStyle(domElement, "display", display);
  display = "block"
    ? (domElement.innerHTML = `land: ${data.continent} <br>
    land-type: ${frontend.replace_(data.landType)} <br>
    carbon: 20`)
    : (domElement.innerHTML = "");
}
function select(pixel) {
  pixel.classList.add("clicked");
}
function addWaterDepth(domEl, arr, i, j) {
  let directionArr = helpers.returnAll4Adjacent(arr, i, j, "Water");
  if (directionArr.includes("up")) {
    domEl.classList.add("upClass");
    stylers.applyStyle(
      domEl,
      "border-top-width",
      (0.6 * DomGridWidth) / DomUnitWidth,
      "px"
    );
  }
  if (directionArr.includes("left")) {
    domEl.classList.add("leftClass");
    stylers.applyStyle(
      domEl,
      "border-left-width",
      (0.6 * DomGridWidth) / DomUnitWidth,
      "px"
    );
  }
}

//SOCKET EMIT FNS
document.querySelector("#start").addEventListener("click", () => {
  socket.emit("start");
});
function addEventListeners() {
  document.querySelector("body").addEventListener(
    "keypress",
    (event) => {
      switch (event.key) {
        case "1":
          selectedCoordinates.forEach((coordinates) => {
            localMap[coordinates.x][coordinates.y].landType = "Meadows";
            socket.emit("mapChange", localMap);
          });
          selectedCoordinates = [];
          break;
      }
    },
    false
  );
}
