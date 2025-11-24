function openWorkModal(work) {
    const modal = document.createElement('div');
    modal.className = 'work-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2 class="modal-title">${work.title}</h2>
            ${work.video ? `
                <div class="modal-video">
                    <iframe 
                        src="${getYouTubeEmbedUrl(work.video)}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            ` : ''}
            <div class="modal-description">
                <p>${work.description || 'No description available.'}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    document.body.style.overflow = 'hidden';
}

function getYouTubeEmbedUrl(url) {
    if (!url) return '';

    let videoId = '';
    
    // https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
        videoId = watchMatch[1];
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
}

async function loadPortfolio() {
    try {
        const response = await fetch('works.json');
        const works = await response.json();
        
        const portfolioGrid = document.querySelector('.portfolio-grid');
        
        if (!portfolioGrid) {
            console.error('Portfolio grid not found');
            return;
        }
        
        const category = portfolioGrid.getAttribute('data-category');
        
        let filteredWorks = works;
        if (category) {
            filteredWorks = works.filter(work => work.category === category);
        }
        
        portfolioGrid.innerHTML = '';
        
        if (filteredWorks.length === 0) {
            portfolioGrid.innerHTML = '<p style="text-align: center; color: #999;">WIP</p>';
            return;
        }

        filteredWorks.forEach(work => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.style.cursor = 'pointer';
            
            portfolioItem.innerHTML = `
                <img src="${work.image}" alt="${work.alt}" class="portfolio-image" onerror="this.src='https://via.placeholder.com/600x400'">
                <div class="portfolio-overlay">
                    <h3 class="portfolio-title">${work.title}</h3>
                </div>
            `;
            
            portfolioItem.addEventListener('click', () => {
                openWorkModal(work);
            });
            
            portfolioGrid.appendChild(portfolioItem);
        });
    } catch (error) {
        console.error('Error loading portfolio:', error);
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = '<p style="text-align: center; color: #999;">Unable to load portfolio items.</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', loadPortfolio);

