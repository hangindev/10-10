$( document ).ready(function(){
  // Navbar button-collapse
  $(".button-collapse").sideNav();


  navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    // set up basic variables for app
    var record = $('#recButton');
    var stop = $('#stopButton');
    var audioClips = $('#audioClips');
    var flatline = $('#flatline');
    var visualizer = $('#visualizer');
    var canvas = document.querySelector('#visualizer');

    stop.hide();
    visualizer.hide();

    var audioCtx = new (window.AudioContext || webkitAudioContext)();
    var canvasCtx = canvas.getContext("2d");
    //main block for doing the audio recording

    if (navigator.getUserMedia) {
      console.log('getUserMedia supported.');

      var constraints = { audio: true };
      var chunks = [];

      var onSuccess = function(stream) {
        var mediaRecorder = new MediaRecorder(stream);

        visualize(stream);

        record.click( function() {
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          console.log("recorder started");
          flatline.hide();
          visualizer.show();
          record.hide();
          stop.show();
        })

        stop.click( function() {
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          console.log("recorder stopped");
          visualizer.hide();
          flatline.show();
          stop.hide();
          record.show();
        })

        mediaRecorder.onstop = function(e) {
          console.log("data available after MediaRecorder.stop() called.");

          var clipName = prompt('Give a name to your speech','My unnamed speech');

          var clipItem = document.createElement('li');
          var clipContainer = document.createElement('div');
          var clipHeader = document.createElement('div');
          var audio = document.createElement('audio');
          var download = document.createElement('a');

          clipContainer.classList.add('collapsible-body');
          clipHeader.classList.add('collapsible-header','active');
          audio.setAttribute('controls', '');

          if(clipName === null) {
            clipHeader.textContent = 'My unnamed clip';
          } else {
            clipHeader.textContent = clipName;
          }

          download.textContent = 'download';


          clipContainer.appendChild(audio);
          clipContainer.appendChild(download);
          clipItem.appendChild(clipHeader);
          clipItem.appendChild(clipContainer);
          audioClips.prepend(clipItem);
          $(".collapsible").collapsible({accordion: false});

          audio.controls = true;
          var blob = new Blob(chunks, { 'type' : 'audio/wav; ' });
          chunks = [];
          var audioURL = window.URL.createObjectURL(blob);
          audio.src = audioURL;
          download.href = audioURL;
          download.download = ""+".ogg";
          console.log("recorder stopped");
        }

        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        }
      }

      var onError = function(err) {
        console.log('The following error occured: ' + err);
      }

      navigator.getUserMedia(constraints, onSuccess, onError);
    } else {
      console.log('getUserMedia not supported on your browser!');
    }


    function visualize(stream) {
      var source = audioCtx.createMediaStreamSource(stream);

      var analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      //analyser.connect(audioCtx.destination);

      WIDTH = canvas.width
      HEIGHT = canvas.height;

      draw()

      function draw() {

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;


        for(var i = 0; i < bufferLength; i++) {

          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT/2;

          if(i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();

      }
    }

})
