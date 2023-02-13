import * as helpers from "../helpers.js";
import { COLUMN_TOTAL, ROW_TOTAL, countriesSizeArr } from "../landuseCalc.js";
const DIRECTIONS_ARR = ["top", "right", "bottom", "left"];
const ISLAND_COUNT = 5;
const DEFAULT_VALUE = "ocean";
const SIZE = [
  { country: "Asia", countryArea: 31 },
  { country: "Europe", countryArea: 22 },
  { country: "Americas", countryArea: 39 },
  { country: "Africa", countryArea: 29 },
  { country: "Oceania", countryArea: 8 },
];
let islandSizeArr = [...Array(ISLAND_COUNT)].map((x, i) => SIZE[i]);
let testMap = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];
let calls = 0;
class landUnits {
  constructor(continent, landType, biostock = 0) {
    this.continent = continent;
    this.landType = landType;
    this.biostock = biostock;
  }
  displayColor(domElement) {
    domElement.classList.add(this.landType);
  }
}

export let worldMap = helpers.createAndFillTwoDArray({
  rows: ROW_TOTAL,
  columns: COLUMN_TOTAL,
  defaultValue: DEFAULT_VALUE,
});

countriesSizeArr.forEach((islandInfo) => {
  // let landTypeCount = islandInfo.subplots;
  let tempIslandArr = startAnIsland(worldMap);
  if (tempIslandArr) {
    let index = 0;
    let adjacent;
    while (tempIslandArr.length < islandInfo.subplots["Land area"]) {
      let centerLoc = tempIslandArr[index];
      let nextLoc = centerLoc;
      DIRECTIONS_ARR.forEach((direction) => {
        // console.log(tempIslandArr);
        nextLoc = helpers.valueDependentMovementTwoDArray({
          array: worldMap,
          xpos: centerLoc.x,
          ypos: centerLoc.y,
          direction: direction,
          values: [DEFAULT_VALUE],
          randomness: 0.2, //value should be < than randomness
        });
        if (nextLoc) {
          adjacent = helpers.checkAll8Adjacent(worldMap, nextLoc.x, nextLoc.y, [
            DEFAULT_VALUE,
            islandInfo.country,
          ]);
        }

        if (
          nextLoc &&
          // adjacent &&
          tempIslandArr.length < islandInfo.subplots["Land area"]
        ) {
          let tempLandtype = pickLandType(islandInfo.subplots);
          if (tempLandtype) worldMap[nextLoc.x][nextLoc.y] = tempLandtype;
          else worldMap[nextLoc.x][nextLoc.y] = "Cropland";
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
      calls += 1;
      if (calls > 100) {
        // debugger;
      }
    }
  }
});
function startAnIsland(array) {
  let startPt = helpers.randomIndexForValue(array, DEFAULT_VALUE); //array + value
  //   console.log(startPt);
  if (startPt != false) {
    let tempArr = [];
    // array[startPt.x][startPt.y] = value;
    tempArr.push({
      x: startPt.x,
      y: startPt.y,
    });
    return tempArr;
  } else return false;
}
function pickLandType(obj) {
  let keys = Object.keys(obj).filter(
    (key) =>
      obj[key] !== 0 &&
      (key == "Meadows" ||
        key == "Cropland" ||
        key == "Surface" ||
        key == "Planted Forest" ||
        key == "Naturally regenerating forest" ||
        key == "Other land")
  );
  let randomIndex = Math.floor(Math.random() * keys.length);
  if (randomIndex) {
    let selectedKey = keys[randomIndex];
    obj[selectedKey]--;
    selectedKey = selectedKey.replaceAll(" ", "_");
    console.log(selectedKey);
    return selectedKey;
  }
}
console.log(worldMap);
