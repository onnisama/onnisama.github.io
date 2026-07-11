(function () {
  'use strict';

  var menuButton = document.querySelector('.rail-menu');
  var railPanel = document.querySelector('.rail-panel');
  var dialog = document.querySelector('[data-search-dialog]');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var root = document.getElementById('pjax-root');
  var stage = document.querySelector('.site-stage');
  var searchIndex = null;
  var previousFocus = null;
  var activeNavigation = null;
  var navigationSerial = 0;
  var entryAnimationTimer = null;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var renderedPageKey = window.location.pathname + window.location.search;

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  function closeMenu() {
    if (!menuButton || !railPanel) return;
    menuButton.setAttribute('aria-expanded', 'false');
    railPanel.classList.remove('is-open');
  }

  if (menuButton && railPanel) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      railPanel.classList.toggle('is-open', !expanded);
    });
  }

  function openSearch() {
    if (!dialog) return;
    previousFocus = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add('search-is-open');
    window.setTimeout(function () { if (searchInput) searchInput.focus(); }, 20);
  }

  function closeSearch() {
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    document.body.classList.remove('search-is-open');
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  document.querySelectorAll('[data-search-open]').forEach(function (button) {
    button.addEventListener('click', function () { closeMenu(); openSearch(); });
  });
  document.querySelectorAll('[data-search-close]').forEach(function (button) {
    button.addEventListener('click', closeSearch);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeSearch();
  });

  function escapeHtml(value) {
    var node = document.createElement('span');
    node.textContent = value || '';
    return node.innerHTML;
  }

  function renderResults(query) {
    if (!searchResults) return;
    var keyword = query.trim().toLowerCase();
    if (!keyword) {
      searchResults.innerHTML = '<p class="search-hint">试试“Git”“Python”或“学习笔记”。</p>';
      return;
    }
    if (!searchIndex) {
      searchResults.innerHTML = '<p class="search-hint">正在读取文章索引…</p>';
      return;
    }
    var matches = searchIndex.filter(function (item) {
      return [item.title, item.tags, item.content].join(' ').toLowerCase().indexOf(keyword) !== -1;
    }).slice(0, 12);
    if (!matches.length) {
      searchResults.innerHTML = '<p class="search-hint">没有找到相关内容，换个关键词试试。</p>';
      return;
    }
    searchResults.innerHTML = matches.map(function (item) {
      return '<a href="' + item.url + '"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.tags || '未分类') + '</span></a>';
    }).join('');
  }

  if (searchInput) {
    fetch('/search.json')
      .then(function (response) { return response.json(); })
      .then(function (items) { searchIndex = items; renderResults(searchInput.value); })
      .catch(function () { if (searchResults) searchResults.innerHTML = '<p class="search-hint">搜索暂时不可用，请稍后再试。</p>'; });
    searchInput.addEventListener('input', function () { renderResults(searchInput.value); });
  }

  function initDisqus() {
    var container = document.querySelector('[data-disqus-auto]');
    if (!container || container.dataset.ready === 'true') return;
    container.dataset.ready = 'true';

    if (window.DISQUS) {
      window.DISQUS.reset({ reload: true, config: function () {
        this.page.url = container.dataset.url;
        this.page.identifier = container.dataset.identifier;
      }});
    } else {
      window.disqus_config = function () {
        this.page.url = container.dataset.url;
        this.page.identifier = container.dataset.identifier;
      };
      var script = document.createElement('script');
      script.src = 'https://' + container.dataset.shortname + '.disqus.com/embed.js';
      script.setAttribute('data-timestamp', String(Date.now()));
      document.body.appendChild(script);
    }
  }

  function initLanguage() {
    var select = document.querySelector('[data-language-select]');
    if (!select || select.dataset.ready === 'true') return;
    select.dataset.ready = 'true';
    var initial = new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'zh';
    select.value = initial;

    function show(language) {
      document.querySelectorAll('.zh').forEach(function (node) { node.style.display = language === 'zh' ? 'block' : 'none'; });
      document.querySelectorAll('.en').forEach(function (node) { node.style.display = language === 'en' ? 'block' : 'none'; });
      document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    }

    show(initial);
    select.addEventListener('change', function () {
      var language = select.value === 'en' ? 'en' : 'zh';
      var url = new URL(window.location.href);
      if (language === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      renderedPageKey = url.pathname + url.search;
      show(language);
    });
  }

  function initCatalog() {
    var container = document.querySelector('.post-container');
    var catalog = document.querySelector('.catalog-body');
    if (!container || !catalog) return;
    catalog.innerHTML = '';
    var headings = Array.prototype.slice.call(container.querySelectorAll('h2, h3'));
    headings.forEach(function (heading, index) {
      if (!heading.id) heading.id = 'section-' + (index + 1);
      var item = document.createElement('li');
      item.className = heading.tagName.toLowerCase() + '_nav';
      var link = document.createElement('a');
      link.href = '#' + encodeURIComponent(heading.id);
      link.textContent = heading.textContent;
      item.appendChild(link);
      catalog.appendChild(item);
    });
    var box = document.querySelector('.catalog-container');
    if (box) box.hidden = headings.length === 0;
  }

  function initTaskLists() {
    document.querySelectorAll('.task-list-item input[type="checkbox"]').forEach(function (input) {
      if (input.hasAttribute('aria-label')) return;
      var item = input.closest('.task-list-item');
      input.setAttribute('aria-label', item ? item.textContent.trim() : '任务状态');
    });
  }

  function initMarkdownAlerts() {
    var alerts = {
      NOTE: {
        label: 'Note',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5"></path><path d="M12 8h.01"></path></svg>'
      },
      TIP: {
        label: 'Tip',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M8.5 14.5A6 6 0 1 1 15.5 14.5C14.5 15.3 14 16 14 18h-4c0-2-.5-2.7-1.5-3.5Z"></path></svg>'
      },
      IMPORTANT: {
        label: 'Important',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L12 3Z"></path></svg>'
      },
      WARNING: {
        label: 'Warning',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.8 19h18.4L12 3Z"></path><path d="M12 9v4"></path><path d="M12 16h.01"></path></svg>'
      },
      CAUTION: {
        label: 'Caution',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 3-5 5v8l5 5h8l5-5V8l-5-5H8Z"></path><path d="M12 8v5"></path><path d="M12 16h.01"></path></svg>'
      }
    };

    document.querySelectorAll('.post-container blockquote:not(.markdown-alert)').forEach(function (quote) {
      var marker = quote.firstElementChild;
      if (!marker || marker.tagName !== 'P') return;

      var match = marker.textContent.trim().match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (!match) return;

      var type = match[1].toUpperCase();
      var config = alerts[type];
      var firstNode = marker.firstChild;
      if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
        firstNode.nodeValue = firstNode.nodeValue.replace(/^\s*\[![A-Z]+\]\s*/i, '');
      }
      if (!marker.textContent.trim()) marker.remove();

      quote.classList.add('markdown-alert', 'markdown-alert-' + type.toLowerCase());
      quote.setAttribute('role', 'note');
      quote.setAttribute('aria-label', config.label);

      var title = document.createElement('p');
      title.className = 'markdown-alert-title';
      title.innerHTML = config.icon + '<span>' + config.label + '</span>';
      quote.prepend(title);
    });
  }

  function initCodeWindows() {
    var languageNames = {
      bash: 'Bash',
      shell: 'Shell',
      sh: 'Shell',
      zsh: 'Zsh',
      powershell: 'PowerShell',
      ps1: 'PowerShell',
      python: 'Python',
      py: 'Python',
      javascript: 'JavaScript',
      js: 'JavaScript',
      typescript: 'TypeScript',
      ts: 'TypeScript',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      json: 'JSON',
      yaml: 'YAML',
      yml: 'YAML',
      markdown: 'Markdown',
      md: 'Markdown',
      sql: 'SQL',
      java: 'Java',
      c: 'C',
      cpp: 'C++',
      csharp: 'C#',
      cs: 'C#',
      go: 'Go',
      rust: 'Rust',
      ruby: 'Ruby',
      rb: 'Ruby',
      text: 'Text',
      plaintext: 'Text',
      console: 'Console'
    };

    document.querySelectorAll('.post-container div.highlighter-rouge').forEach(function (block) {
      if (block.dataset.codeWindowReady === 'true' || !block.querySelector('.highlight > pre')) return;
      block.dataset.codeWindowReady = 'true';
      block.classList.add('code-window');

      var languageClass = Array.prototype.find.call(block.classList, function (name) {
        return name.indexOf('language-') === 0;
      });
      var language = languageClass ? languageClass.slice(9).toLowerCase() : 'text';
      var label = languageNames[language] || language.toUpperCase();

      var bar = document.createElement('div');
      bar.className = 'code-window-bar';
      bar.setAttribute('aria-label', '代码语言：' + label);
      bar.innerHTML = '<span class="code-window-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
      var languageLabel = document.createElement('span');
      languageLabel.className = 'code-window-language';
      languageLabel.textContent = label;
      bar.appendChild(languageLabel);
      block.prepend(bar);
    });
  }

  function initThemeToggle() {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle || toggle.dataset.ready === 'true') return;
    toggle.dataset.ready = 'true';

    function setTheme(dark) {
      var meta = document.querySelector('meta[name="theme-color"]');
      if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (meta) meta.setAttribute('content', '#1c1c1a');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (meta) meta.setAttribute('content', '#f4f3ef');
      }
    }

    toggle.addEventListener('click', function () {
      setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
      if (!localStorage.getItem('theme')) {
        setTheme(event.matches);
      }
    });
  }

  function initScrollTop() {
    var button = document.querySelector('[data-scroll-top]');
    var container = document.querySelector('.fab-container');
    if (!button || button.dataset.ready === 'true') return;
    button.dataset.ready = 'true';

    var lastScrollY = window.scrollY;
    var ticking = false;

    function update() {
      var currentScrollY = window.scrollY;

      if (currentScrollY > 300) {
        button.classList.add('is-visible');
      } else {
        button.classList.remove('is-visible');
      }

      if (container) {
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
          container.classList.add('is-hidden');
        } else if (currentScrollY < lastScrollY || currentScrollY <= 300) {
          container.classList.remove('is-hidden');
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    update();
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () { update(); });
        ticking = true;
      }
    }, { passive: true });

    button.addEventListener('click', function () {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  function initPageContent() {
    initDisqus();
    initLanguage();
    initCatalog();
    initTaskLists();
    initMarkdownAlerts();
    initCodeWindows();
    initThemeToggle();
    initScrollTop();
    if (window.initArchivePage) window.initArchivePage();
  }

  function updateHead(nextDocument) {
    document.title = nextDocument.title;
    ['meta[name="description"]', 'link[rel="canonical"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:url"]'].forEach(function (selector) {
      var current = document.querySelector(selector);
      var next = nextDocument.querySelector(selector);
      if (!next) return;
      if (current) current.replaceWith(next.cloneNode(true)); else document.head.appendChild(next.cloneNode(true));
    });
  }

  function executeScripts(scope) {
    scope.querySelectorAll('script').forEach(function (oldScript) {
      var script = document.createElement('script');
      Array.prototype.slice.call(oldScript.attributes).forEach(function (attribute) { script.setAttribute(attribute.name, attribute.value); });
      script.textContent = oldScript.textContent;
      oldScript.replaceWith(script);
    });
  }

  function updateCurrentNav() {
    document.querySelectorAll('.rail-links a').forEach(function (link) {
      var target = new URL(link.href, window.location.href);
      var active = target.pathname === window.location.pathname || (target.pathname !== '/' && window.location.pathname.indexOf(target.pathname) === 0);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
  }

  function getNavigationTarget(url) {
    var parsed = new URL(url, window.location.href);
    if (!parsed.hash) return null;
    var id = parsed.hash.slice(1);
    try { id = decodeURIComponent(id); } catch (error) { /* Keep the raw hash. */ }
    return document.getElementById(id);
  }

  function resetNavigationPosition(url) {
    var target = getNavigationTarget(url);
    document.documentElement.classList.add('is-resetting-scroll');
    // Apply the override before asking the browser to move; otherwise the
    // global smooth-scroll rule can still win for one frame.
    void document.documentElement.offsetHeight;
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
    else window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.requestAnimationFrame(function () {
      document.documentElement.classList.remove('is-resetting-scroll');
    });
  }

  function stopEntryAnimation() {
    if (entryAnimationTimer) {
      window.clearTimeout(entryAnimationTimer);
      entryAnimationTimer = null;
    }
    root.classList.remove('is-entering');
  }

  function playEntryAnimation() {
    if (!root) return;
    stopEntryAnimation();
    if (reducedMotion.matches) {
      if (stage) stage.classList.remove('is-leaving');
      return;
    }

    // Force a fresh animation timeline even when this URL was just visited.
    void root.offsetWidth;
    root.classList.add('is-entering');
    if (stage) stage.classList.remove('is-leaving');
    entryAnimationTimer = window.setTimeout(function () {
      root.classList.remove('is-entering');
      entryAnimationTimer = null;
    }, 720);
  }

  function waitForExitAnimation() {
    if (reducedMotion.matches || !stage) return Promise.resolve();
    return new Promise(function (resolve) {
      var timeout;
      function finish(event) {
        if (event && (event.target !== stage || event.propertyName !== 'opacity')) return;
        stage.removeEventListener('transitionend', finish);
        stage.removeEventListener('transitioncancel', finish);
        window.clearTimeout(timeout);
        resolve();
      }
      stage.addEventListener('transitionend', finish);
      stage.addEventListener('transitioncancel', finish);
      timeout = window.setTimeout(finish, 220);
    });
  }

  async function navigate(url, fromHistory) {
    if (!root) { window.location.href = url; return; }
    var serial = ++navigationSerial;
    if (activeNavigation) activeNavigation.abort();
    activeNavigation = new AbortController();

    stopEntryAnimation();
    if (stage) stage.classList.remove('is-leaving');
    root.setAttribute('aria-busy', 'true');
    try {
      var response = await fetch(url, {
        headers: { 'X-PJAX': 'true' },
        signal: activeNavigation.signal
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var nextDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
      var nextRoot = nextDocument.getElementById('pjax-root');
      if (!nextRoot) throw new Error('Missing page content');

      // Keep the current page visible while loading, then leave on a fixed timeline.
      if (stage) stage.classList.add('is-leaving');
      await waitForExitAnimation();
      if (serial !== navigationSerial) return;

      root.innerHTML = nextRoot.innerHTML;
      updateHead(nextDocument);
      if (!fromHistory) window.history.pushState({ pjax: true }, '', url);
      renderedPageKey = window.location.pathname + window.location.search;
      executeScripts(root);
      updateCurrentNav();
      initPageContent();
      closeSearch();
      closeMenu();
      resetNavigationPosition(url);
      var main = document.getElementById('main-content');
      if (main) main.focus({ preventScroll: true });

      root.removeAttribute('aria-busy');
      playEntryAnimation();
    } catch (error) {
      if (error.name === 'AbortError') return;
      window.location.href = url;
    } finally {
      if (serial === navigationSerial) {
        root.removeAttribute('aria-busy');
        if (stage) stage.classList.remove('is-leaving');
        activeNavigation = null;
      }
    }
  }

  document.addEventListener('click', function (event) {
    if (railPanel && railPanel.classList.contains('is-open') && !event.target.closest('.site-rail')) closeMenu();
    var link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== '_self' || link.hasAttribute('download') || link.hasAttribute('data-no-pjax')) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    var target = new URL(href, window.location.href);
    if (target.origin !== window.location.origin) return;
    if (target.pathname === window.location.pathname && target.search === window.location.search && target.hash) return;
    event.preventDefault();
    navigate(target.href, false);
  });

  window.addEventListener('popstate', function () {
    var nextPageKey = window.location.pathname + window.location.search;
    if (nextPageKey === renderedPageKey) {
      resetNavigationPosition(window.location.href);
      return;
    }
    navigate(window.location.href, true);
  });
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    resetNavigationPosition(window.location.href);
    initPageContent();
    playEntryAnimation();
  });
  initPageContent();
  resetNavigationPosition(window.location.href);
  playEntryAnimation();
}());
