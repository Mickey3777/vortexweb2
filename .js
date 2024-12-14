const video = document.getElementById('video');

const canvas = document.getElementById('canvas');

const context = canvas.getContext('2d');

// Acceder a la cámara web

navigator.mediaDevices.getUserMedia({ video: true })

    .then(stream => {

        video.srcObject = stream;

        video.onloadedmetadata = () => {

            video.play();

            detectObjects();

        };

    })

    .catch(err => {

        console.error("Error al acceder a la cámara: ", err);

    });

async function detectObjects() {

    const model = await cocoSsd.load();

    console.log("Modelo cargado");

    const detect = async () => {

        const predictions = await model.detect(video);

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        predictions.forEach(prediction => {

            context.beginPath();

            context.rect(...prediction.bbox);

            context.lineWidth = 2;

            context.strokeStyle = 'red';

            context.fillStyle = 'red';

            context.stroke();

            context.fillText(

                `${prediction.class} (${Math.round(prediction.score * 100)}%)`,

                prediction.bbox[0],

                prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10

            );

        });

        requestAnimationFrame(detect);

    };

    detect();

}
