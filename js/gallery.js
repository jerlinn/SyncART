document.addEventListener('DOMContentLoaded', function() {
    // images
    const galleryImages = [
        { small: 'images/gallery_sm_1.png', large: 'images/gallery_lg_1.png' },
        { small: 'images/gallery_sm_2.png', large: 'images/gallery_lg_2.png' },
        { small: 'images/gallery_sm_3.png', large: 'images/gallery_lg_3.png' },
        { small: 'images/gallery_sm_4.png', large: 'images/gallery_lg_4.png' },
        { small: 'images/gallery_sm_5.png', large: 'images/gallery_lg_5.png' },
        { small: 'images/gallery_sm_6.png', large: 'images/gallery_lg_6.png' }
    ];

    let currentIndex = 0;
    const lightbox = createLightbox();
    const lightboxImage = lightbox.querySelector('.lightbox-image');

    // 初始化事件监听
    function initEventListeners() {
        // 图片点击事件
        document.querySelectorAll('.gallery-grid img').forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        // Lightbox 导航事件
        lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(-1);
        });

        lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(1);
        });

        // 关闭 Lightbox
        lightbox.addEventListener('click', closeLightbox);
        lightboxImage.addEventListener('click', (e) => e.stopPropagation());

        // 键盘事件
        document.addEventListener('keydown', handleKeyPress);
    }

    // 创建 Lightbox
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-prev">
                    <img src="images/gallery_arrow-left.svg" alt="Previous">
                </button>
                <img class="lightbox-image" src="" alt="Gallery preview">
                <button class="lightbox-next">
                    <img src="images/gallery_arrow-right.svg" alt="Next">
                </button>
            </div>
        `;
        document.body.appendChild(lightbox);
        return lightbox;
    }

    // 打开 Lightbox
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            lightbox.classList.add('active');
        });
    }

    // 关闭 Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 400); // 等待过渡动画完成
    }

    // 更新 Lightbox 图片
    function updateLightboxImage() {
        lightboxImage.src = galleryImages[currentIndex].large;
    }

    // 导航
    function navigate(direction) {
        currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    // 键盘事件处理
    function handleKeyPress(e) {
        if (!lightbox.classList.contains('active')) return;
        
        const keyActions = {
            'ArrowLeft': () => navigate(-1),
            'ArrowRight': () => navigate(1),
            'Escape': closeLightbox
        };

        keyActions[e.key]?.();
    }

    // 初始化
    initEventListeners();
});