export class landUnits {
  constructor(continent, landType, coordinates, biostock = 0) {
    this.continent = continent;
    this.landType = landType;
    this.biostock = biostock;
    this.coordinates = coordinates;
    if (this.landType == "Naturally_regenerating_forest") {
      this.biostock = helpers.randomNumber(1, 12);
    }
    if (this.landType == "Planted_Forest") {
      this.biostock = helpers.randomNumber(1, 6);
    }
    if (this.landType == "Other_land") {
      this.biostock = helpers.randomNumber(1, 6);
    }
    this.carbonEmited = this.carbonEmitCalc(this.landType);
  }
  renameLandTypes(type) {
    switch (type) {
      case "Naturally_regenerating_forest":
        return "Primary forest";
        break;
      case "Planted_Forest":
        return "Baby forest";
        break;
      case "Meadows":
        return "Meadows";
        break;
      case "Cropland":
        return "Farms";
        break;
      case "Other_land":
        return "Barren land";
        break;
      case "Urban_land":
        return "Cities";
        break;
      default:
        break;
    }
  }
  carbonEmitCalc(type) {
    switch (type) {
      case "Naturally_regenerating_forest":
        return this.biostock;
        break;
      case "Planted_Forest":
        return this.biostock;
        break;
      case "Meadows":
        return 20;
        break;
      case "Cropland":
        return 10;
        break;
      case "Other_land":
        return this.biostock;
        break;
      case "Urban_land":
        return 20;
        break;
      case "Water":
        return 0;
        break;
      default:
        break;
    }
  }
  hoverInfo(domElement) {
    domElement.innerHTML =
      "Land type: " +
      this.renameLandTypes(this.landType) +
      "<br>" +
      "Carbon emitted: " +
      this.carbonEmited +
      "<br>";
    // if (this.biostock != 0) {
    //   domElement.innerHTML += "Carbon stock: " + this.biostock;
    // }
    domElement.style.top = event.clientY + 10 + "px";
    domElement.style.left = event.clientX + 10 + "px";
  }
  carbonVal() {
    return this.carbonEmited;
  }
}
import * as helpers from "../helpers.js";
import { COLUMN_TOTAL, ROW_TOTAL, countriesSizeArr } from "./landuseCalc.js";
const DIRECTIONS_ARR = ["top", "right", "bottom", "left"];
const DEFAULT_VALUE = new landUnits("Ocean", "Water");
const sizeLandTypeArr = countriesSizeArr;
let calls = 0;
export let worldMap = helpers.createAndFillTwoDArray({
  rows: ROW_TOTAL,
  columns: COLUMN_TOTAL,
  defaultValue: DEFAULT_VALUE,
});

//FUNCTIONS
// console.log(worldMap);
sizeLandTypeArr.forEach((islandInfo) => {
  let tempIslandArr = startAnIsland(worldMap);
  if (tempIslandArr) {
    let index = 0;
    let adjacent;
    while (tempIslandArr.length < islandInfo.subplots["Land area"]) {
      let centerLoc = tempIslandArr[index];
      let nextLoc = centerLoc;
      DIRECTIONS_ARR.forEach((direction) => {
        nextLoc = helpers.valueDependentMovementTwoDArray({
          array: worldMap,
          xpos: centerLoc.x,
          ypos: centerLoc.y,
          direction: direction,
          values: "Ocean",
          randomness: 0.4, //value should be < than randomness
        });
        if (nextLoc) {
          adjacent = helpers.checkAll8Adjacent(worldMap, nextLoc.x, nextLoc.y, [
            DEFAULT_VALUE.continent,
            islandInfo.country, //THIS IS NOT WORKING
          ]);
        }

        if (
          nextLoc &&
          adjacent &&
          tempIslandArr.length < islandInfo.subplots["Land area"]
        ) {
          let tempLandtype = pickLandType(
            islandInfo.subplots,
            worldMap[centerLoc.x][centerLoc.y].landType
          );
          if (tempLandtype)
            worldMap[nextLoc.x][nextLoc.y] = new landUnits(
              islandInfo.country,
              tempLandtype,
              { x: nextLoc.x, y: nextLoc.y }
            );
          // else worldMap[nextLoc.x][nextLoc.y] = "other"; //CHECK: if you see red on the screen something has gone wrong and is calling this
          tempIslandArr.push({
            x: nextLoc.x,
            y: nextLoc.y,
          });
        }
      });
      if (
        nextLoc == centerLoc &&
        tempIslandArr.length < islandInfo.subplots["Land area"]
      ) {
        tempIslandArr = startAnIsland(worldMap);
        index = 0;
      }
      index++;
    }
  }
});
function startAnIsland(array) {
  let startPt = helpers.randomIndexForValue(array, DEFAULT_VALUE); //array + value
  if (startPt != false) {
    let tempArr = [];
    tempArr.push({
      x: startPt.x,
      y: startPt.y,
    });
    // console.log(startPt);
    return tempArr;
  } else return false;
}
function pickLandType(obj, centralLand) {
  centralLand = centralLand.replaceAll("_", " ");
  let keys = Object.keys(obj).filter(
    (key) =>
      obj[key] != 0 &&
      (key == "Meadows" ||
        key == "Cropland" ||
        key == "Surface" ||
        key == "Planted Forest" ||
        key == "Naturally regenerating forest" ||
        key == "Other land")
  );
  if (keys.length > 0) {
    let randomIndex;
    if (keys.includes(centralLand) && Math.random > 1) {
      randomIndex = centralLand;
    } else {
      randomIndex = Math.floor(Math.random() * keys.length);
    }
    let selectedKey = keys[randomIndex];
    obj[selectedKey]--;
    selectedKey = selectedKey.replaceAll(" ", "_");
    if (selectedKey == "Other_land" && Math.random() > 0.8) {
      return "Urban_land";
    } else {
      return selectedKey;
    }
  } else return "Cropland"; //TO DO: oceeania math is incorrect, 4 pixels end up undefined
}
// console.log(JSON.stringify(countriesSizeArr[0]));
