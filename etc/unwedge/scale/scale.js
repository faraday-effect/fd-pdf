const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set display size (css pixels).
const size = 300;
canvas.style.width = size + 'px';
canvas.style.height = size + 'px';

// Set actual size in memory (scaled to account for extra pixel density).
const useProperScale = true;
const scale = useProperScale ? window.devicePixelRatio : 1; // Change to 1 on retina screens to see blurry canvas.
canvas.width = Math.floor(size * scale);
canvas.height = Math.floor(size * scale);
console.log("WIDTH", canvas.width);
console.log("HEIGHT", canvas.height);

// Normalize coordinate system to use css pixels.
ctx.scale(scale, scale);

ctx.fillStyle = '#bada55';
ctx.fillRect(10, 10, 300, 300);
ctx.fillStyle = '#ffffff';
ctx.font = '48px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

const x = size / 2;
const y = size / 2;
const textString = 'I love MDN';
ctx.fillText(textString, x, y);
