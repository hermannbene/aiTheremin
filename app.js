const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadModel() {
    const model = await handpose.load();
    return model;
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
            });
        }

        requestAnimationFrame(frameAnalysis);
    }

    frameAnalysis();
}

function drawHand(landmarks) {
    for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i][0];
        const y = landmarks[i][1];
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
    }
}

async function main() {
    await setupCamera();
    const model = await loadModel();
    detectHands(model);
}

main();
