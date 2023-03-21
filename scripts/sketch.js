let mesh_coords; // coords of the main mesh that is to be cut
let cutting = false; // flag that signals whether mesh cutting is in progress
let cuttingDone = false; // flag that signals whether mesh cutting is complete
let cut_coords; // coords of the cut being made on the mesh

function setup(){
    var canvas = createCanvas(window.innerWidth,window.innerHeight);
    canvas.parent('sketch')
    document.oncontextmenu = ()=>false;
    mesh_coords = [[parseInt(window.innerWidth/4),parseInt(window.innerHeight/4)],[parseInt(3*window.innerWidth/4),parseInt(window.innerHeight/4)],[parseInt(3*window.innerWidth/4),parseInt(3*window.innerHeight/4)],[parseInt(window.innerWidth/4),parseInt(3*window.innerHeight/4)]];
    cut_coords = [];
}

function isMouseInsideContour(contour) {
    let inside = false;
    let x = mouseX;
    let y = mouseY;
    for (let i = 0, j = contour.length - 1; i < contour.length; j = i++) {
      let xi = contour[i][0];
      let yi = contour[i][1];
      let xj = contour[j][0];
      let yj = contour[j][1];
      let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
}

function displayMesh(coords,inColor,outColor){
    // coords is the list of coordinates at the boundary of the mesh (similar to OpenCV contours)
    let [i1,i2,i3] = inColor;
    let [o1,o2,o3] = outColor;
    push();
    stroke(255,255,255);
    strokeWeight(10);
    if (isMouseInsideContour(coords)){
        fill(i1,i2,i3);
        if (!cutting && !cuttingDone){
            cutting = true;
        } if (cutting && !cuttingDone) {
            cut_coords.push([mouseX,mouseY]);
        }
    }else{
        fill(o1,o2,o3);
        if(cutting){
            cutting = false
            cuttingDone = true;
        }
    }
    beginShape();
    for (let i = 0; i < coords.length; i++) {
        vertex(coords[i][0], coords[i][1]);
    }
    endShape(CLOSE);
    pop();  
}

function displayCursor(){
    push();
    circle(mouseX,mouseY,10);
    pop();
}

function displayBoundary(coords){
    push();
    noFill();
    stroke(255,255,255);
    strokeWeight(10);
    beginShape();
    for (let i = 0; i < coords.length; i++) {
        vertex(coords[i][0], coords[i][1]);
    }
    endShape(CLOSE);
    pop();
}

function draw(){
    background(255);
    displayMesh(mesh_coords,[255,0,0],[0,0,255]);
    displayCursor();
    text(`mouseX:${mouseX}`,window.innerWidth/2-100,85);
    text(`mouseY:${mouseY}`,window.innerWidth/2-100,100);
    if (cutting){
        text(`Cutting...`,window.innerWidth/2-100,70);
        displayBoundary(cut_coords);
    }
    if (cuttingDone){
        text(`Cutting Done!`,window.innerWidth/2-100,70);
        displayMesh(cut_coords,[255,255,255],[255,255,255]);
    }
}