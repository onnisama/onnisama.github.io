(function () {
  const mount = document.getElementById('daily-song-root');
  const Vue = window.Vue;

  if (!mount || !Vue || window.__dailySongApp) return;

  const STORAGE_KEY = 'globalMusicState';
  const DAILY_KEY = 'globalMusicDaily';
  const PREF_KEY = 'globalMusicPrefs';

  const TRACKS = [
    { title: '简单爱', artist: '周杰伦', src: '/audio/Easylove.mp3', cover: '/img/music/Fantasy.png' },
    { title: '半岛铁盒', artist: '周杰伦', src: '/audio/IronBox.mp3', cover: '/img/music/Badukongjian.png' },
    { title: '暗号', artist: '周杰伦', src: '/audio/Signal.mp3', cover: '/img/music/Badukongjian.png' },
    { title: '晴天', artist: '周杰伦', src: '/audio/Sunny.mp3', cover: '/img/music/Yehuimei.png' },
    { title: '园游会', artist: '周杰伦', src: '/audio/Carnival.mp3', cover: '/img/music/Qilixiang.jpg' },
    { title: '七里香', artist: '周杰伦', src: '/audio/Fragrance.mp3', cover: '/img/music/Qilixiang.jpg' },
    { title: '发如雪', artist: '周杰伦', src: '/audio/HairSnow.mp3', cover: '/img/music/Xiaobang.png' },
    { title: '千里之外', artist: '周杰伦', src: '/audio/Miles.mp3', cover: '/img/music/StillFantasy.png' },
    { title: '青花瓷', artist: '周杰伦', src: '/audio/China.mp3', cover: '/img/music/Busy.png' },
    { title: '花海', artist: '周杰伦', src: '/audio/Flowersea.mp3', cover: '/img/music/Magic.png' },
    { title: '稻香', artist: '周杰伦', src: '/audio/Rice.mp3', cover: '/img/music/Magic.png' },
    { title: '兰亭序', artist: '周杰伦', src: '/audio/Lanting.mp3', cover: '/img/music/Magic.png' },
  ];

  function readJson(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch (error) {
      return null;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Daily song storage failed', error);
    }
  }

  function todayKey() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }

  function findTrackBySrc(src) {
    return TRACKS.find((track) => track.src === src || new URL(track.src, location.origin).href === src);
  }

  function normalizeTrack(track) {
    if (!track || !track.src) return null;
    const known = findTrackBySrc(track.src);
    return known || {
      title: track.title || '今日单曲',
      artist: track.artist || '',
      src: track.src,
      cover: track.cover || '/img/music/Magic.png',
    };
  }

  function defaultTrackForDate(date) {
    let seed = 0;
    for (let index = 0; index < date.length; index += 1) {
      seed = (seed * 31 + date.charCodeAt(index)) % 9973;
    }
    return TRACKS[seed % TRACKS.length] || TRACKS[0];
  }

  function formatDate(date) {
    const parts = date.split('-');
    if (parts.length !== 3) return date;
    return `${Number(parts[1])}.${Number(parts[2])}`;
  }

  const app = Vue.createApp({
    name: 'DailySongPlayer',
    template: `
      <section class="daily-song-player" :class="{ 'is-playing': isPlaying }" aria-label="今日单曲播放器">
        <div
          v-if="!isExpanded"
          class="daily-song-compact"
          role="group"
          :aria-label="'今日单曲：' + track.title"
        >
          <button class="daily-song-compact-main" type="button" :aria-label="'展开今日单曲：' + track.title" @click="expand">
            <img class="daily-song-compact-cover" :src="track.cover" :alt="coverAlt">
            <span class="daily-song-compact-text">
              <span class="daily-song-compact-label">{{ isPlaying ? '正在播放' : '今日单曲' }}</span>
              <span class="daily-song-compact-title">{{ track.title }}</span>
            </span>
          </button>
          <button
            class="daily-song-btn daily-song-btn-primary daily-song-btn-icon daily-song-compact-play"
            type="button"
            :aria-label="playButtonLabel"
            @click.stop="togglePlay"
          >
            <svg v-if="isPlaying" class="daily-song-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6.5" y="5" width="3.5" height="14" rx="1"></rect>
              <rect x="14" y="5" width="3.5" height="14" rx="1"></rect>
            </svg>
            <svg v-else class="daily-song-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l10-6.5-10-6.5Z"></path>
            </svg>
          </button>
        </div>

        <div v-else class="daily-song-card" role="group" aria-label="今日单曲控制面板">
          <div class="daily-song-content">
            <div class="daily-song-cover-wrap" aria-hidden="true">
              <img class="daily-song-cover" :src="track.cover" :alt="coverAlt">
              <span class="daily-song-needle"></span>
            </div>

            <div class="daily-song-body">
              <div class="daily-song-meta">
                <div class="daily-song-kicker">
                  <span>{{ isPlaying ? 'NOW PLAYING' : 'DAILY TRACK' }}</span>
                  <span class="daily-song-date">{{ displayDate }}</span>
                </div>
                <h2 class="daily-song-title">{{ track.title }}</h2>
                <p class="daily-song-artist">{{ track.artist || '未知艺术家' }}</p>
              </div>

              <div class="daily-song-progress-row">
                <span>{{ currentLabel }}</span>
                <input
                  class="daily-song-progress"
                  type="range"
                  min="0"
                  :max="progressMax"
                  step="1"
                  :value="currentTime"
                  :disabled="!duration"
                  :aria-label="'调整播放进度，当前 ' + currentLabel"
                  :style="{ '--progress': progressPercent + '%' }"
                  @input="seek"
                >
                <span>{{ durationLabel }}</span>
              </div>

              <div class="daily-song-actions">
                <button class="daily-song-btn daily-song-btn-primary" type="button" :aria-label="playButtonLabel" @click="togglePlay">
                  <svg v-if="isPlaying" class="daily-song-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="6.5" y="5" width="3.5" height="14" rx="1"></rect>
                    <rect x="14" y="5" width="3.5" height="14" rx="1"></rect>
                  </svg>
                  <svg v-else class="daily-song-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5.5v13l10-6.5-10-6.5Z"></path>
                  </svg>
                  <span>{{ isPlaying ? '暂停' : '播放' }}</span>
                </button>
                <button class="daily-song-btn daily-song-btn-icon" type="button" aria-label="换一首今日单曲" title="换一首" @click="skipTrack">
                  <svg class="daily-song-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M16 3h5v5"></path>
                    <path d="M4 17.5h2.5c2.2 0 3.6-.9 5.2-3.1l1.8-2.5C15.1 9.7 16.5 8.8 19 8.8h2"></path>
                    <path d="M4 6.5h2.5c1.8 0 3 .6 4.2 2"></path>
                    <path d="M16 21h5v-5"></path>
                    <path d="M15.8 16.1c.9.9 1.9 1.4 3.2 1.4h2"></path>
                  </svg>
                </button>
                <button class="daily-song-btn daily-song-btn-icon" type="button" aria-label="收起播放器" title="收起" @click="collapse">
                  <svg class="daily-song-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <p class="daily-song-status" :class="{ 'is-error': errorMessage }" aria-live="polite">
            {{ statusText }}
          </p>
        </div>
      </section>
    `,
    data() {
      const prefs = readJson(PREF_KEY) || {};
      const canStartExpanded = window.matchMedia('(min-width: 1440px)').matches;
      return {
        audio: null,
        today: todayKey(),
        track: TRACKS[0],
        isPlaying: false,
        isExpanded: canStartExpanded && prefs.expanded !== false,
        currentTime: 0,
        duration: 0,
        loadState: 'idle',
        errorMessage: '',
        dayTimer: null,
        resizeObserver: null,
      };
    },
    computed: {
      displayDate() {
        return formatDate(this.today);
      },
      progressMax() {
        return this.duration || 100;
      },
      progressPercent() {
        if (!this.duration) return 0;
        return Math.min(100, Math.max(0, (this.currentTime / this.duration) * 100));
      },
      currentLabel() {
        return this.formatTime(this.currentTime);
      },
      durationLabel() {
        return this.duration ? this.formatTime(this.duration) : '--:--';
      },
      coverAlt() {
        return `《${this.track.title}》封面`;
      },
      playButtonLabel() {
        return this.isPlaying ? '暂停今日单曲' : '播放今日单曲';
      },
      statusText() {
        if (this.errorMessage) return this.errorMessage;
        if (this.loadState === 'loading') return '正在连接音频...';
        if (this.isPlaying) return '正在播放。切换页面时音乐会保持。';
        if (this.currentTime > 1) return `已暂停在 ${this.currentLabel}，随时可以继续。`;
        return '点一下播放，让今天从这首歌开始。';
      },
    },
    mounted() {
      const savedState = readJson(STORAGE_KEY);
      this.track = this.pickInitialTrack(savedState);
      this.setupAudio(savedState && savedState.src === this.track.src ? savedState.time : 0);
      this.persistDailyTrack();
      this.persistState();

      this.dayTimer = window.setInterval(this.handleDayChange, 60000);
      document.addEventListener('visibilitychange', this.persistState);
      window.addEventListener('beforeunload', this.persistState);
      window.addEventListener('resize', this.updateSafeArea);

      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(this.updateSafeArea);
        this.resizeObserver.observe(this.$el);
      }

      this.$nextTick(this.updateSafeArea);
    },
    beforeUnmount() {
      if (this.dayTimer) window.clearInterval(this.dayTimer);
      if (this.resizeObserver) this.resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', this.persistState);
      window.removeEventListener('beforeunload', this.persistState);
      window.removeEventListener('resize', this.updateSafeArea);
      this.clearSafeArea();
      if (this.audio) this.audio.pause();
    },
    methods: {
      pickInitialTrack(savedState) {
        const savedDaily = readJson(DAILY_KEY);
        const dailyTrack = savedDaily && savedDaily.date === this.today ? normalizeTrack(savedDaily.track) : null;
        if (dailyTrack) return dailyTrack;

        const restoredTrack = savedState && savedState.date === this.today ? normalizeTrack(savedState) : null;
        if (restoredTrack) return restoredTrack;

        return defaultTrackForDate(this.today);
      },
      setupAudio(startAt) {
        if (this.audio) {
          this.audio.pause();
          this.audio.src = '';
        }

        this.audio = new Audio(this.track.src);
        this.audio.preload = 'metadata';

        this.audio.addEventListener('loadedmetadata', () => {
          this.duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
          if (startAt > 0 && startAt < this.duration) {
            this.audio.currentTime = startAt;
            this.currentTime = startAt;
          }
          this.loadState = 'ready';
        });

        this.audio.addEventListener('timeupdate', () => {
          this.currentTime = this.audio.currentTime || 0;
          this.persistState();
        });

        this.audio.addEventListener('play', () => {
          this.isPlaying = true;
          this.errorMessage = '';
          this.loadState = 'ready';
          this.persistState();
        });

        this.audio.addEventListener('pause', () => {
          this.isPlaying = false;
          this.persistState();
        });

        this.audio.addEventListener('ended', () => {
          this.isPlaying = false;
          this.currentTime = 0;
          this.persistState();
        });

        this.audio.addEventListener('error', () => {
          this.isPlaying = false;
          this.errorMessage = '这首歌暂时加载失败，可以稍后再试或换一首。';
          this.persistState();
        });
      },
      async togglePlay() {
        if (!this.audio) this.setupAudio(this.currentTime);

        if (this.audio.paused) {
          this.loadState = 'loading';
          try {
            await this.audio.play();
          } catch (error) {
            this.loadState = 'idle';
            this.errorMessage = '浏览器没有开始播放，请再点一次播放按钮。';
          }
        } else {
          this.audio.pause();
        }
      },
      skipTrack() {
        const wasPlaying = this.isPlaying;
        const index = TRACKS.findIndex((item) => item.src === this.track.src);
        const next = TRACKS[(index + 1 + TRACKS.length) % TRACKS.length] || TRACKS[0];

        this.track = next;
        this.currentTime = 0;
        this.duration = 0;
        this.errorMessage = '';
        this.setupAudio(0);
        this.persistDailyTrack();
        this.persistState();

        if (wasPlaying) this.togglePlay();
      },
      seek(event) {
        if (!this.audio || !this.duration) return;
        const nextTime = Number(event.target.value);
        this.audio.currentTime = nextTime;
        this.currentTime = nextTime;
        this.persistState();
      },
      collapse() {
        this.isExpanded = false;
        this.persistPrefs();
        this.$nextTick(this.updateSafeArea);
      },
      expand() {
        this.isExpanded = true;
        this.persistPrefs();
        this.$nextTick(this.updateSafeArea);
      },
      handleDayChange() {
        const nextToday = todayKey();
        if (nextToday === this.today) return;

        this.today = nextToday;
        this.track = defaultTrackForDate(nextToday);
        this.currentTime = 0;
        this.duration = 0;
        this.errorMessage = '';
        this.setupAudio(0);
        this.persistDailyTrack();
        this.persistState();
      },
      persistDailyTrack() {
        writeJson(DAILY_KEY, { date: this.today, track: this.track });
      },
      persistPrefs() {
        writeJson(PREF_KEY, { expanded: this.isExpanded });
      },
      persistState() {
        if (!this.track) return;
        writeJson(STORAGE_KEY, {
          src: this.track.src,
          title: this.track.title,
          artist: this.track.artist,
          cover: this.track.cover,
          time: this.audio ? this.audio.currentTime || this.currentTime : this.currentTime,
          paused: this.audio ? this.audio.paused : !this.isPlaying,
          date: this.today,
          savedAt: new Date().toISOString(),
        });
      },
      updateSafeArea() {
        this.$nextTick(() => {
          if (!this.$el) return;
          const box = this.$el.getBoundingClientRect();
          const bottomGap = Math.max(0, window.innerHeight - box.bottom);
          const safeBottom = Math.ceil(box.height + bottomGap + 24);

          document.body.classList.add('has-daily-song-player');
          document.documentElement.style.setProperty('--daily-song-safe-bottom', `${safeBottom}px`);
        });
      },
      clearSafeArea() {
        document.body.classList.remove('has-daily-song-player');
        document.documentElement.style.removeProperty('--daily-song-safe-bottom');
      },
      formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const rest = Math.floor(seconds % 60);
        return `${minutes}:${String(rest).padStart(2, '0')}`;
      },
    },
  });

  window.__dailySongApp = app.mount(mount);
})();
