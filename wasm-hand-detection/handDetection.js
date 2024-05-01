// Import the TensorFlow models library
import * as handPose from '@tensorflow-models/handpose';

// Load the handpose model
async function loadHandPoseModel() {
    return await handPose.load();  // Load the model
}

// Function to detect hands in the video frame
async function detectHands(videoElement, model) {
    const predictions = await model.estimateHands(videoElement);
    if (predictions.length > 0) {
        console.log('Hand detected:', predictions);
        // You can process the predictions here to extract more details
    }
}

// Main function to run the hand detection
async function runHandDetection(videoElement) {
    const model = await loadHandPoseModel();
    console.log("Model loaded");

    // Run detection periodically, e.g., every 100 milliseconds
    setInterval(() => {
        detectHands(videoElement, model);
    }, 100);
}

export { runHandDetection };
