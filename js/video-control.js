document.addEventListener('DOMContentLoaded', () => {
    const videoContainer = document.querySelector('.video-container');
    const video = videoContainer.querySelector('video');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const videoControl = document.querySelector('.video-control');
    const progressBar = document.querySelector('.video-progress');
    const progressFilled = document.querySelector('.video-progress-filled');

    if (!video || !playIcon || !pauseIcon || !videoControl || !progressBar || !progressFilled) return;

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

    // 更新进度条
    function updateProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progressFilled.style.width = `${percent}%`;
    }

    // 进度条点击和拖动
    function scrub(e) {
        const scrubTime = (e.offsetX / progressBar.offsetWidth) * video.duration;
        video.currentTime = scrubTime;
    }

    videoControl.addEventListener('click', toggleVideo);
    video.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', scrub);

    let mousedown = false;
    progressBar.addEventListener('mousemove', (e) => mousedown && scrub(e));
    progressBar.addEventListener('mousedown', () => mousedown = true);
    progressBar.addEventListener('mouseup', () => mousedown = false);
    progressBar.addEventListener('mouseleave', () => mousedown = false);

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
