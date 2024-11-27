document.addEventListener('DOMContentLoaded', () => {
    const videoContainer = document.querySelector('.video-container');
    const video = videoContainer.querySelector('video');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const videoControl = document.querySelector('.video-control');

    if (!video || !playIcon || !pauseIcon || !videoControl) return;

    // 确保初始状态
    video.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    videoContainer.classList.remove('playing');

    function toggleVideo() {
        if (video.paused) {
            video.play();
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            videoContainer.classList.add('playing');
        } else {
            video.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            videoContainer.classList.remove('playing');
        }
    }

    videoControl.addEventListener('click', toggleVideo);

    // 当视频结束时，显示播放按钮
    video.addEventListener('ended', () => {
        if (!video.loop) {
            video.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            videoContainer.classList.remove('playing');
        }
    });

    // 如果视频加载失败，保持显示占位图和播放按钮
    video.addEventListener('error', () => {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        videoContainer.classList.remove('playing');
    });
});
