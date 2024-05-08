let screenWidth = 800;
let screenHeight = 600;

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("screen");
canvas.width = screenWidth;
canvas.height = screenHeight;
// Prevents selecting text when double-clicking on the canvas
canvas.onselectstart = function () { return false; }

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove',(ev)=>{
	mouseX = ev.offsetX;
	mouseY = ev.offsetY;
});
canvas.addEventListener('mousedown',(ev)=>{
	checkForClick();
})

let ctx = canvas.getContext('2d');

let bgColor = [255,0,0];
let shapeColor = [0,0,255];
let shapeX = 400;
let shapeY = 300;
let shapeRadius = 50;

let hit = 0;
let missed = 0;

function generateNewShape() {
	shapeX = Math.random()*screenWidth;
	shapeY = Math.random()*screenHeight;
	shapeRadius = Math.random()*50 + 10;
	shapeColor = [Math.random()*255,Math.random()*255,Math.random()*255];
	bgColor = [Math.random()*255,Math.random()*255,Math.random()*255];
}

function checkForClick() {
	let dist = Math.hypot(mouseX-shapeX,mouseY-shapeY);
	if (dist <= shapeRadius) {
		hit++;
	} else {
		missed++;
	}
	generateNewShape();
}

function listToColorString(c) {
	return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function draw() {
	ctx.fillStyle = listToColorString(bgColor);
	ctx.fillRect(0,0,screenWidth,screenHeight);

	ctx.fillStyle = listToColorString(shapeColor);
	ctx.beginPath();
	ctx.arc(shapeX,shapeY,shapeRadius,0,Math.PI*2);
	ctx.fill();

	ctx.fillStyle = "black";
	ctx.font = "20px monospace";
	ctx.fillText(`hit ${hit}/${hit+missed}`,10,30);
}

setInterval(draw,1000/60);