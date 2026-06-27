document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. LOADER SYSTEM
  // ==========================================================================
  const loader = document.getElementById('loader');
  const loaderStatus = document.querySelector('.loader-status');
  
  const statusMessages = [
    'Checking core architectures...',
    'Loading styling scripts...',
    'Rendering interface buffers...',
    'System ready.'
  ];

  let msgIndex = 0;
  const statusInterval = setInterval(() => {
    if (msgIndex < statusMessages.length) {
      if (loaderStatus) loaderStatus.textContent = statusMessages[msgIndex];
      msgIndex++;
    } else {
      clearInterval(statusInterval);
    }
  }, 300);

  const fadeOutLoader = () => {
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }
    }, 1000);
  };

  if (document.readyState === 'complete') {
    fadeOutLoader();
  } else {
    window.addEventListener('load', fadeOutLoader);
    setTimeout(() => {
      if (loader && loader.style.display !== 'none') {
        fadeOutLoader();
      }
    }, 3000);
  }


  // ==========================================================================
  // 2. THEME SWITCHER & PERSISTENCE
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    showToast(`System Theme: ${newTheme === 'dark' ? 'Solid Slate' : 'macOS Silver'}`);
  }


  // ==========================================================================
  // 3. TYPEWRITER EFFECT (HERO SUBTITLES)
  // ==========================================================================
  const subtitleElement = document.getElementById('typed-subtitle');
  const subtitles = [
    '//Computer Science Student',
    '//Developer',
    '//Creative Technologist'
  ];
  
  let subIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!subtitleElement) return;
    const currentText = subtitles[subIdx];
    
    if (isDeleting) {
      subtitleElement.textContent = currentText.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      subtitleElement.textContent = currentText.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIdx === currentText.length) {
      isDeleting = true;
      typingSpeed = 2000; 
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      subIdx = (subIdx + 1) % subtitles.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  setTimeout(typeEffect, 1000);


  // ==========================================================================
  // 4. CREATIVE SECTION GALLERY (CINEMATIC SLIDER)
  // ==========================================================================
  const slides = document.querySelectorAll('.gallery-slide');
  const dots = document.querySelectorAll('.gallery-dot');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    if (slides.length === 0) return;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    const nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  }

  function startSlideShow() {
    if (slides.length === 0) return;
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startSlideShow();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prevIdx = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIdx);
      startSlideShow();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextIdx = (currentSlide + 1) % slides.length;
      showSlide(nextIdx);
      startSlideShow();
    });
  }

  startSlideShow();


  // ==========================================================================
  // 5. COPY EMAIL FUNCTIONALITY
  // ==========================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailText = 'dassubham7756@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', copyEmailToClipboard);
  }

  function copyEmailToClipboard() {
    navigator.clipboard.writeText(emailText).then(() => {
      const btnText = copyEmailBtn ? copyEmailBtn.querySelector('.btn-text') : null;
      const originalText = btnText ? btnText.textContent : 'Copy Email';
      
      if (btnText) btnText.textContent = '[ Copied! ]';
      if (copyEmailBtn) copyEmailBtn.classList.add('copied');
      showToast('Email copied to clipboard!');
      
      setTimeout(() => {
        if (btnText) btnText.textContent = originalText;
        if (copyEmailBtn) copyEmailBtn.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }


  // ==========================================================================
  // 6. SPOTLIGHT SEARCH OVERLAY (PREVIEW COLUMN & COMMAND LIST)
  // ==========================================================================
  const cmdMenu = document.getElementById('cmd-menu');
  const cmdBtn = document.getElementById('title-pill');
  const cmdClose = document.getElementById('cmd-close');
  const cmdSearch = document.getElementById('cmd-search');
  const cmdList = document.getElementById('cmd-list');
  const cmdItems = document.querySelectorAll('.cmd-item');
  const previewPane = document.getElementById('cmd-preview-pane');
  
  let activeItemIndex = 0;

  // Initial Preview Placeholder
  const defaultPreviewHTML = `
    <div class="preview-placeholder">
      <div class="preview-logo">⌘</div>
      <div class="preview-title">Spotlight Search</div>
      <div class="preview-desc">Type to search the portfolio or execute shell commands directly using the <code>/</code> prefix (e.g. <code>/neofetch</code>).</div>
    </div>
  `;

  function openCommandMenu() {
    if (!cmdMenu) return;
    cmdMenu.showModal();
    if (cmdSearch) {
      cmdSearch.value = '';
      cmdSearch.focus();
    }
    filterCommands('');
    setActiveItem(0);
  }

  function closeCommandMenu() {
    if (cmdMenu) cmdMenu.close();
  }

  if (cmdBtn) cmdBtn.addEventListener('click', openCommandMenu);
  if (cmdClose) cmdClose.addEventListener('click', closeCommandMenu);

  if (cmdMenu) {
    cmdMenu.addEventListener('click', (e) => {
      const rect = cmdMenu.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        closeCommandMenu();
      }
    });
  }

  if (cmdSearch) {
    cmdSearch.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const cmdListElem = document.getElementById('cmd-list');
      const cmdTermElem = document.getElementById('cmd-term-panel');
      
      if (query.startsWith('/')) {
        if (cmdListElem) cmdListElem.style.display = 'none';
        if (cmdTermElem) cmdTermElem.style.display = 'block';
        if (previewPane) {
          previewPane.innerHTML = `
            <div class="preview-details">
              <div class="preview-details-header">Terminal Command</div>
              <div class="preview-details-title">zsh Interactive Prompt</div>
              <div class="preview-details-body">You are running terminal commands inside the Spotlight dialog. Try typing:<br><br><code>/help</code> - list commands<br><code>/theme</code> - change look<br><code>/clear</code> - reset console</div>
              <div class="preview-details-meta">
                <span>Mode: Shell Mode</span>
                <span>Type: "/"</span>
              </div>
            </div>
          `;
        }
        handleTerminalMode(query);
      } else {
        if (cmdListElem) cmdListElem.style.display = 'block';
        if (cmdTermElem) cmdTermElem.style.display = 'none';
        filterCommands(query);
      }
    });
  }

  function handleTerminalMode(query) {
    const termOutput = document.getElementById('cmd-term-output');
    if (!termOutput) return;

    const cmdClean = query.substring(1);
    
    if (cmdClean === '') {
      termOutput.innerHTML = `<span class="cmd-term-prompt">guest@subham-dev:~ $</span> <span class="cmd-term-cmd">/</span>\n\n` +
        `<span class="cmd-term-text">Available commands:\n` +
        `  /help          - list available commands\n` +
        `  /about         - short bio of subham\n` +
        `  /experience    - summaries of work history\n` +
        `  /participation - summaries of hackathons & events\n` +
        `  /projects      - summaries of key projects\n` +
        `  /theme         - toggle light/dark theme\n` +
        `  /clear         - clear console and return to search</span>`;
      return;
    }

    if (cmdClean === 'help') {
      termOutput.innerHTML = `<span class="cmd-term-prompt">guest@subham-dev:~ $</span> <span class="cmd-term-cmd">/help</span>\n\n` +
        `<span class="cmd-term-text">Commands list:\n` +
        `  /about         - view subham's profile summary\n` +
        `  /experience    - view professional work history\n` +
        `  /participation - view hackathons & event participation\n` +
        `  /projects      - view project names & tags\n` +
        `  /theme         - switch system theme\n` +
        `  /clear         - return to search menu</span>`;
    } else if (cmdClean === 'about') {
      termOutput.innerHTML = `<span class="cmd-term-prompt">guest@subham-dev:~ $</span> <span class="cmd-term-cmd">/about</span>\n\n` +
        `<span class="cmd-term-text">subham das — computer science student at NIMS university jaipur.\n` +
        `building experiences between code and creativity. loves systems, emulators, web3 and visual design.</span>`;
    } else if (cmdClean === 'experience') {
      termOutput.innerHTML = `<span class="cmd-term-prompt">guest@subham-dev:~ $</span> <span class="cmd-term-cmd">/experience</span>\n\n` +
        `<span class="cmd-term-text">professional experience:\n` +
        `  - AI Web Development Intern @ InAmigos Foundation (IAF) (Jun 2026 - Present)\n` +
        `  - Artificial Intelligence Developer @ Fiverr (Mar 2023 - Jun 2024)</span>`;
    } else if (cmdClean === 'participation') {
      termOutput.innerHTML = `<span class="cmd-term-prompt">guest@subham-dev:~ $</span> <span class="cmd-term-cmd">/participation</span>\n\n` +
        `<span class="cmd-term-text">hackathon & event participation:\n` +
        `  - Smart India Hackathon (SIH) 2025\n` +
        `  - NIMS Ideathon 2.0 (2025)</span>`;
    } else if (cmdClean === 'projects') {
      termOutput.innerHTML = `<span class="cmd-term-prompt">guest@subham-dev:~ $</span> <span class="cmd-term-cmd">/projects</span>\n\n` +
        `<span class="cmd-term-text">project 01: chip-8 emulator (c++ / emulators)\n` +
        `project 02: pong ai (neural nets / real-time logic)\n` +
        `project 03: credential verification platform (react / web3)\n` +
        `project 04: ai experiments (generative ai / flows)</span>`;
    } else if (cmdClean === 'theme') {
      termOutput.innerHTML = `<span class="cmd-term-prompt">guest@subham-dev:~ $</span> <span class="cmd-term-cmd">/theme</span>\n\n` +
        `<span class="cmd-term-text">Press [Enter] to toggle theme...</span>`;
    } else if (cmdClean === 'clear') {
      termOutput.innerHTML = `<span class="cmd-term-prompt">guest@subham-dev:~ $</span> <span class="cmd-term-cmd">/clear</span>\n\n` +
        `<span class="cmd-term-text">Press [Enter] to return to search menu...</span>`;
    } else {
      termOutput.innerHTML = `<span class="cmd-term-prompt">guest@subham-dev:~ $</span> <span class="cmd-term-cmd">/${cmdClean}</span>\n\n` +
        `<span class="cmd-term-error">Command not found: /${cmdClean}\nType /help to list available commands.</span>`;
    }
  }

  function filterCommands(query) {
    let visibleIndex = 0;

    cmdItems.forEach((item) => {
      const name = item.querySelector('.cmd-name').textContent.toLowerCase();
      const match = name.includes(query);
      
      if (match) {
        item.style.display = 'flex';
        item.setAttribute('data-visible-idx', visibleIndex);
        visibleIndex++;
      } else {
        item.style.display = 'none';
        item.removeAttribute('data-visible-idx');
      }
    });

    setActiveItem(0);
  }

  function setActiveItem(index) {
    const visibleItems = getVisibleItems();
    if (visibleItems.length === 0) {
      if (previewPane) previewPane.innerHTML = defaultPreviewHTML;
      return;
    }

    if (index < 0) index = visibleItems.length - 1;
    if (index >= visibleItems.length) index = 0;

    visibleItems.forEach(item => item.classList.remove('active'));
    visibleItems[index].classList.add('active');
    activeItemIndex = index;
    
    visibleItems[index].scrollIntoView({ block: 'nearest' });
    updateSpotlightPreview(visibleItems[index]);
  }

  function getVisibleItems() {
    return Array.from(cmdItems).filter(item => item.style.display !== 'none');
  }

  function updateSpotlightPreview(item) {
    if (!previewPane || !item) return;
    
    const title = item.querySelector('.cmd-name').textContent;
    const shortcut = item.getAttribute('data-shortcut') || '';
    const summary = item.getAttribute('data-summary') || 'No description available.';
    const target = item.getAttribute('data-target') || '';
    const action = item.getAttribute('data-action') || '';
    
    let typeLabel = "System Navigation";
    if (action === 'theme' || action === 'copy' || action === 'github' || action === 'wallpaper') {
      typeLabel = "System Utility";
    }

    previewPane.innerHTML = `
      <div class="preview-details">
        <div class="preview-details-header">${typeLabel}</div>
        <div class="preview-details-title">${title}</div>
        <div class="preview-details-body">${summary}</div>
        <div class="preview-details-meta">
          <span>Shortcut: ${shortcut}</span>
          <span>Target: ${target || action}</span>
        </div>
      </div>
    `;
  }

  // Hover item to activate preview
  cmdItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const visibleItems = getVisibleItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) {
        setActiveItem(index);
      }
    });
  });

  function executeCommand(item) {
    if (!item) return;
    
    const action = item.getAttribute('data-action');
    const target = item.getAttribute('data-target');

    closeCommandMenu();

    if (action === 'scroll' && target) {
      const targetElement = document.querySelector(target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'theme') {
      toggleTheme();
    } else if (action === 'wallpaper') {
      currentWpIdx = (currentWpIdx + 1) % wallpapers.length;
      applyWallpaper(currentWpIdx, true);
    } else if (action === 'copy') {
      copyEmailToClipboard();
    } else if (action === 'github') {
      window.open('https://github.com/subhamdas2806', '_blank');
    }
  }

  if (cmdMenu) {
    cmdMenu.addEventListener('keydown', (e) => {
      const visibleItems = getVisibleItems();
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveItem(activeItemIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveItem(activeItemIndex - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        
        const query = cmdSearch ? cmdSearch.value.trim().toLowerCase() : '';
        if (query.startsWith('/')) {
          const cmdClean = query.substring(1);
          if (cmdClean === 'theme') {
            toggleTheme();
            if (cmdSearch) cmdSearch.value = '';
            const cmdListElem = document.getElementById('cmd-list');
            const cmdTermElem = document.getElementById('cmd-term-panel');
            if (cmdListElem) cmdListElem.style.display = 'block';
            if (cmdTermElem) cmdTermElem.style.display = 'none';
            filterCommands('');
            closeCommandMenu();
          } else if (cmdClean === 'clear') {
            if (cmdSearch) cmdSearch.value = '';
            const cmdListElem = document.getElementById('cmd-list');
            const cmdTermElem = document.getElementById('cmd-term-panel');
            if (cmdListElem) cmdListElem.style.display = 'block';
            if (cmdTermElem) cmdTermElem.style.display = 'none';
            filterCommands('');
          }
          return;
        }

        if (visibleItems[activeItemIndex]) {
          executeCommand(visibleItems[activeItemIndex]);
        }
      }
    });
  }

  cmdItems.forEach((item) => {
    item.addEventListener('click', () => {
      executeCommand(item);
    });
  });


  // ==========================================================================
  // 7. KEYBOARD SHORTCUTS (GLOBAL KEYDOWN)
  // ==========================================================================
  document.addEventListener('keydown', (e) => {
    const isK = e.key.toLowerCase() === 'k';
    const isKModifier = e.altKey || e.metaKey || (e.ctrlKey && !e.altKey);

    if (isKModifier && isK) {
      e.preventDefault();
      if (cmdMenu && cmdMenu.open) {
        closeCommandMenu();
      } else {
        openCommandMenu();
      }
      return;
    }

    if (cmdMenu && !cmdMenu.open && e.altKey) {
      const key = e.key.toLowerCase();
      
      const targetMap = {
        'h': '#hero',
        'a': '#about',
        'x': '#experience',
        'w': '#projects',
        's': '#stack',
        'o': '#creative',
        'e': '#education',
        'v': '#participation',
        'c': '#connect'
      };

      if (targetMap[key]) {
        e.preventDefault();
        const elem = document.querySelector(targetMap[key]);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (key === 't') {
        e.preventDefault();
        toggleTheme();
      } else if (key === 'm') {
        e.preventDefault();
        copyEmailToClipboard();
      } else if (key === 'g') {
        e.preventDefault();
        window.open('https://github.com/subhamdas2806', '_blank');
      } else if (key === 'p') {
        e.preventDefault();
        currentWpIdx = (currentWpIdx + 1) % wallpapers.length;
        applyWallpaper(currentWpIdx, true);
      }
    }
  });


  // ==========================================================================
  // 8. LIVE LOCATION CLOCK & DATE (JAIPUR / IST)
  // ==========================================================================
  function updateClock() {
    const clockElement = document.getElementById('live-clock');
    const dateElement = document.getElementById('live-date');
    if (!clockElement) return;

    const clockOptions = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    const dateOptions = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short'
    };

    try {
      const now = new Date();
      const clockFormatter = new Intl.DateTimeFormat('en-US', clockOptions);
      clockElement.textContent = clockFormatter.format(now);

      if (dateElement) {
        const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
        const formattedDate = dateFormatter.format(now);
        dateElement.textContent = `${formattedDate} • `;
      }
    } catch (e) {
      console.error('Error formatting clock: ', e);
    }
  }

  updateClock();
  setInterval(updateClock, 1000);


  // ==========================================================================
  // 9. WINDOW CONTROL BUTTON STATES (CLOSE, MINIMIZE, MAXIMIZE, REBOOT)
  // ==========================================================================
  const mainWindow = document.getElementById('main-window');
  const closeBtn = document.querySelector('.dot.close');
  const minimizeBtn = document.querySelector('.dot.minimize');
  const expandBtn = document.querySelector('.dot.expand');
  const offlineScreen = document.getElementById('offline-screen');
  const rebootBtn = document.getElementById('reboot-btn');
  const shutdownUptime = document.getElementById('shutdown-uptime');
  
  let pageLoadTime = new Date();

  if (closeBtn && mainWindow) {
    closeBtn.addEventListener('click', () => {
      mainWindow.classList.add('closed');
      
      const uptimeMs = new Date() - pageLoadTime;
      const uptimeSec = Math.floor(uptimeMs / 1000);
      const uptimeMin = Math.floor(uptimeSec / 60);
      const secondsPart = uptimeSec % 60;
      if (shutdownUptime) shutdownUptime.textContent = `${uptimeMin}m ${secondsPart}s`;
      
      setTimeout(() => {
        if (offlineScreen) offlineScreen.style.display = 'flex';
      }, 500);
      showToast('System shut down.');
    });
  }

  if (rebootBtn && offlineScreen && mainWindow) {
    rebootBtn.addEventListener('click', () => {
      offlineScreen.style.display = 'none';
      mainWindow.classList.remove('closed');
      mainWindow.classList.add('animate-entrance');
      
      // Reset window sizing on reboot
      mainWindow.style.width = '';
      mainWindow.style.height = '';
      mainWindow.style.maxWidth = '';
      
      // Reset window scroll position on reboot
      const winContent = document.querySelector('.window-content');
      if (winContent) winContent.scrollTop = 0;
      
      // Hide restore widget if active
      const restoreWidget = document.getElementById('restore-widget');
      if (restoreWidget) restoreWidget.style.display = 'none';
      
      const cmdElement = document.getElementById('terminal-type-cmd');
      if (cmdElement) cmdElement.textContent = '';
      const outputElement = document.getElementById('terminal-links-output');
      if (outputElement) outputElement.style.opacity = '0';
      const inputLine = document.getElementById('term-input-line');
      if (inputLine) inputLine.style.display = 'none';
      
      const termHistory = document.getElementById('terminal-history');
      if (termHistory) {
        termHistory.innerHTML = `
          <div class="term-line">
            <span class="term-prompt">guest@subham-dev:~ $</span> <span class="cmd-cmd" id="terminal-type-cmd"></span>
          </div>
          <div class="term-output" id="terminal-links-output" style="opacity: 0; transition: opacity 0.5s ease;">
            <div class="link-row">
              <span class="link-label">LinkedIn:</span>
              <a href="https://www.linkedin.com/in/subhamdas06" target="_blank" rel="noopener noreferrer" class="term-link">https://www.linkedin.com/in/subhamdas06</a>
            </div>
            <div class="link-row">
              <span class="link-label">GitHub:</span>
              <a href="https://github.com/subhamdas2806" target="_blank" rel="noopener noreferrer" class="term-link">https://github.com/subhamdas2806</a>
            </div>
            <div class="link-row">
              <span class="link-label">Email:</span>
              <a href="mailto:dassubham7756@gmail.com" class="term-link">dassubham7756@gmail.com</a>
            </div>
            <div class="link-row" style="margin-top: 14px; color: var(--text-secondary); opacity: 0.85;">
              <span>💡 Type 'help' at the prompt below to list available interactive commands.</span>
            </div>
          </div>
        `;
      }
      
      pageLoadTime = new Date();
      terminalObserverRun = false;
      if (connectSection) {
        revealObserver.observe(connectSection);
        terminalObserver.observe(connectSection);
      }
      showToast('System rebooted.');
    });
  }

  if (minimizeBtn && mainWindow) {
    minimizeBtn.addEventListener('click', () => {
      mainWindow.classList.add('minimized');
      
      let restoreWidget = document.getElementById('restore-widget');
      if (!restoreWidget) {
        restoreWidget = document.createElement('button');
        restoreWidget.id = 'restore-widget';
        restoreWidget.className = 'restore-pill';
        restoreWidget.innerHTML = '🪟 Restore Window';
        document.body.appendChild(restoreWidget);
        
        restoreWidget.addEventListener('click', () => {
          mainWindow.classList.remove('minimized');
          restoreWidget.style.display = 'none';
        });
      }
      restoreWidget.style.display = 'flex';
      showToast('Window minimized.');
    });
  }

  if (expandBtn && mainWindow) {
    expandBtn.addEventListener('click', () => {
      mainWindow.classList.toggle('maximized');
    });
  }


  // ==========================================================================
  // 10. DRAGGABLE WINDOW (DESKTOP VIEWPORTS ONLY)
  // ==========================================================================
  const windowHeader = document.querySelector('.window-header');
  
  if (mainWindow && windowHeader) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;
    
    const isDraggable = () => window.innerWidth > 900 && !mainWindow.classList.contains('maximized');
    
    windowHeader.addEventListener('mousedown', dragStart);
    windowHeader.addEventListener('touchstart', dragStart, { passive: true });
    
    function dragStart(e) {
      if (!isDraggable()) return;
      
      if (e.target.closest('.window-controls') || e.target.closest('.header-actions') || e.target.closest('#title-pill')) {
        return;
      }
      
      isDragging = true;
      windowHeader.style.cursor = 'grabbing';
      
      const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
      
      startX = clientX;
      startY = clientY;
      
      const rect = mainWindow.getBoundingClientRect();
      const zoomFactor = 0.9;
      initialLeft = rect.left / zoomFactor;
      initialTop = rect.top / zoomFactor;
      
      mainWindow.style.position = 'absolute';
      mainWindow.style.margin = '0';
      mainWindow.style.left = `${initialLeft}px`;
      mainWindow.style.top = `${initialTop}px`;
      
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchmove', dragMove, { passive: false });
      document.addEventListener('touchend', dragEnd);
    }
    
    function dragMove(e) {
      if (!isDragging) return;
      
      if (e.type === 'touchmove') e.preventDefault();
      
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
      
      const dx = clientX - startX;
      const dy = clientY - startY;
      // Adjust dx/dy for CSS zoom scale of 0.9 to preserve 1:1 cursor tracking
      const zoomFactor = 0.9;
      let newLeft = initialLeft + dx / zoomFactor;
      let newTop = initialTop + dy / zoomFactor;
      
      const minVisible = 100;
      newLeft = Math.max(-mainWindow.offsetWidth + minVisible, Math.min(window.innerWidth - minVisible, newLeft));
      newTop = Math.max(0, Math.min(window.innerHeight - minVisible, newTop));
      
      mainWindow.style.left = `${newLeft}px`;
      mainWindow.style.top = `${newTop}px`;
    }
    
    function dragEnd() {
      isDragging = false;
      windowHeader.style.cursor = 'grab';
      
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('touchend', dragEnd);
    }
  }

  // Reset positioning on mobile sizes
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900 && mainWindow) {
      mainWindow.style.position = '';
      mainWindow.style.margin = '';
      mainWindow.style.left = '';
      mainWindow.style.top = '';
      mainWindow.style.width = '';
      mainWindow.style.height = '';
      mainWindow.style.maxWidth = '';
    }
  });

  // ==========================================================================
  // 10.1 RESIZABLE WINDOW (DESKTOP VIEWPORTS ONLY)
  // ==========================================================================
  const resizeHandle = document.getElementById('window-resize');
  if (mainWindow && resizeHandle) {
    let isResizing = false;
    let startX, startY;
    let startWidth, startHeight;
    const zoomFactor = 0.9;

    const isResizable = () => window.innerWidth > 900 && !mainWindow.classList.contains('maximized');

    resizeHandle.addEventListener('mousedown', resizeStart);
    resizeHandle.addEventListener('touchstart', resizeStart, { passive: true });

    function resizeStart(e) {
      if (!isResizable()) return;
      e.stopPropagation(); // Prevent dragging parent window
      e.preventDefault();  // Prevent text selection during resize

      isResizing = true;
      mainWindow.classList.add('is-resizing');
      
      const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

      startX = clientX;
      startY = clientY;

      const rect = mainWindow.getBoundingClientRect();
      startWidth = rect.width / zoomFactor;
      startHeight = rect.height / zoomFactor;

      document.addEventListener('mousemove', resizeMove);
      document.addEventListener('mouseup', resizeEnd);
      document.addEventListener('touchmove', resizeMove, { passive: false });
      document.addEventListener('touchend', resizeEnd);
    }

    function resizeMove(e) {
      if (!isResizing) return;
      if (e.type === 'touchmove') e.preventDefault();

      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;

      let newWidth = startWidth + dx / zoomFactor;
      let newHeight = startHeight + dy / zoomFactor;

      const minWidth = 450;
      const minHeight = 350;
      const maxWidth = window.innerWidth / zoomFactor;
      const maxHeight = window.innerHeight / zoomFactor;

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      mainWindow.style.width = `${newWidth}px`;
      mainWindow.style.height = `${newHeight}px`;
      mainWindow.style.maxWidth = 'none';
    }

    function resizeEnd() {
      isResizing = false;
      mainWindow.classList.remove('is-resizing');
      
      document.removeEventListener('mousemove', resizeMove);
      document.removeEventListener('mouseup', resizeEnd);
      document.removeEventListener('touchmove', resizeMove);
      document.removeEventListener('touchend', resizeEnd);
    }
  }


  // ==========================================================================
  // 11. DESKTOP WALLPAPER SYSTEM
  // ==========================================================================
  const bgContainer = document.querySelector('.bg-gradient-container');
  
  const wallpapers = [
    { class: 'wp-monterey', name: 'Monterey Wave' },
    { class: 'wp-sonoma', name: 'Sonoma Aurora' },
    { class: 'wp-space', name: 'Deep Space' },
    { class: 'wp-matrix', name: 'Matrix Terminal' },
    { class: 'wp-glass', name: 'Aerial Beach (Glassmorphism)' }
  ];

  // Wallpaper persistence with version check to migration-force the new default glass theme for returning users
  let cachedWp = localStorage.getItem('portfolio-wp-idx');
  let wpVersion = localStorage.getItem('portfolio-wp-version');
  let currentWpIdx;

  if (wpVersion !== '2.0' || cachedWp === null) {
    currentWpIdx = 4; // Force Aerial Beach (Glassmorphism) as the new default
    localStorage.setItem('portfolio-wp-idx', 4);
    localStorage.setItem('portfolio-wp-version', '2.0');
  } else {
    currentWpIdx = parseInt(cachedWp);
  }
  applyWallpaper(currentWpIdx, false);

  function applyWallpaper(idx, triggerToast) {
    if (!bgContainer) return;
    
    // Safety check for index out of bounds
    if (idx >= wallpapers.length) {
      idx = 0;
    }
    
    wallpapers.forEach(wp => bgContainer.classList.remove(wp.class));
    bgContainer.classList.add(wallpapers[idx].class);
    localStorage.setItem('portfolio-wp-idx', idx);
    
    // Manage background video play/pause to conserve resources
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
      if (wallpapers[idx].class === 'wp-glass') {
        bgVideo.play().catch(err => console.log('Autoplay blocked or video loading failed:', err));
      } else {
        bgVideo.pause();
      }
    }
    
    if (triggerToast) {
      showToast(`Desktop Wallpaper: ${wallpapers[idx].name}`);
    }
  }

  // Hook wallpaper switcher button
  const wallpaperToggle = document.getElementById('wallpaper-toggle');
  if (wallpaperToggle) {
    wallpaperToggle.addEventListener('click', () => {
      currentWpIdx = (currentWpIdx + 1) % wallpapers.length;
      applyWallpaper(currentWpIdx, true);
    });
  }


  // ==========================================================================
  // 12. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    
    // Slight timeout to let style register
    setTimeout(() => {
      toast.classList.add('active');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        toast.style.display = 'none';
      }, 300);
    }, 2800);
  }


  // ==========================================================================
  // 13. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.section-container, .hero-section');
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: document.querySelector('.window-content'),
    threshold: 0.05
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ==========================================================================
  // 14. INTERACTIVE TERMINAL SHELL (CONTACT CARD)
  // ==========================================================================
  const termBody = document.getElementById('term-body-interactive');
  const termInputLine = document.getElementById('term-input-line');
  const termRealInput = document.getElementById('term-real-input');
  const termTypedInput = document.getElementById('term-typed-input');
  const termHistory = document.getElementById('terminal-history');
  
  let terminalObserverRun = false;
  
  const terminalObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !terminalObserverRun) {
        terminalObserverRun = true;
        typeTerminalCommand();
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: document.querySelector('.window-content'),
    threshold: 0.15
  });

  const connectSection = document.getElementById('connect');
  if (connectSection) {
    terminalObserver.observe(connectSection);
  }

  // Pre-typed cat links.txt animation
  function typeTerminalCommand() {
    const cmdElement = document.getElementById('terminal-type-cmd');
    const outputElement = document.getElementById('terminal-links-output');
    if (!cmdElement) return;

    cmdElement.textContent = '';
    const cmdText = 'cat links.txt';
    let idx = 0;

    function type() {
      if (idx < cmdText.length) {
        cmdElement.textContent += cmdText[idx];
        idx++;
        setTimeout(type, 70);
      } else {
        if (outputElement) {
          outputElement.style.opacity = '1';
        }
        // Initialize Shell Prompt
        setTimeout(() => {
          if (termInputLine) termInputLine.style.display = 'flex';
          if (termRealInput) termRealInput.focus();
        }, 600);
      }
    }

    setTimeout(type, 400);
  }

  // Focus terminal input
  if (termBody && termRealInput) {
    termBody.addEventListener('click', () => {
      termRealInput.focus();
    });
  }

  // Bind typing events
  if (termRealInput && termTypedInput) {
    termRealInput.addEventListener('input', (e) => {
      termTypedInput.textContent = e.target.value;
    });

    termRealInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = termRealInput.value.trim();
        termRealInput.value = '';
        termTypedInput.textContent = '';
        
        executeTerminalShell(command);
      }
    });
  }

  function executeTerminalShell(command) {
    if (!termHistory) return;

    // Append standard prompt + command line to history
    const commandLine = document.createElement('div');
    commandLine.className = 'term-line';
    commandLine.innerHTML = `<span class="term-prompt">guest@subham-dev:~ $</span> <span class="term-cmd">${escapeHTML(command)}</span>`;
    termHistory.appendChild(commandLine);

    if (command !== '') {
      const outputBlock = document.createElement('div');
      outputBlock.className = 'term-line-output-block';
      
      const cleanCmd = command.toLowerCase();
      
      if (cleanCmd === 'help') {
        outputBlock.innerHTML = `Available commands:
  neofetch      - displays system specs & ASCII profile banner
  about         - prints personal details & credentials bio
  experience    - lists professional work experience & internships
  participation - lists hackathon & competition records
  projects      - lists recent tech project summaries & stacks
  skills        - lists development language expertise
  theme         - toggles dark/light desktop themes
  wallpaper     - cycles through Sonoma, Space, Monterey, Matrix, and Aerial Beach
  clear         - clears the terminal history log
  easter        - prints secret ASCII meme
  linkedin      - opens linkedin profile in new tab
  github        - opens github profile in new tab
  email         - copies email address to clipboard`;
      } else if (cleanCmd === 'neofetch') {
        const uptimeMs = new Date() - pageLoadTime;
        const uptimeSec = Math.floor(uptimeMs / 1000);
        const uptimeMin = Math.floor(uptimeSec / 60);
        const currentWp = wallpapers[currentWpIdx].name;
        const screenRes = `${window.innerWidth}x${window.innerHeight}`;
        
        outputBlock.innerHTML = `
<div class="neofetch-wrap">
<pre class="neofetch-logo">
   ___________
  |  _______  |
  | |       | |
  | |  S D  | |
  | |_______| |
  |___________|
  /           \\
 /_____________\\
 \\_____________/
</pre>
<div class="neofetch-info">
  <span class="neofetch-user-host">guest@subham-dev</span>
  <span class="neofetch-sep">--------------</span>
  <div class="neofetch-row"><span class="neofetch-label">OS:</span><span class="neofetch-val">SubhamOS v2.6.26 (Monospace)</span></div>
  <div class="neofetch-row"><span class="neofetch-label">Host:</span><span class="neofetch-val">Macbook Pro (Jaipur)</span></div>
  <div class="neofetch-row"><span class="neofetch-label">Uptime:</span><span class="neofetch-val">${uptimeMin}m ${uptimeSec % 60}s</span></div>
  <div class="neofetch-row"><span class="neofetch-label">Shell:</span><span class="neofetch-val">zsh 5.9</span></div>
  <div class="neofetch-row"><span class="neofetch-label">Resolution:</span><span class="neofetch-val">${screenRes}</span></div>
  <div class="neofetch-row"><span class="neofetch-label">Theme:</span><span class="neofetch-val">${htmlElement.getAttribute('data-theme') === 'dark' ? 'Slate' : 'Silver'}</span></div>
  <div class="neofetch-row"><span class="neofetch-label">Wallpaper:</span><span class="neofetch-val">${currentWp}</span></div>
  <div class="neofetch-row"><span class="neofetch-label">CPU:</span><span class="neofetch-val">Jaipur i7 @ 3.4GHz</span></div>
  <div class="neofetch-row"><span class="neofetch-label">Memory:</span><span class="neofetch-val">2048MB / 8192MB (Simulated)</span></div>
</div>
</div>`;
      } else if (cleanCmd === 'about') {
        outputBlock.textContent = `subham das — computer science student at NIMS university jaipur (grad 2028).
building experiences between code and creativity. interested in systems, emulators, and dynamic designs.`;
      } else if (cleanCmd === 'experience') {
        outputBlock.innerHTML = `- AI Web Development Intern @ InAmigos Foundation (IAF) (Jun 2026 - Present)
  Internship • Remote
  Selected for an AI Web Development Internship through Internshala. Excited to gain hands-on experience and build real-world projects.

- Artificial Intelligence Developer @ Fiverr (Mar 2023 - Jun 2024)
  Freelance • Remote
  Created and customized Stable Diffusion models for clients on Fiverr, helping bring creative ideas to life through generative AI.
  Skills: Stable Diffusion, ComfyUI`;
      } else if (cleanCmd === 'participation') {
        outputBlock.innerHTML = `- Smart India Hackathon (SIH) 2025
  Participated in one of the largest national hackathons in India, collaborating in a team to build innovative solutions solving real-world government/industrial problem statements.

- NIMS Ideathon 2.0 (2025)
  Presented and developed an innovative tech idea/prototype, competing against other developers and engineers at NIMS University.`;
      } else if (cleanCmd === 'projects') {
        outputBlock.textContent = `- CHIP-8 Emulator (C++ • Opcode Decoding • Systems)
- Pong AI (C++ • Neural Networks • Game Dev)
- Credential Verification Platform (React • Web3 • Dashboard)
- AI Experiments (Generative AI • Creative Tech)`;
      } else if (cleanCmd === 'skills') {
        outputBlock.textContent = `Languages: C++, Python, JavaScript, TypeScript
Frontend:  React, Next.js, Tailwind CSS
Backend:   Node.js, Flask
Tools:     Git, AWS, VS Code, Linux`;
      } else if (cleanCmd === 'theme') {
        toggleTheme();
        outputBlock.textContent = `Theme toggled to: ${htmlElement.getAttribute('data-theme')}`;
      } else if (cleanCmd === 'wallpaper') {
        currentWpIdx = (currentWpIdx + 1) % wallpapers.length;
        applyWallpaper(currentWpIdx, false);
        outputBlock.textContent = `Wallpaper cycled to: ${wallpapers[currentWpIdx].name}`;
      } else if (cleanCmd === 'clear') {
        termHistory.innerHTML = '';
        return;
      } else if (cleanCmd === 'linkedin') {
        window.open('https://www.linkedin.com/in/subhamdas06', '_blank');
        outputBlock.textContent = 'Opening LinkedIn...';
      } else if (cleanCmd === 'github') {
        window.open('https://github.com/subhamdas2806', '_blank');
        outputBlock.textContent = 'Opening GitHub...';
      } else if (cleanCmd === 'email') {
        copyEmailToClipboard();
        outputBlock.textContent = 'Email address copied to clipboard.';
      } else if (cleanCmd === 'easter') {
        outputBlock.innerHTML = `<pre class="easter-ascii" style="font-family: var(--font-mono); font-size: 5px; line-height: 1.1; letter-spacing: 0; white-space: pre; overflow-x: auto; color: var(--text-primary); margin: 10px 0;">⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡿⠿⠟⠛⠛⠉⠉⠉⠁⠀⠀⠀⠀⠀⠈⠉⠉⠩⠉⠹⠭⠙⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡿⠿⠫⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⣀⠀⠈⠁⠀⠒⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠒⣩⠥⡽⣛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣶⣖⡄⠀⠈⠀⠀⠀⠀⠀⣀⠠⠤⠶⠄⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠖⠂⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⢙⡻⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡿⣛⡯⠖⠀⠀⠀⠀⠀⠀⠰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⡀⠤⡈⢷⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠿⠏⠰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⠶⠈⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢶⣹⣿⣿⣿⣿⣿
⣿⣿⣿⣿⡛⠅⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡄⠀⢀⠀⠀⠀⠄⠀⠠⠀⠀⡠⠤⠀⠀⠀⠙⢻⣿⣿⣿⣿
⣿⣿⣿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣠⣤⣤⣤⡀⠤⢤⠌⢡⠤⣀⣤⣤⣴⠰⣀⣴⣼⣾⣿⣾⣿⣿⣮⣤⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⢾⣿⣿⣿
⣿⣿⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠦⢐⣥⣦⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣾⣿⣿⣿⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣇⣀⣼⡂⠀⢀⠀⠀⠀⠀⠁⠀⠀⠀⠠⢤⣿⣿⣿
⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠰⢏⢦⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⢢⠙⣆⠀⠀⠀⠀⡘⠀⠀⠀⠘⣻⣿⣿
⣿⣿⡗⠀⠀⠀⠀⠀⠀⠀⠀⡆⢺⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⡨⢐⠡⠀⠀⠁⢀⠀⠀⠀⠈⠈⢿⣿⣿
⣿⣿⢃⡄⠀⠀⠀⠀⠀⠀⠀⢾⢯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣖⠇⠃⠌⠀⠀⠀⠀⠀⠀⠀⠀⢀⢸⣿⣿
⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⢂⣯⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⡂⠁⠞⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿
⣿⣿⣿⣇⠏⠀⠀⠀⠀⠀⠠⡘⣮⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣅⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣾⣿⣿
⣿⣿⣿⣟⡀⠀⠀⠀⠀⠀⠰⠱⠞⢿⣿⣿⠿⠿⠿⠿⣿⣿⣿⢿⣿⣿⣟⢿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⡿⠿⡿⢿⠻⠿⠿⠿⠿⠟⠀⢘⠀⡄⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿
⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠣⢃⠀⠈⠀⠀⠈⠈⠀⠉⠈⠉⠉⠁⠉⠁⠉⠁⠀⣙⣿⣿⣮⡉⠉⠈⠉⠈⠈⠉⠁⠀⠀⠀⠈⠘⠚⠡⠄⠀⠀⠀⠘⠐⠠⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿
⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⢸⡀⠀⠀⠀⠀⣀⣾⡀⠆⠰⢀⣶⣆⠀⠀⠀⠀⠀⣀⣀⣉⣹⣏⠀⠀⠀⠀⠀⣀⣶⣆⡰⠶⠆⣰⣆⠀⠀⠀⠀⠀⠁⡀⠉⠀⠀⠀⠀⢀⠀⢾⣿⣿⣿
⣿⣿⣿⣿⣿⣧⠀⠀⠀⠈⠲⣜⣶⣤⣦⣄⠘⠉⡻⠟⢛⠿⠭⣩⣱⣽⣯⣧⣞⣿⣻⣿⣿⣿⣰⣬⣿⣿⣯⣼⠟⣯⠭⠯⢋⠭⠑⢁⣤⣄⣠⣒⡤⠁⠀⠂⠀⠠⣌⠀⢠⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣧⠠⡀⠀⢹⢺⣿⣿⣿⣾⣷⣶⣶⣶⣾⣶⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣶⣖⣶⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⢐⠚⢀⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⠀⢔⡀⠈⠎⢹⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣯⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⡛⠀⠀⠀⠀⡴⢁⢀⣼⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣆⠸⠳⠄⠘⡀⠘⢻⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢘⣠⣿⣿⣿⣿⣿⣿⣷⣈⣣⠙⣾⣿⣿⣿⣿⣿⣿⣿⣿⡿⠙⠅⠁⠀⠀⠀⠀⢿⡱⠈⣼⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣾⠀⠀⠀⠁⡙⠬⡹⣿⣿⣿⣿⣿⣿⣿⡃⡟⠿⣿⣿⣿⣿⣿⣿⠟⢸⢩⠆⣿⣿⣿⣿⣿⣿⣿⣏⠣⠌⠁⠂⠀⠀⠀⠀⣶⣤⣴⣾⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠑⡳⣄⣾⢿⣿⣿⣿⣿⣿⣇⠀⠀⠈⠙⠛⠛⠉⠁⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣳⢂⡑⡆⠀⠀⠄⠁⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⡄⠀⠈⠾⣶⢿⣿⡿⡿⢿⡿⠟⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠜⠟⡿⣛⢿⣿⣿⠅⢮⢠⠁⠀⠈⠆⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⢉⣏⡛⠉⠱⠁⠁⡀⠁⠀⠀⠀⠀⡀⠀⠀⠘⢔⠀⠄⠀⡌⡀⠘⢂⠀⠃⠛⡇⠃⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠈⠀⠀⠄⠀⠀⠂⠀⠀⠐⠂⠡⠐⠲⢇⣠⣤⠾⠂⠘⠀⠙⠐⠈⠀⠀⠀⠀⠐⡌⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⢠⠀⠀⠀⠀⠀⠖⠀⠄⣤⣶⣶⣶⣶⣶⣶⣶⣦⣤⣤⣶⣶⣶⣶⣶⡶⣶⠦⢢⡀⠂⠜⠀⠀⠀⠀⠀⠀⠀⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⣷⠆⠀⠀⠀⠀⠀⠀⠏⠱⠉⡸⠎⠏⠈⠉⠁⠀⠈⠁⠉⠿⠹⠉⠉⠉⠇⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠉⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠿⠟⠛⠛⠉⠀⠀⠀⠀⠀⡿⣖⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣮⠀⠀⠀⠀⠙⠻⢿⣿⣿⣿⣿⣿⣿
⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣦⠀⠀⠀⠀⠀⠀⢀⣠⠤⢀⢤⡵⢢⣽⡾⡴⢷⡽⣶⡿⣾⣷⢂⠠⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡖⠁⠀⠀⠀⠀⠀⠀⠈⠉⠛⠛⠿⢿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢽⣿⡆⠀⠀⠀⠀⠀⠀⠀⠂⡀⠎⠀⠌⡀⠁⠍⡀⠘⡋⠐⠁⠠⠀⠒⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣾⣷⡤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣏⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣗⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⡟⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</pre>`;
      } else {
        outputBlock.className = 'term-line-output-block cmd-term-error';
        outputBlock.textContent = `zsh: command not found: ${command}. Type 'help' for options.`;
      }
      
      termHistory.appendChild(outputBlock);
    }

    // Scroll window content container down to show terminal results
    const winContent = document.querySelector('.window-content');
    if (winContent) {
      setTimeout(() => {
        winContent.scrollTop = winContent.scrollHeight;
      }, 50);
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

});
