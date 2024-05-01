// Get video element
const video = document.getElementById('video');

// Function to start the camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
}

// Function to draw hand landmarks on the canvas
function drawHandLandmarks(predictions) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw hand landmarks
    for (const hand of predictions) {
        for (const landmark of hand.landmarks) {
            const x = landmark[0] * canvas.width;
            const y = landmark[1] * canvas.height;
            context.beginPath();
            context.arc(x, y, 5, 0, 2 * Math.PI);
            context.fillStyle = 'red';
            context.fill();
        }
    }

    // Draw the canvas on top of the video
    video.parentElement.appendChild(canvas);
}

// Load the handpose model
async function loadHandposeModel() {
    try {
        const model = await handpose.load();
        return model;
    } catch (error) {
        console.error('Error loading handpose model:', error);
    }
}

// Function to detect hands in the video stream
async function detectHands(model) {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
        // Draw hand landmarks on the canvas
        drawHandLandmarks(predictions);
    }

    // Request next frame
    requestAnimationFrame(() => detectHands(model));
}

// Main function to start the camera and detect hands
async function main() {
    // Start the camera
    await startCamera();

    // Load the handpose model
    const model = await loadHandposeModel();

    // Detect hands in the video stream
    detectHands(model);
}

// Run the main function when the page is loaded
window.addEventListener('load', main);
