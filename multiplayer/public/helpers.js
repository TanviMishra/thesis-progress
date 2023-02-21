// fn call: helpers.createAndFillTwoDArray({rows: value1, columns: value2, defaultValue: value3,});
export function createAndFillTwoDArray({ rows, columns, defaultValue }) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => defaultValue)
  );
}
//fn call: helpers.valueDependentMovementTwoDArray({array: arr1, xpos: int, ypos: int, direction: top/right/left/bottom, values: [int1, int2]})
export function valueDependentMovementTwoDArray({
  array,
  xpos,
  ypos,
  direction,
  values,
  randomness,
}) {
  switch (direction) {
    case "top":
      if (
        xpos > 0 &&
        values.includes(array[xpos - 1][ypos].continent) &&
        Math.random() > randomness
      ) {
        return { x: xpos - 1, y: ypos };
      }
      break;
    case "right":
      if (
        ypos < array[0].length - 1 &&
        values == array[xpos][ypos + 1].continent &&
        Math.random() > randomness
      ) {
        return { x: xpos, y: ypos + 1 };
      }
      break;
    case "bottom":
      if (
        xpos < array.length - 1 &&
        values == array[xpos + 1][ypos].continent &&
        Math.random() > randomness
      ) {
        return { x: xpos + 1, y: ypos };
      }
      break;
    case "left":
      if (
        ypos > 0 &&
        values == array[xpos][ypos - 1].continent &&
        Math.random() > randomness
      ) {
        {
          return { x: xpos, y: ypos - 1 };
        }
      }
      break;
    default:
      console.log("error");
      break;
  }
  return null;
}
//chooses a random index from arr of specified value
export function randomIndexForValue(arr, value) {
  let indices = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === value) {
        indices.push({ x: i, y: j });
      }
    }
  }
  if (indices.length > 0)
    return indices[Math.floor(Math.random() * indices.length)];
  else return false;
}
//returns true is all 8 positions around a specific position [x][y] in the array (arr) have values that are included in valueArr
export function checkAll8Adjacent(arr, x, y, valueArr) {
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      let newX = x + i;
      let newY = y + j;
      if (newX >= 0 && newX < arr.length && newY >= 0 && newY < arr[0].length) {
        if (!valueArr.includes(arr[newX][newY].continent)) {
          return false;
        }
      }
    }
  }
  return true;
}
export function returnAll4Adjacent(arr, x, y, value) {
  let directions = [];
  if (x > 0 && arr[x - 1][y].landType !== value) {
    directions.push("up");
  }
  if (x < arr.length - 1 && arr[x + 1][y].landType !== value) {
    directions.push("down");
  }
  if (y > 0 && arr[x][y - 1].landType !== value) {
    directions.push("left");
  }
  if (y < arr[x].length - 1 && arr[x][y + 1].landType !== value) {
    directions.push("right");
  }
  return directions;
}
export function randomNumber(min, max) {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
    Math.ceil(min)
  );
}

export function convert2Dindexto1D(xpos, ypos, twoDimarr) {
  return xpos * twoDimarr[0].length + ypos;
}
