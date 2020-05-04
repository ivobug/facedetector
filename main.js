const video=document.getElementById("video")
let predictedAges=[]

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('/weights'),
    faceapi.nets.ageGenderNet.loadFromUri('/weights')

]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        {
            video:{}
        },
        stream=>video.srcObject=stream,
        err=>console.log(err)

    )
}


video.addEventListener('play', ()=>{
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize={ width:video.width, height:video.height}
    faceapi.matchDimensions(canvas,displaySize)
    setInterval(async()=>{
        const detections= await faceapi.detectAllFaces(video, 
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
        const resizedDetections=faceapi.resizeResults(detections,displaySize)
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


        // console.log(detections[0].age, detections[0].gender)    
        if(detections[0]){
            console.log(`Godine: ${Math.round(detections[0].age)},spol: ${detections[0].gender}`)
        }
        // console.log(resizedDetections);

    },100)
})
