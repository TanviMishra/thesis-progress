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
// console.log(countriesSizeArr);
drawIsland();

//FUNCTIONS
function drawIsland() {
  index = 0;
  setRandom = 0.6; //increase by 0.1 to see the error at higher frequency
  // let islandInfo = countriesSizeArr[index];
  nextCountry: while (index <= countriesSizeArr.length - 1) {
    calls = 0;
    let tempIslandArr = [];
    let tempStart = startAnIsland(worldMap);
    let noSpaceCount = 0;
    let centerIndex = 0;
    //GET START POINT
    startingPt: while (tempStart == -1) {
      index = 0;
      recalibrate();
      tempStart = startAnIsland(worldMap);
      tempIslandArr = [];
    }
    const islandInfo = countriesSizeArr[index]; //reinitialising islandInfo since start
    let tempIslandInfo = {};
    tempIslandInfo = Object.assign(tempIslandInfo, islandInfo.subplots);
    //used in pickLandType
    tempIslandArr.push(tempStart);
    //SET ALL LANDUNITS
    landUnitChange: while (
      tempIslandArr.length <=
      islandInfo.subplots["Land area"] - 1
    ) {
      calls++;
      if (calls > 1000) {
        //Loop safeguard
        console.log("stuck in loop");
        [index, tempIslandArr, noSpaceCount, calls] = hardReset(
          index,
          tempIslandArr,
          noSpaceCount,
          calls
        );
        tempIslandInfo = Object.assign(tempIslandInfo, islandInfo.subplots);
        recalibrate();
        tempStart = startAnIsland(worldMap); //not sure if this is needed
        break landUnitChange;
      }
      let centerLoc = tempIslandArr[centerIndex];
      for (
        let directionIndex = 0;
        directionIndex < DIRECTIONS_ARR.length;
        directionIndex++
      ) {
        const direction = DIRECTIONS_ARR[directionIndex];
        let randomChange;
        if (
          direction ==
          DIRECTIONS_ARR[helpers.randomNumber(0, DIRECTIONS_ARR.length - 1)]
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
        if (
          nextLoc &&
          tempIslandArr.length <= islandInfo.subplots["Land area"] - 1
        ) {
          if (
            helpers.checkAll8Adjacent(worldMap, nextLoc.x, nextLoc.y, [
              DEFAULT_VALUE.continent,
              islandInfo.continent,
            ]) //CHECK THAT NO OTHER ISLAND IS ADJACENT
          ) {
            let tempLandtype;
            [tempLandtype, tempIslandInfo] = pickLandType(
              tempIslandInfo,
              worldMap[centerLoc.x][centerLoc.y].landType
            ); //PROBLEM CHILD
            worldMap[nextLoc.x][nextLoc.y] = new landUnits(
              islandInfo.continent,
              tempLandtype
            );
            tempIslandArr.push({
              x: nextLoc.x,
              y: nextLoc.y,
            });
          } else {
            noSpaceCount++;
            if (noSpaceCount > 100) {
              console.log("adjacent not found");
              [index, tempIslandArr, noSpaceCount, calls] = hardReset(
                index,
                tempIslandArr,
                noSpaceCount,
                calls
              );
              tempIslandInfo = Object.assign(
                tempIslandInfo,
                islandInfo.subplots
              );
              recalibrate();
              tempStart = startAnIsland(worldMap);
              break landUnitChange;
            }
          }
        }
      }
      if (centerIndex < tempIslandArr.length - 1) {
        centerIndex++;
      } //might not be neccescary now because of randomChange
    } //end of landUnitChange
    index++;
  }
}
function startAnIsland(array) {
  let startPt = helpers.randomIndexForValue(array, DEFAULT_VALUE); //array + value
  if (startPt.x) return { x: startPt.x, y: startPt.y };
  else {
    console.log("CANT FIND START");
    return -1;
  }
}
function recalibrate() {
  console.log("recalibrating values");
  if (setRandom > 0) {
    setRandom -= 0.1;
  } else setRandom = 0;
}
function pickLandType(dict, centralLand) {
  centralLand = centralLand.replaceAll("_", " ");
  const nonZeroKeys = Object.keys(dict).filter(
    (landTypeKey) =>
      dict[landTypeKey] !== 0 &&
      (landTypeKey == "Meadows" ||
        landTypeKey == "Cropland" ||
        landTypeKey == "Planted Forest" ||
        landTypeKey == "Naturally regenerating forest" ||
        landTypeKey == "Other land")
  );
  // cnsole.log(nonZeroValues);
  if (nonZeroKeys.length > 0) {
    let randomKey;
    if (nonZeroKeys.includes(centralLand) && Math.random > 0.8) {
      randomKey = centralLand;
    } else {
      randomKey = nonZeroKeys[Math.floor(Math.random() * nonZeroKeys.length)];
    }
    const landTypeValue = dict[randomKey];
    if (landTypeValue !== 0) {
      dict[randomKey] = landTypeValue - 1;
    }
    let landType = randomKey.replaceAll(" ", "_");
    return [landType, dict];
  } else return ["Cropland", dict]; //!! requirred because oceeania math is incorrect, 4 pixels end up undefined
}
function hardReset(i, arr, count, call) {
  i = -1;
  arr = [];
  count = 0;
  call = 0;
  worldMap = helpers.createAndFillTwoDArray({
    rows: ROW_TOTAL,
    columns: COLUMN_TOTAL,
    defaultValue: DEFAULT_VALUE,
  });
  return [i, arr, count, call];
}
