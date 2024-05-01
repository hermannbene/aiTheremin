// Get the video element and set initial constraints for the front camera
const videoElement = document.getElementById('video');
let useRearCamera = false;

// Function to start the camera
function startCamera() {
    const constraints = {
        video: {
            facingMode: useRearCamera ? 'environment' : 'user'
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            videoElement.srcObject = stream;
        })
        .catch((error) => {
            console.error('Error accessing the camera:', error);
        });
}

// Function to stop the camera
function stopCamera() {
    const stream = videoElement.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.srcObject = null;
    }
}

// Function to toggle the camera between front and back
function toggleCamera() {
    useRearCamera = !useRearCamera;
    stopCamera();
    startCamera();
}

// Expose functions for use in the HTML
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.toggleCamera = toggleCamera;
