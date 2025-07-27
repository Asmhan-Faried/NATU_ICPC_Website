var videoBtns = document.querySelectorAll(".video-btn");
var popups = document.querySelectorAll(".video-popup");
var closeBtns = document.querySelectorAll(".close-vid");

videoBtns.forEach(function(btn) {
    btn.addEventListener('click', function(event) {
        event.preventDefault();
        var videoClass = btn.getAttribute('data-video');
        var popup = document.querySelector('.video-popup[data-popup="' + videoClass + '"]');
        
        popup.style.display = "flex";
    });
});

closeBtns.forEach(function(closeBtn) {
    closeBtn.addEventListener('click', function() {
        var popup = closeBtn.closest('.video-popup');
        popup.style.display = "none";
    });
});

window.onclick = function(event) {
    popups.forEach(function(popup) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
};
