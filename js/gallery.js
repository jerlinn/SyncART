document.addEventListener('DOMContentLoaded', function() {
    // images
    const galleryImages = [
        { small: 'images/Frame 45142.png', large: 'images/Frame 45142.png' },
        { small: 'images/2.jpg', large: 'images/2.jpg' },
        { small: 'images/Frame 7.jpg', large: 'images/Frame 7.jpg' },
        { small: 'images/4.jpg', large: 'images/4.jpg' },
        { small: 'images/6.jpg', large: 'images/6.jpg' }
    ];

    let currentIndex = 0;
    const lightbox = createLightbox();
    const lightboxImage = lightbox.querySelector('.lightbox-image');

    // 初始化事件监听
    function initEventListeners() {
        // 图片点击事件
        document.querySelectorAll('.details-grid img').forEach((img, index) => {
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

// 独立图片lightbox功能
function openImageLightbox(imageSrc, imageAlt) {
    // 检查是否已经存在image lightbox
    let imageLightbox = document.querySelector('.image-lightbox');
    
    if (!imageLightbox) {
        // 创建image lightbox
        imageLightbox = document.createElement('div');
        imageLightbox.className = 'image-lightbox';
        imageLightbox.innerHTML = `
            <div class="image-lightbox-content">
                <button class="image-lightbox-close">&times;</button>
                <img class="image-lightbox-img" src="" alt="">
            </div>
        `;
        document.body.appendChild(imageLightbox);
        
        // 添加关闭事件
        imageLightbox.addEventListener('click', closeImageLightbox);
        imageLightbox.querySelector('.image-lightbox-img').addEventListener('click', (e) => e.stopPropagation());
        imageLightbox.querySelector('.image-lightbox-close').addEventListener('click', closeImageLightbox);
        
        // 添加ESC键支持
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && imageLightbox.classList.contains('active')) {
                closeImageLightbox();
            }
        });
    }
    
    // 设置图片
    const img = imageLightbox.querySelector('.image-lightbox-img');
    img.src = imageSrc;
    img.alt = imageAlt;
    
    // 显示lightbox
    document.body.style.overflow = 'hidden';
    imageLightbox.classList.add('active');
}

function closeImageLightbox() {
    const imageLightbox = document.querySelector('.image-lightbox');
    if (imageLightbox) {
        imageLightbox.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 400);
    }
}