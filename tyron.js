document.addEventListener('DOMContentLoaded', () => {
    const tryonImage = document.getElementById('tryonImage');
    const itemSelect = document.getElementById('itemSelect');
    const opacityControl = document.getElementById('opacityControl');
    const webcamVideo = document.getElementById('webcamVideo');
    const captureBtn = document.getElementById('captureBtn');
    const capturedImageContainer = document.getElementById('capturedImageContainer');
    const capturedImage = document.getElementById('capturedImage');

    let stream;

    async function startWebcam() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            webcamVideo.srcObject = stream;
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    }

    function updateTryonImage(imageSrc) {
        tryonImage.src = imageSrc;
    }

    itemSelect.addEventListener('change', (event) => {
        updateTryonImage(event.target.value);
    });

    opacityControl.addEventListener('input', (event) => {
        tryonImage.style.opacity = event.target.value;
    });

    captureBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = webcamVideo.videoWidth;
        canvas.height = webcamVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);

        // Overlay the try-on image
        const tryon = document.getElementById('tryonImage');
        ctx.globalAlpha = tryon.style.opacity || 1;
        const aspectRatioVideo = webcamVideo.videoWidth / webcamVideo.videoHeight;
        const aspectRatioImage = tryon.naturalWidth / tryon.naturalHeight;
        let drawWidth = canvas.width;
        let drawHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (aspectRatioImage > aspectRatioVideo) {
            drawHeight = canvas.height;
            drawWidth = drawHeight * aspectRatioImage;
            offsetX = (canvas.width - drawWidth) / 2;
        } else {
            drawWidth = canvas.width;
            drawHeight = drawWidth / aspectRatioImage;
            offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(tryon, offsetX, offsetY, drawWidth, drawHeight);
        ctx.globalAlpha = 1; // Reset alpha

        const dataURL = canvas.toDataURL('image/png');
        capturedImage.src = dataURL;
        capturedImageContainer.style.display = 'block';
    });

    // Read the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productImageURL = urlParams.get('image');

    // If a product image URL is present, set it as the initial try-on image
    if (productImageURL) {
        updateTryonImage(productImageURL);
    }

    startWebcam();
});