
var videoElement = document.querySelector('video');
var canvas;
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

getStream().then(getDevices).then(gotDevices);

function getDevices() {
  // AFAICT in Safari this only gets default devices until gUM is called :/
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos; // make available to console
  console.log('Available input and output devices:', deviceInfos);
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
      audioSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  }
}
function reload(){
  window.location.reload(false)
}
function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const audioSource = audioSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream, reload).catch(handleError);
  
}


function gotStream(stream) {
  window.stream = stream; // make stream available to console
  audioSelect.selectedIndex = [...audioSelect.options].
    findIndex(option => option.text === stream.getAudioTracks()[0].label);
    
  videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
  videoElement.srcObject = stream;
}

function handleError(error) {
  console.error('Error: ', error);
}

function report() {
      var imagetaken =  document.querySelector('#imagetaken') 
      var canvasplace = document.querySelector('.canvas')
      var newImg = document.createElement('img');
      var context;
      newImg.classList.add('img')
      var img = document.querySelector('.img')

      var width = videoElement.offsetWidth
        , height = videoElement.offsetHeight;;
      canvas = canvas || document.createElement('canvas');
      canvasplace.appendChild(canvas)
      canvas.width = width;
      canvas.height = height;

      context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, width, height);
      
      context = canvas.toDataURL('image/jpeg');
      typeof(context)
      console.log(context)
      let strimgae = toString(context);
      console.log(strimgae)
      savetodb(strimgae)
      canvasplace.style.display = 'hidden';

      const a = document.createElement("a");
      a.href = canvas.toDataURL()
      a.download = 'canvas-img.jpeg' ;
      a.click();
      document.body.removeChild(a);          
}




