import { worldMap } from "./main.js";
import { landUnits } from "./landUnit.js";
import * as helpers from "../helpers.js";
let twoDimArr = worldMap;
let domGridContainer = document.querySelector("#grid");
let domGridWidth = domGridContainer.offsetWidth;
let selectedCoordinates = [];
resizeArr();
document.addEventListener("resize", resizeArr()); //TO DO: not working
document.querySelector("#zoom-in").addEventListener("click", function () {
  domGridWidth += 200;
  domGridContainer.style.width = domGridWidth + "px";
  resizeArr();
  document.querySelector("body").style.backgroundColor = "#038689";
});
document.querySelector("#zoom-out").addEventListener("click", function () {
  domGridWidth -= 200;
  domGridContainer.style.width = domGridWidth + "px";
  resizeArr();
  document.querySelector("body").style.backgroundColor = "#038689";
});
document.querySelector("#reset").addEventListener("click", function () {
  domGridContainer.style.width = 90 + "vw";
  domGridWidth = domGridContainer.offsetWidth;
  resizeArr();
  document.querySelector("body").style.backgroundColor = "#166868";
});
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
    resizeArr();
  },
  false
);
function resizeArr() {
  domGridContainer.replaceChildren();
  twoDimArr.forEach((row) => {
    row.forEach((pixel) => {
      let value = pixel.landType;
      // sumArray[value] = ++sumArray[value] || 0;
      let gridUnit = document.createElement("div");
      if (value != "Water") {
        gridUnit.classList.add("land");
        // gridUnit.classList.add("top");
        gridUnit.addEventListener("mouseover", function () {
          document.querySelector("#hoverText").style.display = "block";
          pixel.hoverInfo(document.querySelector("#hoverText"));
        });
        gridUnit.addEventListener("click", function () {
          select(gridUnit);
          selectedCoordinates.push({
            x: pixel.coordinates.x,
            y: pixel.coordinates.y,
          });
        });
      } else {
        // if()
        gridUnit.addEventListener("mouseover", function () {
          document.querySelector("#hoverText").style.display = "none";
          pixel.hoverInfo(document.querySelector("#hoverText"));
        });
      }
      gridUnit.classList.add("gridUnit", value);
      gridUnit.style.width = domGridWidth / twoDimArr[0].length + "px";
      gridUnit.style.height = domGridWidth / twoDimArr[0].length + "px";

      domGridContainer.append(gridUnit);
    });
  });
}
function select(pixel) {
  pixel.classList.add("clicked");
}
// function deselect() {
//   var clickedDivs = document.getElementsByClassName("clicked");
//   while (clickedDivs.length > 0) {
//     clickedDivs[0].classList.remove("clicked");
//   }
// }
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
calculateCarbonEmit(twoDimArr);
let DOMgrid = document.querySelector("#grid");
let DomArr = [...DOMgrid.querySelectorAll("div")];
for (let i = 0; i < twoDimArr.length; i++) {
  //TO DO: add coordinates to original oceans
  for (let j = 0; j < twoDimArr[i].length; j++) {
    let directionArr = helpers.returnAll4Adjacent(twoDimArr, i, j, "Water");
    if (twoDimArr[i][j].landType == "Water") {
      if (directionArr.includes("up")) {
        DomArr[i * twoDimArr[0].length + j].classList.add("up");
      }
      // if (directionArr.includes("bottom")) {
      //   DomArr[i * twoDimArr[0].length + j].classList.add("bottom");
      // }
      if (directionArr.includes("left")) {
        DomArr[i * twoDimArr[0].length + j].classList.add("left");
      }
      // if (directionArr.includes("right")) {
      //   DomArr[i * twoDimArr[0].length + j].classList.add("right");
      // }
    }
  }
}
// console.log(twoDimArr);
