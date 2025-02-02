var instagramButton = document.getElementById("instagram");
var discordButton = document.getElementById("discord");
var youtubeButton = document.getElementById("youtube");
var range = document.getElementById("music_range");
var playButton = document.getElementById('play');
var tag = document.createElement('script');
var hided = false;
var song;

var songs = Config.Songs;

document.addEventListener("DOMContentLoaded", function() {
  updateGameWait();
  document.getElementById('game-loading').innerHTML = Config.GameLoading;
  document.getElementById('owner').innerHTML = Config.Owner;
  document.getElementById('owner-label').innerHTML = Config.OwnerLabel;
  document.getElementById('developer').innerHTML = Config.Developer;
  document.getElementById('developer-label').innerHTML = Config.DeveloperLabel;
  document.getElementById('about-us').innerHTML = Config.AboutUs;
  document.getElementById('about-description').innerHTML = Config.AboutUsDescription;
  document.getElementById('last-updates').innerHTML = Config.LastUpdates; 
  document.getElementById('key-show').innerHTML = Config.ShowHideKeyLabel; 
  document.getElementById('key-show-description').innerHTML = Config.ShowHideKeyDescription;
  document.getElementById('key-music').innerHTML = Config.MusicKeyLabel; 
  document.getElementById('key-music-description').innerHTML = Config.MusicKeyDescription;
  document.getElementById('myPopup').innerHTML = Config.PopUpDescription;

  var youtubeValue = `https://www.youtube.com/embed/${Config.VideoYoutubeLink}?enablejsapi=1&autoplay=1&loop=1`;
  document.getElementById("youtube-player").setAttribute("src", youtubeValue);

  for (var key in Config.UpdateList) {
      if (Config.UpdateList.hasOwnProperty(key)) {
          var update = Config.UpdateList[key];
          var div = document.createElement("div");
          div.textContent = update.label;
          div.className = "update";
          div.style.borderRight = "2px solid " + update.color;
          document.getElementById("updateContainer").appendChild(div);
      }
  }
});

const gameWaitElement = document.getElementById('game-wait');
const gameWaitData = Object.values(Config.GameWait);
let currentIndex = 0;

function updateGameWait() {
  gameWaitElement.innerHTML = gameWaitData[currentIndex].label;
  currentIndex = (currentIndex + 1) % gameWaitData.length;
}

setInterval(updateGameWait, 5000);

var currentSongIndex = 0;
var song = new Audio(songs[currentSongIndex].file);
song.volume = 0.25;

function playCurrentSong() {
  song.src = songs[currentSongIndex].file;
  song.play();
  displayMetadata();
  var playButton = document.getElementById('play');
  playButton.className = 'fas fa-pause';
  playButton.style.borderBottom = '2px solid #42FF6B';
  playButton.style.color = '#42FF6B';
  playButton.style.background = 'linear-gradient(to top, #42FF6B34, transparent)';
}

function updateProgressBar() {
  var progressFill = document.querySelector('.progress-fill');
  var currentTime = song.currentTime;
  var totalTime = song.duration;

  var progressPercentage = (currentTime / totalTime) * 100;
  progressFill.style.width = progressPercentage + '%';

  var currentTimeFormatted = formatTime(currentTime);
  var totalTimeFormatted = formatTime(totalTime);
  document.getElementById('currentTime').textContent = currentTimeFormatted;
  document.getElementById('totalTime').textContent = totalTimeFormatted;
}

function formatTime(timeInSeconds) {
  var minutes = Math.floor(timeInSeconds / 60);
  var seconds = Math.floor(timeInSeconds % 60);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}


function pauseSong() {
  var playButton = document.getElementById('play');
  if (!song.paused) {
      song.pause();
      playButton.className = 'fas fa-play';
      playButton.style.borderBottom = '2px solid #42FF6B';
      playButton.style.color = '#42FF6B';
      playButton.style.background = 'linear-gradient(to top, #42FF6B34, transparent)';
  } else {
      song.play();
      playButton.className = 'fas fa-pause';
      playButton.style.borderBottom = '2px solid #42FF6B';
      playButton.style.color = '#42FF6B';
      playButton.style.background = 'linear-gradient(to top, #42FF6B34, transparent)';
  }
}

function displayMetadata() {
  var currentSong = songs[currentSongIndex];
  document.getElementById('author').textContent = currentSong.author + ' - ' + currentSong.title;
}

function toggleMute() {
  song.muted = !song.muted;
}

function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playCurrentSong();
}

function playPreviousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playCurrentSong();
}

document.getElementById('next').addEventListener('click', playNextSong);
document.getElementById('previous').addEventListener('click', playPreviousSong);
document.getElementById('play').addEventListener('click', pauseSong);
document.getElementById('key-music').addEventListener('click', pauseSong);
document.getElementById('mute').addEventListener('click', toggleMute);

song.addEventListener('timeupdate', updateProgressBar);

playCurrentSong();

function hideOverlay() {

  if(!hided) {
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('overlay').style.background = 'transparent';
    document.getElementById('overlay').style.backdropFilter = 'none';
    hided = true;
  } else {
    document.getElementById('main-container').style.display = 'flex';
    document.getElementById('overlay').style.background = 'radial-gradient(circle at top right, #0c4baa36, rgba(0, 58, 204, 0.50))';
    document.getElementById('overlay').style.backdropFilter = 'blur(.5vw)';
    hided = false;
  }

}

document.addEventListener('keydown', function(event) {
  // Verifica se a tecla pressionada é a tecla F2 (código 113)
  if (event.keyCode === 113) {
      pauseSong();
  }

  if (event.keyCode === 112) {
      hideOverlay()
  }
});


tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var muted = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    player.setVolume(0);

  }

discordButton.addEventListener("click", function() {
  copyToClipboard(Config.DiscordLink);
  showPopup();
});

youtubeButton.addEventListener("click", function() {
  copyToClipboard(Config.YoutubeLink);
  showPopup();
});

instagramButton.addEventListener("click", function() {
    copyToClipboard(Config.InstagramLink);
    showPopup();
});

range.addEventListener("input", function() {
    song.volume = this.value / 100;
  });

function copyToClipboard(text) {
    const body = document.querySelector('body');
    const area = document.createElement('textarea');
    body.appendChild(area);
  
    area.value = text;
    area.select();
    document.execCommand('copy');
  
    body.removeChild(area);
}

function showPopup() {
    var popup = document.getElementById("myPopup");
    popup.classList.add("show");
    setTimeout(function(){
      popup.classList.remove("show");
    }, 3700);
}