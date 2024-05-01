const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const frequencyDisplay = document.getElementById('frequencyDisplay');
const volumeDisplay = document.getElementById('volumeDisplay');
const permissionNotice = document.getElementById('permissionNotice');

// Web Audio API setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = audioContext.createOscillator();
let gainNode = audioContext.createGain();

oscillator.type = 'sine';
oscillator.frequency.value = 440;  // Initial frequency in hertz
gainNode.gain.value = 0;  // Start with mute to prevent autoplay issues

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

function startAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume(); // Resume the audio context if it was suspended
    }
    oscillator.start();
    gainNode.gain.value = 1; // Ensure the audio is always playing
}

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        permissionNotice.style.display = 'none'; // Hide permission notice on success
        startAudio(); // Start audio after user interaction with the camera

        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    } catch (error) {
        console.error('Camera access denied:', error);
        permissionNotice.innerText = 'Camera access denied. Please enable it to use this app.';
        permissionNotice.style.display = 'block'; // Show permission notice on failure
    }
}

async function loadModel() {
    return await handpose.load();
}

function calculateDistance(point1, point2) {
    const xDiff = point1[0] - point2[0];
    const yDiff = point1[1] - point2[1];
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function drawHand(landmarks) {
    context.save();
    context.translate(canvas.width, 0);
    context.scale(-1, 1); // Flip the canvas to match the flipped video

    for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i][0];
        const y = landmarks[i][1];
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
    }

    context.restore();
}

function displayDistance(distance) {
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.fillText(`Distance: ${distance.toFixed(2)}px`, 10, 50);
}

async function detectHands(model) {
    video.play();

    async function frameAnalysis() {
        const predictions = await model.estimateHands(video, true);

        context.clearRect(0, 0, canvas.width, canvas.height);
        if (predictions.length > 0) {
            predictions.forEach(prediction => {
                const landmarks = prediction.landmarks;
                drawHand(landmarks);

                if (landmarks.length > 8) {
                    const thumbTip = landmarks[4];
                    const indexTip = landmarks[8];
                    const distance = calculateDistance(thumbTip, indexTip);

                    const maxVolume = 1;
                    const maxDistance = 200;
                    gainNode.gain.value = Math.min(distance / maxDistance, 1) * maxVolume;

                    const handY = prediction.boundingBox.topLeft[1] + (prediction.boundingBox.bottomRight[1] - prediction.boundingBox.topLeft[1]) / 2;
                    const maxFrequency = 1000;
                    const minFrequency = 100;
                    const videoHeight = video.height;
                    oscillator.frequency.value = ((videoHeight - handY) / videoHeight) * (maxFrequency - minFrequency) + minFrequency;

                    // Update UI
                    frequencyDisplay.textContent = oscillator.frequency.value.toFixed(2);
                    volumeDisplay.textContent = (gainNode.gain.value * 100).toFixed(2);

                    displayDistance(distance);
                }
            });
        }

        requestAnimationFrame(frameAnalysis);
    }

    frameAnalysis();
}

async function main() {
    await setupCamera();
    const model = await loadModel();
    detectHands(model);
}

main();
