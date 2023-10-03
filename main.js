const container = document.querySelector('.container');
const searchBox = document.querySelector('.search-box');
const searchButton = document.querySelector('.search-button');

function displayResults(results, listContainer) {
    const fragment = document.createDocumentFragment(); // إنشاء DocumentFragment

    if (results.length === 0) {
        const noResultsElement = document.createElement('div');
        noResultsElement.classList.add('no-results');
        noResultsElement.innerText = 'لا توجد نتائج';
        fragment.appendChild(noResultsElement);
    } else {
        results.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('media');

            const imageElement = document.createElement('img');
            if (item.image) {
                imageElement.setAttribute('src', item.image);
                imageElement.setAttribute('loading', 'lazy'); // إضافة lazy loading
            } else {
                imageElement.setAttribute('src', 'https://i.postimg.cc/BZ55bjyX/image.png');
            }

            const titleElement = document.createElement('div');
            titleElement.classList.add('media-title');
            titleElement.innerText = item.title;

            const englishTitleElement = document.createElement('div');
            englishTitleElement.classList.add('english-title');
            englishTitleElement.innerText = item.englishTitle || '';

            const buttonElement = document.createElement('button');
            buttonElement.classList.add('play-button');
            buttonElement.innerText = 'تشغيل';

            buttonElement.addEventListener('click', () => {
                openVideoPage(item.link);
          addToRecentlyWatched(item);
            });

            itemElement.appendChild(imageElement);
            itemElement.appendChild(titleElement);
            itemElement.appendChild(englishTitleElement);
            itemElement.appendChild(buttonElement);

            fragment.appendChild(itemElement);
        });
    }
    listContainer.innerHTML = '';
    listContainer.appendChild(fragment);
}

function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';
}

// إخفاء عنصر الـ Loading Overlay
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'none';
}

function searchMedia() {
    const searchTerm = searchBox.value.toLowerCase();
    showLoadingOverlay();
    fetch("https://raw.githubusercontent.com/Momotv10/Momh/main/V1234.m3u")
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            let mediaList = [];
            let currentMedia = {};

            lines.forEach(line => {
                if (line.startsWith('#EXTINF')) {
                    if (currentMedia.title) {
                        mediaList.push(currentMedia);
                    }
                    currentMedia = {};
                    currentMedia.title = line.split(',')[1]; // لا تقوم بتحويله إلى حالة صغيرة هنا
                    if (line.includes('tvg-name')) {
                        currentMedia.englishTitle = line.split('tvg-name="')[1].split('"')[0].toLowerCase();
                    }
                    if (line.includes('tvg-logo')) {
                        const imageLink = line.split('tvg-logo="')[1].split('"')[0];
                        if (imageLink.endsWith('.png') || imageLink.endsWith('.jpg') || imageLink.endsWith('.jpeg')) {
                            currentMedia.image = imageLink;
                        }
                    }
                } else if (line.startsWith('http')) {
                    currentMedia.link = line;

                    // Check if the URL line doesn't contain any of the specified formats
                    if (!/\.(ts|mkv|mp4|hls|m3u8|webm)/.test(currentMedia.link)) {
                        currentMedia.link += '.m3u8'; // Add ".m3u8" as the default format
                    }

                    if (line.includes("live")) {
                        currentMedia.category = "قنوات";
                    }
                    // Check if the URL contains "movie" to categorize it as a movie
                    else if (line.includes("movie")) {
                        currentMedia.category = "أفلام";
                    }
                    // Check if the URL contains "مسلسل" to categorize it as a TV series
                    else if (line.includes("series")) {
                        currentMedia.category = "مسلسلات";
                    }
                    hideLoadingOverlay();
                }
            });

            if (currentMedia.title) {
                mediaList.push(currentMedia);
            }

            const filteredMedia = mediaList.filter(item => {
                return item.title.includes(searchTerm) || (item.englishTitle && item.englishTitle.includes(searchTerm));
            });

            displayResults(filteredMedia, container);
        });
}

    function playMedia(mediaLink) {
      if (player) {
        player.dispose();
      }

      container.innerHTML = '';

      const mediaElement = document.createElement('div');
      mediaElement.classList.add('media');

      const playerElement = document.createElement('video');
      playerElement.setAttribute('id', 'media-player');
      playerElement.classList.add('video-js', 'vjs-default-skin');
      playerElement.setAttribute('controls', true);

      const sourceElement = document.createElement('source');
      sourceElement.setAttribute('src', mediaLink);
      sourceElement.setAttribute('type', 'video/mp4');

      playerElement.appendChild(sourceElement);
      mediaElement.appendChild(playerElement);
      container.appendChild(mediaElement);

      player = videojs('media-player');
    }

    let player;

    fetch("https://raw.githubusercontent.com/Momotv10/Momh/main/V1234.m3u")
        .then(response => response.text())
        .then(data => {
                const lines = data.split('\n');
                let mediaList = [];
                let currentMedia = {};
    
                lines.forEach(line => {
                    if (line.startsWith('#EXTINF')) {
                        if (currentMedia.title) {
                            mediaList.push(currentMedia);
                        }
                        currentMedia = {};
                        currentMedia.title = line.split(',')[1]; // لا تقوم بتحويله إلى حالة صغيرة هنا
                        if (line.includes('tvg-name')) {
                            currentMedia.englishTitle = line.split('tvg-name="')[1].split('"')[0].toLowerCase();
                        }
                        if (line.includes('tvg-logo')) {
                        const imageLink = line.split('tvg-logo="')[1].split('"')[0];
                        if (imageLink.endsWith('.png') || imageLink.endsWith('.jpg') || imageLink.endsWith('.jpeg')) {
                            currentMedia.image = imageLink;
                        }
                    }
                    } else if (line.startsWith('http')) {
                        currentMedia.link = line;
    
                        // Check if the URL line doesn't contain any of the specified formats
                        if (!/\.(ts|mkv|mp4|hls|m3u8|webm)/.test(currentMedia.link)) {
                            currentMedia.link += '.m3u8'; // Add ".m3u8" as the default format
                        }
    
                        if (line.includes("live")) {
                            currentMedia.category = "قنوات";
                        }
                        // Check if the URL contains "movie" to categorize it as a movie
                        else if (line.includes("movie")) {
                            currentMedia.category = "أفلام";
                        }
                        // Check if the URL contains "مسلسل" to categorize it as a TV series
                        else if (line.includes("series")) {
                            currentMedia.category = "مسلسلات";
                        }
                        hideLoadingOverlay();
                    }
                });
    
            if (currentMedia.title) {
                mediaList.push(currentMedia);
            }
    
            
            const initialChannels = mediaList.filter(item => item.category === 'قنوات').slice(0, 6); // اختر عدد القنوات التي ترغب في عرضها
            const channelListContainer = document.querySelector('.channel-list'); // تغيير اسم القائمة حسب القسم
            displayResults(initialChannels, channelListContainer);
            const initialSeries = mediaList.filter(item => item.category === 'مسلسلات').slice(0, 6); // اختر عدد المسلسلات التي ترغب في عرضها
            const seriesListContainer = document.querySelector('.series-list'); // تغيير اسم القائمة حسب القسم
            displayResults(initialSeries, seriesListContainer);
            const initialMovies = mediaList.filter(item => item.category === 'أفلام').slice(0, 6); // اختر عدد الأفلام التي ترغب في عرضها
            const movieListContainer = document.querySelector('.movie-list'); // تغيير اسم القائمة حسب القسم
            displayResults(initialMovies, movieListContainer);
        });
searchButton.addEventListener('click', searchMedia);
searchBox.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        searchMedia();
    }
});
function openVideoPage(videoLink) {
    const videoPageUrl = 'http://momotvvvvv.wuaze.com/video-page.html?videoLink=' + encodeURIComponent(videoLink);
    window.open(videoPageUrl, '_blank');
}
    function displayResults(results) {
        // ...
    
        // إعداد قوائم القنوات والمسلسلات والأفلام
        const channelsList = document.querySelector('.channel-list');
        const seriesList = document.querySelector('.series-list');
        const movieList = document.querySelector('.movie-list');
    
        results.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.classList.add('media');
    
            const imageElement = document.createElement('img');
            if (item.image) {
                imageElement.setAttribute('src', item.image);
            } else {
                imageElement.setAttribute('src', 'https://i.postimg.cc/BZ55bjyX/image.png'); 
            }
    
            const titleElement = document.createElement('div');
            titleElement.classList.add('media-title');
            titleElement.innerText = item.title;
    
            const englishTitleElement = document.createElement('div');
            englishTitleElement.classList.add('english-title');
            englishTitleElement.innerText = item.englishTitle || '';
    
            const buttonElement = document.createElement('button');
            buttonElement.classList.add('play-button');
            buttonElement.innerText = 'تشغيل';
    
            buttonElement.addEventListener('click', () => {
                openVideoPage(item.link);
                addToRecentlyWatched(item);
            });
    
            itemElement.appendChild(imageElement);
            itemElement.appendChild(titleElement);
            itemElement.appendChild(englishTitleElement);
            itemElement.appendChild(buttonElement);
    
            // تحديد القائمة المناسبة بناءً على الفئة
            if (item.category === 'قنوات') {
                channelsList.appendChild(itemElement);
            } else if (item.category === 'مسلسلات') {
                seriesList.appendChild(itemElement);
            } else if (item.category === 'أفلام') {
                movieList.appendChild(itemElement);
            }
        });
    }
    const channelsButton = document.getElementById('channels-button');
    const seriesButton = document.getElementById('series-button');
    const moviesButton = document.getElementById('movies-button');
    
    channelsButton.addEventListener('click', () => {
        window.location.href = 'ch.html'; // قم بتغيير الرابط إلى الصفحة الفرعية للقنوات
    });
    
    seriesButton.addEventListener('click', () => {
        window.location.href = 'se.html'; // قم بتغيير الرابط إلى الصفحة الفرعية للمسلسلات
    });
    
    moviesButton.addEventListener('click', () => {
        window.location.href = 'mo.html'; // قم بتغيير الرابط إلى الصفحة الفرعية للأفلام
    });
    
const watchedList = document.querySelector('.watched-list');
const watchedMediaList = document.querySelector('.watched-media-list');
const MAX_WATCHED_ITEMS = 3; // تحديد الحد الأقصى لعناصر المشاهدة الأخيرة
let recentlyWatched = [];

function addToRecentlyWatched(item) {
    recentlyWatched.unshift(item); // إضافة العنصر إلى بداية القائمة

    if (recentlyWatched.length > MAX_WATCHED_ITEMS) {
        recentlyWatched.pop(); // إزالة أقدم عنصر إذا تجاوز الحد الأقصى
    }
    localStorage.setItem('recentlyWatched', JSON.stringify(recentlyWatched));


    updateRecentlyWatchedList();
}

function updateRecentlyWatchedList() {
    watchedMediaList.innerHTML = ''; // مسح القائمة الحالية

    recentlyWatched.forEach(item => {
                const listItem = document.createElement('li');
                listItem.classList.add('media');

                const imageElement = document.createElement('img');
                if (item.image) {
                    imageElement.setAttribute('src', item.image);
                } else {
                    imageElement.setAttribute('src', 'https://i.postimg.cc/BZ55bjyX/image.png');
                }

                const titleElement = document.createElement('div');
                titleElement.classList.add('media-title');
                titleElement.innerText = item.title;

                const englishTitleElement = document.createElement('div');
                englishTitleElement.classList.add('english-title');
                englishTitleElement.innerText = item.englishTitle || '';

                const buttonElement = document.createElement('button');
                buttonElement.classList.add('play-button');
                buttonElement.innerText = 'تشغيل';

                buttonElement.addEventListener('click', () => {
                    openVideoPage(item.link);
                });

                listItem.appendChild(imageElement);
                listItem.appendChild(titleElement);
        listItem.appendChild(englishTitleElement);
        listItem.appendChild(buttonElement);

        watchedMediaList.appendChild(listItem);
    });
}
window.onload = function() {
    // استعادة قائمة المشاهدة الأخيرة من مخزن الويب المحلي
    const savedRecentlyWatched = localStorage.getItem('recentlyWatched');
    if (savedRecentlyWatched) {
        recentlyWatched = JSON.parse(savedRecentlyWatched);
        updateRecentlyWatchedList(); // تحديث القائمة على الصفحة
    }
};