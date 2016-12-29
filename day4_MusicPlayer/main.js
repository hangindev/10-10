var audio;

//Hide Pause
$('#pause').hide();

//Initialization
initAudio($('#playlist tr:first-child'));

function initAudio(element){
  var src = element.attr('src');
  var title = element.attr('title');
  var cover = element.attr('cover');
  var artist = element.attr('artist');

  //Create a New Audio Object
  audio = new Audio(src);
  audio.onended = function() {
    $( "#next" ).click();
  };

  $('#title').text(title);
  $('#artist').text(artist);

  //Insert Cover Image
  $('#cover').attr('src','cover/' + cover);

  $('#playlist tr').removeClass('active');
  element.addClass('active');
}

//Play Function
$('#play').click(function(){
  audio.play();
  $('#play').hide();
  $('#pause').show();
  showDuration();
});

//Pause Function
$('#pause').click(function(){
  audio.pause();
  $('#pause').hide();
  $('#play').show();
});

//Stop Function
$('#stop').click(function(){
  audio.pause();
  audio.currentTime = 0;
  $('#pause').hide();
  $('#play').show();
});

//Next Function
$('#next').click(function(){
  audio.pause();
  var next = $('#playlist tr.active').next();
  if (next.length == 0) {
    next = $('#playlist tr:first-child');
  }
  initAudio(next);
  audio.play();
  showDuration();
});

skip = function(){
  audio.pause();
  var next = $('#playlist tr.active').next();
  if (next.length == 0) {
    next = $('#playlist tr:first-child');
  }
  initAudio(next);
  audio.play();
  showDuration();
};

//Prev Function
$('#prev').click(function(){
  audio.pause();
  var prev = $('#playlist tr.active').prev();
  if (prev.length == 0) {
    prev = $('#playlist tr:last-child');
  }
  initAudio(prev);
  audio.play();
  showDuration();
});

//Playlist Click Function
$('#playlist tr').click(function () {
  audio.pause();
  initAudio($(this));
  $('#play').hide();
  $('#pause').show();
  audio.play();
  showDuration();
});

//Update progress bar
function showDuration(){
  $(audio).bind('timeupdate', function(){
    var value = 0;
    if (audio.currentTime > 0) {
      value = Math.floor((100 / audio.duration) * audio.currentTime);
    }
    $('#progress').attr('value',value);
  });
}
