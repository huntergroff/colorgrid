import React, { useState } from 'react'
import { CornerTile, EdgeTile, InteriorTile } from './Tiles';

//next -- need a better way to pass around universal states. i have to pass width, height, colors into everything

const minWidth = 3;
const maxWidth = 7;

const minHeight = 3;
const maxHeight = 7;


const InnerRow = (props) => {
    const row = parseInt(props.row);
    const width = parseInt(props.width);
    const height = parseInt(props.height);
    const colors = props.colors;

    const interiorTiles = [];
    for (let i = 3; i <= maxWidth; i = i + 2) {
        interiorTiles.push(<InteriorTile row={row} col={i} width={width} height={height} colors={colors}/>)
    }
    for (let i = maxWidth % 2 === 0 ? maxWidth : maxWidth - 1; i > minWidth && i > 2; i = i - 2) {
        interiorTiles.push(<InteriorTile row={row} col={i} width={width} height={height} colors={colors}/>)
    }

  return (
    <div name={`${row}`} style={{"height" : height < row ? "0px" : "50px", "display" : "flex", "transitionDuration" : "500ms", "overflow" : "hidden"}}>
        <EdgeTile row={row} col='1' width={width} height={height} topOrLeftColor={colors[0]} bottomOrRightColor={colors[2]}/>
        {interiorTiles}
        <EdgeTile row={row} col='2' width={width} height={height} topOrLeftColor={colors[1]} bottomOrRightColor={colors[3]}/>
    </div>
  )
}

const EdgeRow = (props) => {
    const row = parseInt(props.row);
    const width = parseInt(props.width);
    const height = parseInt(props.height);
    const colors = row === 1 ? [props.colors[0], props.colors[1]] : [props.colors[2], props.colors[3]];
    const toggles = row === 1 ? [props.toggles[0], props.toggles[1]] : [props.toggles[2], props.toggles[3]];

    const edgeTiles = [];
    for (let i = 3; i <= maxWidth; i = i + 2) {
        edgeTiles.push(<EdgeTile row={row} col={i} width={width} height={height} topOrLeftColor={colors[0]} bottomOrRightColor={colors[1]} />)
    }
    for (let i = maxWidth % 2 === 0 ? maxWidth : maxWidth - 1; i > minWidth && i > 2; i = i - 2) {
        edgeTiles.push(<EdgeTile row={row} col={i} width={width} height={height} topOrLeftColor={colors[0]} bottomOrRightColor={colors[1]} />)
    }

  return (
    <div name={row} style={{"height" : height < row ? "0px" : "50px", "display" : "flex", "transitionDuration" : "500ms", "overflow" : "hidden"}}>
        <CornerTile row={row} col={1} width={width} height={height} color={colors[0]} toggle={toggles[0]}/>
        {edgeTiles}
        <CornerTile row={row} col={2} width={width} height={height} color={colors[1]} toggle={toggles[1]}/>
    </div>
  )
}

const Grid = () => {

    // ---------------- SIZE CONSTANTS ---------------- \\

    const [width, setWidth] = useState(3)
    const addWidth = () => {
        if (width >= maxWidth) {
            setWidth(maxWidth);
            return;
        }
        setWidth(width+1);
    }
    const subtractWidth = () => {
        if (width <= minWidth) {
            setWidth(minWidth);
            return;
        }
        setWidth(width-1);
    }

    const [height, setHeight] = useState(3)
    const addHeight = () => {
        if (height >= maxHeight) {
            setHeight(maxHeight);
            return;
        }
        setHeight(height+1);
    }
    const subtractHeight = () => {
        if (height <= minHeight) {
            setHeight(minHeight);
            return;
        }
        setHeight(height-1);
    }

    // ---------------- COLOR CONSTANTS ---------------- \\

    const [color1, setColor1] = useState('000000')
    const toggleColor1 = () => setColor1((Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));

    const [color2, setColor2] = useState('000000')
    const toggleColor2 = () => setColor2((Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));

    const [color3, setColor3] = useState('000000')
    const toggleColor3 = () => setColor3((Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));

    const [color4, setColor4] = useState('000000')
    const toggleColor4 = () => setColor4((Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));

    const colors = [color1, color2, color3, color4];
    const toggles = [toggleColor1, toggleColor2, toggleColor3, toggleColor4];

    // ---------------- COMPONENT RENDER ---------------- \\

    //grid
    const grid = [];
    grid.push(<EdgeRow row={1} width={width} height={height} colors={colors} toggles={toggles}/>);
    for (let i = 3; i <= maxHeight; i = i + 2) {
        grid.push(<InnerRow row={i} width={width} height={height} colors={colors}/>)
    }
    for (let i = maxHeight % 2 === 0 ? maxHeight : maxHeight - 1; i > minHeight && i > 2; i = i - 2) {
        grid.push(<InnerRow row={i} width={width} height={height} colors={colors}/>)
    }
    grid.push(<EdgeRow row={2} width={width} height={height} colors={colors} toggles={toggles}/>);

  return (
    <div className='text-4xl h-screen w-[70%] mx-auto flex flex-col justify-center items-center border-2'>

        {/* subtract height button */}
        <div className='flex justify-center items-center h-[50px]'>
            <button className={height > minHeight ? '' : 'hidden'} onClick={subtractHeight}>-</button>
        </div>

        <div className='flex'>
            {/* subtract width button */}
            <div className='flex justify-center items-center w-[30px]'>
                <button className={width > minWidth ? '' : 'hidden'} onClick={subtractWidth}>-</button>
            </div>

            {/* grid */}
            <div>
                {grid}
            </div>

            {/* add width button */}
            <div className='flex justify-center items-center w-[30px]'>
                <button className={width < maxWidth ? '' : 'hidden'} onClick={addWidth}>+</button>
            </div>
        
        </div>

        {/* add height button */}
        <div className='flex justify-center items-center h-[50px]'>
            <button className={height < maxHeight ? '' : 'hidden'} onClick={addHeight}>+</button>
        </div>

    </div>
  )
}

export default Grid