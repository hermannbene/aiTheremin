/**
 * Initializes the camera and starts video stream.
 * @param {HTMLVideoElement} videoElement - The HTML video element to display the video stream.
 */
async function startCamera(videoElement) {
    try {
        const constraints = {
            video: {
                facingMode: "user", // Default to user-facing camera
                width: { ideal: 1280 }, // Ideal video width
                height: { ideal: 720 } // Ideal video height
            }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        videoElement.play();
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
}

/**
 * Stops the video stream and releases the camera.
 * @param {HTMLVideoElement} videoElement - The video element whose stream is to be stopped.
 */
function stopCamera(videoElement) {
    const stream = videoElement.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.srcObject = null;
    }
}

/**
 * Toggles the camera between front and rear.
 * @param {HTMLVideoElement} videoElement - The video element to toggle camera for.
 * @param {boolean} useRearCamera - Flag to switch between front and rear cameras.
 */
async function toggleCamera(videoElement, useRearCamera) {
    stopCamera(videoElement); // Stop the current camera
    try {
        const constraints = {
            video: {
                facingMode: (useRearCamera ? "environment" : "user"), // Toggle between user-facing and environment-facing modes
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        videoElement.play();
    } catch (error) {
        console.error('Error toggling the camera:', error);
    }
}

// Exports t
