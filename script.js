let screenWidth = 600;
let screenHeight = 400;

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

let startTime = Date.now();
let lastClickTime = Date.now();
let duration = 60;

let bgColor = [255,0,0];
let shapeColor = [0,0,255];
let shapeX = 400;
let shapeY = 300;
let shapeRadius = 50;

let hit = 0;
let missed = 0;

/**
 * @typedef {{
 *  time: number;
 *  shape: {
 *      x: number;
 *      y: number;
 *      radius: number;
 *      color: number[];
 *  };
 *  bg: number[];
 *  hit: boolean;
 * }} DataPoint
 */

/**
 * @type {{
 * 	hitData: DataPoint[],
 *  hit: number,
 * 	missed: number,
 * 	total: number,
 * }}
 */
let data = {
	hitData: [],
	hit: 0,
	missed: 0,
	total: 0
};

let started = false;

function generateNewShape() {
	shapeX = Math.floor(Math.random()*screenWidth);
	shapeY = Math.floor(Math.random()*screenHeight);
	shapeRadius = Math.floor(Math.random()*50 + 10);
	shapeColor = [];
	bgColor = [];
	for (let i=3;i--;) {
		shapeColor.push(Math.floor(Math.random()*255));
		bgColor.push(Math.floor(Math.random()*255));
	}
}

function checkForClick() {
	if (!started) {
		startTime = Date.now();
		lastClickTime = Date.now();
		started = true;
	}
	if (isTimeUp()) {
		return;
	}
	let dataPoint = {
		time: (Date.now() - lastClickTime)/1000,
		shape: {
			x: shapeX,
			y: shapeY,
			radius: shapeRadius,
			color: shapeColor
		},
		bg: bgColor,
		hit: false
	};
	lastClickTime = Date.now();
	let dist = Math.hypot(mouseX-shapeX,mouseY-shapeY);
	if (dist <= shapeRadius) {
		hit++;
		dataPoint.hit = true;
	} else {
		missed++;
	}
	data.hitData.push(dataPoint);
	generateNewShape();
}

function isTimeUp() {
	return started && (Date.now()-startTime > 1000*duration);
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

	if (started)
		ctx.fillText(`${(duration-(Date.now()-startTime)/1000).toFixed(2)}s left`,10,60);

	if (isTimeUp()) {
		ctx.font = "50px monospace";
		ctx.fillStyle = "red";
		ctx.fillText("time up",250,250);
	}
}

setInterval(draw,1000/60);

function getData() {
	data.hit = hit;
	data.missed = missed;
	data.total = hit+missed;
	// document.getElementById("data").value = JSON.stringify(data,null,2);
	document.getElementById("data").value = getCSV();
}

/**
 * 
 * @param {DataPoint} d 
 * @returns {Object.<string,any>}
 */
function flattenDataPoint(d) {
	return {
		time: d.time,
		hit: d.hit,
		shapeX: d.shape.x,
		shapeY: d.shape.y,
		shapeRadius: d.shape.radius,
		shapeR: d.shape.color[0],
		shapeG: d.shape.color[1],
		shapeB: d.shape.color[2],
		bgR: d.bg[0],
		bgG: d.bg[1],
		bgB: d.bg[2],
	}
}

function getCSV() {
	let dataPoints = [];
	let text = "";
	for (let d of data.hitData) {
		dataPoints.push(flattenDataPoint(d));
	}
	if (dataPoints.length) {
		let feilds = Object.keys(dataPoints[0]);
		for (let f of feilds) {
			text += `${f},`;
		}
		text += "\n";
		// text = text.slice(0,text.length-2); // remove last comma
		for (let d of dataPoints) {
			for (let f of feilds) {
				text += `${d[f]},`
			}
			text += "\n";
		}
	}

	return text;
}