import * as helpers from "../helpers.js";
const ROW_TOTAL = 20; //y value
const COLUMN_TOTAL = 30; //x value
const DIRECTIONS_ARR = ["top", "right", "bottom", "left"];
const ISLAND_COUNT = 7;
const DEFAULT_VALUE = "ocean";
const SIZE = [
  { value: "Asia", size: 10 },
  { value: "Europe", size: 4 },
  { value: "SouthAmerica", size: 11 },
  { value: "NorthAmerica", size: 13 },
  { value: "Africa", size: 5 },
  { value: "Oceania", size: 2 },
  { value: "Antarctica", size: 9 },
];
let islandSizeArr = [...Array(ISLAND_COUNT)].map((x, i) => SIZE[i]);
let testMap = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];
export let worldMap = helpers.createAndFillTwoDArray({
  rows: ROW_TOTAL,
  columns: COLUMN_TOTAL,
  defaultValue: DEFAULT_VALUE,
});
islandSizeArr.forEach((islandInfo) => {
  let tempIslandArr = startAnIsland(worldMap, islandInfo.value);
  while (tempIslandArr.length < islandInfo.size) {
    let centerLoc = tempIslandArr[tempIslandArr.length - 1];
    let nextLoc = centerLoc;
    let adjacent;
    DIRECTIONS_ARR.forEach((direction) => {
      nextLoc = helpers.valueDependentMovementTwoDArray({
        array: worldMap,
        xpos: centerLoc.x,
        ypos: centerLoc.y,
        direction: direction,
        values: [DEFAULT_VALUE],
        randomness: 0, //value should be < than randomness
      });

      if (nextLoc) {
        adjacent = helpers.checkAll8Adjacent(worldMap, nextLoc.x, nextLoc.y, [
          DEFAULT_VALUE,
          islandInfo.value,
        ]);
        // console.log(adjacent);
      }
      if (nextLoc && adjacent && tempIslandArr.length < islandInfo.size) {
        worldMap[nextLoc.x][nextLoc.y] = islandInfo.value; //TO DO: instead of 1, make it island number
        tempIslandArr.push({
          x: nextLoc.x,
          y: nextLoc.y,
        });
      }
    });
    if (nextLoc == centerLoc && tempIslandArr.length < islandInfo.size) {
      tempIslandArr = startAnIsland(worldMap, islandInfo.value);
    }
  }
});
function startAnIsland(array, value) {
  let startPt = helpers.randomIndexForValue(array, DEFAULT_VALUE); //array + value
  let tempArr = [];
  array[startPt.x][startPt.y] = value;
  tempArr.push({
    x: startPt.x,
    y: startPt.y,
  });
  return tempArr;
}
