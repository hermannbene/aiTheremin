import { runHandDetection } from './handDetection.js';

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');

    // Setup camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
                // Start hand detection
                runHandDetection(video);
            };
        })
        .catch(error => console.error('Error accessing the camera:', error));
});
