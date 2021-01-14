
let editor = null; 

let mx = 0, my = 0, x1 = 0, y1 = 0, x2 = 0, y2 = 0;
let selectedElement = null;
let shape = "dreptunghi";
let size="samll";
let svg, transfom, offset;
let color, brushsize;
let elements = document.getElementById("elemente");


function editorMouseMove(e) {

    mx = Math.round(e.x - editor.getBoundingClientRect().x);
    my = Math.round(e.y - editor.getBoundingClientRect().y);

    if (shape === "rectangle")
    setCoordinatsRect(selectionD, x1, y1, mx, my);
    else if (shape === "ellipse")
    setCoordinatesEllipse(selectionE, x1, y1, mx, my);
    else if (shape === "line")
    setCoordinatsLine(selectionL, x1, y1, mx, my);
    else if (shape === "polygon")
    setCoordinatsPoly(selectionR, x1, y1, mx, my);

}

function editorMouseDown(e) {
    if (e.button === 0) {

        x1 = mx, y1 = my;
        mx = Math.round(e.x - editor.getBoundingClientRect().x);
        my = Math.round(e.y - editor.getBoundingClientRect().y);


        if (shape === "rectangle")
       {
           setCoordinatsRect(selectionD, x1, y1, mx, my);
            selectionD.style.display = "block";
            
           
       }
        else if (shape === "ellipse")
        {
            setCoordinatesEllipse(selectionE, x1, y1, mx, my);
            selectionE.style.display = "block";
            
        }
        else if (shape === "line")
        {
            setCoordinatsLine(selectionL, x1, y1, mx, my);
            selectionL.style.display = "block";
            
        }
        else if (shape === "polygon")
        {
            setCoordinatsPoly(selectionR, x1, y1, mx, my);
            selectionR.style.display = "block";
            
        }
    }

}
//general
function editorMouseUp(e) {
    
    if (e.button === 0) {
        x2 = e.pageX - this.getBoundingClientRect().left;
        y2 = e.pageY - this.getBoundingClientRect().top;

        selectionD.style.display = 'none';
        selectionE.style.display = 'none';
        selectionL.style.display = 'none';
        selectionR.style.display = 'none';


        if (shape === "rectangle") {
             newElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
             setCoordinatsRect(newElement, x1, y1, x2, y2);
             newElement.setAttribute("stroke-width",brushsize);
             
        }
       else  if (shape === "ellipse") {
             newElement = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
             setCoordinatesEllipse(newElement, x1, y1, x2, y2);
             newElement.setAttribute("stroke-width",brushsize);
          
        }
        else if (shape === "line") {
             newElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
             setCoordinatsLine(newElement, x1, y1, x2, y2);
             newElement.setAttribute("stroke-width",brushsize);
            
        }
        else if (shape === "polygon") {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            setCoordinatsPoly(newElement, x1, y1, x2, y2);
            newElement.setAttribute("stroke-width",brushsize);
           
       }
  
             newElement.addEventListener('mousedown', elementMouseDown);
             newElement.addEventListener('mousemove',elementMouseMove);
             newElement.addEventListener('mouseup',elementMouseUp);
            newElement.setAttribute("stroke", color);
            newElement.setAttribute("stroke-width", brushsize);
            document.querySelector('#elemente').append(newElement);
       
    }
}


//functie mousedown si pentru mutare elemente svg
function elementMouseDown(e) {
 
    if (e.button === 2) {
        selectedElement = e.target;
        for (newElement of editor.querySelectorAll('#elemente *')) {
            newElement.classList.remove('selectat');
        }
        selectedElement.classList.add('selectat');
    } else if (e.button === 1 && e.target!==null) {
            e.button = true;
            selectedElement= e.target;
            offset = getMousePosition(e);
            x1 = Math.round(e.x - editor.getBoundingClientRect().x);
            y1 = Math.round(e.y - editor.getBoundingClientRect().y);

            var transforms = selectedElement.transform.baseVal;
            if (transforms.length === 0 ||
                transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                var translate = editor.createSVGTransform();
                translate.setTranslate(0, 0);
                selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }
            transform = transforms.getItem(0);
            x2 -= transform.matrix.e;
            y2 -= transform.matrix.f;
    }
}

//functii mutare elemente in editor
function elementMouseMove(e) {
   
   
    if (selectedElement && e.target !=null) {
        e.preventDefault();
        let coordonates=getMousePosition(e);
        transform.setTranslate(coordonates.x - offset.x, coordonates.y - offset.y);
    }

}

function elementMouseUp(e) {
    
    if (e.button === 1) {
        selectedElement = null;
    }
}

function getMousePosition(evt) {
    //matrice coordonate conversie svg coordonate
    var CTM = editor.getScreenCTM();
    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

function setCoordinatsRect(element, x1, y1, x2, y2) {
    element.setAttributeNS(null,"x", Math.min(x1, x2));
    element.setAttributeNS(null,"y", Math.min(y1, y2));
    element.setAttributeNS(null,
        "width",
        Math.max(x1, x2) - Math.min(x1, x2)
    );
    element.setAttributeNS(null,
        "height",
        Math.max(y1, y2) - Math.min(y1, y2)
    );
}

function setCoordinatsLine(element, x1,y1, x2,y2) {
    element.setAttributeNS(null, "x1",x1);
    element.setAttributeNS(null, "y1",y1);
    element.setAttributeNS(null,"x2", x2);
    element.setAttributeNS(null,"y2", y2);
}

  function setCoordinatesEllipse(element, x1, y1, x2, y2) {
    element.setAttributeNS(null, "cx",
      (x1 + x2) / 2
    );
    element.setAttributeNS( null, "cy",
      // ....
      (Math.max(y1, y2) - Math.min(y1, y2)) / 2 + Math.min(y1, y2)
    );
    element.setAttributeNS( null,"rx",
      (Math.max(x1, x2) - Math.min(x1, x2)) / 2
    );
    element.setAttributeNS( null, "ry",
      (Math.max(y1, y2) - Math.min(y1, y2)) / 2
    );
  }

  function setCoordinatsPoly(element, x1, y1, x2, y2) {
    element.setAttributeNS( null, "points",
      `${(x1 + x2) / 2},
      ${Math.min(y1, y2)} ${Math.max(x1, x2)},
      ${(y1 + y2) / 2} ${(x1 + x2) / 2},
      ${Math.max(y1, y2)} ${Math.min(x1, x2)},
      ${(y1 + y2) / 2}`
    );
  }


function saveSVG() {

  
    let svgText = document.querySelector('svg').outerHTML;
    svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');

   
    var svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);

 
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "Yourdraw.svg";
    downloadLink.click();
}


 
function savePNG() {

    
   let svg = document.querySelector("svg");

    if (typeof window.XMLSerializer != "undefined") {
        var svgData = (new XMLSerializer()).serializeToString(svg);
    } 
    else if (typeof svg.xml != "undefined") {
        var svgData = svg.xml;
    }

    let canvas = document.createElement("canvas");
     let svgSize = svg.getBoundingClientRect();
     canvas.width = svgSize.width;
     canvas.height = svgSize.height;
    let context = canvas.getContext("2d");
    
    

    let img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))) );
   
     img.onload = function() {
        context.drawImage(img, 0, 0);
        let imgsrc = canvas.toDataURL("image/png");
        let a = document.createElement("a");
        a.download = "yourDraw.png";
        a.href = imgsrc;
        a.click();
    };

  
}

//culoare onclick
function changeColor(selectedElement) {

    let colors = ['red', 'blue', 'green','yellow','purple','white'];
    let random_color = colors[Math.floor(Math.random() * colors.length)];
    selectedElement.style.fill = random_color;
  
}



//stergere desen curent
function Clear()
  {
    let elements =document.getElementById("elemente");
    while(elements.firstChild){
        elements.removeChild(elements.lastChild);
    }
 }
 
 
 //modificare forme -- not working properly --
function modifyWidth(selectedElement){

    let element = selectedElement.getBoundingClientRect();
    if (selectedElement.hasAttribute("width")) {
        selectedElement.setAttribute("width", element.x - 5 );
    } else if (selectedElement.hasAttribute("rx")) {
        selectedElement.setAttribute("rx", element.x - 5 );
    }
  

}
function modifyHeight(selectedElement){

    let element = selectedElement.getBoundingClientRect();
    if (selectedElement.hasAttribute("height")) {
        selectedElement.setAttribute("height", element.x + 5 +"px");
    } else if (selectedElement.hasAttribute("ry")) {
        selectedElement.setAttribute("ry", element.y + 5 );
    }
     
 }

//mutare elemente pe evenimentul de keydown
 function moveLeft(selectedElement){
   // console.log('a');
    let element = selectedElement.getBoundingClientRect();
    if (selectedElement.hasAttribute("x")) {
        selectedElement.setAttribute("x", element.x - 5 +"px");
    } else if (selectedElement.hasAttribute("cx")) {
        selectedElement.setAttribute("cx", element.cx - 5 -"px");
    }else if (selectedElement.hasAttribute("x1")) {
        selectedElement.setAttribute("x1", element.x - 5 -"px");
    }

}

function moveRight(selectedElement){

    let element = selectedElement.getBoundingClientRect();
    if (selectedElement.hasAttribute("x")) {
        selectedElement.setAttribute("x", element.x + 5 +"px");
    } else if (selectedElement.hasAttribute("cx")) {
        selectedElement.setAttribute("cx", element.cx + 5 +"px");
    }else if (selectedElement.hasAttribute("x1")) {
        selectedElement.setAttribute("x1", element.x + 5 +"px");
    }
}
function moveUp(selectedElement){

    let element = selectedElement.getBoundingClientRect();
    if (selectedElement.hasAttribute("y")) {
        selectedElement.setAttribute("y", element.y - 5 -"px");
    } else if (selectedElement.hasAttribute("cy")) {
        selectedElement.setAttribute("cy", element.y - 5 -"px");
    }else if (selectedElement.hasAttribute("y1")) {
        selectedElement.setAttribute("y1", element.y - 5 - "px");
    }
}
function moveDown(selectedElement){

    let element = selectedElement.getBoundingClientRect();
    if (selectedElement.hasAttribute("y")) {
        selectedElement.setAttribute("y", element.y +5 +"px" );
    } else if (selectedElement.hasAttribute("cy")) {
        selectedElement.setAttribute("cy", element.y +5 +"px");
    }else if (selectedElement.hasAttribute("y1")) {
        selectedElement.setAttribute("y1", element.y + 5 + "px");
    }
}


function changeBrCol(){
    brushsize=document.querySelector('#Thebrush').valueAsNumber;
    color=document.querySelector('#color').value;
}

  function aplicatie() {

    editor = document.querySelector('#editor');
    let rect = document.querySelector('#rectangle');
    let eli = document.querySelector('#ellipse');
    let line = document.querySelector('#line');
    let poly = document.querySelector('#polygon');

    brushsize=document.querySelector('#Thebrush').valueAsNumber;
    color=document.querySelector('#color').value;
    
    document.addEventListener('input' , function(e) {
     changeBrCol();
    });
 
   document.getElementById("line").onclick = () =>
   (shape = "line");
  document.getElementById("rectangle").onclick = () =>
    (shape = "rectangle");
  document.getElementById("ellipse").onclick = () =>
    (shape = "ellipse");
    document.getElementById("polygon").onclick = () =>
    (shape = "polygon");

  

    rect.addEventListener('click', () => {
        
        selectieD = document.querySelector('#selectieD');

        editor.addEventListener('mousemove', editorMouseMove);
        editor.addEventListener('mousedown', editorMouseDown);
        editor.addEventListener('mouseup', editorMouseUp);
        
        
    });

    eli.addEventListener('click', () => {

        selectieE = document.querySelector('#selectieE');

        editor.addEventListener('mousemove', editorMouseMove);
        editor.addEventListener('mousedown', editorMouseDown);
        editor.addEventListener('mouseup', editorMouseUp);
       
    });

    line.addEventListener('click', () => {

        selectieL = document.querySelector('#selectieL');

        editor.addEventListener('mousemove', editorMouseMove);
        editor.addEventListener('mousedown', editorMouseDown);
        editor.addEventListener('mouseup', editorMouseUp);
      
        
    });
    poly.addEventListener('click', () => {

        selectieR = document.querySelector('#selectieR');

        editor.addEventListener('mousemove', editorMouseMove);
        editor.addEventListener('mousedown', editorMouseDown);
        editor.addEventListener('mouseup', editorMouseUp);
       
    });

   
    editor.addEventListener('contextmenu', e => e.preventDefault());
   
    document.addEventListener('keydown', e => {
        if (selectedElement && e.keyCode == 46) {
            selectedElement.remove();
            selectedElement = null;
        }
    });

    document.addEventListener('keydown', e => {
        if (selectedElement && e.keyCode == 67) {
            changeColor(selectedElement);
        }
    });
  
    document.addEventListener('keydown', e => {
      if  (selectedElement && e.keyCode == 37){
          moveLeft(selectedElement);
      }
      else if(selectedElement && e.keyCode == 38){
        
          moveUp(selectedElement);
      }
      else if(selectedElement && e.keyCode == 39){
          moveRight(selectedElement);
      }
      else if(selectedElement &&e.keyCode == 40){
            moveDown(selectedElement);
      }
    });


    document.addEventListener('keydown', e => {
        if  (selectedElement && e.keyCode == 72){
            modifyHeight(selectedElement);
        }
        else if(selectedElement && e.keyCode == 87){
          
            modifyWidth(selectedElement);
        }
    });
 
    document.querySelector('button').addEventListener('click', btnSaveSVG);
    document.querySelector('button').addEventListener('click', btnClear);
    document.querySelector('button').addEventListener('click', btnSavePng);

}


document.addEventListener('DOMContentLoaded', aplicatie);