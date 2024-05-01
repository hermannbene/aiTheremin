// Import the necessary functions from camera.js and handDetection.js
import { startCamera, stopCamera, toggleCamera } from './camera.js';
import { runHandDetection } from './handDetection.js';

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');

    // Handle any errors in camera setup or hand detection
    async function setupCameraAndDetection() {
        try {
            // Start the camera and then start hand detection
            await startCamera(video);
            runHandDetection(video);
        } catch (error) {
            console.error('Failed to set up the camera or hand detection:', error);
        }
    }

    setupCameraAndDetection();

    // Optional: Setup event listeners for UI elements like buttons to stop or toggle the camera
    // Example button for stopping the camera
    const stopButton = document.getElementById('stopButton');
    if (stopButton) {
        stopButton.addEventListener('click', () => {
            stopCamera(video);
        });
    }

    // Example button for toggling the camera
    const toggleButton = document.getElementById('toggleButton');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            // Assume `useRearCamera` is a boolean that tracks the current state
            useRearCamera = !useRearCamera;  // This variable should be defined in your broader scope
            toggleCamera(video, useRearCamera);
        });
    }
});
