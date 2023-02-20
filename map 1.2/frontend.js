import { landUnits } from "./landUnit.js";
import * as helpers from "../helpers.js";
import * as stylers from "../styleHelpers.js";
import { worldMap } from "./main.js";
let twoDimArr = worldMap;
let DomGridContainer = document.querySelector("#grid");
let DomGridWidth = DomGridContainer.offsetWidth;
let DomUnitWidth = twoDimArr[0].length;
let selectedCoordinates = [];
//FN CALL
drawMap();
//RESIZE
document.querySelector("#zoom-in").addEventListener("click", function () {
  DomGridWidth += 200;
  DomGridContainer.style.width = DomGridWidth + "px";
  drawMap();
  document.querySelector("body").style.backgroundColor = "#038689";
});
document.querySelector("#zoom-out").addEventListener("click", function () {
  DomGridWidth -= 200;
  DomGridContainer.style.width = DomGridWidth + "px";
  drawMap();
  document.querySelector("body").style.backgroundColor = "#038689";
});
document.querySelector("#reset").addEventListener("click", function () {
  DomGridContainer.style.width = 90 + "vw";
  DomGridWidth = DomGridContainer.offsetWidth;
  drawMap();
  document.querySelector("body").style.backgroundColor = "#166868";
});
document.addEventListener("resize", drawMap()); //TO DO: not working
document.querySelector("body").addEventListener(
  "keypress",
  (event) => {
    switch (event.key) {
      case "1":
        selectedCoordinates.forEach((coordinates) => {
          twoDimArr[coordinates.x][coordinates.y].landType = "Meadows";
          calculateCarbonEmit(
            twoDimArr,
            twoDimArr[coordinates.x][coordinates.y]
          );
        });
        selectedCoordinates = [];
        break;
      case "2":
        selectedCoordinates.forEach((coordinates) => {
          twoDimArr[coordinates.x][coordinates.y].landType = "Cropland";
          calculateCarbonEmit(
            twoDimArr,
            twoDimArr[coordinates.x][coordinates.y]
          );
        });
        selectedCoordinates = [];
        break;
      case "3":
        selectedCoordinates.forEach((coordinates) => {
          twoDimArr[coordinates.x][coordinates.y].landType = "Planted_Forest";
          calculateCarbonEmit(
            twoDimArr,
            twoDimArr[coordinates.x][coordinates.y]
          );
        });
        selectedCoordinates = [];
        break;
      case "4":
        selectedCoordinates.forEach((coordinates) => {
          twoDimArr[coordinates.x][coordinates.y].landType = "Other_land";
          calculateCarbonEmit(
            twoDimArr,
            twoDimArr[coordinates.x][coordinates.y]
          );
        });
        selectedCoordinates = [];
        break;
      case "5":
        selectedCoordinates.forEach((coordinates) => {
          twoDimArr[coordinates.x][coordinates.y].landType = "Urban_land";
          calculateCarbonEmit(
            twoDimArr,
            twoDimArr[coordinates.x][coordinates.y]
          );
        });
        selectedCoordinates = [];

        break;
      case "6":
        selectedCoordinates = [];
        break;
      default:
        break;
    }
    drawMap();
  },
  false
);
//FUNCTIONS
function drawMap() {
  DomGridContainer.replaceChildren();
  twoDimArr.forEach((row, i) => {
    row.forEach((pixel, j) => {
      let value = pixel.landType;
      // sumArray[value] = ++sumArray[value] || 0;
      let gridUnit = document.createElement("div");
      if (value != "Water") {
        gridUnit.classList.add("land");
        gridUnit.addEventListener("mouseover", function () {
          document.querySelector("#hoverText").style.display = "block";
          pixel.hoverInfo(document.querySelector("#hoverText"));
        });
        gridUnit.addEventListener("click", function () {
          select(gridUnit);
          selectedCoordinates.push({
            x: i,
            y: j,
          });
        });
      } else {
        addWaterDepth(gridUnit, i, j);
        gridUnit.addEventListener("mouseover", function () {
          document.querySelector("#hoverText").style.display = "none";
          pixel.hoverInfo(document.querySelector("#hoverText"));
        });
      }
      gridUnit.classList.add("gridUnit", value);
      gridUnit.style.width = DomGridWidth / DomUnitWidth + "px";
      gridUnit.style.height = DomGridWidth / DomUnitWidth + "px";

      DomGridContainer.append(gridUnit);
    });
  });
}
function select(pixel) {
  pixel.classList.add("clicked");
}
function calculateCarbonEmit(arr, clicked) {
  let sumCarbon = 0;
  arr.forEach((row) => {
    row.forEach((value) => {
      let C = parseInt(value.carbonEmited);
      sumCarbon += C;
      value.carbonEmited = C++;
    });
  });
  document.querySelector("#carbonText").innerHTML =
    "TOTAL CARBON EMITTED: " + sumCarbon;
}
function addWaterDepth(domEl, i, j) {
  let directionArr = helpers.returnAll4Adjacent(twoDimArr, i, j, "Water");
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
// calculateCarbonEmit(twoDimArr);
// console.log(twoDimArr);
