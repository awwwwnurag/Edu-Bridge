const THEME_KEY = 'eduBridgeTheme';

// Mouse tracking for floating icons interaction
let mouseX = 0;
let mouseY = 0;

const updateMousePosition = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Update CSS custom properties for cursor position
  document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
  
  // Debug: log mouse position
  console.log('Mouse position:', mouseX, mouseY);
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize mouse tracking
  document.addEventListener('mousemove', updateMousePosition);
  
  // Set initial mouse position
  document.documentElement.style.setProperty('--mouse-x', '0');
  document.documentElement.style.setProperty('--mouse-y', '0');
  
  // Theme setup
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  document.body.dataset.theme = savedTheme;

  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-toggle-icon');

  const syncIcon = () => {
    const isDark = document.body.dataset.theme === 'dark';
    if (themeIcon) themeIcon.textContent = isDark ? '🌙' : '🌞';
  };
  syncIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      document.body.dataset.theme = next;
      localStorage.setItem(THEME_KEY, next);
      syncIcon();
    });
  }

  // User menu
  const menu = document.querySelector('.user-dropdown');
  const userBtn = document.querySelector('.user-button');
  
  console.log('Menu elements found:', { menu: !!menu, userBtn: !!userBtn });

  const closeMenu = () => {
    if (menu) menu.classList.remove('open');
    if (userBtn) userBtn.setAttribute('aria-expanded', 'false');
  };

  if (userBtn && menu) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !menu.classList.contains('open');
      if (open) {
        menu.classList.add('open');
      } else {
        menu.classList.remove('open');
      }
      userBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== userBtn) {
        closeMenu();
      }
    });

    menu.addEventListener('click', (e) => {
      const item = e.target.closest('.user-dropdown-item');
      if (!item) return;
      const action = item.dataset.action;
      if (action === 'logout') {
        console.log('Logout button clicked!');
        
        // Clear all authentication data
        localStorage.removeItem('eduBridgeToken');
        localStorage.removeItem('eduBridgeEmail');
        localStorage.removeItem('eduBridgeName');
        localStorage.removeItem('eduBridgeAuthSeen');
        
        console.log('Auth data cleared from localStorage');
        
        // Reset user avatar to default
        const avatarElements = document.querySelectorAll('.user-avatar-initial');
        console.log('Found avatar elements to reset:', avatarElements.length);
        avatarElements.forEach(avatar => {
          avatar.textContent = 'P';
        });
        
        console.log('User logged out, redirecting to login page');
        
        // Redirect to login page
        window.location.href = 'login.html';
      }
      // account/settings are stubs for now
      closeMenu();
    });
  }

  // Video library functionality disabled
  // if (document.querySelector('.video-library')) {
  //   initializeVideoLibrary();
  // }

  // Initialize Magnet Brains video functionality
  if (document.querySelector('.video-library')) {
    initializeMagnetBrainsVideos();
  }

  // Initialize reading room functionality
  if (document.querySelector('.reading-room')) {
    initializeReadingRoom();
  }
});

// Magnet Brains Video Functionality
function initializeMagnetBrainsVideos() {
  console.log('Initializing Magnet Brains videos...');
  
  // Add click handlers to video buttons
  const watchButtons = document.querySelectorAll('.video-card button[data-video-id]');
  console.log(`Found ${watchButtons.length} Magnet Brains video buttons`);
  
  watchButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const videoCard = button.closest('.video-card');
      const title = videoCard.querySelector('h3').textContent;
      const videoId = button.getAttribute('data-video-id');
      
      console.log(`Magnet Brains video clicked: ${title} (ID: ${videoId})`);
      
      // Open YouTube video in new tab
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      console.log(`Opening YouTube video: ${youtubeUrl}`);
      window.open(youtubeUrl, '_blank');
    });
  });
  
  // Add search functionality
  const searchInput = document.querySelector('.search-field input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const videoCards = document.querySelectorAll('.video-card');
      
      videoCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const subjectPills = Array.from(card.querySelectorAll('.pill')).map(pill => pill.textContent.toLowerCase());
        
        const matchesSearch = title.includes(query) || 
                             description.includes(query) || 
                             subjectPills.some(subject => subject.includes(query));
        
        if (matchesSearch) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
  
  // Add subject filter functionality
  const subjectFilter = document.querySelector('.search-field select');
  if (subjectFilter) {
    subjectFilter.addEventListener('change', (e) => {
      const selectedSubject = e.target.value;
      const videoCards = document.querySelectorAll('.video-card');
      
      videoCards.forEach(card => {
        const subjectPills = Array.from(card.querySelectorAll('.pill'));
        const hasSubject = selectedSubject === 'All Subjects' || 
                          subjectPills.some(pill => pill.textContent === selectedSubject);
        
        if (hasSubject) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

// Reading Room Functionality
function initializeReadingRoom() {
  console.log('Initializing Reading Room...');
  
  // Add click handlers to textbook buttons
  const readButtons = document.querySelectorAll('.book-card button');
  console.log(`Found ${readButtons.length} textbook buttons`);
  
  readButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const bookCard = button.closest('.book-card');
      const title = bookCard.querySelector('h3').textContent;
      const bookInfo = bookCard.querySelector('.book-link').textContent;
      const bookMeta = bookCard.querySelector('.book-meta').textContent;
      
      console.log(`Textbook clicked: ${title}`);
      
      // Extract chapter information
      const grade = bookInfo.match(/Grade (\d+)/)?.[1];
      const chapter = bookInfo.match(/Chapter (\d+|\d+)/)?.[1] || bookInfo.match(/अध्याय (\d+)/)?.[1];
      const subject = getSubjectFromTitle(title);
      
      if (grade && subject) {
        const pdfUrl = getNCERTPdfUrl(subject, grade);
        console.log(`Opening NCERT PDF: ${title}`);
        
        // Open PDF directly without any messages
        window.open(pdfUrl, '_blank');
      } else {
        // Fallback: open NCERT portal if specific info not found
        window.open('https://ncert.nic.in/textbook/', '_blank');
      }
    });
  });
  
  // Add search functionality for textbooks
  const searchInput = document.querySelector('.reading-room .search-field input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const bookCards = document.querySelectorAll('.reading-room .book-card');
      
      bookCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const bookInfo = card.querySelector('.book-link').textContent.toLowerCase();
        
        if (title.includes(query) || bookInfo.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
  
  // Add subject filter functionality for textbooks
  const subjectSelect = document.querySelector('.reading-room .search-field select');
  if (subjectSelect) {
    subjectSelect.addEventListener('change', (e) => {
      const selectedSubject = e.target.value;
      const bookCards = document.querySelectorAll('.reading-room .book-card');
      
      bookCards.forEach(card => {
        const bookInfo = card.querySelector('.book-link').textContent;
        
        // Extract subject from bookInfo
        let subject = 'Other';
        if (bookInfo.includes('Mathematics')) subject = 'Mathematics';
        else if (bookInfo.includes('Science')) subject = 'Science';
        else if (bookInfo.includes('English')) subject = 'English';
        else if (bookInfo.includes('हिंदी')) subject = 'Hindi';
        else if (bookInfo.includes('Social Studies')) subject = 'Social Studies';
        else if (bookInfo.includes('Moral Science')) subject = 'Moral Science';
        
        if (selectedSubject === 'All Courses' || subject === selectedSubject) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
    
    // Add grade filter functionality
    const gradeFilter = document.createElement('select');
    gradeFilter.innerHTML = `
      <option>All Grades</option>
      <option>Grade 1</option>
      <option>Grade 2</option>
      <option>Grade 3</option>
      <option>Grade 4</option>
      <option>Grade 5</option>
      <option>Grade 6</option>
      <option>Grade 7</option>
      <option>Grade 8</option>
    `;
    gradeFilter.style.marginLeft = '10px';
    subjectSelect.parentNode.appendChild(gradeFilter);
    
    gradeFilter.addEventListener('change', (e) => {
      const selectedGrade = e.target.value;
      const bookCards = document.querySelectorAll('.reading-room .book-card');
      
      bookCards.forEach(card => {
        const bookInfo = card.querySelector('.book-link').textContent;
        const hasGrade = selectedGrade === 'All Grades' || bookInfo.includes(selectedGrade);
        
        if (hasGrade) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

// Helper Functions for NCERT PDFs
function getSubjectFromTitle(title) {
  if (title.includes('Mathematics')) return 'mathematics';
  if (title.includes('Science')) return 'science';
  if (title.includes('English')) return 'english';
  if (title.includes('हिंदी')) return 'hindi';
  if (title.includes('Social Studies')) return 'socialstudies';
  if (title.includes('Moral Science')) return 'moralscience';
  return null;
}

function getNCERTPdfUrl(subject, grade) {
  // Real working NCERT PDF URLs from edureso.com
  const realUrls = {
    mathematics: {
      '1': 'https://ncert.nic.in/textbook/pdf/aejm101.pdf',  // Finding the Furry Cat
      '2': 'https://ncert.nic.in/textbook/pdf/bejm101.pdf',  // A Day at the Beach
      '3': 'https://ncert.nic.in/textbook/pdf/cejm101.pdf',  // What's in a Name?
      '4': 'https://ncert.nic.in/textbook/pdf/dejm101.pdf',  // Building with Bricks
      '5': 'https://ncert.nic.in/textbook/pdf/eejm101.pdf',  // The Fish Tale
      '6': 'https://ncert.nic.in/textbook/pdf/fejm101.pdf',  // Knowing Our Numbers
      '7': 'https://ncert.nic.in/textbook/pdf/gejm101.pdf',  // Integers
      '8': 'https://ncert.nic.in/textbook/pdf/hejm101.pdf'   // Rational Numbers
    },
    science: {
      '1': 'https://ncert.nic.in/textbook/pdf/iesc1.pdf',   // Living and Non-Living Things
      '2': 'https://ncert.nic.in/textbook/pdf/iesc2.pdf',   // Food We Eat
      '3': 'https://ncert.nic.in/textbook/pdf/iesc3.pdf',   // Plants and Animals
      '4': 'https://ncert.nic.in/textbook/pdf/iesc4.pdf',   // The World of Living
      '5': 'https://ncert.nic.in/textbook/pdf/iesc5.pdf',   // The Moon and Stars
      '6': 'https://ncert.nic.in/textbook/pdf/iesc6.pdf',   // Food: Where Does It Come From
      '7': 'https://ncert.nic.in/textbook/pdf/iesc7.pdf',   // Nutrition in Plants
      '8': 'https://ncert.nic.in/textbook/pdf/iesc8.pdf'   // Crop Production and Management
    },
    english: {
      '1': 'https://ncert.nic.in/textbook/pdf/aemr101.pdf',  // Two Little Hands
      '2': 'https://ncert.nic.in/textbook/pdf/bemr101.pdf',  // My Bicycle
      '3': 'https://ncert.nic.in/textbook/pdf/cemr101.pdf',  // Good Morning
      '4': 'https://ncert.nic.in/textbook/pdf/demr101.pdf',  // Wake Up!
      '5': 'https://ncert.nic.in/textbook/pdf/eemr101.pdf',  // Wonderful Waste
      '6': 'https://ncert.nic.in/textbook/pdf/femr101.pdf',  // Who Did Patrick's Homework?
      '7': 'https://ncert.nic.in/textbook/pdf/gemr101.pdf',  // Three Questions
      '8': 'https://ncert.nic.in/textbook/pdf/hemr101.pdf'   // The Best Christmas Present
    },
    hindi: {
      '1': 'https://ncert.nic.in/textbook/pdf/ahsr101.pdf',  // मीना का परिवार
      '2': 'https://ncert.nic.in/textbook/pdf/bhsr101.pdf',  // ऊँट देखता हुआ
      '3': 'https://ncert.nic.in/textbook/pdf/chsr101.pdf',  // कक्षा
      '4': 'https://ncert.nic.in/textbook/pdf/dhsr101.pdf',  // मन के भोले-भाले बादल
      '5': 'https://ncert.nic.in/textbook/pdf/ehsr101.pdf',  // रखीब की रोटी
      '6': 'https://ncert.nic.in/textbook/pdf/fhsr101.pdf',  // वह चिड़िया जो
      '7': 'https://ncert.nic.in/textbook/pdf/ghsr101.pdf',  // चंपा काले अकबर
      '8': 'https://ncert.nic.in/textbook/pdf/hhsr101.pdf'   // ध्वनि
    },
    socialstudies: {
      '1': 'https://ncert.nic.in/textbook/pdf/less1.pdf',   // My Family
      '2': 'https://ncert.nic.in/textbook/pdf/less2.pdf',   // Our Neighborhood
      '3': 'https://ncert.nic.in/textbook/pdf/less3.pdf',   // Our Earth
      '4': 'https://ncert.nic.in/textbook/pdf/less4.pdf',   // Our Environment
      '5': 'https://ncert.nic.in/textbook/pdf/less5.pdf',   // Our Past
      '6': 'https://ncert.nic.in/textbook/pdf/less6.pdf',   // Our Past - I
      '7': 'https://ncert.nic.in/textbook/pdf/less7.pdf',   // Our Past - II
      '8': 'https://ncert.nic.in/textbook/pdf/less8.pdf'    // Our Past - III
    },
    moralscience: {
      '1': 'https://ncert.nic.in/textbook/pdf/aesr1.pdf',   // Being Honest
      '2': 'https://ncert.nic.in/textbook/pdf/aesr2.pdf',   // Respecting Elders
      '3': 'https://ncert.nic.in/textbook/pdf/aesr3.pdf',   // Helping Others
      '4': 'https://ncert.nic.in/textbook/pdf/aesr4.pdf',   // Being Kind
      '5': 'https://ncert.nic.in/textbook/pdf/aesr5.pdf',   // Sharing is Caring
      '6': 'https://ncert.nic.in/textbook/pdf/aesr6.pdf',   // Cleanliness
      '7': 'https://ncert.nic.in/textbook/pdf/aesr7.pdf',   // Responsibility
      '8': 'https://ncert.nic.in/textbook/pdf/aesr8.pdf'    // Truthfulness
    }
  };
  
  return realUrls[subject]?.[grade] || 'https://ncert.nic.in/textbook/';
}

// Video Library Functionality
const API_BASE_URL = 'http://localhost:4000/api';

function initializeVideoLibrary() {
  const videoLibrary = {
    videos: [],
    filteredVideos: [],
    currentSubject: 'All Courses',
    currentGrade: 'All Grades',
    searchQuery: '',

    async init() {
      console.log('Initializing video library...');
      this.showLoading();
      await this.fetchVideos();
      this.setupEventListeners();
      this.renderVideos();
    },

    showLoading() {
      const videoGrid = document.querySelector('.video-grid');
      if (videoGrid) {
        videoGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <h3>Loading videos...</h3>
            <p>Fetching content from database...</p>
          </div>
        `;
      }
    },

    async fetchVideos() {
      try {
        console.log('Fetching videos from:', `${API_BASE_URL}/videos`);
        const response = await fetch(`${API_BASE_URL}/videos`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Response Error:', response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        this.videos = await response.json();
        this.filteredVideos = [...this.videos];
        console.log(`Loaded ${this.videos.length} videos`);
        
        // Log sample video data for debugging
        if (this.videos.length > 0) {
          console.log('Sample video:', this.videos[0]);
          console.log('Available subjects:', [...new Set(this.videos.map(v => v.subject))]);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        this.showError(`Failed to load videos: ${error.message}. Make sure the backend server is running on port 4000.`);
      }
    },

    setupEventListeners() {
      // Search functionality
      const searchInput = document.querySelector('.search-field input');
      const subjectSelect = document.querySelector('.search-field select');

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase();
          this.filterVideos();
        });
      }

      if (subjectSelect) {
        subjectSelect.addEventListener('change', (e) => {
          this.currentSubject = e.target.value;
          this.filterVideos();
        });
      }

      if (gradeSelect) {
        gradeSelect.addEventListener('change', (e) => {
          this.currentGrade = e.target.value;
          this.filterVideos();
        });
      }
    },

    filterVideos() {
      console.log('Filtering videos:', {
        searchQuery: this.searchQuery,
        currentSubject: this.currentSubject,
        currentGrade: this.currentGrade,
        totalVideos: this.videos.length
      });
      
      this.filteredVideos = this.videos.filter(video => {
        const matchesSearch = !this.searchQuery || 
          video.title.toLowerCase().includes(this.searchQuery) ||
          video.description.toLowerCase().includes(this.searchQuery);
        
        const matchesSubject = this.currentSubject === 'All Courses' || 
          video.subject === this.currentSubject;
        
        const matchesGrade = this.currentGrade === 'All Grades' || 
          video.grade === parseInt(this.currentGrade.replace('Grade ', ''));
        
        return matchesSearch && matchesSubject && matchesGrade;
      });
      
      console.log(`Filtered to ${this.filteredVideos.length} videos`);
      this.renderVideos();
    },

    renderVideos() {
      const videoGrid = document.querySelector('.video-grid');
      if (!videoGrid) {
        console.error('Video grid not found');
        return;
      }

      console.log(`Rendering ${this.filteredVideos.length} videos`);

      if (this.filteredVideos.length === 0) {
        videoGrid.innerHTML = `
          <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <h3>No videos found</h3>
            <p>Try adjusting your search or filters.</p>
            <p>Found ${this.videos.length} total videos in database.</p>
          </div>
        `;
        return;
      }

      videoGrid.innerHTML = this.filteredVideos.map(video => this.createVideoCard(video)).join('');
      
      // Use setTimeout to ensure DOM is updated before attaching listeners
      setTimeout(() => {
        this.attachVideoCardListeners();
      }, 100);
    },

    createVideoCard(video) {
      return `
        <article class="video-card" data-video-id="${video._id}">
          <img src="${video.thumbnailUrl}" alt="${video.title}" onerror="this.src='https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80'" />
          <div class="video-body">
            <div class="video-duration">⏱ ${video.duration}</div>
            <h3>${video.title}</h3>
            <p>${video.description}</p>
            <div class="video-meta">
              <span class="pill">Grade ${video.grade}</span>
              <span class="pill accent">${video.language}</span>
              <span class="pill">${video.subject}</span>
            </div>
            <div class="video-stats">
              <span>👁 ${video.views || 0} views</span>
            </div>
            <button class="primary outline" data-action="watch" data-video-id="${video._id}">Watch Now</button>
          </div>
        </article>
      `;
    },

    attachVideoCardListeners() {
      const watchButtons = document.querySelectorAll('[data-action="watch"]');
      console.log(`Attaching listeners to ${watchButtons.length} watch buttons`);
      
      if (watchButtons.length === 0) {
        console.error('No watch buttons found!');
        // Debug: show all buttons on page
        const allButtons = document.querySelectorAll('button');
        console.log(`Found ${allButtons.length} total buttons on page`);
        allButtons.forEach((btn, index) => {
          console.log(`Button ${index}:`, btn.textContent, btn.className, btn.dataset.action);
        });
      }
      
      watchButtons.forEach((button, index) => {
        console.log(`Setting up button ${index}:`, button.textContent, button.dataset.videoId);
        
        // Remove existing listeners to avoid duplicates
        button.replaceWith(button.cloneNode(true));
        const newButton = document.querySelectorAll('[data-action="watch"]')[index];
        
        newButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const videoId = e.target.dataset.videoId;
          console.log('🎯 Watch button clicked! Video ID:', videoId);
          
          // Visual feedback
          e.target.style.transform = 'scale(0.95)';
          setTimeout(() => {
            e.target.style.transform = 'scale(1)';
          }, 150);
          
          this.watchVideo(videoId);
        });
        
        // Add hover effects
        newButton.addEventListener('mouseenter', () => {
          console.log('Mouse entered button:', newButton.textContent);
        });
      });
    },

    async watchVideo(videoId) {
      try {
        // Get video details and increment view count
        const response = await fetch(`${API_BASE_URL}/videos/${videoId}`);
        if (!response.ok) throw new Error('Failed to load video');
        
        const video = await response.json();
        console.log('Playing video:', video.title);
        
        // Open YouTube video directly in new tab
        this.openVideoDirectly(video);
        
      } catch (error) {
        console.error('Error playing video:', error);
        this.showError('Failed to play video. Please try again.');
      }
    },

    openVideoDirectly(video) {
      console.log('Video data:', video);
      console.log('Original video URL:', video.videoUrl);
      
      let videoId = '';
      
      // Handle different YouTube URL formats
      if (video.videoUrl.includes('embed/')) {
        // Extract from embed URL: https://www.youtube.com/embed/VIDEO_ID
        const videoIdMatch = video.videoUrl.match(/embed\/([^\?&]+)/);
        videoId = videoIdMatch ? videoIdMatch[1] : '';
      } else if (video.videoUrl.includes('watch?v=')) {
        // Extract from watch URL: https://www.youtube.com/watch?v=VIDEO_ID
        const videoIdMatch = video.videoUrl.match(/watch\?v=([^\?&]+)/);
        videoId = videoIdMatch ? videoIdMatch[1] : '';
      } else if (video.videoUrl.includes('youtu.be/')) {
        // Extract from short URL: https://youtu.be/VIDEO_ID
        const videoIdMatch = video.videoUrl.match(/youtu\.be\/([^\?&]+)/);
        videoId = videoIdMatch ? videoIdMatch[1] : '';
      }
      
      console.log('Extracted video ID:', videoId);
      
      if (!videoId) {
        console.error('Could not extract video ID from:', video.videoUrl);
        alert('Video URL not recognized. Please try again.');
        return;
      }
      
      // Create direct YouTube URL
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      console.log('Opening YouTube URL:', youtubeUrl);
      
      // Open in new tab
      window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
    },

    showVideoModal(video) {
      // Create modal overlay
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
      `;

      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background: white;
        border-radius: 16px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow: auto;
        position: relative;
      `;

      modalContent.innerHTML = `
        <div style="padding: 20px;">
          <button id="closeModal" style="
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ff6a64;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            font-size: 20px;
            z-index: 1001;
          ">&times;</button>
          
          <h2 style="margin: 0 0 10px 0; color: #1d2233;">${video.title}</h2>
          <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
            <span style="background: #f5f5f5; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem;">Grade ${video.grade}</span>
            <span style="background: #ecfdf7; color: #0d8171; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem;">${video.language}</span>
            <span style="background: #f5f5f5; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem;">${video.subject}</span>
            <span style="color: #6c728c; font-size: 0.85rem;">⏱ ${video.duration}</span>
            <span style="color: #6c728c; font-size: 0.85rem;">👁 ${video.views || 0} views</span>
          </div>
          
          <div style="margin-bottom: 15px; color: #6c728c;">${video.description}</div>
          
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">
            <iframe 
              src="${video.videoUrl}" 
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 8px;
              "
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      `;

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      // Add close functionality
      const closeBtn = modalContent.querySelector('#closeModal');
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
      });

      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });

      // Close on Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          document.body.removeChild(modal);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
    },

    showError(message) {
      const videoGrid = document.querySelector('.video-grid');
      if (videoGrid) {
        videoGrid.innerHTML = `
          <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
            <button class="primary" onclick="location.reload()">Try Again</button>
            <div style="margin-top: 20px;">
              <p><strong>Troubleshooting steps:</strong></p>
              <ol style="text-align: left; display: inline-block;">
                <li>Make sure backend server is running: <code>cd backend && npm start</code></li>
                <li>Check that MongoDB is connected</li>
                <li>Verify videos are seeded: <code>node seedVideos.js all</code></li>
                <li>Try accessing: <a href="http://localhost:4000/api/health" target="_blank">http://localhost:4000/api/health</a></li>
              </ol>
            </div>
          </div>
        `;
      }
    }
  };

  // Initialize the video library
  videoLibrary.init();
  
  // Initialize test center
  initializeTestCenter();
}

// Test functionality
const testQuestions = {
  'World Geography Challenge': [
    {
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 2
    },
    {
      question: 'Which is the largest ocean?',
      options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
      correct: 3
    },
    {
      question: 'How many continents are there?',
      options: ['5', '6', '7', '8'],
      correct: 2
    },
    {
      question: 'What is the longest river in the world?',
      options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'],
      correct: 1
    },
    {
      question: 'Which country has the largest population?',
      options: ['India', 'China', 'USA', 'Indonesia'],
      correct: 1
    }
  ],
  'Science: Plants & Photosynthesis': [
    {
      question: 'What is the process by which plants make their own food?',
      options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Germination'],
      correct: 1
    },
    {
      question: 'What gas do plants absorb from the atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      correct: 2
    },
    {
      question: 'What gives plants their green color?',
      options: ['Carotene', 'Xanthophyll', 'Chlorophyll', 'Melanin'],
      correct: 2
    },
    {
      question: 'What is the name of the pores on leaves that allow gas exchange?',
      options: ['Stomata', 'Xylem', 'Phloem', 'Guard cells'],
      correct: 0
    },
    {
      question: 'Which part of the plant absorbs water and nutrients?',
      options: ['Stem', 'Leaves', 'Roots', 'Flowers'],
      correct: 2
    }
  ],
  'Fractions Mastery Quiz': [
    {
      question: 'What is 1/2 + 1/4?',
      options: ['1/6', '3/4', '2/3', '1/8'],
      correct: 1
    },
    {
      question: 'Which fraction is equivalent to 2/3?',
      options: ['4/6', '3/4', '5/7', '6/8'],
      correct: 0
    },
    {
      question: 'What is 3/4 × 2/5?',
      options: ['6/20', '5/9', '3/5', '6/10'],
      correct: 0
    },
    {
      question: 'Convert 5/2 to a mixed number:',
      options: ['2 1/2', '2 1/3', '2 1/4', '2 1/5'],
      correct: 0
    },
    {
      question: 'What is the decimal equivalent of 3/5?',
      options: ['0.3', '0.5', '0.6', '0.8'],
      correct: 2
    }
  ],
  'English Grammar Practice Test': [
    {
      question: 'Choose the correct verb: She ___ to school every day.',
      options: ['go', 'goes', 'going', 'went'],
      correct: 1
    },
    {
      question: 'Which sentence is in the past tense?',
      options: ['I am reading', 'I read', 'I will read', 'I have been reading'],
      correct: 1
    },
    {
      question: 'What is the plural form of "child"?',
      options: ['Childs', 'Children', 'Childrens', 'Childes'],
      correct: 1
    },
    {
      question: 'Choose the correct article: ___ apple a day keeps the doctor away.',
      options: ['A', 'An', 'The', 'No article'],
      correct: 1
    },
    {
      question: 'Which word is an adjective in this sentence: "The beautiful flower blooms"?',
      options: ['The', 'flower', 'beautiful', 'blooms'],
      correct: 2
    }
  ]
};

let currentTest = null;
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeRemaining = 0;
let selectedAnswer = null;

function initializeTestCenter() {
  const testCards = document.querySelectorAll('.test-card');
  
  testCards.forEach(card => {
    const startButton = card.querySelector('button');
    if (startButton) {
      startButton.addEventListener('click', () => {
        const testTitle = card.querySelector('h3').textContent;
        startTest(testTitle);
      });
    }
  });
}

function startTest(testTitle) {
  currentTest = testTitle;
  currentQuestionIndex = 0;
  score = 0;
  selectedAnswer = null;
  
  console.log('Starting test:', testTitle);
  
  // Set timer based on test
  const timeLimits = {
    'World Geography Challenge': 30,
    'Science: Plants & Photosynthesis': 25,
    'Fractions Mastery Quiz': 20,
    'English Grammar Practice Test': 15
  };
  
  timeRemaining = timeLimits[testTitle] * 60; // Convert to seconds
  
  // Create test modal
  const testModal = createTestModal(testTitle);
  document.body.appendChild(testModal);
  
  // Start timer
  startTimer();
  
  // Show first question
  showQuestion();
}

function createTestModal(testTitle) {
  const modal = document.createElement('div');
  modal.className = 'test-modal';
  modal.innerHTML = `
    <div class="test-container">
      <div class="test-header">
        <h2>${testTitle}</h2>
        <div class="test-info">
          <span class="timer">⏱ ${formatTime(timeRemaining)}</span>
          <span class="score">Score: ${score}/${testQuestions[testTitle].length}</span>
        </div>
      </div>
      <div class="question-container">
        <div class="question-number">Question ${currentQuestionIndex + 1} of ${testQuestions[testTitle].length}</div>
        <div class="question-text"></div>
        <div class="options-container"></div>
      </div>
      <div class="test-footer">
        <button class="secondary" onclick="closeTest()">End Test</button>
        <button class="primary" id="next-btn" disabled>Next Question</button>
      </div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .test-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .test-container {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .test-info {
      display: flex;
      gap: 1rem;
      font-weight: 600;
    }
    
    .timer {
      color: #ef4444;
    }
    
    .score {
      color: #10b981;
    }
    
    .question-number {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }
    
    .question-text {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .option {
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .option:hover {
      border-color: #3b82f6;
      background: #f0f9ff;
    }
    
    .option.selected {
      border-color: #3b82f6;
      background: #dbeafe;
    }
    
    .option.correct {
      border-color: #10b981 !important;
      background: #d1fae5 !important;
    }
    
    .option.incorrect {
      border-color: #ef4444 !important;
      background: #fee2e2 !important;
    }
    
    .test-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
  
  modal.appendChild(style);
  
  return modal;
}

function showQuestion() {
  const questions = testQuestions[currentTest];
  const question = questions[currentQuestionIndex];
  
  // Update question number and text
  document.querySelector('.question-number').textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  document.querySelector('.question-text').textContent = question.question;
  
  // Update options
  const optionsContainer = document.querySelector('.options-container');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.textContent = option;
    optionDiv.addEventListener('click', () => selectOption(index));
    optionsContainer.appendChild(optionDiv);
  });
  
  // Reset next button
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next Question';
    
    // Remove existing event listener and add new one
    nextBtn.removeEventListener('click', nextQuestion);
    nextBtn.addEventListener('click', nextQuestion);
  }
}

function selectOption(selectedIndex) {
  // Remove previous selection
  document.querySelectorAll('.option').forEach(option => {
    option.classList.remove('selected');
  });
  
  // Add selection to clicked option
  const selectedOption = document.querySelectorAll('.option')[selectedIndex];
  if (selectedOption) {
    selectedOption.classList.add('selected');
  }
  
  // Enable next button
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.disabled = false;
  }
  
  // Store selected answer
  selectedAnswer = selectedIndex;
}

function nextQuestion() {
  const questions = testQuestions[currentTest];
  const question = questions[currentQuestionIndex];
  
  // Check if answer is correct
  console.log('Selected answer:', selectedAnswer, 'Correct answer:', question.correct);
  if (selectedAnswer === question.correct) {
    score++;
    console.log('Correct! Score now:', score);
  } else {
    console.log('Wrong! Score remains:', score);
  }
  
  // Show correct answer and disable options
  const options = document.querySelectorAll('.option');
  options.forEach(option => {
    option.style.pointerEvents = 'none'; // Disable clicking
  });
  
  // Highlight correct and incorrect answers
  if (options[question.correct]) {
    options[question.correct].classList.add('correct');
  }
  if (selectedAnswer !== question.correct && options[selectedAnswer]) {
    options[selectedAnswer].classList.add('incorrect');
  }
  
  // Update score display
  const scoreElement = document.querySelector('.score');
  if (scoreElement) {
    scoreElement.textContent = `Score: ${score}/${questions.length}`;
  }
  
  // Disable next button temporarily
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.disabled = true;
  }
  
  // Move to next question or finish test
  setTimeout(() => {
    currentQuestionIndex++;
    selectedAnswer = null; // Reset selected answer for next question
    
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      finishTest();
    }
  }, 1500);
}

function finishTest() {
  clearInterval(timer);
  
  const questions = testQuestions[currentTest];
  const percentage = Math.round((score / questions.length) * 100);
  
  // Define time limits for time calculation
  const timeLimits = {
    'World Geography Challenge': 30,
    'Science: Plants & Photosynthesis': 25,
    'Fractions Mastery Quiz': 20,
    'English Grammar Practice Test': 15
  };
  
  const totalTime = timeLimits[currentTest] * 60;
  const timeTaken = totalTime - timeRemaining;
  
  // Show results
  const testContainer = document.querySelector('.test-container');
  testContainer.innerHTML = `
    <div class="test-results">
      <h2>Test Completed! 🎉</h2>
      <div class="result-summary">
        <div class="score-circle">
          <span class="score-percentage">${percentage}%</span>
          <span class="score-text">Score</span>
        </div>
        <div class="result-details">
          <p>You answered <strong>${score}</strong> out of <strong>${questions.length}</strong> questions correctly.</p>
          <p>Time taken: ${formatTime(timeTaken)}</p>
        </div>
      </div>
      <div class="result-message">
        ${getResultMessage(percentage)}
      </div>
      <div class="result-actions">
        <button class="secondary" onclick="closeTest()">Close</button>
        <button class="primary" onclick="retakeTest()">Retake Test</button>
      </div>
    </div>
  `;
  
  // Add result styles
  const style = document.createElement('style');
  style.textContent = `
    .test-results {
      text-align: center;
    }
    
    .result-summary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin: 2rem 0;
    }
    
    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: ${percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'};
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .score-percentage {
      font-size: 2rem;
      font-weight: bold;
    }
    
    .score-text {
      font-size: 0.875rem;
    }
    
    .result-message {
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 8px;
      margin: 1.5rem 0;
    }
    
    .result-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }
  `;
  
  document.querySelector('.test-modal').appendChild(style);
}

function getResultMessage(percentage) {
  if (percentage >= 90) return '<p>🌟 Excellent! You have mastered this topic!</p>';
  if (percentage >= 70) return '<p>👏 Great job! You have a good understanding of this topic.</p>';
  if (percentage >= 50) return '<p>👍 Good effort! Keep practicing to improve.</p>';
  return '<p>📚 Keep learning! Review the material and try again.</p>';
}

function closeTest() {
  clearInterval(timer);
  const modal = document.querySelector('.test-modal');
  if (modal) {
    modal.remove();
  }
}

function retakeTest() {
  closeTest();
  setTimeout(() => startTest(currentTest), 100);
}

function startTimer() {
  timer = setInterval(() => {
    timeRemaining--;
    document.querySelector('.timer').textContent = `⏱ ${formatTime(timeRemaining)}`;
    
    if (timeRemaining <= 0) {
      finishTest();
    }
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize homepage animations
  if (document.querySelector('#home')) {
    console.log('Homepage detected, initializing animations...');
    initializeHomepage();
  }
  
  // Check if we're on the test center page
  if (document.querySelector('.test-center')) {
    console.log('Test center page detected, initializing...');
    initializeTestCenter();
  }
  
  // Check if we're on the video library page
  if (document.querySelector('.video-library')) {
    console.log('Video library page detected, initializing...');
    videoLibrary.init();
  }
  
  // Check if we're on the my courses page
  if (document.querySelector('#my-courses')) {
    console.log('My courses page detected, initializing...');
    initializeMyCourses();
  }
});

// Homepage functionality
function initializeHomepage() {
  // Animated counters
  const counters = document.querySelectorAll('.counter');
  const speed = 200; // Animation speed
  
  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const increment = target / speed;
    
    const updateCounter = () => {
      const current = +counter.innerText;
      
      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        setTimeout(updateCounter, 10);
      } else {
        counter.innerText = target;
        // Add K+ suffix for students counter
        if (counter.parentElement.querySelector('.stat-label').innerText === 'K+ Students') {
          counter.innerText = target + 'K+';
        }
      }
    };
    
    updateCounter();
  };
  
  // Use Intersection Observer to trigger counter animation when visible
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
  
  // Add parallax effect to floating elements
  const floatingElements = document.querySelectorAll('.float-element');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    floatingElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1);
      element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
  });
  
  // Add mouse move effect to hero section
  const hero = document.querySelector('.hero');
  
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = hero;
      
      const centerX = offsetWidth / 2;
      const centerY = offsetHeight / 2;
      
      const moveX = (clientX - centerX) / centerX;
      const moveY = (clientY - centerY) / centerY;
      
      floatingElements.forEach((element, index) => {
        const speed = 2 + (index * 0.5);
        element.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px) rotate(${moveX * 5}deg)`;
      });
    });
  }
}

// My Courses functionality
function initializeMyCourses() {
  const coursesContainer = document.getElementById('courses-container');
  const gradeChips = document.querySelectorAll('[data-grade]');
  const languageChips = document.querySelectorAll('[data-language]');
  const typeChips = document.querySelectorAll('[data-type]');
  
  let currentGrade = 'all';
  let currentLanguage = 'all';
  let currentType = 'all';
  
  // Sample course data combining videos and books
  const coursesData = [
    // Mathematics Courses
    { id: 1, title: 'Mathematics Grade 1', subject: 'Mathematics', grade: 1, language: 'English', type: 'videos', count: 8, description: 'Learn basic math concepts for Grade 1 students' },
    { id: 2, title: 'Mathematics Grade 2', subject: 'Mathematics', grade: 2, language: 'English', type: 'videos', count: 8, description: 'Master addition, subtraction, and shapes for Grade 2' },
    { id: 3, title: 'Mathematics Grade 3', subject: 'Mathematics', grade: 3, language: 'English', type: 'videos', count: 8, description: 'Learn multiplication and division for Grade 3 students' },
    { id: 4, title: 'Mathematics Grade 4', subject: 'Mathematics', grade: 4, language: 'English', type: 'videos', count: 8, description: 'Fractions, decimals, and geometry for Grade 4' },
    { id: 5, title: 'Mathematics Grade 5', subject: 'Mathematics', grade: 5, language: 'English', type: 'videos', count: 8, description: 'Advanced math concepts for Grade 5 students' },
    { id: 6, title: 'Mathematics Grade 6', subject: 'Mathematics', grade: 6, language: 'English', type: 'videos', count: 8, description: 'Algebra basics and geometry for Grade 6' },
    { id: 7, title: 'Mathematics Grade 7', subject: 'Mathematics', grade: 7, language: 'English', type: 'videos', count: 8, description: 'Advanced algebra and geometry for Grade 7' },
    { id: 8, title: 'Mathematics Grade 8', subject: 'Mathematics', grade: 8, language: 'English', type: 'videos', count: 8, description: 'Complete mathematics for Grade 8 students' },
    
    // Science Courses
    { id: 9, title: 'Science Grade 1', subject: 'Science', grade: 1, language: 'English', type: 'videos', count: 8, description: 'Learn about plants and animals for Grade 1' },
    { id: 10, title: 'Science Grade 2', subject: 'Science', grade: 2, language: 'English', type: 'videos', count: 8, description: 'Air, water, and environment for Grade 2' },
    { id: 11, title: 'Science Grade 3', subject: 'Science', grade: 3, language: 'English', type: 'videos', count: 8, description: 'Solar system and basic physics for Grade 3' },
    { id: 12, title: 'Science Grade 4', subject: 'Science', grade: 4, language: 'English', type: 'videos', count: 8, description: 'Electricity and chemistry basics for Grade 4' },
    { id: 13, title: 'Science Grade 5', subject: 'Science', grade: 5, language: 'English', type: 'videos', count: 8, description: 'Chemical reactions and biology for Grade 5' },
    { id: 14, title: 'Science Grade 6', subject: 'Science', grade: 6, language: 'English', type: 'videos', count: 8, description: 'Physics fundamentals for Grade 6 students' },
    { id: 15, title: 'Science Grade 7', subject: 'Science', grade: 7, language: 'English', type: 'videos', count: 8, description: 'Biology fundamentals for Grade 7 students' },
    { id: 16, title: 'Science Grade 8', subject: 'Science', grade: 8, language: 'English', type: 'videos', count: 8, description: 'Complete science curriculum for Grade 8' },
    
    // English Courses
    { id: 17, title: 'English Grade 1', subject: 'English', grade: 1, language: 'English', type: 'videos', count: 8, description: 'Stories and poems for Grade 1 students' },
    { id: 18, title: 'English Grade 2', subject: 'English', grade: 2, language: 'English', type: 'videos', count: 8, description: 'Reading comprehension for Grade 2' },
    { id: 19, title: 'English Grade 3', subject: 'English', grade: 3, language: 'English', type: 'videos', count: 8, description: 'Story writing skills for Grade 3' },
    { id: 20, title: 'English Grade 4', subject: 'English', grade: 4, language: 'English', type: 'videos', count: 8, description: 'Grammar rules for Grade 4 students' },
    { id: 21, title: 'English Grade 5', subject: 'English', grade: 5, language: 'English', type: 'videos', count: 8, description: 'Literature appreciation for Grade 5' },
    { id: 22, title: 'English Grade 6', subject: 'English', grade: 6, language: 'English', type: 'videos', count: 8, description: 'Creative writing for Grade 6 students' },
    { id: 23, title: 'English Grade 7', subject: 'English', grade: 7, language: 'English', type: 'videos', count: 8, description: 'Literature analysis for Grade 7' },
    { id: 24, title: 'English Grade 8', subject: 'English', grade: 8, language: 'English', type: 'videos', count: 8, description: 'Advanced English for Grade 8 students' },
    
    // Hindi Courses
    { id: 25, title: 'हिंदी Grade 1', subject: 'Hindi', grade: 1, language: 'Hindi', type: 'videos', count: 8, description: 'Hindi stories for Grade 1 students' },
    { id: 26, title: 'हिंदी Grade 2', subject: 'Hindi', grade: 2, language: 'Hindi', type: 'videos', count: 8, description: 'Hindi reading for Grade 2 students' },
    { id: 27, title: 'हिंदी Grade 3', subject: 'Hindi', grade: 3, language: 'Hindi', type: 'videos', count: 8, description: 'Hindi writing for Grade 3 students' },
    { id: 28, title: 'हिंदी Grade 4', subject: 'Hindi', grade: 4, language: 'Hindi', type: 'videos', count: 8, description: 'Hindi grammar for Grade 4 students' },
    { id: 29, title: 'हिंदी Grade 5', subject: 'Hindi', grade: 5, language: 'Hindi', type: 'videos', count: 8, description: 'Hindi literature for Grade 5' },
    { id: 30, title: 'हिंदी Grade 6', subject: 'Hindi', grade: 6, language: 'Hindi', type: 'videos', count: 8, description: 'Creative writing in Hindi for Grade 6' },
    { id: 31, title: 'हिंदी Grade 7', subject: 'Hindi', grade: 7, language: 'Hindi', type: 'videos', count: 8, description: 'Hindi literature analysis for Grade 7' },
    { id: 32, title: 'हिंदी Grade 8', subject: 'Hindi', grade: 8, language: 'Hindi', type: 'videos', count: 8, description: 'Advanced Hindi for Grade 8 students' },
    
    // Social Studies Courses
    { id: 33, title: 'Social Studies Grade 1', subject: 'Social Studies', grade: 1, language: 'English', type: 'videos', count: 8, description: 'Community helpers for Grade 1' },
    { id: 34, title: 'Social Studies Grade 2', subject: 'Social Studies', grade: 2, language: 'English', type: 'videos', count: 8, description: 'National symbols for Grade 2' },
    { id: 35, title: 'Social Studies Grade 3', subject: 'Social Studies', grade: 3, language: 'English', type: 'videos', count: 8, description: 'Ancient civilizations for Grade 3' },
    { id: 36, title: 'Social Studies Grade 4', subject: 'Social Studies', grade: 4, language: 'English', type: 'videos', count: 8, description: 'Geography basics for Grade 4' },
    { id: 37, title: 'Social Studies Grade 5', subject: 'Social Studies', grade: 5, language: 'English', type: 'videos', count: 8, description: 'Indian history for Grade 5' },
    { id: 38, title: 'Social Studies Grade 6', subject: 'Social Studies', grade: 6, language: 'English', type: 'videos', count: 8, description: 'Civics and government for Grade 6' },
    { id: 39, title: 'Social Studies Grade 7', subject: 'Social Studies', grade: 7, language: 'English', type: 'videos', count: 8, description: 'World history for Grade 7 students' },
    { id: 40, title: 'Social Studies Grade 8', subject: 'Social Studies', grade: 8, language: 'English', type: 'videos', count: 8, description: 'Complete social studies for Grade 8' },
    
    // Moral Science Courses
    { id: 41, title: 'Moral Science Grade 1', subject: 'Moral Science', grade: 1, language: 'English', type: 'videos', count: 8, description: 'Good habits for Grade 1 students' },
    { id: 42, title: 'Moral Science Grade 2', subject: 'Moral Science', grade: 2, language: 'English', type: 'videos', count: 8, description: 'Being kind for Grade 2 students' },
    { id: 43, title: 'Moral Science Grade 3', subject: 'Moral Science', grade: 3, language: 'English', type: 'videos', count: 8, description: 'Honesty for Grade 3 students' },
    { id: 44, title: 'Moral Science Grade 4', subject: 'Moral Science', grade: 4, language: 'English', type: 'videos', count: 8, description: 'Responsibility for Grade 4 students' },
    { id: 45, title: 'Moral Science Grade 5', subject: 'Moral Science', grade: 5, language: 'English', type: 'videos', count: 8, description: 'Leadership qualities for Grade 5' },
    { id: 46, title: 'Moral Science Grade 6', subject: 'Moral Science', grade: 6, language: 'English', type: 'videos', count: 8, description: 'Social justice for Grade 6 students' },
    { id: 47, title: 'Moral Science Grade 7', subject: 'Moral Science', grade: 7, language: 'English', type: 'videos', count: 8, description: 'Human rights for Grade 7 students' },
    { id: 48, title: 'Moral Science Grade 8', subject: 'Moral Science', grade: 8, language: 'English', type: 'videos', count: 8, description: 'Advanced moral science for Grade 8' },
    
    // Books (Reading Room content)
    { id: 49, title: 'Mathematics Books Grade 1', subject: 'Mathematics', grade: 1, language: 'English', type: 'books', count: 15, description: 'NCERT Mathematics textbooks for Grade 1' },
    { id: 50, title: 'Science Books Grade 1', subject: 'Science', grade: 1, language: 'English', type: 'books', count: 12, description: 'NCERT Science textbooks for Grade 1' },
    { id: 51, title: 'English Books Grade 1', subject: 'English', grade: 1, language: 'English', type: 'books', count: 10, description: 'NCERT English textbooks for Grade 1' },
    { id: 52, title: 'Hindi Books Grade 1', subject: 'Hindi', grade: 1, language: 'Hindi', type: 'books', count: 8, description: 'NCERT Hindi textbooks for Grade 1' },
    { id: 53, title: 'Mathematics Books Grade 2', subject: 'Mathematics', grade: 2, language: 'English', type: 'books', count: 15, description: 'NCERT Mathematics textbooks for Grade 2' },
    { id: 54, title: 'Science Books Grade 2', subject: 'Science', grade: 2, language: 'English', type: 'books', count: 12, description: 'NCERT Science textbooks for Grade 2' },
    { id: 55, title: 'English Books Grade 2', subject: 'English', grade: 2, language: 'English', type: 'books', count: 10, description: 'NCERT English textbooks for Grade 2' },
    { id: 56, title: 'Hindi Books Grade 2', subject: 'Hindi', grade: 2, language: 'Hindi', type: 'books', count: 8, description: 'NCERT Hindi textbooks for Grade 2' },
    { id: 57, title: 'Mathematics Books Grade 3', subject: 'Mathematics', grade: 3, language: 'English', type: 'books', count: 15, description: 'NCERT Mathematics textbooks for Grade 3' },
    { id: 58, title: 'Science Books Grade 3', subject: 'Science', grade: 3, language: 'English', type: 'books', count: 12, description: 'NCERT Science textbooks for Grade 3' },
    { id: 59, title: 'English Books Grade 3', subject: 'English', grade: 3, language: 'English', type: 'books', count: 10, description: 'NCERT English textbooks for Grade 3' },
    { id: 60, title: 'Hindi Books Grade 3', subject: 'Hindi', grade: 3, language: 'Hindi', type: 'books', count: 8, description: 'NCERT Hindi textbooks for Grade 3' },
    { id: 61, title: 'Mathematics Books Grade 4', subject: 'Mathematics', grade: 4, language: 'English', type: 'books', count: 15, description: 'NCERT Mathematics textbooks for Grade 4' },
    { id: 62, title: 'Science Books Grade 4', subject: 'Science', grade: 4, language: 'English', type: 'books', count: 12, description: 'NCERT Science textbooks for Grade 4' },
    { id: 63, title: 'English Books Grade 4', subject: 'English', grade: 4, language: 'English', type: 'books', count: 10, description: 'NCERT English textbooks for Grade 4' },
    { id: 64, title: 'Hindi Books Grade 4', subject: 'Hindi', grade: 4, language: 'Hindi', type: 'books', count: 8, description: 'NCERT Hindi textbooks for Grade 4' },
    { id: 65, title: 'Mathematics Books Grade 5', subject: 'Mathematics', grade: 5, language: 'English', type: 'books', count: 15, description: 'NCERT Mathematics textbooks for Grade 5' },
    { id: 66, title: 'Science Books Grade 5', subject: 'Science', grade: 5, language: 'English', type: 'books', count: 12, description: 'NCERT Science textbooks for Grade 5' },
    { id: 67, title: 'English Books Grade 5', subject: 'English', grade: 5, language: 'English', type: 'books', count: 10, description: 'NCERT English textbooks for Grade 5' },
    { id: 68, title: 'Hindi Books Grade 5', subject: 'Hindi', grade: 5, language: 'Hindi', type: 'books', count: 8, description: 'NCERT Hindi textbooks for Grade 5' },
    { id: 69, title: 'Mathematics Books Grade 6', subject: 'Mathematics', grade: 6, language: 'English', type: 'books', count: 15, description: 'NCERT Mathematics textbooks for Grade 6' },
    { id: 70, title: 'Science Books Grade 6', subject: 'Science', grade: 6, language: 'English', type: 'books', count: 12, description: 'NCERT Science textbooks for Grade 6' },
    { id: 71, title: 'English Books Grade 6', subject: 'English', grade: 6, language: 'English', type: 'books', count: 10, description: 'NCERT English textbooks for Grade 6' },
    { id: 72, title: 'Hindi Books Grade 6', subject: 'Hindi', grade: 6, language: 'Hindi', type: 'books', count: 8, description: 'NCERT Hindi textbooks for Grade 6' },
    { id: 73, title: 'Mathematics Books Grade 7', subject: 'Mathematics', grade: 7, language: 'English', type: 'books', count: 15, description: 'NCERT Mathematics textbooks for Grade 7' },
    { id: 74, title: 'Science Books Grade 7', subject: 'Science', grade: 7, language: 'English', type: 'books', count: 12, description: 'NCERT Science textbooks for Grade 7' },
    { id: 75, title: 'English Books Grade 7', subject: 'English', grade: 7, language: 'English', type: 'books', count: 10, description: 'NCERT English textbooks for Grade 7' },
    { id: 76, title: 'Hindi Books Grade 7', subject: 'Hindi', grade: 7, language: 'Hindi', type: 'books', count: 8, description: 'NCERT Hindi textbooks for Grade 7' },
    { id: 77, title: 'Mathematics Books Grade 8', subject: 'Mathematics', grade: 8, language: 'English', type: 'books', count: 15, description: 'NCERT Mathematics textbooks for Grade 8' },
    { id: 78, title: 'Science Books Grade 8', subject: 'Science', grade: 8, language: 'English', type: 'books', count: 12, description: 'NCERT Science textbooks for Grade 8' },
    { id: 79, title: 'English Books Grade 8', subject: 'English', grade: 8, language: 'English', type: 'books', count: 10, description: 'NCERT English textbooks for Grade 8' },
    { id: 80, title: 'Hindi Books Grade 8', subject: 'Hindi', grade: 8, language: 'Hindi', type: 'books', count: 8, description: 'NCERT Hindi textbooks for Grade 8' }
  ];
  
  // Function to render courses
  function renderCourses() {
    const filteredCourses = coursesData.filter(course => {
      const gradeMatch = currentGrade === 'all' || course.grade === parseInt(currentGrade);
      const languageMatch = currentLanguage === 'all' || course.language === currentLanguage;
      const typeMatch = currentType === 'all' || course.type === currentType;
      return gradeMatch && languageMatch && typeMatch;
    });
    
    coursesContainer.innerHTML = filteredCourses.map(course => {
      const icon = course.type === 'videos' ? '📺' : '📘';
      const label = course.type === 'videos' ? 'videos' : 'books';
      const buttonText = course.type === 'videos' ? 'Watch Videos' : 'Read Books';
      const targetUrl = course.type === 'videos' ? 'video-library.html' : 'reading-room.html';
      
      // Subject-specific images
      const subjectImages = {
        'Mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80',
        'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
        'English': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
        'Hindi': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
        'Social Studies': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
        'Moral Science': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80'
      };
      
      const imageUrl = subjectImages[course.subject] || 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80';
      
      return `
        <article class="course-card" data-grade="${course.grade}" data-language="${course.language}" data-type="${course.type}">
          <img src="${imageUrl}" alt="${course.subject}" />
          <div class="course-body">
            <div class="course-meta">
              <span class="pill accent">${course.language}</span>
              <span class="pill">Grade ${course.grade}</span>
            </div>
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-stats">
              <span>${icon} ${course.count} ${label}</span>
            </div>
          </div>
          <button class="primary block" onclick="window.location.href='${targetUrl}'">${buttonText}</button>
        </article>
      `;
    }).join('');
    
    console.log(`Rendered ${filteredCourses.length} courses`);
  }
  
  // Grade filter event listeners
  gradeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      gradeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentGrade = chip.dataset.grade;
      renderCourses();
    });
  });
  
  // Language filter event listeners
  languageChips.forEach(chip => {
    chip.addEventListener('click', () => {
      languageChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentLanguage = chip.dataset.language;
      renderCourses();
    });
  });
  
  // Type filter event listeners
  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      typeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentType = chip.dataset.type;
      renderCourses();
    });
  });
  
  // Initial render
  renderCourses();
}
