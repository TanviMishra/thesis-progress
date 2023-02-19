//GLOBAL VARIABLES
import { landUnits } from "./landUnit.js";
import * as helpers from "../helpers.js";
import { COLUMN_TOTAL, ROW_TOTAL, countriesSizeArr } from "./landuseCalc.js";
const DIRECTIONS_ARR = ["top", "right", "bottom", "left"];
const DEFAULT_VALUE = new landUnits("Ocean", "Water");
let index, setRandom;
export let worldMap = helpers.createAndFillTwoDArray({
  rows: ROW_TOTAL,
  columns: COLUMN_TOTAL,
  defaultValue: DEFAULT_VALUE,
});
let calls = 0;
//FUNCTION CALLS
console.log(countriesSizeArr);
drawIsland();
console.log("THE END");

//FUNCTIONS
function drawIsland() {
  index = 0;
  setRandom = 0.5; //Change to 0.5 to see the error at higher frequency
  while (index <= countriesSizeArr.length - 1) {
    calls = 0;
    //index will go from 0-4 //countriesSizeArr.length=5
    console.log("while 1 ", index);
    let tempIslandArr;
    let tempStart;
    const islandInfo = countriesSizeArr[index];
    tempStart = startAnIsland(worldMap);
    while (tempStart == -1) {
      console.log("while 2 ", tempStart);
      recalibrate();
      index = 0;
      tempStart = startAnIsland(worldMap);
    }
    tempIslandArr = tempStart;
    let centerIndex = 0;
    // if (tempIslandArr[centerIndex]) {
    problemchild: while (
      tempIslandArr.length <=
      islandInfo.subplots["Land area"] - 1
    ) {
      calls++;
      if (calls > 1000) {
        console.log("STUCK IN LOOP", "array is", tempIslandArr);
        break;
      }
      let centerLoc = tempIslandArr[centerIndex];
      // let nextLoc = centerLoc;
      DIRECTIONS_ARR.forEach((direction) => {
        let randomChange;
        if (
          direction ==
          DIRECTIONS_ARR[helpers.randomNumber(0, DIRECTIONS_ARR.length)]
        ) {
          randomChange = 0;
        } else randomChange = setRandom;
        let nextLoc = helpers.valueDependentMovementTwoDArray({
          array: worldMap,
          xpos: centerLoc.x, //ERROR
          ypos: centerLoc.y,
          direction: direction,
          values: DEFAULT_VALUE.continent,
          randomness: randomChange, //value should be < than randomness
        });
        // console.log(nextLoc);
        if (
          nextLoc && //nextLoc should always be true, this should be redundant
          tempIslandArr.length <= islandInfo.subplots["Land area"] - 1
        ) {
          // console.log(
          //   nextLoc,
          //   "land type is",
          //   worldMap[nextLoc.x][nextLoc.y].landType
          // );
          if (
            helpers.checkAll8Adjacent(worldMap, nextLoc.x, nextLoc.y, [
              DEFAULT_VALUE.continent,
              islandInfo.continent,
            ]) //CHECK THAT NO OTHER ISLAND IS ADJACENT
          ) {
            let tempLandtype = pickLandType(
              islandInfo.subplots,
              worldMap[centerLoc.x][centerLoc.y].landType
            );
            worldMap[nextLoc.x][nextLoc.y] = new landUnits(
              islandInfo.continent,
              tempLandtype
              // { x: nextLoc.x, y: nextLoc.y }
            ); // else worldMap[nextLoc.x][nextLoc.y] = "other"; //CHECK: if you see red on the screen something has gone wrong and is calling this
            tempIslandArr.push({
              x: nextLoc.x,
              y: nextLoc.y,
            });
          } else {
            console.log("no space");
            console.log(
              nextLoc,
              "land type is",
              worldMap[nextLoc.x][nextLoc.y].landType,
              "array is",
              tempIslandArr
            );
          }
        }
      });
      if (centerIndex < tempIslandArr.length - 1) {
        centerIndex++;
      }
    }
    index++;
  }
  // else {
  //   recalibrate(); //HARD REDRAW / RESET
  //   drawIsland(); //calling same fn
  // }
  // }
}
function startAnIsland(array) {
  let startPt = helpers.randomIndexForValue(array, DEFAULT_VALUE); //array + value
  if (startPt.x) return [{ x: startPt.x, y: startPt.y }];
  else {
    console.log("CANT FIND START");
    // recalibrate();
    // drawIsland();
    return -1;
  }
}
function recalibrate() {
  console.log("trying another attempt");
  setRandom -= 0.1;
  worldMap = helpers.createAndFillTwoDArray({
    rows: ROW_TOTAL,
    columns: COLUMN_TOTAL,
    defaultValue: DEFAULT_VALUE,
  });
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
