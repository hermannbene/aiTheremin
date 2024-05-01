const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Load the handpose model
async function loadModel() {
    return await handpose.load();
}

// Detect hands in the video frame
async function detectHands(video, model) {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
        console.log(predictions);  // Log hand predictions to the console

        // Draw hand keypoints
        for (let i = 0; i < predictions.length; i++) {
            const keypoints = predictions[i].landmarks;
            drawKeypoints(keypoints);
        }
    }
}

// Draw keypoints on the canvas
function drawKeypoints(keypoints) {
    keypoints.forEach(point => {
        const [x, y] = point;
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
    });
}

// Setup the camera
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

// Start video processing and hand tracking
async function main() {
    const video = await setupCamera();
    video.play();
    const model = await loadModel();
    setInterval(() => {
        detectHands(video, model);
    }, 100);
}

main();
