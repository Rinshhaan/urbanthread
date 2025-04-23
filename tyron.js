const webcamVideo = document.getElementById('webcamVideo');
const tryonImage = document.getElementById('tryonImage');
const itemSelect = document.getElementById('itemSelect');
const opacityControl = document.getElementById('opacityControl');
const captureBtn = document.getElementById('captureBtn');
const capturedImageContainer = document.getElementById('capturedImageContainer');
const capturedImage = document.getElementById('capturedImage');

// Access webcam
async function enableWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        webcamVideo.srcObject = stream;
    } catch (error) {
        console.error("Error accessing webcam:", error);
    }
}

enableWebcam();

// Change try-on item
itemSelect.addEventListener('change', () => {
    const selectedItem = itemSelect.value;
    tryonImage.src = selectedItem ? `images/${selectedItem}` : '';
});

// Control opacity
opacityControl.addEventListener('input', () => {
    tryonImage.style.opacity = opacityControl.value;
});

// Capture image
captureBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = webcamVideo.videoWidth;
    canvas.height = webcamVideo.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);

    if (tryonImage.src) {
        const imageAspectRatio = tryonImage.naturalWidth / tryonImage.naturalHeight;
        const videoAspectRatio = canvas.width / canvas.height;
        let drawWidth = canvas.width * 0.8;
        let drawHeight = canvas.height * 0.8;
        let x = canvas.width * 0.1;
        let y = canvas.height * 0.1;

        if (imageAspectRatio > videoAspectRatio) {
            drawHeight = drawWidth / imageAspectRatio;
            y = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = drawHeight * imageAspectRatio;
            x = (canvas.width - drawWidth) / 2;
        }

        ctx.globalAlpha = parseFloat(opacityControl.value);
        ctx.drawImage(tryonImage, x, y, drawWidth, drawHeight);
        ctx.globalAlpha = 1; // Reset opacity for the captured image
    }

    const dataURL = canvas.toDataURL('image/png');
    capturedImage.src = dataURL;
    capturedImageContainer.style.display = 'block';
});
