//GENERAL FUNCTIONS
import { landUnits } from "./landUnit.js";
import * as helpers from "./helpers.js";
import * as stylers from "./styleHelpers.js";

let DomGridContainer = document.querySelector("#grid");
let DomGridWidth = DomGridContainer.offsetWidth;
let DomUnitWidth;
let selectedCoordinates = [];

// CLIENT SHIT
const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("data", (data) => {
  DomUnitWidth = data[0].length;
  drawMap(data);
});

//FUNCTIONS
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
        gridUnit.classList.add("land");
        gridUnit.addEventListener("mouseover", function () {
          document.querySelector("#hoverText").style.display = "block";
          hoverInfo(document.querySelector("#hoverText", pixel));
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
          document.querySelector("#hoverText").style.display = "none";
          hoverInfo(document.querySelector("#hoverText", pixel.landType));
        });
      }
      gridUnit.classList.add("gridUnit", value);
      gridUnit.style.width = DomGridWidth / DomUnitWidth + "px";
      gridUnit.style.height = DomGridWidth / DomUnitWidth + "px";

      DomGridContainer.append(gridUnit);
    });
  });
}
function hoverInfo(domElement, landType) {
  domElement.innerHTML =
    // "Continent: " +
    // obj.continent +
    // "<br>" +
    "Land type: " + landType;
  // "<br>" +
  // "Carbon emitted: " +
  // obj.carbonEmited +
  // "<br>";
  // if (this.biostock != 0) {
  //   domElement.innerHTML += "Carbon stock: " + this.biostock;
  // }
  domElement.style.top = Event.clientY + 10 + "px";
  domElement.style.left = Event.clientX + 10 + "px";
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
// calculateCarbonEmit(twoDimArr); //twoDimArr does not exist here
// console.log(twoDimArr); //twoDimArr does not exist here
//RESIZE
// document.querySelector("#zoom-in").addEventListener("click", function () {
//   DomGridWidth += 200;
//   DomGridContainer.style.width = DomGridWidth + "px";
//   drawMap();
//   document.querySelector("body").style.backgroundColor = "#038689";
// });
// document.querySelector("#zoom-out").addEventListener("click", function () {
//   DomGridWidth -= 200;
//   DomGridContainer.style.width = DomGridWidth + "px";
//   drawMap();
//   document.querySelector("body").style.backgroundColor = "#038689";
// });
// document.querySelector("#reset").addEventListener("click", function () {
//   DomGridContainer.style.width = 90 + "vw";
//   DomGridWidth = DomGridContainer.offsetWidth;
//   drawMap();
//   document.querySelector("body").style.backgroundColor = "#166868";
// });
// document.addEventListener("resize", drawMap()); //TO DO: not working
// document.querySelector("body").addEventListener(
//   "keypress",
//   (event) => {
//     switch (event.key) {
//       case "1":
//         selectedCoordinates.forEach((coordinates) => {
//           twoDimArr[coordinates.x][coordinates.y].landType = "Meadows"; //twoDimArr does not exist here
//           calculateCarbonEmit(
//             twoDimArr, //twoDimArr does not exist here
//             twoDimArr[coordinates.x][coordinates.y] //twoDimArr does not exist here
//           );
//         });
//         selectedCoordinates = [];
//         break;
//       case "2":
//         selectedCoordinates.forEach((coordinates) => {
//           twoDimArr[coordinates.x][coordinates.y].landType = "Cropland";
//           calculateCarbonEmit(
//             twoDimArr,
//             twoDimArr[coordinates.x][coordinates.y]
//           );
//         });
//         selectedCoordinates = [];
//         break;
//       case "3":
//         selectedCoordinates.forEach((coordinates) => {
//           twoDimArr[coordinates.x][coordinates.y].landType = "Planted_Forest";
//           calculateCarbonEmit(
//             twoDimArr,
//             twoDimArr[coordinates.x][coordinates.y]
//           );
//         });
//         selectedCoordinates = [];
//         break;
//       case "4":
//         selectedCoordinates.forEach((coordinates) => {
//           twoDimArr[coordinates.x][coordinates.y].landType = "Other_land";
//           calculateCarbonEmit(
//             twoDimArr,
//             twoDimArr[coordinates.x][coordinates.y]
//           );
//         });
//         selectedCoordinates = [];
//         break;
//       case "5":
//         selectedCoordinates.forEach((coordinates) => {
//           twoDimArr[coordinates.x][coordinates.y].landType = "Urban_land";
//           calculateCarbonEmit(
//             twoDimArr,
//             twoDimArr[coordinates.x][coordinates.y]
//           );
//         });
//         selectedCoordinates = [];

//         break;
//       case "6":
//         selectedCoordinates = [];
//         break;
//       default:
//         break;
//     }
//     drawMap();
//   },
//   false
// );
