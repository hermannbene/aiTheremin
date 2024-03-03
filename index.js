const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');

// Get user media (video stream) from the front camera
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing the camera:', err);
    }
}

// Take a snapshot from the video stream and display it on the canvas
function takeSnapshot() {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = 'block'; // Show canvas
    video.style.display = 'none'; // Hide video
}

// Initialize camera when the page loads
window.addEventListener('load', () => {
    initCamera();
});

// Capture button click event
captureButton.addEventListener('click', () => {
    takeSnapshot();
});
