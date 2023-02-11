import { worldMap } from "./main.js";
let twoDimArr = worldMap;
let domGridContainer = document.querySelector("#grid");
let domGridWidth = domGridContainer.offsetWidth;
let sumArray = {
  Asia: 0,
  Europe: 0,
  SouthAmerica: 0,
  Africa: 0,
  NorthAmerica: 0,
  Oceania: 0,
  Antarctica: 0,
  Ocean: 0,
};
twoDimArr.forEach((row) => {
  row.forEach((value) => {
    sumArray[value] = ++sumArray[value] || 0;
    let gridUnit = document.createElement("div");
    if (value != "ocean") gridUnit.innerHTML = sumArray[value];
    gridUnit.classList.add("gridUnit");
    switch (value) {
      case 0:
        gridUnit.classList.add("ocean");
        break;
      default:
        gridUnit.classList.add(value);
        break;
    }
    gridUnit.style.width = domGridWidth / twoDimArr[0].length + "px";
    gridUnit.style.height = domGridWidth / twoDimArr[0].length + "px";
    domGridContainer.append(gridUnit);
  });
});
