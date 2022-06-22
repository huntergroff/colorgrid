import React from "react";
import "../tiles.css";

function blendColors(colors, weights) {
  //the two arrays must be same length
  //weights must add up to 1.0
  //TODO: add tests
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    const weight = weights[i];
    const [myR, myG, myB] = getRGB(color);
    r += myR * weight;
    g += myG * weight;
    b += myB * weight;
  }
  const R = Math.round(r).toString(16).padStart(2, "0");
  const G = Math.round(g).toString(16).padStart(2, "0");
  const B = Math.round(b).toString(16).padStart(2, "0");
  return "" + R + G + B;
}

function getRGB(hexColor) {
  return hexColor.match(/\w\w/g).map((c) => parseInt(c, 16));
}

function getEdgeTile(order, edgeSize, topOrLeftColor, bottomOrRightColor) {
  //order is 3, 4, 5, or 6 (not 1 or 2)
  const increment = edgeSize <= 3 ? 0.5 : 1.0 / (edgeSize - 1);

  //3's and 4's are 1 step from their corner. 5's and 6's are 2 steps from their corner. 7's and 8's would be 3 steps...
  //the number of steps is Math.ceil(order / 2) -1, and then we multiply by the increment
  const lighter = (Math.ceil(order / 2) - 1) * increment;
  const heavier = 1.0 - lighter;

  //if order is even, it will stick to the bottom or right. if order is odd, it will stick to the top or left
  return blendColors(
    [topOrLeftColor, bottomOrRightColor],
    order % 2 === 0 ? [lighter, heavier] : [heavier, lighter]
  );
}

///GOTTA REWORK THIS TO TAKE IN HEIGHT FROM THINGY AND THEN CALCULATE TOP BOTTOM LEFT AND RIGHT
function getInteriorTile(row, col, width, height, colors) {
  const top = getEdgeTile(col, width, colors[0], colors[1]);
  const bottom = getEdgeTile(col, width, colors[2], colors[3]);
  const left = getEdgeTile(row, height, colors[0], colors[2]);
  const right = getEdgeTile(row, height, colors[1], colors[3]);

  //if even, sticky to bottom or right. if odd, sticky to top or left
  const stepsToTop = row % 2 === 0 ? height - row / 2 : (row - 1) / 2;
  const stepsToBottom =
    row % 2 === 0 ? (height - 2) / 2 : height - (row + 1) / 2;
  const stepsToLeft = col % 2 === 0 ? width - col / 2 : (col - 1) / 2;
  const stepsToRight = col % 2 === 0 ? (width - 2) / 2 : width - (col + 1) / 2;

  const totalWeight =
    1 / stepsToTop + 1 / stepsToBottom + 1 / stepsToLeft + 1 / stepsToRight;
  const topWeight = 1 / stepsToTop / totalWeight;
  const bottomWeight = 1 / stepsToBottom / totalWeight;
  const leftWeight = 1 / stepsToLeft / totalWeight;
  const rightWeight = 1 / stepsToRight / totalWeight;

  return blendColors(
    [top, bottom, left, right],
    [topWeight, bottomWeight, leftWeight, rightWeight]
  );
}

const CornerTile = (props) => {
  //props
  const row = props.row;
  const col = props.col;
  const width = props.width;
  const height = props.height;
  const color = props.color;
  const toggle = props.toggle;

  return (
    <button onClick={toggle}>
      <div
        name={`${row}_${col}`}
        style={{
          "background-color": `#${color}`,
          "height" : height < row ? "0px" : "50px",
          "width" : width < col ? "0px" : "50px",
          "transitionDuration" : "500ms",
       }}
      ></div>
    </button>
  );
};

const EdgeTile = (props) => {
  //props
  const row = props.row;
  const col = props.col;
  const width = props.width;
  const height = props.height;
  const topOrLeftColor = props.topOrLeftColor;
  const bottomOrRightColor = props.bottomOrRightColor;

  const isHorizontal = row <= 2 ? true : false;
  const edgeSize = isHorizontal ? width : height;
  const order = isHorizontal ? col : row;

  return (
    <div
      name={`${row}_${col}`}
      style={{
        "background-color": `#${getEdgeTile(
          order,
          edgeSize,
          topOrLeftColor,
          bottomOrRightColor
        )}`,
        "height" : height < row ? "0px" : "50px",
        "width" : width < col ? "0px" : "50px",
        "transitionDuration" : "500ms",
      }}
    ></div>
  );
};

const InteriorTile = (props) => {
  //props
  const row = parseInt(props.row);
  const col = parseInt(props.col);
  const width = parseInt(props.width);
  const height = parseInt(props.height);
  const colors = props.colors;

  return (
    <div
      name={`${row}_${col}`}
      style={{
        "background-color": `#${getInteriorTile(
          row,
          col,
          width,
          height,
          colors
        )}`,
      "width" : `${width < col ? "0px" : "50px"}`,
      "height" : "50px",
      "transitionDuration" : "500ms",
      }}
    ></div>
  );
};

export { EdgeTile, CornerTile, InteriorTile };
