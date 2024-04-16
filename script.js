// Get DOM elements
const playPausedBtn = document.querySelector('.play-paused-btn');

const videoContainer = document.querySelector('.video-container');

const stopBtn = document.getElementById('stopBtn');

const theaterBtn = document.querySelector('.theater-btn');

const fullScreenBtn = document.querySelector('.full-screen-btn');

const miniPlayerBtn = document.querySelector('.mini-player-btn');

const video = document.querySelector("video")

const playingBtn = document.querySelector(".playing-btn");



//timeline
const timelineContainer = document.querySelector(".timeline-container");

const previewImg = document.querySelector(".preview-img");

const thumbnailImg = document.querySelector(".thumbnail-img");


timelineContainer.addEventListener("mousemove", timelineUpdate)

function timelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect()
   
    const percent =Math.min(Math.max(0, e.x - rect.x),rect.width) /rect.width
   
    timelineContainer.style.setProperty("--preview-position", percent)
   console.log(e)
   
   if(isScrubbing) {
      e.preventDefault()
     // thumbnailImg = previewImg.src
      
     timelineContainer.style.setProperty("--progress-position", percent)
   }
}

timelineContainer.addEventListener("mousedown", toggleScrubbing)

let isScrubbing = false;
let wasPaused;

function toggleScrubbing(e) {
    
const rect = timelineContainer.getBoundingClientRect()
   
    const percent =Math.min(Math.max(0, e.x - rect.x),rect.width) /rect.width
   
    isScrubbing =(e.buttons & 1) ===1
    
    videoContainer.classList.toggle("scrubbing", isScrubbing)
    
    if(isScrubbing) {
        wasPaused = video.paused
        video.pause()
    }else{
        video.currentTime = percent*video.duration
        if(!wasPaused) video.play()
    }
    
    timelineUpdate(e)
}

document.addEventListener("mouseup", e=>{
    if(isScrubbing) toggleScrubbing(e)
})

document.addEventListener("mousemove", e=>{
    if(isScrubbing) timelineUpdate(e)
})




//volume mode
const mutedBtn = document.querySelector(".muted-btn");
const volumeSlider = document.querySelector(".volume-slider");


mutedBtn.addEventListener("click", ()=>{
    video.muted =!video.muted
})


volumeSlider.addEventListener("input", e=>{
    video.volume
    video.muted
    
    video.volume = e.target.value
    video.muted = e.target.value ===0
})

video.addEventListener("volumechange",()=>{
    volumeSlider.value = video.volume
    
    let volumeLevel;
    
    if(video.muted || video.volume ===0) {
        volumeSlider.value= 0
        volumeLevel = "muted"
    } else if(video.volume >= .5) {
        volumeLevel = "high"
    } else {
        volumeLevel ="low"
    }
    
    videoContainer.dataset.volumeLevel = volumeLevel
})



// Function to simulate playing the video
function playPauseVideo() {
  video.paused? video.play(): video.pause()
}

video.addEventListener("play", ()=>{
    videoContainer.classList.add("paused")
})

video.addEventListener("pause", ()=>{
    videoContainer.classList.remove("paused")
})

playingBtn.addEventListener("click", ()=>{
    console.log("button is clicked")
    playPauseVideo()
    
})

//video.addEventListener("click", playPauseVideo)


//keydown on document
document.addEventListener("keydown", e=>{
    const tagName = e.activeElement.tagName.toLowerCase()
    
    if (tagName == 'input') return
    switch (e.key.toLowerCase()) {
        case 'k':
    if (target == "button") return
        case ' ':
            playPauseVideo()
            break;
        
    }
})


// Function to simulate theater Mode

function theaterMode() {
  videoContainer.classList.toggle("theater")
}

// Full Screen Mode
function fullScreenMode() {
  
  if(document.fullscreenElement != null){
      document.exitFullscreen()
  }else{
      videoContainer.requestFullscreen()
  }
  
}


document.addEventListener("fullscreenchange", ()=>{
    videoContainer.classList.toggle("full-screen", document.fullscreenElement)
})

//mini player Mode
miniPlayerBtn.addEventListener("click", toggleMiniPlayer)

function toggleMiniPlayer() {
    if(videoContainer.classList.contains("mini-player")){
        document.exitPictureInPicture()
    }else {
        video.requestPictureInPicture()
    }
}


// Function to simulate stopping the video
function stopVideo() {
  console.log('Stopping video:', videoURL);
}


// Add event listeners to the buttons
playPausedBtn.addEventListener('click', playPauseVideo);

theaterBtn.addEventListener('click', theaterMode);

fullScreenBtn.addEventListener('click', fullScreenMode);

//stopBtn.addEventListener('click', stopVideo);






// duration

const currentTimeElem = document.querySelector(".current-time");
const totalTimeElem = document.querySelector(".total-time")


const leadingZero = new Intl.NumberFormat(undefined, {minimumIntegerDigits:2, })

video.addEventListener("loadeddata",()=>{
    totalTimeElem.textContent = formatDuration(video.duration)
})

video.addEventListener("timeupdate", ()=>{
    currentTimeElem.textContent = formatDuration(video.currentTime)
    
    const percent = video.currentTime/video.duration
timelineContainer.style.setProperty("--progress-position", percent)

})

function formatDuration(time) {
    let seconds = Math.floor(time % 60)
    let minutes = Math.floor(time /60)%60
    let hours = Math.floor(time/3600)
    
    if (hours === 0) {
        return `${minutes}:${leadingZero.format(seconds)}`
    } else {
    return `${hours}:${leadingZero.format(minutes)}:${leadingZero.format(seconds)}`
    }
}


//speedBtn

const speedBtn = document.querySelector(".speed-btn")

speedBtn.addEventListener("click", togglePlayBack)

function togglePlayBack(){
    let newplaybackRate = video.playbackRate + .25
    
    if(newplaybackRate>2) newplaybackRate = .25
    video.playbackRate = newplaybackRate
    speedBtn.textContent = `${newplaybackRate}x`
}
