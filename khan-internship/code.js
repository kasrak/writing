(function() {
"use strict";
/*jslint browser: true */

function first(array) { return array[0]; }
function last(array) { return array[array.length - 1]; }
function forEach(seq, fn) { Array.prototype.forEach.call(seq, fn); }

function applyToElementsWithClassName(className, fn) {
    forEach(document.getElementsByClassName(className), fn);
}

function VideoPlayer(container) {
    var self = this;
    this.userPaused = false;
    this.isPlaying = false;
    this.container = container;
    this.videoElement = container.getElementsByTagName("video")[0];
    this.playButton = container.getElementsByClassName("play-button")[0];
    this.pauseButton = container.getElementsByClassName("pause-button")[0];

    this.playButton.onclick = function() {
        self.userPaused = false;
        self.play();
    };

    this.pauseButton.onclick = function() {
        self.userPaused = true;
        self.pause();
    };

    this.videoElement.addEventListener("play", function() {
        this.isPlaying = true;
        this.container.classList.add(VideoPlayer.PlayingClass);
    }.bind(this));

    this.videoElement.addEventListener("pause", function() {
        this.isPlaying = false;
        this.container.classList.remove(VideoPlayer.PlayingClass);
    }.bind(this));
}

VideoPlayer.PlayingClass = "playing";

VideoPlayer.prototype.play = function() {
    if (!this.isPlaying) {
        this.videoElement.play();
    }
};

VideoPlayer.prototype.pause = function() {
    if (this.isPlaying) {
        this.videoElement.pause();
    }
};

VideoPlayer.prototype.autoPlay = function() {
    if (!this.userPaused) {
        this.play();
    }
};

var videoPlayers = [];
function setUpVideoPlayer(container) {
    videoPlayers.push(new VideoPlayer(container));
}

var overlayBackground = document.createElement("div");
window.toggleOverlayWithId = function(id) {
    var overlay = document.getElementById(id);
    var classList = overlay.classList;
    var visibleClass = "visible";

    overlayBackground.id = "overlay-background";
    overlayBackground.onclick = function() {
        hideOverlay();
    };

    classList.contains(visibleClass) ?  hideOverlay() : showOverlay();

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
};

document.addEventListener("keyup", function(e) {
    if (e.keyCode == 27) { // Escape
        overlayBackground.click();
    }
});

function throttle(fn, delay) {
    var timer = null;
    var debounced = function() {
        if (timer) {
            return;
        }
        var args = arguments;
        timer = window.setTimeout(function() {
            fn.apply(null, args);
            timer = null;
        }, delay);
    };
    return debounced;
}

var lastScrollY = 0;
var scrollingDown = 1, scrollingUp = -1;
var scrollDirection = scrollingDown;
var scrollChanged = throttle(function() {
    if (Math.abs(lastScrollY - window.scrollY) < 40) {
        // Ignore small changes.
        return;
    }

    scrollDirection = (lastScrollY <= window.scrollY) ? scrollingDown : scrollingUp;
    lastScrollY = window.scrollY;

    var videoPlayersInViewport = [];
    videoPlayers.forEach(function(videoPlayer) {
        var rect = videoPlayer.container.getBoundingClientRect();
        var inViewport = (rect.bottom > 0) &&
            (rect.top < window.innerHeight) &&
            (rect.top > 0) &&
            (rect.bottom < window.innerHeight);

        if (inViewport) {
            videoPlayersInViewport.push(videoPlayer);
        } else {
            videoPlayer.pause();
        }
    });

    var videoToPlay = ((scrollDirection == scrollingDown) ? last : first)(videoPlayersInViewport);
    videoPlayersInViewport.forEach(function(videoPlayer) {
        if (videoPlayer == videoToPlay) {
            videoPlayer.autoPlay();
        } else {
            videoPlayer.pause();
        }
    });
}, 100);

window.addEventListener("scroll", function() {
    scrollChanged();
});

window.addEventListener("load", function() {
    applyToElementsWithClassName("video-player", setUpVideoPlayer);
    applyToElementsWithClassName("tap-to-play",  function(el) {
        el.addEventListener("click", function() {
            el.play();
        });
    });
});

})();
