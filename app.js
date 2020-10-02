let pixelGrid = document.querySelector('#pixelGrid');
let gridContainer = document.querySelector('#gridContainer');

let defaultPaint = 'rgb(0, 0, 0)'; //default paint color is black
let defaultCanvas = 'rgb(255,255,255)';//default canvas color is white
let selectedColor = defaultPaint;

let canvasColor = defaultCanvas;

let activeTool = 'paintbrush'; //active tool is paintbrush by default

let width = 30;
let height = 30;

const initGrid = (width, height)=>{
    let docFrag = new DocumentFragment();
    for(let row = 0; row<height; row++){
        let tr = document.createElement('tr');
        docFrag.append(tr);
        for(let col = 0; col<width; col++){
            let td = document.createElement('td');
            td.setAttribute('row', row);
            td.setAttribute('col', col);
            td.style.backgroundColor = canvasColor;
            tr.append(td);
        }
    }
    pixelGrid.append(docFrag);
}

//sets the background color of the specified item
const setColor = (item, color)=>{
    item.style.backgroundColor = color;
}

//Three following event listeners listens for clicks/drags. mouseFlag variable is used to check for user dragging mouse colors
let mouseFlag = false;

gridContainer.addEventListener('mousedown', (evt)=>{
    switch(activeTool){
        case 'eraser':
            mouseFlag = true;
            setColor(evt.target, canvasColor);
            break;
        case 'paintbrush':
            mouseFlag = true;
            setColor(evt.target, selectedColor);
            break;
        case 'bucket':
            let row = evt.target.getAttribute('row');
            let col = evt.target.getAttribute('col');
            fill(row, col, evt.target.style.backgroundColor);
            break;
        case 'dropper':
            let color = evt.target.style.backgroundColor;
            selectedColor = color;
            colorSelector.value = rgbToHex(color);
            activeTool = 'paintbrush';
            break;
     }
    
});

gridContainer.addEventListener('mouseover', (evt)=>{
    if(mouseFlag && activeTool === 'paintbrush'){
        setColor(evt.target, selectedColor);
    }else if(mouseFlag && activeTool === 'eraser'){
        setColor(evt.target, canvasColor);
        console.log(evt.target);
        console.log('erased');
    }
})

gridContainer.addEventListener('mouseup', ()=>{
    mouseFlag = false;
});

//Buttons/Accesories
//check for when user changes colors and sets the appropriate color to be used
let colorSelector = document.getElementById('colorSelector');
colorSelector.addEventListener('input', (evt)=>{
    selectedColor = evt.target.value;
})

let paintbrush = document.querySelector('#paintbrush');
paintbrush.addEventListener('click', ()=>{
    activeTool = 'paintbrush';
    selectedColor = colorSelector.value;
});

//reset pixelGrid to a white background
let clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', ()=>{
    //addModal asking if sure?
   let rowArray = pixelGrid.children;
   for(let row of rowArray){
       let colArray = row.children;
       for(let col of colArray){
           col.style.backgroundColor = canvasColor;
       }
   }
   activeTool = 'paintbrush';
})

let eraser = document.querySelector('#eraser');
eraser.addEventListener('click', ()=>{
    activeTool = 'eraser';
});

let dropper = document.querySelector('#dropper');
dropper.addEventListener('click', (evt)=>{
    activeTool = 'dropper';
});

//converst rgb color to hex 
const rgbToHex = (rgb)=>{
    hex = rgb.split("(")[1].split(")")[0].split(",");
    let [r, g, b] = hex;
    let hexR = parseInt(r).toString(16);
    let hexG = parseInt(g).toString(16);
    let hexB = parseInt(b).toString(16);
    let hexString ='';
    if(hexR.length < 2){
        hexString = `#0${hexR}`;
    }else{
        hexString = `#${hexR}`;
    }
    if(hexG.length < 2){
        hexString += `0${hexG}`;
    }else{
        hexString += `${hexG}`;
    }
    if(hexB.length < 2){
        hexString += `0${hexB}`;
    }else{
        hexString += `${hexB}`;
    }
    return hexString;
};

let bucket = document.querySelector('#bucket');
bucket.addEventListener('click', ()=>{
    activeTool = 'bucket';
});

//add to mouseEvent listener later
const fill = (row, col, oldColor) => {
    
    let docFrag = new DocumentFragment();
    
    
    docFrag.append(pixelGrid.cloneNode(true));
   
    bucketFill(row, col, oldColor, docFrag);
    
    gridContainer.replaceChild(docFrag, pixelGrid);
    pixelGrid = document.querySelector('#pixelGrid');
}

//nth child
const bucketFill = (row, col, oldColor, docFrag)=>{
    if(row < 0 || col < 0 || row >= height || col >= width){
        return;
    }
    let currentPixel = docFrag.querySelector(`[row="${row}"][col="${col}"]`);
    let currentColor = currentPixel.style.backgroundColor;
    //if the color of the current pixel matches the selected color, don't change it
    //only change if the color is the same as the color of the first selected original pixel
    if(currentColor != oldColor || currentColor === selectedColor){
        return;
   }
   currentPixel.style.backgroundColor = selectedColor;
   //make recursive calls in 4 directions
   bucketFill(parseInt(row)+1, col, oldColor, docFrag);
   bucketFill(row, parseInt(col)+1, oldColor, docFrag);
   bucketFill(parseInt(row)-1, col, oldColor, docFrag);
   bucketFill(row, parseInt(col)-1, oldColor, docFrag);
}

let colorSaver = document.querySelector('#colorSaver');
colorSaver.addEventListener('click', (evt)=>{
    if(activeTool === 'dropper'){
        selectedColor = evt.target.style.backgroundColor;
        colorSelector.value = rgbToHex(evt.target.style.backgroundColor);
        activeTool = 'paintbrush';
    }else if(activeTool === 'eraser'){
        evt.target.style.backgroundColor = canvasColor;
    }
    else{
        evt.target.style.backgroundColor = selectedColor;
    }
});

//initialize canvas grid
initGrid(width,height);
