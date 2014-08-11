function shuffleArray(array) {
    // In-place Fisher-Yates
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.round(Math.random() * i);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function randomizeList(listElement) {
    var listItems = Array.prototype.slice.call(
        listElement.getElementsByTagName("li"));

    shuffleArray(listItems);

    listItems.forEach(function(item) {
        listElement.removeChild(item);
        listElement.appendChild(item);
    });
}

function horizontallyCenterOnPage(element) {
}

function applyToElementsWithClassName(className, fn) {
    Array.prototype.forEach.call(
        document.getElementsByClassName(className),
        fn);
}

function setUpVideoPlayer(videoPlayer) {
    var videoElements = videoPlayer.getElementsByTagName("video");
    var playButton = videoPlayer.getElementsByClassName("play-button")[0];
    var pauseButton = videoPlayer.getElementsByClassName("pause-button")[0];
    var playingClass = "playing";

    playButton.onclick = function() {
        videoPlayer.classList.add(playingClass);
        Array.prototype.forEach.call(videoElements, function(video) {
            video.play();
        });
    };

    pauseButton.onclick = function() {
        videoPlayer.classList.remove(playingClass);
        Array.prototype.forEach.call(videoElements, function(video) {
            video.pause();
        });
    };
}

var overlayBackground = document.createElement("div");
function toggleOverlayWithId(id) {
    var overlay = document.getElementById(id);
    var classList = overlay.classList;
    var visibleClass = "visible";

    overlayBackground.id = "overlay-background";
    overlayBackground.onclick = function() {
        hideOverlay();
    };

    if (classList.contains(visibleClass)) {
        hideOverlay();
    } else {
        showOverlay();
    }

    function showOverlay() {
        classList.add(visibleClass);
        if (!document.body.contains(overlayBackground)) {
            document.body.appendChild(overlayBackground);
        }
    }

    function hideOverlay() {
        classList.remove(visibleClass);
        if (document.body.contains(overlayBackground)) {
            document.body.removeChild(overlayBackground);
        }
    }
}

window.addEventListener("load", function() {
    applyToElementsWithClassName("randomize-list", randomizeList);
    applyToElementsWithClassName("horizontally-center-on-page", horizontallyCenterOnPage);
    applyToElementsWithClassName("video-player", setUpVideoPlayer);
});
