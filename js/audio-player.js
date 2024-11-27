document.addEventListener('DOMContentLoaded', () => {
    const audioPlayers = document.querySelectorAll('.audio-player');
    
    audioPlayers.forEach(player => {
        const audio = player.querySelector('audio');
        const playIcon = player.querySelector('.play-icon');
        const pauseIcon = player.querySelector('.pause-icon');
        const playButton = player.querySelector('.audio-control');
        const progressBar = player.querySelector('.progress-bar');
        const progress = player.querySelector('.progress');
        const timeDisplay = player.querySelector('.time');

        if (!audio || !playIcon || !pauseIcon || !playButton || !progressBar || !progress || !timeDisplay) return;

        // 格式化时间
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        // 更新进度条和时间显示
        function updateProgress() {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = `${percent}%`;
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }

        // 确保初始状态
        audio.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');

        // 音频加载完成后显示总时长
        audio.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
        });

        function toggleAudio() {
            if (audio.paused) {
                audio.play();
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                audio.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        }

        playButton.addEventListener('click', toggleAudio);

        // 进度条点击事件
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
            updateProgress();
        });

        // 定期更新进度
        audio.addEventListener('timeupdate', updateProgress);

        // 当音频结束时，重置播放按钮
        audio.addEventListener('ended', () => {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            progress.style.width = '0%';
            timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
        });

        // 如果音频加载失败，保持显示播放按钮
        audio.addEventListener('error', () => {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            timeDisplay.textContent = '0:00 / 0:00';
        });
    });
});
