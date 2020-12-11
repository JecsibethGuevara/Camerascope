
var videoElement = document.querySelector('.videocamera');
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




function saveordel(){
    const a = document.createElement("a");
      a.href = canvas.toDataURL()
      a.download = 'canvas-img.jpeg' ;
      a.click();
      document.body.removeChild(a);
}

class Image{
  constructor(base){
    this.base =  base;
  }
}

class UI{
  static displayImages(){
    const images = Local.getPic();
    images.forEach((image) => UI.addImageToDiv(image))
  }

  static addImageToDiv(image){
    var divimages = document.querySelector('.images')
    var div = document.createElement('div')
    div.innerHTML = `
      <img class="showcase" src="${image.base}">
      <form class = "inline" action="/savetodb" method="POST">
        <input  name="patient"  id="savewp" class=hide small save">
        <input  name="image"  id="save" class=hide small save">
        <button type="submit" class=btn save-btn small> Guardar </button>
      </form>
    `
    divimages.appendChild(div)
    var inputs = document.querySelectorAll('#save')
    var patientId = document.querySelectorAll('#savewp')
    var IdPatient = document.querySelector('#IdPacienteSelect')
    console.log(IdPatient.value)
    patientId.forEach(image =>{
      image.value = IdPatient.value
    })
    inputs.forEach(input => {
      input.value = image.base
    });
    console.log(patientId.value)
    var saveAlert = document.querySelectorAll('.save-btn')

    saveAlert.forEach(save =>{
      UI.ShowAlert('Imagen Guardada', 'success')
    })
    
  }
  
  static showAlert(message, className){
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.patients-list');
    const form = document.querySelector('.save-btn');
    container.insertBefore(div, form);

    //vanish

    setTimeout(() => document.querySelector('.alert').remove(), 800);
  }
}

class Local {
  static getPic(){
    let images;
    if(localStorage.getItem('images') === null){
      images = []
    }else{
      images =  JSON.parse(localStorage.getItem('images'))
    }
    return images
  } 

  static addImage(image){
    const images =  Local.getPic();
    images.push(image);
    localStorage.setItem('images', JSON.stringify(images))
  }

  static removeImage(base){
    const images = Local.getPic();
    images.forEach((image, index) =>{
      if(image.base === base){
        images.splice(index, 1);
      }
    });

    localStorage.setItem('images', JSON.stringify(images))
  }


}

function report() {
  var divimages = document.querySelector('.images')
  var canvaspace =  document.createElement('div')
  divimages.appendChild(canvaspace)
  canvaspace.classList.add('canvas')
  
  var canvasplace = document.querySelector('.canvas')
  var width = videoElement.offsetWidth,
   height = videoElement.offsetHeight;;
  canvas = canvas || document.createElement('canvas');
  canvasplace.appendChild(canvas)
  canvas.width = 1240;
  canvas.height = 1000;

  context = canvas.getContext('2d');
  context.drawImage(videoElement, 0, 0,1240, 1000);
  
  context = canvas.toDataURL('image/jpeg'); 
  canvas.classList.add('hide')
  
  const base = context;
  const image = new Image(base);

  Local.addImage(image);
  UI.addImageToDiv(image)
  
}

