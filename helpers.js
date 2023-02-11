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
        values.includes(array[xpos - 1][ypos]) &&
        Math.random() > randomness
      ) {
        return { x: xpos - 1, y: ypos };
      }
      break;
    case "right":
      if (
        ypos < array[0].length - 1 &&
        values.includes(array[xpos][ypos + 1]) &&
        Math.random() > randomness
      ) {
        return { x: xpos, y: ypos + 1 };
      }
      break;
    case "bottom":
      if (
        xpos < array.length - 1 &&
        values.includes(array[xpos + 1][ypos]) &&
        Math.random() > randomness
      ) {
        return { x: xpos + 1, y: ypos };
      }
      break;
    case "left":
      if (
        ypos > 0 &&
        values.includes(array[xpos][ypos - 1]) &&
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
}

export function randomIndexForValue(arr, value) {
  let indices = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === value) {
        indices.push({ x: i, y: j });
      }
    }
  }
  return indices[Math.floor(Math.random() * indices.length)];
}
export function checkAll8Adjacent(arr, x, y, valueArr) {
  let rows = arr.length;
  let cols = arr[0].length;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let newX = x + i;
      let newY = y + j;
      if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
        if (!valueArr.includes(arr[newX][newY])) {
          return false;
        }
      }
    }
  }
  return true;
}
