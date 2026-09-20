const state = {
  auth: null,
  accountProfiles: [],
  queue: [],
  queueHydrated: false,
  currentTrack: null,
  currentIndex: -1,
  playing: false,
  playbackMode: "idle",
  audioOutputDevices: [],
  audioOutputDeviceId: "default",
  audioOutputMenuOpen: false,
  audioOutputRefreshing: false,
  audioOutputError: "",
  headsetAutoPaused: false,
  shuffleEnabled: false,
  shuffleOrder: [],
  shuffleSignature: "",
  repeatMode: "off",
  lyrics: null,
  lyricsTranslation: null,
  lyricsTranslationVisible: false,
  lyricsTranslationLoading: false,
  lyricsRomanization: null,
  lyricsRomanizationVisible: false,
  lyricsRomanizationLoading: false,
  karaokeDuetMode: false,
  lyricsWaveformPeaks: new Float32Array(240),
  lyricsAutoSync: true,
  lyricsProgrammaticScroll: false,
  lyricsProgrammaticTimer: null,
  lyricsInteractionUntil: 0,
  lyricsLineElements: [],
  lyricsMainTimeline: [],
  lyricsBackgroundTimeline: [],
  lyricsLastPresentationIndex: -1,
  lyricsSearchOpen: false,
  lyricsSearchLoading: false,
  lyricsSearchRequest: 0,
  lyricsReloading: false,
  lyricsSearchCandidates: [],
  lyricsSearchErrors: [],
  lyricsSearchPendingProviders: [],
  lyricsSearchAttemptedProviders: [],
  lyricsSearchProviderStates: {},
  lyricsSearchTrackId: "",
  lyricsSearchCache: new Map(),
  lyricsIdentityCache: new Map(),
  lyricsIdentityPending: new Map(),
  lyricsSelectedCandidateIndex: -1,
  lyricsOffsetMs: 0,
  lyricsShareSelection: new Set(),
  activeLyricIndex: -1,
  focusActiveLyricIndex: -1,
  focusLyricsLineElements: [],
  focusLyricsActiveDomIndexes: new Set(),
  focusLyricsLastPresentationIndex: -1,
  focusLyricsAutoSync: true,
  focusLyricsProgrammaticScroll: false,
  focusLyricsProgrammaticTimer: null,
  activeSidePanel: "queue",
  sidePanelScroll: {
    queue: 0,
    lyrics: 0
  },
  seeking: false,
  homeLoaded: false,
  homeParams: null,
  homeBrowseId: "FEmusic_home",
  homeChips: [],
  homeResult: null,
  homeSectionOrder: [],
  homeListeningHistory: [],
  homePlaybackStats: {},
  searchQuery: "",
  searchFilter: "top",
  searchFilters: {
    officialAudio: false,
    videosOnly: false,
    longDuration: false,
    recent: false
  },
  searchResult: null,
  searchHistory: [],
  likedData: null,
  likedQuery: "",
  likedSort: "recent",
  likedFilter: "all",
  likedSelectedIds: new Set(),
  likedLayout: "list",
  likedTrackIds: new Set(),
  likedRemovalTombstones: new Map(),
  likedRemovalTombstonesHydrated: false,
  likedStateHydrated: false,
  syncState: {
    liked: { status: "local", updatedAt: "", pending: 0, error: "" },
    playlists: { status: "local", updatedAt: "", pending: 0, error: "" }
  },
  syncOutbox: [],
  syncOutboxProcessing: false,
  syncContextVersion: 0,
  libraryData: null,
  libraryFilter: "all",
  libraryQuery: "",
  librarySort: "recent",
  downloadedQuery: "",
  downloadedSort: "recent",
  downloadedFilter: "all",
  localMusicData: { folders: [], tracks: [] },
  localMusicQuery: "",
  localMusicSort: "recent",
  localMusicFolder: "",
  localMusicLayout: "list",
  recognitionSource: "system",
  recognitionCandidates: [],
  offlineCache: {
    tracks: [],
    ids: new Set(),
    stats: null,
    loaded: false
  },
  offlineCachePending: new Set(),
  offlineCacheFailures: new Map(),
  downloadQueue: [],
  downloadPaused: false,
  downloadProcessing: false,
  downloadBatch: null,
  playbackStats: {},
  healthReport: null,
  lyricsTimelineEditing: false,
  lyricsTapTimingActive: false,
  lyricsTapTimingIndex: -1,
  historyData: null,
  searchSuggestTimer: null,
  searchSuggestRequest: 0,
  queueHistory: [],
  commandOpen: false,
  commandItems: [],
  moreItem: null,
  collectionResult: null,
  collectionQuery: "",
  collectionLoadingMore: false,
  collectionRequestId: 0,
  collectionLayout: "list",
  collectionFallback: null,
  collectionActionItem: null,
  collectionReturnArtist: null,
  playlistSelectedKeys: new Set(),
  playlistsData: null,
  playlistsFilter: "all",
  playlistsQuery: "",
  playlistsSort: "recent",
  localPlaylists: [],
  artistResult: null,
  artistFallback: null,
  artistActionItem: null,
  artistVisibleSections: [],
  artistPopularQueue: null,
  artistPopularQueuePromise: null,
  podcastData: null,
  podcastFallback: null,
  playlistTarget: null,
  moreSource: null,
  moreContextItems: [],
  queueDragFrom: null,
  queueDropIndex: null,
  queueDragGhost: null,
  queueDragPointerId: null,
  queueDragOffsetY: 0,
  queueDragOriginRect: null,
  queueFollowedTrackId: "",
  lyricFillRound: null,
  lyricFillScore: { correct: 0, total: 0 },
  lyricFillTrack: null,
  lyricFillLyrics: null,
  lyricFillSearchResult: null,
  lyricFillSearchTimer: null,
  lyricFillSearchRequest: 0,
  lyricFillLyricsRequest: 0,
  lyricFillStage: "search",
  lyricFillLevel: "b1",
  lyricFillGame: null,
  lyricFillGameTimer: null,
  lyricFillGameAudioToken: 0,
  activeGame: null,
  gameSessionActive: false,
  queueSource: null,
  queueAutoloading: false,
  queueAutoloadThreshold: 5,
  playbackRecovery: false,
  playbackRequestId: 0,
  playbackRetryLimit: 1,
  playbackFailures: new Map(),
  playbackFailedIds: new Set(),
  playbackFailureReasons: new Map(),
  playbackStreams: new Map(),
  restoredPlaybackTime: 0,
  crossfadeTriggeredId: "",
  skipSilenceStartedAt: 0,
  skipSilenceBoosted: false,
  lyricsPrefetchCache: new Map(),
  lyricsPrefetchCandidates: new Map(),
  lyricsPrefetching: new Set(),
  activeView: "home",
  activeSidePanel: "queue",
  sessionSaveTimer: null,
  lastSessionSaveAt: 0,
  lastSessionSignature: "",
  miniPlayerActive: false,
  lyricsExpanded: false,
  rightPanelResizing: false,
  settings: {
    language: "en",
    density: "normal",
    lyricsSource: "auto",
    lyricsSourceOrder: ["netease", "musixmatch", "betterlyrics", "lrclib", "kugou", "paxsenix", "lyricsplus", "lyrics-ovh", "youtube-transcript"],
    lyricsSearchProviders: {
      netease: true,
      musixmatch: true,
      betterlyrics: true,
      lrclib: true,
      kugou: true,
      paxsenix: true,
      lyricsplus: true,
      "lyrics-ovh": true,
      "youtube-transcript": true
    },
    lyricsTranslateTarget: "zh-TW",
    lyricsAutoTranslate: false,
    lyricsAutoRomanize: false,
    lyricsDuetMode: false,
    lyricsScale: 100,
    lyricsFullscreenBackground: "song",
    lyricsFullscreenAlign: "auto",
    lyricsFullscreenDisplay: "scroll",
    lyricsFullscreenCover: "square",
    sidebarCollapsed: false,
    lyricsCardTemplate: "auralane",
    desktopLyricsOpacity: 65,
    desktopLyricsFont: "system",
    rightPanelWidth: 360,
    webFallback: false,
    offlineMode: false,
    notifications: false,
    audioOutputDeviceId: "default",
  queueLock: false,
  queueFollowPlaying: true,
  collectionFollowPlaying: false,
  smartQueue: false,
  quality: "auto",
  miniSkin: "compact",
  crossfadeSeconds: 0,
  artistShuffleLimit: 100,
  libraryAutoRefresh: true,
    libraryDefaultSort: "recent",
    smartCache: false,
    cacheSize: 512,
    debugLogs: false,
    skipSilence: false
  }
};

const els = {
  loginButton: document.getElementById("loginButton"),
  loginAvatar: document.getElementById("loginAvatar"),
  loginLabel: document.getElementById("loginLabel"),
  globalStatus: document.getElementById("globalStatus"),
  accountLogin: document.getElementById("accountLogin"),
  logoutButton: document.getElementById("logoutButton"),
  clearButton: document.getElementById("clearButton"),
  accountName: document.getElementById("accountName"),
  accountEmail: document.getElementById("accountEmail"),
  accountAvatar: document.getElementById("accountAvatar"),
  accountSaveProfileButton: document.getElementById("accountSaveProfileButton"),
  accountProfilesList: document.getElementById("accountProfilesList"),
  accountSwitcher: document.getElementById("accountSwitcher"),
  accountSwitcherCount: document.getElementById("accountSwitcherCount"),
  accountSwitcherList: document.getElementById("accountSwitcherList"),
  accountAddButton: document.getElementById("accountAddButton"),
  accountManageButton: document.getElementById("accountManageButton"),
  searchForm: document.getElementById("searchForm"),
  searchInput: document.getElementById("searchInput"),
  musicRecognizeButton: document.getElementById("musicRecognizeButton"),
  musicRecognitionDialog: document.getElementById("musicRecognitionDialog"),
  recognitionCloseButton: document.getElementById("recognitionCloseButton"),
  recognitionStartButton: document.getElementById("recognitionStartButton"),
  recognitionStatus: document.getElementById("recognitionStatus"),
  recognitionCandidates: document.getElementById("recognitionCandidates"),
  recognitionHistoryButton: document.getElementById("recognitionHistoryButton"),
  recognitionHistoryPanel: document.getElementById("recognitionHistoryPanel"),
  searchStatus: document.getElementById("searchStatus"),
  searchTabs: document.getElementById("searchTabs"),
  searchResults: document.getElementById("searchResults"),
  searchLoadMoreButton: document.getElementById("searchLoadMoreButton"),
  searchSuggestions: document.getElementById("searchSuggestions"),
  searchFilterBar: document.getElementById("searchFilterBar"),
  searchFilterOfficial: document.getElementById("searchFilterOfficial"),
  searchFilterVideos: document.getElementById("searchFilterVideos"),
  searchFilterLong: document.getElementById("searchFilterLong"),
  searchFilterRecent: document.getElementById("searchFilterRecent"),
  homeGreeting: document.getElementById("homeGreeting"),
  homeSubtitle: document.getElementById("homeSubtitle"),
  homeChips: document.getElementById("homeChips"),
  homeStatus: document.getElementById("homeStatus"),
  homeQuickPicks: document.getElementById("homeQuickPicks"),
  homeShelves: document.getElementById("homeShelves"),
  homeFallbackActions: document.getElementById("homeFallbackActions"),
  gameExitButton: document.getElementById("gameExitButton"),
  exploreResults: document.getElementById("exploreResults"),
  chartsResults: document.getElementById("chartsResults"),
  newResults: document.getElementById("newResults"),
  moodsResults: document.getElementById("moodsResults"),
  gamesStatus: document.getElementById("gamesStatus"),
  gamesHub: document.getElementById("gamesHub"),
  gamesPlayArea: document.getElementById("gamesPlayArea"),
  gamesBackButton: document.getElementById("gamesBackButton"),
  gamesRefreshButton: document.getElementById("gamesRefreshButton"),
  lyricsFillGame: document.getElementById("lyricsFillGame"),
  lyricsGameSearchStage: document.getElementById("sharedGameSearchStage"),
  lyricsGameLevelStage: document.getElementById("sharedGameLevelStage"),
  lyricsGamePlayStage: document.getElementById("lyricsGamePlayStage"),
  lyricsGameSearchForm: document.getElementById("lyricsGameSearchForm"),
  lyricsGameSearchInput: document.getElementById("lyricsGameSearchInput"),
  lyricsGameSearchResults: document.getElementById("lyricsGameSearchResults"),
  lyricsGameSongInfo: document.getElementById("lyricsGameSongInfo"),
  lyricsGameBackToSearchButton: document.getElementById("lyricsGameBackToSearchButton"),
  lyricsGameLevelHero: document.getElementById("lyricsGameLevelHero"),
  lyricsGameLevelTitle: document.getElementById("lyricsGameLevelTitle"),
  lyricsGameLevelArtist: document.getElementById("lyricsGameLevelArtist"),
  lyricsGameLevelMeta: document.getElementById("lyricsGameLevelMeta"),
  lyricsGameLevelRows: document.getElementById("lyricsGameLevelRows"),
  sharedGameStartButton: document.getElementById("sharedGameStartButton"),
  gameLyricsSourceSelect: document.getElementById("gameLyricsSourceSelect"),
  lyricsGameScoreDigits: document.getElementById("lyricsGameScoreDigits"),
  lyricsGameGapsCount: document.getElementById("lyricsGameGapsCount"),
  lyricsGameHitsCount: document.getElementById("lyricsGameHitsCount"),
  lyricsGameFailsCount: document.getElementById("lyricsGameFailsCount"),
  lyricsGameSkipsCount: document.getElementById("lyricsGameSkipsCount"),
  lyricsGameLife: document.getElementById("lyricsGameLife"),
  lyricsGamePauseButton: document.getElementById("lyricsGamePauseButton"),
  lyricsGameMedia: document.getElementById("lyricsGameMedia"),
  lyricsGameVisual: document.getElementById("lyricsGameVisual"),
  lyricsGameVisualArt: document.getElementById("lyricsGameVisualArt"),
  lyricsGameVisualTitle: document.getElementById("lyricsGameVisualTitle"),
  lyricsGameVisualStatus: document.getElementById("lyricsGameVisualStatus"),
  lyricsGameAudio: document.getElementById("lyricsGameAudio"),
  lyricsGameLyricsList: document.getElementById("lyricsGameLyricsList"),
  lyricsGameOptions: document.getElementById("lyricsGameOptions"),
  lyricsGamePrevButton: document.getElementById("lyricsGamePrevButton"),
  lyricsGameNextButton: document.getElementById("lyricsGameNextButton"),
  lyricsGamePauseMenu: document.getElementById("lyricsGamePauseMenu"),
  lyricsGameResumeButton: document.getElementById("lyricsGameResumeButton"),
  lyricsGameRestartButton: document.getElementById("lyricsGameRestartButton"),
  lyricsGameGiveUpButton: document.getElementById("lyricsGameGiveUpButton"),
  lyricsGameQuitButton: document.getElementById("lyricsGameQuitButton"),
  lyricsFillPrompt: document.getElementById("lyricsFillPrompt"),
  lyricsFillInput: document.getElementById("lyricsFillInput"),
  lyricsFillNewButton: document.getElementById("lyricsFillNewButton"),
  lyricsFillCheckButton: document.getElementById("lyricsFillCheckButton"),
  lyricsFillStatus: document.getElementById("lyricsFillStatus"),
  lyricsFillScore: document.getElementById("lyricsFillScore"),
  browseTitle: document.getElementById("browseTitle"),
  browseStatus: document.getElementById("browseStatus"),
  browseResults: document.getElementById("browseResults"),
  collectionHero: document.getElementById("collectionHero"),
  collectionBackButton: document.getElementById("collectionBackButton"),
  collectionArt: document.getElementById("collectionArt"),
  collectionEyebrow: document.getElementById("collectionEyebrow"),
  collectionTitle: document.getElementById("collectionTitle"),
  collectionSubtitle: document.getElementById("collectionSubtitle"),
  collectionMeta: document.getElementById("collectionMeta"),
  collectionDescription: document.getElementById("collectionDescription"),
  collectionPlayButton: document.getElementById("collectionPlayButton"),
  collectionShuffleButton: document.getElementById("collectionShuffleButton"),
  collectionDownloadButton: document.getElementById("collectionDownloadButton"),
  collectionAddSongsButton: document.getElementById("collectionAddSongsButton"),
  collectionRenameButton: document.getElementById("collectionRenameButton"),
  collectionDeleteButton: document.getElementById("collectionDeleteButton"),
  collectionLayoutButton: document.getElementById("collectionLayoutButton"),
  collectionSearchBar: document.getElementById("collectionSearchBar"),
  collectionSearchInput: document.getElementById("collectionSearchInput"),
  collectionStatus: document.getElementById("collectionStatus"),
  collectionResults: document.getElementById("collectionResults"),
  collectionLoadMoreButton: document.getElementById("collectionLoadMoreButton"),
  artistHero: document.getElementById("artistHero"),
  artistArt: document.getElementById("artistArt"),
  artistTitle: document.getElementById("artistTitle"),
  artistSubtitle: document.getElementById("artistSubtitle"),
  artistMeta: document.getElementById("artistMeta"),
  artistDescription: document.getElementById("artistDescription"),
  artistPlayButton: document.getElementById("artistPlayButton"),
  artistShuffleButton: document.getElementById("artistShuffleButton"),
  artistRadioButton: document.getElementById("artistRadioButton"),
  artistFollowButton: document.getElementById("artistFollowButton"),
  artistStatus: document.getElementById("artistStatus"),
  artistResults: document.getElementById("artistResults"),
  podcastHero: document.getElementById("podcastHero"),
  podcastArt: document.getElementById("podcastArt"),
  podcastTitle: document.getElementById("podcastTitle"),
  podcastSubtitle: document.getElementById("podcastSubtitle"),
  podcastMeta: document.getElementById("podcastMeta"),
  podcastPlayButton: document.getElementById("podcastPlayButton"),
  podcastShuffleButton: document.getElementById("podcastShuffleButton"),
  podcastStatus: document.getElementById("podcastStatus"),
  podcastResults: document.getElementById("podcastResults"),
  podcastLoadMoreButton: document.getElementById("podcastLoadMoreButton"),
  likedStatus: document.getElementById("likedStatus"),
  likedFilters: document.getElementById("likedFilters"),
  likedSearchInput: document.getElementById("likedSearchInput"),
  likedPlayButton: document.getElementById("likedPlayButton"),
  likedShuffleButton: document.getElementById("likedShuffleButton"),
  likedDownloadButton: document.getElementById("likedDownloadButton"),
  likedFollowPlayingButton: document.getElementById("likedFollowPlayingButton"),
  likedRefreshButton: document.getElementById("likedRefreshButton"),
  likedLayoutButton: document.getElementById("likedLayoutButton"),
  likedResults: document.getElementById("likedResults"),
  downloadedStatus: document.getElementById("downloadedStatus"),
  downloadedFilters: document.getElementById("downloadedFilters"),
  downloadedSearchInput: document.getElementById("downloadedSearchInput"),
  downloadedSortSelect: document.getElementById("downloadedSortSelect"),
  downloadedPlayButton: document.getElementById("downloadedPlayButton"),
  downloadedFolderButton: document.getElementById("downloadedFolderButton"),
  downloadedShuffleButton: document.getElementById("downloadedShuffleButton"),
  downloadedClearButton: document.getElementById("downloadedClearButton"),
  downloadedResults: document.getElementById("downloadedResults"),
  localMusicStatus: document.getElementById("localMusicStatus"),
  localMusicSearchInput: document.getElementById("localMusicSearchInput"),
  localMusicFolderSelect: document.getElementById("localMusicFolderSelect"),
  localMusicSortSelect: document.getElementById("localMusicSortSelect"),
  localMusicPlayButton: document.getElementById("localMusicPlayButton"),
  localMusicLocateButton: document.getElementById("localMusicLocateButton"),
  localMusicLayoutButton: document.getElementById("localMusicLayoutButton"),
  localMusicFolderButton: document.getElementById("localMusicFolderButton"),
  localMusicRescanButton: document.getElementById("localMusicRescanButton"),
  localMusicClearButton: document.getElementById("localMusicClearButton"),
  localMusicResults: document.getElementById("localMusicResults"),
  libraryStatus: document.getElementById("libraryStatus"),
  libraryFilters: document.getElementById("libraryFilters"),
  librarySearchInput: document.getElementById("librarySearchInput"),
  librarySortSelect: document.getElementById("librarySortSelect"),
  libraryRecent: document.getElementById("libraryRecent"),
  librarySections: document.getElementById("librarySections"),
  libraryResults: document.getElementById("libraryResults"),
  historyStatus: document.getElementById("historyStatus"),
  historyPlayButton: document.getElementById("historyPlayButton"),
  historyShuffleButton: document.getElementById("historyShuffleButton"),
  historyCreatePlaylistButton: document.getElementById("historyCreatePlaylistButton"),
  historyResults: document.getElementById("historyResults"),
  playlistResults: document.getElementById("playlistResults"),
  localPlaylistsSection: document.getElementById("localPlaylistsSection"),
  syncedPlaylistsSection: document.getElementById("syncedPlaylistsSection"),
  playlistsStatus: document.getElementById("playlistsStatus"),
  playlistsFilters: document.getElementById("playlistsFilters"),
  playlistsSearchInput: document.getElementById("playlistsSearchInput"),
  playlistsSortSelect: document.getElementById("playlistsSortSelect"),
  playlistCreateFab: document.getElementById("playlistCreateFab"),
  playlistCreateDialog: document.getElementById("playlistCreateDialog"),
  playlistCreateDialogClose: document.getElementById("playlistCreateDialogClose"),
  playlistCreateDestination: document.getElementById("playlistCreateDestination"),
  localPlaylistResults: document.getElementById("localPlaylistResults"),
  localPlaylistCreateForm: document.getElementById("localPlaylistCreateForm"),
  localPlaylistName: document.getElementById("localPlaylistName"),
  localPlaylistFromQueue: document.getElementById("localPlaylistFromQueue"),
  localPlaylistsImport: document.getElementById("localPlaylistsImport"),
  localPlaylistsExport: document.getElementById("localPlaylistsExport"),
  localPlaylistsFile: document.getElementById("localPlaylistsFile"),
  queueStatus: document.getElementById("queueStatus"),
  lyricsExpandButton: document.getElementById("lyricsExpandButton"),
  queueList: document.getElementById("queueList"),
  queueFollowButton: document.getElementById("queueFollowButton"),
  queueLockButton: document.getElementById("queueLockButton"),
  queueClearButton: document.getElementById("queueClearButton"),
  rightPanel: document.getElementById("rightPanel"),
  rightResizeHandle: document.getElementById("rightResizeHandle"),
  queuePane: document.getElementById("queuePane"),
  lyricsPane: document.getElementById("lyricsPane"),
  lyricsTitle: document.getElementById("lyricsTitle"),
  lyricsStatus: document.getElementById("lyricsStatus"),
  lyricsVersionButton: document.getElementById("lyricsVersionButton"),
  lyricsVersionMenu: document.getElementById("lyricsVersionMenu"),
  lyricsQuickSettings: document.getElementById("lyricsQuickSettings"),
  lyricsQuickBackground: document.getElementById("lyricsQuickBackground"),
  lyricsQuickAlign: document.getElementById("lyricsQuickAlign"),
  lyricsQuickDisplay: document.getElementById("lyricsQuickDisplay"),
  lyricsQuickCover: document.getElementById("lyricsQuickCover"),
  lyricsQuickScale: document.getElementById("lyricsQuickScale"),
  lyricsQuickReloadButton: document.getElementById("lyricsQuickReloadButton"),
  lyricsList: document.getElementById("lyricsList"),
  lyricsFullscreenCoverArt: document.getElementById("lyricsFullscreenCoverArt"),
  nowArt: document.getElementById("nowArt"),
  nowTitle: document.getElementById("nowTitle"),
  nowQualityButton: document.getElementById("nowQualityButton"),
  qualityMenu: document.getElementById("qualityMenu"),
  nowSubtitle: document.getElementById("nowSubtitle"),
  audio: document.getElementById("audio"),
  shuffleButton: document.getElementById("shuffleButton"),
  playButton: document.getElementById("playButton"),
  prevButton: document.getElementById("prevButton"),
  nextButton: document.getElementById("nextButton"),
  repeatButton: document.getElementById("repeatButton"),
  currentTime: document.getElementById("currentTime"),
  durationTime: document.getElementById("durationTime"),
  seekBar: document.getElementById("seekBar"),
  volumeBar: document.getElementById("volumeBar"),
  likeButton: document.getElementById("likeButton"),
  shareButton: document.getElementById("shareButton"),
  currentDownloadButton: document.getElementById("currentDownloadButton"),
  queueButton: document.getElementById("queueButton"),
  lyricsButton: document.getElementById("lyricsButton"),
  lyricsSyncButton: document.getElementById("lyricsSyncButton"),
  lyricsSearchButton: document.getElementById("lyricsSearchButton"),
  lyricsSearchPanel: document.getElementById("lyricsSearchPanel"),
  lyricsSearchForm: document.getElementById("lyricsSearchForm"),
  lyricsSearchTitle: document.getElementById("lyricsSearchTitle"),
  lyricsSearchArtist: document.getElementById("lyricsSearchArtist"),
  lyricsSearchSubmit: document.getElementById("lyricsSearchSubmit"),
  lyricsSearchProviderBetter: document.getElementById("lyricsSearchProviderBetter"),
  lyricsSearchProviderNetease: document.getElementById("lyricsSearchProviderNetease"),
  lyricsSearchProviderLrclib: document.getElementById("lyricsSearchProviderLrclib"),
  lyricsSearchProviderKugou: document.getElementById("lyricsSearchProviderKugou"),
  lyricsSearchProviderPaxsenix: document.getElementById("lyricsSearchProviderPaxsenix"),
  lyricsSearchProviderLyricsPlus: document.getElementById("lyricsSearchProviderLyricsPlus"),
  lyricsSearchProviderOvh: document.getElementById("lyricsSearchProviderOvh"),
  lyricsSearchProviderTranscript: document.getElementById("lyricsSearchProviderTranscript"),
  lyricsCandidateList: document.getElementById("lyricsCandidateList"),
  lyricsCandidateMeta: document.getElementById("lyricsCandidateMeta"),
  lyricsEditText: document.getElementById("lyricsEditText"),
  lyricsPreviewCandidateButton: document.getElementById("lyricsPreviewCandidateButton"),
  lyricsUseCandidateButton: document.getElementById("lyricsUseCandidateButton"),
  lyricsCloseSearchButton: document.getElementById("lyricsCloseSearchButton"),
  lyricsTranslateButton: document.getElementById("lyricsTranslateButton"),
  lyricsRomanizeButton: document.getElementById("lyricsRomanizeButton"),
  lyricsDuetButton: document.getElementById("lyricsDuetButton"),
  lyricsCopyButton: document.getElementById("lyricsCopyButton"),
  lyricsShareCardButton: document.getElementById("lyricsShareCardButton"),
  lyricsReloadButton: document.getElementById("lyricsReloadButton"),
  lyricsOffsetMinus: document.getElementById("lyricsOffsetMinus"),
  lyricsOffsetPlus: document.getElementById("lyricsOffsetPlus"),
  lyricsOffsetReset: document.getElementById("lyricsOffsetReset"),
  lyricsOffsetValue: document.getElementById("lyricsOffsetValue"),
  lyricsTimelinePanel: document.getElementById("lyricsTimelinePanel"),
  lyricsTimelineCloseButton: document.getElementById("lyricsTimelineCloseButton"),
  lyricsTimelineButton: document.getElementById("lyricsTimelineButton"),
  lyricsTimelineEditor: document.getElementById("lyricsTimelineEditor"),
  lyricsTimelineWaveform: document.getElementById("lyricsTimelineWaveform"),
  lyricsTimelineWaveformStatus: document.getElementById("lyricsTimelineWaveformStatus"),
  lyricsTapTimingButton: document.getElementById("lyricsTapTimingButton"),
  lyricsTapTimingStatus: document.getElementById("lyricsTapTimingStatus"),
  lyricsVersionList: document.getElementById("lyricsVersionList"),
  sleepButton: document.getElementById("sleepButton"),
  lyricWidgetButton: document.getElementById("lyricWidgetButton"),
  miniPlayerButton: document.getElementById("miniPlayerButton"),
  focusMode: document.getElementById("focusMode"),
  focusBackdropArt: document.getElementById("focusBackdropArt"),
  focusCloseButton: document.getElementById("focusCloseButton"),
  focusArt: document.getElementById("focusArt"),
  focusTitle: document.getElementById("focusTitle"),
  focusArtist: document.getElementById("focusArtist"),
  focusSyncButton: document.getElementById("focusSyncButton"),
  focusLyricsList: document.getElementById("focusLyricsList"),
  playbackMode: document.getElementById("playbackMode"),
  audioOutputButton: document.getElementById("audioOutputButton"),
  audioOutputLabel: document.getElementById("audioOutputLabel"),
  audioOutputMenu: document.getElementById("audioOutputMenu"),
  audioOutputList: document.getElementById("audioOutputList"),
  audioOutputStatus: document.getElementById("audioOutputStatus"),
  embedShell: document.getElementById("embedShell"),
  embedPlayer: document.getElementById("embedPlayer"),
  moreMenu: document.getElementById("moreMenu"),
  playlistModal: document.getElementById("playlistModal"),
  playlistModalClose: document.getElementById("playlistModalClose"),
  playlistModalStatus: document.getElementById("playlistModalStatus"),
  playlistModalList: document.getElementById("playlistModalList"),
  playlistCreateForm: document.getElementById("playlistCreateForm"),
  playlistCreateInput: document.getElementById("playlistCreateInput"),
  playlistAddModal: document.getElementById("playlistAddModal"),
  playlistAddModalClose: document.getElementById("playlistAddModalClose"),
  playlistAddModalStatus: document.getElementById("playlistAddModalStatus"),
  playlistAddSearchForm: document.getElementById("playlistAddSearchForm"),
  playlistAddSearchInput: document.getElementById("playlistAddSearchInput"),
  playlistAddResults: document.getElementById("playlistAddResults"),
  settingsCategoryNav: document.getElementById("settingsCategoryNav"),
  settingsLanguage: document.getElementById("settingsLanguage"),
  settingsRightWidth: document.getElementById("settingsRightWidth"),
  settingsRightWidthValue: document.getElementById("settingsRightWidthValue"),
  settingsDensity: document.getElementById("settingsDensity"),
  settingsThemeMode: document.getElementById("settingsThemeMode"),
  settingsLyricsSource: document.getElementById("settingsLyricsSource"),
  settingsLyricsPriority: document.getElementById("settingsLyricsPriority"),
  settingsLyricsProviderBetter: document.getElementById("settingsLyricsProviderBetter"),
  settingsLyricsProviderNetease: document.getElementById("settingsLyricsProviderNetease"),
  settingsLyricsProviderLrclib: document.getElementById("settingsLyricsProviderLrclib"),
  settingsLyricsProviderKugou: document.getElementById("settingsLyricsProviderKugou"),
  settingsLyricsProviderPaxsenix: document.getElementById("settingsLyricsProviderPaxsenix"),
  settingsLyricsProviderLyricsPlus: document.getElementById("settingsLyricsProviderLyricsPlus"),
  settingsLyricsProviderOvh: document.getElementById("settingsLyricsProviderOvh"),
  settingsLyricsProviderTranscript: document.getElementById("settingsLyricsProviderTranscript"),
  settingsLyricsTranslateTarget: document.getElementById("settingsLyricsTranslateTarget"),
  settingsLyricsScale: document.getElementById("settingsLyricsScale"),
  settingsLyricsScaleValue: document.getElementById("settingsLyricsScaleValue"),
  settingsLyricsCardTemplate: document.getElementById("settingsLyricsCardTemplate"),
  settingsDesktopLyricsOpacity: document.getElementById("settingsDesktopLyricsOpacity"),
  settingsDesktopLyricsOpacityValue: document.getElementById("settingsDesktopLyricsOpacityValue"),
  settingsDesktopLyricsFont: document.getElementById("settingsDesktopLyricsFont"),
  settingsWebFallback: document.getElementById("settingsWebFallback"),
  settingsOfflineMode: document.getElementById("settingsOfflineMode"),
  settingsNotifications: document.getElementById("settingsNotifications"),
  settingsQueueLock: document.getElementById("settingsQueueLock"),
  settingsQuality: document.getElementById("settingsQuality"),
  settingsCrossfade: document.getElementById("settingsCrossfade"),
  settingsCrossfadeValue: document.getElementById("settingsCrossfadeValue"),
  settingsArtistShuffleLimit: document.getElementById("settingsArtistShuffleLimit"),
  settingsArtistShuffleLimitValue: document.getElementById("settingsArtistShuffleLimitValue"),
  settingsLibraryAutoRefresh: document.getElementById("settingsLibraryAutoRefresh"),
  settingsLibraryDefaultSort: document.getElementById("settingsLibraryDefaultSort"),
  settingsSmartCache: document.getElementById("settingsSmartCache"),
  settingsCacheSize: document.getElementById("settingsCacheSize"),
  settingsCacheSizeValue: document.getElementById("settingsCacheSizeValue"),
  settingsCacheStatus: document.getElementById("settingsCacheStatus"),
  settingsClearCache: document.getElementById("settingsClearCache"),
  settingsDebugLogs: document.getElementById("settingsDebugLogs"),
  settingsExportState: document.getElementById("settingsExportState"),
  settingsBackupExport: document.getElementById("settingsBackupExport"),
  settingsBackupImport: document.getElementById("settingsBackupImport"),
  settingsBackupFile: document.getElementById("settingsBackupFile"),
  settingsResetLayout: document.getElementById("settingsResetLayout"),
  sidebar: document.querySelector(".sidebar"),
  settingsNav: document.querySelector('.nav[data-view="settings"]'),
  sidebarCollapseButton: document.getElementById("sidebarCollapseButton"),
  sidebarReleaseNotice: document.getElementById("sidebarReleaseNotice"),
  sidebarReleaseOpen: document.getElementById("sidebarReleaseOpen"),
  sidebarReleaseDismiss: document.getElementById("sidebarReleaseDismiss"),
  sidebarReleaseVersion: document.getElementById("sidebarReleaseVersion"),
  githubUpdatesCard: document.getElementById("githubUpdatesCard"),
  shortcutPlayPause: document.getElementById("shortcutPlayPause"),
  shortcutNext: document.getElementById("shortcutNext"),
  shortcutPrevious: document.getElementById("shortcutPrevious"),
  shortcutShowMain: document.getElementById("shortcutShowMain"),
  shortcutSaveButton: document.getElementById("shortcutSaveButton"),
  shortcutStatus: document.getElementById("shortcutStatus"),
  updateRepository: document.getElementById("updateRepository"),
  updateCheckButton: document.getElementById("updateCheckButton"),
  updateDownloadButton: document.getElementById("updateDownloadButton"),
  updateInstallButton: document.getElementById("updateInstallButton"),
  updateProgress: document.getElementById("updateProgress"),
  updateStatus: document.getElementById("updateStatus"),
  syncOutboxStatus: document.getElementById("syncOutboxStatus"),
  syncOutboxList: document.getElementById("syncOutboxList"),
  syncOutboxRetryAll: document.getElementById("syncOutboxRetryAll"),
  syncOutboxClearDone: document.getElementById("syncOutboxClearDone"),
  downloadManagerStatus: document.getElementById("downloadManagerStatus"),
  downloadManagerList: document.getElementById("downloadManagerList"),
  downloadManagerPause: document.getElementById("downloadManagerPause"),
  downloadManagerResume: document.getElementById("downloadManagerResume"),
  downloadManagerRetryFailed: document.getElementById("downloadManagerRetryFailed"),
  downloadManagerClearFailed: document.getElementById("downloadManagerClearFailed"),
  smartPlaylistRule: document.getElementById("smartPlaylistRule"),
  smartPlaylistCreate: document.getElementById("smartPlaylistCreate"),
  smartPlaylistStatus: document.getElementById("smartPlaylistStatus"),
  healthCheckRun: document.getElementById("healthCheckRun"),
  healthCheckStatus: document.getElementById("healthCheckStatus"),
  healthCheckResults: document.getElementById("healthCheckResults"),
  playbackStatsStatus: document.getElementById("playbackStatsStatus"),
  playbackStatsResults: document.getElementById("playbackStatsResults"),
  playbackStatsReset: document.getElementById("playbackStatsReset"),
  commandPalette: document.getElementById("commandPalette"),
  commandInput: document.getElementById("commandInput"),
  commandList: document.getElementById("commandList"),
  settingsDSPNormalize: document.getElementById("settingsDSPNormalize"),
  settingsSkipSilence: document.getElementById("settingsSkipSilence"),
  settingsDSPPreservePitch: document.getElementById("settingsDSPPreservePitch"),
  settingsDSPSpeed: document.getElementById("settingsDSPSpeed"),
  settingsDSPSpeedValue: document.getElementById("settingsDSPSpeedValue"),
  settingsDSPEQ: document.getElementById("settingsDSPEQ"),
  settingsDSPResetEQ: document.getElementById("settingsDSPResetEQ")
};

const SEARCH_TABS = [
  { id: "top", label: "Top" },
  { id: "songs", label: "Songs" },
  { id: "videos", label: "Videos" },
  { id: "albums", label: "Albums" },
  { id: "artists", label: "Artists" },
  { id: "playlists", label: "Playlists" },
  { id: "podcasts", label: "Podcasts" }
];

const REPEAT_MODES = ["off", "all", "one"];
const STANDARD_ICON_PATHS = {
  search: `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.4-3.4"/>`,
  microphone: `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>`,
  audio: `<path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>`,
  video: `<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3Z"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  expand: `<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>`,
  collapse: `<path d="M8 8H3M8 8V3M16 8h5M16 8V3M8 16H3M8 16v5M16 16h5M16 16v5"/>`,
  "float-lyrics": `<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 10h10M7 14h7"/>`,
  "focus-mode": `<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>`,
  like: `<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>`,
  lock: `<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>`,
  trash: `<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>`,
  lyrics: `<path d="M5 6h14M5 10h14M5 14h9M5 18h7"/>`,
  "mini-player": `<rect x="3" y="5" width="18" height="14" rx="2"/><rect x="12" y="11" width="6" height="5" rx="1"/>`,
  queue: `<path d="M4 6h12M4 11h12M4 16h8"/><path d="m17 15 4 2.5-4 2.5Z"/>`,
  recent: `<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>`,
  sleep: `<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>`,
  "audio-output": `<path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>`,
  play: `<path d="m9 6 9 6-9 6Z"/>`,
  pause: `<path d="M9 6v12M15 6v12"/>`,
  previous: `<path d="M6 6v12M18 6l-8 6 8 6Z"/>`,
  next: `<path d="M18 6v12M6 6l8 6-8 6Z"/>`,
  repeat: `<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>`,
  "repeat-one": `<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/><path d="M12 10v5M10.5 11.5 12 10"/>`,
  "arrow-left": `<path d="m15 18-6-6 6-6"/><path d="M9 12h11"/>`,
  "arrow-right": `<path d="m9 18 6-6-6-6"/><path d="M4 12h11"/>`,
  "arrow-up": `<path d="m6 15 6-6 6 6"/>`,
  "arrow-down": `<path d="m6 9 6 6 6-6"/>`,
  home: `<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>`,
  compass: `<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9Z"/>`,
  chart: `<path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/>`,
  sparkles: `<path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3ZM5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9ZM19 13l.8 1.8 1.8.8-1.8.8L19 18l-.8-1.6-1.8-.8 1.8-.8Z"/>`,
  mood: `<circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01M8 15c1.1 1 2.4 1.5 4 1.5s2.9-.5 4-1.5"/>`,
  game: `<path d="M7 8h10a4 4 0 0 1 3.8 5.2l-1.3 4a2 2 0 0 1-3.2.9L14 16h-4l-2.3 2.1a2 2 0 0 1-3.2-.9l-1.3-4A4 4 0 0 1 7 8Z"/><path d="M7 12v4M5 14h4M16 13h.01M18 15h.01"/>`,
  library: `<path d="M4 4h4v16H4ZM10 4h4v16h-4ZM16 5l3.5-1 4 15-3.5 1Z"/>`,
  download: `<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>`,
  folder: `<path d="M3 6h7l2 2h9v11H3Z"/>`,
  grid: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>`,
  list: `<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>`,
  locate: `<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>`,
  playlist: `<path d="M4 6h11M4 11h11M4 16h7"/><path d="M18 10v8M15 13h6"/>`,
  shuffle: `<path d="M16 3h5v5M4 17h2.5c5 0 6-10 11-10H21M16 21h5v-5M4 7h2.5c1.8 0 3.1 1.3 4.2 3M13.3 16c1.1 1.2 2.4 1 4.2 1H21"/>`,
  bookmark: `<path d="M6 4h12v17l-6-4-6 4Z"/>`,
  edit: `<path d="M4 20h4L19 9l-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/>`,
  check: `<path d="m5 12 4 4L19 6"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>`,
  refresh: `<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 8A7 7 0 0 1 18 6l2 6M18 16a7 7 0 0 1-12 2l-2-6"/>`,
  // Google Material Symbols Outlined — refresh, Apache-2.0.
  "material-refresh": `<path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>`,
  "user-plus": `<circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M19 8v6M16 11h6"/>`,
  "user-check": `<circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 12l2 2 4-5"/>`,
  "user-minus": `<circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 11h6"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>`,
  album: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v3M21 12h-3"/>`,
  share: `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>`,
  radio: `<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13"/>`,
  "panel-left-close": `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 9l-3 3 3 3"/>`,
  "panel-left-open": `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M12 9l3 3-3 3"/>`,
  close: `<path d="M6 6l12 12M18 6 6 18"/>`
};

function standardIconSvg(name, className = "standard-icon") {
  const viewBox = name === "material-refresh" ? "0 -960 960 960" : "0 0 24 24";
  const classes = `${className}${name === "material-refresh" ? " material-filled-icon" : ""}`;
  return `<svg class="${classes}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${STANDARD_ICON_PATHS[name] || STANDARD_ICON_PATHS.audio}</svg>`;
}

function upgradeInterfaceIcons() {
  const navIconByView = {
    home: "home", search: "search", explore: "compass", charts: "chart", new: "sparkles", moods: "mood", games: "game",
    library: "library", liked: "like", downloaded: "download", localMusic: "audio", playlists: "playlist", settings: "settings"
  };
  for (const button of document.querySelectorAll(".nav[data-view]")) {
    const name = navIconByView[button.dataset.view] || "audio";
    if (button.querySelector(".nav-icon") && button.querySelector(".nav-text")) continue;
    const label = button.textContent.trim() || button.dataset.view;
    button.innerHTML = `${standardIconSvg(name, "standard-icon nav-icon")}<span class="nav-text">${escapeText(label)}</span>`;
  }
  const iconClassMap = {
    "icon-search": "search",
    "icon-microphone": "microphone",
    "icon-play": "play",
    "icon-audio": "audio",
    "icon-video": "video",
    "icon-clock": "clock",
    "icon-expand": "expand",
    "icon-float-lyrics": "float-lyrics",
    "icon-focus-mode": "focus-mode",
    "icon-like": "like",
    "icon-lock": "lock",
    "icon-trash": "trash",
    "icon-lyrics": "lyrics",
    "icon-mini-player": "mini-player",
    "icon-queue": "queue",
    "icon-recent": "recent",
    "icon-sleep": "sleep",
    "icon-audio-output": "audio-output",
    "icon-local-play": "play",
    "icon-local-locate": "locate",
    "icon-local-layout": "grid",
    "icon-local-folder": "folder",
    "icon-local-clear": "trash",
    "icon-recognition-start": "microphone",
    "icon-queue-follow": "locate"
  };
  for (const element of document.querySelectorAll(".ui-icon")) {
    if (element.classList.contains("svg-icon-ready")) continue;
    const iconClass = Object.keys(iconClassMap).find((name) => element.classList.contains(name));
    if (!iconClass) continue;
    element.innerHTML = standardIconSvg(iconClassMap[iconClass], "standard-icon");
    element.classList.add("svg-icon-ready");
  }
  const staticButtons = [
    [document.getElementById("gameExitButton"), "arrow-left"],
    [document.getElementById("lyricsGameBackToSearchButton"), "arrow-left"],
    [document.getElementById("lyricsGamePauseButton"), "close"],
    [els.prevButton, "previous"],
    [els.playButton, "play"],
    [els.nextButton, "next"],
    [els.repeatButton, "repeat"],
    [document.getElementById("lyricsCloseSearchButton"), "close"],
    [document.getElementById("lyricsTimelineCloseButton"), "close"],
    [document.getElementById("playlistCreateDialogClose"), "close"],
    [document.getElementById("playlistModalClose"), "close"],
    [document.getElementById("playlistAddModalClose"), "close"],
    [els.recognitionCloseButton, "close"],
    [els.focusCloseButton, "close"],
    [els.lyricsQuickReloadButton, "material-refresh"],
    [els.likedFollowPlayingButton, "locate"],
    [els.likedRefreshButton, "material-refresh"]
  ];
  for (const [button, icon] of staticButtons) {
    if (!button || button.dataset.standardIcon === icon) continue;
    button.innerHTML = standardIconSvg(icon);
    button.dataset.standardIcon = icon;
  }
  const moreActionIcons = {
    play: "play", "play-next": "next", queue: "queue", radio: "radio", share: "share",
    "cache-offline": "download", "remove-offline": "trash", like: "like", unlike: "like",
    "save-library": "bookmark", "remove-library": "trash", follow: "user-plus", unfollow: "user-minus",
    artist: "user", album: "album", playlist: "playlist", "remove-queue": "trash",
    "remove-history": "trash", "remove-playlist": "trash"
  };
  for (const button of els.moreMenu?.querySelectorAll("[data-more-action]") || []) {
    if (button.dataset.actionIconReady === "true") continue;
    const label = button.textContent.trim();
    button.innerHTML = `${standardIconSvg(moreActionIcons[button.dataset.moreAction] || "audio", "more-action-icon")}<span class="more-action-label">${escapeText(label)}</span>`;
    button.dataset.actionIconReady = "true";
  }
}
const DEFAULT_THEME_RGB = [237, 85, 100];
const THEME_PRESETS = {
  auto: { label: "Follow current song", rgb: DEFAULT_THEME_RGB },
  red: { label: "Metrolist crimson", rgb: [237, 85, 100] },
  rose: { label: "Rose", rgb: [216, 27, 96] },
  purple: { label: "Purple", rgb: [142, 36, 170] },
  indigo: { label: "Indigo", rgb: [57, 73, 171] },
  blue: { label: "Blue", rgb: [30, 136, 229] },
  cyan: { label: "Cyan", rgb: [0, 172, 193] },
  teal: { label: "Teal", rgb: [0, 137, 123] },
  green: { label: "Green", rgb: [67, 160, 71] },
  lime: { label: "Lime", rgb: [192, 202, 51] },
  gold: { label: "Amber", rgb: [255, 179, 0] },
  orange: { label: "Orange", rgb: [251, 140, 0] },
  "blue-grey": { label: "Blue grey", rgb: [84, 110, 122] }
};
const SETTINGS_KEY = "auralane:appearance";
const QUEUE_HISTORY_KEY = "auralane:queueHistory";
const SEARCH_HISTORY_KEY = "auralane:searchHistory";
const CACHE_META_KEY = "auralane:metadataCache";
const LOCAL_LYRICS_KEY = "auralane:localLyrics";
const LYRICS_TRANSLATION_KEY = "auralane:lyricsTranslations";
const LYRICS_ROMANIZATION_KEY = "auralane:lyricsRomanizations";
const LYRICS_OFFSET_KEY = "auralane:lyricsOffsets";
// Allow correcting lyrics whose provider timestamps start noticeably early or late.
// The buttons remain fine-grained (500 ms), while manual adjustment can cover a full minute.
const LYRICS_OFFSET_LIMIT_MS = 60_000;
const LYRICS_SOURCE_MEMORY_KEY = "auralane:lyricsSourceMemory";
const LIKED_REMOVAL_TOMBSTONES_KEY = "auralane:likedRemovalTombstones";
const SYNC_OUTBOX_KEY = "auralane:syncOutbox";
const DOWNLOAD_QUEUE_KEY = "auralane:downloadQueue";
const PLAYBACK_STATS_KEY = "auralane:playbackStats";
// Home recommendations are device-local, like Metrolist's local database. They
// intentionally survive sign-out while account-owned likes/library remain scoped.
const HOME_LISTENING_HISTORY_KEY = "auralane:homeListeningHistory";
const HOME_PLAYBACK_STATS_KEY = "auralane:homePlaybackStats";
const LOCAL_PLAYLISTS_KEY = "auralane:localPlaylists";
const WEB_FALLBACK_MIGRATION_KEY = "auralane:webFallbackDefaultOff:v1";
const NETEASE_PRIORITY_MIGRATION_KEY = "auralane:neteaseLyricsPriority:v1";
const BACKUP_FORMAT = "auralane-backup";
const BACKUP_VERSION = 1;
const SESSION_SAVE_INTERVAL_MS = 2500;
const LYRICS_GAME_MAX_AUTO_REPLAYS = 2;
const RESTORABLE_VIEWS = new Set(["home", "search", "explore", "charts", "new", "moods", "liked", "downloaded", "localMusic", "library", "history", "playlists", "settings"]);

function skeletonHtml(kind = "rows", count = 8) {
  if (kind === "hero") return `<div class="skeleton-hero"><span></span><div><i></i><i></i><i></i></div></div>`;
  if (kind === "cards") return `<div class="skeleton-cards">${Array.from({ length: count }, () => `<div class="skeleton-card"><span></span><i></i><i></i></div>`).join("")}</div>`;
  return `<div class="skeleton-rows">${Array.from({ length: count }, () => `<div class="skeleton-row"><span></span><i></i><i></i></div>`).join("")}</div>`;
}
const ACCOUNT_SCOPED_STORAGE_KEYS = new Set([
  SETTINGS_KEY,
  QUEUE_HISTORY_KEY,
  SEARCH_HISTORY_KEY,
  LOCAL_LYRICS_KEY,
  LYRICS_TRANSLATION_KEY,
  LYRICS_ROMANIZATION_KEY,
  LYRICS_OFFSET_KEY,
  LYRICS_SOURCE_MEMORY_KEY,
  LIKED_REMOVAL_TOMBSTONES_KEY,
  SYNC_OUTBOX_KEY,
  DOWNLOAD_QUEUE_KEY,
  PLAYBACK_STATS_KEY
]);
const LYRICS_PROVIDER_DEFS = [
  { key: "netease", label: "NetEase Music", settingId: "settingsLyricsProviderNetease", searchId: "lyricsSearchProviderNetease" },
  { key: "musixmatch", label: "Musixmatch", settingId: "settingsLyricsProviderMusixmatch", searchId: "lyricsSearchProviderMusixmatch" },
  { key: "betterlyrics", label: "BetterLyrics", settingId: "settingsLyricsProviderBetter", searchId: "lyricsSearchProviderBetter" },
  { key: "lrclib", label: "LRCLIB", settingId: "settingsLyricsProviderLrclib", searchId: "lyricsSearchProviderLrclib" },
  { key: "kugou", label: "KuGou", settingId: "settingsLyricsProviderKugou", searchId: "lyricsSearchProviderKugou" },
  { key: "paxsenix", label: "Paxsenix", settingId: "settingsLyricsProviderPaxsenix", searchId: "lyricsSearchProviderPaxsenix" },
  { key: "lyricsplus", label: "LyricsPlus", settingId: "settingsLyricsProviderLyricsPlus", searchId: "lyricsSearchProviderLyricsPlus" },
  { key: "lyrics-ovh", label: "Lyrics.ovh", settingId: "settingsLyricsProviderOvh", searchId: "lyricsSearchProviderOvh" },
  { key: "youtube-transcript", label: "YouTube transcript", settingId: "settingsLyricsProviderTranscript", searchId: "lyricsSearchProviderTranscript" }
];
const DEFAULT_SETTINGS = {
  language: "en",
  density: "normal",
  lyricsSource: "auto",
  lyricsSourceOrder: ["netease", "musixmatch", "betterlyrics", "lrclib", "kugou", "paxsenix", "lyricsplus", "lyrics-ovh", "youtube-transcript"],
  lyricsSearchProviders: {
    netease: true,
    musixmatch: true,
    betterlyrics: true,
    lrclib: true,
    kugou: true,
    paxsenix: true,
    lyricsplus: true,
    "lyrics-ovh": true,
    "youtube-transcript": true
  },
  lyricsTranslateTarget: "zh-TW",
  lyricsAutoTranslate: false,
  lyricsAutoRomanize: false,
  lyricsDuetMode: false,
  lyricsScale: 100,
  lyricsFullscreenBackground: "song",
  lyricsFullscreenAlign: "auto",
  lyricsFullscreenDisplay: "scroll",
  lyricsFullscreenCover: "square",
  sidebarCollapsed: false,
  lyricsCardTemplate: "auralane",
  desktopLyricsOpacity: 65,
  desktopLyricsFont: "system",
  rightPanelWidth: 360,
  webFallback: false,
  offlineMode: false,
  notifications: false,
  audioOutputDeviceId: "default",
  queueLock: false,
  queueFollowPlaying: true,
  collectionFollowPlaying: false,
  smartQueue: false,
  quality: "auto",
  miniSkin: "compact",
  crossfadeSeconds: 0,
  artistShuffleLimit: 100,
  libraryAutoRefresh: true,
  libraryDefaultSort: "recent",
  themeMode: "auto",
  smartCache: false,
  cacheSize: 512,
  debugLogs: false,
  dspNormalize: false,
  skipSilence: false,
  dspPreservePitch: true,
  dspSpeed: 1.0,
  dspEQ: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

const INTERFACE_LANGUAGES = ["en", "zh-TW", "zh-CN", "ja", "ko"];
const INTERFACE_LANGUAGE_TAGS = {
  en: "en",
  "zh-TW": "zh-Hant",
  "zh-CN": "zh-Hans",
  ja: "ja",
  ko: "ko"
};
const UI_TRANSLATIONS = {
  en: {
    "nav.browse": "Browse",
    "nav.home": "Home",
    "nav.search": "Search",
    "nav.explore": "Explore",
    "nav.charts": "Charts",
    "nav.new": "New releases",
    "nav.moods": "Moods",
    "nav.games": "Games",
    "nav.libraryGroup": "Library",
    "nav.library": "Library",
    "nav.liked": "Liked Songs",
    "nav.downloaded": "Downloaded",
    "nav.playlists": "Playlists",
    "nav.system": "System",
    "nav.settings": "Settings",
    "search.placeholder": "Search songs, artists, or paste a YouTube link",
    "search.liked": "Search liked songs",
    "search.downloaded": "Search downloaded songs",
    "settings.subtitle": "Personalize playback, lyrics, library and storage.",
    "settings.general": "General",
    "settings.lyrics": "Lyrics",
    "settings.playback": "Playback",
    "settings.library": "Library & sync",
    "settings.storage": "Storage",
    "settings.layout": "Layout",
    "settings.language": "Interface language",
    "settings.languageHint": "Changes the app language immediately",
    "session.title": "Session",
    "session.queue": "Queue",
    "session.lyrics": "Lyrics",
    "session.queueEmpty": "Queue is empty.",
    "session.noSongs": "No songs queued.",
    "session.queueCount": "{count} {item} in queue",
    "session.itemOne": "item",
    "session.itemMany": "items",
    "player.nothing": "Nothing playing",
    "player.choose": "Choose a song",
    "player.play": "Play",
    "player.pause": "Pause",
    "player.stop": "Stop",
    "player.signInLike": "Sign in to like songs",
    "player.like": "Like current song",
    "player.unlike": "Unlike current song",
    "player.share": "Share current song",
    "player.noShare": "No song to share"
  },
  "zh-TW": {
    "nav.browse": "瀏覽",
    "nav.home": "首頁",
    "nav.search": "搜尋",
    "nav.explore": "探索",
    "nav.charts": "排行榜",
    "nav.new": "最新發行",
    "nav.moods": "心情與曲風",
    "nav.games": "音樂遊戲",
    "nav.libraryGroup": "音樂庫",
    "nav.library": "音樂庫",
    "nav.liked": "喜歡的歌曲",
    "nav.downloaded": "已下載",
    "nav.playlists": "播放清單",
    "nav.system": "系統",
    "nav.settings": "設定",
    "search.placeholder": "搜尋歌曲、藝人，或貼上 YouTube 連結",
    "search.liked": "搜尋喜歡的歌曲",
    "search.downloaded": "搜尋已下載的歌曲",
    "settings.subtitle": "自訂播放、歌詞、音樂庫與儲存空間。",
    "settings.general": "一般",
    "settings.lyrics": "歌詞",
    "settings.playback": "播放",
    "settings.library": "音樂庫與同步",
    "settings.storage": "儲存空間",
    "settings.layout": "版面配置",
    "settings.language": "介面語言",
    "settings.languageHint": "立即切換應用程式顯示語言",
    "session.title": "播放工作階段",
    "session.queue": "佇列",
    "session.lyrics": "歌詞",
    "session.queueEmpty": "播放佇列是空的。",
    "session.noSongs": "佇列中沒有歌曲。",
    "session.queueCount": "佇列中有 {count} 首歌曲",
    "session.itemOne": "首",
    "session.itemMany": "首",
    "player.nothing": "目前沒有播放歌曲",
    "player.choose": "選擇一首歌曲",
    "player.play": "播放",
    "player.pause": "暫停",
    "player.stop": "停止",
    "player.signInLike": "登入後即可將歌曲設為喜歡",
    "player.like": "將目前歌曲設為喜歡",
    "player.unlike": "取消喜歡目前歌曲",
    "player.share": "分享目前歌曲",
    "player.noShare": "目前沒有可分享的歌曲"
  },
  "zh-CN": {
    "nav.browse": "浏览",
    "nav.home": "首页",
    "nav.search": "搜索",
    "nav.explore": "探索",
    "nav.charts": "排行榜",
    "nav.new": "最新发行",
    "nav.moods": "心情与流派",
    "nav.games": "音乐游戏",
    "nav.libraryGroup": "音乐库",
    "nav.library": "音乐库",
    "nav.liked": "喜欢的歌曲",
    "nav.downloaded": "已下载",
    "nav.playlists": "播放列表",
    "nav.system": "系统",
    "nav.settings": "设置",
    "search.placeholder": "搜索歌曲、艺人，或粘贴 YouTube 链接",
    "search.liked": "搜索喜欢的歌曲",
    "search.downloaded": "搜索已下载的歌曲",
    "settings.subtitle": "自定义播放、歌词、音乐库和存储空间。",
    "settings.general": "常规",
    "settings.lyrics": "歌词",
    "settings.playback": "播放",
    "settings.library": "音乐库与同步",
    "settings.storage": "存储空间",
    "settings.layout": "界面布局",
    "settings.language": "界面语言",
    "settings.languageHint": "立即切换应用程序显示语言",
    "session.title": "播放会话",
    "session.queue": "队列",
    "session.lyrics": "歌词",
    "session.queueEmpty": "播放队列为空。",
    "session.noSongs": "队列中没有歌曲。",
    "session.queueCount": "队列中有 {count} 首歌曲",
    "session.itemOne": "首",
    "session.itemMany": "首",
    "player.nothing": "当前没有播放歌曲",
    "player.choose": "选择一首歌曲",
    "player.play": "播放",
    "player.pause": "暂停",
    "player.stop": "停止",
    "player.signInLike": "登录后即可喜欢歌曲",
    "player.like": "喜欢当前歌曲",
    "player.unlike": "取消喜欢当前歌曲",
    "player.share": "分享当前歌曲",
    "player.noShare": "当前没有可分享的歌曲"
  },
  ja: {
    "nav.browse": "ブラウズ",
    "nav.home": "ホーム",
    "nav.search": "検索",
    "nav.explore": "探索",
    "nav.charts": "ランキング",
    "nav.new": "新作",
    "nav.moods": "ムードとジャンル",
    "nav.games": "音楽ゲーム",
    "nav.libraryGroup": "ライブラリ",
    "nav.library": "ライブラリ",
    "nav.liked": "高く評価した曲",
    "nav.downloaded": "ダウンロード済み",
    "nav.playlists": "プレイリスト",
    "nav.system": "システム",
    "nav.settings": "設定",
    "search.placeholder": "曲やアーティストを検索、または YouTube リンクを貼り付け",
    "search.liked": "高く評価した曲を検索",
    "search.downloaded": "ダウンロード済みの曲を検索",
    "settings.subtitle": "再生、歌詞、ライブラリ、ストレージをカスタマイズします。",
    "settings.general": "一般",
    "settings.lyrics": "歌詞",
    "settings.playback": "再生",
    "settings.library": "ライブラリと同期",
    "settings.storage": "ストレージ",
    "settings.layout": "レイアウト",
    "settings.language": "表示言語",
    "settings.languageHint": "アプリの表示言語をすぐに切り替えます",
    "session.title": "セッション",
    "session.queue": "キュー",
    "session.lyrics": "歌詞",
    "session.queueEmpty": "キューは空です。",
    "session.noSongs": "キューに曲がありません。",
    "session.queueCount": "キューに {count} 曲",
    "session.itemOne": "曲",
    "session.itemMany": "曲",
    "player.nothing": "再生中の曲はありません",
    "player.choose": "曲を選択",
    "player.play": "再生",
    "player.pause": "一時停止",
    "player.stop": "停止",
    "player.signInLike": "ログインすると曲を高く評価できます",
    "player.like": "現在の曲を高く評価",
    "player.unlike": "現在の曲の高評価を解除",
    "player.share": "現在の曲を共有",
    "player.noShare": "共有する曲がありません"
  },
  ko: {
    "nav.browse": "둘러보기",
    "nav.home": "홈",
    "nav.search": "검색",
    "nav.explore": "탐색",
    "nav.charts": "차트",
    "nav.new": "새 앨범 및 싱글",
    "nav.moods": "분위기 및 장르",
    "nav.games": "음악 게임",
    "nav.libraryGroup": "보관함",
    "nav.library": "보관함",
    "nav.liked": "좋아요 표시한 음악",
    "nav.downloaded": "다운로드",
    "nav.playlists": "재생목록",
    "nav.system": "시스템",
    "nav.settings": "설정",
    "search.placeholder": "노래나 아티스트 검색 또는 YouTube 링크 붙여넣기",
    "search.liked": "좋아요 표시한 음악 검색",
    "search.downloaded": "다운로드한 음악 검색",
    "settings.subtitle": "재생, 가사, 보관함 및 저장공간을 맞춤설정합니다.",
    "settings.general": "일반",
    "settings.lyrics": "가사",
    "settings.playback": "재생",
    "settings.library": "보관함 및 동기화",
    "settings.storage": "저장공간",
    "settings.layout": "레이아웃",
    "settings.language": "인터페이스 언어",
    "settings.languageHint": "앱 표시 언어를 즉시 변경합니다",
    "session.title": "세션",
    "session.queue": "대기열",
    "session.lyrics": "가사",
    "session.queueEmpty": "재생 대기열이 비어 있습니다.",
    "session.noSongs": "대기열에 음악이 없습니다.",
    "session.queueCount": "대기열에 {count}곡",
    "session.itemOne": "곡",
    "session.itemMany": "곡",
    "player.nothing": "재생 중인 음악 없음",
    "player.choose": "음악 선택",
    "player.play": "재생",
    "player.pause": "일시중지",
    "player.stop": "중지",
    "player.signInLike": "로그인하여 음악에 좋아요를 표시하세요",
    "player.like": "현재 음악 좋아요",
    "player.unlike": "현재 음악 좋아요 취소",
    "player.share": "현재 음악 공유",
    "player.noShare": "공유할 음악이 없습니다"
  }
};
const componentTextBindings = [];
const componentAttributeBindings = [];
const componentBoundTextNodes = new WeakSet();
const componentBoundAttributes = new WeakMap();

function componentI18nSource(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function componentDictionary() {
  return window.AURALANE_COMPONENT_I18N || { en: {} };
}

function componentText(source, replacements = {}) {
  const dictionary = componentDictionary();
  const selected = dictionary[state.settings.language] || dictionary.en || {};
  const template = selected[source] || dictionary.en?.[source] || source;
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function registerComponentTranslations(root = document.body) {
  const dictionary = componentDictionary();
  const english = dictionary.en || {};
  const nodes = [];
  if (root?.nodeType === Node.TEXT_NODE) nodes.push(root);
  if (root?.nodeType === Node.ELEMENT_NODE || root === document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
  }
  for (const node of nodes) {
    if (componentBoundTextNodes.has(node)) continue;
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, [data-i18n-skip], [data-i18n]")) continue;
    const source = componentI18nSource(node.nodeValue);
    if (!source || !Object.hasOwn(english, source)) continue;
    const raw = node.nodeValue || "";
    componentTextBindings.push({
      node,
      source,
      leading: raw.match(/^\s*/)?.[0] || "",
      trailing: raw.match(/\s*$/)?.[0] || ""
    });
    componentBoundTextNodes.add(node);
  }

  const elements = root?.nodeType === Node.ELEMENT_NODE
    ? [root, ...root.querySelectorAll("*")]
    : (root === document.body ? [...document.querySelectorAll("*")] : []);
  for (const element of elements) {
    if (element.closest("[data-i18n-skip]")) continue;
    let bound = componentBoundAttributes.get(element);
    if (!bound) {
      bound = new Set();
      componentBoundAttributes.set(element, bound);
    }
    for (const attribute of ["placeholder", "title", "aria-label"]) {
      if (bound.has(attribute) || !element.hasAttribute(attribute)) continue;
      const source = componentI18nSource(element.getAttribute(attribute));
      if (!source || !Object.hasOwn(english, source)) continue;
      componentAttributeBindings.push({ element, attribute, source });
      bound.add(attribute);
    }
  }
}

function applyComponentTranslations(language = state.settings.language) {
  const dictionary = componentDictionary();
  const selected = dictionary[language] || dictionary.en || {};
  const english = dictionary.en || {};
  for (const binding of componentTextBindings) {
    if (!binding.node.isConnected) continue;
    const translated = selected[binding.source] || english[binding.source] || binding.source;
    binding.node.nodeValue = `${binding.leading}${translated}${binding.trailing}`;
  }
  for (const binding of componentAttributeBindings) {
    if (!binding.element.isConnected) continue;
    binding.element.setAttribute(
      binding.attribute,
      selected[binding.source] || english[binding.source] || binding.source
    );
  }
}

function initializeComponentI18n() {
  registerComponentTranslations(document.body);
  const observer = new MutationObserver((mutations) => {
    let added = false;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        registerComponentTranslations(node);
        added = true;
      }
    }
    if (added) applyComponentTranslations();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function interfaceText(key, replacements = {}) {
  const language = INTERFACE_LANGUAGES.includes(state.settings.language) ? state.settings.language : DEFAULT_SETTINGS.language;
  const template = UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || key;
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function showCopySuccess(button) {
  if (!(button instanceof HTMLElement)) return;
  window.clearTimeout(button._copySuccessTimer);
  button.classList.remove("copy-confirmed");
  void button.offsetWidth;
  button.classList.add("copy-confirmed");
  button._copySuccessTimer = window.setTimeout(() => {
    button.classList.remove("copy-confirmed");
    button._copySuccessTimer = 0;
  }, 1350);
}

function applyInterfaceLanguage(language = state.settings.language, persist = true) {
  const nextLanguage = INTERFACE_LANGUAGES.includes(language) ? language : DEFAULT_SETTINGS.language;
  state.settings.language = nextLanguage;
  document.documentElement.lang = INTERFACE_LANGUAGE_TAGS[nextLanguage] || "en";
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = interfaceText(element.dataset.i18n);
  }
  for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
    element.placeholder = interfaceText(element.dataset.i18nPlaceholder);
  }
  applyComponentTranslations(nextLanguage);
  if (els.settingsLanguage) els.settingsLanguage.value = nextLanguage;
  if (persist) saveAppearanceSettings();
  renderNow();
}

function escapeText(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

function resizeThumbnailUrl(value, requestedSize = 544) {
  const url = String(value || "").trim();
  const size = Math.max(120, Math.min(1600, Number(requestedSize) || 544));
  if (/^https:\/\/(?:lh3|yt3)\.googleusercontent\.com\//i.test(url)) {
    const base = url.replace(/=w\d+-h\d+.*$/i, "").replace(/=s\d+.*$/i, "");
    return `${base}=w${size}-h${size}-p-l90-rj`;
  }
  if (/^https:\/\/yt3\.ggpht\.com\//i.test(url)) {
    const base = url.replace(/=s\d+.*$/i, "").replace(/=w\d+-h\d+.*$/i, "");
    return `${base}=w${size}-h${size}-p-l90-rj`;
  }
  if (size >= 500 && /^https:\/\/i\.ytimg\.com\/vi\//i.test(url)) {
    return url.replace(/\/(?:mq|hq|sd|maxres)default\.(?:jpg|webp)/i, "/maxresdefault.jpg");
  }
  return url;
}

function setIconButton(button, icon, label) {
  if (!button) return;
  button.innerHTML = standardIconSvg(icon);
  button.title = label;
  button.setAttribute("aria-label", label);
}

function normalizeThumbnailUrl(value, requestedSize = 544) {
  if (Array.isArray(value)) {
    for (let index = value.length - 1; index >= 0; index -= 1) {
      const normalized = normalizeThumbnailUrl(value[index], requestedSize);
      if (normalized) return normalized;
    }
    return "";
  }
  if (value && typeof value === "object") {
    return normalizeThumbnailUrl(value.url || value.src || value.thumbnails || "", requestedSize);
  }
  const url = String(value || "").trim();
  if (!url) return "";
  if (url.startsWith("//")) return normalizeThumbnailUrl(`https:${url}`, requestedSize);
  if (url.startsWith("http://")) return normalizeThumbnailUrl(`https://${url.slice(7)}`, requestedSize);
  return /^(https:|data:|blob:|auralane-cache:)/i.test(url) ? resizeThumbnailUrl(url, requestedSize) : "";
}

function thumbnailUrls(itemOrUrl, fallbackId = "", requestedSize = 544) {
  const item = itemOrUrl && typeof itemOrUrl === "object" ? itemOrUrl : null;
  const primary = normalizeThumbnailUrl(item
    ? (item.thumbnail || item.thumbnailUrl || item.thumbnails || item.image)
    : itemOrUrl, requestedSize);
  const id = String(fallbackId || item?.videoId || item?.id || "").trim();
  const fallback = /^[\w-]{11}$/.test(id) ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
  // YouTube video fallbacks are often 16:9 images with letterboxing baked
  // into the pixels. Prefer the native music artwork whenever it exists.
  return [...new Set([primary, fallback].filter(Boolean))];
}

function cssUrl(value) {
  return `url("${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\r\n\f]/g, "")}")`;
}

function thumbnailBackground(itemOrUrl, fallbackId = "", requestedSize = 544) {
  const [thumbnail] = thumbnailUrls(itemOrUrl, fallbackId, requestedSize);
  return thumbnail ? cssUrl(thumbnail) : "";
}

function thumbnailStyle(itemOrUrl, fallbackId = "", requestedSize = 544) {
  return escapeText(thumbnailBackground(itemOrUrl, fallbackId, requestedSize));
}

function switchView(view) {
  if (view !== "games") setGameSessionActive(false);
  state.activeView = view || "home";
  for (const element of document.querySelectorAll(".view")) {
    element.classList.toggle("hidden", element.id !== `${view}View`);
  }
  for (const button of document.querySelectorAll(".nav")) {
    button.classList.toggle("active", button.dataset.view === view);
  }
  schedulePlaybackSessionSave();
}

function toast(message, isError = false) {
  if (els.globalStatus) {
    els.globalStatus.textContent = message;
    els.globalStatus.style.color = isError ? "#ff8a8a" : "#a9a29a";
  }
  els.searchStatus.textContent = message;
  els.searchStatus.style.color = isError ? "#ff8a8a" : "#a9a29a";
}

function webFallbackAllowed() {
  return Boolean(state.auth?.signedIn && state.settings.webFallback);
}

function playbackFailureMessage(reason) {
  const raw = String(reason?.message || reason || "").trim();
  if (/No direct audio URL|supported clients|webview|direct audio|stream url/i.test(raw)) {
    return webFallbackAllowed()
      ? "Direct audio is unavailable; using YouTube Music web playback."
      : state.auth?.signedIn
        ? "Direct audio is unavailable for this song. Enable Web fallback in Settings > Playback."
        : "Anonymous direct audio is unavailable for this song.";
  }
  return raw || "Playback failed.";
}

function isGameSessionActive() {
  return Boolean(state.gameSessionActive && state.activeGame);
}

function blockPlaybackForGame() {
  if (!isGameSessionActive()) return false;
  toast("Game mode is active. Go back to the game menu before playing music.", true);
  return true;
}

function suspendPlaybackForGame() {
  try {
    els.audio.pause();
  } catch {}
  if (state.playbackMode === "embed") {
    stopEmbedPlayer();
    state.playbackMode = "idle";
  }
  state.playing = false;
  setPlaybackModeLabel("Game mode");
  renderNow();
}

function setGameSessionActive(active) {
  const next = Boolean(active);
  if (!next) {
    document.body.classList.remove("lyrics-game-play-active");
    stopRhythmGame?.();
    clearTimeout(heardleState?.timer);
    if (els.lyricsGameAudio) els.lyricsGameAudio.pause();
    stopHeardleAudio?.();
    restoreHeardlePlayer?.();
  }
  if (state.gameSessionActive === next) return;
  state.gameSessionActive = next;
  document.body.classList.toggle("game-session-active", next);
  if (next) {
    suspendPlaybackForGame();
    toast("Game mode started. Music playback is disabled until you leave the game.");
  } else {
    if (els.playbackMode?.textContent === "Game mode") setPlaybackModeLabel("Ready");
    renderNow();
  }
}

function formatClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const rest = String(total % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

function switchSidePanel(panel) {
  const showLyrics = panel === "lyrics";
  const nextPanel = showLyrics ? "lyrics" : "queue";
  const previousPanel = state.activeSidePanel || "queue";
  if (els.rightPanel && previousPanel !== nextPanel) {
    state.sidePanelScroll[previousPanel] = els.rightPanel.scrollTop;
  }
  if (!showLyrics && state.lyricsScrollAnimationFrame) {
    cancelAnimationFrame(state.lyricsScrollAnimationFrame);
    state.lyricsScrollAnimationFrame = 0;
  }
  state.activeSidePanel = nextPanel;
  els.queuePane.classList.toggle("hidden", showLyrics);
  els.lyricsPane.classList.toggle("hidden", !showLyrics);
  els.rightPanel.classList.toggle("showing-lyrics", showLyrics);
  for (const button of document.querySelectorAll(".side-tab")) {
    button.classList.toggle("active", button.dataset.sidePanel === panel);
  }
  if (els.queueButton) els.queueButton.classList.toggle("active", panel === "queue");
  if (els.lyricsButton) els.lyricsButton.classList.toggle("active", panel === "lyrics");
  if (els.rightPanel && previousPanel !== nextPanel) {
    requestAnimationFrame(() => {
      if (state.activeSidePanel !== nextPanel) return;
      els.rightPanel.scrollTop = Number(state.sidePanelScroll[nextPanel] || 0);
      if (showLyrics && state.lyricsAutoSync) {
        const active = activeLyricElement();
        if (active) scrollLyricIntoView(active);
      }
    });
  }
  schedulePlaybackSessionSave();
}

function updateExpandedLyricsBackdrop() {
  const followsSong = state.settings.lyricsFullscreenBackground === "song" && Boolean(state.currentTrack?.id);
  document.body.classList.toggle("lyrics-song-backdrop", followsSong);
  document.documentElement.style.setProperty(
    "--lyrics-backdrop-image",
    followsSong ? thumbnailBackground(state.currentTrack, "", 1080) : "none"
  );
}

function setLyricsExpanded(expanded, options = {}) {
  state.lyricsExpanded = Boolean(expanded);
  void window.metro.setExpandedLyricsKeepAwake?.(state.lyricsExpanded).catch(() => {});
  if (state.lyricsScrollAnimationFrame) cancelAnimationFrame(state.lyricsScrollAnimationFrame);
  state.lyricsScrollAnimationFrame = 0;
  document.body.classList.toggle("lyrics-maximized", state.lyricsExpanded);
  if (state.lyricsExpanded && !document.fullscreenElement) {
    void document.documentElement.requestFullscreen?.().catch(() => {});
  } else if (!state.lyricsExpanded && document.fullscreenElement) {
    void document.exitFullscreen?.().catch(() => {});
  }

  // 處理歌詞放大時的右上角縮小按鈕與右下角歌名資訊
  let restoreBtn = document.querySelector("#lyrics-restore-btn");
  let metaInfo = document.querySelector("#lyrics-expanded-meta");

  if (state.lyricsExpanded) {
    if (!restoreBtn) {
      restoreBtn = document.createElement("button");
      restoreBtn.id = "lyrics-restore-btn";
      restoreBtn.className = "secondary icon-only";
      restoreBtn.style.position = "fixed";
      restoreBtn.style.top = "60px";
      restoreBtn.style.right = "20px";
      restoreBtn.style.zIndex = "1000";
      restoreBtn.innerHTML = standardIconSvg("collapse");
      restoreBtn.addEventListener("click", () => setLyricsExpanded(false));
      document.body.appendChild(restoreBtn);
    }
    if (!metaInfo) {
      metaInfo = document.createElement("div");
      metaInfo.id = "lyrics-expanded-meta";
      metaInfo.style.position = "fixed";
      metaInfo.style.bottom = "calc(var(--player-height) / 2 - 22px)";
      metaInfo.style.left = "24px";
      metaInfo.style.zIndex = "1000";
      metaInfo.style.textAlign = "left";
      metaInfo.style.color = "var(--text-color, white)";
      metaInfo.style.fontFamily = "var(--font-family, sans-serif)";
      metaInfo.style.pointerEvents = "none";
      metaInfo.style.display = "flex";
      metaInfo.style.flexDirection = "column";
      metaInfo.style.justifyContent = "center";
      document.body.appendChild(metaInfo);
    }
    metaInfo.innerHTML = `
      <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 4px;">${state.currentTrack?.title || "Unknown"}</div>
      <div style="font-size: 0.9rem; opacity: 0.8;">${state.currentTrack?.artist || "Unknown"}</div>
    `;
  } else {
    if (restoreBtn) restoreBtn.remove();
    if (metaInfo) metaInfo.remove();
  }
  const label = state.lyricsExpanded ? "Restore lyrics panel" : "Expand lyrics";
  if (els.lyricsExpandButton) {
    els.lyricsExpandButton.setAttribute("aria-label", label);
    els.lyricsExpandButton.title = label;
    els.lyricsExpandButton.classList.toggle("active", state.lyricsExpanded);
    els.lyricsExpandButton.innerHTML = standardIconSvg(state.lyricsExpanded ? "collapse" : "expand");
  }
  updateExpandedLyricsBackdrop();
  if (state.lyricsExpanded) switchSidePanel("lyrics");
  if (state.lyrics?.found && state.lyrics?.lines?.length) renderLyrics(state.lyrics);
  // The fixed maximized panel has different geometry from the narrow session
  // panel. Re-anchor in the first stable layout frame instead of waiting for
  // the next lyric change, which otherwise looks like a one-frame jump.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    scheduleLyricTokenWrapMeasurement();
    scrollLyricIntoView(activeLyricElement(), { instant: true });
  }));
  schedulePlaybackSessionSave();
}

function saveAppearanceSettings() {
  try {
    localStorage.setItem(scopedStorageKey(SETTINGS_KEY), JSON.stringify(state.settings));
  } catch {
    // Ignore storage errors in restricted browser contexts.
  }
}

function normalizeLyricsProviderOrder(order = state.settings.lyricsSourceOrder) {
  const allowed = LYRICS_PROVIDER_DEFS.map((provider) => provider.key);
  const values = Array.isArray(order)
    ? order
    : String(order || "").split(",");
  const normalized = values
    .map((value) => String(value || "").trim())
    .filter((value, index, list) => allowed.includes(value) && list.indexOf(value) === index);
  // Automatic fallback order is fixed: NetEase first, Musixmatch second.
  // User choices for a specific song are handled separately as saved versions.
  const priority = ["netease", "musixmatch"];
  return [
    ...priority,
    ...normalized.filter((value) => !priority.includes(value)),
    ...allowed.filter((value) => !priority.includes(value) && !normalized.includes(value))
  ];
}

function normalizeLyricsProviderFlags(flags = state.settings.lyricsSearchProviders) {
  const source = flags && typeof flags === "object" && !Array.isArray(flags) ? flags : {};
  return LYRICS_PROVIDER_DEFS.reduce((next, provider) => {
    next[provider.key] = source[provider.key] !== false;
    return next;
  }, {});
}

function normalizeLyricsSettings() {
  state.settings.lyricsSourceOrder = normalizeLyricsProviderOrder(state.settings.lyricsSourceOrder);
  state.settings.lyricsSearchProviders = normalizeLyricsProviderFlags(state.settings.lyricsSearchProviders);
}

function lyricsProviderLabelByKey(key) {
  return LYRICS_PROVIDER_DEFS.find((provider) => provider.key === key)?.label || lyricsSourceLabel(key);
}

function lyricsProviderKeyByLabel(label) {
  const normalized = String(label || "").toLowerCase();
  return LYRICS_PROVIDER_DEFS.find((provider) => provider.label.toLowerCase() === normalized)?.key || "";
}

function setProviderCheckboxesFromSettings() {
  normalizeLyricsSettings();
  for (const provider of LYRICS_PROVIDER_DEFS) {
    const checked = state.settings.lyricsSearchProviders[provider.key] !== false;
    if (els[provider.settingId]) els[provider.settingId].checked = checked;
    if (els[provider.searchId]) els[provider.searchId].checked = checked;
  }
}

function syncSettingsControls() {
  normalizeLyricsSettings();
  if (els.settingsLanguage) {
    els.settingsLanguage.value = INTERFACE_LANGUAGES.includes(state.settings.language)
      ? state.settings.language
      : DEFAULT_SETTINGS.language;
  }
  if (els.settingsRightWidth) {
    els.settingsRightWidth.value = String(state.settings.rightPanelWidth);
    els.settingsRightWidthValue.textContent = `${state.settings.rightPanelWidth} px`;
  }
  if (els.settingsDensity) els.settingsDensity.value = state.settings.density;
  if (els.settingsThemeMode) els.settingsThemeMode.value = THEME_PRESETS[state.settings.themeMode] ? state.settings.themeMode : DEFAULT_SETTINGS.themeMode;
  if (els.settingsLyricsSource) els.settingsLyricsSource.value = state.settings.lyricsSource || DEFAULT_SETTINGS.lyricsSource;
  if (els.settingsLyricsPriority) {
    const value = normalizeLyricsProviderOrder().join(",");
    els.settingsLyricsPriority.value = [...els.settingsLyricsPriority.options].some((option) => option.value === value)
      ? value
      : DEFAULT_SETTINGS.lyricsSourceOrder.join(",");
  }
  setProviderCheckboxesFromSettings();
  if (els.settingsLyricsTranslateTarget) els.settingsLyricsTranslateTarget.value = state.settings.lyricsTranslateTarget || DEFAULT_SETTINGS.lyricsTranslateTarget;
  if (els.settingsLyricsScale) {
    els.settingsLyricsScale.value = String(state.settings.lyricsScale);
    els.settingsLyricsScaleValue.textContent = `${state.settings.lyricsScale}%`;
  }
  if (els.settingsLyricsCardTemplate) els.settingsLyricsCardTemplate.value = state.settings.lyricsCardTemplate || DEFAULT_SETTINGS.lyricsCardTemplate;
  if (els.settingsDesktopLyricsOpacity) {
    els.settingsDesktopLyricsOpacity.value = String(state.settings.desktopLyricsOpacity);
    if (els.settingsDesktopLyricsOpacityValue) els.settingsDesktopLyricsOpacityValue.textContent = `${state.settings.desktopLyricsOpacity}%`;
  }
  if (els.settingsDesktopLyricsFont) els.settingsDesktopLyricsFont.value = state.settings.desktopLyricsFont || DEFAULT_SETTINGS.desktopLyricsFont;
  if (els.settingsWebFallback) els.settingsWebFallback.checked = Boolean(state.settings.webFallback);
  if (els.settingsOfflineMode) els.settingsOfflineMode.checked = Boolean(state.settings.offlineMode);
  if (els.settingsNotifications) els.settingsNotifications.checked = Boolean(state.settings.notifications);
  if (els.settingsQueueLock) els.settingsQueueLock.checked = Boolean(state.settings.queueLock);
  if (els.settingsQuality) els.settingsQuality.value = state.settings.quality || DEFAULT_SETTINGS.quality;
  if (els.settingsCrossfade) {
    els.settingsCrossfade.value = String(state.settings.crossfadeSeconds || 0);
    els.settingsCrossfadeValue.textContent = state.settings.crossfadeSeconds ? `${state.settings.crossfadeSeconds}s` : "Off";
  }
  if (els.settingsArtistShuffleLimit) {
    const limit = artistShuffleLimit();
    els.settingsArtistShuffleLimit.value = String(limit);
    if (els.settingsArtistShuffleLimitValue) {
      els.settingsArtistShuffleLimitValue.textContent = `${limit} songs`;
    }
  }
  if (els.settingsLibraryAutoRefresh) els.settingsLibraryAutoRefresh.checked = Boolean(state.settings.libraryAutoRefresh);
  if (els.settingsLibraryDefaultSort) els.settingsLibraryDefaultSort.value = state.settings.libraryDefaultSort || DEFAULT_SETTINGS.libraryDefaultSort;
  if (els.settingsSmartCache) els.settingsSmartCache.checked = Boolean(state.settings.smartCache);
  if (els.settingsCacheSize) {
    els.settingsCacheSize.value = String(state.settings.cacheSize);
    els.settingsCacheSizeValue.textContent = `${state.settings.cacheSize} MB`;
  }
  updateCacheStatusText();
  if (els.settingsDebugLogs) els.settingsDebugLogs.checked = Boolean(state.settings.debugLogs);

  if (els.settingsDSPNormalize) els.settingsDSPNormalize.checked = Boolean(state.settings.dspNormalize);
  if (els.settingsSkipSilence) els.settingsSkipSilence.checked = Boolean(state.settings.skipSilence);
  if (els.settingsDSPPreservePitch) els.settingsDSPPreservePitch.checked = Boolean(state.settings.dspPreservePitch ?? true);
  if (els.settingsDSPSpeed) {
    els.settingsDSPSpeed.value = String(state.settings.dspSpeed || 1.0);
    if (els.settingsDSPSpeedValue) els.settingsDSPSpeedValue.textContent = `${(state.settings.dspSpeed || 1.0).toFixed(2)}x`;
  }
  if (els.settingsDSPEQ) {
    const sliders = els.settingsDSPEQ.querySelectorAll("input[type='range']");
    const bands = state.settings.dspEQ || [0,0,0,0,0,0,0,0,0,0];
    sliders.forEach((slider, index) => {
      slider.value = String(bands[index] || 0);
    });
  }
  updateDSP();
  renderSyncOutbox();
  renderDownloadManager();
  renderPlaybackStats();
  renderLibraryHealth();
}

function applyBooleanSetting(key, value, persist = true) {
  state.settings[key] = Boolean(value);
  if (key === "webFallback" && !state.settings[key]) stopEmbedPlayer();
  if (key === "offlineMode") {
    stopEmbedPlayer();
    renderQueue();
    renderNow();
    if (currentVisibleViewId() === "homeView") {
      loadHome(state.homeParams, state.homeBrowseId);
    }
    if (currentVisibleViewId() === "artistView" && state.artistResult) {
      renderArtist(state.artistResult, state.artistFallback || {});
    }
  }
  if (key === "queueLock") {
    resetQueueDragState();
    renderQueue();
  }
  if (persist) saveAppearanceSettings();
  if (persist && key === "lyricsAutoTranslate") {
    window.metro.setPreference?.({ key, value: state.settings[key] }).catch(() => {});
  }
  syncSettingsControls();
}

function applyChoiceSetting(key, value, allowed, persist = true) {
  state.settings[key] = allowed.includes(value) ? value : DEFAULT_SETTINGS[key];
  if (key === "libraryDefaultSort") {
    state.librarySort = state.settings[key];
    if (state.libraryData) renderLibrary(state.libraryData);
  }
  if (key === "miniSkin") syncMiniPlayerSoon();
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
}

function applyCacheSize(size, persist = true) {
  const value = Math.max(128, Math.min(4096, Number(size) || DEFAULT_SETTINGS.cacheSize));
  state.settings.cacheSize = value;
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
}

function applyCrossfadeSeconds(value, persist = true) {
  const seconds = Math.max(0, Math.min(12, Number(value) || 0));
  state.settings.crossfadeSeconds = seconds;
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
}

function applyArtistShuffleLimit(value, persist = true) {
  const raw = Number(value) || DEFAULT_SETTINGS.artistShuffleLimit;
  const limit = Math.max(25, Math.min(500, Math.round(raw / 25) * 25));
  state.settings.artistShuffleLimit = limit;
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
}

function formatBytes(bytes) {
  const value = Number(bytes) || 0;
  if (value >= 1024 * 1024 * 1024) return `${(value / 1024 / 1024 / 1024).toFixed(1)} GB`;
  if (value >= 1024 * 1024) return `${Math.round(value / 1024 / 1024)} MB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KB`;
  return `${value} B`;
}

function offlineCacheIdsFromTracks(tracks) {
  return new Set((tracks || []).map((track) => track?.id).filter(Boolean));
}

function isOfflineCached(videoId) {
  return Boolean(videoId && state.offlineCache?.ids?.has(videoId));
}

function downloadFailure(videoId) {
  return videoId ? state.offlineCacheFailures.get(videoId) || null : null;
}

function setDownloadFailure(videoId, message) {
  if (!videoId) return;
  if (message) state.offlineCacheFailures.set(videoId, String(message));
  else state.offlineCacheFailures.delete(videoId);
}

function downloadBatchText() {
  const batch = state.downloadBatch;
  if (!batch) return "";
  const current = batch.currentTitle ? ` - ${batch.currentTitle}` : "";
  return `Downloading ${batch.label}: ${batch.completed + batch.failed}/${batch.total}${current}`;
}

function appendBatchStatus(text) {
  const batch = downloadBatchText();
  return batch ? `${text} ${batch}.` : text;
}

function isOfflineQueueSource(source = state.queueSource) {
  return source?.type === "downloads";
}

function canAppendSmartQueue() {
  return false;
}

function rememberPlaybackStream(videoId, playback) {
  if (!videoId || !playback?.streamUrl) return;
  const expiresInSeconds = Number(playback.expiresInSeconds || 0) || 0;
  const capturedAt = Date.now();
  const expiresAt = expiresInSeconds ? capturedAt + Math.max(0, expiresInSeconds - 90) * 1000 : 0;
  state.playbackStreams.set(videoId, {
    ...playback,
    capturedAt,
    expiresAt
  });
  while (state.playbackStreams.size > 48) {
    state.playbackStreams.delete(state.playbackStreams.keys().next().value);
  }
}

function cachedPlaybackStream(videoId) {
  const cached = videoId ? state.playbackStreams.get(videoId) : null;
  return cached && (!cached.expiresAt || cached.expiresAt > Date.now()) ? cached : null;
}

function playbackStreamForCache(videoId) {
  const playback = videoId ? state.playbackStreams.get(videoId) : null;
  if (!playback) return null;
  if (playback.expiresAt && playback.expiresAt <= Date.now()) {
    state.playbackStreams.delete(videoId);
    return null;
  }
  return playback;
}

function updateCacheStatusText() {
  if (!els.settingsCacheStatus) return;
  const count = state.offlineCache?.tracks?.length || 0;
  const bytes = state.offlineCache?.stats?.bytes || 0;
  els.settingsCacheStatus.textContent = count
    ? `${count} offline song${count === 1 ? "" : "s"} cached · ${formatBytes(bytes)} used`
    : "No offline songs cached";
}

function renderOfflineDependentViews() {
  const view = currentVisibleViewId();
  if (view === "downloadedView") renderDownloaded();
  if (view === "libraryView" && state.libraryData) renderLibrary(state.libraryData);
  if (view === "artistView" && state.artistResult) renderArtist(state.artistResult, state.artistFallback || {});
}

function mergeOfflineDownloads(data) {
  if (!data) return data;
  return {
    ...data,
    downloads: state.offlineCache?.loaded ? state.offlineCache.tracks : (data.downloads || [])
  };
}

function applyOfflineCacheResult(result) {
  const tracks = result?.tracks || result?.items || [];
  for (const track of tracks) setDownloadFailure(track?.id, null);
  for (const id of result?.missingIds || []) {
    patchTrackState(id, { offlineCached: false, cached: false });
    setDownloadFailure(id, "Local file is missing. Click to download again.");
  }
  state.offlineCache = {
    tracks,
    ids: offlineCacheIdsFromTracks(tracks),
    stats: result || null,
    loaded: true
  };
  if (state.libraryData) {
    state.libraryData = mergeOfflineDownloads(state.libraryData);
  }
  updateCacheStatusText();
}

async function refreshOfflineCache(options = {}) {
  if (!window.metro?.cacheList) return;
  try {
    const result = await window.metro.cacheList();
    applyOfflineCacheResult(result);
    if (!options.silent && result?.missingCount) {
      toast(`Removed ${result.missingCount} missing offline file${result.missingCount === 1 ? "" : "s"}.`, true);
    }
    if (options.render) renderOfflineDependentViews();
  } catch (error) {
    if (state.settings.debugLogs) console.warn("Offline cache refresh failed", error);
  }
}

function applyCachedTrack(cachedTrack) {
  if (!cachedTrack?.id) return;
  const tracks = [
    cachedTrack,
    ...(state.offlineCache?.tracks || []).filter((track) => track.id !== cachedTrack.id)
  ];
  state.offlineCache = {
    tracks,
    ids: offlineCacheIdsFromTracks(tracks),
    stats: {
      ...(state.offlineCache?.stats || {}),
      count: tracks.length,
      bytes: tracks.reduce((sum, track) => sum + (Number(track.cacheSize) || 0), 0)
    },
    loaded: true
  };
  if (state.libraryData) {
    state.libraryData = mergeOfflineDownloads(state.libraryData);
  }
  setDownloadFailure(cachedTrack.id, null);
  patchTrackState(cachedTrack.id, { offlineCached: true, cached: true });
  updateCacheStatusText();
}

async function cacheTrackOffline(item, options = {}) {
  if (!isTrackItem(item) || !window.metro?.cacheTrack) return null;
  if (isOfflineCached(item.id)) {
    if (!options.silent) toast(`Already cached: ${item.title}`);
    return window.metro.cacheGet?.(item.id);
  }
  if (state.offlineCachePending.has(item.id)) {
    if (!options.silent) toast(`Caching already in progress: ${item.title}`);
    return null;
  }
  if (options.silent && state.offlineCachePending.size >= 2) return null;

  setDownloadFailure(item.id, null);
  state.offlineCachePending.add(item.id);
  refreshVisibleDataAfterMutation();
  if (!options.silent) toast(`Caching for offline: ${item.title}`);

  try {
    // Retry logic: attempt up to 3 times with exponential backoff
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        let playback = attempt === 0 ? (options.playback || playbackStreamForCache(item.id)) : null;
        if (!playback?.streamUrl || playback?.mode === "webview") {
          state.playbackStreams.delete(item.id);
          playback = await window.metro.playback({
            videoId: item.id,
            playlistId: item.playlistId || null
          });
          if (playback?.streamUrl && playback?.mode !== "webview") {
            rememberPlaybackStream(item.id, playback);
          }
        }
        const result = await window.metro.cacheTrack({
          track: item,
          playback: playback || null,
          cacheSizeMb: state.settings.cacheSize,
          evictable: options.evictable === true
        });
        const cachedTrack = result?.track || result;
        applyCachedTrack(cachedTrack);
        await refreshOfflineCache({ render: false });
        if (!options.silent) toast(`Cached offline: ${item.title}`);
        return cachedTrack;
      } catch (error) {
        lastError = error;
        // Distinguish error types
        const message = error.message || "Download failed.";
        const isNetworkError = message.includes("Network") || message.includes("fetch") || message.includes("timeout");
        const isAuthError = message.includes("401") || message.includes("403") || message.includes("Unauthorized");
        const isUnavailableError = message.includes("410") || message.includes("not found") || message.includes("unavailable");

        if (state.settings.debugLogs) {
          console.warn(`Cache attempt ${attempt + 1}/${maxRetries + 1} failed`, {
            track: item.title,
            error: message,
            type: isNetworkError ? "network" : isAuthError ? "auth" : isUnavailableError ? "unavailable" : "unknown"
          });
        }

        // A 403 commonly means the signed media URL expired or its client headers
        // no longer match. Resolve a fresh URL before reporting a hard failure.
        if (isAuthError && attempt < maxRetries) {
          state.playbackStreams.delete(item.id);
          await sleep(250);
          continue;
        }

        if (isAuthError || isUnavailableError) {
          setDownloadFailure(item.id, message);
          if (!options.silent) toast(message, true);
          return null;
        }

        // Retry on network errors with exponential backoff
        if (attempt < maxRetries) {
          const waitMs = Math.min(1000 * Math.pow(2, attempt), 5000);
          await sleep(waitMs);
        }
      }
    }

    // All retries failed
    const errorMsg = lastError?.message || "Download failed after retries.";
    setDownloadFailure(item.id, errorMsg);
    if (!options.silent) toast(errorMsg, true);
    else if (state.settings.debugLogs) console.warn("Smart cache failed", lastError);
    return null;
  } finally {
    state.offlineCachePending.delete(item.id);
    refreshVisibleDataAfterMutation();
  }
}

async function cacheTracksOffline(items, label = "selection", button = null) {
  const tracks = uniqueTracks((items || []).filter(isTrackItem));
  const pending = tracks.filter((track) => !isOfflineCached(track.id) && !state.offlineCachePending.has(track.id));
  if (!tracks.length) {
    toast("No songs to download.", true);
    return;
  }
  if (!pending.length) {
    toast(`${label} is already downloaded.`);
    return;
  }
  enqueueDownloads(pending, label);
  if (button) {
    button.disabled = true;
    window.setTimeout(() => {
      button.disabled = false;
    }, 800);
  }
  toast(`Queued ${pending.length} download${pending.length === 1 ? "" : "s"} from ${label}.`);
}

function loadDownloadQueue() {
  state.downloadQueue = readStoredList(DOWNLOAD_QUEUE_KEY).filter((item) => item?.track?.id).slice(0, 300);
  renderDownloadManager();
}

function saveDownloadQueue() {
  writeStoredList(DOWNLOAD_QUEUE_KEY, state.downloadQueue.slice(0, 300));
  renderDownloadManager();
}

function enqueueDownloads(tracks, label = "selection") {
  const existing = new Set(state.downloadQueue.filter((item) => ["queued", "downloading"].includes(item.status)).map((item) => item.track?.id));
  const queued = uniqueTracks((tracks || []).filter(isTrackItem))
    .filter((track) => !isOfflineCached(track.id) && !existing.has(track.id))
    .map((track) => ({
      id: `${Date.now()}-${track.id}-${Math.random().toString(36).slice(2, 6)}`,
      track: compactTrack(track),
      label,
      status: "queued",
      error: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  if (!queued.length) {
    renderDownloadManager();
    return;
  }
  state.downloadQueue.push(...queued);
  state.downloadPaused = false;
  saveDownloadQueue();
  processDownloadQueue();
}

async function processDownloadQueue() {
  if (state.downloadProcessing || state.downloadPaused) {
    renderDownloadManager();
    return;
  }
  const next = state.downloadQueue.find((item) => item.status === "queued");
  if (!next) {
    state.downloadBatch = null;
    await refreshOfflineCache({ render: true });
    renderDownloadManager();
    refreshVisibleDataAfterMutation();
    return;
  }
  state.downloadProcessing = true;
  next.status = "downloading";
  next.updatedAt = new Date().toISOString();
  state.downloadBatch = {
    label: next.label || "queue",
    total: state.downloadQueue.filter((item) => ["queued", "downloading"].includes(item.status)).length,
    completed: state.downloadQueue.filter((item) => item.status === "done").length,
    failed: state.downloadQueue.filter((item) => item.status === "failed").length,
    currentTitle: next.track.title || "Song"
  };
  saveDownloadQueue();
  try {
    await cacheTrackOffline(next.track, { silent: true });
    if (isOfflineCached(next.track.id)) {
      next.status = "done";
      next.error = "";
    } else {
      next.status = "failed";
      next.error = downloadFailure(next.track.id) || "Download failed.";
    }
  } catch (error) {
    next.status = "failed";
    next.error = error.message || "Download failed.";
  } finally {
    next.updatedAt = new Date().toISOString();
    state.downloadProcessing = false;
    saveDownloadQueue();
    refreshVisibleDataAfterMutation();
    window.setTimeout(() => processDownloadQueue(), 250);
  }
}

function renderDownloadManager() {
  if (!els.downloadManagerStatus || !els.downloadManagerList) return;
  const queued = state.downloadQueue.filter((item) => item.status === "queued").length;
  const active = state.downloadQueue.filter((item) => item.status === "downloading").length;
  const failed = state.downloadQueue.filter((item) => item.status === "failed").length;
  const done = state.downloadQueue.filter((item) => item.status === "done").length;
  els.downloadManagerStatus.textContent = `${queued} queued, ${active} downloading, ${failed} failed, ${done} done${state.downloadPaused ? " - paused" : ""}.`;
  els.downloadManagerPause.disabled = state.downloadPaused || (!queued && !active);
  els.downloadManagerResume.disabled = !state.downloadPaused;
  els.downloadManagerRetryFailed.disabled = !failed;
  els.downloadManagerClearFailed.disabled = !failed;
  const rows = state.downloadQueue.slice(-30).reverse();
  els.downloadManagerList.innerHTML = rows.length ? rows.map((item) => `
    <div class="settings-list-row">
      <div>
        <strong>${escapeText(item.track?.title || "Song")}</strong>
        <small>${escapeText(item.status)} - ${escapeText(item.label || "Download")}${item.error ? ` - ${escapeText(item.error)}` : ""}</small>
      </div>
      <div class="settings-list-actions">
        <button data-download-retry="${escapeText(item.id)}" type="button" ${item.status !== "failed" ? "disabled" : ""}>Retry</button>
        <button data-download-remove="${escapeText(item.id)}" type="button" ${item.status === "downloading" ? "disabled" : ""}>Remove</button>
      </div>
    </div>
  `).join("") : `<p class="status">No downloads queued.</p>`;
}

async function removeTrackOffline(item) {
  if (!item?.id || !window.metro?.cacheRemove) return;
  try {
    const result = await window.metro.cacheRemove(item.id);
    applyOfflineCacheResult(result);
    setDownloadFailure(item.id, null);
    patchTrackState(item.id, { offlineCached: false, cached: false });
    refreshVisibleDataAfterMutation();
    toast(`Removed offline copy: ${item.title || "Track"}`);
  } catch (error) {
    toast(error.message || "Remove offline copy failed.", true);
  }
}

function applyDensity(density, persist = true) {
  const value = ["compact", "comfortable"].includes(density) ? density : "normal";
  state.settings.density = value;
  document.body.classList.toggle("density-compact", value === "compact");
  document.body.classList.toggle("density-comfortable", value === "comfortable");
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
}

function applyLyricsScale(scale, persist = true) {
  const value = Math.max(85, Math.min(145, Number(scale) || DEFAULT_SETTINGS.lyricsScale));
  state.settings.lyricsScale = value;
  document.documentElement.style.setProperty("--lyrics-font-scale", String(value / 100));
  scheduleLyricTokenWrapMeasurement();
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
}

function applyDesktopLyricsOpacity(value, persist = true) {
  const opacity = Math.max(20, Math.min(95, Number(value) || DEFAULT_SETTINGS.desktopLyricsOpacity));
  state.settings.desktopLyricsOpacity = opacity;
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
  syncLyricWidget();
}

function applyDesktopLyricsFont(value, persist = true) {
  state.settings.desktopLyricsFont = ["system", "serif", "mono"].includes(value)
    ? value
    : DEFAULT_SETTINGS.desktopLyricsFont;
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
  syncLyricWidget();
}

function applyLyricsCardTemplate(value, persist = true) {
  state.settings.lyricsCardTemplate = ["auralane", "clean", "poster"].includes(value)
    ? value
    : DEFAULT_SETTINGS.lyricsCardTemplate;
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
}

function applyRightPanelWidth(width, persist = true) {
  const min = 300;
  const max = Math.min(620, Math.max(320, window.innerWidth - 620));
  const nextWidth = Math.round(Math.max(min, Math.min(max, width)));
  state.settings.rightPanelWidth = nextWidth;
  document.documentElement.style.setProperty("--right-panel-width", `${nextWidth}px`);
  if (persist) saveAppearanceSettings();
  syncSettingsControls();
}

function normalizeRgb(rgb) {
  const values = Array.isArray(rgb) ? rgb : DEFAULT_THEME_RGB;
  return DEFAULT_THEME_RGB.map((fallback, index) => {
    const value = Number(values[index]);
    return Math.max(0, Math.min(255, Number.isFinite(value) ? Math.round(value) : fallback));
  });
}

function rgbToHex(rgb) {
  return normalizeRgb(rgb)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .replace(/^/, "#");
}

function mixRgb(rgb, target, amount) {
  const source = normalizeRgb(rgb);
  const destination = normalizeRgb(target);
  const ratio = Math.max(0, Math.min(1, Number(amount) || 0));
  return source.map((value, index) => Math.round(value * (1 - ratio) + destination[index] * ratio));
}

function themeSymbolColor(rgb) {
  const [r, g, b] = normalizeRgb(rgb);
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma > 150 ? "#101014" : "#f5f5f6";
}

function applyThemeColor(rgb, updateNative = true) {
  const color = normalizeRgb(rgb);
  const value = color.join(", ");
  const luma = 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
  const brightenAmount = luma < 165
    ? Math.min(0.58, 0.2 + ((165 - luma) / 165) * 0.5)
    : 0;
  const lyricsAccent = brightenAmount ? mixRgb(color, [255, 255, 255], brightenAmount) : color;
  document.documentElement.style.setProperty("--theme-color", value);
  document.documentElement.style.setProperty("--lyrics-accent-color", lyricsAccent.join(", "));
  document.documentElement.style.setProperty("--lyrics-active-shadow", luma < 125 ? "0.5" : "0.3");
  document.documentElement.style.setProperty("--titlebar-color", value);
  if (!updateNative) return;
  const titlebarRgb = mixRgb(color, [5, 5, 5], 0.68);
  window.metro?.setTitleBarTheme?.({
    color: rgbToHex(titlebarRgb),
    symbolColor: themeSymbolColor(titlebarRgb)
  });
  syncMiniPlayerSoon();
}

function applyThemeMode(mode, persist = true) {
  const nextMode = THEME_PRESETS[mode] ? mode : DEFAULT_SETTINGS.themeMode;
  state.settings.themeMode = nextMode;
  if (nextMode === "auto") {
    extractImageColor(state.currentTrack || "");
  } else {
    applyThemeColor(THEME_PRESETS[nextMode].rgb);
  }
  if (persist) saveAppearanceSettings();
  updateExpandedLyricsBackdrop();
  syncSettingsControls();
}

function loadAppearanceSettings() {
  let shouldPersistSettings = false;
  try {
    const saved = JSON.parse(localStorage.getItem(scopedStorageKey(SETTINGS_KEY)) || "{}");
    const legacyWidth = Number(localStorage.getItem("auralane:rightPanelWidth"));
    const defaults = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    state.settings = {
      ...defaults,
      ...(saved && typeof saved === "object" ? saved : {}),
      lyricsSearchProviders: {
        ...defaults.lyricsSearchProviders,
        ...((saved && typeof saved.lyricsSearchProviders === "object") ? saved.lyricsSearchProviders : {})
      },
      rightPanelWidth: Number.isFinite(legacyWidth) ? legacyWidth : (saved.rightPanelWidth || DEFAULT_SETTINGS.rightPanelWidth)
    };
    if (localStorage.getItem(WEB_FALLBACK_MIGRATION_KEY) !== "1") {
      state.settings.webFallback = false;
      localStorage.setItem(WEB_FALLBACK_MIGRATION_KEY, "1");
      shouldPersistSettings = true;
    }
    if (localStorage.getItem(NETEASE_PRIORITY_MIGRATION_KEY) !== "1") {
      const order = Array.isArray(state.settings.lyricsSourceOrder) ? state.settings.lyricsSourceOrder : [];
      state.settings.lyricsSourceOrder = ["netease", ...order.filter((provider) => provider !== "netease")];
      localStorage.setItem(NETEASE_PRIORITY_MIGRATION_KEY, "1");
      shouldPersistSettings = true;
    }
    if (state.settings.smartQueue) {
      state.settings.smartQueue = false;
      shouldPersistSettings = true;
    }
    state.settings.desktopLyricsOpacity = Math.max(20, Math.min(95, Number(state.settings.desktopLyricsOpacity) || DEFAULT_SETTINGS.desktopLyricsOpacity));
    state.settings.artistShuffleLimit = Math.max(25, Math.min(500, Math.round((Number(state.settings.artistShuffleLimit) || DEFAULT_SETTINGS.artistShuffleLimit) / 25) * 25));
    if (!INTERFACE_LANGUAGES.includes(state.settings.language)) state.settings.language = DEFAULT_SETTINGS.language;
    if (!["system", "serif", "mono"].includes(state.settings.desktopLyricsFont)) state.settings.desktopLyricsFont = DEFAULT_SETTINGS.desktopLyricsFont;
    if (!["auralane", "clean", "poster"].includes(state.settings.lyricsCardTemplate)) state.settings.lyricsCardTemplate = DEFAULT_SETTINGS.lyricsCardTemplate;
    normalizeLyricsSettings();
  } catch {
    state.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    normalizeLyricsSettings();
  }
  state.librarySort = state.settings.libraryDefaultSort || DEFAULT_SETTINGS.libraryDefaultSort;
  applyRightPanelWidth(state.settings.rightPanelWidth, false);
  applyDensity(state.settings.density, false);
  applyLyricsScale(state.settings.lyricsScale, false);
  applyThemeMode(state.settings.themeMode, false);
  applyInterfaceLanguage(state.settings.language, false);
  if (shouldPersistSettings) saveAppearanceSettings();
  syncSettingsControls();
}

function resetAppearanceSettings() {
  state.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  normalizeLyricsSettings();
  applyRightPanelWidth(DEFAULT_SETTINGS.rightPanelWidth, false);
  applyDensity(DEFAULT_SETTINGS.density, false);
  applyLyricsScale(DEFAULT_SETTINGS.lyricsScale, false);
  applyDesktopLyricsOpacity(DEFAULT_SETTINGS.desktopLyricsOpacity, false);
  applyDesktopLyricsFont(DEFAULT_SETTINGS.desktopLyricsFont, false);
  applyCrossfadeSeconds(DEFAULT_SETTINGS.crossfadeSeconds, false);
  applyArtistShuffleLimit(DEFAULT_SETTINGS.artistShuffleLimit, false);
  applyThemeMode(DEFAULT_SETTINGS.themeMode, false);
  applyInterfaceLanguage(DEFAULT_SETTINGS.language, false);
  state.librarySort = DEFAULT_SETTINGS.libraryDefaultSort;
  saveAppearanceSettings();
  toast("Settings reset.");
}

function setPlaybackModeLabel(label) {
  if (els.playbackMode) els.playbackMode.textContent = label;
  renderAudioOutputControl();
  syncMiniPlayerSoon();
}

function usesAudioTimeline() {
  return state.playbackMode !== "embed";
}

function safeAudioContext() {
  try {
    return audioCtx || null;
  } catch {
    return null;
  }
}

function normalizeAudioOutputDeviceId(deviceId) {
  const value = String(deviceId || "").trim();
  return value || "default";
}

function audioOutputSwitchSupported() {
  return Boolean(els.audio && typeof els.audio.setSinkId === "function" && navigator.mediaDevices?.enumerateDevices);
}

function selectedAudioOutputId() {
  return normalizeAudioOutputDeviceId(state.audioOutputDeviceId || state.settings.audioOutputDeviceId || "default");
}

function normalizedAudioOutputDevices(devices = state.audioOutputDevices) {
  const list = [];
  const seen = new Set();
  for (const device of devices || []) {
    if (!device || (device.kind && device.kind !== "audiooutput")) continue;
    const id = normalizeAudioOutputDeviceId(device.deviceId);
    if (seen.has(id)) continue;
    seen.add(id);
    list.push({
      deviceId: id,
      groupId: device.groupId || "",
      kind: "audiooutput",
      label: device.label || ""
    });
  }
  if (!seen.has("default")) {
    list.unshift({ deviceId: "default", groupId: "", kind: "audiooutput", label: "" });
  }
  return list;
}

function audioOutputDeviceLabel(device, index = 0) {
  if (!device) return "System output";
  if (device.label) return device.label;
  if (device.deviceId === "default") return "System output";
  if (device.deviceId === "communications") return "Communications output";
  return `Output device ${index + 1}`;
}

function audioOutputDeviceTypeLabel(device) {
  if (!device) return "Default device";
  if (device.deviceId === "default") return "Default device";
  if (device.deviceId === "communications") return "Communication device";
  return "Audio output";
}

function currentAudioOutputLabel(deviceId = selectedAudioOutputId()) {
  const id = normalizeAudioOutputDeviceId(deviceId);
  const devices = normalizedAudioOutputDevices();
  const index = devices.findIndex((device) => device.deviceId === id);
  if (index >= 0) return audioOutputDeviceLabel(devices[index], index);
  if (id === "default") return "System output";
  if (id === "communications") return "Communications output";
  return "Selected output";
}

function effectivePlaybackOutputLabel() {
  if (state.playbackMode === "embed") return "System output";
  return currentAudioOutputLabel(selectedAudioOutputId());
}

function audioOutputStatusText() {
  if (!audioOutputSwitchSupported()) return "Output device switching is not supported in this Electron build.";
  if (state.audioOutputRefreshing) return "Looking for output devices...";
  if (state.audioOutputError) return state.audioOutputError;
  if (state.playbackMode === "embed") return "YouTube web playback follows the system output device.";
  const context = safeAudioContext();
  if (context && typeof context.setSinkId !== "function" && selectedAudioOutputId() !== "default") {
    return "DSP is active; this Electron build may keep processed audio on the system output.";
  }
  const count = normalizedAudioOutputDevices().length;
  return count === 1 ? "1 output device available." : `${count} output devices available.`;
}

function renderAudioOutputControl() {
  if (!els.audioOutputButton || !els.audioOutputLabel) return;
  const supported = audioOutputSwitchSupported();
  const devices = normalizedAudioOutputDevices();
  const selectedId = selectedAudioOutputId();
  const label = effectivePlaybackOutputLabel();
  els.audioOutputLabel.textContent = supported ? label : "System output";
  els.audioOutputButton.disabled = !supported;
  els.audioOutputButton.classList.toggle("active", state.audioOutputMenuOpen);
  els.audioOutputButton.setAttribute("aria-expanded", String(state.audioOutputMenuOpen));
  els.audioOutputButton.title = supported
    ? `Audio output: ${label}${state.playbackMode === "embed" ? " (web playback follows system output)" : ""}`
    : "Audio output selection is not supported.";

  if (!els.audioOutputList || !els.audioOutputStatus) return;
  if (!supported) {
    els.audioOutputList.innerHTML = `<p class="status">This app build can only use the system output device.</p>`;
    els.audioOutputStatus.textContent = audioOutputStatusText();
    return;
  }

  const hasUnnamedDevice = devices.some((device) => device.deviceId !== "default" && !device.label);
  const rows = devices.map((device, index) => {
    const active = device.deviceId === selectedId;
    return `
      <button class="audio-output-option${active ? " active" : ""}" type="button" role="menuitemradio" aria-checked="${active}" data-audio-output-device="${escapeText(device.deviceId)}">
        <span class="ui-icon icon-audio-output" aria-hidden="true"></span>
        <span>
          <strong>${escapeText(audioOutputDeviceLabel(device, index))}</strong>
          <small>${escapeText(audioOutputDeviceTypeLabel(device))}</small>
        </span>
        <span class="audio-output-check" aria-hidden="true">${active ? "✓" : ""}</span>
      </button>
    `;
  }).join("");
  const permissionButton = hasUnnamedDevice && typeof navigator.mediaDevices?.selectAudioOutput === "function"
    ? `<button class="audio-output-permission" type="button" data-audio-output-prompt>Show device names</button>`
    : "";
  els.audioOutputList.innerHTML = rows || `<p class="status">No output devices found.</p>`;
  if (permissionButton) els.audioOutputList.insertAdjacentHTML("beforeend", permissionButton);
  els.audioOutputStatus.textContent = audioOutputStatusText();
}

function setAudioOutputMenuOpen(open) {
  state.audioOutputMenuOpen = Boolean(open);
  els.audioOutputMenu?.classList.toggle("hidden", !state.audioOutputMenuOpen);
  renderAudioOutputControl();
  if (state.audioOutputMenuOpen) {
    refreshAudioOutputDevices().catch((error) => {
      state.audioOutputError = error?.message || "Could not refresh output devices.";
      renderAudioOutputControl();
    });
  }
}

async function applyAudioOutputDevice(deviceId, options = {}) {
  const {
    persist = true,
    silent = false,
    closeMenu = false,
    render = true
  } = options;
  const nextId = normalizeAudioOutputDeviceId(deviceId);
  if (!audioOutputSwitchSupported()) {
    state.audioOutputError = "Output device switching is not supported in this Electron build.";
    if (render) renderAudioOutputControl();
    return false;
  }

  try {
    const targets = [els.audio, els.lyricsGameAudio].filter((target) => target && typeof target.setSinkId === "function");
    for (const target of targets) {
      if (target.sinkId !== nextId) await target.setSinkId(nextId);
    }
  } catch (error) {
    state.audioOutputError = error?.message || "Could not switch output device.";
    if (render) renderAudioOutputControl();
    if (!silent) toast(state.audioOutputError, true);
    return false;
  }

  let contextError = "";
  const context = safeAudioContext();
  if (context && typeof context.setSinkId === "function") {
    try {
      await context.setSinkId(nextId);
    } catch (error) {
      contextError = error?.message || "DSP output could not switch devices.";
    }
  }

  state.audioOutputDeviceId = nextId;
  state.settings.audioOutputDeviceId = nextId;
  state.audioOutputError = contextError;
  if (persist) saveAppearanceSettings();
  if (closeMenu) {
    state.audioOutputMenuOpen = false;
    els.audioOutputMenu?.classList.add("hidden");
  }
  if (render) renderAudioOutputControl();
  syncMiniPlayerSoon();

  if (!silent) {
    if (contextError) toast(`Audio output selected, but DSP output may still use system output: ${contextError}`, true);
    else toast(`Audio output: ${currentAudioOutputLabel(nextId)}`);
  }
  return !contextError;
}

async function applySelectedAudioOutput(options = {}) {
  if (!audioOutputSwitchSupported()) return false;
  return applyAudioOutputDevice(selectedAudioOutputId(), {
    persist: false,
    silent: true,
    render: false,
    ...options
  });
}

function physicalAudioOutputs(devices = []) {
  return (devices || []).filter((device) => !["default", "communications"].includes(device?.deviceId));
}

function looksLikeHeadsetOutput(device = {}) {
  return /head(phone|set)|airpods?|earbuds?|buds|bluetooth|\u8033\u6a5f|\u85cd\u7259/i.test(String(device.label || ""));
}

async function reconcileHeadsetPlayback(previousDevices, nextDevices, previousSelectedId) {
  const previousPhysical = physicalAudioOutputs(previousDevices);
  const nextPhysical = physicalAudioOutputs(nextDevices);
  const nextIds = new Set(nextPhysical.map((device) => device.deviceId));
  const previousIds = new Set(previousPhysical.map((device) => device.deviceId));
  const removed = previousPhysical.filter((device) => !nextIds.has(device.deviceId));
  const added = nextPhysical.filter((device) => !previousIds.has(device.deviceId));
  const selectedDisconnected = previousSelectedId && !["default", "communications"].includes(previousSelectedId) &&
    !nextIds.has(previousSelectedId);
  const headsetDisconnected = removed.some(looksLikeHeadsetOutput);

  if (!state.headsetAutoPaused && state.playing && state.playbackMode !== "embed" &&
      (selectedDisconnected || headsetDisconnected)) {
    state.headsetAutoPaused = true;
    els.audio.pause();
    toast("Headphones disconnected. Playback paused.");
    return;
  }

  const headsetConnected = added.some(looksLikeHeadsetOutput) ||
    (nextPhysical.length > previousPhysical.length && nextPhysical.length > 0);
  if (state.headsetAutoPaused && !state.playing && state.playbackMode !== "embed" && headsetConnected) {
    try {
      await els.audio.play();
      state.headsetAutoPaused = false;
      toast("Headphones connected. Playback resumed.");
    } catch {
      // Browser playback policies can still require the next user gesture.
    }
  }
}

async function refreshAudioOutputDevices(options = {}) {
  const { apply = false, reconcileHeadset = false } = options;
  if (!audioOutputSwitchSupported()) {
    state.audioOutputDevices = [];
    state.audioOutputError = "";
    renderAudioOutputControl();
    return [];
  }

  state.audioOutputRefreshing = true;
  state.audioOutputError = "";
  renderAudioOutputControl();
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const previousDevices = state.audioOutputDevices;
    const previousSelectedId = selectedAudioOutputId();
    state.audioOutputDevices = normalizedAudioOutputDevices(devices.filter((device) => device.kind === "audiooutput"));
    const savedId = normalizeAudioOutputDeviceId(state.settings.audioOutputDeviceId || state.audioOutputDeviceId);
    const exists = state.audioOutputDevices.some((device) => device.deviceId === savedId);
    state.audioOutputDeviceId = exists ? savedId : "default";
    state.settings.audioOutputDeviceId = state.audioOutputDeviceId;
    if (apply) await applyAudioOutputDevice(state.audioOutputDeviceId, { persist: false, silent: true, render: false });
    if (reconcileHeadset) await reconcileHeadsetPlayback(previousDevices, state.audioOutputDevices, previousSelectedId);
    return state.audioOutputDevices;
  } catch (error) {
    state.audioOutputError = error?.message || "Could not read output devices.";
    return [];
  } finally {
    state.audioOutputRefreshing = false;
    renderAudioOutputControl();
  }
}

async function promptAudioOutputDevicePicker() {
  if (typeof navigator.mediaDevices?.selectAudioOutput !== "function") return;
  try {
    const picked = await navigator.mediaDevices.selectAudioOutput();
    await refreshAudioOutputDevices();
    if (picked?.deviceId) {
      await applyAudioOutputDevice(picked.deviceId, { closeMenu: false });
    }
  } catch (error) {
    if (error?.name !== "AbortError") {
      state.audioOutputError = error?.message || "Could not open output device picker.";
      renderAudioOutputControl();
      toast(state.audioOutputError, true);
    }
  }
}

let miniPlayerSyncTimer = null;
let lastMiniPlayerSyncAt = 0;

function miniPlayerThemeColor() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--theme-color").trim();
  const parts = value.split(",").map((part) => Number(part.trim()));
  return normalizeRgb(parts.length >= 3 ? parts : DEFAULT_THEME_RGB);
}

function miniPlayerLyricsSnapshot() {
  const lines = state.lyrics?.lines || [];
  if (!lines.length) return { current: "", next: "", synced: false };
  const active = state.activeLyricIndex >= 0 ? state.activeLyricIndex : 0;
  return {
    current: lines[active]?.text || lines[0]?.text || "",
    next: lines[active + 1]?.text || "",
    synced: Boolean(state.lyrics?.synced)
  };
}

function miniPlayerStateSnapshot() {
  const track = state.currentTrack || null;
  const duration = Number.isFinite(els.audio.duration)
    ? els.audio.duration
    : Number(track?.lengthSeconds || 0);
  const currentTime = state.playbackMode === "embed" ? 0 : (els.audio.currentTime || 0);
  const queueIndex = currentQueueIndex();
  return {
    track: track ? {
      id: track.id || "",
      title: track.title || "Unknown song",
      artist: allArtistLabel(track, track.subtitle || "YouTube Music"),
      subtitle: track.subtitle || "",
      album: track.album?.title || "",
      thumbnail: track.thumbnail || "",
      playlistId: track.playlistId || "",
      liked: trackIsLiked(track),
      cached: Boolean(isOfflineCached(track.id) || track.offlineCached || track.cached)
    } : null,
    playing: Boolean(state.playing),
    playbackMode: state.playbackMode || "idle",
    playbackLabel: els.playbackMode?.textContent || "Ready",
    currentTime,
    duration: duration || 0,
    canSeek: Boolean(duration && state.playbackMode !== "embed"),
    volume: Number(els.volumeBar?.value ?? els.audio?.volume ?? 1),
    shuffleEnabled: Boolean(state.shuffleEnabled),
    repeatMode: state.repeatMode || "off",
    queueIndex,
    queueCount: state.queue.length,
    hasPrevious: state.queue.length > 0,
    hasNext: !els.nextButton?.disabled,
    themeColor: miniPlayerThemeColor(),
    offlineMode: Boolean(state.settings.offlineMode),
    skin: state.settings.miniSkin || DEFAULT_SETTINGS.miniSkin,
    lyrics: miniPlayerLyricsSnapshot()
  };
}

function setMiniPlayerButtonActive(active) {
  state.miniPlayerActive = Boolean(active);
  if (!els.miniPlayerButton) return;
  els.miniPlayerButton.classList.toggle("active", state.miniPlayerActive);
  const label = state.miniPlayerActive ? "Close mini player" : "Mini player";
  els.miniPlayerButton.setAttribute("aria-label", label);
  els.miniPlayerButton.title = label;
}

async function syncMiniPlayer({ force = false } = {}) {
  if (!window.metro?.updateMiniPlayerState) return;
  if (miniPlayerSyncTimer) {
    clearTimeout(miniPlayerSyncTimer);
    miniPlayerSyncTimer = null;
  }
  lastMiniPlayerSyncAt = Date.now();
  try {
    const result = await window.metro.updateMiniPlayerState(miniPlayerStateSnapshot());
    if (result && Object.prototype.hasOwnProperty.call(result, "active")) {
      setMiniPlayerButtonActive(Boolean(result.active));
    }
  } catch {
    setMiniPlayerButtonActive(false);
  }
}

function syncMiniPlayerSoon() {
  if (!window.metro?.updateMiniPlayerState) return;
  const elapsed = Date.now() - lastMiniPlayerSyncAt;
  if (elapsed >= 220) {
    syncMiniPlayer();
    return;
  }
  if (!miniPlayerSyncTimer) {
    miniPlayerSyncTimer = setTimeout(() => {
      miniPlayerSyncTimer = null;
      syncMiniPlayer();
    }, 220 - elapsed);
  }
}

async function toggleMiniPlayer() {
  if (!window.metro?.toggleMiniPlayer) return;
  try {
    const result = await window.metro.toggleMiniPlayer(miniPlayerStateSnapshot());
    setMiniPlayerButtonActive(Boolean(result?.active));
    if (result?.active) await syncMiniPlayer({ force: true });
  } catch (error) {
    toast(error.message || "Mini player failed.", true);
  }
}

async function handleMiniPlayerCommand(payload = {}) {
  const command = String(payload.command || "");
  if (!command) return;
  if (command === "play-toggle") {
    els.playButton.click();
  } else if (command === "next") {
    els.nextButton.click();
  } else if (command === "previous") {
    els.prevButton.click();
  } else if (command === "seek") {
    const seconds = Number(payload.seconds);
    const duration = Number.isFinite(els.audio.duration) ? els.audio.duration : 0;
    if (Number.isFinite(seconds) && duration && state.playbackMode !== "embed") {
      els.audio.currentTime = Math.max(0, Math.min(duration, seconds));
      updateProgress();
    }
  } else if (command === "volume") {
    const volume = Math.max(0, Math.min(1, Number(payload.volume)));
    if (Number.isFinite(volume)) {
      els.volumeBar.value = String(volume);
      els.audio.volume = volume;
      syncMiniPlayer({ force: true });
    }
  } else if (command === "shuffle") {
    els.shuffleButton.click();
  } else if (command === "repeat") {
    els.repeatButton.click();
  } else if (command === "like") {
    await toggleCurrentTrackLike();
  } else if (command === "restore-main") {
    await window.metro?.showMainWindow?.();
  }
}

function repeatModeLabel(mode = state.repeatMode) {
  if (mode === "one") return "Repeat one";
  if (mode === "all") return "Repeat all";
  return "Repeat off";
}

function currentTrackShareUrl(track = state.currentTrack) {
  if (!track?.id) return "";
  const url = new URL("https://music.youtube.com/watch");
  url.searchParams.set("v", track.id);
  if (track.playlistId) url.searchParams.set("list", track.playlistId);
  return url.toString();
}

function artistShareUrl(artist) {
  const channelId = artistChannelId(artist);
  if (channelId) return `https://music.youtube.com/channel/${encodeURIComponent(channelId)}`;
  if (artist?.browseId) return `https://music.youtube.com/browse/${encodeURIComponent(artist.browseId)}`;
  return "";
}

function setLyricsGameVisual(track, status = "Resolving direct audio...", playing = false) {
  if (els.lyricsGameVisualArt) {
    els.lyricsGameVisualArt.style.backgroundImage = thumbnailBackground(track);
  }
  if (els.lyricsGameVisualTitle) {
    els.lyricsGameVisualTitle.textContent = track?.title || "Game audio";
  }
  if (els.lyricsGameVisualStatus) {
    els.lyricsGameVisualStatus.textContent = status;
  }
  els.lyricsGameVisual?.classList.toggle("is-playing", Boolean(playing));
}

function stopLyricsGameTimer() {
  if (state.lyricFillGameTimer) {
    clearInterval(state.lyricFillGameTimer);
    state.lyricFillGameTimer = null;
  }
}

function stopLyricsGameVideo() {
  state.lyricFillGameAudioToken += 1;
  stopLyricsGameTimer();
  if (els.lyricsGameAudio) {
    try {
      els.lyricsGameAudio.pause();
      els.lyricsGameAudio.removeAttribute("src");
      els.lyricsGameAudio.load();
    } catch {}
  }
  setLyricsGameVisual(null, "Game audio stopped.", false);
}

async function playLyricsGameAudio() {
  if (!els.lyricsGameAudio?.src) return false;
  try {
    await els.lyricsGameAudio.play();
    setLyricsGameVisual(state.lyricFillTrack, "Direct game audio playing.", true);
    return true;
  } catch {
    setLyricsGameVisual(state.lyricFillTrack, "Tap the cover to start direct game audio.", false);
    return false;
  }
}

function lyricsGameAudioFallbackStatus(errorOrReason) {
  const message = playbackFailureMessage(errorOrReason);
  if (/Direct audio is unavailable/i.test(message)) {
    return "Direct game audio is unavailable for this song or login state. Continuing lyrics-only.";
  }
  return "Direct game audio failed. Continuing lyrics-only.";
}

async function startLyricsGameAudio(track) {
  const videoId = track?.id || track?.videoId;
  const token = state.lyricFillGameAudioToken;
  const finishResolving = (audioUnavailable = false) => {
    if (token !== state.lyricFillGameAudioToken || !state.lyricFillGame) return;
    state.lyricFillGame.audioResolving = false;
    state.lyricFillGame.audioUnavailable = Boolean(audioUnavailable);
    state.lyricFillGame.lastLineAdvanceAt = Date.now();
  };
  setLyricsGameVisual(track, videoId ? "Resolving direct game audio..." : "No audio id for this song.", false);
  if (!videoId || !els.lyricsGameAudio) {
    finishResolving(true);
    return;
  }
  try {
    const cached = cachedPlaybackStream(videoId);
    const playback = cached || await window.metro.playback({ videoId, playlistId: track.playlistId || null });
    if (token !== state.lyricFillGameAudioToken) return;
    if (playback?.details?.lengthSeconds) track.lengthSeconds = playback.details.lengthSeconds;
    if (playback?.details?.author) {
      track.uploader = playback.details.author;
      if (!track.artist && !track.artists?.length) track.artist = playback.details.author;
    }
    if (!playback?.streamUrl || playback?.mode === "webview") {
      setLyricsGameVisual(track, lyricsGameAudioFallbackStatus(playback?.reason), false);
      finishResolving(true);
      return;
    }
    rememberPlaybackStream(videoId, playback);
    els.lyricsGameAudio.crossOrigin = "anonymous";
    els.lyricsGameAudio.src = playback.streamUrl;
    els.lyricsGameAudio.volume = els.audio?.volume ?? 1;
    if (state.lyricFillGame && state.lyricFillGame.lineCursor > 0) {
      state.lyricFillGame.lineCursor = 0;
      state.lyricFillGame.lineCursorEnteredAt = Date.now();
      syncLyricsGameGapToCursor(state.lyricFillGame);
      renderLyricsGamePlay();
    }
    const playPromise = playLyricsGameAudio();
    await applySelectedAudioOutput();
    await playPromise;
    finishResolving(false);
  } catch (error) {
    if (token !== state.lyricFillGameAudioToken) return;
    setLyricsGameVisual(track, lyricsGameAudioFallbackStatus(error), false);
    finishResolving(true);
  }
}

async function primeLyricsGameAudio(track) {
  const videoId = track?.id || track?.videoId;
  if (!videoId || cachedPlaybackStream(videoId)) return;
  try {
    const playback = await window.metro.playback({ videoId, playlistId: track.playlistId || null });
    if (playback?.streamUrl && playback?.mode !== "webview") {
      rememberPlaybackStream(videoId, playback);
    }
  } catch (error) {
    if (state.settings.debugLogs) console.warn("Lyrics game audio prime failed", error);
  }
}

function trackIsLiked(track) {
  if (!track?.id) return false;
  if (state.likedStateHydrated) return state.likedTrackIds.has(track.id);
  if (track.liked === true) return true;
  if (track.liked === false) return false;
  if (likedRawTracks().some((item) => item.id === track.id)) return true;
  if ((state.libraryData?.songs || []).some((item) => item.id === track.id)) return true;
  return false;
}

function renderCurrentTrackActions() {
  const track = state.currentTrack;
  const hasTrack = Boolean(track?.id);
  if (els.likeButton) {
    const liked = trackIsLiked(track);
    const canSync = Boolean(state.auth?.signedIn);
    const label = !canSync
      ? interfaceText("player.signInLike")
      : liked
        ? interfaceText("player.unlike")
        : interfaceText("player.like");
    els.likeButton.disabled = !hasTrack || !canSync;
    els.likeButton.classList.toggle("active", liked);
    els.likeButton.classList.toggle("liked", liked);
    els.likeButton.setAttribute("aria-label", label);
    els.likeButton.title = label;
  }
  if (els.shareButton) {
    els.shareButton.disabled = !hasTrack;
    els.shareButton.setAttribute("aria-label", hasTrack ? interfaceText("player.share") : interfaceText("player.noShare"));
    els.shareButton.title = hasTrack ? interfaceText("player.share") : interfaceText("player.noShare");
  }
  if (els.currentDownloadButton) {
    const downloaded = isOfflineCached(track?.id) || track?.offlineCached || track?.cached;
    const pending = state.offlineCachePending.has(track?.id);
    const failed = Boolean(downloadFailure(track?.id));
    const label = !hasTrack
      ? "No song to download"
      : pending
        ? "Downloading current song"
        : failed
          ? "Retry current song download"
          : downloaded
            ? "Remove current song download"
            : "Download current song";
    els.currentDownloadButton.disabled = !hasTrack || pending;
    els.currentDownloadButton.classList.toggle("downloaded", Boolean(downloaded));
    els.currentDownloadButton.classList.toggle("pending", Boolean(pending));
    els.currentDownloadButton.classList.toggle("failed", Boolean(failed));
    els.currentDownloadButton.setAttribute("aria-label", label);
    els.currentDownloadButton.title = label;
    els.currentDownloadButton.innerHTML = downloadStateHtml(track);
  }
}

function offlinePlayableTracks(tracks = []) {
  return uniqueTracks((tracks || [])
    .filter((track) => isTrackItem(track) && (isOfflineCached(track.id) || track.offlineCached || track.cached))
    .map((track) => ({ ...track, offlineOnly: true, offlineCached: true, cached: true })));
}

function renderPlaybackOptions() {
  const shuffleLabel = state.shuffleEnabled ? "Shuffle on" : "Shuffle off";
  els.shuffleButton.classList.toggle("active", state.shuffleEnabled);
  els.shuffleButton.setAttribute("aria-label", shuffleLabel);
  els.shuffleButton.title = shuffleLabel;

  const repeatLabel = repeatModeLabel();
  els.repeatButton.classList.toggle("active", state.repeatMode !== "off");
  els.repeatButton.classList.toggle("repeat-one", state.repeatMode === "one");
  els.repeatButton.setAttribute("aria-label", repeatLabel);
  els.repeatButton.title = repeatLabel;
  els.repeatButton.innerHTML = standardIconSvg(state.repeatMode === "one" ? "repeat-one" : "repeat");

  const current = currentQueueIndex();
  const hasNext = state.queue.length > 0 &&
    (state.repeatMode === "all" || (state.shuffleEnabled ? state.queue.length > 1 : current < state.queue.length - 1) || Boolean(state.queueSource?.continuations?.length) || canAppendSmartQueue());
  els.prevButton.disabled = !state.queue.length;
  els.nextButton.disabled = !hasNext;

  if (els.queueLockButton) {
    const lockLabel = state.settings.queueLock ? "Queue lock on" : "Queue lock off";
    els.queueLockButton.classList.toggle("active", Boolean(state.settings.queueLock));
    els.queueLockButton.setAttribute("aria-label", lockLabel);
    els.queueLockButton.title = lockLabel;
  }
  if (els.queueFollowButton) {
    const followLabel = state.settings.queueFollowPlaying ? "Following playing song" : "Follow playing song";
    els.queueFollowButton.classList.toggle("active", Boolean(state.settings.queueFollowPlaying));
    els.queueFollowButton.setAttribute("aria-label", followLabel);
    els.queueFollowButton.title = followLabel;
  }
  updateCollectionFollowButtons();

  renderCurrentTrackActions();
  syncMiniPlayerSoon();
}

function authStorageId(auth = state.auth) {
  const account = auth?.account || {};
  const raw = account.email || account.channelHandle || account.name || (auth?.signedIn ? "signed-in" : "guest");
  const normalized = String(raw || "guest").toLowerCase();
  const ascii = normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
  if (ascii) return ascii;
  const unicodeId = [...normalized].map((character) => character.codePointAt(0).toString(36)).join("-").slice(0, 48);
  return unicodeId ? `id-${unicodeId}` : "guest";
}

function withoutAccountTrackState(track = {}) {
  const {
    liked,
    likeStatus,
    inLibrary,
    libraryAddToken,
    libraryRemoveToken,
    feedbackTokens,
    ...guestTrack
  } = track || {};
  return guestTrack;
}

function resetAccountScopedState() {
  state.syncContextVersion += 1;
  state.syncOutboxProcessing = false;
  state.playbackRequestId += 1;
  try {
    els.audio.pause();
    els.audio.removeAttribute("src");
    els.audio.load();
  } catch {}
  stopEmbedPlayer();
  state.playbackStreams.clear();
  state.playing = false;
  state.playbackMode = "idle";
  state.likedData = null;
  state.likedTrackIds.clear();
  state.likedRemovalTombstones.clear();
  state.likedRemovalTombstonesHydrated = false;
  state.likedStateHydrated = false;
  state.libraryData = null;
  state.playlistsData = null;
  state.historyData = null;
  state.likedSelectedIds.clear();
  if (state.queueHydrated) {
    state.queue = state.queue.map(withoutAccountTrackState);
    if (state.currentTrack) state.currentTrack = withoutAccountTrackState(state.currentTrack);
    window.metro?.setQueue?.(state.queue).catch(() => {});
  }
  state.syncState = {
    liked: { status: "local", updatedAt: "", pending: 0, error: "" },
    playlists: { status: "local", updatedAt: "", pending: 0, error: "" }
  };
  loadAppearanceSettings();
  loadQueueMemory();
  loadSyncOutbox();
  loadDownloadQueue();
  renderQueue();
  renderNow();
  renderSyncPanels();
}

function renderAuth(auth) {
  const previousStorageId = authStorageId(state.auth);
  state.auth = auth;
  const storageChanged = previousStorageId !== authStorageId(auth);
  if (storageChanged) resetAccountScopedState();
  if (Array.isArray(auth?.profiles)) state.accountProfiles = auth.profiles;
  const account = auth?.account || {};
  const signedIn = Boolean(auth?.signedIn || account.name || account.email);
  const displayName = account.name || account.email || "Account";
  const loginLabel = signedIn ? displayName : "Sign in";
  const buttonLabel = signedIn ? `Open account: ${displayName}` : "Sign in";

  els.loginLabel.textContent = loginLabel;
  els.loginButton.classList.toggle("signed-in", signedIn);
  els.loginButton.setAttribute("aria-label", buttonLabel);
  els.loginButton.title = buttonLabel;
  els.loginAvatar.style.backgroundImage = thumbnailBackground(account.thumbnail);
  els.loginAvatar.textContent = account.thumbnail ? "" : (signedIn ? displayName.trim().charAt(0).toUpperCase() : "");

  els.accountName.textContent = signedIn ? displayName : "Guest";
  els.accountEmail.textContent = account.email || (signedIn ? "Signed in" : "Not signed in");
  els.accountAvatar.style.backgroundImage = thumbnailBackground(account.thumbnail);
  els.accountAvatar.textContent = account.thumbnail ? "" : (signedIn ? displayName.trim().charAt(0).toUpperCase() : "");
  els.accountLogin.textContent = signedIn ? "Switch account" : "Sign in with Google";
  els.logoutButton.disabled = !signedIn;
  if (els.accountSaveProfileButton) els.accountSaveProfileButton.disabled = !signedIn;
  renderAccountProfiles();
  renderCurrentTrackActions();
  if (signedIn && !state.likedStateHydrated) {
    queueMicrotask(() => hydrateLikedSongsInBackground());
  }
  return storageChanged;
}

function formatAccountProfileTime(value) {
  if (!value) return "Never used";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderAccountProfiles(profiles = state.accountProfiles) {
  if (!els.accountProfilesList) return;
  const items = Array.isArray(profiles) ? profiles : [];
  state.accountProfiles = items;
  renderAccountSwitcher(items);
  if (!items.length) {
    els.accountProfilesList.innerHTML = `<p class="status">No saved accounts yet.</p>`;
    return;
  }
  els.accountProfilesList.innerHTML = items.map((profile) => {
    const name = profile.name || profile.email || "Saved account";
    const subtitle = [profile.email, profile.channelHandle].filter(Boolean).join(" - ") || "YouTube Music account";
    return `
      <div class="account-profile-row ${profile.active ? "active" : ""}" data-profile-id="${escapeText(profile.id)}">
        <span class="account-profile-avatar" style="background-image:${thumbnailStyle(profile.thumbnail || "")}">
          ${profile.thumbnail ? "" : escapeText(name.trim().charAt(0).toUpperCase())}
        </span>
        <div class="account-profile-main">
          <strong>${escapeText(name)}</strong>
          <small>${escapeText(subtitle)}</small>
          <small>${escapeText(profile.active ? "Current account" : `Last used ${formatAccountProfileTime(profile.lastUsedAt || profile.savedAt)}`)}</small>
        </div>
        <div class="account-profile-actions">
          <button class="secondary" data-account-switch="${escapeText(profile.id)}" type="button" ${profile.active ? "disabled" : ""}>Switch</button>
          <button class="secondary danger" data-account-delete="${escapeText(profile.id)}" type="button">Remove</button>
        </div>
      </div>
    `;
  }).join("");
}

function setAccountSwitcherOpen(open) {
  if (!els.accountSwitcher || !els.loginButton) return;
  const visible = Boolean(open);
  els.accountSwitcher.classList.toggle("hidden", !visible);
  els.loginButton.setAttribute("aria-expanded", String(visible));
}

function renderAccountSwitcher(profiles = state.accountProfiles) {
  if (!els.accountSwitcherList) return;
  const items = Array.isArray(profiles) ? profiles : [];
  if (els.accountSwitcherCount) els.accountSwitcherCount.textContent = String(items.length);
  if (!items.length) {
    els.accountSwitcherList.innerHTML = `<p class="account-switcher-empty">${escapeText(componentText("No saved accounts yet."))}</p>`;
    return;
  }
  els.accountSwitcherList.innerHTML = items.map((profile) => {
    const name = profile.name || profile.email || componentText("Saved account");
    const subtitle = profile.email || profile.channelHandle || componentText("YouTube Music account");
    return `
      <button class="account-switcher-row ${profile.active ? "active" : ""}" data-quick-account-switch="${escapeText(profile.id)}" type="button" ${profile.active ? "disabled" : ""}>
        <span class="account-switcher-avatar" style="background-image:${thumbnailStyle(profile.thumbnail || "")}">${profile.thumbnail ? "" : escapeText(name.trim().charAt(0).toUpperCase())}</span>
        <span class="account-switcher-copy">
          <strong>${escapeText(name)}</strong>
          <small>${escapeText(profile.active ? componentText("Current account") : subtitle)}</small>
        </span>
        <span class="account-switcher-state" aria-hidden="true">${profile.active ? standardIconSvg("check") : ""}</span>
      </button>
    `;
  }).join("");
}

async function activateAccountProfile(profileId, trigger) {
  if (!profileId || !window.metro?.switchAccountProfile) return;
  const originalLabel = trigger?.textContent || "";
  if (trigger) {
    trigger.disabled = true;
    if (trigger.matches("[data-account-switch]")) trigger.textContent = componentText("Switching...");
  }
  setAccountSwitcherOpen(false);
  try {
    const auth = await window.metro.switchAccountProfile(profileId);
    renderAuth(auth);
    state.homeLoaded = false;
    state.likedData = null;
    state.libraryData = null;
    state.playlistsData = null;
    state.historyData = null;
    await loadHome();
    toast(componentText("Account switched."));
  } catch (error) {
    toast(error.message || componentText("Account profile action failed."), true);
    await refreshAccountProfiles();
    if (trigger) {
      trigger.disabled = false;
      if (originalLabel) trigger.textContent = originalLabel;
    }
  }
}

async function refreshAccountProfiles() {
  if (!window.metro?.accountProfiles) return;
  try {
    renderAccountProfiles(await window.metro.accountProfiles());
  } catch (error) {
    toast(error.message || "Account profiles failed.", true);
  }
}

function browseItemKey(item = {}) {
  return [item.browseId || item.id || "", item.params || "", item.type || item.kind || ""].join("::");
}

function cardsHtml(items, type = "track") {
  return items.map((item, index) => `
    <button class="card ${state.currentTrack?.id === item.id ? "active" : ""}" data-type="${escapeText(item.type || type)}" data-index="${index}" data-item-key="${escapeText(browseItemKey(item))}" ${isTrackItem(item) ? `data-track-id="${escapeText(item.id || "")}"` : ""} type="button">
      <span class="thumb" style="background-image:${thumbnailStyle(item)}">
        <span class="card-play" data-playback-indicator aria-hidden="true"><span>${standardIconSvg(state.currentTrack?.id === item.id && state.playing ? "pause" : "play")}</span></span>
        ${moreTriggerHtml("card-more")}
      </span>
      <span class="title">${escapeText(item.title)}</span>
      <span class="subtitle">${escapeText(item.subtitle)}</span>
    </button>
  `).join("");
}

function itemFromIndexedElement(element, items = []) {
  const key = element?.dataset?.itemKey || "";
  if (key) {
    const exact = items.find((item) => browseItemKey(item) === key);
    if (exact) return exact;
  }
  return items[Number(element?.dataset?.index)] || null;
}

function moreTriggerHtml(className = "", label = "More actions") {
  return `<span class="item-more unified-more-trigger ${className}" data-more-trigger role="button" tabindex="0" aria-label="${escapeText(label)}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg></span>`;
}

function downloadStateHtml(item) {
  const downloaded = isOfflineCached(item?.id) || item?.offlineCached || item?.cached;
  const pending = state.offlineCachePending.has(item?.id);
  const failed = Boolean(downloadFailure(item?.id));
  if (pending) return `<span class="download-state pending-state" aria-hidden="true"></span>`;
  if (failed) return `<span class="download-state failed-state" aria-hidden="true">!</span>`;
  if (downloaded) return `<span class="download-state check-state" aria-hidden="true">&#10003;</span>`;
  return `<span class="download-state offline-state" aria-hidden="true"></span>`;
}

function downloadTriggerHtml(item) {
  if (!isTrackItem(item)) return `<span></span>`;
  const downloaded = isOfflineCached(item.id) || item.offlineCached || item.cached;
  const pending = state.offlineCachePending.has(item.id);
  const failed = Boolean(downloadFailure(item.id));
  const label = pending
    ? `Downloading ${item.title || "song"}`
    : failed
      ? `Retry offline download for ${item.title || "song"}`
      : downloaded
        ? `Remove offline copy of ${item.title || "song"}`
        : `Save ${item.title || "song"} offline`;
  return `
    <span
      class="row-download ${downloaded ? "downloaded" : ""} ${pending ? "pending" : ""} ${failed ? "failed" : ""}"
      data-download-trigger
      role="button"
      tabindex="0"
      aria-label="${escapeText(label)}"
      title="${escapeText(label)}"
    >${downloadStateHtml(item)}</span>
  `;
}

function trackRowDetail(item, detailLabel) {
  const label = typeof detailLabel === "function" ? detailLabel(item) : detailLabel;
  return [item?.duration || item?.durationText || "", label || ""].filter(Boolean).join(" · ");
}

function unifiedTrackRowsHtml(items, options = {}) {
  const {
    selectable = false,
    detailLabel = "Song",
    rowClass = "",
    playDataName = "track-play",
    showMore = true,
    showDownload = true,
    hostAttributes = () => ""
  } = options;
  return (items || []).map((item, index) => {
    const selected = selectable && state.likedSelectedIds.has(item.id);
    const active = state.currentTrack?.id === item.id;
    const playAttribute = `data-${playDataName}="${index}"`;
    return `
      <div class="row downloaded-row liked-row collection-track-row unified-track-row ${rowClass} ${active ? "active" : ""}" data-index="${index}" data-track-id="${escapeText(item.id || "")}" ${hostAttributes(item, index)}>
        ${selectable ? `<label class="liked-select" aria-label="Select ${escapeText(item.title)}">
          <input type="checkbox" data-liked-select="${index}" ${selected ? "checked" : ""}>
        </label>` : ""}
        <button class="liked-main" ${playAttribute} type="button">
          <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
          <span>
            <span class="title">${escapeText(item.title)}</span>
            <span class="subtitle">${escapeText(item.subtitle || item.artist || "YouTube Music")}</span>
            <span class="downloaded-detail">${escapeText(trackRowDetail(item, detailLabel))}</span>
          </span>
        </button>
        ${showMore ? moreTriggerHtml("row-more") : `<span aria-hidden="true"></span>`}
        ${showDownload ? downloadTriggerHtml(item) : `<span aria-hidden="true"></span>`}
        <button class="row-play" ${playAttribute} data-playback-indicator type="button" aria-label="${active && state.playing ? "Pause" : "Play"} ${escapeText(item.title || "song")}"><span>${standardIconSvg(active && state.playing ? "pause" : "play")}</span></button>
      </div>
    `;
  }).join("");
}

function rowsHtml(items) {
  return unifiedTrackRowsHtml(items, { selectable: false, detailLabel: "Song" });
}

function renderCards(container, items, type = "track") {
  if (!items.length) {
    container.innerHTML = `<p class="status">No items loaded.</p>`;
    return;
  }
  container.innerHTML = cardsHtml(items, type);
  container._items = items;
}

function renderRows(container, items) {
  if (!items.length) {
    container.innerHTML = `<p class="status">No songs loaded.</p>`;
    return;
  }
  container.innerHTML = rowsHtml(items);
  container._items = items;
}

function uniqueBrowseItems(items) {
  const indexByKey = new Map();
  const unique = [];
  for (const item of items || []) {
    const key = `${item.browseId || item.id}:${item.params || ""}`;
    if (!indexByKey.has(key)) {
      indexByKey.set(key, unique.length);
      unique.push(item);
      continue;
    }
    const index = indexByKey.get(key);
    const current = unique[index] || {};
    unique[index] = {
      ...item,
      ...current,
      thumbnail: normalizeThumbnailUrl(item.thumbnail) || normalizeThumbnailUrl(current.thumbnail),
      background: normalizeThumbnailUrl(item.background) || normalizeThumbnailUrl(current.background)
    };
  }
  return unique;
}

function uniqueTracks(items) {
  const indexById = new Map();
  const unique = [];
  for (const item of items || []) {
    if (!item?.id) continue;
    if (!indexById.has(item.id)) {
      indexById.set(item.id, unique.length);
      unique.push(item);
      continue;
    }
    const index = indexById.get(item.id);
    const current = unique[index] || {};
    unique[index] = {
      ...item,
      ...current,
      thumbnail: normalizeThumbnailUrl(item.thumbnail) || normalizeThumbnailUrl(current.thumbnail),
      artists: current.artists?.length ? current.artists : item.artists
    };
  }
  return unique;
}

function asPageResult(result, fallback = {}) {
  if (Array.isArray(result)) {
    return {
      header: fallback,
      tracks: result,
      items: [],
      playlists: [],
      sections: [],
      continuations: []
    };
  }
  return {
    header: result?.header || fallback,
    tracks: result?.tracks || [],
    items: result?.items || [],
    playlists: result?.playlists || [],
    sections: result?.sections || [],
    continuations: result?.continuations || [],
    chips: result?.chips || [],
    relatedArtists: result?.relatedArtists || [],
    pagesLoaded: result?.pagesLoaded,
    meta: result?.meta || {}
  };
}

function renderDiscovery(container, result) {
  result = asPageResult(result);
  const tracks = result?.tracks || [];
  const browseItems = uniqueBrowseItems([...(result?.items || []), ...(result?.playlists || [])]);

  if (!tracks.length && !browseItems.length) {
    container.innerHTML = `<p class="status">No items loaded.</p>`;
    return;
  }

  container.innerHTML = `
    ${tracks.length ? `
      <div class="subsection">
        <h3>Songs and videos</h3>
        <div class="rows discovery-tracks">${rowsHtml(tracks)}</div>
      </div>
    ` : ""}
    ${browseItems.length ? `
      <div class="subsection">
        <h3>Albums, playlists and categories</h3>
        <div class="cards discovery-items">${cardsHtml(browseItems, "browse")}</div>
      </div>
    ` : ""}
  `;

  const rows = container.querySelector(".discovery-tracks");
  if (rows) {
    rows._items = tracks;
    rows._queueSource = queueSourceFromResult(result, result.header || {}, result.header?.type || "browse");
  }
  const cards = container.querySelector(".discovery-items");
  if (cards) {
    cards._items = browseItems;
    cards._queueSource = queueSourceFromResult(result, result.header || {}, result.header?.type || "browse");
  }
}

function renderSearchTabs(activeFilter = state.searchFilter) {
  els.searchTabs.innerHTML = SEARCH_TABS.map((tab) => `
    <button class="chip ${tab.id === activeFilter ? "active" : ""}" data-search-filter="${tab.id}" type="button">
      ${escapeText(tab.label)}
    </button>
  `).join("");
}

function searchTabLabel(filter = state.searchFilter) {
  return SEARCH_TABS.find((tab) => tab.id === filter)?.label || "Top";
}

function renderSearchFilterControls() {
  for (const button of els.searchFilterBar?.querySelectorAll("[data-search-option]") || []) {
    const key = button.dataset.searchOption;
    const active = Boolean(state.searchFilters[key]);
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

function searchFilterText(item) {
  return `${item?.title || ""} ${item?.subtitle || ""} ${item?.artist || ""} ${item?.type || ""}`.toLowerCase();
}

function itemDurationSeconds(item) {
  return Number(item?.lengthSeconds || 0) || durationSeconds(item?.duration);
}

function isRecentSearchItem(item) {
  const currentYear = new Date().getFullYear();
  const text = searchFilterText(item);
  const explicitYear = Number(item?.year || item?.releaseYear || 0);
  if (explicitYear) return explicitYear >= currentYear - 1;
  return text.includes(String(currentYear)) || text.includes(String(currentYear - 1));
}

function searchFilterMatches(item) {
  const filters = state.searchFilters;
  const text = searchFilterText(item);
  if (filters.officialAudio && (item?.type === "video" || /\b(video|mv|music video|live|karaoke|cover)\b/i.test(text))) return false;
  if (filters.videosOnly && item?.type !== "video" && !/\b(video|mv|music video)\b/i.test(text)) return false;
  if (filters.longDuration && itemDurationSeconds(item) < 300) return false;
  if (filters.recent && !isRecentSearchItem(item)) return false;
  return true;
}

function applySearchFilters(items) {
  const active = Object.values(state.searchFilters).some(Boolean);
  if (!active) return items || [];
  return (items || []).filter(searchFilterMatches);
}

function hideSearchSuggestions() {
  clearTimeout(state.searchSuggestTimer);
  state.searchSuggestRequest += 1;
  els.searchSuggestions.classList.add("hidden");
  els.searchSuggestions.innerHTML = "";
}

function renderSearchSuggestions(suggestions, query) {
  const items = (suggestions || [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 8);

  if (!query || !items.length) {
    hideSearchSuggestions();
    return;
  }

  els.searchSuggestions.innerHTML = items.map((item, index) => `
    <button class="search-suggestion" data-search-suggestion="${index}" type="button" role="option">
      <span>${escapeText(item)}</span>
      <small>Search</small>
    </button>
  `).join("");
  els.searchSuggestions._items = items;
  els.searchSuggestions.classList.remove("hidden");
}

function queueSearchSuggestions() {
  hideRecognitionHistory();
  clearTimeout(state.searchSuggestTimer);
  const query = els.searchInput.value.trim();
  if (query.length < 2) {
    hideSearchSuggestions();
    return;
  }

  const requestId = state.searchSuggestRequest + 1;
  state.searchSuggestRequest = requestId;
  state.searchSuggestTimer = setTimeout(async () => {
    try {
      const suggestions = await window.metro.searchSuggestions(query);
      if (requestId !== state.searchSuggestRequest || els.searchInput.value.trim() !== query) return;
      renderSearchSuggestions(suggestions, query);
    } catch {
      if (requestId === state.searchSuggestRequest) hideSearchSuggestions();
    }
  }, 180);
}

let cancelMusicRecognitionCapture = null;
let musicRecognitionHistory = [];

function hideRecognitionHistory() {
  els.recognitionHistoryPanel?.classList.add("hidden");
  els.recognitionHistoryButton?.classList.remove("active");
}

function recognitionTimeLabel(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function renderRecognitionHistory() {
  if (!els.recognitionHistoryPanel) return;
  const items = musicRecognitionHistory || [];
  els.recognitionHistoryPanel.innerHTML = `
    <div class="recognition-history-head">
      <strong>Recognition history</strong>
      ${items.length ? `<button type="button" data-recognition-clear>Clear</button>` : ""}
    </div>
    ${items.length ? items.map((item) => `
      <div class="recognition-history-row">
        <button class="recognition-history-main" type="button" data-recognition-search="${escapeText(item.id)}">
          <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
          <span class="recognition-history-copy">
            <strong>${escapeText(item.title || "Unknown song")}</strong>
            <small>${escapeText([item.artist, recognitionTimeLabel(item.recognizedAt)].filter(Boolean).join(" · "))}</small>
          </span>
        </button>
        <button class="recognition-history-remove" type="button" data-recognition-remove="${escapeText(item.id)}" aria-label="Remove from recognition history" title="Remove">×</button>
      </div>
    `).join("") : `<p class="status">Recognized songs will appear here.</p>`}
  `;
}

async function loadRecognitionHistory({ open = false } = {}) {
  musicRecognitionHistory = await window.metro.recognitionHistory();
  renderRecognitionHistory();
  if (open) {
    hideSearchSuggestions();
    els.recognitionHistoryPanel?.classList.remove("hidden");
    els.recognitionHistoryButton?.classList.add("active");
  }
}

async function toggleRecognitionHistory() {
  if (!els.recognitionHistoryPanel) return;
  if (!els.recognitionHistoryPanel.classList.contains("hidden")) {
    hideRecognitionHistory();
    return;
  }
  await loadRecognitionHistory({ open: true });
}

function setMusicRecognitionUi(mode = "idle", detail = "") {
  const button = els.musicRecognizeButton;
  if (!button) return;
  button.classList.toggle("listening", mode === "listening");
  button.classList.toggle("processing", mode === "processing");
  button.setAttribute("aria-pressed", String(mode !== "idle"));
  const label = mode === "listening"
    ? "Stop listening"
    : mode === "processing"
      ? "Identifying song"
      : "Recognize music";
  button.setAttribute("aria-label", label);
  button.title = label;
  button.disabled = mode === "processing";
  const modal = els.musicRecognitionDialog?.querySelector(".recognition-modal");
  modal?.classList.toggle("is-listening", mode === "listening");
  modal?.classList.toggle("is-processing", mode === "processing");
  if (els.recognitionStartButton) {
    const listening = mode === "listening";
    const processing = mode === "processing";
    const dialogLabel = listening ? "Stop listening" : processing ? "Identifying song" : "Start listening";
    els.recognitionStartButton.classList.toggle("is-listening", listening);
    els.recognitionStartButton.classList.toggle("is-processing", processing);
    els.recognitionStartButton.disabled = processing;
    els.recognitionStartButton.setAttribute("aria-label", dialogLabel);
    els.recognitionStartButton.title = dialogLabel;
    const labelElement = els.recognitionStartButton.querySelector(".recognition-start-label");
    const iconElement = els.recognitionStartButton.querySelector(".recognition-start-icon");
    if (labelElement) labelElement.textContent = dialogLabel;
    if (iconElement) iconElement.innerHTML = standardIconSvg(listening ? "close" : processing ? "refresh" : "microphone");
  }
  if (detail) els.globalStatus.textContent = detail;
}

async function recordMusicRecognitionSample(durationMs = 12000, sourceType = state.recognitionSource || "microphone") {
  if (!navigator.mediaDevices) throw new Error("Audio capture is unavailable.");
  const stream = sourceType === "system"
    ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    : await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      video: false
    });
  if (!stream.getAudioTracks().length) {
    for (const track of stream.getTracks()) track.stop();
    throw new Error("No shared system audio was detected. Enable audio sharing in the picker.");
  }
  const audioContext = new AudioContext();
  await audioContext.resume();
  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  const silentOutput = audioContext.createGain();
  silentOutput.gain.value = 0;
  const chunks = [];
  let totalLength = 0;
  let settled = false;

  source.connect(processor);
  processor.connect(silentOutput);
  silentOutput.connect(audioContext.destination);

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      processor.onaudioprocess = null;
      try { source.disconnect(); } catch {}
      try { processor.disconnect(); } catch {}
      try { silentOutput.disconnect(); } catch {}
      for (const track of stream.getTracks()) track.stop();
      audioContext.close().catch(() => {});
      cancelMusicRecognitionCapture = null;
    };
    const finish = (cancelled = false) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanup();
      if (cancelled) {
        const error = new Error("Music recognition cancelled.");
        error.cancelled = true;
        reject(error);
        return;
      }
      const samples = new Float32Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        samples.set(chunk, offset);
        offset += chunk.length;
      }
      resolve({ samples: samples.buffer, sampleRate: audioContext.sampleRate });
    };
    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      const copy = new Float32Array(input.length);
      copy.set(input);
      chunks.push(copy);
      totalLength += copy.length;
    };
    const timer = window.setTimeout(() => finish(false), durationMs);
    cancelMusicRecognitionCapture = () => finish(true);
  });
}

function renderRecognitionCandidates(recognized = null) {
  if (!els.recognitionCandidates) return;
  const cards = state.recognitionCandidates || [];
  els.recognitionCandidates.innerHTML = cards.length ? cards.map((track, index) => `
    <article class="recognition-card" data-recognition-index="${index}" style="--card-index:${index}">
      <span class="recognition-art" style="background-image:${thumbnailStyle(track)}"></span>
      <span class="recognition-card-copy">
        <small class="recognition-rank">${index === 0 ? "Top match" : `Candidate ${index + 1}`}</small>
        <strong>${escapeText(track.title || recognized?.title || "Unknown song")}</strong>
        <small>${escapeText(track.artist || track.subtitle || recognized?.artist || "Unknown artist")}</small>
      </span>
      <button class="artist-play-button recognition-result-play" data-recognition-play="${index}" type="button" aria-label="Play ${escapeText(track.title || recognized?.title || "song")}" title="Play"><span aria-hidden="true">${standardIconSvg("play")}</span></button>
    </article>`).join("") : `<div class="recognition-empty-state"><span class="ui-icon icon-audio" aria-hidden="true">${standardIconSvg("audio")}</span><strong>No playable match yet</strong><small>Try a clearer or slightly longer sample.</small></div>`;
}

async function recognizeMusicFromMicrophone(sourceType = state.recognitionSource) {
  if (cancelMusicRecognitionCapture) {
    cancelMusicRecognitionCapture();
    return;
  }
  hideSearchSuggestions();
  setMusicRecognitionUi("listening", "Listening for music…");
  if (els.recognitionStatus) els.recognitionStatus.textContent = sourceType === "system" ? "Listening to shared system audio…" : "Listening through the microphone…";
  try {
    state.recognitionSource = sourceType;
    const recorded = await recordMusicRecognitionSample(12000, sourceType);
    setMusicRecognitionUi("processing", "Identifying song…");
    if (els.recognitionStatus) els.recognitionStatus.textContent = "Matching several possible results…";
    const result = await window.metro.recognizeMusic({
      ...recorded,
      locale: document.documentElement.lang || "en-US"
    });
    await loadRecognitionHistory();
    const query = [result?.title, result?.artist].filter(Boolean).join(" ").trim();
    if (!query) throw new Error("No matching song found. Try again with clearer audio.");
    els.searchInput.value = query;
    const searchResult = await window.metro.search(query);
    state.recognitionCandidates = uniqueTracks(searchResult?.tracks || []).slice(0, 8);
    renderRecognitionCandidates(result);
    if (els.recognitionStatus) els.recognitionStatus.textContent = `${state.recognitionCandidates.length} possible matches`;
    toast(`Recognized: ${result.title}${result.artist ? ` — ${result.artist}` : ""}`);
  } catch (error) {
    if (!error?.cancelled) {
      const message = error?.name === "NotAllowedError"
        ? "Audio capture permission is required to recognize music."
        : error?.message || "Music recognition failed.";
      toast(message, true);
      if (els.recognitionStatus) els.recognitionStatus.textContent = message;
    }
  } finally {
    setMusicRecognitionUi("idle", "Ready");
  }
}

function topResultItem(result) {
  const tracks = result?.tracks || [];
  const browseItems = uniqueBrowseItems([...(result?.items || []), ...(result?.playlists || [])]);
  const query = normalizeArtistKey(state.searchQuery);
  const exactArtist = browseItems.find((item) =>
    item?.type === "artist" && normalizeArtistKey(item.title) === query
  );
  return exactArtist || browseItems.find((item) => item?.type === "artist") || tracks[0] || browseItems[0] || null;
}

function renderTopResult(item) {
  if (!item) return "";
  if (isTrackItem(item)) {
    return `
      <section class="search-top-result">
        <div class="section-head home-section-head">
          <div><h2>Top result</h2><span class="status">${escapeText(item.type || "track")}</span></div>
        </div>
        <div class="liked-results top-result-track-list">
          ${unifiedTrackRowsHtml([item], {
            detailLabel: "Top result",
            rowClass: "top-result-track",
            hostAttributes: () => `data-search-top-result role="button" tabindex="0"`
          })}
        </div>
      </section>
    `;
  }
  return `
    <section class="search-top-result">
      <div class="section-head home-section-head">
        <div>
          <h2>Top result</h2>
          <span class="status">${escapeText(item.type === "track" ? "Song" : item.type || "YouTube Music")}</span>
        </div>
      </div>
      <div class="top-result-card ${state.currentTrack?.id === item.id ? "active" : ""}" data-search-top-result ${isTrackItem(item) ? `data-track-id="${escapeText(item.id || "")}"` : ""} role="button" tabindex="0">
        <span class="thumb" style="background-image:${thumbnailStyle(item)}">
          <span class="card-play" data-playback-indicator aria-hidden="true"><span>${standardIconSvg(state.currentTrack?.id === item.id && state.playing ? "pause" : "play")}</span></span>
        </span>
        <span class="top-result-copy">
          <strong>${escapeText(item.title)}</strong>
          <small>${escapeText(item.subtitle || item.artist || "YouTube Music")}</small>
        </span>
        ${moreTriggerHtml("row-more")}
        ${isTrackItem(item) ? downloadTriggerHtml(item) : `<span aria-hidden="true"></span>`}
        ${isTrackItem(item) ? `<span class="row-play" data-playback-indicator aria-hidden="true"><span>${standardIconSvg(state.currentTrack?.id === item.id && state.playing ? "pause" : "play")}</span></span>` : `<span aria-hidden="true"></span>`}
      </div>
    </section>
  `;
}

function renderSearchResults(result, filter = state.searchFilter) {
  result = asPageResult(result, { type: "search", title: state.searchQuery || "Search" });
  renderSearchTabs(filter);
  renderSearchFilterControls();
  const allTracks = tracksFromResult(result);
  const allBrowseItems = uniqueBrowseItems([...(result.items || []), ...(result.playlists || [])]);
  const tracks = applySearchFilters(allTracks);
  const browseItems = applySearchFilters(allBrowseItems);
  const filteredResult = { ...result, tracks, items: browseItems, playlists: [] };
  const topItem = filter === "top" ? topResultItem(filteredResult) : null;
  const topItemId = topItem?.id || topItem?.browseId || "";
  const visibleTracks = topItem?.type === "track" ? tracks.filter((item) => item.id !== topItem.id) : tracks;
  const visibleItems = topItem && topItem.type !== "track"
    ? browseItems.filter((item) => `${item.id || item.browseId}` !== `${topItemId}`)
    : browseItems;
  const itemGroups = [
    ["Artists", visibleItems.filter((item) => item.type === "artist")],
    ["Albums", visibleItems.filter((item) => item.type === "album")],
    ["Playlists", visibleItems.filter((item) => item.type === "playlist")],
    ["Podcasts", visibleItems.filter((item) => item.type === "podcast" || item.type === "episode")],
    ["More results", visibleItems.filter((item) => !["artist", "album", "playlist", "podcast", "episode"].includes(item.type))]
  ].filter(([, items]) => items.length);

  if (!topItem && !visibleTracks.length && !visibleItems.length) {
    const refined = Object.values(state.searchFilters).some(Boolean) ? " match these filters" : "";
    els.searchResults.innerHTML = `<p class="status">No ${escapeText(searchTabLabel(filter).toLowerCase())} results${refined}.</p>`;
  } else {
    els.searchResults.innerHTML = `
      ${renderTopResult(topItem)}
      ${visibleTracks.length ? `
        <section class="subsection">
          <div class="section-head home-section-head">
            <div>
              <h2>${filter === "videos" ? "Videos" : "Songs"}</h2>
              <span class="status">${visibleTracks.length} result${visibleTracks.length === 1 ? "" : "s"}</span>
            </div>
          </div>
          <div class="rows search-track-results">${rowsHtml(visibleTracks)}</div>
        </section>
      ` : ""}
      ${itemGroups.map(([label, items], groupIndex) => `
        <section class="subsection">
          <div class="section-head home-section-head">
            <div>
              <h2>${escapeText(label)}</h2>
              <span class="status">${items.length} result${items.length === 1 ? "" : "s"}</span>
            </div>
          </div>
          <div class="cards search-item-results" data-search-group="${groupIndex}">${cardsHtml(items, "browse")}</div>
        </section>
      `).join("")}
    `;
  }

  const topCard = els.searchResults.querySelector("[data-search-top-result]");
  if (topCard) {
    topCard._items = [topItem];
    topCard._queueSource = queueSourceFromResult(result, { title: state.searchQuery || "Search" }, "search");
  }
  const rowContainer = els.searchResults.querySelector(".search-track-results");
  if (rowContainer) {
    rowContainer._items = visibleTracks;
    rowContainer._queueSource = queueSourceFromResult(result, { title: state.searchQuery || "Search" }, "search");
  }
  for (const cardContainer of els.searchResults.querySelectorAll("[data-search-group]")) {
    cardContainer._items = itemGroups[Number(cardContainer.dataset.searchGroup)]?.[1] || [];
    cardContainer._queueSource = queueSourceFromResult(result, { title: state.searchQuery || "Search" }, "search");
  }

  const continuation = result.continuations?.[0] || null;
  els.searchLoadMoreButton.classList.toggle("hidden", !continuation);
  els.searchLoadMoreButton._continuation = continuation;
}

function playableArtistFromTrack(track) {
  const linkedArtist = track?.artists?.find((artist) => artist?.browseId);
  if (linkedArtist) return linkedArtist;
  const label = track?.artist || String(track?.subtitle || "").split(" • ").find((part) => !/^(song|video|album|single|ep|\d+:|\d+\splays?)/i.test(part.trim())) || "";
  return label ? { title: label.trim(), type: "artist" } : null;
}

function allArtistLabel(track, fallback = "") {
  const names = [];
  for (const artist of track?.artists || []) {
    const name = String(artist?.title || artist?.name || "").trim();
    if (name && !names.includes(name)) names.push(name);
  }
  return names.join(", ") || String(track?.artist || fallback || "").trim();
}

function artistActionItem(result, fallback = {}) {
  result = asPageResult(result, fallback);
  const header = result.header || {};
  return {
    id: header.browseId || fallback.browseId || header.channelId || header.title,
    browseId: header.browseId || fallback.browseId || null,
    params: header.params || fallback.params || null,
    type: "artist",
    kind: "artist",
    title: header.title || fallback.title || "Artist",
    subtitle: header.subtitle || fallback.subtitle || "Artist",
    thumbnail: header.thumbnail || fallback.thumbnail || "",
    channelId: header.channelId || null,
    subscribed: header.subscribed === true,
    subscribeParams: header.subscribeParams || "EgIIAhgA",
    radioEndpoint: header.radioEndpoint || null,
    shuffleEndpoint: header.shuffleEndpoint || null
  };
}

function normalizeArtistKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function artistNameParts(value) {
  return String(value || "")
    .split(/\s*(?:,|、|\/|;|\|| feat\.?| ft\.?| featuring | with | x | × | and |&|•)\s*/i)
    .map(normalizeArtistKey)
    .filter((part) => part.length > 1);
}

function artistIdentity(item = {}) {
  const ids = new Set([item.id, item.browseId, item.channelId].filter(Boolean).map((value) => String(value)));
  const names = new Set([
    normalizeArtistKey(item.title),
    normalizeArtistKey(item.name),
    ...artistNameParts(item.subtitle)
  ].filter(Boolean));
  return { ids, names };
}

function trackArtistIdentities(track = {}) {
  const identities = [];
  for (const artist of track.artists || []) {
    identities.push(artistIdentity(artist));
  }
  identities.push({
    ids: new Set(),
    names: new Set([
      ...artistNameParts(track.artist || track.author || ""),
      ...artistNameParts(track.subtitle || "")
    ])
  });
  return identities;
}

function artistMatchesTrack(artist, track) {
  const target = artistIdentity(artist);
  if (!target.ids.size && !target.names.size) return false;
  for (const identity of trackArtistIdentities(track)) {
    for (const id of identity.ids) {
      if (target.ids.has(id)) return true;
    }
    for (const name of identity.names) {
      if (target.names.has(name)) return true;
      for (const targetName of target.names) {
        if (targetName.length >= 4 && (name.includes(targetName) || targetName.includes(name))) return true;
      }
    }
  }
  return false;
}

function downloadedTracksForArtist(artist) {
  return uniqueTracks((state.offlineCache?.tracks || [])
    .filter((track) => artistMatchesTrack(artist, track))
    .map((track) => ({ ...track, offlineCached: true, cached: true })));
}

function downloadedArtistStatus(count) {
  if (!count) return "No downloaded songs from this artist.";
  return `${count} downloaded song${count === 1 ? "" : "s"} available. Shuffle uses downloaded songs first.`;
}

function artistMetaItems(header, tracks, sections, relatedArtists, downloadedCount = 0) {
  return [
    header.monthlyListeners,
    header.subscriberCount,
    tracks.length ? `${tracks.length} track${tracks.length === 1 ? "" : "s"}` : "",
    downloadedCount ? `${downloadedCount} downloaded` : "",
    sections.length ? `${sections.length} section${sections.length === 1 ? "" : "s"}` : "",
    relatedArtists.length ? `${relatedArtists.length} related artist${relatedArtists.length === 1 ? "" : "s"}` : ""
  ].filter(Boolean);
}

function trackFromArtistEndpoint(endpoint, artist) {
  if (!endpoint?.videoId) return null;
  return {
    id: endpoint.videoId,
    videoId: endpoint.videoId,
    playlistId: endpoint.playlistId || null,
    setVideoId: endpoint.playlistSetVideoId || null,
    type: "track",
    kind: "track",
    title: `${artist.title || "Artist"} radio`,
    subtitle: artist.subtitle || "Artist radio",
    artist: artist.title || "",
    artists: artist.browseId ? [artist] : [],
    thumbnail: artist.thumbnail || "",
    duration: ""
  };
}

function setIconButtonLabel(button, label) {
  if (!button) return;
  const text = label || "";
  const hiddenLabel = button.querySelector(".visually-hidden");
  if (hiddenLabel) hiddenLabel.textContent = text;
  const visibleLabel = button.querySelector(".button-label");
  if (visibleLabel) visibleLabel.textContent = text;
  button.setAttribute("aria-label", text);
  button.title = text;
}

function setArtistFollowVisual(subscribed, label = subscribed ? "Following" : "Follow") {
  if (!els.artistFollowButton) return;
  els.artistFollowButton.innerHTML = `${standardIconSvg(subscribed ? "user-check" : "user-plus")}<span class="button-label">${escapeText(label)}</span>`;
  setIconButtonLabel(els.artistFollowButton, label);
}

function artistPopularCollection(result = state.artistResult, fallback = state.artistFallback || {}) {
  const header = result?.header || {};
  if (header.popularBrowseId) {
    return {
      title: header.popularTitle || "Popular songs",
      subtitle: header.subtitle || fallback.subtitle || "Artist",
      browseId: header.popularBrowseId,
      params: header.popularParams || null,
      type: "track",
      thumbnail: header.thumbnail || fallback.thumbnail || ""
    };
  }
  return (result?.sections || []).find((section) =>
    section?.browseId && /song|track|熱門|歌曲/i.test(String(section.title || ""))
  ) || null;
}

function artistPopularQueueKey(item) {
  return item?.browseId ? `${item.browseId}:${item.params || ""}` : "";
}

async function loadArtistPopularQueue(button) {
  const item = button?._popularCollection || artistPopularCollection();
  const key = artistPopularQueueKey(item);
  if (!key || state.settings.offlineMode) {
    return {
      tracks: uniqueTracks(button?._tracks || []),
      source: button?._queueSource || queueSource("artist", state.artistActionItem?.title || "Artist")
    };
  }
  if (state.artistPopularQueue?.key === key && state.artistPopularQueue.tracks?.length) {
    return state.artistPopularQueue;
  }
  if (state.artistPopularQueuePromise?.key === key) return state.artistPopularQueuePromise.promise;

  const promise = (async () => {
    const targetSize = artistShuffleLimit();
    const result = await window.metro.collection({
      browseId: item.browseId,
      params: item.params || null,
      artistItems: true,
      title: item.title || "Popular songs"
    });
    let tracks = tracksFromResult(result);
    let continuations = result?.continuations || [];
    let pagesLoaded = 0;
    while (tracks.length < targetSize && continuations[0]?.token && pagesLoaded < 12) {
      const continuation = continuations[0];
      pagesLoaded += 1;
      const next = await window.metro.continue({
        token: continuation.token,
        endpoint: continuation.endpoint || "browse"
      });
      tracks = uniqueTracks([...tracks, ...tracksFromResult(next)]);
      continuations = next?.continuations || [];
    }
    const queue = {
      key,
      tracks: tracks.slice(0, targetSize),
      source: queueSource("artist", `${state.artistActionItem?.title || item.title || "Artist"} · Popular songs`, continuations)
    };
    state.artistPopularQueue = queue;
    if (artistPopularQueueKey(artistPopularCollection()) === key) {
      for (const actionButton of [els.artistPlayButton, els.artistShuffleButton]) {
        actionButton._tracks = queue.tracks;
        actionButton._queueSource = queue.source;
      }
    }
    return queue;
  })().finally(() => {
    if (state.artistPopularQueuePromise?.key === key) state.artistPopularQueuePromise = null;
  });
  state.artistPopularQueuePromise = { key, promise };
  return promise;
}

function reshuffleArtistTracks(tracks) {
  const shuffled = shuffleTracks(uniqueTracks(tracks || []));
  const currentId = String(state.currentTrack?.id || state.currentTrack?.videoId || "");
  if (shuffled.length > 1 && String(shuffled[0]?.id || shuffled[0]?.videoId || "") === currentId) {
    const replacement = 1 + Math.floor(Math.random() * (shuffled.length - 1));
    [shuffled[0], shuffled[replacement]] = [shuffled[replacement], shuffled[0]];
  }
  return shuffled;
}

function renderArtist(result, fallback = {}) {
  result = asPageResult(result, fallback);
  state.artistResult = result;
  state.artistFallback = fallback;
  const header = result?.header || {};
  const title = header.title || fallback.title || "Artist";
  const subtitle = header.subtitle || fallback.subtitle || "YouTube Music";
  const description = header.description || "";
  const tracks = result?.tracks || [];
  const artistQueueTracks = tracksFromResult(result);
  const sections = (result?.sections || []).filter((section) => (section.tracks || []).length || (section.items || []).length);
  state.artistVisibleSections = sections;
  const hasRelatedArtistSection = sections.some((section) =>
    (section.items || []).some((item) => item?.type === "artist")
  );
  const relatedArtists = hasRelatedArtistSection
    ? []
    : uniqueBrowseItems(result?.relatedArtists || []).slice(0, 10);
  const actionItem = artistActionItem(result, fallback);
  const popularCollection = artistPopularCollection(result, fallback);
  const offlineOnly = Boolean(result?.offlineOnly || fallback.offlineOnly);
  const downloadedTracks = downloadedTracksForArtist(actionItem);
  const offlineArtistTracks = downloadedTracks.length ? downloadedTracks : tracks.map((track) => ({ ...track, offlineCached: true, cached: true }));
  const playTracksSource = offlineOnly ? offlineArtistTracks : tracks;
  const playSource = offlineOnly
    ? queueSource("downloads", `${title} · 已下載`)
    : queueSourceFromResult(result, fallback, "artist");
  const shuffleTracksSource = offlineOnly ? downloadedTracks : artistQueueTracks;
  const shuffleSource = offlineOnly
    ? queueSource("downloads", `${title} · 已下載`)
    : queueSourceFromResult(result, fallback, "artist");
  state.artistActionItem = actionItem;

  els.artistTitle.textContent = title;
  els.artistSubtitle.textContent = subtitle;
  els.artistMeta.innerHTML = artistMetaItems(header, tracks, sections, relatedArtists, downloadedTracks.length).map((item) => `<span>${escapeText(item)}</span>`).join("");
  els.artistDescription.textContent = description;
  els.artistDescription.classList.toggle("hidden", !description);
  els.artistArt.style.backgroundImage = thumbnailBackground(header.thumbnail || fallback.thumbnail);
  els.artistHero.style.backgroundImage = header.background ? `linear-gradient(90deg, rgba(11, 11, 12, 0.95), rgba(11, 11, 12, 0.62)), url('${header.background}')` : "";
  els.artistPlayButton.disabled = !playTracksSource.length;
  els.artistShuffleButton.disabled = !shuffleTracksSource.length && !actionItem.shuffleEndpoint?.videoId;
  els.artistRadioButton.disabled = !tracks.length && !actionItem.radioEndpoint?.videoId;
  els.artistFollowButton.disabled = !actionItem.channelId && !actionItem.browseId;
  els.artistFollowButton.classList.toggle("active", actionItem.subscribed);
  setArtistFollowVisual(actionItem.subscribed, actionItem.subscribed ? "Following" : "Follow");
  els.artistPlayButton._tracks = playTracksSource;
  els.artistShuffleButton._tracks = shuffleTracksSource;
  els.artistPlayButton._popularCollection = popularCollection;
  els.artistShuffleButton._popularCollection = popularCollection;
  els.artistPlayButton._queueSource = offlineOnly ? queueSource("downloads", `${title} Offline`) : playSource;
  els.artistShuffleButton._queueSource = offlineOnly ? queueSource("downloads", `${title} Offline`) : shuffleSource;
  const cachedPopularQueue = state.artistPopularQueue;
  if (!offlineOnly && cachedPopularQueue?.key === artistPopularQueueKey(popularCollection) && cachedPopularQueue.tracks?.length) {
    els.artistPlayButton._tracks = cachedPopularQueue.tracks;
    els.artistShuffleButton._tracks = cachedPopularQueue.tracks;
    els.artistPlayButton._queueSource = cachedPopularQueue.source;
    els.artistShuffleButton._queueSource = cachedPopularQueue.source;
  }
  if (state.settings.offlineMode) {
    els.artistPlayButton._tracks = downloadedTracks;
    els.artistShuffleButton._tracks = downloadedTracks;
    els.artistPlayButton.disabled = !downloadedTracks.length;
    els.artistShuffleButton.disabled = !downloadedTracks.length;
    els.artistPlayButton._queueSource = queueSource("downloads", `${title} · Offline`);
    els.artistShuffleButton._queueSource = els.artistPlayButton._queueSource;
    els.artistPlayButton._queueSource = queueSource("downloads", `${title} Offline`);
    els.artistShuffleButton._queueSource = els.artistPlayButton._queueSource;
  }
  const artistPlayLabel = els.artistPlayButton.querySelector("span:last-child");
  const artistPlayText = offlineOnly ? "Play downloaded songs" : "Play popular songs";
  if (artistPlayLabel) artistPlayLabel.textContent = artistPlayText;
  setIconButtonLabel(els.artistPlayButton, artistPlayText);
  setIconButtonLabel(els.artistShuffleButton, state.settings.offlineMode || offlineOnly ? "Shuffle downloaded" : "Shuffle artist");
  setIconButtonLabel(els.artistRadioButton, "Radio");

  const topSongs = tracks.slice(0, 8);
  const artistSongsSection = popularCollection;
  const showPopularMore = tracks.length > topSongs.length || Boolean(artistSongsSection?.browseId);
  const sectionHtml = sections.map((section, index) => {
    const sectionTracks = section.tracks || [];
    const sectionItems = uniqueBrowseItems(section.items || []);
    const content = sectionTracks.length
      ? `<div class="rows artist-section-items" data-artist-section="${index}">${rowsHtml(sectionTracks.slice(0, 12))}</div>`
      : `<div class="cards artist-section-items artist-cards" data-artist-section="${index}">${cardsHtml(sectionItems.slice(0, 12), "browse")}</div>`;
    return `
      <section class="artist-section">
        <div class="section-head home-section-head">
          <div>
            <h2>${escapeText(section.title || "More")}</h2>
            ${section.subtitle ? `<span class="status">${escapeText(section.subtitle)}</span>` : ""}
          </div>
          ${section.browseId ? `<button class="secondary shelf-more shelf-arrow" data-artist-more="${index}" type="button" aria-label="View all ${escapeText(section.title || "artist items")}" title="View all">${standardIconSvg("arrow-right")}</button>` : ""}
        </div>
        ${content}
      </section>
    `;
  }).join("");

  els.artistResults.innerHTML = `
    ${topSongs.length ? `
      <section class="artist-section">
        <div class="section-head home-section-head">
          <div>
            <h2>Popular songs</h2>
            <span class="status">${topSongs.length} track${topSongs.length === 1 ? "" : "s"}</span>
          </div>
          ${showPopularMore ? `<button class="secondary shelf-more shelf-arrow" data-artist-popular-more type="button" aria-label="View all popular songs" title="View all">${standardIconSvg("arrow-right")}</button>` : ""}
        </div>
        <div class="rows artist-popular">${rowsHtml(topSongs)}</div>
      </section>
    ` : ""}
    ${sectionHtml}
    ${relatedArtists.length ? `
      <section class="artist-section">
        <div class="section-head home-section-head">
          <div>
            <h2>Fans might also like</h2>
            <span class="status">${relatedArtists.length} artist${relatedArtists.length === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div class="cards artist-related">${cardsHtml(relatedArtists, "artist")}</div>
      </section>
    ` : ""}
  `;

  const popular = els.artistResults.querySelector(".artist-popular");
  if (popular) {
    popular._items = topSongs;
    popular._queueSource = queueSourceFromResult(result, fallback, "artist");
  }
  for (const element of els.artistResults.querySelectorAll("[data-artist-section]")) {
    const section = sections[Number(element.dataset.artistSection)];
    element._items = section?.tracks?.length ? section.tracks : uniqueBrowseItems(section?.items || []);
    element._queueSource = queueSource(section?.type || "section", section?.title || header.title || "Artist", section?.continuations || []);
  }
  const related = els.artistResults.querySelector(".artist-related");
  if (related) related._items = relatedArtists;
  els.artistStatus.textContent = tracks.length || sections.length ? "" : "No artist content loaded.";
}

async function loadArtist(item) {
  if (!item?.browseId) return;
  switchView("artist");
  els.artistTitle.textContent = item.title || "Artist";
  els.artistSubtitle.textContent = "Loading artist...";
  els.artistMeta.innerHTML = "";
  els.artistDescription.textContent = "";
  els.artistArt.style.backgroundImage = thumbnailBackground(item);
  els.artistHero.style.backgroundImage = "";
  els.artistFollowButton.disabled = true;
  els.artistRadioButton.disabled = true;
  els.artistShuffleButton.disabled = true;
  els.artistStatus.textContent = "Loading...";
  els.artistResults.innerHTML = skeletonHtml("hero") + skeletonHtml("rows", 6);
  await refreshOfflineCache();
  try {
    const result = await window.metro.artist({
      browseId: item.browseId,
      params: item.params || null
    });
    renderArtist(result, item);
  } catch (error) {
    const offlineTracks = downloadedTracksForArtist(item);
    if (offlineTracks.length) {
      renderArtist({
        offlineOnly: true,
        header: {
          title: item.title || "Artist",
          subtitle: "Offline artist",
          thumbnail: item.thumbnail || "",
          browseId: item.browseId || "",
          channelId: item.channelId || ""
        },
        tracks: offlineTracks,
        sections: [],
        relatedArtists: []
      }, item);
      els.artistStatus.textContent = `Offline mode: ${downloadedArtistStatus(offlineTracks.length)}`;
      toast("Artist failed online; showing downloaded songs.", true);
      return;
    }
    els.artistStatus.textContent = "Artist failed.";
    els.artistResults.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
  }
}

function podcastInfo(result, fallback = {}) {
  const podcast = result?.podcast || {};
  return {
    id: podcast.id || fallback.id || fallback.browseId || "",
    browseId: podcast.browseId || podcast.id || fallback.browseId || "",
    type: "podcast",
    kind: "podcast",
    title: podcast.title || fallback.title || "Podcast",
    subtitle: podcast.author || fallback.subtitle || "Podcast",
    thumbnail: podcast.thumbnail || fallback.thumbnail || "",
    author: podcast.author || fallback.author || ""
  };
}

function podcastEpisodes(data = state.podcastData) {
  return uniqueTracks(data?.episodes || []);
}

function podcastRowsHtml(items) {
  return unifiedTrackRowsHtml(items, {
    detailLabel: (item) => [item.publishDate, "Podcast episode"].filter(Boolean).join(" · ")
  });
}

function renderPodcast(result = state.podcastData, fallback = state.podcastFallback || {}) {
  state.podcastData = result || { episodes: [] };
  state.podcastFallback = fallback || {};
  const info = podcastInfo(state.podcastData, state.podcastFallback);
  const episodes = podcastEpisodes(state.podcastData);

  els.podcastTitle.textContent = info.title;
  els.podcastSubtitle.textContent = info.subtitle || "Podcast";
  els.podcastMeta.innerHTML = [
    "Podcast",
    episodes.length ? `${episodes.length} episode${episodes.length === 1 ? "" : "s"}` : ""
  ].filter(Boolean).map((item) => `<span>${escapeText(item)}</span>`).join("");
  els.podcastArt.style.backgroundImage = thumbnailBackground(info.thumbnail);
  els.podcastPlayButton.disabled = !episodes.length;
  els.podcastShuffleButton.disabled = !episodes.length;
  els.podcastPlayButton._tracks = episodes;
  els.podcastShuffleButton._tracks = episodes;
  els.podcastPlayButton._queueSource = queueSourceFromPodcast(state.podcastData, state.podcastFallback || {});
  els.podcastShuffleButton._queueSource = els.podcastPlayButton._queueSource;

  els.podcastLoadMoreButton.classList.toggle("hidden", !state.podcastData?.continuation);
  els.podcastLoadMoreButton._continuation = state.podcastData?.continuation || null;

  if (!episodes.length) {
    els.podcastStatus.textContent = "No episodes loaded.";
    els.podcastResults.innerHTML = `<p class="status">No podcast episodes found.</p>`;
    return;
  }

  els.podcastStatus.textContent = `${episodes.length} episode${episodes.length === 1 ? "" : "s"} loaded.`;
  els.podcastResults.innerHTML = `
    <section class="podcast-section">
      <div class="section-head compact-head">
        <h2>Episodes</h2>
        <span class="status">${episodes.length} item${episodes.length === 1 ? "" : "s"}</span>
      </div>
      <div class="podcast-rows">${podcastRowsHtml(episodes)}</div>
    </section>
  `;
  const rows = els.podcastResults.querySelector(".podcast-rows");
  if (rows) {
    rows._items = episodes;
    rows._queueSource = queueSourceFromPodcast(state.podcastData, state.podcastFallback || {});
  }
}

async function loadPodcast(item) {
  if (!item?.browseId) return;
  switchView("podcast");
  state.podcastFallback = item;
  els.podcastTitle.textContent = item.title || "Podcast";
  els.podcastSubtitle.textContent = "Loading podcast...";
  els.podcastMeta.innerHTML = "";
  els.podcastArt.style.backgroundImage = thumbnailBackground(item);
  els.podcastPlayButton.disabled = true;
  els.podcastShuffleButton.disabled = true;
  els.podcastLoadMoreButton.classList.add("hidden");
  els.podcastStatus.textContent = "Loading...";
  els.podcastResults.innerHTML = skeletonHtml("rows", 7);
  toast(`Loading podcast: ${item.title || "Podcast"}`);

  try {
    const result = await window.metro.podcast(item.browseId);
    state.podcastData = result || { episodes: [] };
    renderPodcast(state.podcastData, item);
    toast("Podcast loaded.");
  } catch (error) {
    els.podcastStatus.textContent = "Podcast failed.";
    els.podcastResults.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
    toast("Podcast failed.", true);
  }
}

async function loadMorePodcast() {
  const token = els.podcastLoadMoreButton._continuation;
  if (!token || !state.podcastData) return;
  els.podcastLoadMoreButton.disabled = true;
  els.podcastLoadMoreButton.textContent = "Loading...";
  try {
    const next = await window.metro.podcastContinuation(token);
    state.podcastData = {
      ...state.podcastData,
      episodes: uniqueTracks([...(state.podcastData.episodes || []), ...(next?.episodes || [])]),
      continuation: next?.continuation || null
    };
    renderPodcast(state.podcastData, state.podcastFallback || {});
    toast("More podcast episodes loaded.");
  } catch (error) {
    toast(error.message || "Load more episodes failed.", true);
  } finally {
    els.podcastLoadMoreButton.disabled = false;
    els.podcastLoadMoreButton.textContent = "Load more episodes";
  }
}

function collectionLabel(type) {
  if (type === "album") return "Album";
  if (type === "playlist") return "Playlist";
  if (type === "track" || type === "song" || type === "songs") return "Songs";
  return "Collection";
}

function collectionActionItem(result, fallback = {}) {
  result = asPageResult(result, fallback);
  const header = result.header || {};
  const browseId = header.browseId || fallback.browseId;
  return {
    id: header.playlistId || fallback.id || (browseId ? String(browseId).replace(/^VL/, "") : ""),
    browseId,
    params: header.params || fallback.params || null,
    type: header.type || fallback.type || "collection",
    kind: header.type || fallback.type || "collection",
    title: header.title || fallback.title || "Collection",
    subtitle: header.subtitle || fallback.subtitle || collectionLabel(header.type || fallback.type),
    thumbnail: header.thumbnail || fallback.thumbnail || "",
    inLibrary: Boolean(header.inLibrary),
    libraryAddToken: header.libraryAddToken || null,
    libraryRemoveToken: header.libraryRemoveToken || null
  };
}

function collectionMetaItems(result, tracks, sections, browseItems) {
  const header = result?.header || {};
  const items = [collectionLabel(header.type)];
  if (tracks.length) items.push(`${tracks.length} track${tracks.length === 1 ? "" : "s"}`);
  if (browseItems.length) items.push(`${browseItems.length} related item${browseItems.length === 1 ? "" : "s"}`);
  if (sections.length) items.push(`${sections.length} section${sections.length === 1 ? "" : "s"}`);
  if (result?.pagesLoaded && result.pagesLoaded > 1) items.push(`${result.pagesLoaded} pages loaded`);
  if (header.playlistId) items.push("Playable collection");
  return items.filter(Boolean);
}

function renderCollectionInsight(type, header, tracks, sections, browseItems) {
  if (type !== "album") return "";
  const relatedAlbums = browseItems.filter((item) => item.type === "album").length;
  const versionHints = browseItems.filter((item) => /deluxe|edition|explicit|clean|remaster|version/i.test(`${item.title || ""} ${item.subtitle || ""}`)).length;
  const totalSeconds = tracks.reduce((total, track) => total + itemDurationSeconds(track), 0);
  return `
    <section class="collection-insight">
      <div>
        <span>Release</span>
        <strong>${escapeText(header.subtitle || "YouTube Music")}</strong>
      </div>
      <div>
        <span>Total length</span>
        <strong>${totalSeconds ? formatClock(totalSeconds) : `${tracks.length} tracks`}</strong>
      </div>
      <div>
        <span>Versions</span>
        <strong>${versionHints || "Auto"}</strong>
      </div>
      <div>
        <span>Same artist</span>
        <strong>${relatedAlbums} albums</strong>
      </div>
    </section>
  `;
}

function activeCollectionPlaylistId() {
  const item = state.collectionActionItem || {};
  const header = state.collectionResult?.header || {};
  const id = item.id || header.playlistId || header.id || item.browseId || header.browseId || "";
  return normalizedPlaylistId(id);
}

function isPlaylistCollection(result = state.collectionResult, fallback = state.collectionFallback || {}) {
  const header = result?.header || {};
  return (header.type || fallback.type) === "playlist" || String(header.browseId || fallback.browseId || "").startsWith("VL");
}

function isLikedSongsCollection(result = state.collectionResult, fallback = state.collectionFallback || {}) {
  const header = result?.header || {};
  const ids = [header.id, header.playlistId, header.browseId, fallback.id, fallback.playlistId, fallback.browseId]
    .map((value) => String(value || "").replace(/^VL/, "").toLowerCase());
  if (ids.some((id) => id === "lm" || id === "femusic_liked_videos")) return true;
  const title = String(header.title || fallback.title || "").normalize("NFKC").trim().toLocaleLowerCase();
  return ["liked songs", "liked music", "喜歡的音樂", "喜爱的音乐"].includes(title);
}

function playlistEditableTracks() {
  return tracksFromResult(state.collectionResult);
}

function playlistTrackKey(track) {
  return track?.setVideoId || `${track?.id || ""}:${track?.playlistId || ""}`;
}

function playlistRowsHtml(items) {
  return items.map((item, index) => {
    const key = playlistTrackKey(item);
    const selected = state.playlistSelectedKeys.has(key);
    const active = state.currentTrack?.id === item.id;
    return `
      <div class="row downloaded-row liked-row collection-track-row unified-track-row playlist-edit-row unified-playlist-track ${active ? "active" : ""}" data-index="${index}" data-track-id="${escapeText(item.id || "")}">
        <label class="liked-select playlist-select" aria-label="Select ${escapeText(item.title)}">
          <input type="checkbox" data-playlist-select="${index}" ${selected ? "checked" : ""}>
        </label>
        <button class="liked-main" data-playlist-play="${index}" type="button">
          <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
          <span>
            <span class="title">${escapeText(item.title)}</span>
            <span class="subtitle">${escapeText(item.subtitle || item.artist || "YouTube Music")}</span>
            <span class="downloaded-detail">${escapeText(trackRowDetail(item, "Playlist"))}</span>
          </span>
        </button>
        ${moreTriggerHtml("playlist-row-more")}
        ${downloadTriggerHtml(item)}
        <button class="row-play" data-playlist-play="${index}" data-playback-indicator type="button" aria-label="${active && state.playing ? "Pause" : "Play"} ${escapeText(item.title || "song")}"><span>${standardIconSvg(active && state.playing ? "pause" : "play")}</span></button>
      </div>
    `;
  }).join("");
  /* Legacy markup retained temporarily for migration safety; unreachable. */
  return items.map((item, index) => {
    const key = playlistTrackKey(item);
    const selected = state.playlistSelectedKeys.has(key);
    const position = String(index + 1).padStart(2, "0");
    return `
      <div class="playlist-edit-row ${state.currentTrack?.id === item.id ? "active" : ""}" data-index="${index}" data-track-id="${escapeText(item.id || "")}">
        <label class="playlist-select" aria-label="Select ${escapeText(item.title)}">
          <input type="checkbox" data-playlist-select="${index}" ${selected ? "checked" : ""}>
        </label>
        <span class="playlist-position">${position}</span>
        <button class="playlist-track-main" data-playlist-play="${index}" type="button">
          <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
          <span>
            <span class="title">${escapeText(item.title)}</span>
            <span class="subtitle">${escapeText(item.subtitle || item.artist || "YouTube Music")}</span>
          </span>
        </button>
        <span class="playlist-duration">${escapeText(item.duration || "")}</span>
        <div class="playlist-track-actions">
      <button class="playlist-play-hover" data-playlist-play="${index}" data-playback-indicator type="button" aria-label="Play ${escapeText(item.title || "song")}"><span aria-hidden="true">${standardIconSvg(state.currentTrack?.id === item.id && state.playing ? "pause" : "play")}</span></button>
          ${moreTriggerHtml("playlist-row-more")}
          <button class="playlist-download ${isOfflineCached(item.id) ? "downloaded" : ""} ${state.offlineCachePending.has(item.id) ? "pending" : ""} ${downloadFailure(item.id) ? "failed" : ""}" data-download-trigger type="button" aria-label="${downloadFailure(item.id) ? "Retry offline download for" : isOfflineCached(item.id) ? "Remove offline copy of" : "Save offline"} ${escapeText(item.title || "song")}">
            ${downloadStateHtml(item)}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function prunePlaylistSelection(items) {
  const keys = new Set((items || []).map(playlistTrackKey));
  for (const key of [...state.playlistSelectedKeys]) {
    if (!keys.has(key)) state.playlistSelectedKeys.delete(key);
  }
}

function playlistBulkToolbarHtml(items) {
  const tracks = (items || []).filter(isTrackItem);
  const selected = tracks.filter((item) => state.playlistSelectedKeys.has(playlistTrackKey(item)));
  const selectedCount = selected.length;
  const allSelected = tracks.length > 0 && selectedCount === tracks.length;
  return `
    <div class="playlist-bulk-toolbar">
      <label class="playlist-select-all">
        <input type="checkbox" data-playlist-select-all ${allSelected ? "checked" : ""} ${tracks.length ? "" : "disabled"}>
        <span>${selectedCount} selected</span>
      </label>
      <span class="status">Drag tracks to reorder; changes sync to YouTube Music.</span>
      <div class="playlist-bulk-actions">
        <button class="secondary" data-playlist-queue-selected type="button" ${selectedCount ? "" : "disabled"}>
          Add to queue
        </button>
        <button class="secondary" data-playlist-download-selected type="button" ${selectedCount ? "" : "disabled"}>
          Download selected
        </button>
      </div>
    </div>
  `;
}

function playlistSmartSortLabel(rule) {
  return ({
    "play-count": "play count",
    recent: "recent plays",
    artist: "artist",
    duration: "duration",
    downloaded: "downloaded songs"
  })[rule] || "playlist rule";
}

function playlistTrackStat(track) {
  return track?.id ? (state.playbackStats?.[track.id] || {}) : {};
}

function playlistLastPlayedMs(track) {
  const stat = playlistTrackStat(track);
  const time = Date.parse(stat.lastPlayedAt || track?.lastPlayedAt || "");
  return Number.isFinite(time) ? time : 0;
}

function playlistPlayCount(track) {
  return Number(playlistTrackStat(track).count || 0);
}

function playlistSmartSortedTracks(rule, tracks = playlistEditableTracks()) {
  const decorated = [...(tracks || [])].map((track, index) => ({ track, index }));
  const titleCompare = (a, b) => String(a.track?.title || "").localeCompare(String(b.track?.title || ""));
  decorated.sort((a, b) => {
    if (rule === "play-count") {
      return playlistPlayCount(b.track) - playlistPlayCount(a.track) || playlistLastPlayedMs(b.track) - playlistLastPlayedMs(a.track) || titleCompare(a, b) || a.index - b.index;
    }
    if (rule === "recent") {
      return playlistLastPlayedMs(b.track) - playlistLastPlayedMs(a.track) || titleCompare(a, b) || a.index - b.index;
    }
    if (rule === "artist") {
      return String(itemCreator(a.track)).localeCompare(String(itemCreator(b.track))) || titleCompare(a, b) || a.index - b.index;
    }
    if (rule === "duration") {
      return itemDurationSeconds(b.track) - itemDurationSeconds(a.track) || titleCompare(a, b) || a.index - b.index;
    }
    if (rule === "downloaded") {
      return Number(Boolean(isOfflineCached(b.track?.id))) - Number(Boolean(isOfflineCached(a.track?.id))) || titleCompare(a, b) || a.index - b.index;
    }
    return a.index - b.index;
  });
  return decorated.map((entry) => entry.track);
}

function playlistSmartSortRuleFromToolbar(button) {
  return button?.closest(".playlist-bulk-toolbar")?.querySelector("[data-playlist-smart-sort]")?.value || "play-count";
}

function applyPlaylistSmartSort(rule = "play-count") {
  const sorted = playlistSmartSortedTracks(rule);
  updateCollectionTracksLocal(sorted);
  renderCollection(state.collectionResult, state.collectionFallback || {});
  toast(`Sorted playlist by ${playlistSmartSortLabel(rule)}.`);
  return sorted;
}

function tracksFromResult(result) {
  result = asPageResult(result);
  const sectionTracks = (result?.sections || []).flatMap((section) => section.tracks || []);
  return uniqueTracks([...(result?.tracks || []), ...sectionTracks]);
}

function shuffleTracks(tracks) {
  const list = [...tracks];
  for (let index = list.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [list[index], list[target]] = [list[target], list[index]];
  }
  return list;
}

function artistShuffleLimit() {
  return Math.max(25, Math.min(500, Number(state.settings.artistShuffleLimit) || DEFAULT_SETTINGS.artistShuffleLimit));
}

async function artistShuffleQueueFromTracks(tracks, source) {
  const limit = artistShuffleLimit();
  let collected = uniqueTracks(tracks || []);
  let continuations = source?.continuations || [];
  let pagesLoaded = 0;
  while (!state.settings.offlineMode && collected.length < limit && continuations[0]?.token && pagesLoaded < 8) {
    const continuation = continuations[0];
    pagesLoaded += 1;
    const next = await window.metro.continue({
      token: continuation.token,
      endpoint: continuation.endpoint || "browse"
    });
    const nextTracks = tracksFromResult(next);
    collected = uniqueTracks([...collected, ...nextTracks]);
    continuations = next?.continuations || [];
    if (!nextTracks.length && !continuations.length) break;
  }
  return {
    tracks: shuffleTracks(collected).slice(0, limit),
    source: source ? { ...source, continuations } : source
  };
}

function queueSource(type, title, continuations = []) {
  return {
    type: type || "list",
    title: title || "Queue",
    continuations: (continuations || []).filter((item) => item?.token)
  };
}

function queueSourceFromResult(result, fallback = {}, type = "list") {
  const header = result?.header || {};
  return queueSource(
    type,
    header.title || fallback.title || "Queue",
    result?.continuations || []
  );
}

function queueSourceFromPodcast(data = state.podcastData, fallback = state.podcastFallback || {}) {
  return queueSource(
    "podcast",
    data?.podcast?.title || fallback.title || "Podcast",
    data?.continuation ? [{ token: data.continuation, endpoint: "podcast" }] : []
  );
}

function renderCollection(result, fallback = {}) {
  result = asPageResult(result, fallback);
  state.collectionResult = result;
  state.collectionFallback = fallback;
  els.collectionBackButton?.classList.toggle("hidden", !state.collectionReturnArtist);
  const header = result?.header || {};
  const type = header.type || fallback.type || "collection";
  const label = collectionLabel(type);
  const tracks = tracksFromResult(result);
  const sections = (result?.sections || [])
    .map((section) => ({
      ...section,
      tracks: uniqueTracks(section.tracks || []),
      items: uniqueBrowseItems(section.items || [])
    }))
    .filter((section) => section.tracks.length || section.items.length);
  const browseItems = uniqueBrowseItems([...(result?.items || []), ...(result?.playlists || [])])
    .filter((item) => item.browseId !== (fallback.browseId || header.browseId));
  const browseItemsTitle = state.collectionReturnArtist
    ? (fallback.title || header.title || label)
    : "Related";
  const actionItem = collectionActionItem(result, fallback);
  state.collectionActionItem = actionItem;
  const metaItems = collectionMetaItems(result, tracks, sections, browseItems);
  const canSave = Boolean(actionItem.libraryAddToken || actionItem.libraryRemoveToken);
  const playlistView = isPlaylistCollection(result, fallback);
  const likedCollectionView = isLikedSongsCollection(result, fallback);
  const visibleTracks = playlistView ? filterByQuery(tracks, state.collectionQuery) : tracks;
  const gridView = state.collectionLayout === "grid";
  if (playlistView) prunePlaylistSelection(tracks);
  else state.playlistSelectedKeys.clear();

  els.collectionEyebrow.textContent = label;
  els.collectionTitle.textContent = header.title || fallback.title || label;
  els.collectionSubtitle.textContent = header.subtitle || fallback.subtitle || "YouTube Music";
  els.collectionMeta.innerHTML = metaItems.map((item) => `<span>${escapeText(item)}</span>`).join("");
  els.collectionDescription.textContent = header.description || "";
  els.collectionDescription.classList.toggle("hidden", !header.description);
  els.collectionArt.style.backgroundImage = thumbnailBackground(header.thumbnail || fallback.thumbnail);
  els.collectionHero.style.backgroundImage = header.background ? `linear-gradient(90deg, rgba(11, 11, 12, 0.96), rgba(11, 11, 12, 0.62)), url('${header.background}')` : "";
  els.collectionPlayButton.disabled = !tracks.length;
  els.collectionShuffleButton.disabled = !tracks.length;
  els.collectionDownloadButton.disabled = !tracks.length || tracks.every((track) => isOfflineCached(track.id));
  setIconButton(els.collectionPlayButton, "play", "Play");
  setIconButton(els.collectionShuffleButton, "shuffle", "Shuffle");
  setIconButton(els.collectionAddSongsButton, "playlist", "Add songs");
  setIconButton(els.collectionRenameButton, "edit", "Rename");
  setIconButton(els.collectionDeleteButton, "trash", "Delete");
  setIconButton(els.collectionLayoutButton, gridView ? "list" : "grid", gridView ? "List view" : "Grid view");
  els.collectionAddSongsButton.classList.toggle("hidden", !playlistView);
  els.collectionAddSongsButton.disabled = !playlistView || !activeCollectionPlaylistId();
  els.collectionRenameButton.classList.toggle("hidden", !playlistView);
  els.collectionDeleteButton.classList.toggle("hidden", !playlistView);
  els.collectionRenameButton.disabled = !playlistView || !activeCollectionPlaylistId();
  els.collectionDeleteButton.disabled = !playlistView || !activeCollectionPlaylistId();
  els.collectionSearchBar?.classList.toggle("hidden", !playlistView);
  if (els.collectionSearchInput && document.activeElement !== els.collectionSearchInput) {
    els.collectionSearchInput.value = playlistView ? state.collectionQuery : "";
  }
  els.collectionPlayButton._tracks = tracks;
  els.collectionShuffleButton._tracks = tracks;
  els.collectionDownloadButton._tracks = tracks;
  els.collectionPlayButton._queueSource = queueSourceFromResult(result, fallback, playlistView ? "playlist" : type);
  els.collectionShuffleButton._queueSource = els.collectionPlayButton._queueSource;
  if (state.settings.offlineMode) {
    const offlineTracks = offlinePlayableTracks(tracks);
    els.collectionPlayButton._tracks = offlineTracks;
    els.collectionShuffleButton._tracks = offlineTracks;
    els.collectionPlayButton.disabled = !offlineTracks.length;
    els.collectionShuffleButton.disabled = !offlineTracks.length;
    els.collectionPlayButton._queueSource = queueSource("downloads", `${header.title || fallback.title || "Collection"} · Offline`);
    els.collectionShuffleButton._queueSource = els.collectionPlayButton._queueSource;
  }

  const sectionHtml = sections.map((section, index) => {
    const content = section.tracks.length
      ? `<div class="rows collection-section-items" data-collection-section="${index}">${rowsHtml(section.tracks.slice(0, 30))}</div>`
      : `<div class="cards collection-section-items collection-cards" data-collection-section="${index}">${cardsHtml(section.items.slice(0, 24), "browse")}</div>`;
    return `
      <section class="collection-section">
        <div class="section-head home-section-head">
          <div>
            <h2>${escapeText(section.title || "More")}</h2>
            ${section.subtitle ? `<span class="status">${escapeText(section.subtitle)}</span>` : ""}
          </div>
        </div>
        ${content}
      </section>
    `;
  }).join("");

  els.collectionResults.innerHTML = `
    ${renderCollectionInsight(type, header, tracks, sections, browseItems)}
    ${tracks.length ? `
      <section class="collection-section">
        <div class="section-head home-section-head">
          <div>
            <h2>Tracks</h2>
            <span class="status">${state.collectionQuery && playlistView ? `${visibleTracks.length} of ` : ""}${tracks.length} song${tracks.length === 1 ? "" : "s"}${playlistView && !likedCollectionView ? " - editable playlist" : ""}</span>
          </div>
        </div>
        <div class="${gridView ? "cards collection-track-grid" : likedCollectionView || !playlistView ? "liked-results collection-liked-results" : "playlist-edit-list"} collection-tracks">
          ${!gridView && playlistView && !likedCollectionView && visibleTracks.length ? playlistBulkToolbarHtml(visibleTracks) : ""}
          ${visibleTracks.length
            ? (gridView ? cardsHtml(visibleTracks, "track") : likedCollectionView ? likedRowsHtml(visibleTracks) : playlistView ? playlistRowsHtml(visibleTracks) : likedRowsHtml(visibleTracks, { selectable: false, detailLabel: label }))
            : `<p class="status collection-search-empty">No songs loaded.</p>`}
        </div>
      </section>
    ` : ""}
    ${sectionHtml}
    ${browseItems.length ? `
      <section class="collection-section">
        <div class="section-head home-section-head">
          <div>
            <h2>${escapeText(browseItemsTitle)}</h2>
            <span class="status">${browseItems.length} item${browseItems.length === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div class="cards collection-related">${cardsHtml(browseItems.slice(0, 24), "browse")}</div>
      </section>
    ` : ""}
  `;

  const trackRows = els.collectionResults.querySelector(".collection-tracks");
  if (trackRows) {
    trackRows._items = visibleTracks;
    trackRows._playbackItems = tracks;
    trackRows._queueSource = likedCollectionView
      ? queueSource("liked", "Liked Songs")
      : queueSourceFromResult(result, fallback, playlistView ? "playlist" : type);
  }
  for (const element of els.collectionResults.querySelectorAll("[data-collection-section]")) {
    const section = sections[Number(element.dataset.collectionSection)];
    element._items = section?.tracks?.length ? section.tracks : uniqueBrowseItems(section?.items || []);
    element._queueSource = queueSource(section?.type || "section", section?.title || header.title || "Queue", section?.continuations || []);
  }
  const related = els.collectionResults.querySelector(".collection-related");
  if (related) related._items = browseItems;
  const continuation = result?.continuations?.[0] || null;
  els.collectionLoadMoreButton.classList.toggle("hidden", !continuation);
  els.collectionLoadMoreButton._continuation = continuation;
  els.collectionStatus.textContent = appendBatchStatus(tracks.length || sections.length || browseItems.length ? "" : "No collection content loaded.").trim();
}

function mergeCollectionResult(current, next) {
  current = asPageResult(current);
  next = asPageResult(next);
  return {
    header: current?.header || next?.header,
    tracks: uniqueTracks([...(current?.tracks || []), ...(next?.tracks || [])]),
    items: uniqueBrowseItems([...(current?.items || []), ...(next?.items || [])]),
    playlists: uniqueBrowseItems([...(current?.playlists || []), ...(next?.playlists || [])]),
    sections: [...(current?.sections || []), ...(next?.sections || [])],
    continuations: next?.continuations || []
  };
}

async function loadMoreCollection() {
  const continuation = els.collectionLoadMoreButton._continuation;
  if (!continuation?.token || !state.collectionResult || state.collectionLoadingMore) return false;
  const requestId = state.collectionRequestId;
  state.collectionLoadingMore = true;
  els.collectionLoadMoreButton.disabled = true;
  els.collectionLoadMoreButton.textContent = "Loading...";
  try {
    const next = await window.metro.continue({
      token: continuation.token,
      endpoint: continuation.endpoint || "browse"
    });
    if (requestId !== state.collectionRequestId) return false;
    const merged = mergeCollectionResult(state.collectionResult, next);
    renderCollection(merged, state.collectionFallback || {});
    return true;
  } catch (error) {
    if (requestId !== state.collectionRequestId) return false;
    toast(error.message || "Load more failed.", true);
    return false;
  } finally {
    if (requestId === state.collectionRequestId) {
      state.collectionLoadingMore = false;
      els.collectionLoadMoreButton.disabled = false;
      els.collectionLoadMoreButton.textContent = "Load more";
    }
  }
}

async function prefillCollection(minimumItems = 24, maxPages = 2) {
  let pages = 0;
  while (
    currentVisibleViewId() === "collectionView" &&
    tracksFromResult(state.collectionResult).length < minimumItems &&
    els.collectionLoadMoreButton?._continuation?.token &&
    pages < maxPages
  ) {
    pages += 1;
    if (!await loadMoreCollection()) break;
  }
}

async function loadCollection(item, options = {}) {
  if (!item?.browseId) return;
  const requestId = ++state.collectionRequestId;
  const requestedItem = { ...item };
  state.collectionQuery = "";
  state.collectionLoadingMore = false;
  state.collectionReturnArtist = options.returnArtist || null;
  switchView("collection");
  els.collectionBackButton?.classList.toggle("hidden", !state.collectionReturnArtist);
  els.collectionEyebrow.textContent = collectionLabel(item.type);
  els.collectionTitle.textContent = item.title || "Collection";
  els.collectionSubtitle.textContent = "Loading collection...";
  els.collectionDescription.textContent = "";
  els.collectionArt.style.backgroundImage = thumbnailBackground(item);
  els.collectionHero.style.backgroundImage = "";
  els.collectionStatus.textContent = "Loading...";
  els.collectionResults.innerHTML = skeletonHtml("hero") + skeletonHtml("rows", 7);
  els.collectionSearchBar?.classList.add("hidden");
  if (els.collectionSearchInput) els.collectionSearchInput.value = "";
  els.collectionLoadMoreButton.classList.add("hidden");
  els.collectionAddSongsButton.classList.add("hidden");
  els.collectionAddSongsButton.disabled = true;
  els.collectionRenameButton.classList.add("hidden");
  els.collectionDeleteButton.classList.add("hidden");
  els.collectionRenameButton.disabled = true;
  els.collectionDeleteButton.disabled = true;
  try {
    const result = await window.metro.collection({
      browseId: requestedItem.browseId,
      params: requestedItem.params || null,
      artistItems: Boolean(options.returnArtist),
      title: requestedItem.title || ""
    });
    if (requestId !== state.collectionRequestId) return;
    renderCollection(result, requestedItem);
    requestAnimationFrame(() => {
      if (requestId === state.collectionRequestId) prefillCollection();
    });
  } catch (error) {
    if (requestId !== state.collectionRequestId) return;
    els.collectionStatus.textContent = "Collection failed.";
    els.collectionResults.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
  }
}

function currentCollectionRequestItem() {
  const header = state.collectionResult?.header || {};
  const fallback = state.collectionFallback || {};
  const browseId = header.browseId || fallback.browseId || "";
  if (!browseId) return null;
  return {
    ...fallback,
    browseId,
    params: header.params || fallback.params || null,
    type: header.type || fallback.type || "collection",
    title: header.title || fallback.title || "Collection",
    subtitle: header.subtitle || fallback.subtitle || "",
    thumbnail: header.thumbnail || fallback.thumbnail || ""
  };
}

async function refreshCurrentCollectionStatus(label = "Refreshing playlist...") {
  const item = currentCollectionRequestItem();
  if (!item) return null;
  const requestId = state.collectionRequestId;
  const previousStatus = els.collectionStatus.textContent;
  els.collectionStatus.textContent = label;
  setSyncState("playlists", { status: "pending", pending: 1, error: "" });
  try {
    const result = await window.metro.collection({
      browseId: item.browseId,
      params: item.params || null
    });
    if (requestId !== state.collectionRequestId) return null;
    renderCollection(result, item);
    setSyncState("playlists", { status: "synced", pending: 0, error: "", updatedAt: new Date().toISOString() });
    return result;
  } catch (error) {
    if (requestId !== state.collectionRequestId) return null;
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Playlist refresh failed." });
    els.collectionStatus.textContent = previousStatus;
    toast(error.message || "Playlist refresh failed.", true);
    return null;
  }
}

function updateCollectionTracksLocal(tracks) {
  if (!state.collectionResult) return;
  const keys = new Set((tracks || []).map(playlistTrackKey));
  for (const key of [...state.playlistSelectedKeys]) {
    if (!keys.has(key)) state.playlistSelectedKeys.delete(key);
  }
  state.collectionResult.tracks = tracks || [];
  state.collectionResult.sections = (state.collectionResult.sections || []).map((section) => ({
    ...section,
    tracks: (section.tracks || []).filter((track) => keys.has(playlistTrackKey(track)))
  }));
}

async function renameCurrentPlaylist() {
  if (!isPlaylistCollection()) return;
  const playlistId = activeCollectionPlaylistId();
  if (!playlistId) return;
  const currentTitle = state.collectionResult?.header?.title || state.collectionFallback?.title || "";
  const nextTitle = window.prompt("Rename playlist", currentTitle);
  if (nextTitle === null) return;
  const name = nextTitle.trim();
  if (!name || name === currentTitle) return;

  els.collectionRenameButton.disabled = true;
  els.collectionRenameButton.classList.add("loading");
  els.collectionRenameButton.setAttribute("aria-label", "Renaming playlist");
  els.collectionRenameButton.title = "Renaming playlist";
  try {
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    await window.metro.renamePlaylist({ playlistId, name });
    if (state.collectionResult?.header) state.collectionResult.header.title = name;
    if (state.collectionFallback) state.collectionFallback.title = name;
    syncLibraryItem({ ...(state.collectionActionItem || {}), id: playlistId, type: "playlist", title: name }, true);
    renderCollection(state.collectionResult, state.collectionFallback || {});
    toast(`Renamed playlist: ${name}`);
    await refreshCurrentCollectionStatus("Syncing renamed playlist...");
  } catch (error) {
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Rename playlist failed." });
    enqueueSyncAction("playlist-rename", { playlistId, name }, `Rename playlist: ${name}`);
    toast(error.message || "Rename playlist failed.", true);
  } finally {
    els.collectionRenameButton.disabled = false;
    els.collectionRenameButton.classList.remove("loading");
    setIconButton(els.collectionRenameButton, "edit", "Rename");
  }
}

async function deleteCurrentPlaylist() {
  if (!isPlaylistCollection()) return;
  const playlistId = activeCollectionPlaylistId();
  if (!playlistId) return;
  const title = state.collectionResult?.header?.title || state.collectionFallback?.title || "this playlist";
  const confirmed = window.confirm(`Delete "${title}" from your YouTube Music library?`);
  if (!confirmed) return;

  els.collectionDeleteButton.disabled = true;
  try {
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    await window.metro.deletePlaylist(playlistId);
    syncLibraryItem({ ...(state.collectionActionItem || {}), id: playlistId, type: "playlist" }, false);
    toast(`Deleted playlist: ${title}`);
    await loadPlaylists();
  } catch (error) {
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Delete playlist failed." });
    enqueueSyncAction("playlist-delete", { playlistId }, `Delete playlist: ${title}`);
    toast(error.message || "Delete playlist failed.", true);
    els.collectionDeleteButton.disabled = false;
  }
}

async function removeTrackFromCurrentPlaylist(item, button) {
  const playlistId = activeCollectionPlaylistId();
  if (!playlistId || !item?.id || !item?.setVideoId) return;
  const previousTracks = playlistEditableTracks();
  button.disabled = true;
  button.textContent = "Removing...";
  try {
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    await window.metro.removeFromPlaylist({
      playlistId,
      videoId: item.id,
      setVideoId: item.setVideoId
    });
    const nextTracks = previousTracks.filter((track) => playlistTrackKey(track) !== playlistTrackKey(item));
    updateCollectionTracksLocal(nextTracks);
    renderCollection(state.collectionResult, state.collectionFallback || {});
    toast(`Removed from playlist: ${item.title}`);
    await refreshCurrentCollectionStatus("Syncing playlist...");
  } catch (error) {
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Remove from playlist failed." });
    enqueueSyncAction("playlist-remove", { playlistId, videoId: item.id, setVideoId: item.setVideoId }, `Remove from playlist: ${item.title || "Song"}`);
    updateCollectionTracksLocal(previousTracks);
    renderCollection(state.collectionResult, state.collectionFallback || {});
    button.disabled = false;
    button.textContent = "Remove";
    toast(error.message || "Remove from playlist failed.", true);
  }
}

async function removeSelectedPlaylistTracks() {
  const playlistId = activeCollectionPlaylistId();
  const tracks = playlistEditableTracks();
  const selected = tracks.filter((track) => state.playlistSelectedKeys.has(playlistTrackKey(track)) && track.setVideoId);
  if (!playlistId || !selected.length) return;
  const previousTracks = tracks;
  const selectedKeys = new Set(selected.map(playlistTrackKey));
  updateCollectionTracksLocal(tracks.filter((track) => !selectedKeys.has(playlistTrackKey(track))));
  state.playlistSelectedKeys.clear();
  renderCollection(state.collectionResult, state.collectionFallback || {});
  toast(`Removing ${selected.length} track${selected.length === 1 ? "" : "s"}...`);
  try {
    setSyncState("playlists", { status: "pending", pending: selected.length, error: "" });
    for (const item of selected) {
      await window.metro.removeFromPlaylist({
        playlistId,
        videoId: item.id,
        setVideoId: item.setVideoId
      });
    }
    toast(`Removed ${selected.length} track${selected.length === 1 ? "" : "s"} from playlist.`);
    await refreshCurrentCollectionStatus("Syncing playlist...");
  } catch (error) {
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Remove selected failed." });
    for (const item of selected) {
      enqueueSyncAction("playlist-remove", { playlistId, videoId: item.id, setVideoId: item.setVideoId }, `Remove from playlist: ${item.title || "Song"}`);
    }
    updateCollectionTracksLocal(previousTracks);
    renderCollection(state.collectionResult, state.collectionFallback || {});
    toast(error.message || "Remove selected failed.", true);
  }
}

function selectedPlaylistTracks() {
  return playlistEditableTracks().filter((track) => state.playlistSelectedKeys.has(playlistTrackKey(track)));
}

async function queueSelectedPlaylistTracks() {
  const tracks = selectedPlaylistTracks().filter(isTrackItem);
  if (!tracks.length) return;
  const source = queueSourceFromResult(state.collectionResult, state.collectionFallback || {}, "playlist");
  await addToQueue(tracks, false, source);
  toast(`Added ${tracks.length} selected track${tracks.length === 1 ? "" : "s"} to queue.`);
}

async function downloadSelectedPlaylistTracks(button = null) {
  const tracks = selectedPlaylistTracks().filter(isTrackItem);
  if (!tracks.length) return;
  const title = state.collectionResult?.header?.title || state.collectionFallback?.title || "Playlist";
  await cacheTracksOffline(tracks, `${title} selection`, button);
}

function homeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function homeSubtitle() {
  if (state.auth?.signedIn) {
    const name = state.auth.account?.name || state.auth.account?.email || "YouTube Music";
    return `For ${name}`;
  }
  return "Recommendations from your listening on this device.";
}

function renderHomeChips(chips, activeParams, activeBrowseId = "FEmusic_home") {
  const chipItems = [
    { title: "All", browseId: "FEmusic_home", params: null },
    ...(chips || [])
  ];
  const seen = new Set();
  const unique = chipItems.filter((chip) => {
    const key = `${chip.title}:${chip.params || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  els.homeChips.innerHTML = unique.map((chip, index) => {
    const active =
      (chip.params || null) === (activeParams || null) &&
      String(chip.browseId || "FEmusic_home") === String(activeBrowseId || "FEmusic_home");
    return `<button class="chip ${active ? "active" : ""}" data-chip-index="${index}" type="button">${escapeText(chip.title)}</button>`;
  }).join("");
  els.homeChips._items = unique;
}

function sectionMatchesQuickPicks(section) {
  return /quick|listen again|speed dial|recent|replay|mixed|picked/i.test(section?.title || "");
}

function renderHomeShelf(section, index) {
  const tracks = section.tracks || [];
  const items = uniqueBrowseItems(section.items || []);
  const hasTracks = tracks.length > 0;
  const listClass = hasTracks
    ? (section.layout === "quick" ? "quick-grid" : "rows home-rows")
    : "cards home-cards";
  const content = hasTracks ? rowsHtml(tracks) : cardsHtml(items, "browse");

  return `
    <section class="home-section">
      <div class="section-head home-section-head">
        <div>
          <h2>${escapeText(section.title || "Recommended")}</h2>
          ${section.subtitle ? `<span class="status">${escapeText(section.subtitle)}</span>` : ""}
        </div>
        ${section.browseId ? `<button class="secondary shelf-more" data-home-more="${index}" type="button">More</button>` : ""}
      </div>
      <div class="${listClass}" data-home-section="${index}">${content}</div>
    </section>
  `;
}

function setHomeSectionItems(container, sections) {
  for (const element of container.querySelectorAll("[data-home-section]")) {
    const section = sections[Number(element.dataset.homeSection)];
    element._items = section?.tracks?.length ? section.tracks : uniqueBrowseItems(section?.items || []);
    element._queueSource = queueSource("home", section?.title || "Home", section?.continuations || []);
  }
}

function normalizeHomeSections(result) {
  result = asPageResult(result);
  const sections = (result?.sections || []).map((section) => ({
    ...section,
    tracks: section.tracks || [],
    items: uniqueBrowseItems(section.items || [])
  }));

  if (sections.length) return sections;

  const tracks = result?.tracks || [];
  const browseItems = uniqueBrowseItems([...(result?.items || []), ...(result?.playlists || [])]);
  const fallback = [];
  if (tracks.length) fallback.push({ title: "Quick picks", tracks, items: [] });
  if (browseItems.length) fallback.push({ title: "Recommended", tracks: [], items: browseItems });
  return fallback;
}

function shuffledHomeSections(sections) {
  const keyed = sections.map((section, index) => ({
    ...section,
    homeKey: section.homeKey || `${section.title || "section"}:${index}`
  }));
  const keys = keyed.map((section) => section.homeKey);
  const sameKeys = keys.length === state.homeSectionOrder.length &&
    keys.every((key) => state.homeSectionOrder.includes(key));
  if (!sameKeys) {
    state.homeSectionOrder = [...keys];
    for (let index = state.homeSectionOrder.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [state.homeSectionOrder[index], state.homeSectionOrder[swap]] =
        [state.homeSectionOrder[swap], state.homeSectionOrder[index]];
    }
  }
  const order = new Map(state.homeSectionOrder.map((key, index) => [key, index]));
  return keyed.sort((a, b) => (order.get(a.homeKey) ?? 999) - (order.get(b.homeKey) ?? 999));
}

const RANDOMIZED_HOME_KEYS = new Set([
  "listen-again",
  "forgotten-favorites",
  "speed-dial",
  "quick-access"
]);

function orderMetrolistHomeSections(sections) {
  const pinned = sections.filter((section) => RANDOMIZED_HOME_KEYS.has(section.homeKey));
  const remaining = sections.filter((section) => !RANDOMIZED_HOME_KEYS.has(section.homeKey));
  for (let index = pinned.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [pinned[index], pinned[swap]] = [pinned[swap], pinned[index]];
  }
  state.homeSectionOrder = pinned.map((section) => section.homeKey);
  return [...pinned, ...remaining];
}

function buildMetrolistHomeSections(result) {
  const apiSections = normalizeHomeSections(result);
  const deviceTracks = uniqueTracks([
    ...(state.homeListeningHistory || []),
    ...(state.queueHistory || []),
    ...(state.offlineCache?.tracks || []),
    ...(state.localMusicData?.tracks || []),
    ...(state.libraryData?.songs || []),
    ...(state.libraryData?.downloads || [])
  ]);
  const allTracks = uniqueTracks([
    ...apiSections.flatMap((section) => section.tracks || []),
    ...(result?.tracks || []),
    ...deviceTracks
  ]);
  const history = uniqueTracks([
    ...(state.homeListeningHistory || []),
    ...(state.queueHistory || [])
  ]);
  const liked = uniqueTracks(likedRawTracks?.() || []);
  const allItems = uniqueBrowseItems([
    ...apiSections.flatMap((section) => section.items || []),
    ...(result?.items || []),
    ...(result?.playlists || [])
  ]);
  const playlists = uniqueBrowseItems([
    ...(state.libraryData?.playlists || []),
    ...playlistItemsFromResult(state.playlistsData || {}),
    ...allItems.filter((item) => item.type === "playlist")
  ]);
  const recentIds = new Set(history.slice(0, 30).map((item) => item.id));
  const forgotten = liked.filter((item) => !recentIds.has(item.id));
  const statsTracks = Object.entries({
    ...(state.homePlaybackStats || {}),
    ...(state.playbackStats || {})
  })
    .sort((a, b) => Number(b[1]?.playCount || b[1]?.count || 0) - Number(a[1]?.playCount || a[1]?.count || 0))
    .map(([id]) => [...history, ...liked, ...allTracks].find((track) => track.id === id))
    .filter(Boolean);
  const take = (source, offset, count = 12) => uniqueTracks(source).slice(offset, offset + count);
  const olderHistory = history.slice(Math.min(12, Math.max(1, Math.floor(history.length / 3))));
  const forgottenTracks = forgotten.length ? forgotten : olderHistory;
  const sections = [
    { homeKey: "speed-dial", title: "歌曲快選", subtitle: "你最常播放的歌曲", tracks: take([...statsTracks, ...history, ...allTracks], 0), layout: "quick" },
    { homeKey: "listen-again", title: "再聽一次", subtitle: "最近播放與帳號推薦", tracks: take([...history, ...allTracks], 0), layout: "quick" },
    { homeKey: "forgotten-favorites", title: "重溫舊愛", subtitle: "好一陣子沒聽的喜愛歌曲", tracks: take([...forgottenTracks, ...liked], 0) },
    { homeKey: "quick-access", title: "快速存取", subtitle: "快速回到常用播放清單與專輯", tracks: [], items: playlists.slice(0, 12) },
    { homeKey: "daily-discover", title: "每日探索", subtitle: "每天換一批推薦", tracks: take(allTracks, 6) },
    { homeKey: "community", title: "來自社群", subtitle: "其他聽眾正在收藏", tracks: [], items: playlists.slice(6, 18) },
    { homeKey: "similar", title: "相似推薦", subtitle: "依照你的聆聽品味", tracks: take(allTracks, 12) },
    { homeKey: "moods", title: "情境與曲風", subtitle: "依心情快速開始", tracks: [], items: allItems.filter((item) => item.type === "browse").slice(0, 14) }
  ].filter((section) => section.tracks?.length || section.items?.length);

  for (let index = 0; index < apiSections.length; index += 1) {
    const section = apiSections[index];
    const duplicate = sections.some((item) => normalizeArtistKey(item.title) === normalizeArtistKey(section.title));
    if (!duplicate && (section.tracks?.length || section.items?.length)) {
      sections.push({ ...section, homeKey: `youtube:${section.title || index}` });
    }
  }
  return orderMetrolistHomeSections(sections);
}

function renderHomeSignal(sections) {
  return "";
}

function renderHome(result, activeParams = null, activeBrowseId = "FEmusic_home") {
  result = asPageResult(result, { type: "home", title: "Home" });
  state.homeLoaded = true;
  state.homeParams = activeParams || null;
  state.homeBrowseId = activeBrowseId || "FEmusic_home";
  state.homeResult = result;
  els.homeGreeting.textContent = homeGreeting();
  els.homeSubtitle.textContent = homeSubtitle();
  if (!activeParams && state.homeBrowseId === "FEmusic_home") {
    state.homeChips = result?.chips || [];
  }
  renderHomeChips(
    uniqueBrowseItems([...(state.homeChips || []), ...(result?.chips || [])]),
    activeParams,
    state.homeBrowseId
  );

  const sections = activeParams || state.homeBrowseId !== "FEmusic_home"
    ? orderMetrolistHomeSections(normalizeHomeSections(result))
    : buildMetrolistHomeSections(result);

  const signalHtml = renderHomeSignal(sections);

  els.homeQuickPicks.innerHTML = signalHtml;
  els.homeShelves.innerHTML = sections.map(renderHomeShelf).join("");
  els.homeShelves._sections = sections;
  setHomeSectionItems(els.homeShelves, sections);
  els.homeFallbackActions.classList.toggle("hidden", Boolean(sections.length));
  els.homeStatus.textContent = sections.length ? "" : "Home feed is empty.";
}

async function renderOfflineHome() {
  await refreshOfflineCache();
  state.homeLoaded = true;
  state.homeParams = null;
  state.homeResult = { type: "downloads", title: "Offline Home", tracks: state.offlineCache.tracks || [] };
  els.homeGreeting.textContent = "Offline Home";
  els.homeSubtitle.textContent = "Downloaded songs only.";
  els.homeChips.innerHTML = `<button class="chip active" type="button">Downloaded</button>`;
  const downloadedTracks = offlinePlayableTracks(state.offlineCache.tracks || []);
  const recentDownloaded = offlinePlayableTracks(state.queueHistory || []).slice(0, 12);
  const dashboardHtml = offlineDashboardHtml(downloadedTracks, recentDownloaded);
  els.homeQuickPicks.innerHTML = dashboardHtml + (downloadedTracks.length ? `
    <section class="home-section quick-picks">
      <div class="section-head home-section-head">
        <div>
          <h2>Ready offline</h2>
          <span class="status">${downloadedTracks.length} downloaded song${downloadedTracks.length === 1 ? "" : "s"}</span>
        </div>
      </div>
      <div class="quick-grid" data-home-quick>${rowsHtml(downloadedTracks.slice(0, 12))}</div>
    </section>
  ` : `<p class="status">No downloaded songs yet.</p>`);
  const quickGrid = els.homeQuickPicks.querySelector("[data-home-quick]");
  if (quickGrid) {
    quickGrid._items = downloadedTracks.slice(0, 12);
    quickGrid._queueSource = queueSource("downloads", "Offline Home");
  }
  const sections = [];
  if (recentDownloaded.length) sections.push({ title: "Recently played offline", tracks: recentDownloaded, items: [] });
  if (downloadedTracks.length > 12) sections.push({ title: "All downloads", tracks: downloadedTracks.slice(12), items: [] });
  els.homeShelves.innerHTML = sections.map(renderHomeShelf).join("");
  els.homeShelves._sections = sections;
  setHomeSectionItems(els.homeShelves, sections);
  els.homeFallbackActions.classList.toggle("hidden", Boolean(downloadedTracks.length));
  els.homeStatus.textContent = downloadedTracks.length
    ? "Offline mode: only downloaded songs are shown."
    : "Offline mode: download songs to make them available here.";
}

function offlineDashboardHtml(downloadedTracks = [], recentDownloaded = []) {
  const queued = state.downloadQueue.filter((item) => item.status === "queued").length;
  const active = state.downloadQueue.filter((item) => item.status === "downloading").length;
  const failedIds = new Set([
    ...state.downloadQueue.filter((item) => item.status === "failed").map((item) => item.track?.id || item.id).filter(Boolean),
    ...state.offlineCacheFailures.keys()
  ]);
  const failedDownloads = failedIds.size;
  const cards = [
    { label: "Playable offline", value: downloadedTracks.length, detail: "Downloaded and ready" },
    { label: "Invalid downloads", value: failedDownloads, detail: failedDownloads ? "Needs retry or cleanup" : "No failures" },
    { label: "Download queue", value: queued + active, detail: `${queued} queued, ${active} active` },
    { label: "Recent offline", value: recentDownloaded.length, detail: "Playable history" }
  ];
  return `
    <section class="offline-dashboard" aria-label="Offline dashboard">
      ${cards.map((card) => `
        <div class="offline-dashboard-card ${card.value && /Invalid/.test(card.label) ? "warning" : ""}">
          <span>${escapeText(card.label)}</span>
          <strong>${escapeText(String(card.value))}</strong>
          <small>${escapeText(card.detail)}</small>
        </div>
      `).join("")}
    </section>
  `;
}

function libraryCounts(data) {
  return {
    songs: data?.songs?.length || 0,
    playlists: data?.playlists?.length || 0,
    albums: data?.albums?.length || 0,
    artists: data?.artists?.length || 0,
    podcasts: data?.podcasts?.length || 0,
    downloads: data?.downloads?.length || 0
  };
}

function itemCreator(item) {
  return item?.artist || item?.author || item?.subtitle || item?.creator || "";
}

function playedRankMap() {
  const map = new Map();
  state.queueHistory.forEach((item, index) => {
    if (item?.id && !map.has(item.id)) map.set(item.id, index);
  });
  return map;
}

function sortLibraryItems(items, kind) {
  const sorted = [...(items || [])];
  if (state.librarySort === "title") {
    sorted.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  } else if (state.librarySort === "creator") {
    sorted.sort((a, b) => String(itemCreator(a)).localeCompare(String(itemCreator(b))));
  } else if (state.librarySort === "played") {
    const rank = playedRankMap();
    sorted.sort((a, b) => (rank.get(a.id) ?? 999999) - (rank.get(b.id) ?? 999999));
  } else if (state.librarySort === "type") {
    sorted.sort((a, b) => String(a.type || kind || "").localeCompare(String(b.type || kind || "")) || String(a.title || "").localeCompare(String(b.title || "")));
  }
  return sorted;
}

function libraryRecentItems(data) {
  const likedIds = new Set((data?.songs || []).map((item) => item?.id).filter(Boolean));
  const recent = [
    ...(data?.recent || []),
    ...(data?.songs || []).slice(0, 4),
    ...(data?.playlists || []).slice(0, 4),
    ...(data?.albums || []).slice(0, 4),
    ...(data?.artists || []).slice(0, 4)
  ];
  // Library song surfaces use the same account-backed set as Liked Songs.
  // Downloaded videos and playback history must not leak into Your Library.
  return uniqueBrowseItems(recent)
    .filter((item) => !isTrackItem(item) || likedIds.has(item.id))
    .slice(0, 12);
}

function renderLibraryRecent(data) {
  const items = libraryRecentItems(data);
  if (!items.length) {
    els.libraryRecent.innerHTML = "";
    els.libraryRecent._items = [];
    return;
  }
  els.libraryRecent.innerHTML = `
    <section class="library-section">
      <div class="section-head home-section-head">
          <div>
          <h2>Recent activity</h2>
          <span class="status">${data?.sources?.recentActivity?.ok ? "Synced from YouTube Music recent activity" : "Library landing plus local playback history"}</span>
          </div>
      </div>
      <div class="cards library-cards" data-library-recent>${cardsHtml(items, "browse")}</div>
    </section>
  `;
  const container = els.libraryRecent.querySelector("[data-library-recent]");
  if (container) container._items = items;
  els.libraryRecent._items = items;
}

function formatLibrarySyncTime(value) {
  if (!value) return "not synced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "sync time unknown";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function syncStateLabel(status) {
  if (status === "synced") return "YouTube 已同步";
  if (status === "pending") return "等待同步";
  if (status === "error") return "同步失敗可重試";
  return "本機暫存";
}

function setSyncState(kind, patch = {}) {
  if (!state.syncState[kind]) return;
  state.syncState[kind] = {
    ...state.syncState[kind],
    ...patch
  };
  renderSyncPanels();
}

function syncStatePanelHtml(kind, title, count = 0) {
  const sync = state.syncState[kind] || {};
  const status = sync.status || "local";
  const pending = Number(sync.pending || 0);
  const updated = sync.updatedAt ? formatLibrarySyncTime(sync.updatedAt) : "not synced";
  const error = sync.error ? `<span class="sync-state-error">${escapeText(sync.error)}</span>` : "";
  const retry = status === "error"
    ? `<button class="sync-state-retry" data-sync-retry="${escapeText(kind)}" type="button">重試</button>`
    : "";
  return `
    <div class="sync-state-card ${escapeText(status)}">
      <div>
        <strong>${escapeText(title)}</strong>
        <small>${escapeText(syncStateLabel(status))} - ${escapeText(updated)}</small>
      </div>
      <div class="sync-state-metrics">
        <span>${escapeText(String(count))} 項</span>
        <span>${pending} 等待</span>
        ${retry}
      </div>
      ${error}
    </div>
  `;
}

function renderSyncPanels() {
  renderSyncOutbox();
}

function compactTrack(track = {}) {
  return {
    id: track.id || track.videoId || "",
    title: track.title || "Song",
    subtitle: track.subtitle || track.artist || "",
    artist: track.artist || "",
    thumbnail: track.thumbnail || "",
    playlistId: track.playlistId || "",
    setVideoId: track.setVideoId || "",
    libraryRemoveToken: track.libraryRemoveToken || ""
  };
}

function localPlaylistTrack(track = {}) {
  track = track && typeof track === "object" ? track : {};
  const id = String(track.id || track.videoId || "").trim();
  if (!id) return null;
  return {
    ...compactTrack(track),
    id,
    videoId: id,
    duration: track.duration || "",
    lengthSeconds: Number(track.lengthSeconds || 0) || 0,
    album: track.album || null,
    artists: Array.isArray(track.artists) ? track.artists : [],
    type: "track",
    kind: "track"
  };
}

function normalizeLocalPlaylist(playlist = {}, index = 0) {
  const tracks = uniqueTracks((Array.isArray(playlist.tracks) ? playlist.tracks : [])
    .map(localPlaylistTrack)
    .filter(Boolean));
  const name = String(playlist.name || playlist.title || `Local playlist ${index + 1}`).trim().slice(0, 80);
  return {
    id: String(playlist.id || `local-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`),
    name: name || `Local playlist ${index + 1}`,
    tracks,
    createdAt: playlist.createdAt || new Date().toISOString(),
    updatedAt: playlist.updatedAt || new Date().toISOString()
  };
}

function loadLocalPlaylists() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_PLAYLISTS_KEY) || "[]");
    state.localPlaylists = (Array.isArray(parsed) ? parsed : []).map(normalizeLocalPlaylist).slice(0, 200);
  } catch {
    state.localPlaylists = [];
  }
  renderLocalPlaylists();
}

function saveLocalPlaylists() {
  localStorage.setItem(LOCAL_PLAYLISTS_KEY, JSON.stringify(state.localPlaylists.slice(0, 200)));
  renderLocalPlaylists();
}

function renderLocalPlaylists() {
  if (!els.localPlaylistResults) return;
  const needle = String(state.playlistsQuery || "").trim().toLowerCase();
  const visible = state.localPlaylists
    .filter((playlist) => !needle || `${playlist.name || ""} ${(playlist.tracks || []).map((track) => track.title || "").join(" ")}`.toLowerCase().includes(needle))
    .sort((a, b) => {
      if (state.playlistsSort === "title") return String(a.name || "").localeCompare(String(b.name || ""));
      return String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""));
    });
  els.localPlaylistsSection?.classList.toggle("hidden", state.playlistsFilter === "synced");
  if (!visible.length) {
    els.localPlaylistResults.innerHTML = `<p class="status">${state.playlistsQuery ? "No local playlists match this search." : "No local playlists yet. Use the + button to create one."}</p>`;
    return;
  }
  els.localPlaylistResults.innerHTML = visible.map((playlist) => {
    const sample = playlist.tracks.slice(0, 3).map((track) => track.title).filter(Boolean).join(" · ");
    return `
      <article class="local-playlist-row" data-local-playlist="${escapeText(playlist.id)}">
        <div class="local-playlist-row-main">
          <strong>${escapeText(playlist.name)}</strong>
          <small>${playlist.tracks.length} song${playlist.tracks.length === 1 ? "" : "s"}${sample ? ` · ${escapeText(sample)}` : ""}</small>
        </div>
        <div class="local-playlist-row-actions">
          <button class="secondary" data-local-action="play" type="button" ${playlist.tracks.length ? "" : "disabled"}>Play</button>
          <button class="secondary" data-local-action="queue" type="button" ${playlist.tracks.length ? "" : "disabled"}>Add to queue</button>
          <button class="secondary" data-local-action="replace" type="button" ${state.queue.length ? "" : "disabled"}>Use current queue</button>
          <button class="secondary danger" data-local-action="delete" type="button">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function visibleSyncedPlaylists() {
  const needle = String(state.playlistsQuery || "").trim().toLowerCase();
  const items = playlistItemsFromResult(state.playlistsData || {})
    .filter((item) => !needle || `${item.title || ""} ${item.subtitle || ""}`.toLowerCase().includes(needle));
  if (state.playlistsSort === "title") {
    items.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  } else if (state.playlistsSort === "recent") {
    items.sort((a, b) => String(b.updatedAt || b.year || "").localeCompare(String(a.updatedAt || a.year || "")));
  }
  return items;
}

function renderPlaylistsPage() {
  for (const button of els.playlistsFilters?.querySelectorAll("[data-playlists-filter]") || []) {
    button.classList.toggle("active", button.dataset.playlistsFilter === state.playlistsFilter);
  }
  if (els.playlistsSortSelect) els.playlistsSortSelect.value = state.playlistsSort;
  renderLocalPlaylists();
  els.syncedPlaylistsSection?.classList.toggle("hidden", state.playlistsFilter === "local");
  const synced = visibleSyncedPlaylists();
  if (state.auth?.signedIn) {
    renderCards(els.playlistResults, synced, "playlist");
  } else {
    els.playlistResults.innerHTML = `<p class="status">Sign in to load YouTube Music playlists.</p>`;
    els.playlistResults._items = [];
  }
  const localCount = state.localPlaylists.length;
  const syncedCount = playlistItemsFromResult(state.playlistsData || {}).length;
  if (els.playlistsStatus) {
    els.playlistsStatus.textContent = `${localCount} on this device • ${syncedCount} synced${state.playlistsQuery ? ` • filtered by "${state.playlistsQuery}"` : ""}`;
  }
}

function createLocalPlaylist(name, tracks = []) {
  const normalizedName = String(name || "").trim().slice(0, 80);
  if (!normalizedName) throw new Error("Enter a playlist name.");
  const playlist = normalizeLocalPlaylist({
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: normalizedName,
    tracks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  state.localPlaylists.unshift(playlist);
  saveLocalPlaylists();
  return playlist;
}

function csvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const source = String(text || "").replace(/^\uFEFF/, "");
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "\"") {
      if (quoted && source[index + 1] === "\"") {
        cell += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => String(value).trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((value) => String(value).trim())) rows.push(row);
  return rows;
}

function playlistsFromCsv(text) {
  const rows = csvRows(text);
  if (rows.length < 2) return [];
  const headers = rows.shift().map((value) => String(value).trim().toLowerCase());
  const indexOf = (...names) => names.map((name) => headers.indexOf(name)).find((index) => index >= 0) ?? -1;
  const playlistIndex = indexOf("playlist", "playlist name", "playlist_name");
  const idIndex = indexOf("videoid", "video id", "video_id", "id");
  const titleIndex = indexOf("title", "song", "track");
  const artistIndex = indexOf("artist", "artists");
  const thumbnailIndex = indexOf("thumbnail", "image");
  if (idIndex < 0) throw new Error("CSV must include a videoId or id column.");
  const grouped = new Map();
  for (const row of rows) {
    const videoId = String(row[idIndex] || "").trim();
    if (!videoId) continue;
    const name = String(playlistIndex >= 0 ? row[playlistIndex] : "Imported playlist").trim() || "Imported playlist";
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name).push(localPlaylistTrack({
      id: videoId,
      title: titleIndex >= 0 ? row[titleIndex] : "Imported song",
      artist: artistIndex >= 0 ? row[artistIndex] : "",
      subtitle: artistIndex >= 0 ? row[artistIndex] : "",
      thumbnail: thumbnailIndex >= 0 ? row[thumbnailIndex] : ""
    }));
  }
  return [...grouped.entries()].map(([name, tracks], index) => normalizeLocalPlaylist({ name, tracks }, index));
}

function mergeImportedLocalPlaylists(playlists) {
  let imported = 0;
  for (const candidate of playlists.map(normalizeLocalPlaylist)) {
    const existing = state.localPlaylists.find((playlist) => playlist.name.toLowerCase() === candidate.name.toLowerCase());
    if (existing) {
      existing.tracks = uniqueTracks([...existing.tracks, ...candidate.tracks]);
      existing.updatedAt = new Date().toISOString();
    } else {
      state.localPlaylists.push(candidate);
    }
    imported += 1;
  }
  state.localPlaylists = state.localPlaylists.slice(0, 200);
  saveLocalPlaylists();
  return imported;
}

async function importLocalPlaylistFile(file) {
  const text = await file.text();
  let playlists = [];
  if (/\.csv$/i.test(file.name) || file.type === "text/csv") {
    playlists = playlistsFromCsv(text);
  } else {
    const parsed = JSON.parse(text);
    playlists = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.localPlaylists)
        ? parsed.localPlaylists
        : Array.isArray(parsed.playlists)
          ? parsed.playlists
          : [];
  }
  if (!playlists.length) throw new Error("No playlists were found in this file.");
  return mergeImportedLocalPlaylists(playlists);
}

async function exportLocalPlaylists() {
  const payload = {
    format: "auralane-local-playlists",
    version: 1,
    exportedAt: new Date().toISOString(),
    localPlaylists: state.localPlaylists
  };
  const result = await window.metro.saveTextFile({
    title: "Export local playlists",
    defaultPath: `auralane-local-playlists-${new Date().toISOString().slice(0, 10)}.json`,
    filters: [{ name: "JSON", extensions: ["json"] }],
    content: JSON.stringify(payload, null, 2)
  });
  if (!result?.canceled) toast("Local playlists exported.");
}

function backupStorageSnapshot() {
  const storage = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith("auralane:")) continue;
    storage[key] = localStorage.getItem(key);
  }
  return storage;
}

async function exportAppBackup() {
  const payload = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    storage: backupStorageSnapshot(),
    queue: (await window.metro.getQueue?.()) || state.queue,
    note: "Credentials and downloaded audio are intentionally excluded."
  };
  const result = await window.metro.saveTextFile({
    title: "Export Auralane backup",
    defaultPath: `auralane-backup-${new Date().toISOString().slice(0, 10)}.json`,
    filters: [{ name: "Auralane backup", extensions: ["json"] }],
    content: JSON.stringify(payload, null, 2)
  });
  if (!result?.canceled) toast("Backup exported without account credentials or audio files.");
}

async function restoreAppBackupFile(file) {
  const parsed = JSON.parse(await file.text());
  if (parsed?.format !== BACKUP_FORMAT || Number(parsed?.version) !== BACKUP_VERSION) {
    throw new Error("This is not a supported Auralane backup.");
  }
  const storage = parsed.storage && typeof parsed.storage === "object" ? parsed.storage : {};
  const entries = Object.entries(storage).filter(([key, value]) => key.startsWith("auralane:") && typeof value === "string");
  if (!entries.length && !Array.isArray(parsed.queue)) throw new Error("The backup does not contain restorable data.");
  if (!window.confirm("Restore this backup? Current local values with the same names will be replaced.")) return false;
  for (const [key, value] of entries) localStorage.setItem(key, value);
  if (Array.isArray(parsed.queue)) await window.metro.setQueue(parsed.queue.map(localPlaylistTrack).filter(Boolean));
  toast("Backup restored. Reloading Auralane...");
  window.setTimeout(() => window.metro.reloadWindow(), 350);
  return true;
}

function loadSyncOutbox() {
  state.syncOutbox = readStoredList(SYNC_OUTBOX_KEY)
    .filter((item) => item?.id && item?.type && item.type !== "playlist-move")
    .slice(0, 100);
  saveSyncOutbox();
}

function saveSyncOutbox() {
  writeStoredList(SYNC_OUTBOX_KEY, state.syncOutbox.slice(0, 100));
  renderSyncOutbox();
}

function enqueueSyncAction(type, payload = {}, label = "") {
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    payload,
    label: label || type,
    status: "queued",
    attempts: 0,
    error: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  state.syncOutbox.unshift(item);
  saveSyncOutbox();
  setSyncState(type.startsWith("like") || type.startsWith("unlike") ? "liked" : "playlists", {
    status: "pending",
    pending: state.syncOutbox.filter((entry) => entry.status !== "done").length,
    error: ""
  });
  window.setTimeout(() => processSyncOutbox(), 1000);
  return item;
}

async function performSyncAction(item) {
  const payload = item.payload || {};
  if (item.type === "like-track") {
    await window.metro.likeVideo(payload.videoId || payload.track?.id);
    clearLikedRemoval(payload.videoId || payload.track?.id);
    patchTrackState(payload.videoId || payload.track?.id, { liked: true, inLibrary: true });
    addLikedTrack(payload.track);
    return;
  }
  if (item.type === "unlike-track") {
    await unlikeTrackOnAccount(payload.track || { id: payload.videoId, libraryRemoveToken: payload.libraryRemoveToken });
    rememberLikedRemoval(payload.videoId || payload.track?.id);
    patchTrackState(payload.videoId || payload.track?.id, { liked: false, inLibrary: false });
    removeLikedTracks([payload.videoId || payload.track?.id]);
    return;
  }
  if (item.type === "playlist-add") {
    await window.metro.addToPlaylist({ playlistId: payload.playlistId, videoId: payload.videoId });
    return;
  }
  if (item.type === "playlist-remove") {
    await window.metro.removeFromPlaylist({ playlistId: payload.playlistId, videoId: payload.videoId, setVideoId: payload.setVideoId });
    return;
  }
  if (item.type === "playlist-rename") {
    await window.metro.renamePlaylist({ playlistId: payload.playlistId, name: payload.name });
    return;
  }
  if (item.type === "playlist-delete") {
    await window.metro.deletePlaylist(payload.playlistId);
    return;
  }
  if (item.type === "playlist-create") {
    await window.metro.createPlaylist({ title: payload.title, videoIds: payload.videoIds || [] });
  }
}

async function processSyncOutbox({ force = false } = {}) {
  if (state.syncOutboxProcessing) return;
  if (!force && navigator.onLine === false) return;
  if (!state.auth?.signedIn) {
    renderSyncOutbox();
    return;
  }
  const contextVersion = state.syncContextVersion;
  const storageId = accountStorageId();
  const pending = state.syncOutbox.filter((item) => item.status !== "done" && (force || item.attempts < 5));
  if (!pending.length) {
    renderSyncOutbox();
    return;
  }
  state.syncOutboxProcessing = true;
  try {
    for (const item of pending) {
      if (contextVersion !== state.syncContextVersion || storageId !== accountStorageId() || !state.auth?.signedIn) break;
      item.status = "syncing";
      item.updatedAt = new Date().toISOString();
      saveSyncOutbox();
      try {
        item.attempts = Number(item.attempts || 0) + 1;
        await performSyncAction(item);
        if (contextVersion !== state.syncContextVersion || storageId !== accountStorageId()) break;
        item.status = "done";
        item.error = "";
        item.updatedAt = new Date().toISOString();
      } catch (error) {
        item.status = "error";
        item.error = error.message || "Sync failed.";
        item.updatedAt = new Date().toISOString();
      }
      saveSyncOutbox();
    }
  } finally {
    if (contextVersion !== state.syncContextVersion || storageId !== accountStorageId()) return;
    state.syncOutboxProcessing = false;
    const remaining = state.syncOutbox.filter((item) => item.status !== "done");
    setSyncState("liked", { pending: remaining.filter((item) => item.type.includes("like")).length });
    setSyncState("playlists", { pending: remaining.filter((item) => item.type.startsWith("playlist")).length });
    if (!remaining.length) {
      setSyncState("liked", { status: "synced", error: "", updatedAt: new Date().toISOString() });
      setSyncState("playlists", { status: "synced", error: "", updatedAt: new Date().toISOString() });
    }
  }
}

function renderSyncOutbox() {
  if (!els.syncOutboxStatus || !els.syncOutboxList) return;
  const pending = state.syncOutbox.filter((item) => item.status !== "done");
  const failed = state.syncOutbox.filter((item) => item.status === "error");
  els.syncOutboxStatus.textContent = pending.length
    ? `${pending.length} waiting, ${failed.length} failed.${state.auth?.signedIn ? "" : " Sign in to sync."}`
    : "No pending sync actions.";
  els.syncOutboxRetryAll.disabled = !pending.length || state.syncOutboxProcessing || !state.auth?.signedIn;
  els.syncOutboxClearDone.disabled = !state.syncOutbox.some((item) => item.status === "done");
  const rows = state.syncOutbox.slice(0, 20);
  els.syncOutboxList.innerHTML = rows.length ? rows.map((item) => `
    <div class="settings-list-row">
      <div>
        <strong>${escapeText(item.label || item.type)}</strong>
        <small>${escapeText(item.status)} - attempts ${Number(item.attempts || 0)}${item.error ? ` - ${item.error}` : ""}</small>
      </div>
      <div class="settings-list-actions">
        <button data-outbox-retry="${escapeText(item.id)}" type="button" ${item.status === "syncing" ? "disabled" : ""}>Retry</button>
        <button data-outbox-remove="${escapeText(item.id)}" type="button">Remove</button>
      </div>
    </div>
  `).join("") : `<p class="status">Outbox is empty.</p>`;
}

function librarySourceDetail(source, syncUpdatedAt = null) {
  if (!source) return "Not loaded";
  if (source.error) return source.error;
  const pageCount = Number(source.pagesLoaded || 0);
  const itemCount = Number(source.items || source.count || 0);
  const pageText = `${pageCount} page${pageCount === 1 ? "" : "s"}`;
  const syncText = source.complete ? "synced" : "partial sync";
  return `${itemCount} item${itemCount === 1 ? "" : "s"} - ${pageText}, ${syncText} - ${formatLibrarySyncTime(syncUpdatedAt)}`;
}

function librarySourceClass(source) {
  if (!source || source.error || source.ok === false) return "error";
  return source.complete ? "ok" : "partial";
}

function renderLibrarySyncCards(data, counts) {
  if (!els.librarySync) return;
  const sources = data?.sources || {};
  const cards = [
    { key: "songs", title: "Liked songs", value: counts.songs },
    { key: "playlists", title: "Saved playlists", value: counts.playlists },
    { key: "albums", title: "Saved albums", value: counts.albums },
    { key: "artists", title: "Subscribed artists", value: counts.artists },
    { key: "recentActivity", title: "Recent activity", value: data?.recent?.length || 0 }
  ];

  els.librarySync.innerHTML = cards.map((card) => {
    const source = sources[card.key];
    return `
      <div class="library-sync-card ${librarySourceClass(source)}">
        <div class="library-sync-card-head">
          <strong>${escapeText(card.title)}</strong>
          <button class="library-sync-refresh" data-library-sync-refresh="${escapeText(card.key)}" type="button">Refresh</button>
        </div>
        <span>${escapeText(String(card.value || 0))}</span>
        <small>${escapeText(librarySourceDetail(source, data?.sync?.updatedAt))}</small>
      </div>
    `;
  }).join("");
  els.librarySync.classList.toggle("hidden", !cards.length);
}

function renderLibraryHighlights(data, counts) {
  if (!els.libraryHighlights) return;
  const highlights = [
    {
      action: "liked",
      icon: "L",
      title: "Liked songs",
      subtitle: `${counts.songs} saved song${counts.songs === 1 ? "" : "s"}`
    },
    {
      action: "downloaded",
      icon: "D",
      title: "Downloaded",
      subtitle: `${counts.downloads} offline song${counts.downloads === 1 ? "" : "s"}`
    },
    {
      action: "playlists",
      icon: "P",
      title: "Playlists",
      subtitle: `${counts.playlists} playlist${counts.playlists === 1 ? "" : "s"}`
    },
    {
      action: "albums",
      icon: "A",
      title: "Albums",
      subtitle: `${counts.albums} album${counts.albums === 1 ? "" : "s"}`
    },
    {
      action: "artists",
      icon: "R",
      title: "Artists",
      subtitle: `${counts.artists} artist${counts.artists === 1 ? "" : "s"}`
    },
    {
      action: "podcasts",
      icon: "M",
      title: "Podcasts",
      subtitle: `${counts.podcasts} show${counts.podcasts === 1 ? "" : "s"}`
    }
  ];

  els.libraryHighlights.innerHTML = highlights.map((item) => `
    <button class="library-feature" data-library-action="${escapeText(item.action)}" type="button">
      <span class="mini letter-thumb">${escapeText(item.icon)}</span>
      <span>
        <strong>${escapeText(item.title)}</strong>
        <small>${escapeText(item.subtitle)}</small>
      </span>
      <span class="feature-arrow" aria-hidden="true">&gt;</span>
    </button>
  `).join("");
  els.libraryHighlights._items = highlights;
  els.libraryHighlights.classList.remove("hidden");
}

function filterByQuery(items, query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return items || [];
  return (items || []).filter((item) => [
    item.title,
    item.subtitle,
    item.artist,
    item.album?.title || item.album,
    ...(Array.isArray(item.artists) ? item.artists.map((artist) => artist?.title || artist?.name || artist) : [])
  ].filter(Boolean).join(" ").toLowerCase().includes(needle));
}

function durationSeconds(duration) {
  const parts = String(duration || "").split(":").map((part) => Number(part));
  if (!parts.length || parts.some((part) => !Number.isFinite(part))) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function likedRawTracks(data = state.likedData) {
  return tracksFromResult(data);
}

function hydrateLikedRemovalTombstones() {
  if (state.likedRemovalTombstonesHydrated) return;
  state.likedRemovalTombstonesHydrated = true;
  const now = Date.now();
  const saved = readStoredObject(LIKED_REMOVAL_TOMBSTONES_KEY);
  let changed = false;
  for (const [id, expiresAt] of Object.entries(saved)) {
    const value = Number(expiresAt);
    if (id && Number.isFinite(value) && value > now) state.likedRemovalTombstones.set(id, value);
    else changed = true;
  }
  if (changed) persistLikedRemovalTombstones();
}

function persistLikedRemovalTombstones() {
  const now = Date.now();
  const saved = {};
  for (const [id, expiresAt] of state.likedRemovalTombstones) {
    if (expiresAt > now) saved[id] = expiresAt;
  }
  writeStoredObject(LIKED_REMOVAL_TOMBSTONES_KEY, saved);
}

function rememberLikedRemoval(id) {
  if (!id) return;
  hydrateLikedRemovalTombstones();
  // Keep the user's explicit removal until a later re-like clears it. YouTube
  // Music browse data can remain stale far longer than a normal refresh cycle.
  state.likedRemovalTombstones.set(String(id), Date.now() + (10 * 365 * 24 * 60 * 60 * 1000));
  persistLikedRemovalTombstones();
}

function clearLikedRemoval(id) {
  if (!id) return;
  hydrateLikedRemovalTombstones();
  if (state.likedRemovalTombstones.delete(String(id))) persistLikedRemovalTombstones();
}

function isRecentlyRemovedLikedTrack(id) {
  hydrateLikedRemovalTombstones();
  const key = String(id || "");
  const expiresAt = state.likedRemovalTombstones.get(key);
  if (!expiresAt) return false;
  if (expiresAt > Date.now()) return true;
  state.likedRemovalTombstones.delete(key);
  persistLikedRemovalTombstones();
  return false;
}

function setAuthoritativeLikedTracks(tracks = []) {
  state.likedTrackIds = new Set((tracks || []).map((track) => track?.id).filter(Boolean));
  state.likedStateHydrated = true;
  if (state.currentTrack?.id) {
    const liked = state.likedTrackIds.has(state.currentTrack.id);
    patchTrackState(state.currentTrack.id, { liked, inLibrary: liked || state.currentTrack.inLibrary });
  }
}

function mergeLikedData(result) {
  const page = asPageResult(result, { type: "liked", title: "Liked Songs" });
  const allowed = (track) => !isRecentlyRemovedLikedTrack(track?.id);
  page.tracks = uniqueTracks(tracksFromResult(page).filter(allowed));
  page.sections = (page.sections || []).map((section) => ({ ...section, tracks: (section.tracks || []).filter(allowed) }));
  setAuthoritativeLikedTracks(page.tracks);
  if (state.libraryData) state.libraryData = { ...state.libraryData, songs: page.tracks };
  return markTracksLiked(page);
}

async function hydrateLikedSongsInBackground() {
  if (!state.auth?.signedIn || state.likedStateHydrated || !window.metro?.likedSongs) return;
  const syncVersion = state.syncContextVersion;
  try {
    const result = await window.metro.likedSongs();
    if (syncVersion !== state.syncContextVersion || !state.auth?.signedIn) return;
    state.likedData = mergeLikedData(result);
    renderCurrentTrackActions();
    if (currentVisibleViewId() === "likedView") renderLiked(state.likedData);
    if (currentVisibleViewId() === "libraryView" && state.libraryData) renderLibrary(state.libraryData);
  } catch (error) {
    if (state.settings.debugLogs) console.warn("Background liked songs hydration failed", error);
  }
}

function likedVisibleTracks({ ignoreSearch = false } = {}) {
  const queried = ignoreSearch ? likedRawTracks() : filterByQuery(likedRawTracks(), state.likedQuery);
  const tracks = state.likedFilter === "downloaded"
    ? queried.filter((track) => isOfflineCached(track.id) || track.offlineCached || track.cached)
    : queried;
  const sorted = [...tracks];
  if (state.likedSort === "title") {
    sorted.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  } else if (state.likedSort === "artist") {
    sorted.sort((a, b) => String(a.artist || a.subtitle || "").localeCompare(String(b.artist || b.subtitle || "")));
  } else if (state.likedSort === "duration") {
    sorted.sort((a, b) => durationSeconds(a.duration) - durationSeconds(b.duration));
  }
  return sorted;
}

function pruneLikedSelection(tracks) {
  const ids = new Set((tracks || []).map((track) => track.id));
  for (const id of [...state.likedSelectedIds]) {
    if (!ids.has(id)) state.likedSelectedIds.delete(id);
  }
}

function likedRowsHtml(items, { selectable = true, detailLabel = "Liked song" } = {}) {
  return unifiedTrackRowsHtml(items, { selectable, detailLabel });
  /* Legacy markup retained temporarily for migration safety; unreachable. */
  return items.map((item, index) => {
    const selected = state.likedSelectedIds.has(item.id);
    const active = state.currentTrack?.id === item.id;
    return `
      <div class="row downloaded-row liked-row ${selectable ? "" : "collection-track-row"} ${active ? "active" : ""}" data-index="${index}" data-track-id="${escapeText(item.id || "")}">
        ${selectable ? `<label class="liked-select" aria-label="Select ${escapeText(item.title)}">
          <input type="checkbox" data-liked-select="${index}" ${selected ? "checked" : ""}>
        </label>` : ""}
        <button class="liked-main" data-liked-play="${index}" type="button">
          <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
          <span>
            <span class="title">${escapeText(item.title)}</span>
            <span class="subtitle">${escapeText(item.subtitle || item.artist || "YouTube Music")}</span>
            <span class="downloaded-detail">${escapeText([item.duration, detailLabel].filter(Boolean).join(" · "))}</span>
          </span>
        </button>
        ${moreTriggerHtml("row-more")}
        ${downloadTriggerHtml(item)}
        <button class="row-play" data-liked-play="${index}" data-playback-indicator type="button" aria-label="${active && state.playing ? "Pause" : "Play"} ${escapeText(item.title || "song")}"><span>${standardIconSvg(active && state.playing ? "pause" : "play")}</span></button>
      </div>
    `;
  }).join("");
}

function renderLiked(result = state.likedData) {
  if (result) state.likedData = mergeLikedData(result);
  renderCurrentTrackActions();
  const allTracks = likedRawTracks();
  const visibleTracks = likedVisibleTracks();
  const playbackTracks = likedVisibleTracks({ ignoreSearch: true });
  const gridView = state.likedLayout === "grid";
  setIconButton(els.likedLayoutButton, gridView ? "list" : "grid", gridView ? "List view" : "Grid view");
  pruneLikedSelection(allTracks);
  renderSyncPanels();
  for (const button of els.likedFilters?.querySelectorAll("[data-liked-filter]") || []) {
    button.classList.toggle("active", button.dataset.likedFilter === state.likedFilter);
  }

  const selectedCount = state.likedSelectedIds.size;
  const queryText = state.likedQuery ? ` matching "${state.likedQuery}"` : "";
  els.likedStatus.textContent = appendBatchStatus(`${allTracks.length} liked song${allTracks.length === 1 ? "" : "s"}${queryText}. ${selectedCount} selected.`);
  els.likedPlayButton.disabled = !visibleTracks.length;
  els.likedShuffleButton.disabled = !visibleTracks.length;
  els.likedDownloadButton.disabled = !allTracks.length || allTracks.every((track) => isOfflineCached(track.id));
  els.likedPlayButton._tracks = playbackTracks;
  els.likedShuffleButton._tracks = playbackTracks;
  els.likedDownloadButton._tracks = allTracks;
  els.likedPlayButton._queueSource = queueSource("liked", "Liked Songs");
  els.likedShuffleButton._queueSource = els.likedPlayButton._queueSource;
  if (state.settings.offlineMode) {
    const offlineTracks = offlinePlayableTracks(playbackTracks);
    els.likedPlayButton._tracks = offlineTracks;
    els.likedShuffleButton._tracks = offlineTracks;
    els.likedPlayButton.disabled = !offlineTracks.length;
    els.likedShuffleButton.disabled = !offlineTracks.length;
    els.likedPlayButton._queueSource = queueSource("downloads", "Liked Songs · Offline");
    els.likedShuffleButton._queueSource = els.likedPlayButton._queueSource;
    els.likedStatus.textContent = appendBatchStatus(`${allTracks.length} liked song${allTracks.length === 1 ? "" : "s"}${queryText}. Offline mode: ${offlineTracks.length} downloaded. ${selectedCount} selected.`);
  }

  if (!visibleTracks.length) {
    els.likedResults.innerHTML = `<p class="status">${state.likedQuery ? "No liked songs match this search." : "No liked songs loaded."}</p>`;
    els.likedResults._items = [];
    return;
  }
  els.likedResults.classList.toggle("cards", gridView);
  els.likedResults.classList.toggle("liked-results", !gridView);
  els.likedResults.classList.toggle("liked-track-grid", gridView);
  els.likedResults.innerHTML = gridView ? cardsHtml(visibleTracks, "track") : likedRowsHtml(visibleTracks);
  els.likedResults._items = visibleTracks;
  els.likedResults._playbackItems = playbackTracks;
  els.likedResults._queueSource = queueSource("liked", "Liked Songs");
}

function downloadedVisibleTracks({ ignoreSearch = false } = {}) {
  const queried = ignoreSearch
    ? (state.offlineCache?.tracks || [])
    : filterByQuery(state.offlineCache?.tracks || [], state.downloadedQuery);
  const recentCutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const tracks = state.downloadedFilter === "recent"
    ? queried.filter((track) => {
        const cachedAt = new Date(track.cachedAt || 0).getTime();
        return Number.isFinite(cachedAt) && cachedAt >= recentCutoff;
      })
    : queried;
  const sorted = [...tracks];
  if (state.downloadedSort === "title") {
    sorted.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  } else if (state.downloadedSort === "artist") {
    sorted.sort((a, b) => String(itemCreator(a)).localeCompare(String(itemCreator(b))));
  } else if (state.downloadedSort === "size") {
    sorted.sort((a, b) => (Number(b.cacheSize) || 0) - (Number(a.cacheSize) || 0));
  } else {
    sorted.sort((a, b) => String(b.cachedAt || "").localeCompare(String(a.cachedAt || "")));
  }
  return sorted;
}

function formatCachedAt(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function downloadedMeta(track) {
  const parts = [
    track.cacheSize ? formatBytes(track.cacheSize) : "",
    formatCachedAt(track.cachedAt),
    track.mimeType ? String(track.mimeType).split(";")[0] : "",
    track.downloadMethod || track.playback?.downloadMethod || ""
  ].filter(Boolean);
  return parts.join(" · ");
}

function downloadedRowsHtml(items) {
  return unifiedTrackRowsHtml(items, { detailLabel: downloadedMeta });
  /* Legacy markup retained temporarily for migration safety; unreachable. */
  return items.map((item, index) => `
    <button class="row downloaded-row ${state.currentTrack?.id === item.id ? "active" : ""}" data-index="${index}" data-track-id="${escapeText(item.id || "")}" type="button">
      <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
      <span>
        <span class="title">${escapeText(item.title)}</span>
        <span class="subtitle">${escapeText(item.subtitle || item.artist || "Offline track")}</span>
        <span class="downloaded-detail">${escapeText(downloadedMeta(item))}</span>
      </span>
      ${moreTriggerHtml("row-more")}
      ${downloadTriggerHtml(item)}
      <span class="row-play" data-playback-indicator aria-hidden="true"><span>${standardIconSvg(state.currentTrack?.id === item.id && state.playing ? "pause" : "play")}</span></span>
    </button>
  `).join("");
}

function renderDownloaded() {
  const tracks = downloadedVisibleTracks();
  const playbackTracks = downloadedVisibleTracks({ ignoreSearch: true });
  const total = state.offlineCache?.tracks?.length || 0;
  const bytes = state.offlineCache?.stats?.bytes || tracks.reduce((sum, track) => sum + (Number(track.cacheSize) || 0), 0);
  if (els.downloadedStatus) {
    els.downloadedStatus.textContent = total
      ? appendBatchStatus(`${total} downloaded song${total === 1 ? "" : "s"} · ${formatBytes(bytes)} used`)
      : appendBatchStatus("No downloaded songs yet.");
  }
  for (const button of els.downloadedFilters?.querySelectorAll("[data-downloaded-filter]") || []) {
    button.classList.toggle("active", button.dataset.downloadedFilter === state.downloadedFilter);
  }
  if (els.downloadedSortSelect) els.downloadedSortSelect.value = state.downloadedSort;
  if (els.downloadedPlayButton) {
    els.downloadedPlayButton.disabled = !tracks.length;
    els.downloadedPlayButton._tracks = playbackTracks;
    els.downloadedPlayButton._queueSource = queueSource("downloads", "Downloaded");
  }
  if (els.downloadedShuffleButton) {
    els.downloadedShuffleButton.disabled = !tracks.length;
    els.downloadedShuffleButton._tracks = playbackTracks;
    els.downloadedShuffleButton._queueSource = queueSource("downloads", "Downloaded");
  }
  if (els.downloadedClearButton) els.downloadedClearButton.disabled = !total;
  if (!els.downloadedResults) return;
  if (!tracks.length) {
    els.downloadedResults.innerHTML = `<p class="status">${state.downloadedQuery ? "No downloaded songs match this search." : "No downloaded songs yet. Use Cache offline from a song menu."}</p>`;
    els.downloadedResults._items = [];
    return;
  }
  els.downloadedResults.innerHTML = downloadedRowsHtml(tracks);
  els.downloadedResults._items = tracks;
  els.downloadedResults._playbackItems = playbackTracks;
  els.downloadedResults._queueSource = queueSource("downloads", "Downloaded");
}

function visibleLocalTracks({ ignoreSearch = false } = {}) {
  let tracks = ignoreSearch
    ? [...(state.localMusicData?.tracks || [])]
    : filterByQuery(state.localMusicData?.tracks || [], state.localMusicQuery);
  if (state.localMusicFolder) tracks = tracks.filter((track) => String(track.localPath || "").startsWith(state.localMusicFolder));
  tracks = [...tracks];
  if (state.localMusicSort === "title") tracks.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  else if (state.localMusicSort === "artist") tracks.sort((a, b) => String(a.artist || "").localeCompare(String(b.artist || "")));
  else if (state.localMusicSort === "album") tracks.sort((a, b) => String(a.album?.title || "").localeCompare(String(b.album?.title || "")));
  else if (state.localMusicSort === "duration") tracks.sort((a, b) => Number(b.lengthSeconds || 0) - Number(a.lengthSeconds || 0));
  else tracks.sort((a, b) => String(b.modifiedAt || "").localeCompare(String(a.modifiedAt || "")));
  return tracks;
}

function renderLocalMusic() {
  const tracks = visibleLocalTracks();
  const playbackTracks = visibleLocalTracks({ ignoreSearch: true });
  const folders = state.localMusicData?.folders || [];
  if (els.localMusicStatus) {
    els.localMusicStatus.textContent = folders.length
      ? `${tracks.length} song${tracks.length === 1 ? "" : "s"} on this device`
      : "Choose a folder to build your local music library.";
  }
  if (els.localMusicPlayButton) els.localMusicPlayButton.disabled = playbackTracks.length === 0;
  if (els.localMusicRescanButton) els.localMusicRescanButton.disabled = folders.length === 0;
  if (els.localMusicClearButton) els.localMusicClearButton.disabled = folders.length === 0 && playbackTracks.length === 0;
  if (els.localMusicFolderSelect) {
    const value = state.localMusicFolder;
    els.localMusicFolderSelect.innerHTML = `<option value="">All folders</option>${(state.localMusicData?.folders || []).map((folder) => `<option value="${escapeText(folder.path)}">${escapeText(folder.name)} (${Number(folder.count || 0)})</option>`).join("")}`;
    els.localMusicFolderSelect.value = value;
  }
  if (els.localMusicLayoutButton) {
    const switchingToList = state.localMusicLayout === "grid";
    const label = switchingToList ? "List view" : "Grid view";
    els.localMusicLayoutButton.innerHTML = standardIconSvg(switchingToList ? "list" : "grid");
    els.localMusicLayoutButton.setAttribute("aria-label", label);
    els.localMusicLayoutButton.title = label;
  }
  if (!els.localMusicResults) return;
  const gridView = state.localMusicLayout === "grid";
  els.localMusicResults.classList.toggle("local-grid", gridView);
  els.localMusicResults.classList.toggle("cards", gridView);
  els.localMusicResults.classList.toggle("liked-results", !gridView);
  els.localMusicResults.innerHTML = tracks.length
    ? gridView
      ? cardsHtml(tracks, "track")
      : unifiedTrackRowsHtml(tracks, {
          detailLabel: (track) => [
            track.album?.title,
            track.codec || "Local",
            track.bitrate ? `${Math.round(track.bitrate / 1000)}k` : ""
          ].filter(Boolean).join(" · ")
        })
    : folders.length
      ? `<div class="empty-collection"><strong>No local songs found</strong><span>Change the current filters or rescan your folders.</span></div>`
      : `<div class="empty-collection"><strong>No local music yet</strong><span>Add a folder to build your local music library.</span></div>`;
  els.localMusicResults._items = tracks;
  els.localMusicResults._playbackItems = playbackTracks;
  els.localMusicResults._queueSource = queueSource("local-music", "Local Music");
  return;
  els.localMusicResults.classList.toggle("local-grid", state.localMusicLayout === "grid");
  els.localMusicResults.innerHTML = tracks.length ? tracks.map((track, index) => `
    <article id="local-track-${escapeText(track.id)}" class="local-track ${state.currentTrack?.id === track.id ? "active" : ""}" data-local-track="${index}">
      <button class="local-track-main" data-local-play="${index}" type="button"><span class="thumb" style="background-image:${thumbnailStyle(track)}"><span class="card-play">${standardIconSvg(state.currentTrack?.id === track.id && state.playing ? "pause" : "play")}</span></span><span class="local-track-copy"><strong>${escapeText(track.title)}</strong><small>${escapeText(track.artist || "Unknown artist")}</small><em>${escapeText(track.album?.title || track.codec || "Local music")}</em></span></button>
      <span class="quality-badge">${escapeText(track.codec || "Local")}${track.bitrate ? ` · ${Math.round(track.bitrate / 1000)}k` : ""}</span>
    </article>`).join("") : `<div class="empty-collection"><strong>No local songs found</strong><span>Add a folder or change the current filters.</span></div>`;
  els.localMusicResults._items = tracks;
  els.localMusicResults._playbackItems = playbackTracks;
}

async function loadLocalMusic() {
  switchView("localMusic");
  if (els.localMusicResults) els.localMusicResults.innerHTML = skeletonHtml(state.localMusicLayout === "grid" ? "cards" : "rows", 8);
  state.localMusicData = await window.metro.localMusic();
  renderLocalMusic();
}

async function scanLocalMusicFolder(selectNew = false) {
  if (els.localMusicStatus) els.localMusicStatus.textContent = "Scanning audio files and reading metadata…";
  const result = selectNew ? await window.metro.selectLocalMusicFolder() : await window.metro.rescanLocalMusic(state.localMusicFolder || state.localMusicData?.folders?.[0]?.path);
  if (result?.canceled) return;
  state.localMusicData = result;
  if (result.activeFolder) state.localMusicFolder = result.activeFolder;
  renderLocalMusic();
}

async function loadDownloaded() {
  switchView("downloaded");
  if (els.downloadedStatus) els.downloadedStatus.textContent = "Loading downloaded songs...";
  if (els.downloadedResults) els.downloadedResults.innerHTML = skeletonHtml("rows", 8);
  await refreshOfflineCache();
  renderDownloaded();
  toast("Downloaded songs loaded.");
}

async function clearDownloadedSongs() {
  if (!state.offlineCache?.tracks?.length || !window.metro?.cacheClear) return;
  const confirmed = window.confirm("Remove all downloaded songs from this device?");
  if (!confirmed) return;
  els.downloadedClearButton.disabled = true;
  try {
    const result = await window.metro.cacheClear();
    applyOfflineCacheResult(result);
    localStorage.removeItem(CACHE_META_KEY);
    renderOfflineDependentViews();
    toast("Downloaded songs cleared.");
  } catch (error) {
    toast(error.message || "Clear downloads failed.", true);
  } finally {
    els.downloadedClearButton.disabled = !(state.offlineCache?.tracks?.length);
  }
}

function renderLibraryCollection(title, items, kind, emptyText) {
  const statusText = items.length
    ? `${items.length} item${items.length === 1 ? "" : "s"}`
    : emptyText;
  const sectionTitle = kind === "songs"
      ? `<h2><button class="library-section-link" data-library-action="liked" type="button">${escapeText(title)}<span>View all ${standardIconSvg("arrow-right")}</span></button></h2>`
    : `<h2>${escapeText(title)}</h2>`;
  if (!items.length) {
    return `
      <section class="library-section">
        <div class="section-head home-section-head">
          <div>
            ${sectionTitle}
            <span class="status">${escapeText(statusText)}</span>
          </div>
        </div>
      </section>
    `;
  }

  const content = kind === "songs"
    ? `<div class="liked-results library-liked-results" data-library-kind="${kind}">${likedRowsHtml(items)}</div>`
    : kind === "downloads"
      ? `<div class="rows library-tracks" data-library-kind="${kind}">${rowsHtml(items.slice(0, 30))}</div>`
    : `<div class="cards library-cards" data-library-kind="${kind}">${cardsHtml(items.slice(0, 24), "browse")}</div>`;

  return `
    <section class="library-section">
      <div class="section-head home-section-head">
        <div>
          ${sectionTitle}
          <span class="status">${escapeText(statusText)}</span>
        </div>
      </div>
      ${content}
    </section>
  `;
}

function setLibrarySectionItems(data, filtered) {
  for (const element of els.librarySections.querySelectorAll("[data-library-kind]")) {
    const kind = element.dataset.libraryKind;
    element._items = filtered[kind] || [];
    // Library search only filters what is rendered. Playback keeps the full
    // current library category (with its selected sort) as its queue context.
    element._playbackItems = kind === "songs"
      ? [...(data?.songs || [])]
      : sortLibraryItems(data?.[kind] || [], kind);
    if (kind === "songs") element._queueSource = queueSource("liked", "Liked Songs");
  }
}

function renderLibrary(data = state.libraryData) {
  data = mergeOfflineDownloads(data);
  const canonicalLikedTracks = state.likedData
    ? likedRawTracks(state.likedData)
    : [];
  data = { ...data, songs: canonicalLikedTracks };
  state.libraryData = data;
  setAuthoritativeLikedTracks(canonicalLikedTracks);
  renderCurrentTrackActions();
  const metrolistFilters = new Set(["all", "playlists", "songs", "albums", "artists", "podcasts"]);
  if (!metrolistFilters.has(state.libraryFilter)) state.libraryFilter = "all";
  const counts = libraryCounts(data);
  const total = counts.songs + counts.playlists + counts.albums + counts.artists + counts.podcasts;
  const syncErrors = Object.values(data?.sync?.errors || {}).filter(Boolean);
  els.libraryStatus.textContent = appendBatchStatus(state.auth?.signedIn
    ? `${total} saved item${total === 1 ? "" : "s"} across playlists, songs, albums, artists and podcasts.${counts.downloads ? ` ${counts.downloads} offline.` : ""}${syncErrors.length ? ` ${syncErrors.length} source${syncErrors.length === 1 ? "" : "s"} need attention.` : ""}`
    : "Sign in to load your YouTube Music library.");
  if (els.librarySortSelect) els.librarySortSelect.value = state.librarySort;

  for (const button of els.libraryFilters.querySelectorAll("[data-library-filter]")) {
    button.classList.toggle("active", button.dataset.libraryFilter === state.libraryFilter);
  }

  const filtered = {
    songs: filterByQuery(data?.songs || [], state.libraryQuery),
    playlists: sortLibraryItems(filterByQuery(data?.playlists || [], state.libraryQuery), "playlists"),
    albums: sortLibraryItems(filterByQuery(data?.albums || [], state.libraryQuery), "albums"),
    artists: sortLibraryItems(filterByQuery(data?.artists || [], state.libraryQuery), "artists"),
    podcasts: sortLibraryItems(filterByQuery(data?.podcasts || [], state.libraryQuery), "podcasts"),
    downloads: sortLibraryItems(filterByQuery(data?.downloads || [], state.libraryQuery), "downloads")
  };
  const sections = [];
  if (state.libraryFilter === "all" || state.libraryFilter === "playlists") {
    sections.push(renderLibraryCollection("Playlists", filtered.playlists, "playlists", "No saved playlists loaded."));
  }
  if (state.libraryFilter === "all" || state.libraryFilter === "songs") {
    sections.push(renderLibraryCollection("Liked songs", filtered.songs, "songs", "No liked songs loaded."));
  }
  if (state.libraryFilter === "all" || state.libraryFilter === "albums") {
    sections.push(renderLibraryCollection("Albums", filtered.albums, "albums", "No saved albums loaded."));
  }
  if (state.libraryFilter === "all" || state.libraryFilter === "artists") {
    sections.push(renderLibraryCollection("Artists", filtered.artists, "artists", "No followed artists loaded."));
  }
  if (state.libraryFilter === "all" || state.libraryFilter === "podcasts") {
    sections.push(renderLibraryCollection("Podcasts", filtered.podcasts, "podcasts", "No saved podcasts loaded."));
  }

  els.libraryResults.classList.add("hidden");
  els.librarySections.classList.remove("hidden");
  renderLibraryRecent(data || {});
  if (state.libraryFilter === "all" && !state.libraryQuery) {
    renderLibraryHighlights(data || {}, counts);
    renderLibrarySyncCards(data || {}, counts);
  }
  els.librarySections.innerHTML = sections.join("");
  setLibrarySectionItems(data, filtered);
}

function historySections(data = state.historyData) {
  return (data?.sections || [])
    .map((section) => ({
      ...section,
      tracks: uniqueTracks(section.tracks || [])
    }))
    .filter((section) => section.tracks.length);
}

function historyTracks(data = state.historyData) {
  return uniqueTracks(historySections(data).flatMap((section) => section.tracks));
}

function historyRowsHtml(items) {
  return unifiedTrackRowsHtml(items, { detailLabel: "History" });
  /* Legacy markup retained temporarily for migration safety; unreachable. */
  return items.map((item, index) => `
    <div class="history-row ${state.currentTrack?.id === item.id ? "active" : ""}" data-index="${index}" data-track-id="${escapeText(item.id || "")}">
      <button class="history-main" data-history-play="${index}" type="button">
        <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
      <span class="track-inline-play" data-playback-indicator aria-hidden="true">${standardIconSvg(state.currentTrack?.id === item.id && state.playing ? "pause" : "play")}</span>
        <span>
          <span class="title">${escapeText(item.title)}</span>
          <span class="subtitle">${escapeText(item.subtitle || item.artist || "YouTube Music")}</span>
        </span>
      </button>
      <span class="history-duration">${escapeText(item.duration || "")}</span>
      ${moreTriggerHtml("history-more")}
      <button class="history-remove" data-history-remove="${index}" type="button" ${item.historyRemoveToken ? "" : "disabled"}>
        Remove
      </button>
      ${downloadTriggerHtml(item)}
    </div>
  `).join("");
}

function renderHistory(result = state.historyData) {
  state.historyData = result || { sections: [] };
  const sections = historySections(state.historyData);
  const tracks = historyTracks(state.historyData);
  els.historyPlayButton.disabled = !tracks.length;
  els.historyShuffleButton.disabled = !tracks.length;
  if (els.historyCreatePlaylistButton) els.historyCreatePlaylistButton.disabled = !recentPlaylistTracks().length;
  els.historyPlayButton._tracks = tracks;
  els.historyShuffleButton._tracks = tracks;
  els.historyPlayButton._queueSource = queueSource("history", "History");
  els.historyShuffleButton._queueSource = els.historyPlayButton._queueSource;

  if (!sections.length) {
    els.historyStatus.textContent = "No history loaded.";
    els.historyResults.innerHTML = `<p class="status">No listening history found for this account.</p>`;
    return;
  }

  els.historyStatus.textContent = `${tracks.length} recent item${tracks.length === 1 ? "" : "s"} across ${sections.length} section${sections.length === 1 ? "" : "s"}.`;
  els.historyResults.innerHTML = sections.map((section, index) => `
    <section class="history-section">
      <div class="section-head compact-head">
        <h2>${escapeText(section.title || "History")}</h2>
        <span class="status">${section.tracks.length} item${section.tracks.length === 1 ? "" : "s"}</span>
      </div>
      <div class="history-rows" data-history-section="${index}">
        ${historyRowsHtml(section.tracks)}
      </div>
    </section>
  `).join("");

  for (const rows of els.historyResults.querySelectorAll("[data-history-section]")) {
    const section = sections[Number(rows.dataset.historySection)];
    rows._items = section?.tracks || [];
    rows._queueSource = queueSource("history", section?.title || "History");
  }
}

function recentPlaylistTracks(limit = 50) {
  return uniqueTracks([
    ...(state.queueHistory || []),
    ...historyTracks(state.historyData)
  ].filter(isTrackItem)).slice(0, limit);
}

async function createRecentPlaylist() {
  const tracks = recentPlaylistTracks(50);
  if (!tracks.length) {
    toast("No recent tracks available for a playlist.", true);
    return;
  }
  const stamp = new Date().toISOString().slice(0, 10);
  const title = `Auralane Recent ${stamp}`;
  if (els.historyCreatePlaylistButton) {
    els.historyCreatePlaylistButton.disabled = true;
    els.historyCreatePlaylistButton.textContent = "Creating...";
  }
  try {
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    const result = await window.metro.createPlaylist({
      title,
      videoIds: tracks.map((track) => track.id).filter(Boolean)
    });
    setSyncState("playlists", { status: "synced", pending: 0, error: "", updatedAt: new Date().toISOString() });
    if (result?.playlistId) {
      syncLibraryItem({
        id: result.playlistId,
        browseId: `VL${result.playlistId}`,
        type: "playlist",
        kind: "playlist",
        title,
        subtitle: `${tracks.length} recent tracks`,
        thumbnail: tracks[0]?.thumbnail || ""
      }, true);
    }
    toast(`Created playlist: ${title}`);
  } catch (error) {
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Create recent playlist failed." });
    enqueueSyncAction("playlist-create", { title, videoIds: tracks.map((track) => track.id).filter(Boolean) }, `Create playlist: ${title}`);
    toast(error.message || "Create recent playlist failed.", true);
  } finally {
    if (els.historyCreatePlaylistButton) {
      els.historyCreatePlaylistButton.disabled = !recentPlaylistTracks().length;
      els.historyCreatePlaylistButton.textContent = "Create recent playlist";
    }
  }
}

function recentSevenDayStats() {
  const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
  return statsEntries().filter((item) => {
    const time = new Date(item.lastPlayedAt || 0).getTime();
    return Number.isFinite(time) && time >= cutoff;
  });
}

function smartPlaylistTracks(rule = els.smartPlaylistRule?.value || "recent-7") {
  const liked = likedRawTracks();
  const downloads = state.offlineCache?.tracks || [];
  const librarySongs = state.libraryData?.songs || [];
  const all = uniqueTracks([
    ...liked,
    ...librarySongs,
    ...downloads,
    ...state.queueHistory,
    ...state.queue
  ].filter(isTrackItem));
  if (rule === "recent-7") {
    const byId = new Map(all.map((track) => [track.id, track]));
    return recentSevenDayStats()
      .map((stat) => byId.get(stat.id) || stat)
      .filter(isTrackItem)
      .slice(0, 50);
  }
  if (rule === "liked-not-downloaded") {
    return liked.filter((track) => !isOfflineCached(track.id)).slice(0, 80);
  }
  if (rule === "downloaded-stale") {
    const recentIds = new Set(state.queueHistory.slice(0, 30).map((track) => track.id));
    return downloads.filter((track) => !recentIds.has(track.id)).slice(0, 80);
  }
  if (rule === "current-artist") {
    const artist = playableArtistFromTrack(state.currentTrack)?.title || state.currentTrack?.artist || state.currentTrack?.subtitle || "";
    if (!artist) return [];
    const needle = artist.toLowerCase();
    return all.filter((track) => String(track.artist || track.subtitle || "").toLowerCase().includes(needle)).slice(0, 80);
  }
  if (rule === "sleep") {
    return all.filter((track) => /sleep|calm|lofi|acoustic|piano|chill|ambient|夜|眠|睡/i.test(`${track.title} ${track.subtitle} ${track.artist}`)).slice(0, 60);
  }
  if (rule === "commute") {
    return uniqueTracks([...state.queueHistory, ...downloads, ...liked].filter(isTrackItem)).slice(0, 60);
  }
  if (rule === "energy") {
    return all.filter((track) => {
      const text = `${track.title} ${track.subtitle} ${track.artist}`;
      return /remix|dance|club|live|rock|beat|workout|energy|快|熱血/i.test(text) || durationSeconds(track.duration) <= 240;
    }).slice(0, 60);
  }
  return [];
}

function smartPlaylistTitle(rule = els.smartPlaylistRule?.value || "recent-7") {
  const labels = {
    "recent-7": "Auralane Most Played",
    "liked-not-downloaded": "Auralane Liked Not Downloaded",
    "downloaded-stale": "Auralane Rediscover Downloads",
    "current-artist": `Auralane ${playableArtistFromTrack(state.currentTrack)?.title || "Artist"} Mix`,
    sleep: "Auralane Sleep Queue",
    commute: "Auralane Commute Queue",
    energy: "Auralane High Energy"
  };
  return `${labels[rule] || "Auralane Smart Playlist"} ${new Date().toISOString().slice(0, 10)}`;
}

async function createSmartPlaylist() {
  const rule = els.smartPlaylistRule?.value || "recent-7";
  const tracks = smartPlaylistTracks(rule);
  if (!tracks.length) {
    if (els.smartPlaylistStatus) els.smartPlaylistStatus.textContent = "No tracks matched this rule. Load Library, Liked Songs or Downloads first.";
    toast("No tracks matched this smart rule.", true);
    return;
  }
  const title = smartPlaylistTitle(rule);
  els.smartPlaylistCreate.disabled = true;
  els.smartPlaylistStatus.textContent = `Creating ${title} with ${tracks.length} songs...`;
  try {
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    const result = await window.metro.createPlaylist({ title, videoIds: tracks.map((track) => track.id) });
    setSyncState("playlists", { status: "synced", pending: 0, error: "", updatedAt: new Date().toISOString() });
    els.smartPlaylistStatus.textContent = result?.playlistId
      ? `Created ${title}.`
      : `Create request sent for ${title}.`;
    toast(`Created playlist: ${title}`);
  } catch (error) {
    enqueueSyncAction("playlist-create", { title, videoIds: tracks.map((track) => track.id) }, `Create smart playlist: ${title}`);
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    els.smartPlaylistStatus.textContent = "Create failed and was added to Sync Outbox.";
    toast("Smart playlist queued in Outbox.", true);
  } finally {
    els.smartPlaylistCreate.disabled = false;
  }
}

function runLibraryHealthCheck() {
  const tracks = uniqueTracks([...(likedRawTracks() || []), ...(state.libraryData?.songs || []), ...(state.offlineCache?.tracks || [])].filter(isTrackItem));
  const titleMap = new Map();
  const duplicates = [];
  for (const track of tracks) {
    const key = `${String(track.title || "").toLowerCase()}|${String(track.artist || track.subtitle || "").toLowerCase()}`;
    if (titleMap.has(key)) duplicates.push(track);
    else titleMap.set(key, track);
  }
  const failed = tracks.filter((track) => state.playbackFailedIds.has(track.id) || track.playbackFailed);
  const missingOffline = (state.offlineCache?.stats?.missingIds || []).length;
  state.healthReport = { duplicates, failed, missingOffline, checkedAt: new Date().toISOString() };
  renderLibraryHealth();
}

function renderLibraryHealth() {
  if (!els.healthCheckStatus || !els.healthCheckResults) return;
  const report = state.healthReport;
  if (!report) {
    els.healthCheckStatus.textContent = "Checks duplicates, failed playback and missing offline files.";
    els.healthCheckResults.innerHTML = "";
    return;
  }
  els.healthCheckStatus.textContent = `${report.duplicates.length} duplicates, ${report.failed.length} failed playback, ${report.missingOffline} missing offline files.`;
  const rows = [
    ["Duplicate songs", `${report.duplicates.length} possible duplicate title/artist matches`],
    ["Playback failures", `${report.failed.length} songs failed during this session`],
    ["Missing offline files", `${report.missingOffline} cached records point to missing files`]
  ];
  els.healthCheckResults.innerHTML = rows.map(([title, detail]) => `
    <div class="settings-list-row"><div><strong>${escapeText(title)}</strong><small>${escapeText(detail)}</small></div></div>
  `).join("");
}

function normalizedGameAnswer(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lyricsGameTrackDurationSeconds(track) {
  return Number(track?.lengthSeconds || track?.durationSeconds || 0) ||
    durationSeconds(track?.duration || track?.durationText || "");
}

function lyricsGameLooseTextMatch(left, right) {
  const a = normalizedGameAnswer(left);
  const b = normalizedGameAnswer(right);
  if (!a || !b) return false;
  if (a === b) return true;
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  return shorter.length >= 4 && longer.includes(shorter);
}

function lyricsGameArtistText(track) {
  return track?.artist || lyricsSearchArtistFromTrack(track) || track?.subtitle || "";
}

function lyricsGameResultMatchesTrack(result, track) {
  if (!result?.found || !result.lines?.length) return false;
  if (result.providerKey === "youtube-transcript" || result.provider === "YouTube Music") return true;

  const titleOk = lyricsGameLooseTextMatch(result.title, track?.title);
  const artistOk = lyricsGameLooseTextMatch(result.artist, lyricsGameArtistText(track));
  const resultDuration = Number(result.duration || 0);
  const trackDuration = lyricsGameTrackDurationSeconds(track);
  const hasDurations = resultDuration > 0 && trackDuration > 0;
  const durationOk = hasDurations && Math.abs(resultDuration - trackDuration) <= 8;

  return titleOk && (artistOk || durationOk);
}

function gameTrackPool() {
  return uniqueTracks([
    state.currentTrack,
    ...(state.queue || []),
    ...(state.queueHistory || []),
    ...(tracksFromResult(state.likedData) || []),
    ...(state.libraryData?.songs || []),
    ...(state.libraryData?.downloads || []),
    ...(state.offlineCache?.tracks || [])
  ].filter(isTrackItem));
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const LYRICS_GAME_LEVELS = [
  { id: "b1", name: "Beginner", ratio: 0.1, fallback: 30, tone: "easy" },
  { id: "i1", name: "Intermediate", ratio: 0.2, fallback: 60, tone: "medium" },
  { id: "a1", name: "Advanced", ratio: 0.38, fallback: 121, tone: "hard" },
  { id: "e1", name: "Expert", ratio: 1, fallback: Infinity, tone: "expert" }
];

function lyricsGameLevelConfig(level = state.lyricFillLevel) {
  return LYRICS_GAME_LEVELS.find((item) => item.id === level) || LYRICS_GAME_LEVELS[0];
}

function updateGamesStatus() {
  const lyricCount = state.lyricFillLyrics?.found ? (state.lyricFillLyrics.lines || []).length : 0;
  if (els.gamesStatus) {
    els.gamesStatus.textContent = state.activeGame === "lyrics"
      ? `${state.lyricFillTrack?.title || "No song selected"}. ${lyricCount} lyric line${lyricCount === 1 ? "" : "s"} loaded.`
      : state.activeGame === "rhythm"
        ? `${state.lyricFillTrack?.title || "No song selected"}. Decode the real audio and take the stage.`
        : state.activeGame === "heardle"
          ? `Song ${Math.min(heardleState.session.length + 1, heardleState.sessionLength)} of ${heardleState.sessionLength}. Listen, search, and lock your guess.`
          : "Choose a challenge and turn your library into a playable session.";
  }
  if (els.lyricsFillScore) {
    els.lyricsFillScore.textContent = `${state.lyricFillScore.correct} / ${state.lyricFillScore.total}`;
  }
}

function showLyricsGameStage(stage) {
  state.lyricFillStage = stage;
  if (stage !== "search") setLyricsGameLoadingLyrics(false);
  document.body.classList.toggle("lyrics-game-play-active", stage === "play");

  els.lyricsGameSearchStage?.classList.toggle("hidden", stage !== "search");
  els.lyricsGameLevelStage?.classList.toggle("hidden", stage !== "level");

  els.lyricsFillGame?.classList.toggle("hidden", !(stage === "play" && state.activeGame === "lyrics"));
  document.getElementById("heardleGame")?.classList.toggle("hidden", !(stage === "play" && state.activeGame === "heardle"));
  document.getElementById("rhythmGame")?.classList.toggle("hidden", !(stage === "play" && state.activeGame === "rhythm"));

  els.lyricsGamePlayStage?.classList.toggle("hidden", !(stage === "play" && state.activeGame === "lyrics"));

  els.lyricsFillGame?.classList.toggle("lyrics-game-search-mode", stage === "search");
  els.lyricsFillGame?.classList.toggle("lyrics-game-level-mode", stage === "level");
  els.lyricsFillGame?.classList.toggle("lyrics-game-play-mode", stage === "play");

  if (stage !== "play") {
    stopLyricsGameTimer();
    hideLyricsGamePauseMenu();
  }
}

function lyricsGameLineTexts() {
  return lyricsGameLineEntries().map((line) => line.text);
}

function lyricsGameLineEntries() {
  return (state.lyricFillLyrics?.lines || [])
    .map((line) => {
      const rawTime = line?.time;
      const time = rawTime === null || rawTime === undefined || rawTime === ""
        ? null
        : (Number.isFinite(Number(rawTime)) ? Number(rawTime) : null);
      return {
        text: String(line?.text || "").trim(),
        time
      };
    })
    .filter((line) => line.text);
}

function tokenizeLyricsGameLine(text, lineIndex, wordRefs) {
  const tokens = [];
  for (const part of window.AuralaneGameRules.words(text)) {
    if (!part.word) {
      tokens.push({ type: "text", value: part.value });
      continue;
    }
    const tokenIndex = tokens.length;
    const value = part.value;
    tokens.push({ type: "word", value, lineIndex, tokenIndex });
    if (normalizedGameAnswer(value).length > 0) {
      wordRefs.push({ lineIndex, tokenIndex, answer: value, key: `${lineIndex}:${tokenIndex}` });
    }
  }
  return tokens;
}

function lyricsGameWordTotal() {
  const wordRefs = [];
  for (const [lineIndex, text] of lyricsGameLineTexts().entries()) {
    tokenizeLyricsGameLine(text, lineIndex, wordRefs);
  }
  return wordRefs.length;
}

function lyricGameGapCountForLevel(level, totalWords = lyricsGameWordTotal()) {
  const config = lyricsGameLevelConfig(level);
  if (!totalWords) return 0;
  if (config.id === "e1") return totalWords;
  const ratioCount = Math.max(1, Math.round(totalWords * config.ratio));
  return Math.min(totalWords, ratioCount);
}

function buildLyricsGameModel(level = state.lyricFillLevel) {
  const lineEntries = lyricsGameLineEntries();
  const lines = lineEntries.map((line) => line.text);
  const wordRefs = [];
  const tokenLines = lines.map((text, lineIndex) => tokenizeLyricsGameLine(text, lineIndex, wordRefs));
  const totalWords = wordRefs.length;
  const gapCount = lyricGameGapCountForLevel(level, totalWords);
  const selected = new Set();
  if (gapCount >= totalWords) {
    for (let index = 0; index < totalWords; index += 1) selected.add(index);
  } else {
    const step = totalWords / Math.max(1, gapCount);
    for (let index = 0; index < gapCount; index += 1) {
      selected.add(Math.min(totalWords - 1, Math.floor(index * step + step * 0.35)));
    }
  }
  const gapRefs = [...selected].sort((a, b) => a - b).map((wordIndex, gapIndex) => ({
    ...wordRefs[wordIndex],
    index: gapIndex,
    revealed: false,
    status: "pending",
    choiceStatus: null,
    choices: null
  }));
  const gapMap = new Map(gapRefs.map((gap) => [gap.key, gap]));
  return {
    level,
    tokenLines,
    lineTimes: lineEntries.map((line) => line.time),
    lineCursor: -1,
    lineCursorEnteredAt: Date.now(),
    lastLineAdvanceAt: Date.now(),
    totalWords,
    gaps: gapRefs,
    gapMap,
    currentGapIndex: 0,
    stats: { score: 0, hits: 0, fails: 0, skips: 0, bonus: 1, streak: 0, lives: 1 },
    audioResolving: false,
    audioUnavailable: false,
    holdingForChoice: null,
    paused: false,
    finished: false,
    givenUp: false
  };
}

function lyricsGameUniqueWords() {
  const words = [];
  for (const text of lyricsGameLineTexts()) {
    for (const part of window.AuralaneGameRules.words(text)) {
      if (part.word && normalizedGameAnswer(part.value).length) words.push(part.value);
    }
  }
  return [...new Map(words.map((word) => [normalizedGameAnswer(word), word])).values()];
}

function shuffleBySeed(items, seed) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.abs(Math.sin(seed + index) * 10000) % 1;
    const target = Math.floor(swap * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}

function pushUniqueLyricsChoice(choices, value) {
  const text = String(value || "").trim();
  const key = normalizedGameAnswer(text);
  if (!key || choices.some((item) => normalizedGameAnswer(item) === key)) return false;
  choices.push(text);
  return true;
}

function lyricsGameFutureAnswers(gap) {
  const game = state.lyricFillGame;
  if (!game || !gap) return [];
  return [game.gaps[gap.index + 1]?.answer, game.gaps[gap.index + 2]?.answer].filter(Boolean);
}

function lyricsGameRandomChoice(gap, exclude = []) {
  const answerKey = normalizedGameAnswer(gap.answer);
  const excludeKeys = new Set([answerKey, ...exclude.map(normalizedGameAnswer)]);
  const pool = lyricsGameUniqueWords()
    .filter((word) => !excludeKeys.has(normalizedGameAnswer(word)))
    .sort((a, b) => Math.abs(a.length - gap.answer.length) - Math.abs(b.length - gap.answer.length));
  const picked = shuffleBySeed(pool.slice(0, 24), gap.index + exclude.length + 19);
  const fallbackWords = /\p{Script=Han}/u.test(gap.answer) ? ["天空", "回憶", "遠方", "溫柔", "明天", "我們", "星光", "自由"] : ["Now", "Days", "Back", "Never", "Town", "For", "Love", "Time"];
  const fallback = shuffleBySeed(fallbackWords, gap.index + 33)
    .filter((word) => !excludeKeys.has(normalizedGameAnswer(word)));
  return picked[0] || fallback[0] || "Again";
}

function lyricsGameChoicesForGap(gap, options = {}) {
  if (!gap) return [];
  if (!options.force && Array.isArray(gap.choices) && gap.choices.length === 4) return gap.choices;

  if (Array.isArray(options.previousChoices) && Number.isInteger(options.replaceIndex)) {
    const next = options.previousChoices.slice(0, 4);
    const replaceIndex = Math.max(0, Math.min(3, options.replaceIndex));
    const kept = next.filter((_choice, index) => index !== replaceIndex);
    if (!kept.some((choice) => normalizedGameAnswer(choice) === normalizedGameAnswer(gap.answer))) {
      next[replaceIndex] = gap.answer;
      gap.choices = next;
      return gap.choices;
    }
    const replacementCandidates = [
      state.lyricFillGame?.gaps?.[gap.index + 2]?.answer,
      state.lyricFillGame?.gaps?.[gap.index + 3]?.answer,
      lyricsGameRandomChoice(gap, kept)
    ];
    const replacement = replacementCandidates.find((choice) => {
      const key = normalizedGameAnswer(choice);
      return key && !kept.some((item) => normalizedGameAnswer(item) === key);
    }) || lyricsGameRandomChoice(gap, kept);
    next[replaceIndex] = replacement;
    gap.choices = next;
    return gap.choices;
  }

  const choices = [];
  pushUniqueLyricsChoice(choices, gap.answer);
  for (const answer of lyricsGameFutureAnswers(gap)) pushUniqueLyricsChoice(choices, answer);
  while (choices.length < 4) {
    const fallback = lyricsGameRandomChoice(gap, choices);
    if (!pushUniqueLyricsChoice(choices, fallback)) break;
  }
  for (const fallback of ["Now", "Days", "Back", "Never", "Town", "For", "Love", "Time"]) {
    if (choices.length >= 4) break;
    pushUniqueLyricsChoice(choices, fallback);
  }
  gap.choices = shuffleBySeed(choices.slice(0, 4), gap.index + gap.answer.length);
  return gap.choices;
}

function currentLyricsGameGap() {
  const game = state.lyricFillGame;
  if (!game) return null;
  return game.gaps[game.currentGapIndex] || null;
}

function lyricsGameGapForCursor(game, cursor = game?.lineCursor ?? -1) {
  if (!game?.gaps?.length) return null;
  const lineIndex = Number.isFinite(cursor) ? cursor : -1;
  const pending = game.gaps.filter((gap) => !gap.revealed);
  if (!pending.length) return null;
  if (lineIndex < 0) return pending[0];
  return pending.find((gap) => gap.lineIndex === lineIndex) ||
    pending.find((gap) => gap.lineIndex > lineIndex) ||
    [...pending].reverse().find((gap) => gap.lineIndex < lineIndex) ||
    null;
}

function syncLyricsGameGapToCursor(game = state.lyricFillGame) {
  if (!game || game.finished || game.givenUp) return false;
  const target = lyricsGameGapForCursor(game);
  if (!target || target.index === game.currentGapIndex) return false;
  game.currentGapIndex = target.index;
  lyricsGameChoicesForGap(target);
  return true;
}

function lyricsGameLineIndexForTime(game, seconds) {
  if (!game?.lineTimes?.length || !Number.isFinite(seconds)) return -1;
  let current = -1;
  for (let index = 0; index < game.lineTimes.length; index += 1) {
    const time = game.lineTimes[index];
    if (!Number.isFinite(time)) continue;
    if (time <= seconds + 0.12) current = index;
    else break;
  }
  return current;
}

function lyricsGamePlaybackDurationSeconds() {
  const audioDuration = Number(els.lyricsGameAudio?.duration || 0);
  if (Number.isFinite(audioDuration) && audioDuration > 0) return audioDuration;
  const track = state.lyricFillTrack || {};
  const numericDuration = Number(track.lengthSeconds || track.durationSeconds || state.lyricFillLyrics?.duration || 0);
  if (Number.isFinite(numericDuration) && numericDuration > 0) {
    return numericDuration > 1000 ? numericDuration / 1000 : numericDuration;
  }
  return durationSeconds(track.duration || track.durationText || "");
}

function estimatedLyricsGameLineIndex(game, seconds) {
  const lineCount = game?.tokenLines?.length || 0;
  const duration = lyricsGamePlaybackDurationSeconds();
  if (!lineCount || !Number.isFinite(seconds) || !Number.isFinite(duration) || duration <= 0) return -1;
  const progress = Math.max(0, Math.min(0.999, seconds / duration));
  return Math.max(0, Math.min(lineCount - 1, Math.floor(progress * lineCount)));
}

function lyricsGameLineStartSeconds(game, lineIndex) {
  const index = Math.max(0, Math.min((game?.tokenLines?.length || 1) - 1, Number(lineIndex) || 0));
  const exact = game?.lineTimes?.[index];
  if (Number.isFinite(exact)) return Math.max(0, exact);
  const duration = lyricsGamePlaybackDurationSeconds();
  const lineCount = game?.tokenLines?.length || 0;
  if (!lineCount || !Number.isFinite(duration) || duration <= 0) return null;
  return Math.max(0, duration * (index / lineCount));
}

function replayLyricsGameGapLine(gap) {
  const game = state.lyricFillGame;
  const audio = els.lyricsGameAudio;
  if (!game || !gap || !audio?.src) return false;
  const start = lyricsGameLineStartSeconds(game, gap.lineIndex);
  if (!Number.isFinite(start)) return false;
  gap.autoReplayCount = (gap.autoReplayCount || 0) + 1;
  game.currentGapIndex = gap.index;
  game.lineCursor = gap.lineIndex;
  game.lineCursorEnteredAt = Date.now();
  game.lastLineAdvanceAt = Date.now();
  lyricsGameChoicesForGap(gap);
  try {
    audio.currentTime = Math.max(0, start + 0.05);
    if (!game.paused) playLyricsGameAudio();
  } catch {}
  els.lyricsFillStatus.textContent = `Replaying this lyric line (${gap.autoReplayCount}/${LYRICS_GAME_MAX_AUTO_REPLAYS}).`;
  renderLyricsGamePlay();
  return true;
}

function maybeReplayUnansweredLyricsGameGap(previousCursor) {
  const game = state.lyricFillGame;
  const gap = currentLyricsGameGap();
  const audio = els.lyricsGameAudio;
  if (!game || !gap || gap.revealed || game.finished || game.givenUp || game.audioUnavailable) return false;
  if (!audio?.src || audio.paused || audio.ended) return false;
  if (!Number.isFinite(game.lineCursor) || game.lineCursor <= gap.lineIndex) return false;
  if (Number.isFinite(previousCursor) && previousCursor > gap.lineIndex) return false;
  if ((gap.autoReplayCount || 0) >= LYRICS_GAME_MAX_AUTO_REPLAYS) return false;
  return replayLyricsGameGapLine(gap);
}

function seekLyricsGameToLine(lineIndex) {
  const game = state.lyricFillGame;
  if (!game) return;
  const target = Math.max(0, Math.min(game.tokenLines.length - 1, lineIndex));
  game.lineCursor = target;
  game.lastLineAdvanceAt = Date.now();
  const time = lyricsGameLineStartSeconds(game, target);
  if (Number.isFinite(time) && els.lyricsGameAudio?.src) {
    try {
      els.lyricsGameAudio.currentTime = Math.max(0, time - 0.2);
      if (!game.paused) playLyricsGameAudio();
    } catch {}
  }
}

function lyricsGameIsHoldingChoice(game = state.lyricFillGame) {
  return Boolean(game && game.holdingForChoice !== null && game.holdingForChoice !== undefined);
}

function holdLyricsGameForGap(gap) {
  const game = state.lyricFillGame;
  if (!game || !gap || gap.revealed || game.finished || game.givenUp) return;
  game.holdingForChoice = gap.index;
  game.lineCursor = gap.lineIndex;
  game.lastLineAdvanceAt = Date.now();
  game.lineCursorEnteredAt = Date.now();
  try {
    els.lyricsGameAudio?.pause();
    els.lyricsGameVisual?.classList.remove("is-playing");
  } catch {}
  setLyricsGameVisual(state.lyricFillTrack, "Choose the missing word to continue.", false);
  els.lyricsFillStatus.textContent = "Choose the missing word to continue.";
  renderLyricsGamePlay();
}

function resumeLyricsGameAfterChoice() {
  const game = state.lyricFillGame;
  if (!game) return;
  const wasHolding = lyricsGameIsHoldingChoice(game);
  game.holdingForChoice = null;
  game.lastLineAdvanceAt = Date.now();
  game.lineCursorEnteredAt = Date.now();
  if (wasHolding && !game.finished && !game.givenUp && !game.paused && els.lyricsGameAudio?.src && els.lyricsGameAudio.paused) {
    playLyricsGameAudio();
  }
}

function updateLyricsGameLineHighlight(scroll = true) {
  const game = state.lyricFillGame;
  const list = els.lyricsGameLyricsList;
  if (!game || !list) return;
  const cursor = Number.isFinite(game.lineCursor) ? game.lineCursor : -1;
  for (const line of list.querySelectorAll("[data-lyrics-game-line]")) {
    const lineIndex = Number(line.dataset.lyricsGameLine);
    line.classList.toggle("current", cursor >= 0 && lineIndex === cursor);
    line.classList.toggle("passed", cursor >= 0 && lineIndex < cursor);
  }
  if (scroll && cursor >= 0) {
    const activeLine = list.querySelector(`[data-lyrics-game-line="${cursor}"]`);
    activeLine?.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

function tickLyricsGamePlayback() {
  const game = state.lyricFillGame;
  if (!game || game.paused || game.finished || game.givenUp || lyricsGameIsHoldingChoice(game)) return;
  const previousCursor = game.lineCursor;
  const audio = els.lyricsGameAudio;
  const hasAudioSource = Boolean(audio?.src);
  const audioPlaying = Boolean(audio?.src && !audio.paused && !audio.ended);
  const waitingForAudioStart = hasAudioSource && !audioPlaying && !audio.ended;
  const canUseTextClock = Boolean(game.audioUnavailable) && !game.audioResolving && !waitingForAudioStart;
  const hasSyncedLines = Boolean(game.lineTimes?.some((time) => Number.isFinite(time)));
  if (audioPlaying && hasSyncedLines && Number.isFinite(audio.currentTime)) {
    const syncedIndex = lyricsGameLineIndexForTime(game, audio.currentTime);
    game.lineCursor = syncedIndex >= 0 ? syncedIndex : 0;
  } else if (audioPlaying && Number.isFinite(audio.currentTime)) {
    const estimatedIndex = estimatedLyricsGameLineIndex(game, audio.currentTime);
    if (estimatedIndex >= 0) {
      game.lineCursor = estimatedIndex;
    } else if (canUseTextClock && Date.now() - (game.lastLineAdvanceAt || 0) >= 3200) {
      game.lineCursor = Math.min(game.tokenLines.length - 1, Math.max(-1, game.lineCursor) + 1);
      game.lastLineAdvanceAt = Date.now();
    }
  } else if (canUseTextClock && Date.now() - (game.lastLineAdvanceAt || 0) >= 3200) {
    game.lineCursor = Math.min(game.tokenLines.length - 1, Math.max(-1, game.lineCursor) + 1);
    game.lastLineAdvanceAt = Date.now();
  }
  if (game.lineCursor !== previousCursor) {
    game.lineCursorEnteredAt = Date.now();
  }
  if (maybeReplayUnansweredLyricsGameGap(previousCursor)) return;
  const gapChanged = syncLyricsGameGapToCursor(game);
  if (gapChanged) {
    renderLyricsGamePlay();
    return;
  }
  if (game.lineCursor !== previousCursor) updateLyricsGameLineHighlight(true);
  updateLyricsGameScores();
}

function startLyricsGameTimer() {
  stopLyricsGameTimer();
  state.lyricFillGameTimer = setInterval(tickLyricsGamePlayback, 700);
}

function renderLyricsGameLevelStage() {
  const track = state.lyricFillTrack;
  if (!track || !state.lyricFillLyrics?.found) return;
  const totalWords = lyricsGameWordTotal();
  els.lyricsGameLevelTitle.textContent = track.title || "Untitled";
  els.lyricsGameLevelArtist.textContent = track.artist || track.subtitle || "YouTube Music";
  els.lyricsGameLevelMeta.textContent = `${state.lyricFillLyrics.provider || "Lyrics"} lyrics | ${totalWords} words`;
  if (els.lyricsGameLevelHero) {
    els.lyricsGameLevelHero.style.backgroundImage = track.thumbnail
      ? `linear-gradient(180deg, rgba(0,0,0,.36), rgba(0,0,0,.72)), ${thumbnailBackground(track)}`
      : thumbnailBackground(track);
  }
  els.lyricsGameLevelRows.innerHTML = LYRICS_GAME_LEVELS.map((level) => {
    const count = lyricGameGapCountForLevel(level.id, totalWords);
    const active = level.id === state.lyricFillLevel;
    return `
      <button class="lyrics-game-level-row ${active ? "active" : ""} ${level.tone}" data-lyrics-level="${level.id}" type="button">
        <span class="lyrics-level-face" aria-hidden="true"></span>
        <span class="lyrics-level-inner">
          <strong>${level.name}</strong>
          <small>Fill ${count} words of ${totalWords}</small>
        </span>
        <span class="lyrics-level-play" data-lyrics-level-start="${level.id}">
          <b aria-hidden="true">${standardIconSvg("play")}</b>
          <small>Start</small>
        </span>
      </button>
    `;
  }).join("");
}

function renderLyricsGameLyrics() {
  const game = state.lyricFillGame;
  if (!game) {
    els.lyricsGameLyricsList.innerHTML = `<p class="status">Start a level first.</p>`;
    return;
  }
  const current = currentLyricsGameGap();
  els.lyricsGameLyricsList.innerHTML = game.tokenLines.map((tokens, lineIndex) => `
    <div class="lyrics-game-line ${lineIndex === game.lineCursor ? "current" : ""} ${lineIndex < game.lineCursor ? "passed" : ""}" data-lyrics-game-line="${lineIndex}">
      ${tokens.map((token) => {
        if (token.type === "text") return escapeText(token.value);
        const gap = game.gapMap.get(`${token.lineIndex}:${token.tokenIndex}`);
        if (!gap) return `<span class="lyrics-game-word">${escapeText(token.value)}</span>`;
        const active = current?.index === gap.index && !gap.revealed;
        if (gap.revealed || game.givenUp) {
          return `<span class="lyrics-game-word lyrics-game-revealed ${gap.status}">${escapeText(gap.answer)}</span>`;
        }
        return `<span class="lyrics-game-gap ${active ? "active" : ""}" data-gap-active="${active ? "true" : "false"}"><b></b></span>`;
      }).join("")}
    </div>
  `).join("");
  const activeLine = game.lineCursor >= 0
    ? els.lyricsGameLyricsList.querySelector(`[data-lyrics-game-line="${game.lineCursor}"]`)
    : null;
  const activeGap = els.lyricsGameLyricsList.querySelector('[data-gap-active="true"]');
  (activeLine || activeGap)?.scrollIntoView({ block: "center", behavior: "smooth" });
}

function renderLyricsGameOptions() {
  const game = state.lyricFillGame;
  const gap = currentLyricsGameGap();
  if (!game || !gap || game.finished || game.givenUp) {
    els.lyricsGameOptions.innerHTML = game?.finished
      ? `<div class="lyrics-game-finished">Game complete</div>`
      : `<div class="lyrics-game-finished">No active gap</div>`;
    return;
  }
  const choices = lyricsGameChoicesForGap(gap);
  els.lyricsGameOptions.innerHTML = choices.map((choice, index) => `
    <button class="lyrics-game-option option-${index + 1} ${gap.choiceStatus?.choice === choice ? gap.choiceStatus.status : ""}" data-lyrics-choice="${escapeText(choice)}" data-lyrics-choice-index="${index}" type="button">
      ${escapeText(choice)}
    </button>
  `).join("");
}

function updateLyricsGameScores() {
  const game = state.lyricFillGame;
  if (!game) return;
  const stats = game.stats;
  els.lyricsGameScoreDigits.textContent = String(stats.score).padStart(5, "0").slice(-5);
  els.lyricsGameGapsCount.textContent = String(game.gaps.length);
  els.lyricsGameHitsCount.textContent = String(stats.hits);
  els.lyricsGameFailsCount.textContent = String(stats.fails);
  els.lyricsGameSkipsCount.textContent = String(stats.skips);
  els.lyricsGameLife.style.width = `${Math.max(0, Math.min(1, stats.lives)) * 100}%`;
  els.lyricsFillScore.textContent = `${stats.hits} / ${game.gaps.length}`;
}

function renderLyricsGamePlay() {
  updateLyricsGameScores();
  renderLyricsGameLyrics();
  renderLyricsGameOptions();
  updateGamesStatus();
}

function setLyricsGamePauseMenu(open) {
  const show = Boolean(open);
  if (state.lyricFillGame) state.lyricFillGame.paused = show;
  if (show) {
    try {
      els.lyricsGameAudio?.pause();
      els.lyricsGameVisual?.classList.remove("is-playing");
    } catch {}
  } else if (!lyricsGameIsHoldingChoice()) {
    playLyricsGameAudio();
  }
  els.lyricsGamePauseMenu?.classList.toggle("hidden", !show);
}

function hideLyricsGamePauseMenu() {
  els.lyricsGamePauseMenu?.classList.add("hidden");
  if (state.lyricFillGame) state.lyricFillGame.paused = false;
  if (state.lyricFillStage === "play" && state.lyricFillGame && !state.lyricFillGame.finished && !lyricsGameIsHoldingChoice()) {
    playLyricsGameAudio();
  }
}

function startLyricsChoiceGame(level = state.lyricFillLevel) {
  document.getElementById("lyricsResult")?.classList.add("hidden");
  document.getElementById("lyricsAnswerFeedback").textContent = "";
  if (!state.lyricFillLyrics?.found) {
    els.lyricsFillStatus.textContent = "Load lyrics before starting.";
    showLyricsGameStage("search");
    return;
  }
  clearTimeout(state.lyricFillSearchTimer);
  state.lyricFillSearchRequest += 1;
  state.lyricFillLyricsRequest += 1;
  state.lyricFillLevel = level;
  state.lyricFillGame = buildLyricsGameModel(level);
  if (!state.lyricFillGame.gaps.length) {
    els.lyricsFillStatus.textContent = "No words available. Choose another song.";
    showLyricsGameStage("level");
    return;
  }
  state.lyricFillGame.audioResolving = true;
  state.lyricFillGame.audioUnavailable = false;
  showLyricsGameStage("play");
  stopLyricsGameVideo();
  setLyricsGameVisual(state.lyricFillTrack, "Resolving direct game audio...", false);
  startLyricsGameAudio(state.lyricFillTrack);
  startLyricsGameTimer();
  els.lyricsFillStatus.textContent = `${lyricsGameLevelConfig(level).name} choice mode started.`;
  renderLyricsGamePlay();
}

function finishLyricsGameIfNeeded() {
  const game = state.lyricFillGame;
  if (!game) return;
  const nextGap = lyricsGameGapForCursor(game);
  if (nextGap) {
    game.currentGapIndex = nextGap.index;
    lyricsGameChoicesForGap(nextGap);
    return;
  }
  game.finished = true;
  game.holdingForChoice = null;
  stopLyricsGameTimer();
  try {
    els.lyricsGameAudio?.pause();
    els.lyricsGameVisual?.classList.remove("is-playing");
  } catch {}
  setLyricsGameVisual(state.lyricFillTrack, "Game complete.", false);
  els.lyricsFillStatus.textContent = `Finished. Score ${game.stats.score}.`;
  showLyricsResult();
}

function showLyricsResult() {
  const game = state.lyricFillGame;
  if (!game) return;
  const accuracy = game.gaps.length ? Math.round(game.stats.hits / game.gaps.length * 100) : 0;
  document.getElementById("lyricsResultAccuracy").textContent = `${accuracy}%`;
  document.getElementById("lyricsResultStats").textContent = `${game.stats.score} pts / ${game.stats.hits} correct / ${game.stats.fails} missed / ${game.stats.skips} skipped`;
  document.getElementById("lyricsResultReview").innerHTML = game.gaps.filter((gap) => gap.status !== "correct").map((gap) => `<div><span>${escapeText(game.tokenLines[gap.lineIndex].map((token) => token.value).join(""))}</span><b>${escapeText(gap.answer)}</b></div>`).join("");
  document.getElementById("lyricsResult").classList.remove("hidden");
}

function answerLyricsGameChoice(choice, choiceIndex = -1) {
  const game = state.lyricFillGame;
  const gap = currentLyricsGameGap();
  if (!game || !gap || game.finished || game.givenUp || game.paused) return;
  const correct = normalizedGameAnswer(choice) === normalizedGameAnswer(gap.answer);
  const feedback = document.getElementById("lyricsAnswerFeedback");
  feedback.textContent = `${correct ? "Correct" : "Answer"}: ${gap.answer}`;
  feedback.dataset.correct = String(correct);
  const previousChoices = Array.isArray(gap.choices) ? [...gap.choices] : lyricsGameChoicesForGap(gap);
  const selectedIndex = Number.isInteger(choiceIndex) && choiceIndex >= 0
    ? choiceIndex
    : previousChoices.findIndex((item) => normalizedGameAnswer(item) === normalizedGameAnswer(choice));
  gap.revealed = true;
  gap.status = correct ? "correct" : "wrong";
  gap.choiceStatus = { choice, status: correct ? "correct" : "wrong" };
  if (correct) {
    game.stats.hits += 1;
    game.stats.streak += 1;
    game.stats.bonus = Math.min(5, 1 + Math.floor(game.stats.streak / 4));
    game.stats.score += 100 * game.stats.bonus;
    els.lyricsFillStatus.textContent = `Correct: ${gap.answer}`;
  } else {
    game.stats.fails += 1;
    game.stats.streak = 0;
    game.stats.bonus = 1;
    game.stats.lives = Math.max(0, game.stats.lives - 1 / Math.max(1, game.gaps.length));
    els.lyricsFillStatus.textContent = `Missed: ${gap.answer}`;
  }
  finishLyricsGameIfNeeded();
  if (!game.finished) {
    const nextGap = currentLyricsGameGap();
    if (correct) {
      lyricsGameChoicesForGap(nextGap, {
        force: true,
        previousChoices,
        replaceIndex: selectedIndex >= 0 ? selectedIndex : 0
      });
    } else {
      lyricsGameChoicesForGap(nextGap, { force: true });
    }
  }
  resumeLyricsGameAfterChoice();
  renderLyricsGamePlay();
}

function skipLyricsGameGap() {
  const game = state.lyricFillGame;
  const gap = currentLyricsGameGap();
  if (!game || !gap || game.finished) return;
  gap.revealed = true;
  gap.status = "skipped";
  game.stats.skips += 1;
  game.stats.streak = 0;
  game.stats.bonus = 1;
  els.lyricsFillStatus.textContent = `Skipped: ${gap.answer}`;
  finishLyricsGameIfNeeded();
  resumeLyricsGameAfterChoice();
  renderLyricsGamePlay();
}

function previousLyricsGameGap() {
  const game = state.lyricFillGame;
  if (!game) return;
  const previous = game.gaps.slice(0, game.currentGapIndex).map((gap, index) => ({ gap, index })).reverse().find((item) => !item.gap.revealed);
  if (previous) {
    game.currentGapIndex = previous.index;
    renderLyricsGamePlay();
  }
}

function giveUpLyricsGame() {
  const game = state.lyricFillGame;
  if (!game) return;
  for (const gap of game.gaps) {
    if (!gap.revealed) {
      gap.revealed = true;
      gap.status = "skipped";
      game.stats.skips += 1;
    }
  }
  game.givenUp = true;
  game.finished = true;
  game.holdingForChoice = null;
  stopLyricsGameTimer();
  try {
    els.lyricsGameAudio?.pause();
    els.lyricsGameVisual?.classList.remove("is-playing");
  } catch {}
  els.lyricsFillStatus.textContent = "Answers revealed.";
  hideLyricsGamePauseMenu();
  renderLyricsGamePlay();
  showLyricsResult();
}

function fillableLyricLines() {
  return (state.lyricFillLyrics?.lines || [])
    .map((line) => String(line?.text || "").trim())
    .filter((text) => {
      const words = text.match(/[\p{L}\p{N}'-]{3,}/gu) || [];
      return words.length >= 4 && !/^\[.*\]$/.test(text);
    });
}

function makeLyricFillRound(text) {
  const words = [...text.matchAll(/[\p{L}\p{N}'-]{4,}/gu)];
  const selected = randomItem(words);
  if (!selected) return null;
  const answer = selected[0];
  const start = selected.index;
  const prompt = `${text.slice(0, start)}${"_".repeat(Math.max(4, answer.length))}${text.slice(start + answer.length)}`;
  return { source: text, prompt, answer };
}

async function startLyricsFillRound() {
  const lines = fillableLyricLines();
  if (!lines.length) {
    state.lyricFillRound = null;
    els.lyricsFillPrompt.textContent = "Search and choose a song to load lyrics.";
    els.lyricsFillStatus.textContent = "This game uses its own selected song, not the current player song.";
    updateGamesStatus();
    return;
  }
  state.lyricFillRound = makeLyricFillRound(randomItem(lines));
  els.lyricsFillPrompt.textContent = state.lyricFillRound?.prompt || "No lyric round created.";
  els.lyricsFillInput.value = "";
  els.lyricsFillStatus.textContent = state.lyricFillTrack?.title
    ? `Selected song: ${state.lyricFillTrack.title}`
    : "Lyrics loaded.";
  updateGamesStatus();
  els.lyricsFillInput.focus();
}

function checkLyricsFillAnswer() {
  const round = state.lyricFillRound;
  if (!round) {
    els.lyricsFillStatus.textContent = "Start a lyrics fill round first.";
    return;
  }
  const guess = normalizedGameAnswer(els.lyricsFillInput.value);
  const answer = normalizedGameAnswer(round.answer);
  state.lyricFillScore.total += 1;
  if (guess && guess === answer) {
    state.lyricFillScore.correct += 1;
    els.lyricsFillStatus.textContent = `Correct. The missing word was "${round.answer}".`;
  } else {
    els.lyricsFillStatus.textContent = `Missed. The answer was "${round.answer}".`;
  }
  updateGamesStatus();
}

function lyricsGameSearchRowsHtml(items) {
  return unifiedTrackRowsHtml(items, {
    detailLabel: (item) => item.gameSource || "YouTube Music",
    rowClass: "game-search-row lyrics-game-search-row",
    playDataName: "lyrics-game-song",
    showMore: false,
    showDownload: false
  });
  /* Legacy markup retained temporarily for migration safety; unreachable. */
  return (items || []).map((item, index) => `
    <button class="game-search-row lyrics-game-search-row" data-lyrics-game-song="${index}" type="button">
      <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
      <span>
        <strong>${escapeText(item.title || "Untitled")}</strong>
        <small>${escapeText(item.subtitle || item.artist || "YouTube Music")}</small>
      </span>
      <span>
        <b>${escapeText(item.duration || item.durationText || "")}</b>
        <small>${escapeText(item.gameSource || "YouTube Music")}</small>
      </span>
    </button>
  `).join("");
}

function renderLyricsGameSearchPrompt(message = "Start typing to search YouTube Music songs.") {
  if (!els.lyricsGameSearchResults) return;
  els.lyricsGameSearchResults._items = [];
  els.lyricsGameSearchResults.innerHTML = `
    <div class="lyrics-game-search-empty">
      <span class="ui-icon icon-search" aria-hidden="true"></span>
      <strong>${escapeText(message)}</strong>
      <small>Results appear here automatically, just like the main music search.</small>
    </div>
  `;
}

function renderLyricsGameSearchLoading(query) {
  if (!els.lyricsGameSearchResults) return;
  els.lyricsGameSearchResults._items = [];
  els.lyricsGameSearchResults.innerHTML = `
    <div class="lyrics-game-search-loading">
      <i></i><i></i><i></i>
      <span>Searching "${escapeText(query)}"...</span>
    </div>
  `;
}

function setLyricsGameLoadingLyrics(loading) {
  els.lyricsFillGame?.classList.toggle("lyrics-game-loading-mode", Boolean(loading));
}

function renderLyricsGameLyricsLoading(track) {
  if (!els.lyricsGameSearchResults) return;
  els.lyricsGameSearchResults._items = [];
  setLyricsGameLoadingLyrics(true);
  els.lyricsGameSearchResults.innerHTML = `
    <div class="lyrics-game-lyrics-loading">
      <div class="lyrics-game-lyrics-spinner" aria-hidden="true">
        <i></i><i></i><i></i>
      </div>
      <strong>Loading lyrics</strong>
      <span>${escapeText(track?.title || "Selected song")}</span>
      <small>Reading lyrics from YouTube Music for this exact song.</small>
    </div>
  `;
}

function renderLyricsGameLyricsMessage(title, detail = "") {
  if (!els.lyricsGameSearchResults) return;
  els.lyricsGameSearchResults._items = [];
  els.lyricsGameSearchResults.innerHTML = `
    <div class="lyrics-game-search-empty">
      <span class="ui-icon icon-lyrics" aria-hidden="true"></span>
      <strong>${escapeText(title)}</strong>
      ${detail ? `<small>${escapeText(detail)}</small>` : ""}
    </div>
  `;
}

function clearLyricsGameSongSearch() {
  clearTimeout(state.lyricFillSearchTimer);
  state.lyricFillSearchRequest += 1;
  state.lyricFillLyricsRequest += 1;
  state.lyricFillSearchResult = null;
  setLyricsGameLoadingLyrics(false);
  renderLyricsGameSearchPrompt();
}

async function searchLyricsGameSongs(query, options = {}) {
  const auto = Boolean(options.auto);
  if (auto && state.lyricFillStage === "play" && state.lyricFillGame) return;
  const needle = String(query || "").trim();
  if (!needle) {
    clearLyricsGameSongSearch();
    els.lyricsFillStatus.textContent = "Type a song or artist name to search.";
    return;
  }
  const requestId = state.lyricFillSearchRequest + 1;
  state.lyricFillSearchRequest = requestId;
  state.lyricFillSearchResult = null;
  state.lyricFillLyricsRequest += 1;
  state.lyricFillTrack = null;
  state.lyricFillLyrics = null;
  state.lyricFillRound = null;
  state.lyricFillGame = null;
  setLyricsGameLoadingLyrics(false);
  showLyricsGameStage("search");
  els.lyricsGameSongInfo.classList.add("hidden");
  els.lyricsGameSongInfo.innerHTML = "";
  els.lyricsFillPrompt.textContent = "Choose a song from search results.";
  els.lyricsFillStatus.textContent = auto ? `Finding possible songs for "${needle}"...` : `Searching "${needle}"...`;
  renderLyricsGameSearchLoading(needle);
  updateGamesStatus();

  try {
    const [result, libraryTracks] = await Promise.all([
      window.metro.search({ query: needle, filter: "songs" }),
      gameSearchLibraryTracks(needle)
    ]);
    if (requestId !== state.lyricFillSearchRequest || els.lyricsGameSearchInput.value.trim() !== needle) return;
    const onlineTracks = tracksFromResult(asPageResult(result)).map((track) => ({ ...track, gameSource: "YouTube Music" }));
    const tracks = uniqueTracks([...libraryTracks, ...onlineTracks]).slice(0, 30);
    state.lyricFillSearchResult = tracks;
    els.lyricsGameSearchResults._items = tracks;
    els.lyricsGameSearchResults.classList.add("liked-results");
    els.lyricsGameSearchResults.innerHTML = tracks.length
      ? lyricsGameSearchRowsHtml(tracks)
      : `<div class="lyrics-game-search-empty"><span class="ui-icon icon-search" aria-hidden="true"></span><strong>No song results for "${escapeText(needle)}".</strong><small>Try a song title plus artist name.</small></div>`;
    els.lyricsFillStatus.textContent = tracks.length
      ? `${tracks.length} song${tracks.length === 1 ? "" : "s"} found.`
      : "No songs found.";
  } catch (error) {
    if (requestId !== state.lyricFillSearchRequest) return;
    els.lyricsGameSearchResults.innerHTML = `<p class="status">${escapeText(error.message || "Search failed.")}</p>`;
    els.lyricsFillStatus.textContent = "Song search failed.";
  }
  updateGamesStatus();
}

function queueLyricsGameSongSearch() {
  clearTimeout(state.lyricFillSearchTimer);
  const query = els.lyricsGameSearchInput?.value.trim() || "";
  if (query.length < 2) {
    state.lyricFillSearchRequest += 1;
    renderLyricsGameSearchPrompt(query ? "Keep typing to search songs." : "Start typing to search YouTube Music songs.");
    els.lyricsFillStatus.textContent = "Type at least 2 characters to search.";
    return;
  }
  state.lyricFillSearchTimer = setTimeout(() => {
    searchLyricsGameSongs(query, { auto: true });
  }, 220);
}

async function selectLyricsGameSong(track) {
  if (!isTrackItem(track)) return;
  clearTimeout(state.lyricFillSearchTimer);
  state.lyricFillSearchRequest += 1;
  const requestId = state.lyricFillLyricsRequest + 1;
  state.lyricFillLyricsRequest = requestId;
  state.lyricFillTrack = track;
  state.lyricFillLyrics = null;
  state.lyricFillRound = null;
  if (state.activeGame === "rhythm") {
    els.lyricsFillStatus.textContent = `Preparing a beatmap for ${track.title}.`;
    showLyricsGameStage("play");
    await initRhythmGame(track);
    return;
  }
  primeLyricsGameAudio(track);
  els.lyricsFillPrompt.textContent = "Loading lyrics...";
  els.lyricsFillStatus.textContent = `Selecting the best lyrics for ${track.title}.`;
  els.lyricsGameSongInfo.classList.remove("hidden");
  els.lyricsGameSongInfo.innerHTML = `
    <span class="mini" style="background-image:${thumbnailStyle(track)}"></span>
    <span>
      <strong>${escapeText(track.title || "Untitled")}</strong>
      <small>${escapeText(track.subtitle || track.artist || "YouTube Music")}</small>
    </span>
  `;
  showLyricsGameStage("search");
  renderLyricsGameLyricsLoading(track);
  updateGamesStatus();
  try {
    const selectedSource = els.gameLyricsSourceSelect?.value || "auto";
    const result = selectedSource === "auto" && state.currentTrack?.id === track.id && state.lyrics?.found && state.lyrics?.lines?.length
      ? state.lyrics
      : selectedSource === "auto"
        ? await loadPreferredLyricsForTrack(track, { consumePrefetch: false })
        : await loadPreferredLyricsForTrack(track, {
          consumePrefetch: false,
          source: selectedSource
        });
    if (requestId !== state.lyricFillLyricsRequest || state.lyricFillStage === "play") return;
    setLyricsGameLoadingLyrics(false);
    state.lyricFillLyrics = result;
    if (!result?.found || !result.lines?.length) {
      els.lyricsFillPrompt.textContent = "No lyrics found.";
      const detail = result?.error || "No lyrics were available from the sources enabled for listening mode.";
      els.lyricsFillStatus.textContent = `${detail} Try another YouTube Music song.`;
      renderLyricsGameLyricsMessage("No lyrics found.", detail);
      updateGamesStatus();
      return;
    }
    state.lyricFillLevel = "b1";
    els.lyricsFillStatus.textContent = `${result.provider || "Auto"} ${result.synced ? "synced" : "plain"} lyrics selected with listening-mode quality rules. Choose a difficulty.`;
    renderLyricsGameLevelStage();
    showLyricsGameStage("level");
  } catch (error) {
    if (requestId !== state.lyricFillLyricsRequest || state.lyricFillStage === "play") return;
    setLyricsGameLoadingLyrics(false);
    els.lyricsFillPrompt.textContent = "Lyrics failed.";
    els.lyricsFillStatus.textContent = error.message || "YouTube Music lyrics failed.";
    renderLyricsGameLyricsMessage("Lyrics failed.", error.message || "YouTube Music lyrics failed.");
  }
  updateGamesStatus();
}

function showGamesHub() {
  stopArcadeSessions();
  setGameSessionActive(false);
  stopLyricsGameVideo();
  switchView("games");
  state.activeGame = null;
  els.gamesBackButton?.classList.add("hidden");
  els.gamesHub?.classList.remove("hidden");
  els.gamesPlayArea?.classList.add("hidden");
  els.lyricsFillGame?.classList.add("hidden");
  updateGamesStatus();
}

function exitGameToHome() {
  stopArcadeSessions();
  setGameSessionActive(false);
  stopLyricsGameVideo();
  state.activeGame = null;
  els.gamesBackButton?.classList.add("hidden");
  els.gamesHub?.classList.remove("hidden");
  els.gamesPlayArea?.classList.add("hidden");
  els.lyricsFillGame?.classList.add("hidden");
  switchView("home");
  updateGamesStatus();
}

async function openGame(game) {
  stopArcadeSessions();
  if (!["lyrics", "heardle", "rhythm"].includes(game)) game = "lyrics";
  switchView("games");
  state.activeGame = game;
  setGameSessionActive(true);
  els.gamesBackButton?.classList.remove("hidden");
  els.gamesHub?.classList.add("hidden");
  els.gamesPlayArea?.classList.remove("hidden");
  const pickerCopy = game === "rhythm"
    ? { eyebrow: "Audio lab", title: "Choose a track to decode", description: "Auralane analyzes the real audio transients, tempo and energy sections before a run can start." }
    : { eyebrow: "Lyrics challenge", title: "Choose the lyrics for this run", description: "Pick a real song, then Auralane loads its highest-quality lyrics and builds the challenge from those words." };
  const pickerEyebrow = document.getElementById("gamePickerEyebrow");
  const pickerTitle = document.getElementById("gamePickerTitle");
  const pickerDescription = document.getElementById("gamePickerDescription");
  if (pickerEyebrow) pickerEyebrow.textContent = pickerCopy.eyebrow;
  if (pickerTitle) pickerTitle.textContent = pickerCopy.title;
  if (pickerDescription) pickerDescription.textContent = pickerCopy.description;

  if (game === "heardle") {
    showLyricsGameStage("play");
    await startHeardleSession();
    updateGamesStatus();
    return;
  }

  // Lyrics Fill and Rhythm Master both start from a deliberately selected song.
  if (!state.lyricFillTrack) {
    showLyricsGameStage("search");
    els.lyricsFillPrompt.textContent = `Search and choose a song to load for ${game.toUpperCase()} game.`;
    els.lyricsFillStatus.textContent = "This game is independent from the currently playing song.";
    renderLyricsGameSearchPrompt();
    els.lyricsGameSearchInput?.focus();
  } else {
    if (game === "rhythm") {
      showLyricsGameStage("play");
      await initRhythmGame(state.lyricFillTrack);
    } else {
      renderLyricsGameLevelStage();
      showLyricsGameStage(state.lyricFillStage === "play" ? "play" : "level");
    }
  }

  updateGamesStatus();
}

async function openGames() {
  showGamesHub();
}

async function loadHistory() {
  switchView("history");
  if (!state.auth?.signedIn) {
    els.historyStatus.textContent = "Sign in to load YouTube Music listening history.";
    els.historyResults.innerHTML = `<p class="status">Local playback statistics remain available in Settings.</p>`;
    els.historyPlayButton.disabled = true;
    els.historyShuffleButton.disabled = true;
    return;
  }
  els.historyStatus.textContent = "Loading listening history...";
  els.historyPlayButton.disabled = true;
  els.historyShuffleButton.disabled = true;
  els.historyResults.innerHTML = skeletonHtml("rows", 8);
  toast("Loading history...");

  try {
    const result = await window.metro.history();
    state.historyData = result || { sections: [] };
    renderHistory(state.historyData);
    toast("History loaded.");
  } catch (error) {
    els.historyStatus.textContent = "History failed.";
    els.historyResults.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
    toast("History failed.", true);
  }
}

function removeHistoryTrackLocal(token, videoId) {
  if (!state.historyData?.sections) return;
  state.historyData.sections = state.historyData.sections
    .map((section) => ({
      ...section,
      tracks: (section.tracks || []).filter((track) => {
        if (token) return track.historyRemoveToken !== token;
        return track.id !== videoId;
      })
    }))
    .filter((section) => section.tracks.length);
}

async function removeHistoryTrack(item, button) {
  if (!item?.historyRemoveToken) return;
  button.disabled = true;
  button.textContent = "Removing...";
  try {
    await window.metro.removeFromHistory(item.historyRemoveToken);
    removeHistoryTrackLocal(item.historyRemoveToken, item.id);
    renderHistory(state.historyData);
    toast(`Removed from history: ${item.title}`);
  } catch (error) {
    button.disabled = false;
    button.textContent = "Remove";
    toast(error.message || "Remove from history failed.", true);
  }
}

async function loadHome(params = null, browseId = "FEmusic_home") {
  switchView("home");
  els.homeStatus.textContent = "Loading home...";
  els.homeQuickPicks.innerHTML = "";
  els.homeShelves.innerHTML = "";
  if (state.settings.offlineMode) {
    await renderOfflineHome();
    toast("Offline home loaded.");
    return;
  }
  state.homeSectionOrder = [];
  try {
    const result = await window.metro.home({ params, browseId });
    renderHome(result, params, browseId);
    toast("Home loaded.");
  } catch (error) {
    renderHome({ chips: [], sections: [] }, params, browseId);
    els.homeStatus.textContent = escapeText(error.message || "Home failed.");
    els.homeFallbackActions.classList.remove("hidden");
    toast("Home failed.", true);
  }
}

function queueRowsHtml(items) {
  return items.map((item, index) => {
    const active = state.currentTrack?.id === item.id;
    const locked = Boolean(state.settings.queueLock);
    const failed = state.playbackFailedIds.has(item.id) || item.playbackFailed;
    const unavailableOffline = state.settings.offlineMode && !isOfflineCached(item.id) && !item.offlineCached && !item.cached;
    const statusText = failed
      ? (state.playbackFailureReasons.get(item.id) || item.playbackFailureReason || "Playback failed")
      : unavailableOffline
        ? "Not downloaded in offline mode"
        : "";
    return `
      <div class="queue-row ${active ? "active" : ""} ${locked ? "locked" : ""} ${failed ? "failed" : ""} ${unavailableOffline ? "offline-unavailable" : ""}" data-index="${index}" data-track-id="${escapeText(item.id || "")}" draggable="false">
        <span class="queue-drag" aria-hidden="true">::</span>
        <div class="queue-main" aria-label="${escapeText(item.title || "Queued song")}">
          <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
          <span>
             <span class="title">${escapeText(item.title)}</span>
             <span class="subtitle">${escapeText(item.subtitle || item.artist || "YouTube Music")}</span>
            <span class="downloaded-detail">${escapeText(trackRowDetail(item, "Queue"))}</span>
             ${statusText ? `<span class="queue-state">${escapeText(statusText)}</span>` : ""}
          </span>
        </div>
        <div class="queue-row-actions">
          ${moreTriggerHtml("queue-more", `More actions for ${item.title || "song"}`)}
          <button class="queue-remove" data-queue-remove="${index}" type="button" aria-label="Remove from queue" ${locked ? "disabled" : ""}></button>
          <button class="queue-play-hover" data-queue-play="${index}" data-playback-indicator type="button" aria-label="Play ${escapeText(item.title || "song")}">
        <span aria-hidden="true">${standardIconSvg(active && state.playing ? "pause" : "play")}</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderQueue() {
  const count = state.queue.length;
  const source = state.queueSource?.title ? ` - ${state.queueSource.title}` : "";
  const modes = [
    state.settings.offlineMode ? "offline" : "",
    state.settings.queueLock ? "locked" : ""
  ].filter(Boolean);
  const modeText = modes.length ? ` (${modes.join(", ")})` : "";
  const queueCount = interfaceText("session.queueCount", {
    count,
    item: interfaceText(count === 1 ? "session.itemOne" : "session.itemMany")
  });
  els.queueStatus.textContent = count ? `${queueCount}${source}${modeText}.` : `${interfaceText("session.queueEmpty").replace(/\.$/, "")}${modeText}.`;
  renderQueueExtras();
  if (!count) {
    els.queueList.innerHTML = `<p class="status">${escapeText(interfaceText("session.noSongs"))}</p>`;
    els.queueList._items = [];
    return;
  }
  els.queueList.innerHTML = queueRowsHtml(state.queue);
  els.queueList._items = state.queue;
  els.queueList._queueSource = queueSource("queue", state.queueSource?.title || "Queue");
}

function scrollElementIntoContainerView(container, element, { smooth = true, block = "center" } = {}) {
  if (!container || !element) return;
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  let targetTop = container.scrollTop + (elementRect.top - containerRect.top);
  if (block === "center") {
    targetTop -= (container.clientHeight / 2) - (elementRect.height / 2);
  } else if (block === "nearest") {
    if (elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom) return;
    if (elementRect.top < containerRect.top) {
      targetTop = container.scrollTop + (elementRect.top - containerRect.top);
    } else {
      targetTop = container.scrollTop + (elementRect.bottom - containerRect.bottom);
    }
  }

  const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
  container.scrollTo({
    top: Math.max(0, Math.min(maxScroll, targetTop)),
    behavior: smooth ? "smooth" : "auto"
  });

  if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);
  const shell = document.querySelector(".shell");
  if (shell && (shell.scrollTop !== 0 || shell.scrollLeft !== 0)) {
    shell.scrollTop = 0;
    shell.scrollLeft = 0;
  }
}

function followCurrentQueueTrack({ force = false, smooth = true } = {}) {
  if (!state.settings.queueFollowPlaying || !state.currentTrack?.id || !els.queueList) return;
  if (!force && state.queueFollowedTrackId === state.currentTrack.id) return;
  state.queueFollowedTrackId = state.currentTrack.id;
  requestAnimationFrame(() => {
    const row = els.queueList.querySelector(`[data-track-id="${CSS.escape(state.currentTrack?.id || "")}"]`);
    if (!row) return;
    const container = els.rightPanel || els.queueList.closest(".queue-panel") || els.queueList;
    scrollElementIntoContainerView(container, row, { smooth, block: "center" });
  });
}

function updateCollectionFollowButtons() {
  const enabled = Boolean(state.settings.collectionFollowPlaying);
  for (const button of document.querySelectorAll("[data-collection-follow]")) {
    const label = enabled ? "Unlock playing song" : "Lock to playing song";
    button.classList.toggle("active", enabled);
    button.setAttribute("aria-label", label);
    button.title = label;
  }
}

function followCurrentTrackInCollection({ force = false, smooth = true } = {}) {
  if (!state.settings.collectionFollowPlaying || !state.currentTrack?.id) return;
  const view = document.querySelector(".view:not(.hidden)");
  if (!view?.classList.contains("collection-grid-view") && !view?.querySelector(".collection-toolbar")) return;
  const target = view.querySelector(`[data-track-id="${CSS.escape(state.currentTrack.id)}"]`);
  if (!target) return;
  const container = view.closest(".main") || document.querySelector(".main") || view;
  requestAnimationFrame(() => scrollElementIntoContainerView(container, target, { smooth, block: "center" }));
}

function lyricsSourceLabel(source = state.settings.lyricsSource) {
  if (source === "local") return "Local LRC";
  if (source === "betterlyrics") return "BetterLyrics";
  if (source === "netease") return "NetEase Music";
  if (source === "lrclib") return "LRCLIB";
  if (source === "musixmatch") return "Musixmatch";
  if (source === "kugou") return "KuGou";
  if (source === "paxsenix") return "Paxsenix";
  if (source === "lyricsplus") return "LyricsPlus";
  if (source === "youtube-transcript") return "YouTube transcript";
  if (source === "lyrics-ovh") return "Lyrics.ovh";
  return "Auto";
}

function lyricsSearchingText(source = state.settings.lyricsSource) {
  if (source === "local") return "Loading local LRC...";
  if (source === "betterlyrics") return "Searching BetterLyrics...";
  if (source === "netease") return "Searching NetEase Music...";
  if (source === "lrclib") return "Searching LRCLIB...";
  if (source === "musixmatch") return "Searching Musixmatch...";
  if (source === "kugou") return "Searching KuGou...";
  if (source === "paxsenix") return "Searching Paxsenix...";
  if (source === "lyricsplus") return "Searching LyricsPlus...";
  if (source === "youtube-transcript") return "Searching YouTube transcript...";
  if (source === "lyrics-ovh") return "Searching Lyrics.ovh...";
  return "Searching lyrics (Auto)...";
}

function accountStorageId() {
  return authStorageId(state.auth);
}

function scopedStorageKey(key) {
  return ACCOUNT_SCOPED_STORAGE_KEYS.has(key) ? `${key}:${accountStorageId()}` : key;
}

function readStoredObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(scopedStorageKey(key)) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function writeStoredObject(key, value) {
  try {
    localStorage.setItem(scopedStorageKey(key), JSON.stringify(value || {}));
  } catch {
    // Storage is best effort.
  }
}

function localLyricsKey(track = state.currentTrack) {
  return track?.id || track?.videoId || "";
}

function formatLyricsOffset(ms = state.lyricsOffsetMs) {
  const value = Number(ms) || 0;
  if (!value) return "0ms";
  return `${value > 0 ? "+" : ""}${value}ms`;
}

function readLyricsOffsetMs(track = state.currentTrack) {
  const key = localLyricsKey(track);
  if (!key) return 0;
  const store = readStoredObject(LYRICS_OFFSET_KEY);
  const value = Number(store[key] || 0);
  return Number.isFinite(value)
    ? Math.max(-LYRICS_OFFSET_LIMIT_MS, Math.min(LYRICS_OFFSET_LIMIT_MS, Math.round(value)))
    : 0;
}

function writeLyricsOffsetMs(track = state.currentTrack, value = 0) {
  const key = localLyricsKey(track);
  if (!key) return;
  const store = readStoredObject(LYRICS_OFFSET_KEY);
  const normalized = Math.max(
    -LYRICS_OFFSET_LIMIT_MS,
    Math.min(LYRICS_OFFSET_LIMIT_MS, Math.round(Number(value) || 0)),
  );
  if (normalized) store[key] = normalized;
  else delete store[key];
  writeStoredObject(LYRICS_OFFSET_KEY, store);
  state.lyricsOffsetMs = normalized;
  updateLyricsOffsetControls();
  updateLyricsActive();
  updateFocusLyricsActive();
}

function updateLyricsOffsetControls() {
  const hasTrack = Boolean(state.currentTrack?.id);
  for (const button of [els.lyricsOffsetMinus, els.lyricsOffsetPlus, els.lyricsOffsetReset]) {
    if (button) button.disabled = !hasTrack;
  }
  if (els.lyricsOffsetValue) {
    els.lyricsOffsetValue.textContent = formatLyricsOffset();
    els.lyricsOffsetValue.title = `Lyrics offset for this song: ${formatLyricsOffset()}`;
  }
}

function updateLyricsSyncButtonVisibility() {
  const canSync = Boolean(state.lyrics?.found && state.lyrics?.synced && usesAudioTimeline());
  if (els.lyricsSyncButton) {
    els.lyricsSyncButton.disabled = !canSync;
    els.lyricsSyncButton.classList.toggle("hidden", !canSync || state.lyricsAutoSync);
  }
  if (els.focusSyncButton) {
    els.focusSyncButton.disabled = !canSync;
    els.focusSyncButton.classList.toggle("hidden", !canSync || state.focusLyricsAutoSync);
  }
}

function selectedLyricsMemoryForTrack(track = state.currentTrack) {
  const key = localLyricsKey(track);
  if (!key) return null;
  return readStoredObject(LYRICS_SOURCE_MEMORY_KEY)[key] || null;
}

function normalizedLyricsSourceId(value, providerKey = "") {
  const sourceId = String(value || "").trim().toLowerCase();
  const provider = String(providerKey || "").trim().toLowerCase();
  if (!sourceId) return "";
  // Older Auralane builds stored NetEase's numeric id without the provider
  // prefix, while current candidates use `netease:<id>`.
  if (provider === "netease" || sourceId.startsWith("netease:")) {
    return sourceId.replace(/^netease:/, "");
  }
  return sourceId;
}

function lyricsSourceIdsEqual(left, right, providerKey = "") {
  const normalizedLeft = normalizedLyricsSourceId(left, providerKey);
  const normalizedRight = normalizedLyricsSourceId(right, providerKey);
  return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}

function saveLyricsMemoryForTrack(track, candidate, rawText) {
  const key = localLyricsKey(track);
  if (!key || !candidate) return;
  const savedLyrics = String(rawText || candidate.rawLyrics || lyricsResultToEditableText(candidate) || "").trim();
  const store = readStoredObject(LYRICS_SOURCE_MEMORY_KEY);
  store[key] = {
    providerKey: candidate.providerKey || "local",
    provider: candidate.provider || lyricsSourceLabel(candidate.providerKey),
    sourceId: candidate.sourceId || "",
    title: candidate.title || track?.title || "",
    artist: candidate.artist || track?.artist || "",
    fingerprint: lyricsFingerprint({ lines: parseLocalLyricsText(savedLyrics) }),
    // Keep the chosen version itself, not just its provider metadata. A later
    // web search must never be able to replace this saved choice.
    rawLyrics: savedLyrics,
    updatedAt: new Date().toISOString()
  };
  writeStoredObject(LYRICS_SOURCE_MEMORY_KEY, store);
}

function hydrateSavedLyricsPayload(track, result) {
  const memory = selectedLyricsMemoryForTrack(track);
  if (memory && !memory.rawLyrics && result?.found && result?.lines?.length) {
    saveLyricsMemoryForTrack(track, { ...result, sourceId: memory.sourceId || result.sourceId || "" },
      result.rawLyrics || lyricsResultToEditableText(result));
  }
}

async function clearLyricsSelectionForTrack(track = state.currentTrack) {
  const key = localLyricsKey(track);
  if (!key) return;
  // A new choice replaces every persisted representation of the old choice.
  // This prevents an old local edit or durable cache from winning on the next play.
  for (const storageKey of [
    LOCAL_LYRICS_KEY,
    LYRICS_SOURCE_MEMORY_KEY,
    LYRICS_TRANSLATION_KEY,
    LYRICS_ROMANIZATION_KEY
  ]) {
    const store = readStoredObject(storageKey);
    if (Object.hasOwn(store, key)) {
      delete store[key];
      writeStoredObject(storageKey, store);
    }
  }
  state.lyricsSearchCache.delete(String(key));
  for (const cacheKey of state.lyricsPrefetchCache.keys()) {
    if (cacheKey.startsWith(`${key}:`)) state.lyricsPrefetchCache.delete(cacheKey);
  }
  for (const cacheKey of state.lyricsPrefetchCandidates.keys()) {
    if (cacheKey.startsWith(`${key}:`)) state.lyricsPrefetchCandidates.delete(cacheKey);
  }
  try {
    await window.metro.clearCachedLyrics?.(key);
  } catch {
    // Clearing a stale disk cache is best effort; the in-memory preference is gone.
  }
}

function normalizeLyricsAgent(value) {
  const normalized = String(value || "").trim().toLowerCase();
  const match = normalized.match(/(?:^|[^0-9])(1000|1|2)(?:$|[^0-9])/);
  return match ? `v${match[1]}` : (/^v\d+$/i.test(normalized) ? normalized : "");
}

function lyricsAgentFromRoleText(value) {
  const text = String(value || "").trim();
  return normalizeLyricsAgent(
    text.match(/^\{agent:([^}]+)\}/i)?.[1] ||
    text.match(/^\{(v?\d+)\}/i)?.[1] ||
    text.match(/^\[(v?\d+)\]/i)?.[1] ||
    text.match(/^(?:agent|voice|singer)?\s*(v?\d+)\s*:/i)?.[1] ||
    ""
  );
}

function expandLocalParentheticalBackgroundLines(sourceLines = []) {
  const expanded = [];
  const tokenize = (value) => String(value || "").trim().split(/\s+/).filter(Boolean);
  for (const sourceLine of sourceLines) {
    const line = { ...sourceLine };
    const matches = [...String(line.text || "").matchAll(/\(([^()]+)\)/g)];
    if (line.isBackground || !matches.length) {
      expanded.push(line);
      continue;
    }
    const backgroundText = matches.map((match) => match[1].trim()).filter(Boolean).join(" ");
    const mainText = String(line.text || "")
      .replace(/\s*\([^()]+\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!backgroundText || !mainText) {
      expanded.push(line);
      continue;
    }

    const sourceWords = Array.isArray(line.words) ? line.words : [];
    const mainWordCount = tokenize(mainText).length;
    const mainWords = sourceWords.slice(0, Math.min(mainWordCount, sourceWords.length));
    const timedBackgroundWords = sourceWords.slice(mainWordCount);
    line.text = mainText;
    if (sourceWords.length) line.words = mainWords;
    expanded.push(line);

    const backgroundTokens = tokenize(backgroundText);
    const usableTimedWords = timedBackgroundWords.length > backgroundTokens.length
      ? timedBackgroundWords.slice(-backgroundTokens.length)
      : timedBackgroundWords;
    const missingCount = Math.max(0, backgroundTokens.length - usableTimedWords.length);
    const firstTimedStart = Math.min(
      ...usableTimedWords.map((word) => Number(word.start)).filter(Number.isFinite)
    );
    const mainEnd = Math.max(
      Number(line.time || 0),
      ...mainWords.map((word) => Number(word.end)).filter(Number.isFinite)
    );
    const inferredDuration = 0.34;
    const inferredStart = Number.isFinite(firstTimedStart)
      ? Math.max(Number(line.time || 0), firstTimedStart - (missingCount * inferredDuration))
      : Math.max(Number(line.time || 0), mainEnd - Math.max(0.7, backgroundTokens.length * inferredDuration));
    const inferredWords = backgroundTokens.slice(0, missingCount).map((wordText, index) => ({
      text: wordText,
      start: inferredStart + (index * inferredDuration),
      end: inferredStart + ((index + 1) * inferredDuration)
    }));
    const backgroundWords = [
      ...inferredWords,
      ...usableTimedWords.map((word, index) => ({
        ...word,
        text: backgroundTokens[missingCount + index] || word.text
      }))
    ];
    const backgroundStart = Math.min(
      ...backgroundWords.map((word) => Number(word.start)).filter(Number.isFinite)
    );
    expanded.push({
      time: Number.isFinite(backgroundStart) ? backgroundStart : Number(line.time),
      text: backgroundText,
      words: backgroundWords,
      isBackground: true,
      inferredBackground: true
    });
  }
  return expanded.sort((a, b) => (a.time ?? Number.MAX_SAFE_INTEGER) - (b.time ?? Number.MAX_SAFE_INTEGER));
}

function parseLocalLyricsText(text) {
  const lines = [];
  const timestamp = /\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
  const inlineWordTimestamp = /<(\d{1,2}):(\d{2})\.(\d{2,3})>([^<]*)/g;
  let lastLine = null;

  const parseTime = (minutes, seconds, fraction) => {
    const millis = fraction ? Number(fraction.padEnd(3, "0").slice(0, 3)) : 0;
    return Number(minutes) * 60 + Number(seconds) + millis / 1000;
  };
  const parseStructuredWordBlock = (value) => {
    const body = String(value || "").trim().replace(/^</, "").replace(/>$/, "");
    return body.split("|").map((part) => {
      const endSplit = part.lastIndexOf(":");
      const startSplit = endSplit > 0 ? part.lastIndexOf(":", endSplit - 1) : -1;
      if (startSplit <= 0 || endSplit <= startSplit) return null;
      const start = Number(part.slice(startSplit + 1, endSplit));
      const end = Number(part.slice(endSplit + 1));
      const word = part.slice(0, startSplit).trim();
      if (!word || !Number.isFinite(start) || !Number.isFinite(end)) return null;
      return { text: word, start, end };
    }).filter(Boolean);
  };
  const parseInlineWords = (value) => {
    const matches = [...String(value || "").matchAll(inlineWordTimestamp)];
    const words = [];
    for (let index = 0; index < matches.length; index += 1) {
      const match = matches[index];
      const start = parseTime(match[1], match[2], match[3]);
      const next = matches[index + 1] ? parseTime(matches[index + 1][1], matches[index + 1][2], matches[index + 1][3]) : start + 0.5;
      const rawWords = String(match[4] || "").trim().split(/\s+/).filter(Boolean);
      rawWords.forEach((word, wordIndex) => {
        const wordStart = start + ((next - start) * wordIndex / rawWords.length);
        const wordEnd = start + ((next - start) * (wordIndex + 1) / rawWords.length);
        words.push({ text: word, start: wordStart, end: wordEnd });
      });
    }
    return words;
  };

  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    const bgMatch = trimmed.match(/^\[bg:\s*(.*)\]$/i);
    if (bgMatch) {
      const words = parseInlineWords(bgMatch[1]);
      const lyricText = bgMatch[1].replace(inlineWordTimestamp, "$4").trim();
      if (!lyricText) continue;
      lastLine = { time: words[0]?.start ?? null, text: lyricText, words, isBackground: true };
      lines.push(lastLine);
      continue;
    }
    if (/^<[^>]+>$/.test(trimmed)) {
      if (lastLine) {
        const words = parseStructuredWordBlock(trimmed);
        if (words.length) lastLine.words = words;
      }
      continue;
    }
    const matches = [...trimmed.matchAll(timestamp)];
    const roleText = trimmed.replace(timestamp, "").trim();
    const agent = lyricsAgentFromRoleText(roleText);
    const isBackground = /^\{bg\}/i.test(roleText);
    let lyricText = trimmed
      .replace(timestamp, "")
      .replace(/^\{agent:[^}]+\}/i, "")
      .replace(/^\{v?\d+\}/i, "")
      .replace(/^\[v?\d+\]/i, "")
      .replace(/^\{bg\}/i, "")
      .replace(/^(?:agent|voice|singer)?\s*v?\d+\s*:\s*/i, "")
      .trim();
    const words = parseInlineWords(lyricText);
    lyricText = lyricText.replace(inlineWordTimestamp, "$4").trim();
    if (!lyricText) continue;
    if (!matches.length) {
      lastLine = { time: null, text: lyricText, agent, isBackground, ...(words.length ? { words } : {}) };
      lines.push(lastLine);
      continue;
    }
    for (const match of matches) {
      lastLine = {
        time: parseTime(match[1], match[2], match[3]),
        text: lyricText,
        agent,
        isBackground,
        ...(words.length ? { words } : {})
      };
      lines.push(lastLine);
    }
  }
  return expandLocalParentheticalBackgroundLines(lines);
}

function formatLyricsTimestamp(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = Math.floor(safeSeconds % 60);
  const centiseconds = Math.floor((safeSeconds - Math.floor(safeSeconds)) * 100);
  return `[${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}]`;
}

function lyricsResultToEditableText(result) {
  if (result?.rawLyrics) return String(result.rawLyrics).trim();
  return (result?.lines || []).map((line) => {
    const text = String(line?.text || "").trim();
    if (!text) return "";
    const role = line.isBackground ? "{bg}" : line.agent ? `{agent:${line.agent}}` : "";
    const header = line.time == null ? `${role}${text}` : `${formatLyricsTimestamp(line.time)}${role}${text}`;
    if (!Array.isArray(line.words) || !line.words.length) return header;
    const block = line.words
      .filter((word) => word?.text && Number.isFinite(Number(word.start)) && Number.isFinite(Number(word.end)))
      .map((word) => `${String(word.text).replace(/[|<>]/g, "").trim()}:${Number(word.start)}:${Number(word.end)}`)
      .filter(Boolean)
      .join("|");
    return block ? `${header}\n<${block}>` : header;
  }).filter(Boolean).join("\n");
}

function localLyricsResultForTrack(track = state.currentTrack) {
  const key = localLyricsKey(track);
  if (!key) return null;
  const store = readStoredObject(LOCAL_LYRICS_KEY);
  const entry = store[key];
  if (!entry?.lines?.length) return null;
  const sourceProvider = entry.sourceProvider || "";
  return {
    found: true,
    provider: sourceProvider && sourceProvider !== "Manual" ? `Local (${sourceProvider})` : "Local LRC",
    providerKey: "local",
    sourceProviderKey: entry.sourceProviderKey || "",
    sourceId: entry.sourceId || "",
    attemptedProviders: ["Local LRC"],
    title: entry.title || track?.title || "Lyrics",
    artist: entry.artist || track?.artist || "",
    sourceProvider,
    rawLyrics: entry.rawLyrics || lyricsResultToEditableText({ lines: entry.lines }),
    synced: entry.lines.some((line) => line.time != null),
    lines: entry.lines
  };
}

function saveLocalLyricsForTrack(track, rawText, metadata = {}) {
  const key = localLyricsKey(track);
  if (!key) throw new Error("Choose a song before saving lyrics.");
  const lines = parseLocalLyricsText(rawText);
  if (!lines.length) throw new Error("No lyric lines were found.");
  const store = readStoredObject(LOCAL_LYRICS_KEY);
  const previous = store[key];
  const history = Array.isArray(previous?.history) ? [...previous.history] : [];
  const nextRawLyrics = String(rawText || "").trim();
  if (previous?.rawLyrics && previous.rawLyrics !== nextRawLyrics) {
    history.unshift({
      rawLyrics: previous.rawLyrics,
      title: previous.title || track.title || "Lyrics",
      artist: previous.artist || track.artist || track.subtitle || "",
      sourceProvider: previous.sourceProvider || "Manual",
      sourceProviderKey: previous.sourceProviderKey || "",
      sourceId: previous.sourceId || "",
      savedAt: previous.updatedAt || new Date().toISOString()
    });
  }
  store[key] = {
    title: metadata.title || track.title || "Lyrics",
    artist: metadata.artist || track.artist || track.subtitle || "",
    sourceProvider: metadata.provider || metadata.sourceProvider || "Manual",
    sourceProviderKey: metadata.providerKey || metadata.sourceProviderKey || "",
    sourceId: metadata.sourceId || "",
    sourceTitle: metadata.sourceTitle || metadata.title || "",
    sourceArtist: metadata.sourceArtist || metadata.artist || "",
    rawLyrics: nextRawLyrics,
    updatedAt: new Date().toISOString(),
    lines,
    history: history.slice(0, 25)
  };
  writeStoredObject(LOCAL_LYRICS_KEY, store);
  return localLyricsResultForTrack(track);
}

function assertLyricsSelectionPersisted(track, rawText) {
  const expectedFingerprint = lyricsFingerprint({ lines: parseLocalLyricsText(rawText) });
  const savedLocal = localLyricsResultForTrack(track);
  const savedMemory = selectedLyricsMemoryForTrack(track);
  const localMatches = savedLocal && lyricsFingerprint(savedLocal) === expectedFingerprint;
  const memoryMatches = savedMemory?.rawLyrics &&
    lyricsFingerprint({ lines: parseLocalLyricsText(savedMemory.rawLyrics) }) === expectedFingerprint;
  if (!localMatches || !memoryMatches) {
    throw new Error("Lyrics could not be saved. Please try again.");
  }
}

function lyricsSearchArtistFromTrack(track = state.currentTrack) {
  const titlePrefix = String(track?.title || "").match(/^(.+?)\s+[-–—]\s+(.+)$/)?.[1]?.trim();
  const uploader = String(track?.uploader || track?.author || track?.channelTitle || track?.ownerName || "").trim();
  const linkedNames = (track?.artists || [])
    .map((artist) => String(artist?.title || artist?.name || "").trim())
    .filter(Boolean);
  const linkedArtist = [...new Set(linkedNames)].join(", ");
  const normalizedTitlePrefix = normalizeArtistKey(titlePrefix);
  const linkedMatchesTitlePrefix = linkedNames.some((name) => {
    const normalizedName = normalizeArtistKey(name);
    return normalizedName && (normalizedTitlePrefix.includes(normalizedName) || normalizedName.includes(normalizedTitlePrefix));
  });
  if (titlePrefix && (!linkedArtist || !linkedMatchesTitlePrefix || normalizeArtistKey(linkedArtist) === normalizeArtistKey(uploader))) return titlePrefix;
  if (linkedArtist) return linkedArtist;
  if (titlePrefix && (!track?.artist || normalizeArtistKey(track.artist) === normalizeArtistKey(uploader))) return titlePrefix;
  if (track?.artist && normalizeArtistKey(track.artist) !== normalizeArtistKey(uploader)) return track.artist;
  const subtitle = String(track?.subtitle || "");
  const parts = subtitle.split(/[•·|]/).map((part) => part.trim()).filter(Boolean);
  return parts.find((part) => !/^(song|video|album|single|ep|youtube music|\d+:\d+)$/i.test(part)) || "";
}

function cleanLyricsIdentityTitle(value) {
  return String(value || "")
    .replace(/\s*[\[(].*?\b(?:official|video|audio|lyrics?|visuali[sz]er|hd|hq|4k|remaster(?:ed)?|topic)\b.*?[\])]/gi, "")
    .replace(/\s*\|\s*.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function lyricsIdentityTitleScore(left, right) {
  const a = normalizeArtistKey(cleanLyricsIdentityTitle(left));
  const b = normalizeArtistKey(cleanLyricsIdentityTitle(right));
  if (!a || !b) return 0;
  if (a === b) return 6;
  if (a.includes(b) || b.includes(a)) return 4;
  const aTokens = new Set(a.split(" ").filter((token) => token.length > 1));
  const bTokens = new Set(b.split(" ").filter((token) => token.length > 1));
  const overlap = [...aTokens].filter((token) => bTokens.has(token)).length;
  return overlap / Math.max(1, Math.max(aTokens.size, bTokens.size)) >= 0.65 ? 3 : 0;
}

async function computeLyricsSearchIdentity(track = state.currentTrack) {
  if (!track?.id) return { title: track?.title || "", artist: lyricsSearchArtistFromTrack(track) };
  const cacheKey = String(track.id);
  const cached = state.lyricsIdentityCache.get(cacheKey);
  if (cached) return cached;
  const linkedArtist = lyricsSearchArtistFromTrack(track);
  const titleParts = String(track.title || "").match(/^(.+?)\s+[-–—]\s+(.+)$/);
  const uploader = String(track.uploader || track.author || track.channelTitle || track.ownerName || "").trim();
  const titleArtist = String(titleParts?.[1] || "").trim();
  const linkedNames = (track.artists || [])
    .map((artist) => String(artist?.title || artist?.name || "").trim())
    .filter(Boolean);
  const hasLinkedMusicArtist = (track.artists || []).some((artist) => {
    const name = String(artist?.title || artist?.name || "").trim();
    if (!artist?.browseId || !name || normalizeArtistKey(name) === normalizeArtistKey(uploader)) return false;
    if (!titleArtist) return true;
    const normalizedName = normalizeArtistKey(name);
    const normalizedTitleArtist = normalizeArtistKey(titleArtist);
    return normalizedTitleArtist.includes(normalizedName) || normalizedName.includes(normalizedTitleArtist);
  });
  let identity = {
    title: cleanLyricsIdentityTitle(titleParts?.[2] || track.title || ""),
    artist: titleArtist && (!linkedNames.length || linkedNames.every((name) => normalizeArtistKey(name) === normalizeArtistKey(uploader)))
      ? titleArtist
      : linkedArtist
  };

  if (!hasLinkedMusicArtist) {
    try {
      const queryArtist = linkedArtist && normalizeArtistKey(linkedArtist) !== normalizeArtistKey(uploader)
        ? linkedArtist
        : (titleParts?.[1] || "");
      const query = [identity.title, queryArtist, "song"].filter(Boolean).join(" ");
      const result = await window.metro.search(query);
      const sourceDuration = Number(track.durationSeconds || track.lengthSeconds || durationSeconds(track.duration || ""));
      const matches = tracksFromResult(result)
        .map((candidate) => {
          let score = lyricsIdentityTitleScore(identity.title, candidate.title);
          const candidateDuration = Number(candidate.durationSeconds || candidate.lengthSeconds || durationSeconds(candidate.duration || ""));
          if (sourceDuration > 0 && candidateDuration > 0) {
            const difference = Math.abs(sourceDuration - candidateDuration);
            if (difference <= 5) score += 3;
            else if (difference <= 12) score += 1;
            else if (difference > 30) score -= 2;
          }
          if ((candidate.artists || []).some((artist) => artist?.browseId)) score += 2;
          if (candidate.album?.browseId) score += 1;
          return { candidate, score };
        })
        .filter((entry) => entry.score >= 5)
        .sort((a, b) => b.score - a.score);
      const best = matches[0]?.candidate;
      if (best) {
        identity = {
          title: cleanLyricsIdentityTitle(best.title || identity.title),
          artist: allArtistLabel(best, identity.artist)
        };
      }
    } catch (error) {
      if (state.settings.debugLogs) console.warn("Lyrics artist identity lookup failed", error);
    }
  }

  if (!identity.artist && titleParts?.[1]) identity.artist = titleParts[1].trim();
  state.lyricsIdentityCache.set(cacheKey, identity);
  while (state.lyricsIdentityCache.size > 32) {
    state.lyricsIdentityCache.delete(state.lyricsIdentityCache.keys().next().value);
  }
  return identity;
}

async function resolveLyricsSearchIdentity(track = state.currentTrack) {
  const key = String(track?.id || "");
  if (!key) return computeLyricsSearchIdentity(track);
  if (state.lyricsIdentityCache.has(key)) return state.lyricsIdentityCache.get(key);
  if (state.lyricsIdentityPending.has(key)) return state.lyricsIdentityPending.get(key);
  const pending = computeLyricsSearchIdentity(track);
  state.lyricsIdentityPending.set(key, pending);
  try {
    return await pending;
  } finally {
    if (state.lyricsIdentityPending.get(key) === pending) state.lyricsIdentityPending.delete(key);
  }
}

function normalizeLyricsTimingText(value) {
  return String(value || "").normalize("NFKC").toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function lyricsWordTimingQuality(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLocalLyricsText(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  const meaningful = lines.filter((line) => String(line?.text || "").trim());
  const primary = meaningful.filter((line) => !line?.isBackground);
  const checked = primary.length ? primary : meaningful;
  let timedLines = 0;
  let totalWords = 0;
  let validWords = 0;
  let textScoreTotal = 0;
  let invalidOrder = false;
  const maximumPlausibleWordDuration = 12;
  for (const line of checked) {
    const words = Array.isArray(line?.words) ? line.words : [];
    if (words.length) timedLines += 1;
    totalWords += words.length;
    let previousStart = -Infinity;
    const valid = words.filter((word) => {
      const start = Number(word?.start);
      const end = Number(word?.end);
      const duration = end - start;
      const okay = Number.isFinite(start) && Number.isFinite(end) && end > start &&
        duration <= maximumPlausibleWordDuration && start >= previousStart - 0.02;
      if (Number.isFinite(start)) previousStart = Math.max(previousStart, start);
      if (!okay) invalidOrder = true;
      return okay;
    });
    validWords += valid.length;
    const lineText = normalizeLyricsTimingText(line.text);
    const timedText = normalizeLyricsTimingText(valid.map((word) => word.text || "").join(""));
    textScoreTotal += lineText && timedText && lineText === timedText ? 1 : 0;
  }
  const lineCoverage = checked.length ? timedLines / checked.length : 0;
  const wordValidity = totalWords ? validWords / totalWords : 0;
  const textCoverage = checked.length ? textScoreTotal / checked.length : 0;
  return {
    lineCoverage,
    wordValidity,
    textCoverage,
    valid: checked.length > 0 && lineCoverage >= 0.95 && wordValidity >= 0.98 &&
      textCoverage >= 0.9 && !invalidOrder
  };
}

function lyricsTimingTier(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLocalLyricsText(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  if (lyricsWordTimingQuality({ ...candidate, lines }).valid) return 3;
  if (candidate.synced || lines.some((line) => line?.time != null && Number.isFinite(Number(line.time)))) return 2;
  return 1;
}

function lyricsLineTimingCoverage(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLocalLyricsText(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  const meaningful = lines.filter((line) => String(line?.text || "").trim() && !line?.isBackground);
  if (!meaningful.length) return 0;
  return meaningful.filter((line) => Number.isFinite(Number(line?.time))).length / meaningful.length;
}

function normalizeLyricsTitleMatchText(value) {
  return String(value || "").normalize("NFKC").toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lyricsTitleMatchVariants(value) {
  const cleaned = cleanLyricsIdentityTitle(value);
  const withoutBrackets = cleaned.replace(/\s*[\[(（【][^\])）】]*[\])）】]\s*/g, " ").trim();
  return [...new Set([cleaned, withoutBrackets]
    .map(normalizeLyricsTitleMatchText)
    .filter((title) => title.length >= 2))];
}

function lyricsContainTrackTitle(candidate = {}, trackTitle = "") {
  const variants = lyricsTitleMatchVariants(candidate.lyricsTargetTitle || trackTitle || state.currentTrack?.title || "");
  if (!variants.length) return false;
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLocalLyricsText(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  const lyricsText = normalizeLyricsTitleMatchText(lines.map((line) => line?.text || "").join("\n"));
  if (!lyricsText) return false;
  const compactLyrics = lyricsText.replace(/\s+/g, "");
  return variants.some((title) => {
    const containsCjk = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(title);
    if (containsCjk) return compactLyrics.includes(title.replace(/\s+/g, ""));
    return (` ${lyricsText} `).includes(` ${title} `);
  });
}

function compareLyricsCandidateQuality(left, right, trackTitle = "", { compareProvider = true } = {}) {
  if (compareProvider) {
    const providerDifference = compareNetEaseFirst(left, right);
    if (providerDifference) return providerDifference;
  }

  const leftTier = lyricsTimingTier(left);
  const rightTier = lyricsTimingTier(right);
  if (rightTier !== leftTier) return rightTier - leftTier;

  // First: prefer the result whose word/line timing covers more of its lyrics.
  const leftTiming = lyricsWordTimingQuality(left);
  const rightTiming = lyricsWordTimingQuality(right);
  for (const key of ["lineCoverage", "wordValidity", "textCoverage"]) {
    const difference = Number(rightTiming[key] || 0) - Number(leftTiming[key] || 0);
    if (Math.abs(difference) > 0.0001) return difference;
  }
  const lineTimingDifference = lyricsLineTimingCoverage(right) - lyricsLineTimingCoverage(left);
  if (Math.abs(lineTimingDifference) > 0.0001) return lineTimingDifference;

  // Second: a lyric that actually contains the song title is more likely to
  // belong to the intended recording instead of a similarly named upload.
  const titleDifference = Number(lyricsContainTrackTitle(right, trackTitle)) -
    Number(lyricsContainTrackTitle(left, trackTitle));
  if (titleDifference) return titleDifference;

  // Third: after timing and identity agree, the greater number of meaningful
  // lines is the strongest remaining completeness signal.
  const leftCompleteness = lyricsCompleteness(left);
  const rightCompleteness = lyricsCompleteness(right);
  if (rightCompleteness.lines !== leftCompleteness.lines) {
    return rightCompleteness.lines - leftCompleteness.lines;
  }

  const incompleteDifference = Number(lyricsLikelyIncomplete(left)) - Number(lyricsLikelyIncomplete(right));
  if (incompleteDifference) return incompleteDifference;
  const coverageDifference = lyricsCoverageScore(right) - lyricsCoverageScore(left);
  if (coverageDifference) return coverageDifference;
  const agentDifference = lyricsAgentTier(right) - lyricsAgentTier(left);
  if (agentDifference) return agentDifference;
  return rightCompleteness.characters - leftCompleteness.characters ||
    Number(right.score || 0) - Number(left.score || 0);
}

function compareAutomaticLyricsSelection(left, right, trackTitle = "") {
  const titleDifference = Number(lyricsContainTrackTitle(right, trackTitle)) -
    Number(lyricsContainTrackTitle(left, trackTitle));
  if (titleDifference) return titleDifference;
  const timingDifference = lyricsTimingTier(right) - lyricsTimingTier(left);
  if (timingDifference) return timingDifference;
  const leftTiming = lyricsWordTimingQuality(left);
  const rightTiming = lyricsWordTimingQuality(right);
  for (const key of ["lineCoverage", "wordValidity", "textCoverage"]) {
    const difference = Number(rightTiming[key] || 0) - Number(leftTiming[key] || 0);
    if (Math.abs(difference) > 0.0001) return difference;
  }
  const leftCompleteness = lyricsCompleteness(left);
  const rightCompleteness = lyricsCompleteness(right);
  if (rightCompleteness.lines !== leftCompleteness.lines) return rightCompleteness.lines - leftCompleteness.lines;
  const coverageDifference = lyricsCoverageScore(right) - lyricsCoverageScore(left);
  if (coverageDifference) return coverageDifference;
  return compareNetEaseFirst(left, right) || Number(right.score || 0) - Number(left.score || 0);
}

function lyricsAgentTier(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLocalLyricsText(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  return lines.some((line) =>
    ["v1", "v2", "v1000"].includes(normalizeLyricsAgent(line?.agent))
  ) ? 1 : 0;
}

function lyricsCompleteness(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLocalLyricsText(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  const meaningful = lines.filter((line) => String(line?.text || "").trim());
  const timedStarts = meaningful.flatMap((line) => [
    ...(line?.time == null ? [] : [Number(line.time)]),
    ...(line?.words || []).flatMap((word) => word?.start == null ? [] : [Number(word.start)])
  ]).filter(Number.isFinite);
  const timedEnds = meaningful.flatMap((line) => [
    ...(line?.time == null ? [] : [Number(line.time)]),
    ...(line?.words || []).flatMap((word) => word?.end == null ? [] : [Number(word.end)])
  ]).filter(Number.isFinite);
  return {
    lines: meaningful.length,
    characters: meaningful.reduce((total, line) => total + String(line.text || "").trim().length, 0),
    firstTime: timedStarts.length ? Math.min(...timedStarts) : null,
    lastTime: timedEnds.length ? Math.max(...timedEnds) : null
  };
}

function lyricsCoverageScore(candidate = {}) {
  const completeness = lyricsCompleteness(candidate);
  if (completeness.firstTime == null || completeness.lastTime == null) return 0;
  const duration = Number(candidate.trackDuration || state.currentTrack?.duration || candidate.duration || 0);
  const beginsNearStart = completeness.firstTime <= 10 ? 2 : completeness.firstTime <= 25 ? 1 : 0;
  const endingCoverage = duration > 0
    ? Math.max(0, Math.min(2, (completeness.lastTime / duration) * 2))
    : 1;
  return beginsNearStart * 3 + endingCoverage;
}

function lyricsLikelyIncomplete(candidate = {}) {
  const completeness = lyricsCompleteness(candidate);
  const duration = Number(candidate.trackDuration || state.currentTrack?.duration || candidate.duration || 0);
  if (duration < 60 || completeness.firstTime == null || completeness.lastTime == null) return false;
  const startsTooLate = completeness.firstTime > Math.min(45, duration * 0.28);
  const endsTooEarly = completeness.lastTime < duration * 0.68;
  return startsTooLate || endsTooEarly || completeness.lines < 4;
}

function candidateQualityLabel(candidate) {
  const timingQuality = lyricsWordTimingQuality(candidate);
  const quality = lyricsTimingTier(candidate) === 3
    ? "word synced"
    : lyricsTimingTier(candidate) === 2
      ? "line synced"
      : "plain";
  const count = Number(candidate?.lineCount || candidate?.lines?.length || 0);
  const roles = lyricsAgentTier(candidate) ? " · multi-singer" : "";
  const completeness = lyricsLikelyIncomplete(candidate) ? " · incomplete" : "";
  const coverage = timingQuality.lineCoverage > 0
    ? ` · ${Math.round(timingQuality.lineCoverage * 100)}% word lines`
    : "";
  const titleMatch = lyricsContainTrackTitle(candidate) ? " · title match" : "";
  return `${quality}${roles}${completeness}${coverage}${titleMatch} · ${count} line${count === 1 ? "" : "s"}`;
}

function isNetEaseLyrics(candidate = {}) {
  const provider = String(candidate.providerKey || candidate.provider || "").trim().toLowerCase();
  return provider === "netease" || provider.includes("netease") || provider.includes("\u7db2\u6613\u96f2");
}

function isMusixmatchLyrics(candidate = {}) {
  const provider = String(candidate.providerKey || candidate.provider || "").trim().toLowerCase();
  return provider === "musixmatch" || provider.includes("musixmatch");
}

function compareNetEaseFirst(left, right) {
  const rank = (candidate) => isNetEaseLyrics(candidate) ? 0 : isMusixmatchLyrics(candidate) ? 1 : 2;
  return rank(left) - rank(right);
}

function lyricsMemoryExactMatch(candidate, memory = selectedLyricsMemoryForTrack()) {
  if (!candidate || !memory) return false;
  const providerKey = String(candidate.providerKey || "").toLowerCase();
  const memoryProviderKey = String(memory.providerKey || "").toLowerCase();
  if (memory.sourceId && candidate.sourceId &&
      lyricsSourceIdsEqual(memory.sourceId, candidate.sourceId, memoryProviderKey || providerKey) &&
      (!memoryProviderKey || !providerKey || memoryProviderKey === providerKey)) return true;
  return Boolean(memoryProviderKey && providerKey === memoryProviderKey && memory.fingerprint &&
    lyricsFingerprint(candidate) === memory.fingerprint);
}

function lyricsMemoryProviderMatch(candidate, memory = selectedLyricsMemoryForTrack()) {
  if (lyricsMemoryExactMatch(candidate, memory)) return true;
  const providerKey = String(candidate?.providerKey || "").toLowerCase();
  const memoryProviderKey = String(memory?.providerKey || "").toLowerCase();
  return Boolean(providerKey && memoryProviderKey && providerKey === memoryProviderKey);
}

// A deliberate choice is a stronger preference than a provider priority. NetEase
// remains the first automatic fallback, but never displaces the lyric version
// the listener saved for this exact song.
function compareSavedLyricsThenNetEase(left, right, memory = selectedLyricsMemoryForTrack()) {
  const exactDifference = Number(lyricsMemoryExactMatch(right, memory)) -
    Number(lyricsMemoryExactMatch(left, memory));
  if (exactDifference) return exactDifference;
  const savedDifference = Number(lyricsMemoryProviderMatch(right, memory)) -
    Number(lyricsMemoryProviderMatch(left, memory));
  if (savedDifference) return savedDifference;
  return compareNetEaseFirst(left, right);
}

function lyricsCacheQuality(result = {}) {
  const completeness = lyricsCompleteness(result);
  return (lyricsTimingTier(result) * 1000000) +
    (wordTimedLineCount(result) * 10000) +
    (lyricsAgentTier(result) * 1000) +
    (completeness.lines * 10) +
    Math.min(999, completeness.characters) -
    (lyricsLikelyIncomplete(result) ? 500000 : 0);
}

async function cacheHighQualityLyrics(track, result, options = {}) {
  const trackId = track?.id || track?.videoId;
  if (!trackId || !result?.found || !result?.lines?.length) return;
  try {
    if (!options.force) {
      const remembered = selectedLyricsMemoryForTrack(track);
      if (remembered?.rawLyrics) {
        const rememberedFingerprint = remembered.fingerprint || lyricsFingerprint({
          lines: parseLocalLyricsText(remembered.rawLyrics)
        });
        const incomingFingerprint = lyricsFingerprint(result);
        // Quality scoring is only an automatic fallback. Once a listener has
        // chosen a specific lyric version, a background lookup must never
        // replace its disk copy merely because another result has more lines.
        if (rememberedFingerprint && incomingFingerprint !== rememberedFingerprint) return;
      }
      const cached = await window.metro.cachedLyrics(trackId);
      if (cached?.result && lyricsCacheQuality(cached.result) > lyricsCacheQuality(result)) return;
    }
    await window.metro.cacheLyrics(trackId, result);
  } catch {
    // Lyrics caching is best effort; playback and live lookup remain available.
  }
}

async function persistAutomaticLyricsSelection(track, candidate) {
  if (!track?.id || !candidate) return null;
  const rawLyrics = String(candidate.rawLyrics || lyricsResultToEditableText(candidate) || "").trim();
  const result = lyricsCandidateToResult(candidate, rawLyrics);
  const savedLocal = saveLocalLyricsForTrack(track, rawLyrics, {
    title: candidate.title || track.title,
    artist: candidate.artist || lyricsSearchArtistFromTrack(track),
    provider: candidate.provider || "Lyrics",
    providerKey: candidate.providerKey || "",
    sourceId: candidate.sourceId || "",
    sourceTitle: candidate.title || "",
    sourceArtist: candidate.artist || ""
  });
  saveLyricsMemoryForTrack(track, candidate, rawLyrics);
  assertLyricsSelectionPersisted(track, rawLyrics);
  await cacheHighQualityLyrics(track, result, { force: true });
  return { result, savedLocal };
}

function lyricsVersionsForSwitcher() {
  const current = state.lyrics;
  // The picker is the search-result order exactly as discovered. The selected
  // source is highlighted in place rather than duplicated or pinned on top.
  const values = (state.lyricsSearchCandidates || [])
    .filter((item) => item?.found !== false && item?.lines?.length);
  const seen = new Set();
  return values.filter((item) => {
    const key = lyricsContentKey(item) || `${item.providerKey || item.provider || ""}:${item.sourceId || ""}:${lyricsFingerprint(item)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function renderLyricsVersionSwitcher() {
  if (!els.lyricsVersionButton || !els.lyricsVersionMenu) return;
  const result = state.lyrics;
  const versions = lyricsVersionsForSwitcher();
  els.lyricsVersionButton.disabled = !result?.found;
  els.lyricsVersionButton.innerHTML = result?.found
    ? `<span>${escapeText(result.provider || "Lyrics")}</span><small>${escapeText(candidateQualityLabel(result))}</small>`
    : `<span>Lyrics source</span><small>No version</small>`;
  els.lyricsVersionMenu.innerHTML = versions.map((version, index) => `
    <button type="button" role="menuitem" data-lyrics-quick-version="${index}" class="${lyricsContentKey(version) === lyricsContentKey(result) ? "active" : ""}">
      <span>${escapeText(version.provider || "Lyrics")}</span>
      <small>${escapeText(candidateQualityLabel(version))}</small>
    </button>
  `).join("") || `<p class="status">No other versions yet.</p>`;
  els.lyricsVersionMenu._items = versions;
}

function closeLyricsVersionMenu() {
  els.lyricsVersionMenu?.classList.add("hidden");
  els.lyricsVersionButton?.setAttribute("aria-expanded", "false");
}

let lyricsVersionSaveChain = Promise.resolve();

function applyLyricsVersionSelection(version, { keepMenuOpen = false, notify = true } = {}) {
  if (!version || !state.currentTrack?.id) return Promise.resolve(false);
  const track = state.currentTrack;
  const trackId = String(track.id);
  const shouldResync = state.lyricsAutoSync;
  const rawLyrics = String(version.rawLyrics || lyricsResultToEditableText(version) || "").trim();
  const result = lyricsCandidateToResult(version, rawLyrics);
  const selectedContentKey = lyricsContentKey(result);

  // Visual feedback is immediate. Disk writes are serialized below so rapid
  // ArrowUp/ArrowDown presses cannot let an older source overwrite the latest.
  state.lyricsTranslation = null;
  state.lyricsTranslationVisible = false;
  state.lyricsUserSelected = true;
  renderLyrics(result);
  restoreLyricsSyncAfterSourceChange(shouldResync);
  if (keepMenuOpen) {
    els.lyricsVersionMenu?.classList.remove("hidden");
    els.lyricsVersionButton?.setAttribute("aria-expanded", "true");
  }

  lyricsVersionSaveChain = lyricsVersionSaveChain.catch(() => {}).then(async () => {
    await clearLyricsSelectionForTrack(track);
    const savedResult = saveLocalLyricsForTrack(track, rawLyrics, {
      title: version.title || track.title,
      artist: version.artist || lyricsSearchArtistFromTrack(track),
      provider: version.provider || "Lyrics",
      providerKey: version.providerKey || "",
      sourceId: version.sourceId || "",
      sourceTitle: version.title || "",
      sourceArtist: version.artist || ""
    });
    saveLyricsMemoryForTrack(track, version, rawLyrics);
    assertLyricsSelectionPersisted(track, rawLyrics);
    await cacheHighQualityLyrics(track, savedResult || result, { force: true });
    if (notify && String(state.currentTrack?.id || "") === trackId &&
        lyricsContentKey(state.lyrics) === selectedContentKey) {
      toast(`Using ${result.provider || "selected"} lyrics.`);
    }
    return true;
  });
  return lyricsVersionSaveChain;
}

function switchLyricsVersionByDirection(direction) {
  const versions = lyricsVersionsForSwitcher();
  if (versions.length < 2) return false;
  const currentKey = lyricsContentKey(state.lyrics);
  const currentIndex = Math.max(0, versions.findIndex((version) => lyricsContentKey(version) === currentKey));
  const nextIndex = (currentIndex + direction + versions.length) % versions.length;
  const keepMenuOpen = Boolean(els.lyricsVersionMenu && !els.lyricsVersionMenu.classList.contains("hidden"));
  void applyLyricsVersionSelection(versions[nextIndex], { keepMenuOpen });
  requestAnimationFrame(() => {
    els.lyricsVersionMenu?.querySelector(".active")?.scrollIntoView({ block: "nearest" });
  });
  return true;
}

function lyricsCandidateToResult(candidate, rawText = lyricsResultToEditableText(candidate), providerOverride = null) {
  const lines = parseLocalLyricsText(rawText);
  if (!lines.length) throw new Error("No lyric lines were found.");
  return {
    found: true,
    provider: providerOverride || candidate.provider || "Lyrics",
    providerKey: candidate.providerKey || "local",
    sourceId: candidate.sourceId || "",
    attemptedProviders: [providerOverride || candidate.provider || "Lyrics"],
    title: candidate.title || state.currentTrack?.title || "Lyrics",
    artist: candidate.artist || lyricsSearchArtistFromTrack(),
    album: candidate.album || "",
    duration: candidate.duration || state.currentTrack?.duration || null,
    synced: lines.some((line) => line.time != null),
    rawLyrics: String(rawText || "").trim(),
    lyricsTargetTitle: candidate.lyricsTargetTitle || "",
    score: Number(candidate.score || 0),
    lines
  };
}

function localLyricsCandidateForTrack(track = state.currentTrack) {
  const local = localLyricsResultForTrack(track);
  if (!local) return null;
  return {
    ...local,
    sourceId: `local:${localLyricsKey(track)}`,
    lineCount: local.lines.length,
    preview: local.lines.slice(0, 3).map((line) => line.text).filter(Boolean).join(" / "),
    score: 100
  };
}

function savedLyricsCandidateForTrack(track = state.currentTrack) {
  const memory = selectedLyricsMemoryForTrack(track);
  const rawLyrics = String(memory?.rawLyrics || "").trim();
  if (!memory || !rawLyrics) return null;
  const lines = parseLocalLyricsText(rawLyrics);
  if (!lines.length) return null;
  return {
    found: true,
    savedSelection: true,
    provider: memory.provider || "Saved lyrics",
    providerKey: memory.providerKey || "local",
    sourceId: memory.sourceId || `saved:${localLyricsKey(track)}`,
    title: memory.title || track?.title || "Lyrics",
    artist: memory.artist || track?.artist || "",
    rawLyrics,
    lines,
    synced: lines.some((line) => line.time != null),
    lineCount: lines.length,
    preview: lines.slice(0, 3).map((line) => line.text).filter(Boolean).join(" / "),
    score: Number.MAX_SAFE_INTEGER
  };
}

function setLyricsSearchPanelOpen(open) {
  state.lyricsSearchOpen = Boolean(open);
  els.lyricsSearchPanel?.classList.toggle("hidden", !state.lyricsSearchOpen);
  document.body.classList.toggle("lyrics-search-open", state.lyricsSearchOpen);
  if (state.lyricsSearchOpen) {
    renderLyricsCandidateList();
    updateLyricsSearchStatus();
    window.setTimeout(() => els.lyricsSearchTitle?.focus(), 0);
  }
  updateLyricsToolState();
}

function lyricsSearchSnapshot() {
  return {
    candidates: [...(state.lyricsSearchCandidates || [])],
    errors: [...(state.lyricsSearchErrors || [])],
    pendingProviders: [...(state.lyricsSearchPendingProviders || [])],
    attemptedProviders: [...(state.lyricsSearchAttemptedProviders || [])],
    providerStates: { ...(state.lyricsSearchProviderStates || {}) },
    selectedIndex: state.lyricsSelectedCandidateIndex,
    loading: state.lyricsSearchLoading,
    savedAt: Date.now()
  };
}

function cacheLyricsSearchState(trackId = state.lyricsSearchTrackId) {
  if (!trackId) return;
  state.lyricsSearchCache.set(String(trackId), lyricsSearchSnapshot());
  while (state.lyricsSearchCache.size > 12) {
    state.lyricsSearchCache.delete(state.lyricsSearchCache.keys().next().value);
  }
}

function restoreLyricsSearchState(trackId) {
  const snapshot = state.lyricsSearchCache.get(String(trackId || ""));
  if (!snapshot) return false;
  state.lyricsSearchCandidates = [...(snapshot.candidates || [])];
  state.lyricsSearchErrors = [...(snapshot.errors || [])];
  state.lyricsSearchPendingProviders = [...(snapshot.pendingProviders || [])];
  state.lyricsSearchAttemptedProviders = [...(snapshot.attemptedProviders || [])];
  state.lyricsSearchProviderStates = { ...(snapshot.providerStates || {}) };
  state.lyricsSelectedCandidateIndex = Number.isFinite(snapshot.selectedIndex) ? snapshot.selectedIndex : -1;
  state.lyricsSearchLoading = Boolean(snapshot.loading && state.lyricsSearchPendingProviders.length);
  return true;
}

function lyricsProviderErrorText(error) {
  const provider = String(error?.provider || "").trim();
  const message = String(error?.message || error || "").trim();
  if (!message) return "";
  return provider ? `${provider}: ${message}` : message;
}

function lyricsProviderErrorSummary(errors = []) {
  const messages = errors.map(lyricsProviderErrorText).filter(Boolean);
  const unique = [...new Set(messages)].slice(0, 2);
  const extraCount = messages.length - unique.length;
  return `${unique.join(" / ")}${extraCount > 0 ? ` / ${extraCount} more` : ""}`;
}

function lyricsCandidateKey(candidate = {}) {
  return [
    candidate.providerKey || candidate.provider || "",
    candidate.sourceId || "",
    candidate.title || "",
    candidate.artist || "",
    String(candidate.rawLyrics || "").slice(0, 160)
  ].join(":").toLowerCase();
}

function lyricsContentKey(candidate = {}) {
  const lines = candidate?.lines?.length
    ? candidate.lines
    : parseLocalLyricsText(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  if (!lines.length) return "";
  const timeKey = (value) => Number.isFinite(Number(value)) ? Number(value).toFixed(4) : null;
  // Text that merely looks the same is not a duplicate when line or word
  // timing differs. Only an identical complete timeline is filtered out.
  return JSON.stringify(lines.map((line) => ({
    text: String(line?.text || ""),
    time: timeKey(line?.time),
    end: timeKey(line?.end ?? line?.endTime ?? line?.duration),
    agent: String(line?.agent || ""),
    background: Boolean(line?.isBackground),
    words: (line?.words || []).map((word) => ({
      text: String(word?.text || ""),
      start: timeKey(word?.start),
      end: timeKey(word?.end)
    }))
  })));
}

function dedupeLyricsCandidates(candidates = []) {
  const seen = new Set();
  return (candidates || []).filter((candidate) => {
    const key = lyricsContentKey(candidate);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function wordTimedLineCount(candidate = {}) {
  const lines = Array.isArray(candidate.lines) && candidate.lines.length
    ? candidate.lines
    : parseLocalLyricsText(candidate.rawLyrics || candidate.syncedLyrics || candidate.plainLyrics || "");
  return lines.filter((line) =>
    Array.isArray(line?.words) &&
    line.words.some((word) =>
      word.start != null && word.end != null &&
      Number.isFinite(Number(word.start)) && Number.isFinite(Number(word.end))
    )
  ).length;
}

function appendLyricsSearchCandidates(candidates = []) {
  const selectedKey = lyricsCandidateKey(state.lyricsSearchCandidates?.[state.lyricsSelectedCandidateIndex] || {});
  const existing = new Set((state.lyricsSearchCandidates || []).map(lyricsCandidateKey));
  const contentIndexes = new Map(
    (state.lyricsSearchCandidates || [])
      .map((candidate, index) => [lyricsContentKey(candidate), index])
      .filter(([key]) => Boolean(key))
  );
  for (const candidate of candidates || []) {
    const key = lyricsCandidateKey(candidate);
    const contentKey = lyricsContentKey(candidate);
    if (!key || existing.has(key)) continue;
    const duplicateIndex = contentKey ? contentIndexes.get(contentKey) : undefined;
    if (duplicateIndex !== undefined) {
      const current = state.lyricsSearchCandidates[duplicateIndex];
      // The saved selection is the source of truth. A newly fetched duplicate
      // may be higher quality, but it must not displace the user's choice.
      if (current.savedSelection) continue;
      const candidateRank = (lyricsTimingTier(candidate) * 10) + lyricsAgentTier(candidate);
      const currentRank = (lyricsTimingTier(current) * 10) + lyricsAgentTier(current);
      if (candidateRank > currentRank) {
        state.lyricsSearchCandidates[duplicateIndex] = candidate;
        existing.add(key);
      }
      continue;
    }
    existing.add(key);
    state.lyricsSearchCandidates.push(candidate);
    if (contentKey) contentIndexes.set(contentKey, state.lyricsSearchCandidates.length - 1);
  }
  state.lyricsSearchCandidates.sort((a, b) => {
    return compareLyricsCandidateQuality(a, b, a.lyricsTargetTitle || b.lyricsTargetTitle || state.currentTrack?.title || "");

    // Keep the discovery order policy stable. A saved/selected version is
    // highlighted in place and controls what is displayed, but is never pinned
    // above the provider order. NetEase remains first, Musixmatch second.
    const providerDifference = compareNetEaseFirst(a, b);
    if (providerDifference) return providerDifference;
    const leftTier = lyricsTimingTier(a);
    const rightTier = lyricsTimingTier(b);

    // Provider groups use one deterministic quality order. In particular,
    // NetEase results are: fully word-timed first, then line-timed, then plain;
    // every timing group is ordered by lyric line count from most to least.
    if (rightTier !== leftTier) return rightTier - leftTier;
    const leftOrderedCompleteness = lyricsCompleteness(a);
    const rightOrderedCompleteness = lyricsCompleteness(b);
    if (rightOrderedCompleteness.lines !== leftOrderedCompleteness.lines) {
      return rightOrderedCompleteness.lines - leftOrderedCompleteness.lines;
    }
    const leftOrderedIncomplete = lyricsLikelyIncomplete(a);
    const rightOrderedIncomplete = lyricsLikelyIncomplete(b);
    if (leftOrderedIncomplete !== rightOrderedIncomplete) return leftOrderedIncomplete ? 1 : -1;
    const wordLineDifference = wordTimedLineCount(b) - wordTimedLineCount(a);
    if (wordLineDifference) return wordLineDifference;
    const coverageDifference = lyricsCoverageScore(b) - lyricsCoverageScore(a);
    if (coverageDifference) return coverageDifference;
    const orderedAgentDifference = lyricsAgentTier(b) - lyricsAgentTier(a);
    if (orderedAgentDifference) return orderedAgentDifference;
    return rightOrderedCompleteness.characters - leftOrderedCompleteness.characters ||
      Number(b.score || 0) - Number(a.score || 0);

    const leftIncomplete = lyricsLikelyIncomplete(a);
    const rightIncomplete = lyricsLikelyIncomplete(b);
    if (leftIncomplete !== rightIncomplete) return leftIncomplete ? 1 : -1;

    // 1. 完整性通過後，再優先 Tier 3 (詞級時間) > Tier 2 > Tier 1。
    if (rightTier !== leftTier) {
      return rightTier - leftTier;
    }

    const leftComp = lyricsCompleteness(a);
    const rightComp = lyricsCompleteness(b);

    const leftFirst = leftComp.firstTime == null ? Number.POSITIVE_INFINITY : leftComp.firstTime;
    const rightFirst = rightComp.firstTime == null ? Number.POSITIVE_INFINITY : rightComp.firstTime;
    const leftCoverage = lyricsCoverageScore(a);
    const rightCoverage = lyricsCoverageScore(b);

    // 2. 若同為 Tier 3 (詞級時間)：單詞時間戳的行數越多 / 歌詞越長越優先
    if (leftTier === 3) {
      // 2a. 第一優先：有單詞時間的行數越多越完整 (每個詞都有時間戳，也就是「時間分每個詞多一點」)
      const leftWordLines = wordTimedLineCount(a);
      const rightWordLines = wordTimedLineCount(b);
      const wordLineDiff = rightWordLines - leftWordLines;
      if (wordLineDiff !== 0) {
        return wordLineDiff;
      }

      const agentDifference = lyricsAgentTier(b) - lyricsAgentTier(a);
      if (agentDifference) return agentDifference;

      // 2b. 詞時間行數相同：歌詞字元數越長越完整 (「歌詞最長的放第一」)
      if (rightComp.characters !== leftComp.characters) {
        return rightComp.characters - leftComp.characters;
      }

      // 2c. 字元數相同：總句數越多越完整
      const lineDiff = rightComp.lines - leftComp.lines;
      if (lineDiff !== 0) {
        return lineDiff;
      }

      // 2d. 仍相同：比較覆蓋度 (越接近歌曲結尾越完整)
      const coverageDiff = rightCoverage - leftCoverage;
      if (coverageDiff !== 0) return coverageDiff;

      // 2e. 最後才比：第一句開頭時間越早越好 (firstTime)
      if (Math.abs(leftFirst - rightFirst) > 0.001) {
        return leftFirst - rightFirst;
      }
    }
    // 3. 若同為 Tier 2 (句級時間)：歌詞越長、句數越多越優先
    else if (leftTier === 2) {
      // 3a. 第一優先：歌詞字元數越長越完整 (最長的歌詞放前面)
      if (rightComp.characters !== leftComp.characters) {
        return rightComp.characters - leftComp.characters;
      }

      // 3b. 字元數相同：總句數越多越完整
      const lineDiff = rightComp.lines - leftComp.lines;
      if (lineDiff !== 0) {
        return lineDiff;
      }

      // 3c. 再比覆蓋度
      const coverageDiff = rightCoverage - leftCoverage;
      if (coverageDiff !== 0) return coverageDiff;

      // 3d. 最後比 firstTime
      if (Math.abs(leftFirst - rightFirst) > 0.001) {
        return leftFirst - rightFirst;
      }
    }
    // 4. 若同為 Tier 1 (純文字/完全沒有任何時間戳)：
    //    一律照總字元數排序 — 字數最多放最前面、字數最少丟到最後面
    else {
      // 4a. 唯一優先：總字元數 characters，字多者必勝、字少者排到後面
      if (rightComp.characters !== leftComp.characters) {
        return rightComp.characters - leftComp.characters;
      }

      // 4b. 字元數完全相同時才用句數當參考 (否則一律不影響字數優先)
      const lineDiff = rightComp.lines - leftComp.lines;
      if (lineDiff !== 0) return lineDiff;

      // 4c. 其餘如 firstTime/coverage 對純文字皆無意義，完全忽略
      //    直接跳過去共用 Tiebreakers (agent/score/provider) 而已
    }

    // 5. Tiebreakers (各分級最終平手時才進入；Tier 1 純文字只有在字數+句數都一樣才會到這裡)
    const agentDifference = lyricsAgentTier(b) - lyricsAgentTier(a);
    if (agentDifference) return agentDifference;
    // Tier 1 純文字：這次把 characters 再比一次當作最後防線，
    // 確保任何情況下字數不同都不可能因 score/provider 而逆轉順序
    if (leftTier === 1 && rightComp.characters !== leftComp.characters) {
      return rightComp.characters - leftComp.characters;
    }
    return (
      Number(b.score || 0) - Number(a.score || 0) ||
      rightComp.characters - leftComp.characters
    );
  });
  if (selectedKey) {
    state.lyricsSelectedCandidateIndex = state.lyricsSearchCandidates
      .findIndex((candidate) => lyricsCandidateKey(candidate) === selectedKey);
  }
}

function removeLyricsPendingProvider(provider) {
  state.lyricsSearchPendingProviders = (state.lyricsSearchPendingProviders || [])
    .filter((item) => item !== provider);
  state.lyricsSearchLoading = state.lyricsSearchPendingProviders.length > 0;
}

function setLyricsProviderState(provider, patch = {}) {
  state.lyricsSearchProviderStates = {
    ...(state.lyricsSearchProviderStates || {}),
    [provider]: {
      provider,
      ...(state.lyricsSearchProviderStates?.[provider] || {}),
      ...patch
    }
  };
}

function lyricsProviderStateText(provider, stateForProvider = {}) {
  if (stateForProvider.status === "searching") return "Searching";
  if (stateForProvider.status === "error") {
    const message = String(stateForProvider.message || "").trim();
    return message ? `Unavailable · ${message.slice(0, 90)}` : "Unavailable";
  }
  const count = Number(stateForProvider.count || 0);
  if (count > 0) return `${count} result${count === 1 ? "" : "s"}`;
  if (provider === "YouTube transcript") return "No transcript available";
  return "No result";
}

function lyricsProviderStateHtml() {
  const enabledOrder = enabledLyricsSearchProviders().map(lyricsProviderLabelByKey);
  const known = Object.keys(state.lyricsSearchProviderStates || {});
  const order = [...enabledOrder, ...known].filter((provider, index, list) => list.indexOf(provider) === index);
  return order.map((provider) => {
    const providerState = state.lyricsSearchProviderStates?.[provider] || {};
    const status = providerState.status || "waiting";
    return `
      <div class="lyrics-provider-state ${escapeText(status)}">
        <strong>${escapeText(provider)}</strong>
        <span>${escapeText(lyricsProviderStateText(provider, providerState))}</span>
      </div>
    `;
  }).join("");
}

function updateLyricsSearchStatus() {
  if (!state.lyricsSearchOpen) return;
  const count = state.lyricsSearchCandidates.length;
  const pending = state.lyricsSearchPendingProviders.length
    ? ` - still searching ${state.lyricsSearchPendingProviders.join(", ")}`
    : "";
  els.lyricsStatus.textContent = `${count} lyrics candidate${count === 1 ? "" : "s"}${pending}`;
}

function renderLyricsCandidateList() {
  if (!els.lyricsCandidateList) return;
  const candidates = state.lyricsSearchCandidates || [];
  renderLyricsVersionSwitcher();
  const pendingNotice = state.lyricsSearchPendingProviders?.length
    ? `Searching ${state.lyricsSearchPendingProviders.join(", ")}...`
    : "";
  const progressHtml = pendingNotice
    ? `<p class="status">${escapeText(pendingNotice)}</p>`
    : "";
  const providerStateHtml = lyricsProviderStateHtml();
  if (!candidates.length) {
    els.lyricsCandidateList.innerHTML = providerStateHtml + `<p class="status">${escapeText(pendingNotice || "No lyrics candidates found.")}</p>`;
    return;
  }
  els.lyricsCandidateList.innerHTML = providerStateHtml + progressHtml + candidates.map((candidate, index) => `
    <button class="lyrics-candidate ${index === state.lyricsSelectedCandidateIndex ? "active" : ""}" data-lyrics-candidate="${index}" type="button">
      <span>
        <strong>${escapeText(candidate.title || "Lyrics")}</strong>
        <small>${escapeText([candidate.artist, candidate.album].filter(Boolean).join(" · ") || "Unknown artist")}</small>
      </span>
      <em>${escapeText(candidate.provider || "Lyrics")} · ${escapeText(candidateQualityLabel(candidate))}</em>
      ${candidate.preview ? `<p>${escapeText(candidate.preview)}</p>` : ""}
    </button>
  `).join("");
}

function selectLyricsCandidate(index) {
  const candidate = state.lyricsSearchCandidates?.[index];
  state.lyricsSelectedCandidateIndex = candidate ? index : -1;
  renderLyricsCandidateList();
  if (!candidate) {
    if (els.lyricsCandidateMeta) els.lyricsCandidateMeta.textContent = "Choose a result.";
    if (els.lyricsEditText) els.lyricsEditText.value = "";
    if (els.lyricsPreviewCandidateButton) els.lyricsPreviewCandidateButton.disabled = true;
    if (els.lyricsUseCandidateButton) els.lyricsUseCandidateButton.disabled = true;
    return;
  }
  if (els.lyricsCandidateMeta) {
    els.lyricsCandidateMeta.textContent = `${candidate.provider} · ${candidateQualityLabel(candidate)}`;
  }
  if (els.lyricsEditText) {
    els.lyricsEditText.value = lyricsResultToEditableText(candidate);
    if (state.lyricsSearchOpen) {
      els.lyricsEditText.focus();
      els.lyricsEditText.setSelectionRange(0, 0);
    }
  }
  if (els.lyricsPreviewCandidateButton) els.lyricsPreviewCandidateButton.disabled = false;
  if (els.lyricsUseCandidateButton) els.lyricsUseCandidateButton.disabled = false;
}

function resetLyricsSearchInputs(track = state.currentTrack) {
  if (els.lyricsSearchTitle) els.lyricsSearchTitle.value = track?.title || "";
  if (els.lyricsSearchArtist) els.lyricsSearchArtist.value = lyricsSearchArtistFromTrack(track);
  setProviderCheckboxesFromSettings();
}

function enabledLyricsSearchProviders() {
  normalizeLyricsSettings();
  const flags = normalizeLyricsProviderFlags(state.settings.lyricsSearchProviders);
  for (const provider of LYRICS_PROVIDER_DEFS) {
    if (els[provider.searchId]) flags[provider.key] = els[provider.searchId].checked;
  }
  const enabled = normalizeLyricsProviderOrder()
    .filter((key) => flags[key] !== false);
  return enabled.length ? enabled : ["lrclib"];
}

function searchDefinitionForProvider(providerKey, baseOptions) {
  const label = lyricsProviderLabelByKey(providerKey);
  if (providerKey === "youtube-transcript") {
    return {
      providerKey,
      provider: label,
      options: { ...baseOptions, providers: [], includeYouTube: true }
    };
  }
  return {
    providerKey,
    provider: label,
    options: { ...baseOptions, providers: [providerKey], includeYouTube: false }
  };
}

function preferredLyricsCandidateIndex() {
  // Search-result order is the single source of truth everywhere.
  return state.lyricsSearchCandidates.length ? 0 : -1;
}

function selectPreferredLyricsCandidate() {
  const preferredIndex = preferredLyricsCandidateIndex();
  selectLyricsCandidate(preferredIndex);
}

async function searchLyricsCandidatesForCurrent({ background = false, force = true } = {}) {
  if (!state.currentTrack?.id) {
    if (!background) toast("Choose a song before searching lyrics.", true);
    return;
  }
  const searchTrack = { ...state.currentTrack };
  const searchTrackId = String(searchTrack.id);
  const prefetchedBackupCandidates = state.lyricsPrefetchCandidates.get(lyricsCacheKey(searchTrack)) || [];
  if (!force && state.lyricsSearchTrackId === searchTrackId &&
      (state.lyricsSearchCandidates.length || state.lyricsSearchLoading)) {
    renderLyricsCandidateList();
    return;
  }
  const request = state.lyricsSearchRequest + 1;
  state.lyricsSearchRequest = request;
  state.lyricsSearchTrackId = searchTrackId;
  state.lyricsSearchLoading = true;
  state.lyricsSelectedCandidateIndex = -1;
  state.lyricsSearchCandidates = [];
  state.lyricsSearchErrors = [];
  state.lyricsSearchAttemptedProviders = [];
  const enabledProviders = enabledLyricsSearchProviders();
  state.lyricsSearchPendingProviders = enabledProviders.map(lyricsProviderLabelByKey);
  state.lyricsSearchProviderStates = {};
  for (const provider of state.lyricsSearchPendingProviders) {
    setLyricsProviderState(provider, { status: "searching", count: 0, message: "" });
  }
  const remembered = selectedLyricsMemoryForTrack(searchTrack);
  const displayedSavedCandidate = remembered && state.lyrics?.found && state.lyrics?.lines?.length
    ? {
        ...state.lyrics,
        savedSelection: true,
        providerKey: remembered.providerKey || state.lyrics.providerKey || "local",
        sourceId: remembered.sourceId || state.lyrics.sourceId || `saved:${localLyricsKey(searchTrack)}`,
        rawLyrics: state.lyrics.rawLyrics || lyricsResultToEditableText(state.lyrics),
        lineCount: state.lyrics.lines.length,
        score: Number.MAX_SAFE_INTEGER
      }
    : null;
  const savedCandidate = savedLyricsCandidateForTrack(searchTrack) || displayedSavedCandidate;
  const localCandidate = localLyricsCandidateForTrack(searchTrack);
  const hadPersistedLyrics = Boolean(savedCandidate || localCandidate);
  appendLyricsSearchCandidates([
    savedCandidate,
    localCandidate,
    ...prefetchedBackupCandidates
  ].filter(Boolean));
  renderLyricsCandidateList();
  selectPreferredLyricsCandidate();
  updateLyricsSearchStatus();
  updateLyricsToolState();

  const identity = await resolveLyricsSearchIdentity(searchTrack);
  if (request !== state.lyricsSearchRequest || String(state.currentTrack?.id || "") !== searchTrackId) return;
  if (background) {
    if (els.lyricsSearchTitle) els.lyricsSearchTitle.value = identity.title || searchTrack.title || "";
    if (els.lyricsSearchArtist) els.lyricsSearchArtist.value = identity.artist || "";
  }
  const baseOptions = {
      title: els.lyricsSearchTitle?.value || identity.title || searchTrack.title || "",
      artist: els.lyricsSearchArtist?.value || identity.artist || lyricsSearchArtistFromTrack(searchTrack),
      limit: 50,
      noTimeout: !background
  };
  const searches = enabledProviders.map((provider) => searchDefinitionForProvider(provider, baseOptions));

  const searchPromises = searches.map(async (search) => {
    try {
      const result = await window.metro.searchLyrics(searchTrack, search.options);
      if (request !== state.lyricsSearchRequest || String(state.currentTrack?.id || "") !== searchTrackId) return [];
      const resultCandidates = Array.isArray(result?.candidates) ? result.candidates : [];
      const resultErrors = Array.isArray(result?.errors) ? result.errors.filter(Boolean) : [];

      state.lyricsSearchErrors.push(...resultErrors);
      state.lyricsSearchAttemptedProviders.push(...(Array.isArray(result?.attemptedProviders) ? result.attemptedProviders : [search.provider]));
      const providerError = resultErrors.find((error) => error?.provider === search.provider);
      setLyricsProviderState(search.provider, {
        status: providerError ? "error" : "done",
        count: resultCandidates.length,
        message: providerError ? providerError.message : ""
      });
      return resultCandidates;
    } catch (error) {
      if (request !== state.lyricsSearchRequest || String(state.currentTrack?.id || "") !== searchTrackId) return [];
      const message = error.message || "Lyrics search failed.";
      state.lyricsSearchErrors.push({ provider: search.provider, message });
      setLyricsProviderState(search.provider, { status: "error", count: 0, message });
      return [];
    } finally {
      removeLyricsPendingProvider(search.provider);
      updateLyricsSearchStatus();
    }
  });

  const settledResults = await Promise.allSettled(searchPromises);
  if (request !== state.lyricsSearchRequest || String(state.currentTrack?.id || "") !== searchTrackId) return;

  const allCandidates = settledResults
    .flatMap((res) => (res.status === "fulfilled" ? res.value || [] : []))
    .map((candidate) => ({ ...candidate, lyricsTargetTitle: baseOptions.title }));
  appendLyricsSearchCandidates(allCandidates);

  // 所有來源搜尋完畢後，若無手動選定且未匹配到使用者記憶偏好，才選出第一名最佳歌詞
  if (!state.lyricsReloading && !hadPersistedLyrics && state.lyricsSearchCandidates.length) {
    try {
      // Index zero is authoritative, including when an older saved selection
      // was rendered while providers were still searching in background.
      const selectedCandidate = state.lyricsSearchCandidates[0];
      if (state.currentTrack?.id === searchTrackId) {
        const persisted = await persistAutomaticLyricsSelection(searchTrack, selectedCandidate);
        if (request !== state.lyricsSearchRequest || String(state.currentTrack?.id || "") !== searchTrackId) return;
        state.lyricsUserSelected = true;
        state.lyricsSelectedCandidateIndex = state.lyricsSearchCandidates.indexOf(selectedCandidate);
        renderLyrics(persisted?.result || lyricsCandidateToResult(selectedCandidate));
      }
    } catch (error) {
      if (state.settings.debugLogs) console.warn("Automatic lyrics persistence failed", error);
    }
  }

  if (state.lyricsSearchCandidates.length) state.lyricsSelectedCandidateIndex = 0;
  renderLyricsCandidateList();
  updateLyricsSearchStatus();
  updateLyricsToolState();
  cacheLyricsSearchState(searchTrackId);
}

function openLyricsSearchPanel() {
  if (!state.currentTrack?.id) {
    toast("Choose a song before searching lyrics.", true);
    return;
  }
  switchSidePanel("lyrics");
  resetLyricsSearchInputs(state.currentTrack);
  setLyricsSearchPanelOpen(true);
  searchLyricsCandidatesForCurrent({ background: false, force: false });
}

function lyricsFingerprint(result = state.lyrics) {
  const text = (result?.lines || []).map((line) => line.text || "").join("\n");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }
  return String(hash >>> 0);
}

function translationCacheKey(result = state.lyrics, target = state.settings.lyricsTranslateTarget) {
  return [state.currentTrack?.id || "", result?.providerKey || "", target || "zh-TW", lyricsFingerprint(result)].join(":");
}

function cachedTranslationForLyrics(result = state.lyrics) {
  const store = readStoredObject(LYRICS_TRANSLATION_KEY);
  return store[translationCacheKey(result)] || null;
}

function saveTranslationForLyrics(result, translation) {
  const store = readStoredObject(LYRICS_TRANSLATION_KEY);
  store[translationCacheKey(result)] = {
    ...translation,
    cachedAt: new Date().toISOString()
  };
  writeStoredObject(LYRICS_TRANSLATION_KEY, store);
}

function romanizationCacheKey(result = state.lyrics) {
  return [state.currentTrack?.id || "", result?.providerKey || "", lyricsFingerprint(result)].join(":");
}

function cachedRomanizationForLyrics(result = state.lyrics) {
  return readStoredObject(LYRICS_ROMANIZATION_KEY)[romanizationCacheKey(result)] || null;
}

function saveRomanizationForLyrics(result, romanization) {
  const store = readStoredObject(LYRICS_ROMANIZATION_KEY);
  store[romanizationCacheKey(result)] = {
    ...romanization,
    cachedAt: new Date().toISOString()
  };
  writeStoredObject(LYRICS_ROMANIZATION_KEY, store);
}

function translatedTextForLine(index) {
  if (!state.lyricsTranslationVisible || !state.lyricsTranslation?.lines) return "";
  const original = String(state.lyrics?.lines?.[index]?.text || "").trim();
  const translated = String(state.lyricsTranslation.lines[index]?.text || "").trim();
  return normalizedAuxiliaryLyricText(translated) === normalizedAuxiliaryLyricText(original) ? "" : translated;
}

function normalizedAuxiliaryLyricText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\u2019'\u0060\u00b4]/g, "")
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

function romanizedTextForLine(index) {
  if (!state.lyricsRomanizationVisible || !state.lyricsRomanization?.lines) return "";
  const original = String(state.lyrics?.lines?.[index]?.text || "").trim();
  const romanized = String(state.lyricsRomanization.lines[index]?.text || "").trim();
  return romanized && normalizedAuxiliaryLyricText(romanized) !== normalizedAuxiliaryLyricText(original) ? romanized : "";
}

function lyricGraphemes(text = "") {
  if (typeof Intl?.Segmenter === "function") {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(String(text))]
      .map((part) => part.segment);
  }
  return Array.from(String(text));
}

function alignedTimedLyricSegments(line) {
  const source = String(line?.text || "");
  const words = Array.isArray(line?.words) ? line.words : [];
  if (!source || !words.length) return [];
  const sourceFolded = source.toLocaleLowerCase();
  let cursor = 0;
  let alignmentFailed = false;
  const segments = words.map((word, index) => {
    const needle = String(word?.text || "").trim();
    if (!needle) return null;
    let startIndex = source.indexOf(needle, cursor);
    if (startIndex < 0) startIndex = sourceFolded.indexOf(needle.toLocaleLowerCase(), cursor);
    if (startIndex < 0) {
      alignmentFailed = true;
      return {
        ...word,
        index,
        prefix: cursor > 0 && /[\p{L}\p{N}]$/u.test(source.slice(0, cursor)) ? "" : (index ? " " : ""),
        displayText: needle,
        sourceEnd: cursor
      };
    }
    const displayText = source.slice(startIndex, startIndex + needle.length);
    const segment = {
      ...word,
      index,
      prefix: source.slice(cursor, startIndex),
      displayText,
      sourceEnd: startIndex + needle.length
    };
    cursor = segment.sourceEnd;
    return segment;
  }).filter(Boolean);
  if (alignmentFailed || segments.length !== words.length) return [];
  return segments.map((segment, index) => ({
    ...segment,
    suffix: index === segments.length - 1 ? source.slice(cursor) : ""
  }));
}

function lyricTextTokenHtml(value) {
  const text = String(value || "");
  if (!text) return "";
  let segments = [];
  try {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
    segments = [...segmenter.segment(text)];
  } catch {
    segments = text.split(/(\s+)/).map((segment) => ({ segment, isWordLike: !/^\s+$/.test(segment) }));
  }
  return segments.map(({ segment, isWordLike }) => isWordLike
    // Explicit break opportunities keep every token intact even for sources
    // whose timed words have no literal spaces between their spans.
    ? `<wbr><span class="lyric-text-token">${escapeText(segment)}</span>`
    : escapeText(segment)
  ).join("");
}

function lyricOriginalHtml(line, granular = state.lyricsExpanded) {
  const words = Array.isArray(line?.words) ? line.words : [];
  if (!words.length) return lyricTextTokenHtml(line?.text || "");
  const alignedSegments = alignedTimedLyricSegments(line);
  const renderWords = alignedSegments.length === words.length
    ? alignedSegments
    : words.map((word, index) => ({
        ...word,
        index,
        prefix: index ? " " : "",
        displayText: String(word?.text || ""),
        suffix: ""
      }));
  return renderWords.map((word) => {
    const start = Number(word.start);
    const end = Number(word.end);
    const safeText = escapeText(word.displayText || word.text || "");
    if (!safeText) return "";
    const graphemes = granular ? lyricGraphemes(word.displayText || word.text || "") : [];
    const graphemeHtml = graphemes.map((grapheme, graphemeIndex) =>
      `<span class="lyric-grapheme" style="--grapheme-progress:0;--grapheme-index:${graphemeIndex}" data-grapheme-index="${graphemeIndex}">${escapeText(grapheme)}</span>${/[/:：／|｜·、，,;；]/.test(grapheme) ? "<wbr>" : ""}`
    ).join("");
    return `${escapeText(word.prefix || "")}<wbr><span class="lyric-word" style="--word-progress:0%" data-word-index="${word.index}" data-grapheme-count="${graphemes.length}" data-start="${Number.isFinite(start) ? start : ""}" data-end="${Number.isFinite(end) ? end : ""}">${graphemeHtml || safeText}</span>${escapeText(word.suffix || "")}`;
  }).filter(Boolean).join("");
}

function lyricLineHtml(line, index, options = {}) {
  const translation = translatedTextForLine(index);
  const romanization = romanizedTextForLine(index);
  const agent = normalizeLyricsAgent(line?.agent);
  const roleClass = line?.isBackground
    ? "background-vocal"
    : agent === "v1" || agent === "1"
      ? "agent-v1"
      : agent === "v2" || agent === "2"
        ? "agent-v2"
        : agent === "v1000" || agent === "1000"
          ? "agent-v1000"
          : "";
  const direction = /[\u0590-\u08ff]/.test(String(line?.text || "")) ? "rtl" : "ltr";
  return `
    <button class="lyric-line ${translation || romanization ? "translated" : ""} ${roleClass}" data-index="${index}" data-time="${line.time ?? ""}" dir="${direction}" type="button">
      <span class="lyric-original">${lyricOriginalHtml(line, options.granular ?? state.lyricsExpanded)}</span>
      ${romanization ? `<span class="lyric-romanization">${lyricTextTokenHtml(romanization)}</span>` : ""}
      ${translation ? `<span class="lyric-translation">${lyricTextTokenHtml(translation)}</span>` : ""}
    </button>
  `;
}

let lyricTokenWrapMeasurementFrame = 0;
function scheduleLyricTokenWrapMeasurement() {
  if (lyricTokenWrapMeasurementFrame) cancelAnimationFrame(lyricTokenWrapMeasurementFrame);
  lyricTokenWrapMeasurementFrame = requestAnimationFrame(() => {
    lyricTokenWrapMeasurementFrame = 0;
    for (const token of document.querySelectorAll(".lyric-word, .lyric-text-token")) {
      token.classList.remove("lyric-word-overflow");
      token.style.removeProperty("--lyric-overflow-font-size");
      const container = token.closest(".lyric-original, .lyric-romanization, .lyric-translation");
      const availableWidth = container?.clientWidth || 0;
      const tokenWidth = token.getBoundingClientRect().width;
      if (availableWidth > 0 && tokenWidth > availableWidth + 1) {
        token.classList.add("lyric-word-overflow");
        const fitScale = Math.max(.35, Math.min(1, (availableWidth - 2) / tokenWidth));
        token.style.setProperty("--lyric-overflow-font-size", `${fitScale}em`);
      }
    }
  });
}

window.addEventListener("resize", scheduleLyricTokenWrapMeasurement, { passive: true });

function lyricsTimelineNow() {
  return (els.audio.currentTime || 0) + (Number(state.lyricsOffsetMs || 0) / 1000);
}

function seekTimeForLyricLine(time) {
  return Math.max(0, Number(time) - (Number(state.lyricsOffsetMs || 0) / 1000));
}

function updateWordHighlights(lineElement, now) {
  if (!lineElement) return;
  const words = lineElement._cachedLyricWords || [...lineElement.querySelectorAll(".lyric-word")];
  lineElement._cachedLyricWords = words;
  if (!words.length) return;
  for (const word of words) {
    const start = Number(word.dataset.start);
    const end = Number(word.dataset.end);
    const hasTiming = Number.isFinite(start) && Number.isFinite(end);
    const current = hasTiming && now >= start && now < end;
    const passed = hasTiming && now >= end;
    const progress = !hasTiming || now <= start
      ? 0
      : now >= end
        ? 100
        : Math.max(0, Math.min(100, ((now - start) / Math.max(0.01, end - start)) * 100));
    const progressStep = Math.round(progress * 2) / 2;
    const progressChanged = word._lastLyricProgress !== progressStep;
    const currentChanged = word._lastLyricCurrent !== current;
    const passedChanged = word._lastLyricPassed !== passed;
    if (progressChanged) {
      word.style.setProperty("--word-progress", `${progressStep}%`);
      word._lastLyricProgress = progressStep;
    }
    if (currentChanged) {
      word.classList.toggle("current", current);
      word._lastLyricCurrent = current;
    }
    if (passedChanged) {
      word.classList.toggle("passed", passed);
      word._lastLyricPassed = passed;
    }
    // During wheel/touch interaction, keep sentence and word timing correct but
    // defer the expensive per-grapheme paint until scrolling has settled.
    if ((!progressChanged && !currentChanged && !passedChanged) || performance.now() < state.lyricsInteractionUntil) continue;
    const graphemes = word._cachedLyricGraphemes || [...word.querySelectorAll(".lyric-grapheme")];
    word._cachedLyricGraphemes = graphemes;
    const normalizedProgress = progress / 100;
    graphemes.forEach((grapheme, index) => {
      const characterProgress = Math.max(0, Math.min(1, normalizedProgress * graphemes.length - index));
      const graphemeStep = Math.round(characterProgress * 20) / 20;
      if (grapheme._lastLyricProgress !== graphemeStep) {
        grapheme.style.setProperty("--grapheme-progress", String(graphemeStep));
        grapheme._lastLyricProgress = graphemeStep;
      }
      const graphemeCurrent = current && characterProgress > 0 && characterProgress < 1;
      const graphemePassed = characterProgress >= 1;
      if (grapheme._lastLyricCurrent !== graphemeCurrent) {
        grapheme.classList.toggle("current", graphemeCurrent);
        grapheme._lastLyricCurrent = graphemeCurrent;
      }
      if (grapheme._lastLyricPassed !== graphemePassed) {
        grapheme.classList.toggle("passed", graphemePassed);
        grapheme._lastLyricPassed = graphemePassed;
      }
    });
  }
}

function lyricLineEndTime(lines, index) {
  const line = lines[index] || {};
  if (Number.isFinite(line._cachedPlaybackEndTime)) return line._cachedPlaybackEndTime;
  const wordEnd = Math.max(0, ...(line.words || []).map((word) => Number(word.end) || 0));
  if (wordEnd > Number(line.time || 0)) {
    line._cachedPlaybackEndTime = wordEnd;
    return wordEnd;
  }
  for (let next = index + 1; next < lines.length; next += 1) {
    if (Number.isFinite(Number(lines[next]?.time))) {
      line._cachedPlaybackEndTime = Number(lines[next].time);
      return line._cachedPlaybackEndTime;
    }
  }
  line._cachedPlaybackEndTime = Number(line.time || 0) + 4;
  return line._cachedPlaybackEndTime;
}

function rebuildLyricsPlaybackIndex(lines = []) {
  state.lyricsMainTimeline = [];
  state.lyricsBackgroundTimeline = [];
  let pairedMain = -1;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] || {};
    const time = Number(line.time);
    if (line.time == null || !Number.isFinite(time)) continue;
    if (!line.isBackground) {
      pairedMain = index;
      state.lyricsMainTimeline.push({ time, index });
    } else {
      state.lyricsBackgroundTimeline.push({
        time,
        end: lyricLineEndTime(lines, index),
        index,
        pairedMain
      });
    }
  }
}

function mainLyricIndexAt(now) {
  const timeline = state.lyricsMainTimeline || [];
  let low = 0;
  let high = timeline.length - 1;
  let found = -1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (timeline[middle].time <= now + 0.15) {
      found = timeline[middle].index;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return found;
}

function lyricPlaybackState(lines, now) {
  const currentMain = mainLyricIndexAt(now);
  const active = new Set();
  const visibleBackground = new Set();
  for (const background of state.lyricsBackgroundTimeline || []) {
    const directActive = now >= background.time && now < background.end;
    if (directActive) visibleBackground.add(background.index);
    if (directActive) {
      active.add(background.index);
      if (background.pairedMain >= 0) active.add(background.pairedMain);
    }
  }

  if (currentMain >= 0) active.add(currentMain);

  const mainTargets = [...active].filter((index) => !lines[index]?.isBackground);
  return {
    active,
    visibleBackground,
    targetIndex: mainTargets.length ? Math.max(...mainTargets) : currentMain
  };
}

function resetLyricWordHighlights(element) {
  if (!element) return;
  const words = element._cachedLyricWords || [...element.querySelectorAll(".lyric-word")];
  element._cachedLyricWords = words;
  for (const word of words) {
    if (word._lastLyricProgress === 0 && !word._lastLyricCurrent && !word._lastLyricPassed) continue;
    word.classList.remove("current", "passed");
    word.style.setProperty("--word-progress", "0%");
    word._lastLyricProgress = 0;
    word._lastLyricCurrent = false;
    word._lastLyricPassed = false;
    const graphemes = word._cachedLyricGraphemes || [...word.querySelectorAll(".lyric-grapheme")];
    word._cachedLyricGraphemes = graphemes;
    for (const grapheme of graphemes) {
      grapheme.classList.remove("current", "passed");
      grapheme.style.setProperty("--grapheme-progress", "0");
      grapheme._lastLyricProgress = 0;
      grapheme._lastLyricCurrent = false;
      grapheme._lastLyricPassed = false;
    }
  }
}

function selectedLyricLinesForShare() {
  const lines = state.lyrics?.lines || [];
  const selectedIndexes = [...(state.lyricsShareSelection || new Set())]
    .filter((index) => lines[index])
    .sort((a, b) => a - b);
  const indexes = selectedIndexes.length
    ? selectedIndexes
    : [state.activeLyricIndex, state.activeLyricIndex + 1].filter((index) => index >= 0 && lines[index]);
  return indexes.map((index) => lines[index]?.text || "").filter(Boolean).slice(0, 5);
}

function lrcTimestamp(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(value / 60);
  const rest = (value % 60).toFixed(2).padStart(5, "0");
  return `${String(minutes).padStart(2, "0")}:${rest}`;
}

function lyricsToLrc(lines = state.lyrics?.lines || []) {
  return (lines || []).map((line) => {
    const text = String(line?.text || "").trim();
    if (!text) return "";
    const role = line.isBackground ? "{bg}" : line.agent ? `{agent:${line.agent}}` : "";
    return line.time == null ? `${role}${text}` : `[${lrcTimestamp(line.time)}]${role}${text}`;
  }).filter(Boolean).join("\n");
}

function saveEditedLyricsTimeline() {
  if (!state.currentTrack?.id || !state.lyrics?.lines?.length) return;
  const result = saveLocalLyricsForTrack(state.currentTrack, lyricsToLrc(state.lyrics.lines), {
    title: state.lyrics.title || state.currentTrack.title,
    artist: state.lyrics.artist || state.currentTrack.artist || state.currentTrack.subtitle || "",
    provider: "Timeline editor",
    providerKey: "local"
  });
  state.lyrics = result;
}

function updateLyricLineTime(index, seconds) {
  if (!state.lyrics?.lines?.[index]) return;
  const line = state.lyrics.lines[index];
  line.time = Math.max(0, Number(seconds) || 0);
  state.lyrics.synced = true;
  saveEditedLyricsTimeline();
  renderLyrics(state.lyrics);
  state.lyricsTimelineEditing = true;
  renderLyricsTimelineEditor();
  toast("Lyrics timeline saved.");
}

function nextUntimedLyricIndex(startIndex = 0) {
  const lines = state.lyrics?.lines || [];
  for (let index = Math.max(0, startIndex); index < lines.length; index += 1) {
    if (lines[index]?.time == null) return index;
  }
  return -1;
}

function updateLyricsTapTimingControls() {
  const total = state.lyrics?.lines?.length || 0;
  const nextIndex = state.lyricsTapTimingActive ? state.lyricsTapTimingIndex : nextUntimedLyricIndex();
  if (els.lyricsTapTimingButton) {
    els.lyricsTapTimingButton.classList.toggle("active", state.lyricsTapTimingActive);
    els.lyricsTapTimingButton.setAttribute("aria-pressed", String(state.lyricsTapTimingActive));
    els.lyricsTapTimingButton.textContent = state.lyricsTapTimingActive
      ? componentText("Stop timing")
      : componentText("Start timing");
    els.lyricsTapTimingButton.disabled = !total || (!state.lyricsTapTimingActive && nextIndex < 0);
  }
  if (els.lyricsTapTimingStatus) {
    els.lyricsTapTimingStatus.textContent = !total
      ? componentText("Load lyrics first.")
      : nextIndex < 0
        ? componentText("Every line has a timestamp.")
        : state.lyricsTapTimingActive
          ? componentText("Press Space for line {current} of {total}. Each tap is saved.", { current: nextIndex + 1, total })
          : componentText("Ready at line {current}. Play the song, then press Space on each line.", { current: nextIndex + 1 });
  }
}

function setLyricsTapTimingActive(active) {
  const nextIndex = active ? nextUntimedLyricIndex(Math.max(0, state.lyricsTapTimingIndex)) : -1;
  state.lyricsTapTimingActive = Boolean(active && nextIndex >= 0);
  state.lyricsTapTimingIndex = state.lyricsTapTimingActive ? nextIndex : -1;
  if (state.lyricsTapTimingActive && state.currentTrack && !state.playing) els.playButton?.click();
  updateLyricsTapTimingControls();
  renderLyricsTimelineEditor();
}

function stampNextUntimedLyric() {
  if (!state.lyricsTapTimingActive) return;
  const index = nextUntimedLyricIndex(state.lyricsTapTimingIndex);
  if (index < 0 || !state.lyrics?.lines?.[index]) {
    setLyricsTapTimingActive(false);
    return;
  }
  state.lyrics.lines[index].time = Math.max(0, lyricsTimelineNow());
  state.lyrics.synced = true;
  saveEditedLyricsTimeline();
  renderLyrics(state.lyrics);
  state.lyricsTimelineEditing = true;
  const nextIndex = nextUntimedLyricIndex(index + 1);
  state.lyricsTapTimingIndex = nextIndex;
  if (nextIndex < 0) {
    state.lyricsTapTimingActive = false;
    toast("All lyric timestamps saved.");
  }
  renderLyricsTimelineEditor();
}

function setLyricsTimelinePanelOpen(open) {
  state.lyricsTimelineEditing = Boolean(open && state.lyrics?.lines?.length);
  if (!state.lyricsTimelineEditing) {
    state.lyricsTapTimingActive = false;
    state.lyricsTapTimingIndex = -1;
  }
  els.lyricsTimelinePanel?.classList.toggle("hidden", !state.lyricsTimelineEditing);
  document.body.classList.toggle("lyrics-timeline-open", state.lyricsTimelineEditing);
  updateLyricsToolState();
  renderLyricsTimelineEditor();
  if (state.lyricsTimelineEditing) {
    drawLyricsTimelineWaveform();
    window.setTimeout(() => els.lyricsTimelineCloseButton?.focus(), 0);
  }
}

function drawLyricsTimelineWaveform() {
  const canvas = els.lyricsTimelineWaveform;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const middle = height / 2;
  const duration = Number(els.audio.duration || state.currentTrack?.durationSeconds || 0);
  const currentTime = Number(els.audio.currentTime || 0);
  const progress = duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0;
  const theme = getComputedStyle(document.documentElement).getPropertyValue("--theme-color").trim() || "255, 61, 61";
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(255,255,255,.035)";
  context.fillRect(0, 0, width, height);
  const peaks = state.lyricsWaveformPeaks || [];
  const barWidth = width / Math.max(1, peaks.length);
  for (let index = 0; index < peaks.length; index += 1) {
    const peak = Math.max(0.035, Number(peaks[index] || 0));
    const barHeight = Math.max(2, peak * (height - 18));
    context.fillStyle = index / peaks.length <= progress
      ? `rgba(${theme}, .88)`
      : "rgba(255,255,255,.22)";
    context.fillRect(index * barWidth, middle - barHeight / 2, Math.max(1, barWidth - 1), barHeight);
  }
  context.fillStyle = "#fff";
  context.fillRect(Math.round(progress * width) - 1, 0, 2, height);
  if (els.lyricsTimelineWaveformStatus) {
    els.lyricsTimelineWaveformStatus.textContent = duration > 0
      ? `${formatClock(currentTime)} / ${formatClock(duration)} · click the waveform to seek`
      : "Play the song to view its live waveform. Click to seek.";
  }
}

function renderLyricsTimelineEditor() {
  if (!els.lyricsTimelineEditor) return;
  if (!state.lyricsTimelineEditing || !state.lyrics?.lines?.length) {
    state.lyricsTimelineEditing = false;
    document.body.classList.remove("lyrics-timeline-open");
    els.lyricsTimelinePanel?.classList.add("hidden");
    els.lyricsTimelineEditor.classList.add("hidden");
    els.lyricsTimelineEditor.innerHTML = "";
    updateLyricsTapTimingControls();
    renderLyricsVersionList();
    return;
  }
  els.lyricsTimelinePanel?.classList.remove("hidden");
  els.lyricsTimelineEditor.classList.remove("hidden");
  els.lyricsTimelineEditor.innerHTML = state.lyrics.lines.map((line, index) => `
    <div class="timeline-line-row ${index === state.activeLyricIndex ? "active" : ""} ${state.lyricsTapTimingActive && index === state.lyricsTapTimingIndex ? "tap-next" : ""}" data-timeline-index="${index}">
      <span>${line.time == null ? "--:--" : formatClock(line.time)}</span>
      <strong>${escapeText(line.text || "")}</strong>
      <div class="timeline-line-actions">
        <button data-timeline-shift="${index}" data-delta="-0.1" type="button">-100</button>
        <button data-timeline-set="${index}" type="button">Set</button>
        <button data-timeline-shift="${index}" data-delta="0.1" type="button">+100</button>
      </div>
    </div>
  `).join("");
  updateLyricsTapTimingControls();
  renderLyricsVersionList();
}

function renderLyricsVersionList() {
  if (!els.lyricsVersionList) return;
  const key = localLyricsKey(state.currentTrack);
  const entry = key ? readStoredObject(LOCAL_LYRICS_KEY)[key] : null;
  const versions = Array.isArray(entry?.history) ? entry.history : [];
  if (!versions.length) {
    els.lyricsVersionList.innerHTML = `<p class="status">No earlier corrections yet. Each saved edit creates a restorable version.</p>`;
    return;
  }
  els.lyricsVersionList.innerHTML = versions.map((version, index) => `
    <div class="lyrics-version-row">
      <div>
        <strong>${escapeText(new Date(version.savedAt || Date.now()).toLocaleString())}</strong>
        <small>${escapeText(version.sourceProvider || "Manual")} · ${escapeText(String(version.rawLyrics || "").split(/\n+/).filter(Boolean).length)} lines</small>
      </div>
      <button class="secondary" data-lyrics-version-restore="${index}" type="button">Restore</button>
    </div>
  `).join("");
}

function restoreLyricsVersion(index) {
  const key = localLyricsKey(state.currentTrack);
  const entry = key ? readStoredObject(LOCAL_LYRICS_KEY)[key] : null;
  const version = entry?.history?.[index];
  if (!version?.rawLyrics) return;
  const result = saveLocalLyricsForTrack(state.currentTrack, version.rawLyrics, {
    title: version.title,
    artist: version.artist,
    provider: `Restored ${version.sourceProvider || "correction"}`,
    providerKey: "local"
  });
  state.lyrics = result;
  renderLyrics(result);
  state.lyricsTimelineEditing = true;
  renderLyricsTimelineEditor();
  toast("Lyrics correction restored.");
}

function wrapCanvasText(context, text, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (context.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function shareLyricsCard() {
  const lyrics = selectedLyricLinesForShare();
  if (!lyrics.length) {
    toast("Select or play a lyric line before sharing.", true);
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  const theme = getComputedStyle(document.documentElement).getPropertyValue("--theme-color").trim() || "255, 61, 61";
  const template = state.settings.lyricsCardTemplate || "auralane";
  if (template === "clean") {
    ctx.fillStyle = "#f7f5ef";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${theme})`;
    ctx.fillRect(72, 72, 7, 486);
    ctx.fillStyle = "#171717";
  } else if (template === "poster") {
    ctx.fillStyle = "#050506";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const glow = ctx.createRadialGradient(900, 140, 20, 900, 140, 520);
    glow.addColorStop(0, `rgba(${theme}, 0.48)`);
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.94)";
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, `rgba(${theme}, 0.92)`);
    gradient.addColorStop(0.58, "#17171b");
    gradient.addColorStop(1, "#050506");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.94)";
  }
  const textColor = template === "clean" ? "#171717" : "rgba(255,255,255,0.94)";
  const metaColor = template === "clean" ? "rgba(23,23,23,0.64)" : "rgba(255,255,255,0.72)";
  ctx.fillStyle = textColor;
  ctx.font = template === "poster" ? "900 52px Inter, Segoe UI, sans-serif" : "800 44px Inter, Segoe UI, sans-serif";
  const maxWidth = template === "clean" ? 980 : 920;
  const lyricLines = lyrics.flatMap((line) => wrapCanvasText(ctx, line, maxWidth)).slice(0, template === "poster" ? 6 : 8);
  let y = template === "poster" ? 170 : 150;
  for (const line of lyricLines) {
    ctx.fillText(line, 92, y);
    y += template === "poster" ? 66 : 58;
  }
  ctx.fillStyle = metaColor;
  ctx.font = "700 28px Inter, Segoe UI, sans-serif";
  ctx.fillText(state.currentTrack?.title || "Lyrics", 92, 520);
  ctx.font = "600 22px Inter, Segoe UI, sans-serif";
  ctx.fillText(state.currentTrack?.artist || state.currentTrack?.subtitle || "Auralane", 92, 558);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not render lyrics card.");
  try {
    if (navigator.clipboard?.write && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      showCopySuccess(els.lyricsShareCardButton);
      toast("Lyrics card copied.");
      return;
    }
  } catch {
    // Fall back to download.
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${(state.currentTrack?.title || "lyrics").replace(/[\\/:*?"<>|]+/g, "_")}-lyrics-card.png`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Lyrics card exported.");
}

function updateLyricsToolState() {
  const hasTrack = Boolean(state.currentTrack?.id);
  const hasLyrics = Boolean(state.lyrics?.found && state.lyrics?.lines?.length);
  if (els.lyricsSearchButton) els.lyricsSearchButton.disabled = !hasTrack;
  if (els.lyricsReloadButton) els.lyricsReloadButton.disabled = !hasTrack || state.lyricsReloading;
  if (els.lyricsQuickReloadButton) els.lyricsQuickReloadButton.disabled = !hasTrack || state.lyricsReloading;
  if (els.lyricsSyncButton) els.lyricsSyncButton.disabled = !hasLyrics || !state.lyrics?.synced;
  if (els.lyricsTranslateButton) {
    els.lyricsTranslateButton.disabled = !hasLyrics || state.lyricsTranslationLoading;
    els.lyricsTranslateButton.textContent = state.lyricsTranslationLoading ? "..." : "Translate";
    els.lyricsTranslateButton.classList.toggle("active", Boolean(state.settings.lyricsAutoTranslate));
    els.lyricsTranslateButton.setAttribute("aria-pressed", String(Boolean(state.settings.lyricsAutoTranslate)));
  }
  if (els.lyricsRomanizeButton) {
    els.lyricsRomanizeButton.disabled = !hasLyrics || state.lyricsRomanizationLoading;
    els.lyricsRomanizeButton.textContent = state.lyricsRomanizationLoading ? "..." : "Romanize";
    els.lyricsRomanizeButton.classList.toggle("active", Boolean(state.settings.lyricsAutoRomanize));
    els.lyricsRomanizeButton.setAttribute("aria-pressed", String(Boolean(state.settings.lyricsAutoRomanize)));
  }
  if (els.lyricsDuetButton) {
    const hasMultipleSingers = Boolean(state.lyrics?.lines?.some((line) =>
      ["v1", "1", "v2", "2"].includes(normalizeLyricsAgent(line?.agent))
    ));
    els.lyricsDuetButton.disabled = !hasLyrics || !hasMultipleSingers;
    els.lyricsDuetButton.classList.toggle("active", Boolean(state.settings.lyricsDuetMode));
    els.lyricsDuetButton.setAttribute("aria-pressed", String(Boolean(state.settings.lyricsDuetMode)));
  }
  if (els.lyricsCopyButton) els.lyricsCopyButton.disabled = !hasLyrics;
  if (els.lyricsShareCardButton) els.lyricsShareCardButton.disabled = !hasLyrics;
  if (els.lyricsTimelineButton) {
    els.lyricsTimelineButton.disabled = !hasLyrics;
    els.lyricsTimelineButton.classList.toggle("active", state.lyricsTimelineEditing);
  }
  updateLyricsOffsetControls();
  updateLyricsSyncButtonVisibility();
}

function lyricsCacheKey(track) {
  const id = track?.id || track?.videoId || "";
  const providers = normalizeLyricsProviderOrder().join(",");
  return `${id}:${state.settings.lyricsSource}:${providers}`;
}

function upcomingTracksForLyricsPrefetch(track = state.currentTrack, count = 5) {
  if (!Array.isArray(state.queue) || !state.queue.length) return [];
  const index = state.queue.findIndex((item) => item?.id === track?.id);
  const startIndex = index >= 0 ? index + 1 : 0;
  const upcoming = [];
  const seen = new Set([track?.id]);
  for (let i = startIndex; i < state.queue.length; i += 1) {
    const item = state.queue[i];
    if (item?.id && !seen.has(item.id)) {
      seen.add(item.id);
      upcoming.push(item);
      if (upcoming.length >= count) break;
    }
  }
  return upcoming;
}

async function prefetchSingleTrackLyrics(nextTrack) {
  if (!nextTrack?.id) return;
  const cacheKey = lyricsCacheKey(nextTrack);
  if (state.lyricsPrefetchCandidates.has(cacheKey) || state.lyricsPrefetching.has(cacheKey)) return;
  state.lyricsPrefetching.add(cacheKey);
  try {
    const identity = await resolveLyricsSearchIdentity(nextTrack);
    const lookupTrack = {
      ...nextTrack,
      title: identity.title || nextTrack.title,
      artist: identity.artist || lyricsSearchArtistFromTrack(nextTrack)
    };

    const enabledProviders = enabledLyricsSearchProviders();
    const baseOptions = {
      title: lookupTrack.title,
      artist: lookupTrack.artist,
      limit: 50,
      noTimeout: false
    };
    const searches = enabledProviders.map((provider) => searchDefinitionForProvider(provider, baseOptions));
    const fetchedCandidates = [];
    // Limit each track to three simultaneous providers. Together with the
    // two-track outer queue this keeps prefetch useful without causing 429s.
    for (let index = 0; index < searches.length; index += 3) {
      const settled = await Promise.allSettled(
        searches.slice(index, index + 3).map((search) =>
          window.metro.searchLyrics(lookupTrack, search.options)
        )
      );
      fetchedCandidates.push(...settled.flatMap((result) =>
        result.status === "fulfilled"
          ? (result.value?.candidates || []).map((candidate) => ({
              ...candidate,
              lyricsTargetTitle: lookupTrack.title
            }))
          : []
      ));
    }

    const sortedCandidates = [...dedupeLyricsCandidates(fetchedCandidates)].sort((left, right) =>
      compareLyricsCandidateQuality(left, right, lookupTrack.title)
    );
    if (!sortedCandidates.length) return;

    // Always retain online alternatives, even when this song already has a
    // saved lyric. They are backups only and never replace persisted content.
    state.lyricsPrefetchCandidates.set(cacheKey, sortedCandidates);
    while (state.lyricsPrefetchCandidates.size > 20) {
      state.lyricsPrefetchCandidates.delete(state.lyricsPrefetchCandidates.keys().next().value);
    }

    const hasPersistedLyrics = Boolean(
      savedLyricsCandidateForTrack(lookupTrack) || localLyricsCandidateForTrack(lookupTrack)
    );
    if (!hasPersistedLyrics) {
      state.lyricsPrefetchCache.set(cacheKey, lyricsCandidateToResult(sortedCandidates[0]));
      while (state.lyricsPrefetchCache.size > 20) {
        state.lyricsPrefetchCache.delete(state.lyricsPrefetchCache.keys().next().value);
      }
    }
  } catch {
    // Prefetch is best effort.
  } finally {
    state.lyricsPrefetching.delete(cacheKey);
  }
}

async function prefetchNextLyrics(track = state.currentTrack) {
  const upcoming = upcomingTracksForLyricsPrefetch(track, 5);
  if (!upcoming.length) return;
  // Keep five songs warm with bounded concurrency to avoid provider bursts.
  for (let index = 0; index < upcoming.length; index += 2) {
    await Promise.all(upcoming.slice(index, index + 2).map(prefetchSingleTrackLyrics));
  }
}

function copiedLyricsText() {
  if (!state.lyrics?.found || !state.lyrics?.lines?.length) return "";
  const translated = state.lyricsTranslationVisible ? state.lyricsTranslation?.lines : null;
  return state.lyrics.lines.map((line, index) => {
    const original = String(line.text || "").trim();
    const translation = String(translated?.[index]?.text || translated?.[index] || "").trim();
    return translation && translation !== original ? `${original}\n${translation}` : original;
  }).filter(Boolean).join("\n");
}

async function copyAllLyrics(feedbackButton = els.lyricsCopyButton) {
  const text = copiedLyricsText();
  if (!text) return;
  await window.metro.copyText(text);
  showCopySuccess(feedbackButton);
  toast("All lyrics copied.");
}

async function ensureLyricsTranslation({ notify = false } = {}) {
  const result = state.lyrics;
  if (!result?.found || !result.lines?.length) return false;
  const trackId = String(state.currentTrack?.id || "");
  const fingerprint = lyricsFingerprint(result);
  state.lyricsTranslation = state.lyricsTranslation || cachedTranslationForLyrics(result);
  if (state.lyricsTranslation?.lines?.length) {
    state.lyricsTranslationVisible = true;
    renderLyrics(result);
    return true;
  }
  if (state.lyricsTranslationLoading) return false;
  state.lyricsTranslationLoading = true;
  updateLyricsToolState();
  try {
    const translation = await window.metro.translateLyrics(result.lines, {
      targetLanguage: state.settings.lyricsTranslateTarget || "zh-TW",
      sourceLanguage: "auto"
    });
    if (String(state.currentTrack?.id || "") !== trackId ||
        lyricsFingerprint(state.lyrics) !== fingerprint) return false;
    state.lyricsTranslation = translation;
    saveTranslationForLyrics(result, translation);
    state.lyricsTranslationVisible = true;
    renderLyrics(state.lyrics);
    syncLyricWidget();
    if (notify) toast("Lyrics translated.");
    return true;
  } catch (error) {
    if (notify) toast(error.message || "Lyrics translation failed.", true);
    return false;
  } finally {
    state.lyricsTranslationLoading = false;
    updateLyricsToolState();
  }
}

async function ensureLyricsRomanization({ notify = false } = {}) {
  const result = state.lyrics;
  if (!result?.found || !result.lines?.length) return false;
  const trackId = String(state.currentTrack?.id || "");
  const fingerprint = lyricsFingerprint(result);
  state.lyricsRomanization = state.lyricsRomanization || cachedRomanizationForLyrics(result);
  if (state.lyricsRomanization?.lines?.length) {
    state.lyricsRomanizationVisible = true;
    renderLyrics(result);
    return true;
  }
  if (state.lyricsRomanizationLoading) return false;
  state.lyricsRomanizationLoading = true;
  updateLyricsToolState();
  try {
    const romanization = await window.metro.romanizeLyrics(result.lines);
    if (String(state.currentTrack?.id || "") !== trackId ||
        lyricsFingerprint(state.lyrics) !== fingerprint) return false;
    state.lyricsRomanization = romanization;
    saveRomanizationForLyrics(result, romanization);
    state.lyricsRomanizationVisible = true;
    renderLyrics(state.lyrics);
    if (notify) toast("Romanized lyrics ready.");
    return true;
  } catch (error) {
    if (notify) toast(error.message || "Lyrics romanization failed.", true);
    return false;
  } finally {
    state.lyricsRomanizationLoading = false;
    updateLyricsToolState();
  }
}

function renderLyrics(result) {
  state.lyrics = result;
  state.activeLyricIndex = -1;
  state.lyricsPlaybackSignature = "";
  state.focusLyricsPlaybackSignature = "";
  state.lyricsShareSelection = new Set();
  state.lyricsLineElements = [];
  state.lyricsActiveDomIndexes = new Set();
  state.lyricsLastPresentationIndex = -1;
  rebuildLyricsPlaybackIndex(result?.lines || []);
  renderLyricsTimelineEditor();
  if (result?.found) {
    state.lyricsTranslation = state.lyricsTranslation || cachedTranslationForLyrics(result);
    state.lyricsRomanization = state.lyricsRomanization || cachedRomanizationForLyrics(result);
  }
  els.lyricsTitle.textContent = result?.found ? `${result.title}` : "Lyrics";
  updateLyricsToolState();
  renderLyricsVersionSwitcher();

  if (!result) {
    els.lyricsStatus.textContent = "Choose a song.";
    els.lyricsList.innerHTML = "";
    updateLyricsToolState();
    return;
  }

  if (!result.found || !result.lines?.length) {
    if (result.error) {
      const debugSummary = result.debugTrack
        ? `title="${result.debugTrack.title || ""}", artist="${result.debugTrack.artist || ""}", subtitle="${result.debugTrack.subtitle || ""}"`
        : "";
      els.lyricsStatus.textContent = `Lyrics lookup failed (${lyricsSourceLabel(result.providerKey)}).`;
      els.lyricsList.innerHTML = `<p class="status">${escapeText(result.error)}${debugSummary ? `<br><small>${escapeText(debugSummary)}</small>` : ""}</p>`;
      els.focusLyricsList.innerHTML = `<p class="status">${escapeText(result.error)}</p>`;
      updateLyricsToolState();
      return;
    }
    const attempted = Array.isArray(result.attemptedProviders) && result.attemptedProviders.length
      ? result.attemptedProviders.join(", ")
      : lyricsSourceLabel(result.providerKey);
    els.lyricsStatus.textContent = `No lyrics found from ${attempted}.`;
    els.lyricsList.innerHTML = `<p class="status">No lyrics found for this track.</p>`;
    els.focusLyricsList.innerHTML = `<p class="status">No lyrics found for this track.</p>`;
    updateLyricsToolState();
    return;
  }

  const translationLabel = state.lyricsTranslationVisible && state.lyricsTranslation?.targetLanguage
    ? ` + ${state.lyricsTranslation.targetLanguage}`
    : "";
  const offsetLabel = state.lyricsOffsetMs ? ` offset ${formatLyricsOffset()}` : "";
  els.lyricsStatus.textContent = `${result.provider}${result.synced ? " synced" : " plain"} lyrics${translationLabel}${offsetLabel}`;
  els.lyricsList.innerHTML = result.lines.map((line, index) => lyricLineHtml(line, index)).join("");
  state.lyricsLineElements = [...els.lyricsList.querySelectorAll(".lyric-line")];
  for (const element of state.lyricsLineElements) {
    element.style.setProperty("--line-opacity", ".08");
  }
  scheduleLyricTokenWrapMeasurement();
  updateLyricsActive();
  if (els.focusMode && !els.focusMode.classList.contains("hidden")) {
    renderFocusLyrics(result);
  } else {
    state.focusLyricsLineElements = [];
    state.focusLyricsActiveDomIndexes = new Set();
    els.focusLyricsList.innerHTML = "";
  }
  updateLyricsToolState();
  if (state.settings.lyricsAutoTranslate &&
      !state.lyricsTranslationVisible &&
      !state.lyricsTranslationLoading) {
    queueMicrotask(() => ensureLyricsTranslation({ notify: false }));
  }
  if (state.settings.lyricsAutoRomanize &&
      !state.lyricsRomanizationVisible &&
      !state.lyricsRomanizationLoading) {
    queueMicrotask(() => ensureLyricsRomanization({ notify: false }));
  }
}

async function restoreLegacyLyricsSelection(track) {
  const memory = selectedLyricsMemoryForTrack(track);
  if (!memory?.sourceId || memory.rawLyrics || String(memory.providerKey || "").toLowerCase() !== "netease") {
    return null;
  }
  const response = await window.metro.searchLyrics(track, {
    title: memory.title || track.title || "",
    artist: memory.artist || lyricsSearchArtistFromTrack(track),
    providers: ["netease"],
    sourceId: memory.sourceId,
    includeYouTube: false,
    limit: 1
  });
  const candidate = (response?.candidates || []).find((item) =>
    lyricsSourceIdsEqual(memory.sourceId, item.sourceId, "netease")
  );
  if (!candidate) return null;
  return persistAutomaticLyricsSelection(track, {
    ...candidate,
    savedSelection: true,
    lyricsTargetTitle: memory.title || track.title || ""
  });
}

async function loadLyricsForTrack(track, options = {}) {
  if (!track?.id) return;
  const forceReload = Boolean(options.forceReload);
  let savedCandidate = forceReload ? null : savedLyricsCandidateForTrack(track);
  let localCandidate = forceReload ? null : localLyricsCandidateForTrack(track);
  const stalePersistedCandidate = savedCandidate || localCandidate;
  if (stalePersistedCandidate && !cachedLyricsMatchTrackIdentity(stalePersistedCandidate, track)) {
    await clearLyricsSelectionForTrack(track);
    savedCandidate = null;
    localCandidate = null;
  }
  // localStorage can be unavailable briefly while the account scope is being
  // restored, and older builds did not always finish writing it before a track
  // changed. The durable main-process cache is therefore a real saved-lyrics
  // fallback, not merely a network-search optimisation.
  let durableCandidate = null;
  if (!forceReload && !savedCandidate && !localCandidate) {
    try {
      const cached = await window.metro.cachedLyrics(track.id || track.videoId);
      if (cached?.result?.found && cached.result.lines?.length) {
        if (cachedLyricsMatchTrackIdentity(cached.result, track)) {
          const rawLyrics = String(cached.result.rawLyrics || lyricsResultToEditableText(cached.result) || "").trim();
          if (rawLyrics) {
            durableCandidate = { ...cached.result, rawLyrics, cached: true };
            // Repair the account-scoped copies immediately so following plays
            // no longer need even the disk-cache IPC round trip.
            saveLocalLyricsForTrack(track, rawLyrics, {
              title: durableCandidate.title || track.title,
              artist: durableCandidate.artist || lyricsSearchArtistFromTrack(track),
              provider: durableCandidate.provider || "Lyrics",
              providerKey: durableCandidate.providerKey || "",
              sourceId: durableCandidate.sourceId || "",
              sourceTitle: durableCandidate.sourceTitle || durableCandidate.title || "",
              sourceArtist: durableCandidate.sourceArtist || durableCandidate.artist || ""
            });
            saveLyricsMemoryForTrack(track, durableCandidate, rawLyrics);
            assertLyricsSelectionPersisted(track, rawLyrics);
          }
        } else {
          await window.metro.clearCachedLyrics?.(track.id || track.videoId);
        }
      }
    } catch (error) {
      if (state.settings.debugLogs) console.warn("Durable lyrics restore failed", error);
    }
  }
  const persistedCandidate = savedCandidate || localCandidate || durableCandidate;
  const hasSavedSelection = Boolean(persistedCandidate);
  const prefetchKey = lyricsCacheKey(track);
  const prefetchedCandidate = !forceReload && !persistedCandidate
    ? state.lyricsPrefetchCache.get(prefetchKey)
    : null;
  const immediateSavedResult = persistedCandidate
    ? lyricsCandidateToResult(persistedCandidate, persistedCandidate.rawLyrics)
    : null;
  const immediatePrefetchedResult = prefetchedCandidate?.found && prefetchedCandidate?.lines?.length
    ? lyricsCandidateToResult(prefetchedCandidate, prefetchedCandidate.rawLyrics)
    : null;
  cacheLyricsSearchState(state.lyricsSearchTrackId);
  state.lyricsSearchRequest += 1;
  state.lyricsSearchTrackId = String(track.id);
  const restoredSearch = !forceReload && restoreLyricsSearchState(track.id);
  if (!restoredSearch) {
    state.lyricsSearchCandidates = [];
    state.lyricsSearchErrors = [];
    state.lyricsSearchPendingProviders = [];
    state.lyricsSearchAttemptedProviders = [];
    state.lyricsSearchProviderStates = {};
    state.lyricsSelectedCandidateIndex = -1;
    state.lyricsSearchLoading = false;
  }
  state.lyrics = null;
  // A previously saved source is an explicit choice. Mark it as selected
  // before background providers begin returning, so a fast result cannot
  // overwrite it while the saved version is being restored.
  state.lyricsUserSelected = hasSavedSelection || Boolean(immediatePrefetchedResult);
  state.lyricsOffsetMs = readLyricsOffsetMs(track);
  state.lyricsTranslation = null;
  state.lyricsTranslationVisible = false;
  state.lyricsTranslationLoading = false;
  state.lyricsRomanization = null;
  state.lyricsRomanizationVisible = false;
  state.lyricsRomanizationLoading = false;
  state.karaokeDuetMode = Boolean(state.settings.lyricsDuetMode);
  state.lyricsWaveformPeaks = new Float32Array(240);
  document.body.classList.toggle("karaoke-duet-mode", state.karaokeDuetMode);
  state.lyricsAutoSync = true;
  resetLyricsSearchInputs(track);
  els.lyricsTitle.textContent = track.title || "Lyrics";
  const immediateResult = immediateSavedResult || immediatePrefetchedResult;
  if (immediateResult) {
    state.lyricsTranslation = cachedTranslationForLyrics(immediateResult);
    state.lyricsRomanization = cachedRomanizationForLyrics(immediateResult);
    renderLyrics(immediateResult);
  } else {
    const restoringLegacySelection = Boolean(!forceReload && selectedLyricsMemoryForTrack(track)?.sourceId);
    const waitingText = restoringLegacySelection ? "Restoring saved lyrics..." : "Searching lyrics...";
    els.lyricsStatus.textContent = restoringLegacySelection ? waitingText : lyricsSearchingText();
    els.lyricsList.innerHTML = `<p class="status">${waitingText}</p>`;
    els.focusLyricsList.innerHTML = `<p class="status">${waitingText}</p>`;
    updateLyricsToolState();
  }
  renderLyricsCandidateList();
  // Main playback has one authoritative path:
  //   saved choice -> render immediately, search only in the background;
  //   no saved choice -> wait for the complete ordered search and commit #1.
  // Do not run loadPreferredLyricsForTrack in parallel here: its faster single
  // provider result used to race the complete search and visually overwrite it.
  let restoredLegacyResult = null;
  let consumedPrefetchResult = null;
  if (!forceReload && immediatePrefetchedResult && prefetchedCandidate) {
    try {
      consumedPrefetchResult = await persistAutomaticLyricsSelection(track, prefetchedCandidate);
      if (state.currentTrack?.id !== track.id) return;
      state.lyricsPrefetchCache.delete(prefetchKey);
      renderLyrics(consumedPrefetchResult?.result || immediatePrefetchedResult);
    } catch (error) {
      state.lyricsUserSelected = false;
      if (state.settings.debugLogs) console.warn("Prefetched lyrics persistence failed", error);
    }
  }
  if (!forceReload && !immediateSavedResult && !immediatePrefetchedResult) {
    try {
      restoredLegacyResult = await restoreLegacyLyricsSelection(track);
      if (state.currentTrack?.id !== track.id) return;
      if (restoredLegacyResult?.result) {
        state.lyricsUserSelected = true;
        renderLyrics(restoredLegacyResult.result);
      }
    } catch (error) {
      if (state.settings.debugLogs) console.warn("Saved lyrics source restore failed", error);
    }
  }

  const searchPromise = searchLyricsCandidatesForCurrent({
    background: true,
    force: true
  });
  if (immediateSavedResult || consumedPrefetchResult?.result || restoredLegacyResult?.result) {
    void searchPromise.catch(() => {});
    void prefetchNextLyrics(track);
    return;
  }
  try {
    await searchPromise;
    if (state.currentTrack?.id !== track.id) return;
    // searchLyricsCandidatesForCurrent commits the first ordered result when
    // no saved choice exists. During Reload the caller performs that commit
    // after the old selection has been fully cleared.
    if (!state.lyrics?.found && !state.lyricsSearchCandidates.length) {
      renderLyrics({
        found: false,
        provider: "Lyrics",
        providerKey: "",
        title: track.title || "Lyrics",
        artist: lyricsSearchArtistFromTrack(track),
        synced: false,
        lines: []
      });
    }
    void prefetchNextLyrics(track);
  } catch (error) {
    if (state.currentTrack?.id !== track.id) return;
    els.lyricsStatus.textContent = "Lyrics failed.";
    els.lyricsList.innerHTML = `<p class="status">${escapeText(error.message || "Lyrics failed.")}</p>`;
    els.focusLyricsList.innerHTML = `<p class="status">${escapeText(error.message || "Lyrics failed.")}</p>`;
    updateLyricsToolState();
  }
}

async function gameSearchLibraryTracks(query) {
  const normalize = (value) => String(value || "").normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
  const needle = normalize(query);
  await refreshOfflineCache({ silent: true }).catch(() => {});
  if (!(state.localMusicData?.tracks || []).length) {
    try { state.localMusicData = await window.metro.localMusic(); } catch {}
  }
  const values = [
    ...(state.localMusicData?.tracks || []).map((track) => ({ ...track, local: true, gameSource: "Local library" })),
    ...(state.offlineCache?.tracks || []).map((track) => ({ ...track, offlineCached: true, cached: true, gameSource: "Downloaded" })),
    ...likedRawTracks().map((track) => ({ ...track, gameSource: "Liked Songs" }))
  ];
  return uniqueTracks(values).filter((track) =>
    normalize(`${track.title || ""} ${allArtistLabel(track, track.subtitle || "")}`).includes(needle)
  );
}

function cachedLyricsMatchTrackIdentity(result, track = state.currentTrack) {
  if (!result?.found || !track) return false;
  const queueIdentityTrack = state.queue.find((item) =>
    String(item?.id || item?.videoId || "") === String(track?.id || track?.videoId || "")
  );
  const expectedTitles = [
    track.title,
    selectedLyricsMemoryForTrack(track)?.title,
    String(track.title || "").match(/^.+?\s+[-–—]\s+(.+)$/)?.[1]
  ].filter(Boolean);
  const resultTitle = result.title || "";
  const titleMatches = Boolean(resultTitle && expectedTitles.some((title) => lyricsIdentityTitleScore(title, resultTitle) >= 4));
  if (!titleMatches) return false;
  const expectedArtists = [
    track.artist,
    lyricsSearchArtistFromTrack(track),
    ...(track.artists || []).map((artist) => artist?.title || artist?.name || ""),
    queueIdentityTrack?.artist,
    ...(queueIdentityTrack?.artists || []).map((artist) => artist?.title || artist?.name || "")
  ].map(normalizeArtistKey).filter(Boolean);
  const resultArtist = normalizeArtistKey(result.artist || result.sourceArtist || "");
  if (!resultArtist || !expectedArtists.length) return true;
  return expectedArtists.some((artist) =>
    artist === resultArtist || artist.includes(resultArtist) || resultArtist.includes(artist)
  );
}

async function loadPreferredLyricsForTrack(track, options = {}) {
  const source = String(options.source || state.settings.lyricsSource || "auto");
  const configuredProviders = Array.isArray(options.providers) && options.providers.length
    ? options.providers
    : normalizeLyricsProviderOrder().filter((provider) => provider !== "youtube-transcript");
  const rememberedProvider = !options.forceReload && source === "auto"
    ? String(selectedLyricsMemoryForTrack(track)?.providerKey || "").toLowerCase()
    : "";
  // The provider chosen for this song is queried first. If it cannot return a
  // usable result, the normal order (with NetEase first) remains the fallback.
  const providers = rememberedProvider && configuredProviders.includes(rememberedProvider)
    ? [rememberedProvider, ...configuredProviders.filter((provider) => provider !== rememberedProvider)]
    : configuredProviders;
  const savedCandidate = options.forceReload ? null : savedLyricsCandidateForTrack(track);
  if (savedCandidate) {
    // This is an explicit saved version, not a cache hint. Never fetch a new
    // result over it; Reload is the one deliberate action that replaces it.
    return lyricsCandidateToResult(savedCandidate, savedCandidate.rawLyrics);
  }
  const localResult = options.forceReload ? null : localLyricsResultForTrack(track);
  if (localResult && (source === "local" || source === "auto")) {
    hydrateSavedLyricsPayload(track, localResult);
    return localResult;
  }
  if (source === "local") {
    return {
      found: false,
      provider: "Local LRC",
      providerKey: "local",
      attemptedProviders: ["Local LRC"],
      title: track.title || "Lyrics",
      artist: track.artist || "",
      synced: false,
      lines: []
    };
  }

  if (source === "auto" && !options.forceReload) {
    try {
      const cached = await window.metro.cachedLyrics(track.id || track.videoId);
      if (cached?.result?.found && cached.result.lines?.length) {
        if (cachedLyricsMatchTrackIdentity(cached.result, track)) {
          hydrateSavedLyricsPayload(track, cached.result);
          return { ...cached.result, cached: true };
        }
        // Older automatic selection bugs could write another song under this
        // playback id. Reject and remove that poisoned cache entry.
        await window.metro.clearCachedLyrics?.(track.id || track.videoId);
      }
    } catch {
      // Continue with the online providers when no durable cache is available.
    }
  }

  const identity = await (options.identityPromise || resolveLyricsSearchIdentity(track));
  const lyricsLookupTrack = {
    ...track,
    title: identity.title || track.title,
    artist: identity.artist || lyricsSearchArtistFromTrack(track)
  };
  const cacheKey = lyricsCacheKey(track);
  const cached = !options.forceReload && source === state.settings.lyricsSource ? state.lyricsPrefetchCache.get(cacheKey) : null;
  const result = cached || await window.metro.lyrics(lyricsLookupTrack, {
    provider: source,
    providers
  });
  if (!options.suppressAutoSave && result?.found && result.lines?.length && (!selectedLyricsMemoryForTrack(track) || options.forceReload)) {
    saveLyricsMemoryForTrack(track, result, result.rawLyrics || lyricsResultToEditableText(result));
  }
  void cacheHighQualityLyrics(track, result);
  if (options.consumePrefetch) state.lyricsPrefetchCache.delete(cacheKey);
  return result;
}

function updateLyricsActive() {
  const result = state.lyrics;
  if (!result?.synced || !usesAudioTimeline()) return;
  const lines = result.lines || [];
  if (!lines.length) return;

  const now = lyricsTimelineNow();
  const playback = lyricPlaybackState(lines, now);
  const activeIndex = playback.targetIndex;
  const changed = activeIndex !== state.activeLyricIndex;
  const playbackSignature = `${[...playback.active].join(",")}|${[...playback.visibleBackground].join(",")}`;
  const presentationChanged = changed || playbackSignature !== state.lyricsPlaybackSignature;
  state.lyricsPlaybackSignature = playbackSignature;
  state.activeLyricIndex = activeIndex;
  if (changed) {
    syncLyricWidget();
    if (state.lyricsTimelineEditing) renderLyricsTimelineEditor();
  }

  if (presentationChanged) {
    const previouslyActive = state.lyricsActiveDomIndexes || new Set();
    const currentlyActive = new Set([...playback.active, ...playback.visibleBackground]);
    const touchedIndexes = new Set([...previouslyActive, ...currentlyActive]);
    for (const center of [state.lyricsLastPresentationIndex, activeIndex]) {
      if (center < 0) continue;
      for (let index = Math.max(0, center - 6); index <= Math.min(lines.length - 1, center + 6); index += 1) {
        touchedIndexes.add(index);
      }
    }
    for (const lineIndex of touchedIndexes) {
      const element = state.lyricsLineElements?.[lineIndex];
      if (!element) continue;
      const backgroundActive = playback.visibleBackground.has(lineIndex);
      const active = playback.active.has(lineIndex);
      element.classList.toggle("active", active);
      element.classList.toggle("background-active", backgroundActive);
      element.style.setProperty("--line-opacity", String(active
        ? 1
        : Math.max(0.08, 0.3 - Math.abs(lineIndex - activeIndex) * 0.055)));
      if (active || backgroundActive) updateWordHighlights(element, now);
      else if (previouslyActive.has(lineIndex)) resetLyricWordHighlights(element);
      if (lineIndex === activeIndex && state.lyricsAutoSync && changed &&
          els.moreMenu?.classList.contains("hidden")) {
        scrollLyricIntoView(element);
      }
    }
    state.lyricsActiveDomIndexes = currentlyActive;
    state.lyricsLastPresentationIndex = activeIndex;
    return;
  }
  for (const lineIndex of new Set([...playback.active, ...playback.visibleBackground])) {
    const element = state.lyricsLineElements?.[lineIndex];
    if (element) updateWordHighlights(element, now);
  }
}

function animateLyricScroll(container, target, animationKey, duration = 750) {
  if (!container) return;
  if (state[animationKey]) cancelAnimationFrame(state[animationKey]);
  state[animationKey] = 0;
  container.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
}

// Cache container height so padding is only recomputed on resize, not on every scroll.
const _lyricsGeometryCache = new WeakMap();
function prepareLyricsScrollGeometry(container) {
  if (!container || !els.lyricsList) return;
  const h = container.clientHeight;
  if (_lyricsGeometryCache.get(container) === h) return; // unchanged — skip
  _lyricsGeometryCache.set(container, h);
  const anchorRatio = 0.46;
  const topSpace = Math.max(48, h * anchorRatio);
  const bottomSpace = Math.max(80, h * (1 - anchorRatio));
  els.lyricsList.style.paddingTop = `${Math.round(topSpace)}px`;
  els.lyricsList.style.paddingBottom = `${Math.round(bottomSpace)}px`;
}

function scrollLyricIntoView(element, options = {}) {
  if (!element || els.lyricsPane?.classList.contains("hidden") || state.activeSidePanel !== "lyrics") return;
  const container = element.closest(".queue-panel") || element.closest("#lyricsPane");
  if (!container) return;
  prepareLyricsScrollGeometry(container);
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const target = container.scrollTop + elementRect.top - containerRect.top -
    container.clientHeight * 0.46 + elementRect.height / 2;
  state.lyricsProgrammaticScroll = true;
  window.clearTimeout(state.lyricsProgrammaticTimer);
  if (options.instant) {
    if (state.lyricsScrollAnimationFrame) cancelAnimationFrame(state.lyricsScrollAnimationFrame);
    state.lyricsScrollAnimationFrame = 0;
    container.scrollTop = Math.max(0, target);
    state.lyricsProgrammaticScroll = false;
    return;
  }
  animateLyricScroll(container, target, "lyricsScrollAnimationFrame");
  state.lyricsProgrammaticTimer = window.setTimeout(() => {
    state.lyricsProgrammaticScroll = false;
  }, 780);
}

function activeLyricElement() {
  if (state.activeLyricIndex < 0) return null;
  return state.lyricsLineElements?.[state.activeLyricIndex] || null;
}

function setLyricsAutoSync(enabled) {
  state.lyricsAutoSync = Boolean(enabled);
  if (!state.lyricsAutoSync) {
    if (state.lyricsScrollAnimationFrame) cancelAnimationFrame(state.lyricsScrollAnimationFrame);
    state.lyricsScrollAnimationFrame = 0;
    window.clearTimeout(state.lyricsProgrammaticTimer);
    state.lyricsProgrammaticScroll = false;
  }
  updateLyricsToolState();
  updateLyricsSyncButtonVisibility();
}

function forceLyricsSyncToPlayback() {
  if (!state.lyrics?.found || !state.lyrics?.synced || !usesAudioTimeline()) return;
  setLyricsAutoSync(true);
  updateLyricsActive();
  // Source menus, fullscreen geometry and word wrapping can all replace the
  // active node during the current frame. Re-anchor after layout settles and
  // do it instantly so the button cannot leave the list at an old position.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    updateLyricsActive();
    scrollLyricIntoView(activeLyricElement(), { instant: true });
  }));
}

function restoreLyricsSyncAfterSourceChange(shouldSync = state.lyricsAutoSync) {
  // Source changes replace the lyric DOM and reset the active-line cache. Keep
  // a listener's chosen sync mode intact, then re-anchor only after the new DOM
  // and fullscreen geometry have settled.
  if (!shouldSync) return;
  setLyricsAutoSync(true);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    updateLyricsActive();
    scrollLyricIntoView(activeLyricElement(), { instant: true });
  }));
}

function stopLyricsAnimationLoop() {
  if (state.lyricsAnimationFrame) cancelAnimationFrame(state.lyricsAnimationFrame);
  state.lyricsAnimationFrame = 0;
}

function startLyricsAnimationLoop() {
  stopLyricsAnimationLoop();
  state.lyricsAnimationLastFrame = 0;
  const tick = (timestamp) => {
    if (!state.playing || !usesAudioTimeline()) {
      state.lyricsAnimationFrame = 0;
      return;
    }
    const focusVisible = Boolean(els.focusMode && !els.focusMode.classList.contains("hidden"));
    const frameInterval = 32;
    if (timestamp - state.lyricsAnimationLastFrame >= frameInterval) {
      state.lyricsAnimationLastFrame = timestamp;
      // Keep the lyric timeline alive even while the Session lyrics panel is
      // hidden. The floating lyric widget and the next panel reveal both rely
      // on activeLyricIndex staying current; scrollLyricIntoView itself still
      // guards hidden panels, so this does not cause off-screen layout work.
      if (state.lyrics?.synced) updateLyricsActive();
      if (focusVisible) updateFocusLyricsActive();
    }
    state.lyricsAnimationFrame = requestAnimationFrame(tick);
  };
  state.lyricsAnimationFrame = requestAnimationFrame(tick);
}

function updateProgress() {
  if (state.playbackMode === "embed") {
    els.currentTime.textContent = "0:00";
    els.durationTime.textContent = "Web";
    els.seekBar.value = 0;
    return;
  }

  const hasAudioSource = Boolean(els.audio.currentSrc || els.audio.getAttribute("src"));
  const current = hasAudioSource ? (els.audio.currentTime || 0) : (Number(state.restoredPlaybackTime || 0) || 0);
  const duration = Number.isFinite(els.audio.duration) ? els.audio.duration : Number(state.currentTrack?.lengthSeconds || 0);
  els.currentTime.textContent = formatClock(current);
  els.durationTime.textContent = duration ? formatClock(duration) : "0:00";
  if (!state.seeking) {
    els.seekBar.value = duration ? Math.round((current / duration) * 1000) : 0;
  }

  // 更新進度條顏色
  const percent = duration ? (current / duration) * 100 : 0;
  els.seekBar.style.background = `linear-gradient(to right, var(--accent-2) ${percent}%, rgba(255, 255, 255, 0.12) ${percent}%)`;

  if (!state.playing || !state.lyricsAnimationFrame) updateLyricsActive();
  maybeTriggerCrossfade(current, duration).catch(() => {});
  if ((!state.playing || !state.lyricsAnimationFrame) && els.focusMode && !els.focusMode.classList.contains("hidden")) {
    updateFocusLyricsActive();
  }
  syncMiniPlayerSoon();
  schedulePlaybackSessionSave();
}

async function maybeTriggerCrossfade(current, duration) {
  const seconds = Number(state.settings.crossfadeSeconds || 0);
  if (!seconds || !duration || state.playbackMode === "embed" || !state.currentTrack?.id || state.seeking) return;
  if (duration - current > seconds) return;
  if (state.crossfadeTriggeredId === state.currentTrack.id) return;
  const nextIndex = nextQueueIndex({ manual: false });
  if (nextIndex < 0) return;
  state.crossfadeTriggeredId = state.currentTrack.id;
  await playQueueIndex(nextIndex);
}

// ── NEW: Dynamic Color Extraction ──
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

let themeColorRequestId = 0;

function tunedArtworkThemeColor(rgb) {
  const [red, green, blue] = normalizeRgb(rgb);
  let [hue, saturation, lightness] = rgbToHsl(red, green, blue);
  saturation = Math.max(0.4, Math.min(0.85, saturation * 1.5));
  lightness = Math.max(0.45, Math.min(0.65, lightness));
  return hslToRgb(hue, saturation, lightness);
}

async function extractImageColor(itemOrUrl) {
  const requestId = ++themeColorRequestId;
  if (state.settings.themeMode && state.settings.themeMode !== "auto") {
    applyThemeColor(THEME_PRESETS[state.settings.themeMode]?.rgb || DEFAULT_THEME_RGB);
    return;
  }
  const urls = thumbnailUrls(itemOrUrl, state.currentTrack?.id || "", 544);
  if (!urls.length) {
    applyThemeColor(DEFAULT_THEME_RGB);
    return;
  }

  try {
    const extracted = await window.metro?.extractArtworkColor?.(urls);
    if (requestId !== themeColorRequestId || state.settings.themeMode !== "auto") return;
    if (Array.isArray(extracted) && extracted.length >= 3) {
      applyThemeColor(tunedArtworkThemeColor(extracted));
      return;
    }
  } catch (error) {
    if (state.settings.debugLogs) console.warn("Native artwork color extraction failed:", error);
  }

  if (requestId !== themeColorRequestId || state.settings.themeMode !== "auto") return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    if (requestId !== themeColorRequestId || state.settings.themeMode !== "auto") return;
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = 32;
      canvas.height = 32;
      ctx.drawImage(img, 0, 0, 32, 32);
      const data = ctx.getImageData(0, 0, 32, 32).data;

      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 16) {
        // Skip overly dark or bright pixels
        const luma = 0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2];
        if (luma > 20 && luma < 235) {
          r += data[i];
          g += data[i+1];
          b += data[i+2];
          count++;
        }
      }

      if (count > 0) {
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
      } else {
        r = 255; g = 61; b = 61;
      }

      applyThemeColor(tunedArtworkThemeColor([r, g, b]));
    } catch (e) {
      if (state.settings.debugLogs) console.error("Color extraction failed:", e);
    }
  };
  img.onerror = () => {
    if (requestId === themeColorRequestId && state.settings.themeMode === "auto") applyThemeColor(DEFAULT_THEME_RGB);
  };
  img.src = urls[0];
}

let lastRenderedThumbnail = null;
function updateTrackPlaybackIndicators() {
  const currentId = String(state.currentTrack?.id || "");
  for (const host of document.querySelectorAll("[data-track-id]")) {
    const isCurrent = Boolean(currentId && host.dataset.trackId === currentId);
    const isPlaying = Boolean(isCurrent && state.playing);
    host.classList.toggle("active", isCurrent);
    const playbackLabel = isPlaying ? "Pause" : "Play";
    if (host.matches("button")) host.setAttribute("aria-label", playbackLabel);
    for (const button of host.querySelectorAll("[data-track-play], [data-liked-play], [data-history-play], [data-podcast-play], [data-playlist-play], [data-queue-play]")) {
      button.setAttribute("aria-label", playbackLabel);
      button.title = playbackLabel;
    }
    for (const indicator of host.querySelectorAll("[data-playback-indicator]")) {
      const symbol = indicator.querySelector("span") || indicator;
      symbol.innerHTML = standardIconSvg(isPlaying ? "pause" : "play");
      if (indicator.matches("button")) {
        indicator.setAttribute("aria-label", playbackLabel);
        indicator.title = playbackLabel;
      }
    }
  }
}

function renderNow() {
  const track = state.currentTrack;
  const resolvedThumbnail = thumbnailUrls(track)[0] || "";
  document.body.classList.toggle("player-empty", !track?.id);
  document.body.classList.toggle("is-playing", Boolean(state.playing));
  els.nowTitle.textContent = track?.title || interfaceText("player.nothing");
  renderQualityBadge();
  if (els.lyricsFullscreenCoverArt) {
    els.lyricsFullscreenCoverArt.style.setProperty("--lyrics-cover-art", thumbnailBackground(track, "", 1080) || "none");
  }

  // 更新放大後的歌名與藝人資訊
  if (state.lyricsExpanded) {
    const metaInfo = document.querySelector("#lyrics-expanded-meta");
    if (metaInfo) {
      metaInfo.innerHTML = `
        <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 4px;">${track?.title || "Unknown"}</div>
        <div style="font-size: 0.9rem; opacity: 0.8;">${track?.artist || (track?.artists?.[0]?.name) || "Unknown"}</div>
      `;
    }
  }

  const linkedArtists = [];
  for (const artist of track?.artists || []) {
    const title = String(artist?.title || artist?.name || "").trim();
    if (!title || linkedArtists.some((entry) => normalizeArtistKey(entry.title) === normalizeArtistKey(title))) continue;
    linkedArtists.push({ ...artist, title, type: "artist" });
  }
  if (!linkedArtists.length) {
    const fallbackArtist = playableArtistFromTrack(track);
    if (fallbackArtist?.title) linkedArtists.push(fallbackArtist);
  }
  els.nowSubtitle._artists = linkedArtists;
  els.nowSubtitle.innerHTML = linkedArtists.length
    ? linkedArtists.map((artist, index) => `
        ${index ? `<span class="now-artist-separator" aria-hidden="true">,</span>` : ""}
        <button class="now-artist-link" data-now-artist="${index}" type="button">${escapeText(artist.title)}</button>
      `).join("")
    : `<span>${escapeText(track?.subtitle || interfaceText("player.choose"))}</span>`;

  if (lastRenderedThumbnail !== resolvedThumbnail) {
    lastRenderedThumbnail = resolvedThumbnail;
    els.nowArt.style.backgroundImage = thumbnailBackground(track);
    extractImageColor(track || resolvedThumbnail);
  }
  updateExpandedLyricsBackdrop();

  const label = state.playing
    ? interfaceText(state.playbackMode === "embed" ? "player.stop" : "player.pause")
    : interfaceText("player.play");
  els.playButton.innerHTML = standardIconSvg(state.playing ? (state.playbackMode === "embed" ? "close" : "pause") : "play");
  els.playButton.setAttribute("aria-label", label);
  renderCurrentTrackActions();
  updateTrackPlaybackIndicators();
  renderPlaybackOptions();
  renderQueue();
  updateProgress();
  updateMediaSession();
  syncLyricWidget();
  syncMiniPlayerSoon();
  if (els.focusMode && !els.focusMode.classList.contains("hidden")) {
    syncFocusModeTrack();
  }
}

function setupMediaSession() {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.setActionHandler("play", () => els.playButton.click());
    navigator.mediaSession.setActionHandler("pause", () => els.playButton.click());
    navigator.mediaSession.setActionHandler("previoustrack", () => els.prevButton.click());
    navigator.mediaSession.setActionHandler("nexttrack", () => els.nextButton.click());
  } catch {
    // Some Chromium shells expose mediaSession without every action.
  }
}

function updateMediaSession() {
  if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
  if (!state.currentTrack) {
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = "none";
    return;
  }
  const track = state.currentTrack;
  const artworkUrl = thumbnailUrls(track)[0] || "";
  const artwork = artworkUrl ? [{ src: artworkUrl, sizes: "512x512", type: "image/jpeg" }] : [];
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title || "Auralane",
    artist: allArtistLabel(track, track.subtitle || ""),
    album: track.album?.title || "",
    artwork
  });
  navigator.mediaSession.playbackState = state.playing ? "playing" : "paused";
}

async function maybeNotifyTrack(track) {
  if (!state.settings.notifications || !track?.title || !("Notification" in window)) return;
  if (Notification.permission === "default") {
    try { await Notification.requestPermission(); } catch {}
  }
  if (Notification.permission !== "granted") return;
  try {
    new Notification(track.title, {
      body: track.artist || track.subtitle || "Auralane",
      icon: thumbnailUrls(track)[0] || undefined,
      silent: true
    });
  } catch {
    // Notifications are best effort.
  }
}

function stopEmbedPlayer() {
  els.embedPlayer.src = "about:blank";
  els.embedShell.classList.add("hidden");
  setPlaybackModeLabel("Ready");
}

function startEmbedPlayback(track, reason) {
  if (blockPlaybackForGame()) return;
  const displayReason = playbackFailureMessage(reason || "Direct audio failed.");
  if (!webFallbackAllowed()) {
    stopEmbedPlayer();
    if (track) recoverPlaybackFailure(track, displayReason);
    return;
  }
  state.playbackMode = "embed";
  state.playing = true;
  els.audio.pause();
  els.audio.removeAttribute("src");
  els.audio.load();
  els.embedShell.classList.remove("hidden");
  els.embedPlayer.src = `https://music.youtube.com/watch?v=${encodeURIComponent(track.id)}`;
  renderNow();
  setPlaybackModeLabel("Web playback");
  toast(displayReason || "Using YouTube Music web playback.");
  maybeNotifyTrack(track);
  loadLyricsForTrack(track);
}

async function persistQueue() {
  await window.metro.setQueue(state.queue);
  schedulePlaybackSessionSave({ force: true });
}

function currentPlaybackSeconds() {
  const audioTime = Number(els.audio?.currentTime || 0);
  if (Number.isFinite(audioTime) && audioTime > 0) return audioTime;
  return Number(state.restoredPlaybackTime || 0) || 0;
}

function currentPlaybackDuration() {
  const audioDuration = Number(els.audio?.duration || 0);
  if (Number.isFinite(audioDuration) && audioDuration > 0) return audioDuration;
  return Number(state.currentTrack?.lengthSeconds || state.currentTrack?.durationSeconds || state.currentTrack?.duration || 0) || 0;
}

function playbackSessionSnapshot() {
  const track = state.currentTrack?.id || state.currentTrack?.videoId ? state.currentTrack : null;
  const trackId = track?.id || track?.videoId || "";
  return {
    track,
    currentTime: track ? currentPlaybackSeconds() : 0,
    duration: track ? currentPlaybackDuration() : 0,
    currentIndex: state.queue.findIndex((item) => (item.id || item.videoId) === trackId),
    playbackMode: state.playbackMode || "idle",
    wasPlaying: Boolean(state.playing),
    shuffleEnabled: Boolean(state.shuffleEnabled),
    repeatMode: state.repeatMode || "off",
    view: state.activeView || "home",
    sidePanel: state.activeSidePanel || "queue",
    lyricsExpanded: Boolean(state.lyricsExpanded),
    searchQuery: state.searchQuery || els.searchInput?.value || "",
    searchFilter: state.searchFilter || "top",
    savedAt: new Date().toISOString()
  };
}

function playbackSessionSignature(snapshot) {
  return JSON.stringify({
    ...snapshot,
    currentTime: Math.floor(Number(snapshot.currentTime || 0)),
    duration: Math.floor(Number(snapshot.duration || 0)),
    savedAt: ""
  });
}

async function savePlaybackSession({ force = false, sync = false, clearTrack = false } = {}) {
  if (!window.metro?.savePlaybackSession) return;
  const snapshot = playbackSessionSnapshot();
  if (clearTrack) snapshot.clearTrack = true;
  const signature = playbackSessionSignature(snapshot);
  if (!force && signature === state.lastSessionSignature) return;
  state.lastSessionSignature = signature;
  state.lastSessionSaveAt = Date.now();
  try {
    if (sync && window.metro.savePlaybackSessionSync) {
      window.metro.savePlaybackSessionSync(snapshot);
    } else {
      await window.metro.savePlaybackSession(snapshot);
    }
  } catch (error) {
    if (state.settings.debugLogs) console.warn("Playback session save failed", error);
  }
}

function schedulePlaybackSessionSave(options = {}) {
  const force = Boolean(options.force);
  const elapsed = Date.now() - (state.lastSessionSaveAt || 0);
  window.clearTimeout(state.sessionSaveTimer);
  if (force || elapsed >= SESSION_SAVE_INTERVAL_MS) {
    state.sessionSaveTimer = null;
    savePlaybackSession({ force }).catch(() => {});
    return;
  }
  state.sessionSaveTimer = window.setTimeout(() => {
    state.sessionSaveTimer = null;
    savePlaybackSession({ force }).catch(() => {});
  }, SESSION_SAVE_INTERVAL_MS - elapsed);
}

function renderRestoredProgress(session = {}) {
  const current = Math.max(0, Number(session.currentTime || 0) || 0);
  const duration = Math.max(0, Number(session.duration || currentPlaybackDuration()) || 0);
  state.restoredPlaybackTime = current;
  els.currentTime.textContent = formatClock(current);
  els.durationTime.textContent = duration ? formatClock(duration) : "0:00";
  if (!state.seeking) {
    els.seekBar.value = duration ? Math.round((current / duration) * 1000) : 0;
  }
}

function restorePlaybackSession(session) {
  if (!session?.track?.id && !session?.track?.videoId) return false;
  const restoredTrack = session.track;
  const restoredId = restoredTrack.id || restoredTrack.videoId;
  const queueIndex = state.queue.findIndex((item) => (item.id || item.videoId) === restoredId);
  if (queueIndex >= 0) {
    state.currentTrack = { ...state.queue[queueIndex], ...restoredTrack };
    state.currentIndex = queueIndex;
  } else {
    state.currentTrack = restoredTrack;
    state.queue = uniqueTracks([restoredTrack, ...state.queue]);
    state.currentIndex = 0;
    persistQueue().catch(() => {});
  }
  state.playbackMode = "idle";
  state.playing = false;
  state.shuffleEnabled = Boolean(session.shuffleEnabled);
  state.repeatMode = REPEAT_MODES.includes(session.repeatMode) ? session.repeatMode : "off";
  state.lyricsExpanded = Boolean(session.lyricsExpanded);
  renderNow();
  renderRestoredProgress(session);
  setPlaybackModeLabel(session.currentTime ? `Paused at ${formatClock(Number(session.currentTime))}` : "Paused");
  if (session.sidePanel === "lyrics") switchSidePanel("lyrics");
  else switchSidePanel("queue");
  if (state.lyricsExpanded) setLyricsExpanded(true);
  return true;
}

async function restoreSessionView(session) {
  const view = RESTORABLE_VIEWS.has(session?.view) ? session.view : "home";
  state.searchFilter = session?.searchFilter || state.searchFilter;
  if (session?.searchQuery && els.searchInput) {
    state.searchQuery = String(session.searchQuery);
    els.searchInput.value = state.searchQuery;
  }
  if (view === "search") {
    switchView("search");
    renderSearchTabs(state.searchFilter);
    if (state.searchQuery) await doSearch(state.searchQuery, state.searchFilter || "top");
    return;
  }
  if (view === "explore") return loadDiscovery("explore", els.exploreResults, window.metro.explore, "Explore");
  if (view === "charts") return loadDiscovery("charts", els.chartsResults, window.metro.charts, "Charts");
  if (view === "new") return loadDiscovery("new", els.newResults, window.metro.newReleases, "New releases");
  if (view === "moods") return loadDiscovery("moods", els.moodsResults, window.metro.moods, "Moods");
  if (view === "liked") return loadLiked();
  if (view === "downloaded") return loadDownloaded();
  if (view === "localMusic") return loadLocalMusic();
  if (view === "library") return openLibrary();
  if (view === "history") return loadHistory();
  if (view === "playlists") return loadPlaylists();
  if (view === "settings") {
    syncSettingsControls();
    switchView("settings");
    return;
  }
  await loadHome(state.homeParams, state.homeBrowseId);
}

async function applyAudioStartTime(seconds) {
  const startTime = Math.max(0, Number(seconds || 0) || 0);
  if (!startTime) return;
  const seek = () => {
    try {
      const duration = Number(els.audio.duration || 0);
      els.audio.currentTime = duration > 0 ? Math.min(startTime, Math.max(0, duration - 1)) : startTime;
    } catch {
      // Some streams reject early seeking before metadata is ready.
    }
  };
  if (Number.isFinite(els.audio.duration) && els.audio.duration > 0) {
    seek();
    return;
  }
  await new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      els.audio.removeEventListener("loadedmetadata", finish);
      seek();
      resolve();
    };
    const timer = window.setTimeout(finish, 1200);
    els.audio.addEventListener("loadedmetadata", finish, { once: true });
  });
}

function queueMutationBlocked(message = "Queue lock is on. Unlock it before changing the queue.") {
  if (!state.settings.queueLock) return false;
  toast(message, true);
  renderQueue();
  return true;
}

async function setQueue(nextQueue, options = {}) {
  if (!options.force && queueMutationBlocked()) return false;
  state.queue = uniqueTracks(nextQueue || []);
  if (Object.prototype.hasOwnProperty.call(options, "source")) {
    state.queueSource = options.source || null;
  }
  state.currentIndex = state.queue.findIndex((item) => item.id === state.currentTrack?.id);
  await persistQueue();
  renderQueue();
  renderNow();
  return true;
}

function readStoredList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(scopedStorageKey(key)) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeStoredList(key, value) {
  try {
    localStorage.setItem(scopedStorageKey(key), JSON.stringify(value));
  } catch {
    // Storage is best effort.
  }
}

function loadQueueMemory() {
  state.queueHistory = uniqueTracks(readStoredList(QUEUE_HISTORY_KEY)).slice(0, 80);
  state.searchHistory = readStoredList(SEARCH_HISTORY_KEY).filter((item) => typeof item === "string").slice(0, 20);
  state.playbackStats = readStoredObject(PLAYBACK_STATS_KEY);
  loadHomeDiscoveryMemory();
  loadSyncOutbox();
  loadDownloadQueue();
  renderPlaybackStats();
}

function localStorageValuesWithPrefix(prefix, fallback) {
  const values = [];
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(`${prefix}:`)) continue;
      try {
        const value = JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
        values.push(value);
      } catch {
        // Ignore one damaged legacy account entry and continue migrating others.
      }
    }
  } catch {
    // Local recommendations remain best effort when storage is unavailable.
  }
  return values;
}

function loadHomeDiscoveryMemory() {
  const savedHistory = readStoredList(HOME_LISTENING_HISTORY_KEY);
  const legacyHistory = localStorageValuesWithPrefix(QUEUE_HISTORY_KEY, [])
    .filter(Array.isArray)
    .flat();
  state.homeListeningHistory = uniqueTracks([
    ...state.queueHistory,
    ...savedHistory,
    ...legacyHistory
  ]).map(withoutAccountTrackState).slice(0, 120);

  const savedStats = readStoredObject(HOME_PLAYBACK_STATS_KEY);
  const legacyStats = localStorageValuesWithPrefix(PLAYBACK_STATS_KEY, {})
    .filter((value) => value && typeof value === "object" && !Array.isArray(value));
  state.homePlaybackStats = Object.assign({}, ...legacyStats, savedStats, state.playbackStats);
  writeStoredList(HOME_LISTENING_HISTORY_KEY, state.homeListeningHistory);
  writeStoredObject(HOME_PLAYBACK_STATS_KEY, state.homePlaybackStats);
}

function persistQueueMemory() {
  writeStoredList(QUEUE_HISTORY_KEY, state.queueHistory.slice(0, 80));
  writeStoredList(SEARCH_HISTORY_KEY, state.searchHistory.slice(0, 20));
}

function rememberQueueHistory(track) {
  if (!isTrackItem(track)) return;
  const now = new Date().toISOString();
  const historyTrack = { ...track, lastPlayedAt: now };
  const stat = state.playbackStats[track.id] || {
    id: track.id,
    title: track.title || "Song",
    artist: track.artist || track.subtitle || "",
    thumbnail: track.thumbnail || "",
    count: 0,
    firstPlayedAt: now
  };
  state.playbackStats[track.id] = {
    ...stat,
    title: track.title || stat.title,
    artist: track.artist || track.subtitle || stat.artist,
    thumbnail: track.thumbnail || stat.thumbnail,
    count: Number(stat.count || 0) + 1,
    lastPlayedAt: now
  };
  state.homePlaybackStats[track.id] = {
    ...(state.homePlaybackStats[track.id] || {}),
    ...state.playbackStats[track.id]
  };
  writeStoredObject(PLAYBACK_STATS_KEY, state.playbackStats);
  writeStoredObject(HOME_PLAYBACK_STATS_KEY, state.homePlaybackStats);
  state.queueHistory = uniqueTracks([historyTrack, ...state.queueHistory]).slice(0, 80);
  state.homeListeningHistory = uniqueTracks([
    withoutAccountTrackState(historyTrack),
    ...(state.homeListeningHistory || [])
  ]).slice(0, 120);
  writeStoredList(HOME_LISTENING_HISTORY_KEY, state.homeListeningHistory);
  persistQueueMemory();
  renderPlaybackStats();
  renderQueueExtras();
}

function renderQueueExtras() {}

function statsEntries() {
  return Object.values(state.playbackStats || {})
    .filter((item) => item?.id)
    .sort((a, b) => (Number(b.count || 0) - Number(a.count || 0)) || String(b.lastPlayedAt || "").localeCompare(String(a.lastPlayedAt || "")));
}

function renderPlaybackStats() {
  if (!els.playbackStatsStatus || !els.playbackStatsResults) return;
  const entries = statsEntries();
  const total = entries.reduce((sum, item) => sum + Number(item.count || 0), 0);
  els.playbackStatsStatus.textContent = entries.length
    ? `${total} plays across ${entries.length} songs.`
    : "No listening stats yet.";
  els.playbackStatsResults.innerHTML = entries.slice(0, 10).map((item) => `
    <div class="settings-list-row">
      <div>
        <strong>${escapeText(item.title || "Song")}</strong>
        <small>${escapeText(item.artist || "YouTube Music")} - ${Number(item.count || 0)} play${Number(item.count || 0) === 1 ? "" : "s"}</small>
      </div>
    </div>
  `).join("") || `<p class="status">Play a song to start stats.</p>`;
}

function stopCurrentPlayback() {
  state.playbackRequestId += 1;
  els.audio.pause();
  els.audio.removeAttribute("src");
  delete els.audio.dataset.playbackRequestId;
  els.audio.load();
  stopEmbedPlayer();
  state.playing = false;
  state.playbackMode = "idle";
  state.currentTrack = null;
  state.currentIndex = -1;
  state.restoredPlaybackTime = 0;
  renderLyrics(null);
  renderNow();
  schedulePlaybackSessionSave({ force: true });
}

async function clearQueue() {
  if (queueMutationBlocked() || !state.queue.length) return;
  state.queue = [];
  state.queueSource = null;
  await persistQueue();
  stopCurrentPlayback();
  renderQueue();
  toast("Queue cleared.");
}

async function removeQueueItem(index) {
  if (queueMutationBlocked()) return;
  const item = state.queue[index];
  if (!item) return;
  const removingCurrent = state.currentTrack?.id === item.id;
  const nextQueue = state.queue.filter((_, itemIndex) => itemIndex !== index);
  state.queue = nextQueue;
  await persistQueue();

  if (removingCurrent) {
    const nextTrack = nextQueue[index] || nextQueue[index - 1] || null;
    if (nextTrack) await playTrack(nextTrack);
    else stopCurrentPlayback();
  } else {
    state.currentIndex = state.queue.findIndex((track) => track.id === state.currentTrack?.id);
    renderNow();
  }
  toast(`Removed from queue: ${item.title}`);
}

async function reorderQueueItem(fromIndex, dropIndex) {
  if (queueMutationBlocked()) return;
  if (fromIndex == null || fromIndex < 0 || fromIndex >= state.queue.length) return;
  let target = Math.max(0, Math.min(dropIndex, state.queue.length));
  if (target > fromIndex) target -= 1;
  if (target === fromIndex) return;
  const nextQueue = [...state.queue];
  const [item] = nextQueue.splice(fromIndex, 1);
  nextQueue.splice(target, 0, item);
  await setQueue(nextQueue);
  toast("Queue reordered.");
}

function queueDropIndexFromEvent(row, event) {
  const index = Number(row?.dataset.index);
  if (!Number.isFinite(index)) return -1;
  const rect = row.getBoundingClientRect();
  return event.clientY > rect.top + rect.height / 2 ? index + 1 : index;
}

function clearQueueDropMarkers() {
  for (const row of els.queueList.querySelectorAll(".queue-row")) {
    row.classList.remove("dragging", "drop-before", "drop-after");
  }
}

function markQueueDropTarget(row, dropIndex) {
  clearQueueDropMarkers();
  const rowIndex = Number(row?.dataset.index);
  if (!Number.isFinite(rowIndex)) return;
  row.classList.add(dropIndex > rowIndex ? "drop-after" : "drop-before");
  const draggingRow = els.queueList.querySelector(`.queue-row[data-index="${state.queueDragFrom}"]`);
  draggingRow?.classList.add("dragging");
}

function resetQueueDragState() {
  state.queueDragGhost?.remove();
  state.queueDragGhost = null;
  state.queueDragFrom = null;
  state.queueDropIndex = null;
  state.queueDragPointerId = null;
  state.queueDragOffsetY = 0;
  state.queueDragOriginRect = null;
  clearQueueDropMarkers();
}

function currentQueueIndex() {
  const index = state.queue.findIndex((item) => item.id === state.currentTrack?.id);
  state.currentIndex = index;
  return index;
}

function randomQueueIndex(excludeIndex) {
  if (!state.queue.length) return -1;
  if (state.queue.length === 1) return 0;
  let index = Math.floor(Math.random() * state.queue.length);
  if (index === excludeIndex) index = (index + 1) % state.queue.length;
  return index;
}

function queueShuffleSignature() {
  return state.queue.map((item) => String(item?.id || item?.videoId || "")).join("\u001f");
}

function resetShuffleOrder() {
  state.shuffleOrder = [];
  state.shuffleSignature = "";
}

function ensureShuffleOrder({ renew = false } = {}) {
  const signature = queueShuffleSignature();
  if (!renew && state.shuffleSignature === signature && state.shuffleOrder.length === state.queue.length) {
    return state.shuffleOrder;
  }
  const currentId = String(state.currentTrack?.id || state.currentTrack?.videoId || "");
  const remaining = state.queue
    .map((item) => String(item?.id || item?.videoId || ""))
    .filter((id) => id && id !== currentId);
  for (let index = remaining.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [remaining[index], remaining[swapIndex]] = [remaining[swapIndex], remaining[index]];
  }
  state.shuffleOrder = currentId && state.queue.some((item) => String(item?.id || item?.videoId || "") === currentId)
    ? [currentId, ...remaining]
    : remaining;
  state.shuffleSignature = signature;
  return state.shuffleOrder;
}

function queueIndexByTrackId(trackId) {
  return state.queue.findIndex((item) => String(item?.id || item?.videoId || "") === String(trackId || ""));
}

function queueTrackIsPlayable(index) {
  const item = state.queue[index];
  if (!item || state.playbackFailedIds.has(item.id)) return false;
  return !state.settings.offlineMode || isOfflineCached(item.id) || item.offlineCached || item.cached;
}

function nextQueueIndex({ manual = false, ended = false } = {}) {
  if (!state.queue.length) return -1;
  const current = currentQueueIndex();
  if (ended && state.repeatMode === "one" && current >= 0) return current;
  if (state.shuffleEnabled) {
    let order = ensureShuffleOrder();
    const currentId = String(state.currentTrack?.id || state.currentTrack?.videoId || "");
    const position = Math.max(-1, order.indexOf(currentId));
    for (let orderIndex = position + 1; orderIndex < order.length; orderIndex += 1) {
      const index = queueIndexByTrackId(order[orderIndex]);
      if (queueTrackIsPlayable(index)) return index;
    }
    if (state.repeatMode === "all") {
      order = ensureShuffleOrder({ renew: true });
      for (let orderIndex = currentId ? 1 : 0; orderIndex < order.length; orderIndex += 1) {
        const index = queueIndexByTrackId(order[orderIndex]);
        if (queueTrackIsPlayable(index)) return index;
      }
      if (state.queue.length === 1 && queueTrackIsPlayable(current)) return current;
    }
    return -1;
  }
  const start = current >= 0 ? current + 1 : 0;
  for (let index = start; index < state.queue.length; index += 1) {
    const item = state.queue[index];
    if (state.playbackFailedIds.has(item?.id)) continue;
    if (state.settings.offlineMode && !isOfflineCached(item.id) && !item.offlineCached && !item.cached) continue;
    return index;
  }
  if (state.repeatMode === "all") {
    for (let index = 0; index < start; index += 1) {
      const item = state.queue[index];
      if (state.playbackFailedIds.has(item?.id)) continue;
      if (state.settings.offlineMode && !isOfflineCached(item.id) && !item.offlineCached && !item.cached) continue;
      return index;
    }
  }
  return -1;
}

function previousQueueIndex() {
  if (!state.queue.length) return -1;
  const current = currentQueueIndex();
  if (state.shuffleEnabled) {
    const order = ensureShuffleOrder();
    const currentId = String(state.currentTrack?.id || state.currentTrack?.videoId || "");
    const position = order.indexOf(currentId);
    for (let orderIndex = position - 1; orderIndex >= 0; orderIndex -= 1) {
      const index = queueIndexByTrackId(order[orderIndex]);
      if (queueTrackIsPlayable(index)) return index;
    }
    if (state.repeatMode === "all") {
      for (let orderIndex = order.length - 1; orderIndex > position; orderIndex -= 1) {
        const index = queueIndexByTrackId(order[orderIndex]);
        if (queueTrackIsPlayable(index)) return index;
      }
    }
    return current;
  }
  const previous = current >= 0 ? current - 1 : state.queue.length - 1;
  return previous >= 0 ? previous : state.queue.length - 1;
}

async function playQueueIndex(index) {
  if (index < 0 || index >= state.queue.length) return false;
  await playTrack(state.queue[index]);
  return true;
}

function rotateTracksFrom(track, tracks) {
  const list = uniqueTracks((tracks || []).filter(isTrackItem));
  const index = list.findIndex((item) => item.id === track?.id);
  if (index <= 0) return list;
  return [...list.slice(index), ...list.slice(0, index)];
}

async function insertTracksAfterCurrent(tracks, source = null) {
  if (queueMutationBlocked()) return false;
  const list = uniqueTracks((tracks || []).filter(isTrackItem));
  if (!list.length) return false;
  const insertAt = currentQueueIndex() >= 0 ? currentQueueIndex() + 1 : state.queue.length;
  const incomingIds = new Set(list.map((item) => item.id));
  const baseQueue = state.queue.filter((item) => !incomingIds.has(item.id));
  const nextQueue = [...baseQueue];
  nextQueue.splice(Math.min(insertAt, nextQueue.length), 0, ...list);
  state.queue = uniqueTracks(nextQueue);
  if (source) state.queueSource = source;
  await persistQueue();
  renderQueue();
  return true;
}

async function appendSmartQueueFromTrack(track = state.currentTrack) {
  return false;
}

async function handlePlaybackEnded() {
  await maybeAutoLoadMoreQueue();
  let nextIndex = nextQueueIndex({ ended: true });
  if (nextIndex < 0 && await appendSmartQueueFromTrack()) {
    nextIndex = nextQueueIndex({ ended: true });
  }
  if (nextIndex >= 0) {
    await playQueueIndex(nextIndex);
    return;
  }
  state.playing = false;
  state.playbackMode = "idle";
  setPlaybackModeLabel("Ready");
  renderNow();
}

async function addToQueue(items, playFirst = false, source = null) {
  if (queueMutationBlocked()) return;
  const list = Array.isArray(items) ? items : [items];
  const preparedList = state.settings.offlineMode
    ? list.filter((item) => !isTrackItem(item) || isOfflineCached(item.id) || item.offlineCached || item.cached).map((item) => isTrackItem(item) ? { ...item, offlineOnly: true, offlineCached: true, cached: true } : item)
    : list;
  if (state.settings.offlineMode && list.some((item) => isTrackItem(item)) && !preparedList.some((item) => isTrackItem(item))) {
    toast("Offline mode: no downloaded songs in this selection.", true);
    return;
  }
  if (playFirst) {
    const tracks = uniqueTracks(preparedList.filter(isTrackItem));
    if (tracks.length) {
      if (state.settings.queueLock && state.queue.length) {
        await insertTracksAfterCurrent(tracks, source || queueSource("list", "Queue"));
      } else {
        await setQueue(tracks, { source: source || queueSource("list", "Queue") });
      }
      await playTrack(tracks[0]);
    }
    return;
  }
  for (const item of preparedList) {
    if (!item?.id || state.queue.some((existing) => existing.id === item.id)) continue;
    state.queue.push(item);
  }
  if (source) state.queueSource = source;
  await persistQueue();
  renderQueue();
}

async function startYouTubeQueueForTrack(track, fallbackTracks = [], fallbackSource = null) {
  const fallbackQueue = rotateTracksFrom(track, fallbackTracks.length ? fallbackTracks : [track]);
  try {
    const result = await window.metro.queue({
      videoId: track.id,
      playlistId: track.playlistId || null,
      playlistSetVideoId: track.setVideoId || null,
      params: track.params || null,
      index: track.index ?? null
    });
    const youtubeTracks = uniqueTracks([track, ...tracksFromResult(result)]);
    const tracks = youtubeTracks.length > 1 ? youtubeTracks : fallbackQueue;
    await setQueue(tracks.length ? tracks : [track], {
      source: queueSourceFromResult(result, { title: fallbackSource?.title || `${track.title || "Song"} radio` }, "youtube")
    });
  } catch {
    await setQueue(fallbackQueue.length ? fallbackQueue : [track], {
      source: fallbackSource || queueSource("youtube", "Up next")
    });
  }
}

async function maybeAutoLoadMoreQueue() {
  if (state.settings.queueLock) return;
  const continuation = state.queueSource?.continuations?.[0];
  if (!continuation?.token || state.queueAutoloading) return;
  const current = currentQueueIndex();
  if (current < 0 || state.queue.length - current > state.queueAutoloadThreshold) return;

  state.queueAutoloading = true;
  try {
    const result = continuation.endpoint === "podcast"
      ? await window.metro.podcastContinuation(continuation.token)
      : await window.metro.continue({
        token: continuation.token,
        endpoint: continuation.endpoint || "browse"
      });
    const tracks = continuation.endpoint === "podcast" ? (result?.episodes || []) : tracksFromResult(result);
    const nextTracks = uniqueTracks([...state.queue, ...tracks]);
    state.queue = nextTracks;
    state.queueSource = {
      ...state.queueSource,
      continuations: continuation.endpoint === "podcast"
        ? (result?.continuation ? [{ token: result.continuation, endpoint: "podcast" }] : [])
        : (result?.continuations || [])
    };
    await persistQueue();
    renderQueue();
  } catch (error) {
    state.queueSource = { ...state.queueSource, continuations: [] };
    renderQueue();
  } finally {
    state.queueAutoloading = false;
  }
}

async function playTrackFromContext(track, contextItems = [], source = null) {
  if (!track?.id) return;
  if (blockPlaybackForGame()) return;
  if (state.currentTrack?.id === track.id) {
    els.playButton.click();
    return;
  }
  if (state.settings.offlineMode && !isOfflineCached(track.id) && !track.offlineCached && !track.cached) {
    const offlineTrack = (contextItems || []).find((item) => item?.id === track.id && (isOfflineCached(item.id) || item.offlineCached || item.cached));
    if (!offlineTrack) {
      toast("Offline mode: this song has not been downloaded.", true);
      renderQueue();
      return;
    }
    track = { ...offlineTrack, offlineOnly: true, offlineCached: true, cached: true };
  }
  const tracks = uniqueTracks((contextItems || []).filter(isTrackItem)
    .filter((item) => !state.settings.offlineMode || isOfflineCached(item.id) || item.offlineCached || item.cached)
    .map((item) => state.settings.offlineMode ? { ...item, offlineOnly: true, offlineCached: true, cached: true } : item));
  const shouldUseYouTubeQueue = source?.type === "home" || source?.type === "youtube";
  if (state.settings.queueLock) {
    const lockedTrack = state.queue.find((item) => item.id === track.id);
    if (lockedTrack) {
      await playTrack(lockedTrack);
    } else {
      queueMutationBlocked("Queue lock is on. Unlock it before playing songs outside the current queue.");
    }
    return;
  }
  if (shouldUseYouTubeQueue) {
    await startYouTubeQueueForTrack(track, tracks, source);
  } else if (tracks.length > 1 && tracks.some((item) => item.id === track.id)) {
    await setQueue(tracks, { source: source || queueSource("list", "Queue") });
  } else if (tracks.length === 1 && isOfflineQueueSource(source)) {
    await setQueue(tracks, { source });
  } else if (tracks.length === 1 && source?.continuations?.length) {
    await setQueue(tracks, { source });
  } else if (tracks.length <= 1) {
    await startYouTubeQueueForTrack(track, tracks, source);
  } else if (!state.queue.some((item) => item.id === track.id)) {
    state.queue.push(track);
    await persistQueue();
    renderQueue();
  }
  await playTrack(track);
}

function isTrackItem(item) {
  return Boolean(item?.id && (item.type === "track" || item.kind === "track" || item.videoId || !item.browseId));
}

function isPodcastItem(item) {
  const browseId = String(item?.browseId || item?.id || "");
  return item?.type === "podcast" || item?.kind === "podcast" || browseId.startsWith("MPS") || browseId.startsWith("MPED");
}

function isPlayableBrowseItem(item) {
  return Boolean(item?.browseId && (["album", "playlist", "artist"].includes(item.type) || isPodcastItem(item)));
}

function itemFromHost(host) {
  if (!host) return null;
  if (host.matches("[data-search-top-result]")) {
    return host._items?.[0] || null;
  }
  const items = host.parentElement?._items || [];
  return items[Number(host.dataset.index)] || null;
}

function sourceFromHost(host) {
  if (!host) return null;
  return host._queueSource || host.parentElement?._queueSource || null;
}

function contextItemsFromHost(host) {
  if (!host) return [];
  if (host.matches("[data-search-top-result]")) return host._items || [];
  return host.parentElement?._items || [];
}

function primaryArtistFromItem(item) {
  if (item?.type === "artist") return item;
  return playableArtistFromTrack(item);
}

function artistChannelId(artist) {
  return artist?.channelId || (String(artist?.browseId || artist?.id || "").startsWith("UC") ? (artist.browseId || artist.id) : "");
}

function sameArtistReference(a = {}, b = {}) {
  const aIds = [a.channelId, a.browseId, a.id].filter(Boolean).map(String);
  const bIds = [b.channelId, b.browseId, b.id].filter(Boolean).map(String);
  if (aIds.some((id) => bIds.includes(id))) return true;
  return normalizeArtistKey(a.title || a.name) && normalizeArtistKey(a.title || a.name) === normalizeArtistKey(b.title || b.name);
}

async function resolveArtistForMutation(item) {
  let artist = primaryArtistFromItem(item);
  if (!artist?.title && !artist?.browseId && !artist?.channelId) return null;

  const loadArtistAction = async (candidate) => {
    const browseId = candidate?.browseId || (String(candidate?.id || "").startsWith("UC") ? candidate.id : "");
    if (!browseId) return null;
    const result = await window.metro.artist({
      browseId,
      params: candidate.params || null
    });
    return artistActionItem(result, candidate);
  };

  try {
    const detailed = await loadArtistAction(artist);
    if (detailed?.channelId) return { ...artist, ...detailed };
  } catch (error) {
    if (state.settings.debugLogs) console.warn("Artist detail lookup failed", error);
  }

  if (artist?.title) {
    try {
      const candidates = await window.metro.searchArtists(artist.title);
      const targetName = normalizeArtistKey(artist.title);
      const candidate = candidates.find((entry) => normalizeArtistKey(entry.title) === targetName) || candidates[0];
      const detailed = await loadArtistAction(candidate);
      if (detailed?.channelId) return { ...artist, ...candidate, ...detailed };
      if (candidate) return { ...artist, ...candidate };
    } catch (error) {
      if (state.settings.debugLogs) console.warn("Artist search lookup failed", error);
    }
  }

  return artist;
}

function applyArtistFollowState(artist, subscribed) {
  if (!artist) return;
  const nextArtist = {
    ...artist,
    subscribed: Boolean(subscribed),
    inLibrary: Boolean(subscribed)
  };
  if (state.artistActionItem && sameArtistReference(state.artistActionItem, nextArtist)) {
    state.artistActionItem = { ...state.artistActionItem, ...nextArtist };
  }
  if (state.artistResult?.header && sameArtistReference(state.artistResult.header, nextArtist)) {
    state.artistResult.header = {
      ...state.artistResult.header,
      channelId: nextArtist.channelId || state.artistResult.header.channelId,
      subscribed: Boolean(subscribed),
      subscribeParams: nextArtist.subscribeParams || state.artistResult.header.subscribeParams
    };
  }
  syncLibraryItem({ ...nextArtist, type: "artist", kind: "artist" }, Boolean(subscribed));
}

function albumFromItem(item) {
  if (item?.type === "album") return item;
  if (item?.album?.browseId) return item.album;
  if (item?.album?.id) {
    return {
      id: item.album.id,
      browseId: item.album.id,
      type: "album",
      title: item.album.title || item.album.name || "Album",
      subtitle: "Album",
      thumbnail: item.thumbnail || ""
    };
  }
  return null;
}

function collectionTracksFromActiveView() {
  const collectionVisible = !document.getElementById("collectionView")?.classList.contains("hidden");
  const artistVisible = !document.getElementById("artistView")?.classList.contains("hidden");
  const podcastVisible = !document.getElementById("podcastView")?.classList.contains("hidden");
  if (collectionVisible) return uniqueTracks(els.collectionPlayButton?._tracks || []);
  if (artistVisible) return uniqueTracks(els.artistPlayButton?._tracks || []);
  if (podcastVisible) return uniqueTracks(els.podcastPlayButton?._tracks || []);
  return [];
}

function patchTrackInPageResult(result, videoId, patch) {
  if (!result || !videoId) return;
  result.tracks = (result.tracks || []).map((track) => track.id === videoId ? { ...track, ...patch } : track);
  result.sections = (result.sections || []).map((section) => ({
    ...section,
    tracks: (section.tracks || []).map((track) => track.id === videoId ? { ...track, ...patch } : track)
  }));
}

function patchTrackState(videoId, patch) {
  if (!videoId) return;
  state.queue = state.queue.map((track) => track.id === videoId ? { ...track, ...patch } : track);
  state.queueHistory = state.queueHistory.map((track) => track.id === videoId ? { ...track, ...patch } : track);
  if (state.currentTrack?.id === videoId) state.currentTrack = { ...state.currentTrack, ...patch };
  patchTrackInPageResult(state.homeResult, videoId, patch);
  patchTrackInPageResult(state.searchResult, videoId, patch);
  patchTrackInPageResult(state.collectionResult, videoId, patch);
  patchTrackInPageResult(state.artistResult, videoId, patch);
  patchTrackInPageResult(state.likedData, videoId, patch);
  if (state.libraryData?.songs) {
    state.libraryData.songs = state.libraryData.songs.map((track) => track.id === videoId ? { ...track, ...patch } : track);
  }
  if (state.libraryData?.downloads) {
    state.libraryData.downloads = state.libraryData.downloads.map((track) => track.id === videoId ? { ...track, ...patch } : track);
  }
  if (state.offlineCache?.tracks) {
    state.offlineCache.tracks = state.offlineCache.tracks.map((track) => track.id === videoId ? { ...track, ...patch } : track);
  }
}

function currentVisibleViewId() {
  return [...document.querySelectorAll(".view")].find((element) => !element.classList.contains("hidden"))?.id || "";
}

function refreshVisibleDataAfterMutation() {
  renderQueue();
  renderNow();
  const view = currentVisibleViewId();
  if (view === "homeView" && state.homeResult) renderHome(state.homeResult, state.homeParams);
  if (view === "searchView" && state.searchResult) renderSearchResults(state.searchResult, state.searchFilter);
  if (view === "collectionView" && state.collectionResult) renderCollection(state.collectionResult, state.collectionFallback || {});
  if (view === "artistView" && state.artistResult) renderArtist(state.artistResult, state.artistFallback || {});
  if (view === "likedView" && state.likedData) renderLiked(state.likedData);
  if (view === "downloadedView") renderDownloaded();
  if (view === "libraryView" && state.libraryData) renderLibrary(state.libraryData);
}

function hideMoreMenu() {
  const wasOpen = !els.moreMenu.classList.contains("hidden");
  state.moreItem = null;
  state.moreSource = null;
  state.moreContextItems = [];
  els.moreMenu.classList.add("hidden");
  // Keep the global song menu stable while session lyrics advance. Once the
  // menu closes, catch up with one instant lyric re-anchor instead of allowing
  // smooth-scroll layout work underneath every menu interaction.
  if (wasOpen && state.activeSidePanel === "lyrics" && state.lyricsAutoSync) {
    requestAnimationFrame(() => scrollLyricIntoView(activeLyricElement(), { instant: true }));
  }
}

function setMoreActionLabel(button, label) {
  const labelElement = button?.querySelector(".more-action-label");
  if (labelElement) labelElement.textContent = label;
  else if (button) button.textContent = label;
}

function showMoreMenu(item, rect, source = null, contextItems = []) {
  if (!item) return;
  if (state.activeSidePanel === "lyrics" && state.lyricsAutoSync) {
    // Native smooth scrolling keeps running after its initiating function has
    // returned. Freeze it at the current Y position before displaying a global
    // song menu, otherwise every lyric change repaints underneath the fixed
    // overlay and makes its contents appear to cut/flicker.
    if (state.lyricsScrollAnimationFrame) cancelAnimationFrame(state.lyricsScrollAnimationFrame);
    state.lyricsScrollAnimationFrame = 0;
    window.clearTimeout(state.lyricsProgrammaticTimer);
    state.lyricsProgrammaticScroll = false;
    const lyricsScrollContainer = document.getElementById("rightPanel");
    lyricsScrollContainer?.scrollTo({
      top: lyricsScrollContainer.scrollTop,
      behavior: "auto"
    });
  }
  state.moreItem = item;
  state.moreSource = source || null;
  state.moreContextItems = Array.isArray(contextItems) ? contextItems : [];
  const canOpen = isPlayableBrowseItem(item);
  const canPlay = isTrackItem(item) || canOpen;
  const artistMenu = item?.type === "artist" || item?.kind === "artist";
  const itemLiked = trackIsLiked(item);
  const canLike = isTrackItem(item) && !itemLiked;
  const canUnlike = isTrackItem(item) && itemLiked;
  const canArtist = Boolean(primaryArtistFromItem(item)?.title);
  const canAlbum = Boolean(albumFromItem(item)?.browseId);
  const canPlaylist = isTrackItem(item);
  const canCacheOffline = isTrackItem(item) && !isOfflineCached(item.id) && !state.offlineCachePending.has(item.id);
  const canRemoveOffline = isTrackItem(item) && isOfflineCached(item.id);
  const offlinePending = isTrackItem(item) && state.offlineCachePending.has(item.id);
  const offlineFailed = isTrackItem(item) && Boolean(downloadFailure(item.id));
  const canSaveLibrary = Boolean(item.libraryAddToken) && !item.inLibrary;
  const canRemoveLibrary = Boolean(item.libraryRemoveToken) && item.inLibrary;
  const artistTarget = primaryArtistFromItem(item);
  const canFollow = Boolean(artistTarget?.browseId || artistTarget?.channelId) && !artistTarget?.subscribed;
  const canUnfollow = Boolean(artistTarget?.browseId || artistTarget?.channelId) && Boolean(artistTarget?.subscribed);
  const canShare = isTrackItem(item) || Boolean(artistMenu && (artistChannelId(item) || item.browseId));
  const contextType = source?.type || "";
  const isQueueContext = contextType === "queue";
  const isHistoryContext = contextType === "history" || Boolean(item.historyRemoveToken);
  const isPlaylistContext = contextType === "playlist" || (isPlaylistCollection() && Boolean(item.setVideoId));

  for (const button of els.moreMenu.querySelectorAll("[data-more-action]")) {
    const action = button.dataset.moreAction;
    const hiddenForArtist = artistMenu && !["play", "queue", "radio", "share", "follow", "unfollow", "details"].includes(action);
    const contextualHidden =
      (action === "remove-queue" && !isQueueContext) ||
      (action === "remove-history" && !isHistoryContext) ||
      (action === "remove-playlist" && !isPlaylistContext);
    const stateAlternativeHidden =
      (action === "like" && !canLike) ||
      (action === "unlike" && !canUnlike) ||
      (action === "cache-offline" && canRemoveOffline) ||
      (action === "remove-offline" && !canRemoveOffline) ||
      (action === "save-library" && !canSaveLibrary) ||
      (action === "remove-library" && !canRemoveLibrary) ||
      (action === "follow" && !canFollow) ||
      (action === "unfollow" && !canUnfollow);
    button.classList.toggle("hidden", hiddenForArtist || contextualHidden || stateAlternativeHidden);
    const disabled =
      ((action === "play" || action === "queue") && !canPlay) ||
      (action === "play-next" && !isTrackItem(item)) ||
      (action === "radio" && !canPlay) ||
      (action === "share" && !canShare) ||
      (action === "cache-offline" && !canCacheOffline) ||
      (action === "remove-offline" && !canRemoveOffline) ||
      (action === "like" && !canLike) ||
      (action === "unlike" && !canUnlike) ||
      (action === "save-library" && !canSaveLibrary) ||
      (action === "remove-library" && !canRemoveLibrary) ||
      (action === "follow" && !canFollow) ||
      (action === "unfollow" && !canUnfollow) ||
      (action === "artist" && !canArtist) ||
      (action === "album" && !canAlbum) ||
      (action === "playlist" && !canPlaylist) ||
      (action === "details" && !item) ||
      (action === "remove-queue" && (!isQueueContext || state.settings.queueLock)) ||
      (action === "remove-history" && !item.historyRemoveToken) ||
      (action === "remove-playlist" && (!item.setVideoId || !activeCollectionPlaylistId()));
    button.disabled = disabled;
    if (action === "cache-offline") {
      setMoreActionLabel(button, offlinePending ? "Downloading..." : offlineFailed ? "Retry download" : "Download");
      button.title = offlineFailed ? downloadFailure(item.id) : "";
    }
    if (action === "remove-offline") {
      setMoreActionLabel(button, "Remove download");
    }
  }

  els.moreMenu.classList.remove("hidden");
  const width = els.moreMenu.offsetWidth || 190;
  const height = els.moreMenu.offsetHeight || 240;
  const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8);
  const top = Math.min(Math.max(8, rect.top), window.innerHeight - height - 8);
  els.moreMenu.style.left = `${left}px`;
  els.moreMenu.style.top = `${top}px`;
}

async function playNext(item) {
  if (queueMutationBlocked()) return;
  if (!isTrackItem(item)) return;
  if (state.currentTrack?.id === item.id) {
    toast("This song is already playing.");
    return;
  }

  state.queue = state.queue.filter((existing) => existing.id !== item.id);
  state.currentIndex = state.queue.findIndex((existing) => existing.id === state.currentTrack?.id);
  const insertAt = state.currentIndex >= 0 ? Math.min(state.currentIndex + 1, state.queue.length) : 0;
  state.queue.splice(insertAt, 0, item);
  await persistQueue();
  renderQueue();
  toast(`Playing next: ${item.title}`);
}

async function openArtist(artist) {
  if (!artist?.title) return;
  if (artist.browseId) {
    await loadArtist(artist);
    return;
  }
  toast(`Finding artist: ${artist.title}`);
  try {
    const artists = await window.metro.searchArtists(artist.title);
    const match = artists.find((item) => item.title.toLowerCase() === artist.title.toLowerCase()) || artists[0];
    if (match) {
      await loadArtist(match);
      return;
    }
    await doSearch(artist.title);
  } catch {
    await doSearch(artist.title);
  }
}

function addLikedTrack(track) {
  if (!track?.id) return;
  clearLikedRemoval(track.id);
  state.likedTrackIds.add(track.id);
  state.likedStateHydrated = true;
  if (!state.likedData) return;
  const likedTrack = { ...track, inLibrary: true, liked: true };
  const hasTrack = likedRawTracks().some((item) => item.id === track.id);
  if (!hasTrack) {
    state.likedData.tracks = [likedTrack, ...(state.likedData.tracks || [])];
  }
}

function markTracksLiked(result) {
  if (!result) return result;
  result.tracks = (result.tracks || []).map((track) => ({ ...track, inLibrary: true, liked: true }));
  result.sections = (result.sections || []).map((section) => ({
    ...section,
    tracks: (section.tracks || []).map((track) => ({ ...track, inLibrary: true, liked: true }))
  }));
  return result;
}

async function refreshLikedDataInPlace(expected = null) {
  try {
    setSyncState("liked", { status: "pending", pending: 1, error: "" });
    const result = await window.metro.likedSongs();
    state.likedData = mergeLikedData(result);
    const expectedIds = new Set([
      ...(Array.isArray(expected?.ids) ? expected.ids : []),
      ...(expected?.id ? [expected.id] : [])
    ]);
    if (expectedIds.size && expected?.liked === false) {
      removeLikedTracks([...expectedIds]);
    } else if (expectedIds.size && expected?.liked === true && state.currentTrack?.id && expectedIds.has(state.currentTrack.id)) {
      addLikedTrack(state.currentTrack);
    }
    const likedIds = new Set(likedRawTracks(state.likedData).map((track) => track.id));
    if (state.currentTrack?.id) {
      const expectedApplies = expectedIds.has(state.currentTrack.id);
      const liked = expectedApplies ? Boolean(expected.liked) : likedIds.has(state.currentTrack.id);
      patchTrackState(state.currentTrack.id, {
        liked,
        inLibrary: liked || state.currentTrack.inLibrary
      });
    }
    setSyncState("liked", { status: "synced", pending: 0, error: "", updatedAt: new Date().toISOString() });
    if (currentVisibleViewId() === "likedView") renderLiked(state.likedData);
  } catch (error) {
    setSyncState("liked", { status: "error", pending: 0, error: error.message || "Liked refresh failed." });
    if (state.settings.debugLogs) console.warn("Liked refresh failed", error);
  }
}

function libraryBucketForItem(item) {
  if (!item) return "";
  if (isTrackItem(item)) return "songs";
  if (item.type === "playlist" || String(item.browseId || "").startsWith("VL")) return "playlists";
  if (item.type === "album" || String(item.browseId || "").startsWith("MPRE")) return "albums";
  if (item.type === "artist" || String(item.browseId || "").startsWith("UC")) return "artists";
  if (isPodcastItem(item)) return "podcasts";
  return "";
}

function syncLibraryItem(item, saved) {
  if (!state.libraryData || !item) return;
  const bucket = libraryBucketForItem(item);
  if (!bucket || !Array.isArray(state.libraryData[bucket])) return;
  const itemId = item.id || item.browseId;
  if (!itemId) return;
  if (saved) {
    const savedItem = { ...item, inLibrary: true };
    const exists = state.libraryData[bucket].some((entry) => (entry.id || entry.browseId) === itemId);
    state.libraryData[bucket] = exists
      ? state.libraryData[bucket].map((entry) => (entry.id || entry.browseId) === itemId ? { ...entry, ...savedItem } : entry)
      : [savedItem, ...state.libraryData[bucket]];
  } else {
    state.libraryData[bucket] = state.libraryData[bucket].filter((entry) => (entry.id || entry.browseId) !== itemId);
  }
}

async function shareTrack(track, feedbackButton = null) {
  const url = currentTrackShareUrl(track);
  if (!url) {
    toast("Choose a song to share.", true);
    return;
  }

  const sharePayload = {
    title: track.title || "Auralane",
    text: [track.title, track.subtitle || track.artist].filter(Boolean).join(" - "),
    url
  };

  try {
    if (navigator.share) {
      await navigator.share(sharePayload);
      toast("Share sheet opened.");
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
  }

  try {
    let copied = false;
    if (window.metro?.copyText) {
      try {
        await window.metro.copyText(url);
        copied = true;
      } catch (error) {
        if (state.settings.debugLogs) console.warn("Main clipboard copy failed", error);
      }
    }
    if (!copied && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      copied = true;
    }
    if (!copied) {
      throw new Error("Clipboard is not available.");
    }
    showCopySuccess(feedbackButton || (track?.id === state.currentTrack?.id ? els.shareButton : null));
    toast("Song link copied.");
  } catch (error) {
    toast(error.message || "Share failed.", true);
  }
}

async function shareArtist(artist) {
  const feedbackButton = document.activeElement;
  const url = artistShareUrl(artist);
  if (!url) {
    toast("Artist link is not available.", true);
    return;
  }
  const sharePayload = {
    title: artist.title || "Artist",
    text: artist.title || "Artist",
    url
  };
  try {
    if (navigator.share) {
      await navigator.share(sharePayload);
      toast("Share sheet opened.");
      return;
    }
    await navigator.clipboard.writeText(`${sharePayload.text}\n${url}`);
    showCopySuccess(feedbackButton);
    toast("Artist link copied.");
  } catch (error) {
    if (error?.name === "AbortError") return;
    try {
      await navigator.clipboard.writeText(`${sharePayload.text}\n${url}`);
      showCopySuccess(feedbackButton);
      toast("Artist link copied.");
    } catch {
      toast(error.message || "Share failed.", true);
    }
  }
}

async function shareCurrentTrack() {
  await shareTrack(state.currentTrack);
}

async function toggleCurrentTrackLike() {
  const track = state.currentTrack;
  if (!isTrackItem(track)) {
    toast("Choose a song to like.", true);
    return;
  }

  const liked = !trackIsLiked(track);
  if (els.likeButton) els.likeButton.disabled = true;
  try {
    await setTrackLike(track, liked);
  } catch (error) {
    setSyncState("liked", { status: "error", pending: 0, error: error.message || "Like failed." });
    toast(error.message || "Like failed.", true);
    renderCurrentTrackActions();
  }
}

async function toggleCurrentTrackDownload() {
  const track = state.currentTrack;
  if (!isTrackItem(track)) {
    toast("Choose a song to download.", true);
    return;
  }
  if (state.offlineCachePending.has(track.id)) return;
  if (isOfflineCached(track.id) || track.offlineCached || track.cached) {
    await removeTrackOffline(track);
    return;
  }
  await cacheTrackOffline(track);
}

async function unlikeTrackOnAccount(item) {
  const track = typeof item === "string" ? { id: item } : (item || {});
  const videoId = track.id || track.videoId;
  if (!videoId) throw new Error("The song does not have a YouTube Music video ID.");
  const result = await window.metro.unlikeVideo(videoId);
  if (result?.ok === false) throw new Error("Song unlike was not accepted by YouTube Music.");
  // Rating and Library membership are separate YouTube Music mutations. Send
  // both when the row exposes a remove token; the durable unlike tombstone in
  // the main process still protects refreshes while browse data catches up.
  if (track.libraryRemoveToken) {
    try {
      await window.metro.feedback({ tokens: [track.libraryRemoveToken] });
    } catch (error) {
      if (state.settings.debugLogs) console.warn("Library removal after unlike failed", error);
    }
  }
  return result;
}

async function setTrackLike(item, liked) {
  if (!isTrackItem(item)) return;
  setSyncState("liked", { status: "pending", pending: 1, error: "" });
  try {
    if (liked) {
      const result = await window.metro.likeVideo(item.id);
      if (result?.ok === false) throw new Error("Song like was not accepted by YouTube Music.");
      clearLikedRemoval(item.id);
      item.inLibrary = true;
      item.liked = true;
      patchTrackState(item.id, { inLibrary: true, liked: true });
      addLikedTrack(item);
      syncLibraryItem(item, true);
      await refreshLikedDataInPlace({ id: item.id, liked: true });
      toast(`Liked: ${item.title}`);
    } else {
      await unlikeTrackOnAccount(item);
      rememberLikedRemoval(item.id);
      item.inLibrary = false;
      item.liked = false;
      patchTrackState(item.id, { inLibrary: false, liked: false });
      removeLikedTracks([item.id]);
      syncLibraryItem(item, false);
      await refreshLikedDataInPlace({ id: item.id, liked: false });
      toast(`Unliked: ${item.title}`);
    }
  } catch (error) {
    enqueueSyncAction(liked ? "like-track" : "unlike-track", {
      videoId: item.id,
      track: compactTrack(item)
    }, `${liked ? "Like" : "Unlike"}: ${item.title || "Song"}`);
    patchTrackState(item.id, { inLibrary: liked, liked });
    if (liked) {
      addLikedTrack(item);
      syncLibraryItem(item, true);
    } else {
      rememberLikedRemoval(item.id);
      removeLikedTracks([item.id]);
      syncLibraryItem(item, false);
    }
    refreshVisibleDataAfterMutation();
    throw error;
  }
  refreshVisibleDataAfterMutation();
}

async function setArtistFollow(item, subscribe) {
  const artist = await resolveArtistForMutation(item);
  const channelId = artistChannelId(artist);
  if (!channelId) throw new Error("Could not find a YouTube Music channel for this artist.");
  if (artist.subscribed === Boolean(subscribe)) {
    applyArtistFollowState(artist, subscribe);
    refreshVisibleDataAfterMutation();
    toast(`${subscribe ? "Already following" : "Already unfollowed"} ${artist.title}.`);
    return;
  }
  const result = await window.metro.subscribeChannel({
    channelId,
    browseId: artist.browseId || artist.id || null,
    subscribe,
    params: artist.subscribeParams || "EgIIAhgA"
  });
  if (result?.ok === false) throw new Error(`Artist ${subscribe ? "follow" : "unfollow"} was not accepted by YouTube Music.`);
  artist.channelId = channelId;
  applyArtistFollowState(artist, subscribe);
  toast(`${subscribe ? "Following" : "Unfollowed"} ${artist.title}.`);
  refreshVisibleDataAfterMutation();
}

async function startRadioForItem(item) {
  if (isTrackItem(item)) {
    await playTrackFromContext(item, [item], queueSource("radio", `${item.title || "Song"} radio`));
    return;
  }
  if (isPlayableBrowseItem(item)) {
    await playOrQueueCollection(item, true);
  }
}

function closePlaylistModal() {
  state.playlistTarget = null;
  els.playlistModal.classList.add("hidden");
  els.playlistModalList.innerHTML = "";
  els.playlistCreateInput.value = "";
}

function closePlaylistAddModal() {
  els.playlistAddModal.classList.add("hidden");
  els.playlistAddModalStatus.textContent = "Search YouTube Music and add tracks to this playlist.";
  els.playlistAddSearchInput.value = "";
  els.playlistAddResults.innerHTML = "";
  els.playlistAddResults._items = [];
}

function playlistAddRowsHtml(items) {
  const existingIds = new Set(playlistEditableTracks().map((track) => track.id).filter(Boolean));
  return (items || []).map((item, index) => {
    const alreadyAdded = existingIds.has(item.id);
    return `
      <div class="playlist-add-row" data-index="${index}">
        <button class="playlist-add-main" data-playlist-add-play="${index}" type="button">
          <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
          <span>
            <span class="title">${escapeText(item.title || "Untitled")}</span>
            <span class="subtitle">${escapeText(item.subtitle || item.artist || "YouTube Music")}</span>
          </span>
        </button>
        <span class="playlist-add-duration">${escapeText(item.duration || "")}</span>
        <button class="secondary" data-playlist-add-track="${index}" type="button" ${alreadyAdded ? "disabled" : ""}>
          ${alreadyAdded ? "Added" : "Add"}
        </button>
      </div>
    `;
  }).join("");
}

async function openPlaylistAddModal() {
  if (!isPlaylistCollection()) return;
  const playlistId = activeCollectionPlaylistId();
  if (!playlistId) return;
  els.playlistAddModal.classList.remove("hidden");
  els.playlistAddModalStatus.textContent = `Add songs to "${state.collectionResult?.header?.title || state.collectionFallback?.title || "playlist"}".`;
  els.playlistAddResults.innerHTML = `<p class="status">Search for songs to add.</p>`;
  els.playlistAddResults._items = [];
  window.setTimeout(() => els.playlistAddSearchInput.focus(), 0);
}

async function searchPlaylistAddSongs(query) {
  const needle = String(query || "").trim();
  if (!needle) return;
  els.playlistAddModalStatus.textContent = `Searching "${needle}"...`;
  els.playlistAddResults.innerHTML = `<p class="status">Searching songs...</p>`;
  try {
    const result = await window.metro.search(needle);
    const tracks = uniqueTracks(tracksFromResult(asPageResult(result))).slice(0, 25);
    els.playlistAddResults._items = tracks;
    els.playlistAddModalStatus.textContent = tracks.length
      ? `${tracks.length} song${tracks.length === 1 ? "" : "s"} found.`
      : "No songs found.";
    els.playlistAddResults.innerHTML = tracks.length
      ? playlistAddRowsHtml(tracks)
      : `<p class="status">No song results for "${escapeText(needle)}".</p>`;
  } catch (error) {
    els.playlistAddModalStatus.textContent = "Search failed.";
    els.playlistAddResults.innerHTML = `<p class="status">${escapeText(error.message || "Search failed.")}</p>`;
  }
}

async function addPlaylistSearchTrack(item, button) {
  const playlistId = activeCollectionPlaylistId();
  if (!playlistId || !isTrackItem(item)) return;
  button.disabled = true;
  button.textContent = "Adding";
  try {
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    await window.metro.addToPlaylist({
      playlistId,
      videoId: item.id
    });
    toast(`Added to playlist: ${item.title}`);
    button.textContent = "Added";
    await refreshCurrentCollectionStatus("Syncing added song...");
    els.playlistAddResults.innerHTML = playlistAddRowsHtml(els.playlistAddResults._items || []);
  } catch (error) {
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Add to playlist failed." });
    enqueueSyncAction("playlist-add", { playlistId, videoId: item.id }, `Add to playlist: ${item.title || "Song"}`);
    button.disabled = false;
    button.textContent = "Add";
    toast(error.message || "Add to playlist failed.", true);
  }
}

function playlistItemsFromResult(result) {
  result = asPageResult(result);
  return uniqueBrowseItems([...(result?.playlists || []), ...(result?.items || [])])
    .filter((item) => item.type === "playlist");
}

async function openPlaylistModal(track) {
  if (!isTrackItem(track)) return;
  state.playlistTarget = track;
  els.playlistModal.classList.remove("hidden");
  els.playlistModalStatus.textContent = `Choose a playlist for "${track.title}".`;
  els.playlistModalList.innerHTML = `<p class="status">Loading playlists...</p>`;
  try {
    const result = await window.metro.savedPlaylists();
    const playlists = playlistItemsFromResult(result);
    if (!playlists.length) {
      els.playlistModalList.innerHTML = `<p class="status">No saved playlists loaded. Create a new playlist below.</p>`;
      return;
    }
    els.playlistModalList.innerHTML = playlists.map((item, index) => `
      <button class="playlist-choice" data-playlist-choice="${index}" type="button">
        <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
        <span>
          <strong>${escapeText(item.title)}</strong>
          <small>${escapeText(item.subtitle || "Playlist")}</small>
        </span>
      </button>
    `).join("");
    els.playlistModalList._items = playlists;
  } catch (error) {
    els.playlistModalStatus.textContent = "Playlists failed.";
    els.playlistModalList.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
  }
}

function normalizedPlaylistId(value) {
  return String(value || "").replace(/^VL/, "");
}

async function saveLibraryToken(item, token, label) {
  if (!token) return;
  await window.metro.feedback({ tokens: [token] });
  if (label === "saved") {
    item.inLibrary = true;
    if (item.id) patchTrackState(item.id, { inLibrary: true });
    syncLibraryItem(item, true);
    toast(`Saved: ${item.title}`);
  } else {
    item.inLibrary = false;
    if (item.id) patchTrackState(item.id, { inLibrary: false });
    syncLibraryItem(item, false);
    toast(`Removed: ${item.title}`);
  }
  if (state.collectionActionItem === item && state.collectionResult?.header) {
    state.collectionResult.header.inLibrary = item.inLibrary;
    state.collectionResult.header.libraryAddToken = item.libraryAddToken;
    state.collectionResult.header.libraryRemoveToken = item.libraryRemoveToken;
    renderCollection(state.collectionResult, state.collectionFallback || {});
  }
  refreshVisibleDataAfterMutation();
}

async function playOrQueueCollection(item, playFirst) {
  await loadBrowse(item);
  const tracks = collectionTracksFromActiveView();
  const source = els.collectionResults.querySelector(".collection-tracks")?._queueSource || queueSource("collection", item.title || "Collection");
  if (tracks.length) await addToQueue(tracks, playFirst, source);
}

async function runMoreAction(action, item) {
  if (!item) return;
  const contextItems = state.moreContextItems?.length ? state.moreContextItems : [item];
  const source = state.moreSource || null;
  if (action === "play") {
    if (isTrackItem(item)) await playTrackFromContext(item, contextItems, source);
    else if (isPlayableBrowseItem(item)) await playOrQueueCollection(item, true);
    return;
  }
  if (action === "play-next") {
    await playNext(item);
    return;
  }
  if (action === "radio") {
    await startRadioForItem(item);
    return;
  }
  if (action === "share") {
    if (item.type === "artist" || item.kind === "artist") await shareArtist(item);
    else await shareTrack(item);
    return;
  }
  if (action === "like") {
    await setTrackLike(item, true);
    return;
  }
  if (action === "unlike") {
    await setTrackLike(item, false);
    return;
  }
  if (action === "queue") {
    if (isTrackItem(item)) await addToQueue(item, false);
    else if (isPlayableBrowseItem(item)) await playOrQueueCollection(item, false);
    return;
  }
  if (action === "cache-offline") {
    await cacheTrackOffline(item);
    return;
  }
  if (action === "remove-offline") {
    await removeTrackOffline(item);
    return;
  }
  if (action === "artist") {
    await openArtist(primaryArtistFromItem(item));
    return;
  }
  if (action === "album") {
    const album = albumFromItem(item);
    if (album?.browseId) await loadCollection(album);
    return;
  }
  if (action === "save-library") {
    await saveLibraryToken(item, item.libraryAddToken, "saved");
    return;
  }
  if (action === "remove-library") {
    await saveLibraryToken(item, item.libraryRemoveToken, "removed");
    return;
  }
  if (action === "follow") {
    await setArtistFollow(item, true);
    return;
  }
  if (action === "unfollow") {
    await setArtistFollow(item, false);
    return;
  }
  if (action === "playlist") {
    await openPlaylistModal(item);
    return;
  }
  if (action === "details") {
    const artist = allArtistLabel(item, item.subtitle || "YouTube Music");
    const album = item.album?.title ? ` • ${item.album.title}` : "";
    toast(`${item.title || "Item"} • ${artist}${album}${item.duration ? ` • ${item.duration}` : ""}`);
    return;
  }
  if (action === "remove-queue") {
    const index = state.queue.findIndex((entry) => entry === item || entry.id === item.id);
    if (index >= 0) await removeQueueItem(index);
    return;
  }
  if (action === "remove-history") {
    await removeHistoryTrack(item, { disabled: false, textContent: "" });
    return;
  }
  if (action === "remove-playlist") {
    const playlistId = activeCollectionPlaylistId();
    if (!playlistId || !item.setVideoId) return;
    await window.metro.removeFromPlaylist({ playlistId, videoId: item.id, setVideoId: item.setVideoId });
    state.collectionResult.tracks = tracksFromResult(state.collectionResult).filter((track) => track !== item && track.setVideoId !== item.setVideoId);
    renderCollection(state.collectionResult, state.collectionFallback || {});
    toast(`Removed from playlist: ${item.title}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function beginPlaybackRequest(track) {
  state.playbackRequestId += 1;
  state.playbackRecovery = false;
  if (track?.id) clearPlaybackFailure(track);
  return state.playbackRequestId;
}

function isCurrentPlaybackRequest(requestId, track = null) {
  if (requestId !== state.playbackRequestId) return false;
  return !track?.id || state.currentTrack?.id === track.id;
}

function isInterruptedPlaybackError(error) {
  const name = String(error?.name || "");
  const message = String(error?.message || error || "").toLowerCase();
  return name === "AbortError" ||
    message.includes("interrupted") ||
    message.includes("aborted") ||
    message.includes("new load request") ||
    message.includes("pause()") ||
    message.includes("src attribute");
}

function markPlaybackFailure(track, reason = "") {
  if (!track?.id) return 0;
  const displayReason = playbackFailureMessage(reason || "Playback failed.");
  const count = (state.playbackFailures.get(track.id) || 0) + 1;
  state.playbackFailures.set(track.id, count);
  if (count >= state.playbackRetryLimit) state.playbackFailedIds.add(track.id);
  state.playbackFailureReasons.set(track.id, displayReason);
  patchTrackState(track.id, { playbackFailed: true, playbackFailureReason: displayReason });
  renderQueue();
  if (state.settings.debugLogs) console.warn("Playback failure", { id: track.id, count, reason });
  return count;
}

function clearPlaybackFailure(track) {
  if (!track?.id) return;
  state.playbackFailures.delete(track.id);
  state.playbackFailedIds.delete(track.id);
  state.playbackFailureReasons.delete(track.id);
  patchTrackState(track.id, { playbackFailed: false, playbackFailureReason: "" });
}

function nextRecoverableQueueIndex() {
  const current = currentQueueIndex();
  const start = current >= 0 ? current + 1 : 0;
  for (let offset = 0; offset < state.queue.length; offset += 1) {
    const index = (start + offset) % state.queue.length;
    const item = state.queue[index];
    if (!item?.id || item.id === state.currentTrack?.id) continue;
    if (state.playbackFailedIds.has(item.id)) continue;
    if (state.settings.offlineMode && !isOfflineCached(item.id) && !item.offlineCached && !item.cached) continue;
    return index;
  }
  return -1;
}

async function recoverPlaybackFailure(track, reason = "Playback failed.") {
  if (state.playbackRecovery) return;
  const displayReason = playbackFailureMessage(reason);
  markPlaybackFailure(track, displayReason);
  state.playbackRecovery = true;
  state.playing = false;
  setPlaybackModeLabel("Skipping");
  try {
    await maybeAutoLoadMoreQueue();
    let nextIndex = nextRecoverableQueueIndex();
    if (nextIndex < 0 && await appendSmartQueueFromTrack(track)) {
      nextIndex = nextRecoverableQueueIndex();
    }
    if (nextIndex >= 0) {
      const nextTrack = state.queue[nextIndex];
      toast(`Skipped unavailable track: ${track?.title || "Unknown"}.`, true);
      state.playbackRecovery = false;
      await playTrack(nextTrack);
      return;
    }
    toast(displayReason, true);
    state.playing = false;
    state.playbackMode = "idle";
    renderNow();
  } finally {
    state.playbackRecovery = false;
  }
}

async function cachedTrackForPlayback(track) {
  if (!track?.id || !window.metro?.cacheGet) return null;
  if (!isOfflineCached(track.id) && !track.offlineCached && !track.cached) return null;
  const cached = await window.metro.cacheGet(track.id);
  if (cached) return cached;
  await refreshOfflineCache({ render: currentVisibleViewId() === "libraryView" });
  return null;
}

function offlineStreamUrl(cachedTrack) {
  const streamUrl = String(cachedTrack?.streamUrl || "");
  if (streamUrl.startsWith("/")) return `${window.location.origin}${streamUrl}`;
  return streamUrl || cachedTrack?.fileUrl || "";
}

async function invalidateOfflineCopy(track, reason) {
  if (!track?.id) return;
  setDownloadFailure(track.id, reason || "Offline copy could not be played. Download it again.");
  patchTrackState(track.id, { offlineCached: false, cached: false });
  try {
    await window.metro?.cacheRemove?.(track.id);
  } catch {
    // The stale local state is still cleared even if deleting the file fails.
  }
  await refreshOfflineCache({ render: true, silent: true });
}

async function playOfflineCachedTrack(track, cachedTrack, requestId = state.playbackRequestId, options = {}) {
  if (!isCurrentPlaybackRequest(requestId, track)) return false;
  const sourceUrl = offlineStreamUrl(cachedTrack);
  if (!sourceUrl) throw new Error("Offline copy has no playable local URL.");

  stopEmbedPlayer();
  const mergedTrack = {
    ...track,
    ...cachedTrack,
    offlineCached: true,
    cached: true
  };
  state.currentTrack = mergedTrack;
  state.playbackMode = "offline";
  setPlaybackModeLabel("Offline");
  els.audio.removeAttribute("crossorigin");
  els.audio.dataset.playbackRequestId = String(requestId);
  els.audio.src = sourceUrl;
  await applySelectedAudioOutput();
  await applyAudioStartTime(options.startTime);
  try {
    await els.audio.play();
  } catch (error) {
    if (!isCurrentPlaybackRequest(requestId, track) || isInterruptedPlaybackError(error)) return false;
    throw error;
  }
  if (!isCurrentPlaybackRequest(requestId, track)) return false;
  clearPlaybackFailure(mergedTrack);
  state.restoredPlaybackTime = 0;
  state.playing = true;
  renderNow();
  toast(`Using offline version: ${mergedTrack.title}`);
  maybeNotifyTrack(mergedTrack);
  loadLyricsForTrack(mergedTrack);
  return true;
}

async function playTrack(track, options = {}) {
  if (!track?.id) return;
  if (blockPlaybackForGame()) return;
  if (!options.streamRetry) delete els.audio.dataset.streamErrorRetry;
  const trackChanged = String(state.currentTrack?.id || "") !== String(track.id || "");
  const requestId = beginPlaybackRequest(track);
  state.currentTrack = track;
  if (trackChanged) {
    state.lyrics = null;
    state.activeLyricIndex = -1;
    state.lyricsPlaybackSignature = "";
    state.focusLyricsPlaybackSignature = "";
  }
  state.crossfadeTriggeredId = "";
  if (!options.streamRetry) rememberQueueHistory(track);
  state.currentIndex = state.queue.findIndex((item) => item.id === track.id);
  if (state.currentIndex === -1) {
    if (state.settings.queueLock) {
      queueMutationBlocked("Queue lock is on. Unlock it before playing songs outside the current queue.");
      return false;
    }
    state.queue.unshift(track);
    state.currentIndex = 0;
    await persistQueue();
  }
  renderNow();
  followCurrentQueueTrack();
  followCurrentTrackInCollection();
  await maybeAutoLoadMoreQueue();
  if (!isCurrentPlaybackRequest(requestId, track)) return false;
  toast(`Resolving stream: ${track.title}`);
  els.lyricsTitle.textContent = track.title || "Lyrics";
  els.lyricsStatus.textContent = "Waiting for playback...";
  els.lyricsList.innerHTML = "";

  if (track.local) {
    try {
      stopEmbedPlayer();
      state.playbackMode = "local";
      setPlaybackModeLabel(track.codec ? `Local · ${track.codec}` : "Local");
      els.audio.removeAttribute("crossorigin");
      els.audio.dataset.playbackRequestId = String(requestId);
      els.audio.src = `${window.location.origin}/local-music-audio/${encodeURIComponent(track.id)}`;
      await applySelectedAudioOutput();
      await applyAudioStartTime(options.startTime);
      await els.audio.play();
      if (!isCurrentPlaybackRequest(requestId, track)) return false;
      state.playing = true;
      state.restoredPlaybackTime = 0;
      renderNow();
      maybeNotifyTrack(track);
      loadLyricsForTrack(track);
      return true;
    } catch (error) {
      if (!isCurrentPlaybackRequest(requestId, track) || isInterruptedPlaybackError(error)) return false;
      await recoverPlaybackFailure(track, error?.message || "Local audio could not be played.");
      return false;
    }
  }

  // Check if we should force offline mode
  const offlineOnly = isOfflineQueueSource() || track.offlineOnly || state.settings.offlineMode;
  if (state.settings.offlineMode) {
    setPlaybackModeLabel("Offline mode");
  }

  try {
    const cachedTrack = await cachedTrackForPlayback(track);
    if (!isCurrentPlaybackRequest(requestId, track)) return false;
    if (cachedTrack?.streamUrl) {
      if (await playOfflineCachedTrack(track, cachedTrack, requestId, options)) return true;
      return false;
    }
  } catch (error) {
    if (!isCurrentPlaybackRequest(requestId, track) || isInterruptedPlaybackError(error)) return false;
    if (state.settings.debugLogs) console.warn("Offline playback failed", error);
    await invalidateOfflineCopy(track, error?.message || "Offline copy could not be played. Download it again.");
    if (!offlineOnly) toast("Offline copy failed; resolving online stream.", true);
  }

  if (offlineOnly) {
    await recoverPlaybackFailure(track, state.settings.offlineMode ? "Offline mode: song is not downloaded." : "Offline copy is missing or could not be played.");
    return;
  }

  let lastError = null;
  for (let attempt = 0; attempt <= state.playbackRetryLimit; attempt += 1) {
    if (!isCurrentPlaybackRequest(requestId, track)) return false;
    try {
      stopEmbedPlayer();
      state.playbackMode = "direct";
      setPlaybackModeLabel(attempt ? "Retrying" : "Resolving");
      const playback = await window.metro.playback({
        videoId: track.id,
        playlistId: track.playlistId,
        quality: state.settings.quality
      });
      if (!isCurrentPlaybackRequest(requestId, track)) return false;
      if (playback?.details?.lengthSeconds) track.lengthSeconds = playback.details.lengthSeconds;
      if (playback?.details?.author) {
        track.uploader = playback.details.author;
        if (!track.artist && !track.artists?.length) track.artist = playback.details.author;
      }
      if (playback?.mode === "webview" || !playback?.streamUrl) {
        lastError = new Error(playbackFailureMessage(playback?.reason || "Direct audio playback failed."));
        break;
      }
      rememberPlaybackStream(track.id, playback);
      track.playbackBitrate = Number(playback?.bitrate || playback?.format?.bitrate || 0);
      els.audio.crossOrigin = "anonymous";
      els.audio.dataset.playbackRequestId = String(requestId);
      els.audio.src = playback.streamUrl;
      await applySelectedAudioOutput();
      await applyAudioStartTime(options.startTime);
      try {
        await els.audio.play();
      } catch (error) {
        if (!isCurrentPlaybackRequest(requestId, track) || isInterruptedPlaybackError(error)) return false;
        throw error;
      }
      if (!isCurrentPlaybackRequest(requestId, track)) return false;
      clearPlaybackFailure(track);
      state.restoredPlaybackTime = 0;
      state.playing = true;
      delete els.audio.dataset.streamErrorRetry;
      setPlaybackModeLabel("Playing");
      renderNow();
      toast(`Playing: ${track.title}`);
      maybeNotifyTrack(track);
      loadLyricsForTrack(track);
      return;
    } catch (error) {
      if (!isCurrentPlaybackRequest(requestId, track) || isInterruptedPlaybackError(error)) return false;
      lastError = error;
      if (attempt < state.playbackRetryLimit) await sleep(350);
    }
  }

  if (!isCurrentPlaybackRequest(requestId, track)) return false;
  const reason = playbackFailureMessage(lastError?.message || "Direct audio failed.");
  if (webFallbackAllowed()) {
    startEmbedPlayback(track, reason);
    return;
  }
  await recoverPlaybackFailure(track, reason);
}

async function loadLiked() {
  switchView("liked");
  state.likedSelectedIds.clear();
  if (!state.auth?.signedIn) {
    setSyncState("liked", { status: "local", pending: 0, error: "" });
    els.likedStatus.textContent = "Sign in to load Liked Songs.";
    els.likedResults.innerHTML = `<p class="status">Guest playback remains available from Home, Search, local playlists and Downloads.</p>`;
    renderSyncPanels();
    return;
  }
  setSyncState("liked", { status: "pending", pending: 1, error: "" });
  els.likedStatus.textContent = "Loading liked songs...";
  els.likedResults.innerHTML = skeletonHtml("rows", 9);
  try {
    const result = await window.metro.likedSongs();
    state.likedData = mergeLikedData(result);
    setSyncState("liked", { status: "synced", pending: 0, error: "", updatedAt: new Date().toISOString() });
    renderLiked(state.likedData);
    toast("Liked songs loaded.");
  } catch (error) {
    setSyncState("liked", { status: "error", pending: 0, error: error.message || "Liked songs failed." });
    els.likedStatus.textContent = "Liked songs failed.";
    els.likedResults.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
    toast("Liked songs failed.", true);
  }
}

function removeLikedTracks(ids) {
  const removeIds = new Set(ids);
  for (const id of removeIds) state.likedTrackIds.delete(id);
  state.likedStateHydrated = true;
  if (!state.likedData) return;
  state.likedData.tracks = (state.likedData.tracks || []).filter((track) => !removeIds.has(track.id));
  state.likedData.sections = (state.likedData.sections || []).map((section) => ({
    ...section,
    tracks: (section.tracks || []).filter((track) => !removeIds.has(track.id))
  }));
  state.likedSelectedIds.clear();
}

async function toggleArtistFollow() {
  const item = state.artistActionItem;
  if (!item) return;
  els.artistFollowButton.disabled = true;
  setIconButtonLabel(els.artistFollowButton, "Checking follow state");
  try {
    const artist = await resolveArtistForMutation(item);
    const channelId = artistChannelId(artist);
    if (!channelId) throw new Error("Could not find a YouTube Music channel for this artist.");
    const nextSubscribed = !artist.subscribed;
    setIconButtonLabel(els.artistFollowButton, nextSubscribed ? "Following" : "Unfollowing");
    const result = await window.metro.subscribeChannel({
      channelId,
      browseId: artist.browseId || artist.id || null,
      subscribe: nextSubscribed,
      params: artist.subscribeParams || "EgIIAhgA"
    });
    if (result?.ok === false) throw new Error(`Artist ${nextSubscribed ? "follow" : "unfollow"} was not accepted by YouTube Music.`);
    artist.channelId = channelId;
    applyArtistFollowState(artist, nextSubscribed);
    renderArtist(state.artistResult, state.artistFallback || {});
    if (currentVisibleViewId() === "libraryView" && state.libraryData) renderLibrary(state.libraryData);
    toast(`${nextSubscribed ? "Following" : "Unfollowed"} ${artist.title}.`);
  } catch (error) {
    toast(error.message || "Artist follow failed.", true);
    renderArtist(state.artistResult, state.artistFallback || {});
  }
}

async function loadLibrary() {
  switchView("library");
  if (!state.auth?.signedIn) {
    await refreshOfflineCache();
    els.libraryStatus.textContent = "Guest library";
    els.librarySync?.replaceChildren();
    els.libraryHighlights?.replaceChildren();
    els.librarySections.innerHTML = `<p class="status">Sign in to sync your YouTube Music library. ${state.offlineCache?.tracks?.length || 0} downloaded song(s) remain available.</p>`;
    els.libraryResults.classList.add("hidden");
    return;
  }
  els.libraryStatus.textContent = "Loading your saved music...";
  els.librarySync?.replaceChildren();
  els.libraryHighlights?.replaceChildren();
  els.librarySections.innerHTML = skeletonHtml("cards", 8);
  els.libraryResults.classList.add("hidden");
  try {
    const [libraryRequest, likedRequest] = await Promise.allSettled([
      window.metro.libraryOverview(),
      window.metro.likedSongs()
    ]);
    if (likedRequest.status === "fulfilled") {
      state.likedData = mergeLikedData(likedRequest.value);
      setSyncState("liked", { status: "synced", pending: 0, error: "", updatedAt: new Date().toISOString() });
    } else {
      setSyncState("liked", {
        status: "error",
        pending: 0,
        error: likedRequest.reason?.message || "Liked Songs sync failed."
      });
    }
    if (libraryRequest.status === "rejected") throw libraryRequest.reason;
    await refreshOfflineCache();
    renderLibrary(libraryRequest.value);
    toast(likedRequest.status === "fulfilled"
      ? "Library and Liked Songs synced."
      : "Library loaded; Liked Songs kept from the last successful sync.", likedRequest.status === "rejected");
  } catch (error) {
    await refreshOfflineCache();
    if (state.offlineCache?.tracks?.length) {
      await loadDownloaded();
      els.downloadedStatus.textContent = `Offline mode: ${state.offlineCache.tracks.length} cached song${state.offlineCache.tracks.length === 1 ? "" : "s"} available.`;
      toast("Library failed; showing offline downloads.", true);
      return;
    }
    els.libraryStatus.textContent = "Library failed.";
    els.librarySections.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
    toast("Library failed.", true);
  }
}

function openLibrary() {
  if (!state.settings.libraryAutoRefresh && state.libraryData) {
    switchView("library");
    renderLibrary(state.libraryData);
    toast("Library opened.");
    return Promise.resolve();
  }
  return loadLibrary();
}

async function loadPlaylists() {
  switchView("playlists");
  renderPlaylistsPage();
  if (!state.auth?.signedIn) {
    setSyncState("playlists", { status: "local", pending: 0, error: "" });
    renderPlaylistsPage();
    renderSyncPanels();
    return;
  }
  setSyncState("playlists", { status: "pending", pending: 1, error: "" });
  els.playlistResults.innerHTML = skeletonHtml("cards", 8);
  try {
    const result = await window.metro.savedPlaylists();
    state.playlistsData = result;
    setSyncState("playlists", { status: "synced", pending: 0, error: "", updatedAt: new Date().toISOString() });
    renderSyncPanels();
    renderPlaylistsPage();
  } catch (error) {
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Playlists failed." });
    els.playlistResults.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
  }
}

function mergePageResult(current, next) {
  current = asPageResult(current);
  next = asPageResult(next);
  return {
    header: current.header || next.header,
    tracks: uniqueTracks([...(current.tracks || []), ...(next.tracks || [])]),
    items: uniqueBrowseItems([...(current.items || []), ...(next.items || [])]),
    playlists: uniqueBrowseItems([...(current.playlists || []), ...(next.playlists || [])]),
    sections: [...(current.sections || []), ...(next.sections || [])],
    continuations: next.continuations || [],
    chips: current.chips || next.chips || [],
    relatedArtists: uniqueBrowseItems([...(current.relatedArtists || []), ...(next.relatedArtists || [])]),
    pagesLoaded: (current.pagesLoaded || 1) + 1,
    meta: next.meta || current.meta || {}
  };
}

function parseYouTubeMusicUrl(value) {
  const input = String(value || "").trim();
  if (!/^https?:\/\//i.test(input)) return null;
  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (!["music.youtube.com", "youtube.com", "m.youtube.com", "youtu.be"].includes(host)) return null;
    const videoId = host === "youtu.be"
      ? url.pathname.split("/").filter(Boolean)[0] || ""
      : url.searchParams.get("v") || "";
    const playlistId = url.searchParams.get("list") || "";
    if (!videoId && !playlistId) return null;
    return { videoId, playlistId };
  } catch {
    return null;
  }
}

async function openYouTubeMusicUrl(value) {
  const target = parseYouTubeMusicUrl(value);
  if (!target) return false;
  switchView("search");
  els.searchResults.innerHTML = `<p class="status">Resolving YouTube Music link...</p>`;
  els.searchStatus.textContent = "Resolving shared link.";
  try {
    let result;
    if (target.videoId) {
      result = await window.metro.queue({ videoId: target.videoId, playlistId: target.playlistId || undefined });
    } else {
      result = await window.metro.playlist(target.playlistId);
    }
    let tracks = tracksFromResult(result);
    if (!tracks.length && target.videoId) {
      tracks = [localPlaylistTrack({
        id: target.videoId,
        playlistId: target.playlistId,
        title: "YouTube Music link",
        subtitle: "Resolving metadata during playback"
      })];
    }
    if (!tracks.length) throw new Error("No playable songs were found at this link.");
    state.searchResult = asPageResult(result, { type: "search", title: "Shared link" });
    renderSearchResults(state.searchResult, "top");
    await addToQueue(tracks, true, queueSource("link", "Shared YouTube Music link"));
    return true;
  } catch (error) {
    els.searchResults.innerHTML = `<p class="status">${escapeText(error.message || "Could not open this link.")}</p>`;
    els.searchStatus.textContent = "Link could not be opened.";
    toast(error.message || "Could not open this link.", true);
    return true;
  }
}

async function doSearch(query, filter = state.searchFilter || "top") {
  switchView("search");
  state.searchQuery = query;
  state.searchHistory = [query, ...state.searchHistory.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 20);
  persistQueueMemory();
  state.searchFilter = filter;
  state.searchResult = null;
  renderSearchTabs(filter);
  els.searchLoadMoreButton.classList.add("hidden");
  els.searchResults.innerHTML = `<p class="status">Searching...</p>`;
  els.searchStatus.textContent = `Searching ${searchTabLabel(filter).toLowerCase()} for "${query}".`;
  toast("Searching...");
  try {
    const result = await window.metro.search({ query, filter });
    const tracks = tracksFromResult(result);
    state.searchResult = asPageResult(result, { type: "search", title: query });
    renderSearchResults(state.searchResult, filter);
    const itemCount = uniqueBrowseItems([...(state.searchResult.items || []), ...(state.searchResult.playlists || [])]).length;
    els.searchStatus.textContent = `${tracks.length + itemCount} ${searchTabLabel(filter).toLowerCase()} result(s) for "${query}".`;
    toast(`${tracks.length + itemCount} result(s).`);
  } catch (error) {
    els.searchResults.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
    els.searchStatus.textContent = "Search failed.";
    toast("Search failed.", true);
  }
}

async function loadMoreSearch() {
  const continuation = els.searchLoadMoreButton._continuation;
  if (!continuation?.token || !state.searchResult) return;
  els.searchLoadMoreButton.disabled = true;
  els.searchLoadMoreButton.textContent = "Loading...";
  try {
    const next = await window.metro.continue({
      token: continuation.token,
      endpoint: continuation.endpoint || "search"
    });
    state.searchResult = mergePageResult(state.searchResult, next);
    renderSearchResults(state.searchResult, state.searchFilter);
    toast("More search results loaded.");
  } catch (error) {
    toast(error.message || "Load more failed.", true);
  } finally {
    els.searchLoadMoreButton.disabled = false;
    els.searchLoadMoreButton.textContent = "Load more";
  }
}

async function loadDiscovery(view, container, loader, label) {
  switchView(view);
  container.innerHTML = skeletonHtml("cards", 10);
  toast(`Loading ${label}...`);
  try {
    const result = await loader();
    if (view === "moods") {
      container.classList.add("mood-photo-grid");
    } else {
      container.classList.remove("mood-photo-grid");
    }
    renderDiscovery(container, result);
    toast(`${label} loaded.`);
  } catch (error) {
    container.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
    toast(`${label} failed.`, true);
  }
}

function runLoadAction(type) {
  if (type === "home") return loadHome(state.homeParams, state.homeBrowseId);
  if (type === "explore") return loadDiscovery("explore", els.exploreResults, window.metro.explore, "Explore");
  if (type === "charts") return loadDiscovery("charts", els.chartsResults, window.metro.charts, "Charts");
  if (type === "new") return loadDiscovery("new", els.newResults, window.metro.newReleases, "New releases");
  if (type === "moods") return loadDiscovery("moods", els.moodsResults, window.metro.moods, "Moods");
  if (type === "games") return openGames();
  if (type === "liked") return loadLiked();
  if (type === "downloaded") return loadDownloaded();
  if (type === "library") return openLibrary();
  if (type === "library-refresh") return loadLibrary();
  if (type === "history") return loadHistory();
  if (type === "playlists") return loadPlaylists();
  return null;
}

function baseCommands(query) {
  const commands = [
    { title: "Home", subtitle: "Open home feed", action: () => loadHome(state.homeParams, state.homeBrowseId) },
    { title: "Search", subtitle: "Open search page", action: () => switchView("search") },
    { title: "Library", subtitle: "Open saved music", action: () => openLibrary() },
    { title: "Downloaded", subtitle: "Open offline songs", action: () => loadDownloaded() },
    { title: "Liked Songs", subtitle: "Open liked songs", action: () => loadLiked() },
    { title: "History", subtitle: "Open listening history", action: () => loadHistory() },
    { title: "Playlists", subtitle: "Open saved playlists", action: () => loadPlaylists() },
    { title: "Games", subtitle: "Open lyrics and music party games", action: () => openGames() },
    { title: "Settings", subtitle: "Open settings", action: () => { syncSettingsControls(); switchView("settings"); } },
    { title: "Show Queue", subtitle: "Open right queue panel", action: () => switchSidePanel("queue") },
    { title: "Show Lyrics", subtitle: "Open right lyrics panel", action: () => switchSidePanel("lyrics") },
    { title: state.settings.offlineMode ? "Offline Mode Off" : "Offline Mode On", subtitle: "Toggle downloaded-only playback", action: () => applyBooleanSetting("offlineMode", !state.settings.offlineMode) },
    { title: "Translate Lyrics", subtitle: "Translate current lyrics", action: () => els.lyricsTranslateButton?.click() },
    { title: state.playing ? "Pause" : "Play", subtitle: "Toggle playback", action: () => els.playButton.click() },
    { title: "Next Track", subtitle: "Skip forward", action: () => els.nextButton.click() },
    { title: "Previous Track", subtitle: "Go back", action: () => els.prevButton.click() }
  ];
  if (query.trim()) {
    commands.unshift({
      title: `Search "${query.trim()}"`,
      subtitle: "Search YouTube Music",
      action: () => {
        els.searchInput.value = query.trim();
        doSearch(query.trim(), state.searchFilter || "top");
      }
    });
  }
  for (const term of state.searchHistory.slice(0, 5)) {
    commands.push({
      title: term,
      subtitle: "Recent search",
      action: () => {
        els.searchInput.value = term;
        doSearch(term, state.searchFilter || "top");
      }
    });
  }
  return commands;
}

function commandLibraryItems() {
  const source = [
    ...(state.queue || []),
    ...(state.queueHistory || []),
    ...(state.offlineCache?.tracks || []),
    ...(state.libraryData?.songs || []),
    ...(state.libraryData?.playlists || []),
    ...(state.libraryData?.albums || []),
    ...(state.libraryData?.artists || [])
  ];
  return uniqueBrowseItems(source).slice(0, 80).map((item) => ({
    title: item.title || "Untitled",
    subtitle: item.subtitle || item.artist || item.type || "YouTube Music",
    thumbnail: item.thumbnail || "",
    action: () => {
      if (item.browseId) return loadBrowse(item);
      return playTrackFromContext(item, [item]);
    }
  }));
}

function buildCommandItems(query = "") {
  const needle = query.trim().toLowerCase();
  const all = [...baseCommands(query), ...commandLibraryItems()];
  if (!needle) return all.slice(0, 18);
  return all
    .filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(needle) || item.title.toLowerCase().startsWith("search "))
    .slice(0, 18);
}

function renderCommandPalette() {
  const query = els.commandInput.value || "";
  state.commandItems = buildCommandItems(query);
  if (!state.commandItems.length) {
    els.commandList.innerHTML = `<p class="status">No commands found.</p>`;
    return;
  }
  els.commandList.innerHTML = state.commandItems.map((item, index) => `
    <button class="command-item ${index === 0 ? "active" : ""}" data-command-index="${index}" type="button">
      <span class="mini" style="background-image:${thumbnailStyle(item)}"></span>
      <span>
        <strong>${escapeText(item.title)}</strong>
        <small>${escapeText(item.subtitle || "")}</small>
      </span>
    </button>
  `).join("");
}

function openCommandPalette() {
  state.commandOpen = true;
  els.commandPalette.classList.remove("hidden");
  els.commandInput.value = "";
  renderCommandPalette();
  requestAnimationFrame(() => els.commandInput.focus());
}

function closeCommandPalette() {
  state.commandOpen = false;
  els.commandPalette.classList.add("hidden");
}

async function runCommand(index) {
  const command = state.commandItems[index];
  if (!command) return;
  closeCommandPalette();
  await command.action();
}

async function loadBrowse(item) {
  if (!item?.browseId) return;
  if (item.type !== "album" && item.type !== "playlist") state.collectionRequestId += 1;
  if (item.type === "artist") {
    await loadArtist(item);
    return;
  }
  if (isPodcastItem(item)) {
    await loadPodcast(item);
    return;
  }
  if (item.type === "album" || item.type === "playlist") {
    await loadCollection(item);
    return;
  }
  switchView("browse");
  els.browseTitle.textContent = item.title || "Browse";
  els.browseStatus.textContent = "Loading...";
  els.browseResults.innerHTML = skeletonHtml("cards", 8);
  try {
    const result = await window.metro.browse({
      browseId: item.browseId,
      params: item.params || null,
      login: Boolean(state.auth?.signedIn)
    });
    renderDiscovery(els.browseResults, result);
    els.browseStatus.textContent = "";
  } catch (error) {
    els.browseResults.innerHTML = `<p class="status">${escapeText(error.message)}</p>`;
    els.browseStatus.textContent = "Failed";
  }
}

document.querySelectorAll(".nav").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    if (view === "home") return loadHome(state.homeParams, state.homeBrowseId);
    if (view === "explore") return loadDiscovery("explore", els.exploreResults, window.metro.explore, "Explore");
    if (view === "charts") return loadDiscovery("charts", els.chartsResults, window.metro.charts, "Charts");
    if (view === "new") return loadDiscovery("new", els.newResults, window.metro.newReleases, "New releases");
    if (view === "moods") return loadDiscovery("moods", els.moodsResults, window.metro.moods, "Moods");
    if (view === "games") return openGames();
    if (view === "liked") return loadLiked();
    if (view === "downloaded") return loadDownloaded();
    if (view === "localMusic") return loadLocalMusic();
    if (view === "library") return openLibrary();
    if (view === "history") return loadHistory();
    if (view === "playlists") return loadPlaylists();
    if (view === "search") renderSearchTabs(state.searchFilter);
    if (view === "settings") syncSettingsControls();
    switchView(view);
  });
});

document.querySelectorAll(".side-tab").forEach((button) => {
  button.addEventListener("click", () => switchSidePanel(button.dataset.sidePanel));
});

document.querySelectorAll("[data-load]").forEach((button) => {
  button.addEventListener("click", () => {
    runLoadAction(button.dataset.load);
  });
});

els.homeChips.addEventListener("click", (event) => {
  const chipButton = event.target.closest("[data-chip-index]");
  if (!chipButton) return;
  const chip = els.homeChips._items?.[Number(chipButton.dataset.chipIndex)];
  loadHome(chip?.params || null, chip?.browseId || "FEmusic_home");
});

els.libraryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-library-filter]");
  if (!button) return;
  state.libraryFilter = button.dataset.libraryFilter;
  renderLibrary();
});

els.librarySearchInput.addEventListener("input", () => {
  state.libraryQuery = els.librarySearchInput.value;
  renderLibrary();
});

els.librarySortSelect.addEventListener("change", () => {
  state.librarySort = els.librarySortSelect.value;
  renderLibrary();
});

els.librarySync?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-library-sync-refresh]");
  if (!button) return;
  const key = button.dataset.librarySyncRefresh;
  button.disabled = true;
  button.textContent = "Refreshing";
  try {
    if (key === "songs") await window.metro.likedSongs();
    else if (key === "playlists") await window.metro.savedPlaylists();
    await loadLibrary();
  } finally {
    button.disabled = false;
    button.textContent = "Refresh";
  }
});

els.likedSearchInput.addEventListener("input", () => {
  state.likedQuery = els.likedSearchInput.value;
  renderLiked();
});

els.likedFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-liked-filter]");
  if (!button) return;
  state.likedFilter = button.dataset.likedFilter;
  renderLiked();
});

els.downloadedSearchInput.addEventListener("input", () => {
  state.downloadedQuery = els.downloadedSearchInput.value;
  renderDownloaded();
});

els.downloadedFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-downloaded-filter]");
  if (!button) return;
  state.downloadedFilter = button.dataset.downloadedFilter;
  renderDownloaded();
});

els.downloadedSortSelect.addEventListener("change", () => {
  state.downloadedSort = els.downloadedSortSelect.value;
  renderDownloaded();
});

els.playlistsFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-playlists-filter]");
  if (!button) return;
  state.playlistsFilter = button.dataset.playlistsFilter;
  renderPlaylistsPage();
});

els.playlistsSearchInput?.addEventListener("input", () => {
  state.playlistsQuery = els.playlistsSearchInput.value;
  renderPlaylistsPage();
});

els.playlistsSortSelect?.addEventListener("change", () => {
  state.playlistsSort = els.playlistsSortSelect.value;
  renderPlaylistsPage();
});

els.searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = els.searchInput.value.trim();
  hideSearchSuggestions();
  if (query) {
    els.searchForm.classList.remove("is-submitting");
    void els.searchForm.offsetWidth;
    els.searchForm.classList.add("is-submitting");
    window.setTimeout(() => els.searchForm.classList.remove("is-submitting"), 560);
    if (!await openYouTubeMusicUrl(query)) {
      await doSearch(query, state.searchFilter || "top");
    }
  }
});

els.searchInput.addEventListener("input", queueSearchSuggestions);
els.searchInput.addEventListener("focus", queueSearchSuggestions);
els.recognitionHistoryButton?.addEventListener("click", toggleRecognitionHistory);
els.recognitionHistoryPanel?.addEventListener("click", async (event) => {
  const remove = event.target.closest("[data-recognition-remove]");
  const clear = event.target.closest("[data-recognition-clear]");
  const search = event.target.closest("[data-recognition-search]");
  if (remove) {
    musicRecognitionHistory = await window.metro.removeRecognitionHistory(remove.dataset.recognitionRemove);
    renderRecognitionHistory();
    return;
  }
  if (clear) {
    if (!window.confirm("Clear recognition history?")) return;
    musicRecognitionHistory = await window.metro.clearRecognitionHistory();
    renderRecognitionHistory();
    return;
  }
  if (search) {
    const item = musicRecognitionHistory.find((entry) => entry.id === search.dataset.recognitionSearch);
    if (!item) return;
    const query = [item.title, item.artist].filter(Boolean).join(" ");
    els.searchInput.value = query;
    hideRecognitionHistory();
    await doSearch(query, "top");
  }
});

els.searchSuggestions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-search-suggestion]");
  if (!button) return;
  const suggestion = els.searchSuggestions._items?.[Number(button.dataset.searchSuggestion)];
  if (!suggestion) return;
  els.searchInput.value = suggestion;
  hideSearchSuggestions();
  doSearch(suggestion, state.searchFilter || "top");
});

els.searchTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-search-filter]");
  if (!button) return;
  const filter = button.dataset.searchFilter;
  state.searchFilter = filter;
  renderSearchTabs(filter);
  const query = state.searchQuery || els.searchInput.value.trim();
  if (query) doSearch(query, filter);
});

els.searchFilterBar?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-search-option]");
  if (!button) return;
  const key = button.dataset.searchOption;
  state.searchFilters[key] = !state.searchFilters[key];
  renderSearchFilterControls();
  if (state.searchResult) renderSearchResults(state.searchResult, state.searchFilter);
});

els.artistPlayButton.addEventListener("click", async () => {
  els.artistPlayButton.disabled = true;
  try {
    const queue = await loadArtistPopularQueue(els.artistPlayButton);
    if (!queue.tracks.length) return;
    state.shuffleEnabled = false;
    resetShuffleOrder();
    renderPlaybackOptions();
    await addToQueue(queue.tracks, true, queue.source);
  } catch (error) {
    toast(error?.message || "Could not load all popular songs.", true);
  } finally {
    els.artistPlayButton.disabled = !(els.artistPlayButton._tracks || []).length;
  }
});

els.artistShuffleButton.addEventListener("click", async () => {
  els.artistShuffleButton.disabled = true;
  try {
    const queue = await loadArtistPopularQueue(els.artistShuffleButton);
    const shuffled = reshuffleArtistTracks(queue.tracks);
    if (!shuffled.length) return;
    state.shuffleEnabled = true;
    resetShuffleOrder();
    await addToQueue(shuffled, true, queue.source);
    ensureShuffleOrder({ renew: true });
    renderPlaybackOptions();
    schedulePlaybackSessionSave({ force: true });
  } catch (error) {
    toast(error?.message || "Could not shuffle all popular songs.", true);
  } finally {
    els.artistShuffleButton.disabled = !(els.artistShuffleButton._tracks || []).length;
  }
});

els.artistRadioButton.addEventListener("click", async () => {
  const item = state.artistActionItem;
  const endpointTrack = trackFromArtistEndpoint(item?.radioEndpoint, item || {});
  if (endpointTrack) {
    await playTrackFromContext(endpointTrack, [endpointTrack], queueSource("youtube", `${item?.title || "Artist"} radio`));
    return;
  }
  const tracks = els.artistShuffleButton._tracks || [];
  if (tracks.length) await addToQueue(shuffleTracks(tracks), true, els.artistShuffleButton._queueSource);
});

els.artistFollowButton.addEventListener("click", toggleArtistFollow);

els.podcastPlayButton.addEventListener("click", async () => {
  const tracks = els.podcastPlayButton._tracks || [];
  if (tracks.length) await addToQueue(tracks, true, els.podcastPlayButton._queueSource);
});

els.podcastShuffleButton.addEventListener("click", async () => {
  const tracks = els.podcastShuffleButton._tracks || [];
  if (tracks.length) await addToQueue(shuffleTracks(tracks), true, els.podcastShuffleButton._queueSource);
});

els.likedPlayButton.addEventListener("click", async () => {
  const tracks = els.likedPlayButton._tracks || [];
  if (tracks.length) await addToQueue(tracks, true, els.likedPlayButton._queueSource);
});

els.likedShuffleButton.addEventListener("click", async () => {
  const tracks = els.likedShuffleButton._tracks || [];
  if (tracks.length) await addToQueue(shuffleTracks(tracks), true, els.likedShuffleButton._queueSource);
});

els.likedDownloadButton.addEventListener("click", async () => {
  await cacheTracksOffline(els.likedDownloadButton._tracks || [], "Liked Songs", els.likedDownloadButton);
});

els.downloadedPlayButton.addEventListener("click", async () => {
  const tracks = els.downloadedPlayButton._tracks || [];
  if (tracks.length) await addToQueue(tracks, true, els.downloadedPlayButton._queueSource);
});

els.downloadedShuffleButton.addEventListener("click", async () => {
  const tracks = els.downloadedShuffleButton._tracks || [];
  if (tracks.length) await addToQueue(shuffleTracks(tracks), true, els.downloadedShuffleButton._queueSource);
});

els.downloadedClearButton.addEventListener("click", clearDownloadedSongs);


function setPlaylistCreateDialogOpen(open) {
  els.playlistCreateDialog?.classList.toggle("hidden", !open);
  els.playlistCreateFab?.classList.toggle("is-active", open);
  els.playlistCreateFab?.setAttribute("aria-expanded", String(open));
  if (open) {
    if (els.playlistCreateDestination) {
      els.playlistCreateDestination.value = state.auth?.signedIn ? "synced" : "local";
      els.playlistCreateDestination.querySelector('option[value="synced"]')?.toggleAttribute("disabled", !state.auth?.signedIn);
    }
    window.setTimeout(() => els.localPlaylistName?.focus(), 0);
  } else if (els.localPlaylistName) {
    els.localPlaylistName.value = "";
  }
}

async function createPlaylistFromDialog(useQueue = false) {
  const name = els.localPlaylistName?.value.trim() || (useQueue ? `Queue ${new Date().toLocaleDateString()}` : "");
  if (!name) throw new Error("Enter a playlist name.");
  const tracks = useQueue ? uniqueTracks(state.queue) : [];
  if (els.playlistCreateDestination?.value === "synced") {
    if (!state.auth?.signedIn) throw new Error("Sign in to create a synced playlist.");
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    const result = await window.metro.createPlaylist({ title: name, videoIds: tracks.map((track) => track.id) });
    toast(result?.playlistId ? `Created synced playlist: ${name}` : "Playlist created.");
    setPlaylistCreateDialogOpen(false);
    await loadPlaylists();
    return;
  }
  const playlist = createLocalPlaylist(name, tracks);
  toast(useQueue
    ? `Saved ${playlist.tracks.length} songs to ${playlist.name}.`
    : `Created local playlist: ${playlist.name}`);
  setPlaylistCreateDialogOpen(false);
  renderPlaylistsPage();
}

els.playlistCreateFab?.addEventListener("click", () => setPlaylistCreateDialogOpen(true));
els.playlistCreateDialogClose?.addEventListener("click", () => setPlaylistCreateDialogOpen(false));
els.playlistCreateDialog?.addEventListener("click", (event) => {
  if (event.target === els.playlistCreateDialog) setPlaylistCreateDialogOpen(false);
});

els.localPlaylistCreateForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await createPlaylistFromDialog(false);
  } catch (error) {
    toast(error.message || "Could not create local playlist.", true);
  }
});
els.localPlaylistFromQueue?.addEventListener("click", async () => {
  try {
    await createPlaylistFromDialog(true);
  } catch (error) {
    toast(error.message || "Could not save the queue.", true);
  }
});
els.localPlaylistsImport?.addEventListener("click", () => els.localPlaylistsFile?.click());
els.localPlaylistsFile?.addEventListener("change", async () => {
  const file = els.localPlaylistsFile.files?.[0];
  els.localPlaylistsFile.value = "";
  if (!file) return;
  try {
    const count = await importLocalPlaylistFile(file);
    toast(`Imported ${count} local playlist${count === 1 ? "" : "s"}.`);
  } catch (error) {
    toast(error.message || "Playlist import failed.", true);
  }
});
els.localPlaylistsExport?.addEventListener("click", () => {
  exportLocalPlaylists().catch((error) => toast(error.message || "Playlist export failed.", true));
});
els.localPlaylistResults?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-local-action]");
  const row = button?.closest("[data-local-playlist]");
  const playlist = state.localPlaylists.find((item) => item.id === row?.dataset.localPlaylist);
  if (!button || !playlist) return;
  const action = button.dataset.localAction;
  if (action === "play") {
    await addToQueue(playlist.tracks, true, queueSource("local-playlist", playlist.name));
  } else if (action === "queue") {
    await addToQueue(playlist.tracks, false, queueSource("local-playlist", playlist.name));
    toast(`Added ${playlist.tracks.length} songs to the queue.`);
  } else if (action === "replace") {
    playlist.tracks = uniqueTracks(state.queue.map(localPlaylistTrack).filter(Boolean));
    playlist.updatedAt = new Date().toISOString();
    saveLocalPlaylists();
    toast(`Updated ${playlist.name} from the current queue.`);
  } else if (action === "delete" && window.confirm(`Delete local playlist "${playlist.name}"?`)) {
    state.localPlaylists = state.localPlaylists.filter((item) => item.id !== playlist.id);
    saveLocalPlaylists();
    toast(`Deleted ${playlist.name}.`);
  }
});

const SETTINGS_CATEGORY_BY_TITLE = {
  Layout: "general",
  Shortcuts: "general",
  Advanced: "general",
  Reset: "general",
  Lyrics: "lyrics",
  Playback: "playback",
  "Audio Processing (DSP)": "playback",
  "Playback stats": "playback",
  "Library sync": "library",
  "Sync Outbox": "library",
  "Smart playlists": "library",
  "Library health": "library",
  "Download manager": "storage",
  Cache: "storage",
  "Backup & restore": "storage"
};

function showSettingsCategory(category = "general") {
  for (const card of document.querySelectorAll("#settingsView .settings-card")) {
    if (!card.dataset.settingsSection) {
      const title = card.querySelector("h2")?.textContent?.trim() || "";
      card.dataset.settingsSection = SETTINGS_CATEGORY_BY_TITLE[title] || "general";
    }
    card.classList.toggle("settings-filtered-out", card.dataset.settingsSection !== category);
  }
  for (const button of els.settingsCategoryNav?.querySelectorAll("[data-settings-category]") || []) {
    button.classList.toggle("active", button.dataset.settingsCategory === category);
  }
}

els.settingsCategoryNav?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-settings-category]");
  if (button) showSettingsCategory(button.dataset.settingsCategory);
});
showSettingsCategory("general");

els.queueLockButton?.addEventListener("click", () => {
  applyBooleanSetting("queueLock", !state.settings.queueLock);
  renderPlaybackOptions();
  toast(state.settings.queueLock ? "Queue lock on." : "Queue lock off.");
});
els.queueFollowButton?.addEventListener("click", () => {
  applyBooleanSetting("queueFollowPlaying", !state.settings.queueFollowPlaying);
  state.queueFollowedTrackId = "";
  renderPlaybackOptions();
  if (state.settings.queueFollowPlaying) followCurrentQueueTrack({ force: true });
  toast(state.settings.queueFollowPlaying ? "Queue follows the playing song." : "Queue follow is off.");
});
els.queueClearButton?.addEventListener("click", clearQueue);
els.lyricsExpandButton?.addEventListener("click", () => setLyricsExpanded(!state.lyricsExpanded));
els.lyricsVersionButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  const opening = els.lyricsVersionMenu?.classList.contains("hidden");
  closeLyricsVersionMenu();
  if (opening) {
    renderLyricsVersionSwitcher();
    els.lyricsVersionMenu?.classList.remove("hidden");
    els.lyricsVersionButton.setAttribute("aria-expanded", "true");
  }
});
els.lyricsVersionMenu?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-lyrics-quick-version]");
  if (!button) return;
  // renderLyrics replaces the selected button. Without stopping this event here,
  // the document-level outside-click handler sees the now-detached button and
  // treats the selection as a click outside the switcher.
  event.stopPropagation();
  const version = els.lyricsVersionMenu._items?.[Number(button.dataset.lyricsQuickVersion)];
  if (!version) return;
  try {
    await applyLyricsVersionSelection(version, { keepMenuOpen: true });
  } catch (error) {
    toast(error.message || "Could not switch lyrics version.", true);
  }
});
els.settingsLanguage?.addEventListener("change", (event) => {
  applyInterfaceLanguage(event.target.value);
  syncSettingsControls();
});
els.settingsRightWidth.addEventListener("input", (event) => {
  applyRightPanelWidth(Number(event.target.value));
});
els.settingsLyricsSource.addEventListener("change", (event) => {
  applyChoiceSetting("lyricsSource", event.target.value, ["auto", "betterlyrics", "netease", "lrclib", "musixmatch", "kugou", "paxsenix", "lyricsplus", "youtube-transcript", "lyrics-ovh", "local"]);
  if (state.currentTrack?.id) loadLyricsForTrack(state.currentTrack);
});
els.settingsLyricsPriority?.addEventListener("change", (event) => {
  state.settings.lyricsSourceOrder = normalizeLyricsProviderOrder(event.target.value);
  saveAppearanceSettings();
  syncSettingsControls();
});
for (const provider of LYRICS_PROVIDER_DEFS) {
  els[provider.settingId]?.addEventListener("change", (event) => {
    normalizeLyricsSettings();
    state.settings.lyricsSearchProviders[provider.key] = event.target.checked;
    saveAppearanceSettings();
    syncSettingsControls();
  });
}
els.settingsLyricsTranslateTarget?.addEventListener("change", (event) => {
  applyChoiceSetting("lyricsTranslateTarget", event.target.value, ["zh-TW", "zh-CN", "ja", "ko", "en"]);
  state.lyricsTranslation = cachedTranslationForLyrics();
  state.lyricsTranslationVisible = false;
  renderLyrics(state.lyrics);
});
els.settingsLyricsScale.addEventListener("input", (event) => {
  applyLyricsScale(Number(event.target.value));
});
els.settingsLyricsCardTemplate?.addEventListener("change", (event) => {
  applyLyricsCardTemplate(event.target.value);
});
els.settingsDesktopLyricsOpacity?.addEventListener("input", (event) => {
  applyDesktopLyricsOpacity(Number(event.target.value));
});
els.settingsDesktopLyricsFont?.addEventListener("change", (event) => {
  applyDesktopLyricsFont(event.target.value);
});
els.settingsDensity.addEventListener("change", (event) => {
  applyDensity(event.target.value);
});
els.settingsThemeMode?.addEventListener("change", (event) => {
  applyThemeMode(event.target.value);
});
els.settingsWebFallback.addEventListener("change", (event) => {
  applyBooleanSetting("webFallback", event.target.checked);
});
els.settingsOfflineMode?.addEventListener("change", (event) => {
  applyBooleanSetting("offlineMode", event.target.checked);
  toast(event.target.checked ? "Offline mode on. Only downloaded songs will play." : "Offline mode off.");
});
els.settingsNotifications.addEventListener("change", (event) => {
  applyBooleanSetting("notifications", event.target.checked);
});
els.settingsQueueLock?.addEventListener("change", (event) => {
  applyBooleanSetting("queueLock", event.target.checked);
  renderPlaybackOptions();
});
els.settingsQuality.addEventListener("change", (event) => {
  applyChoiceSetting("quality", event.target.value, ["auto", "high", "balanced", "data-saver"]);
});
els.settingsMiniSkin?.addEventListener("change", (event) => {
  applyChoiceSetting("miniSkin", event.target.value, ["compact", "cover", "lyrics"]);
});
els.settingsCrossfade?.addEventListener("input", (event) => {
  applyCrossfadeSeconds(Number(event.target.value));
});
els.settingsArtistShuffleLimit?.addEventListener("input", (event) => {
  applyArtistShuffleLimit(Number(event.target.value));
});
els.settingsLibraryAutoRefresh.addEventListener("change", (event) => {
  applyBooleanSetting("libraryAutoRefresh", event.target.checked);
});
els.settingsLibraryDefaultSort.addEventListener("change", (event) => {
  applyChoiceSetting("libraryDefaultSort", event.target.value, ["recent", "played", "title", "creator"]);
});
els.settingsSmartCache?.addEventListener("change", (event) => {
  applyBooleanSetting("smartCache", event.target.checked);
});
els.settingsCacheSize.addEventListener("input", (event) => {
  applyCacheSize(Number(event.target.value));
});
els.settingsClearCache.addEventListener("click", async () => {
  els.settingsClearCache.disabled = true;
  try {
    if (window.metro?.cacheClear) {
      const result = await window.metro.cacheClear();
      applyOfflineCacheResult(result);
    }
    localStorage.removeItem(CACHE_META_KEY);
    renderOfflineDependentViews();
    toast("Offline cache cleared.");
  } catch (error) {
    toast(error.message || "Clear offline cache failed.", true);
  } finally {
    els.settingsClearCache.disabled = false;
  }
});
els.settingsDebugLogs.addEventListener("change", (event) => {
  applyBooleanSetting("debugLogs", event.target.checked);
});
els.settingsExportState.addEventListener("click", async () => {
  const summary = {
    signedIn: Boolean(state.auth?.signedIn),
    queue: state.queue.length,
    history: state.queueHistory.length,
    library: libraryCounts(state.libraryData),
    settings: state.settings
  };
  await navigator.clipboard?.writeText(JSON.stringify(summary, null, 2));
  showCopySuccess(els.settingsExportState);
  toast("App state summary copied.");
});
els.settingsBackupExport?.addEventListener("click", () => {
  exportAppBackup().catch((error) => toast(error.message || "Backup export failed.", true));
});
els.settingsBackupImport?.addEventListener("click", () => els.settingsBackupFile?.click());
els.settingsBackupFile?.addEventListener("change", async () => {
  const file = els.settingsBackupFile.files?.[0];
  els.settingsBackupFile.value = "";
  if (!file) return;
  try {
    await restoreAppBackupFile(file);
  } catch (error) {
    toast(error.message || "Backup restore failed.", true);
  }
});
els.settingsResetLayout.addEventListener("click", resetAppearanceSettings);
els.syncOutboxRetryAll?.addEventListener("click", () => processSyncOutbox({ force: true }));
els.syncOutboxClearDone?.addEventListener("click", () => {
  state.syncOutbox = state.syncOutbox.filter((item) => item.status !== "done");
  saveSyncOutbox();
});
els.syncOutboxList?.addEventListener("click", async (event) => {
  const retry = event.target.closest("[data-outbox-retry]");
  const remove = event.target.closest("[data-outbox-remove]");
  if (retry) {
    const item = state.syncOutbox.find((entry) => entry.id === retry.dataset.outboxRetry);
    if (item) {
      item.status = "queued";
      item.error = "";
      saveSyncOutbox();
      await processSyncOutbox({ force: true });
    }
  }
  if (remove) {
    state.syncOutbox = state.syncOutbox.filter((entry) => entry.id !== remove.dataset.outboxRemove);
    saveSyncOutbox();
  }
});
els.downloadManagerPause?.addEventListener("click", () => {
  state.downloadPaused = true;
  renderDownloadManager();
});
els.downloadManagerResume?.addEventListener("click", () => {
  state.downloadPaused = false;
  renderDownloadManager();
  processDownloadQueue();
});
els.downloadManagerRetryFailed?.addEventListener("click", () => {
  for (const item of state.downloadQueue) {
    if (item.status === "failed") {
      item.status = "queued";
      item.error = "";
    }
  }
  state.downloadPaused = false;
  saveDownloadQueue();
  processDownloadQueue();
});
els.downloadManagerClearFailed?.addEventListener("click", () => {
  state.downloadQueue = state.downloadQueue.filter((item) => item.status !== "failed");
  saveDownloadQueue();
});
els.downloadManagerList?.addEventListener("click", (event) => {
  const retry = event.target.closest("[data-download-retry]");
  const remove = event.target.closest("[data-download-remove]");
  if (retry) {
    const item = state.downloadQueue.find((entry) => entry.id === retry.dataset.downloadRetry);
    if (item) {
      item.status = "queued";
      item.error = "";
      saveDownloadQueue();
      processDownloadQueue();
    }
  }
  if (remove) {
    state.downloadQueue = state.downloadQueue.filter((entry) => entry.id !== remove.dataset.downloadRemove);
    saveDownloadQueue();
  }
});
els.smartPlaylistCreate?.addEventListener("click", createSmartPlaylist);
els.healthCheckRun?.addEventListener("click", runLibraryHealthCheck);
els.playbackStatsReset?.addEventListener("click", () => {
  state.playbackStats = {};
  writeStoredObject(PLAYBACK_STATS_KEY, state.playbackStats);
  renderPlaybackStats();
});
els.rightResizeHandle.addEventListener("pointerdown", (event) => {
  if (state.lyricsExpanded) return;
  window.getSelection()?.removeAllRanges();
  state.rightPanelResizing = true;
  try {
    els.rightResizeHandle.setPointerCapture(event.pointerId);
  } catch {}
  document.body.classList.add("resizing-right-panel");
  event.stopPropagation();
  event.preventDefault();
});
els.rightResizeHandle.addEventListener("pointermove", (event) => {
  if (!state.rightPanelResizing) return;
  applyRightPanelWidth(window.innerWidth - event.clientX, false);
});
els.rightResizeHandle.addEventListener("pointerup", (event) => {
  state.rightPanelResizing = false;
  if (els.rightResizeHandle.hasPointerCapture(event.pointerId)) {
    els.rightResizeHandle.releasePointerCapture(event.pointerId);
  }
  document.body.classList.remove("resizing-right-panel");
  saveAppearanceSettings();
});
els.rightResizeHandle.addEventListener("pointercancel", (event) => {
  state.rightPanelResizing = false;
  if (els.rightResizeHandle.hasPointerCapture(event.pointerId)) {
    els.rightResizeHandle.releasePointerCapture(event.pointerId);
  }
  document.body.classList.remove("resizing-right-panel");
  saveAppearanceSettings();
});
window.addEventListener("pointermove", (event) => {
  if (!state.rightPanelResizing) return;
  applyRightPanelWidth(window.innerWidth - event.clientX, false);
  event.preventDefault();
});
window.addEventListener("pointerup", () => {
  if (!state.rightPanelResizing) return;
  state.rightPanelResizing = false;
  document.body.classList.remove("resizing-right-panel");
  saveAppearanceSettings();
});
window.addEventListener("blur", () => {
  if (!state.rightPanelResizing) return;
  state.rightPanelResizing = false;
  document.body.classList.remove("resizing-right-panel");
  saveAppearanceSettings();
});
els.rightResizeHandle.addEventListener("dblclick", () => applyRightPanelWidth(360));
els.rightResizeHandle.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
  event.preventDefault();
  if (event.key === "Home") {
    applyRightPanelWidth(360);
    return;
  }
  const current = Number(state.settings.rightPanelWidth || 360);
  applyRightPanelWidth(current + (event.key === "ArrowLeft" ? 24 : -24));
});
window.addEventListener("resize", () => {
  const width = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--right-panel-width"), 10);
  if (Number.isFinite(width)) applyRightPanelWidth(width);
});

els.historyPlayButton.addEventListener("click", async () => {
  const tracks = els.historyPlayButton._tracks || [];
  if (tracks.length) await addToQueue(tracks, true, els.historyPlayButton._queueSource);
});

els.historyShuffleButton.addEventListener("click", async () => {
  const tracks = els.historyShuffleButton._tracks || [];
  if (tracks.length) await addToQueue(shuffleTracks(tracks), true, els.historyShuffleButton._queueSource);
});

els.historyCreatePlaylistButton?.addEventListener("click", createRecentPlaylist);

document.addEventListener("click", async (event) => {
  const retryButton = event.target.closest("[data-sync-retry]");
  if (!retryButton) return;
  const kind = retryButton.dataset.syncRetry;
  if (kind === "liked") await loadLiked();
  if (kind === "playlists") await loadPlaylists();
});

els.collectionPlayButton.addEventListener("click", async () => {
  const tracks = els.collectionPlayButton._tracks || [];
  if (tracks.length) await addToQueue(tracks, true, els.collectionPlayButton._queueSource);
});

els.collectionBackButton?.addEventListener("click", () => {
  const returnArtist = state.collectionReturnArtist;
  if (!returnArtist?.result) return;
  state.collectionReturnArtist = null;
  switchView("artist");
  renderArtist(returnArtist.result, returnArtist.fallback || {});
  requestAnimationFrame(() => {
    const main = document.querySelector(".main");
    if (main) main.scrollTop = Number(returnArtist.scrollTop) || 0;
  });
});

els.collectionShuffleButton.addEventListener("click", async () => {
  const tracks = els.collectionShuffleButton._tracks || [];
  if (tracks.length) await addToQueue(shuffleTracks(tracks), true, els.collectionShuffleButton._queueSource);
});

els.collectionDownloadButton.addEventListener("click", async () => {
  const title = state.collectionResult?.header?.title || state.collectionFallback?.title || "Collection";
  await cacheTracksOffline(els.collectionDownloadButton._tracks || [], title, els.collectionDownloadButton);
});

els.collectionRenameButton.addEventListener("click", renameCurrentPlaylist);
els.collectionDeleteButton.addEventListener("click", deleteCurrentPlaylist);
els.collectionAddSongsButton.addEventListener("click", openPlaylistAddModal);

els.collectionLoadMoreButton.addEventListener("click", loadMoreCollection);
if ("IntersectionObserver" in window && els.collectionLoadMoreButton) {
  const collectionContinuationObserver = new IntersectionObserver((entries) => {
    if (
      entries.some((entry) => entry.isIntersecting) &&
      currentVisibleViewId() === "collectionView" &&
      !els.collectionLoadMoreButton.classList.contains("hidden")
    ) {
      loadMoreCollection();
    }
  }, {
    root: document.querySelector(".main"),
    rootMargin: "240px 0px"
  });
  collectionContinuationObserver.observe(els.collectionLoadMoreButton);
}
els.podcastLoadMoreButton.addEventListener("click", loadMorePodcast);
els.searchLoadMoreButton.addEventListener("click", loadMoreSearch);

els.commandInput.addEventListener("input", renderCommandPalette);
els.commandInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    await runCommand(0);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeCommandPalette();
  }
});

els.commandList.addEventListener("click", async (event) => {
  const item = event.target.closest("[data-command-index]");
  if (!item) return;
  await runCommand(Number(item.dataset.commandIndex));
});

els.commandPalette.addEventListener("click", (event) => {
  if (event.target === els.commandPalette) closeCommandPalette();
});

els.loginButton.addEventListener("click", (event) => {
  event.stopPropagation();
  if (state.auth?.signedIn || state.accountProfiles.length) {
    setAccountSwitcherOpen(els.accountSwitcher?.classList.contains("hidden"));
    return;
  }
  window.metro.login();
});
els.accountLogin.addEventListener("click", () => window.metro.login());
els.accountAddButton?.addEventListener("click", () => {
  setAccountSwitcherOpen(false);
  window.metro.login();
});
els.accountManageButton?.addEventListener("click", () => {
  setAccountSwitcherOpen(false);
  switchView("account");
});
els.accountSwitcherList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-quick-account-switch]");
  if (!button || button.disabled) return;
  await activateAccountProfile(button.dataset.quickAccountSwitch, button);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".account-menu-shell")) setAccountSwitcherOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setAccountSwitcherOpen(false);
});
els.logoutButton.addEventListener("click", async () => {
  renderAuth(await window.metro.logout());
  state.homeLoaded = false;
  loadHome();
});
els.clearButton.addEventListener("click", async () => {
  renderAuth(await window.metro.clearAll());
  state.queue = [];
  state.queueSource = null;
  state.currentTrack = null;
  stopEmbedPlayer();
  state.playbackMode = "idle";
  renderLyrics(null);
  await savePlaybackSession({ force: true, clearTrack: true });
  await refreshOfflineCache();
  renderNow();
  state.homeLoaded = false;
  loadHome();
});

els.accountSaveProfileButton?.addEventListener("click", async () => {
  if (!window.metro?.saveAccountProfile) return;
  els.accountSaveProfileButton.disabled = true;
  try {
    renderAccountProfiles(await window.metro.saveAccountProfile());
    toast("Current account saved.");
  } catch (error) {
    toast(error.message || "Save account failed.", true);
  } finally {
    els.accountSaveProfileButton.disabled = !state.auth?.signedIn;
  }
});

els.accountProfilesList?.addEventListener("click", async (event) => {
  const switchButton = event.target.closest("[data-account-switch]");
  const deleteButton = event.target.closest("[data-account-delete]");
  if (!switchButton && !deleteButton) return;
  const profileId = (switchButton || deleteButton).dataset.accountSwitch || (switchButton || deleteButton).dataset.accountDelete;
  if (!profileId) return;
  try {
    if (switchButton) {
      await activateAccountProfile(profileId, switchButton);
    } else {
      const profiles = await window.metro.deleteAccountProfile(profileId);
      renderAccountProfiles(profiles);
      toast("Saved account removed.");
    }
  } catch (error) {
    toast(error.message || "Account profile action failed.", true);
    await refreshAccountProfiles();
  }
});

els.moreMenu.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-more-action]");
  if (!button || button.disabled) return;
  event.stopPropagation();
  const item = state.moreItem;
  hideMoreMenu();
  await runMoreAction(button.dataset.moreAction, item);
});

els.playlistModalClose.addEventListener("click", closePlaylistModal);
els.playlistModal.addEventListener("click", (event) => {
  if (event.target === els.playlistModal) closePlaylistModal();
});
els.playlistModalList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-playlist-choice]");
  if (!button || !state.playlistTarget) return;
  const playlist = els.playlistModalList._items?.[Number(button.dataset.playlistChoice)];
  if (!playlist) return;
  button.disabled = true;
  els.playlistModalStatus.textContent = "Adding song...";
  try {
    const playlistId = normalizedPlaylistId(playlist.id || playlist.browseId);
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    await window.metro.addToPlaylist({
      playlistId,
      videoId: state.playlistTarget.id
    });
    setSyncState("playlists", { status: "synced", pending: 0, error: "", updatedAt: new Date().toISOString() });
    toast(`Added to ${playlist.title}.`);
    closePlaylistModal();
    if (playlistId && playlistId === activeCollectionPlaylistId()) {
      await refreshCurrentCollectionStatus("Syncing added song...");
    }
  } catch (error) {
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Add to playlist failed." });
    enqueueSyncAction("playlist-add", {
      playlistId: normalizedPlaylistId(playlist.id || playlist.browseId),
      videoId: state.playlistTarget.id
    }, `Add to playlist: ${state.playlistTarget.title || "Song"}`);
    els.playlistModalStatus.textContent = error.message || "Add to playlist failed.";
    button.disabled = false;
  }
});
els.playlistCreateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.playlistTarget) return;
  const title = els.playlistCreateInput.value.trim();
  if (!title) return;
  els.playlistModalStatus.textContent = "Creating playlist...";
  try {
    setSyncState("playlists", { status: "pending", pending: 1, error: "" });
    const result = await window.metro.createPlaylist({
      title,
      videoIds: [state.playlistTarget.id]
    });
    if (result?.playlistId) {
      syncLibraryItem({
        id: result.playlistId,
        browseId: `VL${result.playlistId}`,
        type: "playlist",
        kind: "playlist",
        title,
        subtitle: "Playlist",
        thumbnail: state.playlistTarget.thumbnail || ""
      }, true);
    }
    setSyncState("playlists", { status: "synced", pending: 0, error: "", updatedAt: new Date().toISOString() });
    toast(result?.playlistId ? `Created playlist: ${title}` : `Created playlist.`);
    closePlaylistModal();
  } catch (error) {
    setSyncState("playlists", { status: "error", pending: 0, error: error.message || "Create playlist failed." });
    enqueueSyncAction("playlist-create", { title, videoIds: [state.playlistTarget.id] }, `Create playlist: ${title}`);
    els.playlistModalStatus.textContent = error.message || "Create playlist failed.";
  }
});
els.playlistAddModalClose.addEventListener("click", closePlaylistAddModal);
els.playlistAddModal.addEventListener("click", (event) => {
  if (event.target === els.playlistAddModal) closePlaylistAddModal();
});
els.playlistAddSearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchPlaylistAddSongs(els.playlistAddSearchInput.value);
});
els.playlistAddResults.addEventListener("click", async (event) => {
  const playButton = event.target.closest("[data-playlist-add-play]");
  if (playButton) {
    const items = els.playlistAddResults._items || [];
    const item = items[Number(playButton.dataset.playlistAddPlay)];
    if (item) await playTrackFromContext(item, items, queueSource("search", "Playlist search"));
    return;
  }
  const addButton = event.target.closest("[data-playlist-add-track]");
  if (!addButton || addButton.disabled) return;
  const item = els.playlistAddResults._items?.[Number(addButton.dataset.playlistAddTrack)];
  if (item) await addPlaylistSearchTrack(item, addButton);
});
els.gamesHub?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-game-select]");
  if (!button) return;
  await openGame(button.dataset.gameSelect);
});
els.gamesBackButton?.addEventListener("click", showGamesHub);
els.gameExitButton?.addEventListener("click", exitGameToHome);
els.gamesRefreshButton?.addEventListener("click", () => {
  updateGamesStatus();
  if (state.activeGame === "lyrics" && state.lyricFillTrack) {
    els.lyricsFillStatus.textContent = `${state.lyricFillTrack.title} loaded independently from current playback.`;
  }
});
els.lyricsGameSearchForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearTimeout(state.lyricFillSearchTimer);
  await searchLyricsGameSongs(els.lyricsGameSearchInput.value, { auto: false });
});
els.lyricsGameSearchInput?.addEventListener("input", queueLyricsGameSongSearch);
els.lyricsGameSearchInput?.addEventListener("focus", () => {
  if (!els.lyricsGameSearchResults?._items?.length) queueLyricsGameSongSearch();
});
els.lyricsGameSearchResults?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-lyrics-game-song]");
  if (!button) return;
  const item = els.lyricsGameSearchResults._items?.[Number(button.dataset.lyricsGameSong)];
  if (item) await selectLyricsGameSong(item);
});
els.lyricsGameBackToSearchButton?.addEventListener("click", () => {
  stopLyricsGameVideo();
  showLyricsGameStage("search");
  els.lyricsGameSearchInput?.focus();
});
els.lyricsGameLevelRows?.addEventListener("click", (event) => {
  const row = event.target.closest("[data-lyrics-level]");
  if (!row) return;
  const level = row.dataset.lyricsLevel;
  if (!level) return;
  const start = event.target.closest("[data-lyrics-level-start]");
  if (state.lyricFillLevel !== level) {
    state.lyricFillLevel = level;
    renderLyricsGameLevelStage();
    return;
  }
  if (start || row.classList.contains("active")) startLyricsChoiceGame(level);
});
els.sharedGameStartButton?.addEventListener("click", () => startLyricsChoiceGame(state.lyricFillLevel));
els.gameLyricsSourceSelect?.addEventListener("change", async () => {
  if (!state.lyricFillTrack || state.activeGame !== "lyrics") return;
  await selectLyricsGameSong(state.lyricFillTrack);
});
els.lyricsGameOptions?.addEventListener("click", (event) => {
  const option = event.target.closest("[data-lyrics-choice]");
  if (!option) return;
  answerLyricsGameChoice(option.dataset.lyricsChoice || option.textContent, Number(option.dataset.lyricsChoiceIndex));
});
els.lyricsGamePrevButton?.addEventListener("click", previousLyricsGameGap);
els.lyricsGameNextButton?.addEventListener("click", skipLyricsGameGap);
els.lyricsGamePauseButton?.addEventListener("click", () => setLyricsGamePauseMenu(true));
els.lyricsGameMedia?.addEventListener("click", () => {
  if (lyricsGameIsHoldingChoice()) {
    els.lyricsFillStatus.textContent = "Choose the missing word to continue.";
    return;
  }
  if (els.lyricsGameAudio?.src && els.lyricsGameAudio.paused) {
    playLyricsGameAudio();
    return;
  }
  setLyricsGamePauseMenu(true);
});
els.lyricsGameResumeButton?.addEventListener("click", () => setLyricsGamePauseMenu(false));
els.lyricsGameRestartButton?.addEventListener("click", () => {
  hideLyricsGamePauseMenu();
  startLyricsChoiceGame(state.lyricFillLevel);
});
els.lyricsGameGiveUpButton?.addEventListener("click", giveUpLyricsGame);
els.lyricsGameQuitButton?.addEventListener("click", () => {
  stopLyricsGameVideo();
  hideLyricsGamePauseMenu();
  renderLyricsGameLevelStage();
  showLyricsGameStage("level");
});
els.lyricsFillNewButton?.addEventListener("click", startLyricsFillRound);
els.lyricsFillCheckButton?.addEventListener("click", checkLyricsFillAnswer);
els.lyricsFillInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") checkLyricsFillAnswer();
});

function handleLikedSelectionChange(event) {
  const checkbox = event.target.closest("[data-liked-select]");
  if (!checkbox) return;
  const container = checkbox.closest(".liked-results");
  const item = container?._items?.[Number(checkbox.dataset.likedSelect)];
  if (!item?.id) return;
  if (checkbox.checked) state.likedSelectedIds.add(item.id);
  else state.likedSelectedIds.delete(item.id);
  if (currentVisibleViewId() === "likedView") renderLiked();
  if (currentVisibleViewId() === "libraryView" && state.libraryData) renderLibrary(state.libraryData);
  if (currentVisibleViewId() === "collectionView" && isLikedSongsCollection()) {
    renderCollection(state.collectionResult, state.collectionFallback || {});
  }
}

els.likedResults.addEventListener("change", handleLikedSelectionChange);
els.librarySections.addEventListener("change", handleLikedSelectionChange);
els.collectionResults.addEventListener("change", handleLikedSelectionChange);

// Checkbox clicks are selection-only. Keep them out of the document-level
// playback handler even when the row is re-rendered immediately after change.
for (const container of [els.likedResults, els.librarySections, els.collectionResults]) {
  container?.addEventListener("click", (event) => {
    if (event.target.closest(".liked-select, [data-liked-select]")) event.stopPropagation();
  });
}

els.collectionResults.addEventListener("change", (event) => {
  const selectAll = event.target.closest("[data-playlist-select-all]");
  if (selectAll) {
    const items = playlistEditableTracks().filter(isTrackItem);
    if (selectAll.checked) {
      for (const item of items) state.playlistSelectedKeys.add(playlistTrackKey(item));
    } else {
      state.playlistSelectedKeys.clear();
    }
    renderCollection(state.collectionResult, state.collectionFallback || {});
    return;
  }

  const checkbox = event.target.closest("[data-playlist-select]");
  if (!checkbox) return;
  const item = checkbox.closest(".collection-tracks")?._items?.[Number(checkbox.dataset.playlistSelect)];
  if (!item) return;
  const key = playlistTrackKey(item);
  if (checkbox.checked) state.playlistSelectedKeys.add(key);
  else state.playlistSelectedKeys.delete(key);
  renderCollection(state.collectionResult, state.collectionFallback || {});
});

window.addEventListener("resize", hideMoreMenu);
document.addEventListener("scroll", hideMoreMenu, true);

function queueRowAtClientY(clientY) {
  const rows = [...els.queueList.querySelectorAll(".queue-row[data-index]")];
  if (!rows.length) return null;
  const fixedX = state.queueDragOriginRect
    ? state.queueDragOriginRect.left + state.queueDragOriginRect.width / 2
    : rows[0].getBoundingClientRect().left + 20;
  const direct = document.elementFromPoint(fixedX, clientY)?.closest?.(".queue-row[data-index]");
  if (direct?.closest("#queueList") === els.queueList) return direct;
  return rows.reduce((nearest, row) => {
    const rect = row.getBoundingClientRect();
    const distance = Math.abs(clientY - (rect.top + rect.height / 2));
    return !nearest || distance < nearest.distance ? { row, distance } : nearest;
  }, null)?.row || null;
}

function updateQueuePointerDrag(clientY) {
  if (state.queueDragFrom == null || !state.queueDragGhost || !state.queueDragOriginRect) return;
  const top = clientY - state.queueDragOffsetY;
  state.queueDragGhost.style.transform = `translate3d(0, ${Math.round(top - state.queueDragOriginRect.top)}px, 0)`;
  const targetRow = queueRowAtClientY(clientY);
  if (targetRow) {
    state.queueDropIndex = queueDropIndexFromEvent(targetRow, { clientY });
    markQueueDropTarget(targetRow, state.queueDropIndex);
  }
  const scrollHost = els.rightPanel;
  if (scrollHost) {
    const rect = scrollHost.getBoundingClientRect();
    if (clientY < rect.top + 46) scrollHost.scrollTop -= 16;
    else if (clientY > rect.bottom - 46) scrollHost.scrollTop += 16;
  }
}

els.queueList.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const row = event.target.closest(".queue-row[data-index]");
  if (!row || event.target.closest("button")) return;
  if (state.settings.queueLock) {
    toast("Queue lock is on. Unlock it before reordering the queue.", true);
    return;
  }
  const rect = row.getBoundingClientRect();
  state.queueDragFrom = Number(row.dataset.index);
  state.queueDropIndex = state.queueDragFrom;
  state.queueDragPointerId = event.pointerId;
  state.queueDragOffsetY = event.clientY - rect.top;
  state.queueDragOriginRect = rect;
  row.classList.add("dragging");
  const ghost = row.cloneNode(true);
  ghost.classList.remove("dragging", "drop-before", "drop-after");
  ghost.classList.add("queue-drag-ghost");
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  document.body.appendChild(ghost);
  state.queueDragGhost = ghost;
  event.preventDefault();
});

els.collectionSearchInput?.addEventListener("input", () => {
  state.collectionQuery = els.collectionSearchInput.value;
  if (state.collectionResult) renderCollection(state.collectionResult, state.collectionFallback || {});
});

els.collectionLayoutButton?.addEventListener("click", () => {
  state.collectionLayout = state.collectionLayout === "grid" ? "list" : "grid";
  try { localStorage.setItem("auralane:layout:collectionView", state.collectionLayout); } catch {}
  if (state.collectionResult) renderCollection(state.collectionResult, state.collectionFallback || {});
});

els.likedLayoutButton?.addEventListener("click", () => {
  state.likedLayout = state.likedLayout === "grid" ? "list" : "grid";
  try { localStorage.setItem("auralane:layout:likedView", state.likedLayout); } catch {}
  renderLiked();
});

document.addEventListener("pointermove", (event) => {
  if (state.queueDragPointerId !== event.pointerId) return;
  updateQueuePointerDrag(event.clientY);
  event.preventDefault();
}, { passive: false });

document.addEventListener("pointerup", async (event) => {
  if (state.queueDragPointerId !== event.pointerId) return;
  updateQueuePointerDrag(event.clientY);
  const fromIndex = state.queueDragFrom;
  const dropIndex = state.queueDropIndex ?? fromIndex;
  resetQueueDragState();
  await reorderQueueItem(fromIndex, dropIndex);
});

document.addEventListener("pointercancel", (event) => {
  if (state.queueDragPointerId === event.pointerId) resetQueueDragState();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && els.musicRecognitionDialog && !els.musicRecognitionDialog.classList.contains("hidden")) {
    closeMusicRecognitionDialog();
    event.preventDefault();
    return;
  }
  const keyboardMore = event.target.closest?.("[data-more-trigger]");
  if (keyboardMore && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    keyboardMore.click();
    return;
  }
  if (event.key === "Escape" && state.audioOutputMenuOpen) {
    setAudioOutputMenuOpen(false);
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && els.playlistCreateDialog && !els.playlistCreateDialog.classList.contains("hidden")) {
    setPlaylistCreateDialogOpen(false);
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && state.lyricsTimelineEditing) {
    setLyricsTimelinePanelOpen(false);
    event.preventDefault();
    return;
  }
  if (event.code === "Space" && state.lyricsTimelineEditing && state.lyricsTapTimingActive) {
    const target = event.target;
    if (!target?.matches?.("input, textarea, select") && !target?.isContentEditable) {
      event.preventDefault();
      event.stopPropagation();
      stampNextUntimedLyric();
      return;
    }
  }
  const keyboardTopResult = event.target.closest?.("[data-search-top-result]");
  if (keyboardTopResult && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    keyboardTopResult.click();
    return;
  }
  if (event.key === "Escape" && state.lyricsSearchOpen) {
    setLyricsSearchPanelOpen(false);
    event.preventDefault();
    return;
  }
  const target = event.target;
  const typing = target?.matches?.("input, textarea, select") || target?.isContentEditable;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "w") {
    event.preventDefault();
    window.metro?.closeWindow?.();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
    event.preventDefault();
    window.metro?.reloadWindow?.();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (isGameSessionActive()) {
      toast("Leave the game before using player commands.", true);
      return;
    }
    state.commandOpen ? closeCommandPalette() : openCommandPalette();
    return;
  }
  if (event.key === "Escape" && state.commandOpen) {
    event.preventDefault();
    closeCommandPalette();
    return;
  }
  if (event.key === "Escape" && isGameSessionActive()) {
    event.preventDefault();
    if (state.activeGame === "rhythm" && (rhythmState.running || rhythmState.paused || rhythmState.starting)) {
      if (rhythmState.paused) void resumeRhythmRun();
      else pauseRhythmRun();
    } else if (state.activeGame === "lyrics" && state.lyricFillStage === "play" && state.lyricFillGame && !state.lyricFillGame.finished) {
      setLyricsGamePauseMenu(!state.lyricFillGame.paused);
    } else showGamesHub();
    return;
  }
  if (typing || state.commandOpen) return;
  const lyricsKeyboardContext = state.lyricsExpanded || state.activeSidePanel === "lyrics" ||
    Boolean(els.lyricsVersionMenu && !els.lyricsVersionMenu.classList.contains("hidden"));
  if (!event.ctrlKey && !event.metaKey && !event.altKey && lyricsKeyboardContext &&
      (event.key === "ArrowUp" || event.key === "ArrowDown")) {
    const switched = switchLyricsVersionByDirection(event.key === "ArrowDown" ? 1 : -1);
    if (switched) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }
  if (isGameSessionActive() && (event.code === "Space" || (event.ctrlKey && (event.key === "ArrowRight" || event.key === "ArrowLeft")))) {
    event.preventDefault();
    toast("Music playback is disabled while the game is open.", true);
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    els.playButton.click();
  } else if (event.ctrlKey && event.key === "ArrowRight") {
    event.preventDefault();
    els.nextButton.click();
  } else if (event.ctrlKey && event.key === "ArrowLeft") {
    event.preventDefault();
    els.prevButton.click();
  }
});

document.addEventListener("click", async (event) => {
  if (!event.target.closest(".search-box")) {
    hideSearchSuggestions();
    hideRecognitionHistory();
  }
  if (!event.target.closest(".lyrics-version-switcher")) closeLyricsVersionMenu();

  const downloadTrigger = event.target.closest("[data-download-trigger]");
  if (downloadTrigger) {
    event.preventDefault();
    event.stopPropagation();
    const host = downloadTrigger.closest(".row, .top-result-card, .liked-row, .history-row, .podcast-row, .playlist-edit-row");
    const item = itemFromHost(host);
    if (!item) return;
    if (isOfflineCached(item.id)) {
      await removeTrackOffline(item);
      return;
    }
    await cacheTrackOffline(item);
    return;
  }

  const moreTrigger = event.target.closest("[data-more-trigger]");
  if (moreTrigger) {
    event.preventDefault();
    event.stopPropagation();
    const host = moreTrigger.closest(".row, .card, .library-feature, .top-result-card, .liked-row, .history-row, .podcast-row, .playlist-edit-row, .queue-row");
    const item = itemFromHost(host);
    showMoreMenu(item, moreTrigger.getBoundingClientRect(), sourceFromHost(host), contextItemsFromHost(host));
    return;
  }

  if (!event.target.closest("#moreMenu")) hideMoreMenu();

  const queuePlay = event.target.closest("[data-queue-play]");
  if (queuePlay) {
    const item = els.queueList._items?.[Number(queuePlay.dataset.queuePlay)];
    if (item) await playTrackFromContext(item, state.queue, state.queueSource);
    return;
  }

  const queueRemove = event.target.closest("[data-queue-remove]");
  if (queueRemove) {
    await removeQueueItem(Number(queueRemove.dataset.queueRemove));
    return;
  }

  const trackPlay = event.target.closest("[data-track-play]");
  if (trackPlay) {
    const row = trackPlay.closest(".unified-track-row");
    const topResult = row?.matches("[data-search-top-result]") ? row : null;
    const container = topResult || row?.parentElement;
    const items = topResult?._items || container?._items || [];
    const item = items[Number(trackPlay.dataset.trackPlay)];
    if (item) {
      await playTrackFromContext(item, container?._playbackItems || items, container?._queueSource);
    }
    return;
  }

  const likedPlay = event.target.closest("[data-liked-play]");
  if (likedPlay) {
    const container = likedPlay.closest(".liked-results") || els.likedResults;
    const items = container?._items || [];
    const item = items[Number(likedPlay.dataset.likedPlay)];
    if (item) await playTrackFromContext(item, container?._playbackItems || items, container?._queueSource);
    return;
  }

  const historyPlay = event.target.closest("[data-history-play]");
  if (historyPlay) {
    const container = historyPlay.closest(".history-rows");
    const items = container?._items || [];
    const item = items[Number(historyPlay.dataset.historyPlay)];
    if (item) await playTrackFromContext(item, items, container?._queueSource);
    return;
  }

  const historyRemove = event.target.closest("[data-history-remove]");
  if (historyRemove) {
    const item = historyRemove.closest(".history-rows")?._items?.[Number(historyRemove.dataset.historyRemove)];
    if (item) await removeHistoryTrack(item, historyRemove);
    return;
  }

  const playlistPlay = event.target.closest("[data-playlist-play]");
  if (playlistPlay) {
    const container = playlistPlay.closest(".collection-tracks");
    const items = container?._items || [];
    const item = items[Number(playlistPlay.dataset.playlistPlay)];
    if (item) await playTrackFromContext(item, items, container?._queueSource);
    return;
  }

  const playlistRemove = event.target.closest("[data-playlist-remove]");
  if (playlistRemove) {
    const item = playlistRemove.closest(".collection-tracks")?._items?.[Number(playlistRemove.dataset.playlistRemove)];
    if (item) await removeTrackFromCurrentPlaylist(item, playlistRemove);
    return;
  }

  const playlistRemoveSelected = event.target.closest("[data-playlist-remove-selected]");
  if (playlistRemoveSelected) {
    await removeSelectedPlaylistTracks();
    return;
  }

  const playlistQueueSelected = event.target.closest("[data-playlist-queue-selected]");
  if (playlistQueueSelected) {
    await queueSelectedPlaylistTracks();
    return;
  }

  const playlistDownloadSelected = event.target.closest("[data-playlist-download-selected]");
  if (playlistDownloadSelected) {
    await downloadSelectedPlaylistTracks(playlistDownloadSelected);
    return;
  }

  const podcastPlay = event.target.closest("[data-podcast-play]");
  if (podcastPlay) {
    const container = podcastPlay.closest(".podcast-rows");
    const items = container?._items || [];
    const item = items[Number(podcastPlay.dataset.podcastPlay)];
    if (item) await playTrackFromContext(item, items, container?._queueSource);
    return;
  }

  const moreButton = event.target.closest("[data-home-more]");
  if (moreButton) {
    const section = els.homeShelves._sections?.[Number(moreButton.dataset.homeMore)];
    if (section?.browseId) await loadBrowse(section);
    return;
  }

  const artistMoreButton = event.target.closest("[data-artist-more]");
  if (artistMoreButton) {
    const section = state.artistVisibleSections?.[Number(artistMoreButton.dataset.artistMore)];
    if (section?.browseId) await loadCollection({
      ...section,
      title: section.title || "Artist section",
      subtitle: section.subtitle || "Artist",
      type: section.type || "track",
      thumbnail: state.artistActionItem?.thumbnail || state.artistResult?.header?.thumbnail || ""
    }, {
      returnArtist: {
        result: state.artistResult,
        fallback: state.artistFallback,
        scrollTop: document.querySelector(".main")?.scrollTop || 0
      }
    });
    return;
  }

  const artistPopularMoreButton = event.target.closest("[data-artist-popular-more]");
  if (artistPopularMoreButton) {
    const tracks = state.artistResult?.tracks || [];
    const songsSection = artistPopularCollection(state.artistResult, state.artistFallback || {});
    if (songsSection?.browseId) {
      await loadCollection({
        ...songsSection,
        type: "track",
        title: songsSection.title || `${state.artistResult?.header?.title || "Artist"} songs`,
        thumbnail: state.artistActionItem?.thumbnail || state.artistResult?.header?.thumbnail || ""
      }, {
        returnArtist: {
          result: state.artistResult,
          fallback: state.artistFallback,
          scrollTop: document.querySelector(".main")?.scrollTop || 0
        }
      });
    } else if (tracks.length) {
      state.collectionReturnArtist = {
        result: state.artistResult,
        fallback: state.artistFallback,
        scrollTop: document.querySelector(".main")?.scrollTop || 0
      };
      switchView("collection");
      renderCollection({
        header: {
          title: `${state.artistResult?.header?.title || "Artist"} songs`,
          subtitle: state.artistResult?.header?.subtitle || "Artist",
          type: "track",
          thumbnail: state.artistResult?.header?.thumbnail || ""
        },
        tracks,
        continuations: state.artistResult?.continuations || []
      }, state.artistFallback || {});
      requestAnimationFrame(() => prefillCollection());
    }
    return;
  }

  const libraryAction = event.target.closest("[data-library-action]");
  if (libraryAction) {
    const action = libraryAction.dataset.libraryAction;
    if (action === "liked" || action === "songs") {
      await loadLiked();
      return;
    }
    if (action === "downloaded") {
      await loadDownloaded();
      return;
    }
    if (["playlists", "songs", "albums", "artists", "podcasts"].includes(action)) {
      state.libraryFilter = action;
      renderLibrary(state.libraryData);
      return;
    }
  }

  const topResult = event.target.closest("[data-search-top-result]");
  if (topResult) {
    const item = topResult._items?.[0];
    if (item?.browseId) {
      await loadBrowse(item);
      return;
    }
    if (item) await playTrackFromContext(item, topResult._items || [item], topResult._queueSource);
    return;
  }

  const card = event.target.closest(".card");
  if (card) {
    const container = card.parentElement;
    const items = container._items || [];
    const item = itemFromIndexedElement(card, items);
    if (item?.browseId) {
      await loadBrowse(item);
      return;
    }
    await playTrackFromContext(item, items, container._queueSource);
    return;
  }

  const row = event.target.closest(".row");
  if (row) {
    const container = row.parentElement;
    const items = container._items || [];
    const item = items[Number(row.dataset.index)];
    if (item) await playTrackFromContext(item, container._playbackItems || items, container._queueSource);
  }
});

els.playButton.addEventListener("click", async () => {
  if (blockPlaybackForGame()) return;
  // A user-initiated transport action takes ownership back from the headset
  // reconnect helper, so a later device event cannot unexpectedly resume.
  state.headsetAutoPaused = false;
  if (!state.currentTrack && state.queue[0]) {
    await playTrack(state.queue[0]);
    return;
  }
  const hasAudioSource = Boolean(els.audio.currentSrc || els.audio.getAttribute("src"));
  if (state.currentTrack && !hasAudioSource && state.playbackMode !== "embed") {
    await playTrack(state.currentTrack, { startTime: state.restoredPlaybackTime });
    return;
  }
  if (state.playbackMode === "embed") {
    if (state.playing) {
      stopEmbedPlayer();
      state.playing = false;
      state.playbackMode = "idle";
      renderNow();
    } else if (state.currentTrack) {
      startEmbedPlayback(state.currentTrack, "Using YouTube Music web playback.");
    }
    return;
  }
  if (els.audio.paused) {
    try {
      await els.audio.play();
    } catch {
      if (state.currentTrack) {
        if (webFallbackAllowed()) {
          startEmbedPlayback(state.currentTrack, "Audio playback was blocked; using YouTube Music web playback.");
        } else {
          await recoverPlaybackFailure(state.currentTrack, "Audio playback was blocked.");
        }
      }
    }
  } else {
    els.audio.pause();
  }
});

els.nowSubtitle.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-now-artist]");
  if (!button) return;
  const artist = els.nowSubtitle._artists?.[Number(button.dataset.nowArtist)];
  if (!artist?.title) return;
  await openArtist(artist);
});

els.likeButton?.addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopPropagation();
  const activeView = currentVisibleViewId();
  const main = document.querySelector(".main");
  const scrollTop = main?.scrollTop || 0;
  await toggleCurrentTrackLike();
  if (activeView && currentVisibleViewId() !== activeView) {
    const view = document.getElementById(activeView);
    if (view) switchView(activeView.replace(/View$/, ""));
  }
  requestAnimationFrame(() => {
    if (main) main.scrollTop = scrollTop;
  });
});
els.shareButton?.addEventListener("click", shareCurrentTrack);
els.currentDownloadButton?.addEventListener("click", toggleCurrentTrackDownload);
els.queueButton.addEventListener("click", () => switchSidePanel("queue"));
els.lyricsButton.addEventListener("click", () => switchSidePanel("lyrics"));
els.lyricsSyncButton?.addEventListener("click", () => {
  forceLyricsSyncToPlayback();
});
async function reloadCurrentLyrics() {
  if (!state.currentTrack?.id || state.lyricsReloading) return;
  const shouldTranslate = Boolean(state.settings.lyricsAutoTranslate);
  const shouldRomanize = Boolean(state.settings.lyricsAutoRomanize);
  const track = state.currentTrack;
  const previousLyrics = state.lyrics?.found && state.lyrics?.lines?.length
    ? { ...state.lyrics, lines: [...state.lyrics.lines] }
    : null;
  state.lyricsReloading = true;
  updateLyricsToolState();
  try {
    await clearLyricsSelectionForTrack(track);
    // Reload performs exactly one complete provider search. The old saved
    // choice and durable cache are already gone, so result #1 becomes the new
    // authoritative version only after the ordered search has settled.
    await loadLyricsForTrack(track, { forceReload: true, suppressAutoSave: true });
    if (state.currentTrack?.id !== track.id) return;
    const replacement = state.lyricsSearchCandidates[0];
    if (!replacement) throw new Error("No lyrics results were found.");
    const persisted = await persistAutomaticLyricsSelection(track, replacement);
    if (state.currentTrack?.id !== track.id) return;
    state.lyricsUserSelected = true;
    state.lyricsSelectedCandidateIndex = 0;
    renderLyrics(persisted?.result || lyricsCandidateToResult(replacement));
    toast("Lyrics reloaded.");
  } catch (error) {
    if (state.currentTrack?.id === track.id && previousLyrics) {
      await persistAutomaticLyricsSelection(track, previousLyrics).catch(() => {});
      renderLyrics(previousLyrics);
    }
    toast(error.message || "Lyrics reload failed.", true);
  } finally {
    state.lyricsReloading = false;
    updateLyricsToolState();
  }
  // Reload replaces cached lyric data, but it must never reset the listener's
  // enabled auxiliary lyric modes.
  if (shouldTranslate) await ensureLyricsTranslation({ notify: false });
  if (shouldRomanize) await ensureLyricsRomanization({ notify: false });
}

els.lyricsReloadButton?.addEventListener("click", reloadCurrentLyrics);
els.lyricsQuickReloadButton?.addEventListener("click", reloadCurrentLyrics);
els.lyricsCopyButton?.addEventListener("click", () => {
  copyAllLyrics(els.lyricsCopyButton).catch((error) => toast(error.message || "Could not copy lyrics.", true));
});
els.lyricsShareCardButton?.addEventListener("click", async () => {
  try {
    await shareLyricsCard();
  } catch (error) {
    toast(error.message || "Lyrics card failed.", true);
  }
});
els.lyricsOffsetMinus?.addEventListener("click", () => {
  if (!state.currentTrack?.id) return;
  writeLyricsOffsetMs(state.currentTrack, state.lyricsOffsetMs - 500);
  renderLyrics(state.lyrics);
});
els.lyricsOffsetPlus?.addEventListener("click", () => {
  if (!state.currentTrack?.id) return;
  writeLyricsOffsetMs(state.currentTrack, state.lyricsOffsetMs + 500);
  renderLyrics(state.lyrics);
});
els.lyricsOffsetReset?.addEventListener("click", () => {
  if (!state.currentTrack?.id) return;
  writeLyricsOffsetMs(state.currentTrack, 0);
  renderLyrics(state.lyrics);
});
els.lyricsTimelineButton?.addEventListener("click", () => {
  setLyricsTimelinePanelOpen(!state.lyricsTimelineEditing);
});
els.lyricsTimelineCloseButton?.addEventListener("click", () => setLyricsTimelinePanelOpen(false));
els.lyricsTapTimingButton?.addEventListener("click", () => {
  setLyricsTapTimingActive(!state.lyricsTapTimingActive);
});
els.lyricsTimelinePanel?.addEventListener("click", (event) => {
  if (event.target === els.lyricsTimelinePanel) setLyricsTimelinePanelOpen(false);
});
els.lyricsTimelineEditor?.addEventListener("click", (event) => {
  const setButton = event.target.closest("[data-timeline-set]");
  const shiftButton = event.target.closest("[data-timeline-shift]");
  if (setButton) {
    updateLyricLineTime(Number(setButton.dataset.timelineSet), lyricsTimelineNow());
    return;
  }
  if (shiftButton) {
    const index = Number(shiftButton.dataset.timelineShift);
    const delta = Number(shiftButton.dataset.delta || 0);
    const current = Number(state.lyrics?.lines?.[index]?.time || 0);
    updateLyricLineTime(index, current + delta);
  }
});
els.lyricsVersionList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lyrics-version-restore]");
  if (button) restoreLyricsVersion(Number(button.dataset.lyricsVersionRestore));
});
els.lyricsTimelineWaveform?.addEventListener("click", (event) => {
  const duration = Number(els.audio.duration || 0);
  if (!duration) return;
  const rect = els.lyricsTimelineWaveform.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
  els.audio.currentTime = duration * ratio;
  updateProgress();
  updateLyricsActive();
  drawLyricsTimelineWaveform();
});
els.lyricsSearchButton?.addEventListener("click", openLyricsSearchPanel);
els.lyricsSearchForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchLyricsCandidatesForCurrent();
});
for (const provider of LYRICS_PROVIDER_DEFS) {
  els[provider.searchId]?.addEventListener("change", (event) => {
    normalizeLyricsSettings();
    state.settings.lyricsSearchProviders[provider.key] = event.target.checked;
    saveAppearanceSettings();
    if (els[provider.settingId]) els[provider.settingId].checked = event.target.checked;
  });
}
els.lyricsCandidateList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lyrics-candidate]");
  if (!button) return;
  selectLyricsCandidate(Number(button.dataset.lyricsCandidate));
});
els.lyricsPreviewCandidateButton?.addEventListener("click", () => {
  const candidate = state.lyricsSearchCandidates?.[state.lyricsSelectedCandidateIndex];
  if (!candidate) return;
  try {
    const result = lyricsCandidateToResult(candidate, els.lyricsEditText?.value || "", `${candidate.provider} preview`);
    state.lyricsTranslation = null;
    state.lyricsTranslationVisible = false;
    renderLyrics(result);
    toast("Previewing selected lyrics.");
  } catch (error) {
    toast(error.message || "Lyrics preview failed.", true);
  }
});
els.lyricsUseCandidateButton?.addEventListener("click", async () => {
  const candidate = state.lyricsSearchCandidates?.[state.lyricsSelectedCandidateIndex];
  if (!candidate || !state.currentTrack?.id) return;
  try {
    const shouldResync = state.lyricsAutoSync;
    await clearLyricsSelectionForTrack(state.currentTrack);
    const rawText = els.lyricsEditText?.value || "";
    const result = saveLocalLyricsForTrack(state.currentTrack, els.lyricsEditText?.value || "", {
      title: candidate.title || state.currentTrack.title,
      artist: candidate.artist || lyricsSearchArtistFromTrack(),
      provider: candidate.provider || "Manual",
      providerKey: candidate.providerKey || "",
      sourceId: candidate.sourceId || "",
      sourceTitle: candidate.title || "",
      sourceArtist: candidate.artist || ""
    });
    saveLyricsMemoryForTrack(state.currentTrack, candidate, rawText);
    assertLyricsSelectionPersisted(state.currentTrack, rawText);
    state.lyricsTranslation = null;
    state.lyricsTranslationVisible = false;
    renderLyrics(result);
    restoreLyricsSyncAfterSourceChange(shouldResync);
    setLyricsSearchPanelOpen(false);
    toast("Lyrics saved for this song.");
  } catch (error) {
    toast(error.message || "Lyrics save failed.", true);
  }
});
els.lyricsCloseSearchButton?.addEventListener("click", () => setLyricsSearchPanelOpen(false));
els.lyricsSearchPanel?.addEventListener("click", (event) => {
  if (event.target === els.lyricsSearchPanel) setLyricsSearchPanelOpen(false);
});
els.lyricsTranslateButton?.addEventListener("click", async () => {
  if (!state.lyrics?.found || !state.lyrics?.lines?.length) return;
  const enabled = !state.settings.lyricsAutoTranslate;
  applyBooleanSetting("lyricsAutoTranslate", enabled);
  if (!enabled) {
    state.lyricsTranslationVisible = false;
    renderLyrics(state.lyrics);
    return;
  }
  await ensureLyricsTranslation({ notify: true });
});
els.lyricsRomanizeButton?.addEventListener("click", async () => {
  if (!state.lyrics?.found || !state.lyrics?.lines?.length) return;
  const enabled = !state.settings.lyricsAutoRomanize;
  applyBooleanSetting("lyricsAutoRomanize", enabled);
  if (!enabled) {
    state.lyricsRomanizationVisible = false;
    renderLyrics(state.lyrics);
    return;
  }
  await ensureLyricsRomanization({ notify: true });
});
els.lyricsDuetButton?.addEventListener("click", () => {
  state.karaokeDuetMode = !state.settings.lyricsDuetMode;
  applyBooleanSetting("lyricsDuetMode", state.karaokeDuetMode);
  document.body.classList.toggle("karaoke-duet-mode", state.karaokeDuetMode);
  renderLyrics(state.lyrics);
  toast(state.karaokeDuetMode ? "Karaoke duet mode on." : "Karaoke duet mode off.");
});
els.sleepButton.addEventListener("click", () => toggleSleepMenu());

// Close sleep menu when clicking outside
document.addEventListener("click", (event) => {
  const menu = document.getElementById("sleepMenu");
  if (menu && !menu.classList.contains("hidden")) {
    if (!menu.contains(event.target) && event.target !== els.sleepButton && !els.sleepButton.contains(event.target)) {
      menu.classList.add("hidden");
    }
  }
});

// Sleep options click handler
document.querySelectorAll(".sleep-option").forEach(btn => {
  btn.addEventListener("click", () => {
    const mins = Number(btn.dataset.time);
    setSleepTimer(mins);
    toggleSleepMenu();
  });
});

els.lyricWidgetButton.addEventListener("click", () => toggleLyricWidget());
els.miniPlayerButton?.addEventListener("click", () => toggleMiniPlayer());
els.focusCloseButton.addEventListener("click", () => toggleFocusMode());
els.focusSyncButton?.addEventListener("click", () => {
  setFocusLyricsAutoSync(true);
  scrollFocusLyricIntoView(focusActiveLyricElement());
});

// Escape key to exit Focus Mode or Lyrics Maximized
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (els.focusMode && !els.focusMode.classList.contains("hidden")) {
      toggleFocusMode();
    } else if (state.lyricsExpanded) {
      setLyricsExpanded(false);
    }
  }
});

// Fullscreen change listener to sync Focus Mode exit (Web Fullscreen API, may not fire with Electron native fullscreen)
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement && state.lyricsExpanded) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scrollLyricIntoView(activeLyricElement(), { instant: true });
    }));
  }
  if (!document.fullscreenElement && els.focusMode && !els.focusMode.classList.contains("hidden")) {
    toggleFocusMode();
  }
  if (!document.fullscreenElement && state.lyricsExpanded) {
    setLyricsExpanded(false, { manageFullscreen: false });
  }
});

// Electron native fullscreen exit (e.g. user pressed Esc while in native fullscreen)
window.metro?.onFullscreenChanged?.((isFullscreen) => {
  if (!isFullscreen) {
    if (els.focusMode && !els.focusMode.classList.contains("hidden")) {
      // Focus mode: hide it and update buttons without triggering another setWindowFullscreen
      els.focusMode.classList.add("hidden");
      document.body.style.overflow = "";
      setFocusLyricsAutoSync(true);
    } else if (state.lyricsExpanded) {
      setLyricsExpanded(false, { manageFullscreen: false });
    }
  }
});

// Click focus lyrics line to seek
els.focusLyricsList.addEventListener("click", (event) => {
  const line = event.target.closest(".lyric-line");
  if (!line || !usesAudioTimeline()) return;
  if (line.dataset.time === "") return;
  const time = Number(line.dataset.time);
  if (Number.isFinite(time)) {
    els.audio.currentTime = seekTimeForLyricLine(time);
    updateProgress();
  }
});

els.focusLyricsList.addEventListener("wheel", () => {
  if (!els.focusMode.classList.contains("hidden")) setFocusLyricsAutoSync(false);
}, { passive: true });

els.focusLyricsList.addEventListener("touchmove", () => {
  if (!els.focusMode.classList.contains("hidden")) setFocusLyricsAutoSync(false);
}, { passive: true });

els.focusLyricsList.addEventListener("pointerdown", (event) => {
  const rect = els.focusLyricsList.getBoundingClientRect();
  if (event.clientX >= rect.right - 16) setFocusLyricsAutoSync(false);
}, { passive: true });

els.seekBar.addEventListener("input", () => {
  state.seeking = true;
  const duration = currentPlaybackDuration();
  const current = duration ? (Number(els.seekBar.value) / 1000) * duration : 0;
  els.currentTime.textContent = formatClock(current);
});

els.seekBar.addEventListener("change", () => {
  const duration = currentPlaybackDuration();
  const nextTime = duration ? (Number(els.seekBar.value) / 1000) * duration : 0;
  if (duration && usesAudioTimeline() && (els.audio.currentSrc || els.audio.getAttribute("src"))) {
    els.audio.currentTime = nextTime;
  } else if (duration) {
    state.restoredPlaybackTime = nextTime;
  }
  state.seeking = false;
  updateProgress();
  schedulePlaybackSessionSave({ force: true });
});

els.volumeBar.addEventListener("input", () => {
  els.audio.volume = Number(els.volumeBar.value);
  if (els.lyricsGameAudio) els.lyricsGameAudio.volume = Number(els.volumeBar.value);
  syncMiniPlayerSoon();
});

els.audioOutputButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  setAudioOutputMenuOpen(!state.audioOutputMenuOpen);
});

els.audioOutputMenu?.addEventListener("click", async (event) => {
  event.stopPropagation();
  const refresh = event.target.closest("[data-audio-output-refresh]");
  if (refresh) {
    await refreshAudioOutputDevices();
    return;
  }
  const prompt = event.target.closest("[data-audio-output-prompt]");
  if (prompt) {
    await promptAudioOutputDevicePicker();
    return;
  }
  const option = event.target.closest("[data-audio-output-device]");
  if (!option) return;
  await applyAudioOutputDevice(option.dataset.audioOutputDevice, { closeMenu: true });
});

document.addEventListener("click", (event) => {
  if (state.audioOutputMenuOpen && !event.target.closest(".audio-output-control")) {
    setAudioOutputMenuOpen(false);
  }
});

if (navigator.mediaDevices?.addEventListener) {
  navigator.mediaDevices.addEventListener("devicechange", () => {
    refreshAudioOutputDevices({ apply: true, reconcileHeadset: true }).catch((error) => {
      state.audioOutputError = error?.message || "Could not refresh output devices.";
      renderAudioOutputControl();
    });
  });
}

els.lyricsList.addEventListener("click", (event) => {
  const line = event.target.closest(".lyric-line");
  if (!line || !usesAudioTimeline()) return;
  const index = Number(line.dataset.index);
  if (event.altKey && state.lyricsTranslationVisible && Number.isFinite(index)) {
    const current = state.lyricsTranslation?.lines?.[index]?.text || "";
    const next = window.prompt("Edit translated lyric", current);
    if (next !== null && state.lyricsTranslation?.lines?.[index]) {
      state.lyricsTranslation.lines[index].text = next.trim();
      saveTranslationForLyrics(state.lyrics, state.lyricsTranslation);
      renderLyrics(state.lyrics);
      toast("Translation updated.");
    }
    return;
  }
  if (event.shiftKey) {
    if (Number.isFinite(index)) {
      if (state.lyricsShareSelection.has(index)) state.lyricsShareSelection.delete(index);
      else state.lyricsShareSelection.add(index);
      line.classList.toggle("selected", state.lyricsShareSelection.has(index));
    }
    return;
  }
  if (line.dataset.time === "") return;
  const time = Number(line.dataset.time);
  if (Number.isFinite(time)) {
    els.audio.currentTime = seekTimeForLyricLine(time);
    updateProgress();
  }
});

function deferDetailedLyricPainting() {
  state.lyricsInteractionUntil = performance.now() + 180;
}

document.addEventListener("wheel", deferDetailedLyricPainting, { passive: true, capture: true });
document.addEventListener("touchmove", deferDetailedLyricPainting, { passive: true, capture: true });
document.addEventListener("pointermove", (event) => {
  if (event.buttons) deferDetailedLyricPainting();
}, { passive: true, capture: true });

els.lyricsList.addEventListener("wheel", () => {
  setLyricsAutoSync(false);
}, { passive: true });

els.lyricsList.addEventListener("touchmove", () => {
  setLyricsAutoSync(false);
}, { passive: true });

els.rightPanel?.addEventListener("pointerdown", (event) => {
  if (state.activeSidePanel !== "lyrics") return;
  const rect = els.rightPanel.getBoundingClientRect();
  if (event.clientX >= rect.right - 16) setLyricsAutoSync(false);
}, { passive: true });

els.rightPanel?.addEventListener("wheel", (event) => {
  // The fullscreen source picker lives inside the lyrics panel. Browsing that
  // menu must not be treated as a manual scroll of the lyric timeline.
  if (event.target.closest(".lyrics-version-switcher, .lyrics-quick-settings, .lyrics-meta")) return;
  if (state.lyricsExpanded && !state.lyricsProgrammaticScroll) setLyricsAutoSync(false);
}, { passive: true });

els.shuffleButton.addEventListener("click", () => {
  state.shuffleEnabled = !state.shuffleEnabled;
  if (state.shuffleEnabled) ensureShuffleOrder({ renew: true });
  else resetShuffleOrder();
  renderPlaybackOptions();
  schedulePlaybackSessionSave({ force: true });
  toast(state.shuffleEnabled ? "Shuffle on." : "Shuffle off.");
});

els.repeatButton.addEventListener("click", () => {
  const index = REPEAT_MODES.indexOf(state.repeatMode);
  state.repeatMode = REPEAT_MODES[(index + 1) % REPEAT_MODES.length];
  renderPlaybackOptions();
  schedulePlaybackSessionSave({ force: true });
  toast(`${repeatModeLabel()}.`);
});

els.nextButton.addEventListener("click", async () => {
  if (blockPlaybackForGame()) return;
  await maybeAutoLoadMoreQueue();
  let nextIndex = nextQueueIndex({ manual: true });
  if (nextIndex < 0 && await appendSmartQueueFromTrack()) {
    nextIndex = nextQueueIndex({ manual: true });
  }
  await playQueueIndex(nextIndex);
});

els.prevButton.addEventListener("click", async () => {
  if (blockPlaybackForGame()) return;
  if (state.currentTrack?.id && currentPlaybackSeconds() > 1 && usesAudioTimeline()) {
    els.audio.currentTime = 0;
    state.restoredPlaybackTime = 0;
    updateProgress();
    schedulePlaybackSessionSave({ force: true });
    return;
  }
  await playQueueIndex(previousQueueIndex());
});

els.audio.addEventListener("play", () => {
  const isHeardlePreview = els.audio.dataset.gamePlayer === "heardle";
  if (isGameSessionActive() && !isHeardlePreview) {
    els.audio.pause();
    state.playing = false;
    setPlaybackModeLabel("Game mode");
    renderNow();
    return;
  }
  initDSP();
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  updateDSP();
  if (isHeardlePreview) return;
  if (state.playbackMode !== "embed" && state.playbackMode !== "offline") state.playbackMode = "direct";
  state.playing = true;
  startLyricsAnimationLoop();
  if (state.playbackMode === "direct" && els.playbackMode.textContent === "Ready") setPlaybackModeLabel("Direct");
  renderNow();
  schedulePlaybackSessionSave({ force: true });
});
els.audio.addEventListener("pause", () => {
  if (els.audio.dataset.gamePlayer === "heardle") return;
  if (state.playbackMode === "embed") return;
  state.playing = false;
  stopLyricsAnimationLoop();
  renderNow();
  schedulePlaybackSessionSave({ force: true });
});
els.audio.addEventListener("loadedmetadata", updateProgress);
els.audio.addEventListener("timeupdate", updateProgress);
if (els.lyricsGameAudio) {
  const updateLyricsGameFromAudio = () => {
    if (state.lyricFillStage === "play" && state.lyricFillGame) tickLyricsGamePlayback();
  };
  els.lyricsGameAudio.addEventListener("loadedmetadata", updateLyricsGameFromAudio);
  els.lyricsGameAudio.addEventListener("playing", updateLyricsGameFromAudio);
  els.lyricsGameAudio.addEventListener("seeked", updateLyricsGameFromAudio);
  els.lyricsGameAudio.addEventListener("timeupdate", updateLyricsGameFromAudio);
}
els.audio.addEventListener("ended", async () => {
  if (els.audio.dataset.gamePlayer === "heardle") return;
  await handlePlaybackEnded();
});
els.audio.addEventListener("error", () => {
  if (els.audio.dataset.gamePlayer === "heardle") return;
  const requestId = Number(els.audio.dataset.playbackRequestId || 0);
  if (requestId && requestId !== state.playbackRequestId) return;
  if (state.playbackMode === "direct" && state.currentTrack) {
    const retryCount = Number(els.audio.dataset.streamErrorRetry || 0);
    if (retryCount < 1) {
      const track = state.currentTrack;
      const startTime = currentPlaybackSeconds();
      els.audio.dataset.streamErrorRetry = String(retryCount + 1);
      state.playbackStreams.delete(track.id);
      setPlaybackModeLabel("Refreshing stream");
      playTrack(track, { streamRetry: true, startTime }).catch(() => {});
      return;
    }
    if (webFallbackAllowed()) {
      startEmbedPlayback(state.currentTrack, "Audio element could not play this stream; using YouTube Music web playback.");
    } else {
      recoverPlaybackFailure(state.currentTrack, "Audio element could not play this stream.");
    }
  }
});

window.metro.onAuthChanged((auth) => {
  renderAuth(auth);
  loadAppearanceSettings();
  loadQueueMemory();
  processSyncOutbox();
  state.homeLoaded = false;
  loadHome();
});
window.metro.onError((message) => toast(message, true));
window.metro.onMiniPlayerCommand?.((payload) => {
  handleMiniPlayerCommand(payload);
});
window.metro.onMiniPlayerClosed?.(() => {
  setMiniPlayerButtonActive(false);
});

window.addEventListener("beforeunload", () => {
  savePlaybackSession({ force: true, sync: true });
});
window.addEventListener("online", () => {
  processSyncOutbox();
  processDownloadQueue();
});

// ── Focus Mode ──
function toggleFocusMode() {
  const isHidden = els.focusMode.classList.contains("hidden");
  if (isHidden) {
    if (state.lyricsExpanded) setLyricsExpanded(false, { manageFullscreen: false });
    els.focusMode.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setFocusLyricsAutoSync(true);
    if (els.focusArt) els.focusArt.style.setProperty("--focus-art-scale", "1");
    syncFocusModeTrack();
  } else {
    els.focusMode.classList.add("hidden");
    document.body.style.overflow = "";
    setFocusLyricsAutoSync(true);
  }
  els.focusCloseButton.innerHTML = standardIconSvg("collapse");
}

function syncFocusModeTrack() {
  const track = state.currentTrack;
  if (!track) {
    els.focusTitle.textContent = "Nothing playing";
    els.focusArtist.textContent = "Choose a song";
    els.focusArt.style.backgroundImage = "";
    if (els.focusBackdropArt) els.focusBackdropArt.style.backgroundImage = "";
    state.focusActiveLyricIndex = -1;
    els.focusLyricsList.innerHTML = `<p class="status">Choose a song with synced lyrics.</p>`;
    return;
  }

  els.focusTitle.textContent = track.title || "Unknown Title";
  els.focusArtist.textContent = allArtistLabel(track, track.subtitle || "Unknown Artist");
  els.focusArt.style.backgroundImage = thumbnailBackground(track);
  if (els.focusBackdropArt) els.focusBackdropArt.style.backgroundImage = thumbnailBackground(track);

  if (state.lyrics) {
    renderFocusLyrics(state.lyrics);
  } else {
    els.focusLyricsList.innerHTML = `<p class="status">Searching lyrics...</p>`;
  }
}

function renderFocusLyrics(lyrics) {
  if (!lyrics || !lyrics.found || !lyrics.lines?.length) {
    els.focusLyricsList.innerHTML = `<p class="status">No lyrics found for this track.</p>`;
    state.focusActiveLyricIndex = -1;
    updateLyricsSyncButtonVisibility();
    return;
  }

  state.focusActiveLyricIndex = -1;
  state.focusLyricsLastPresentationIndex = -1;
  state.focusLyricsActiveDomIndexes = new Set();
  els.focusLyricsList.innerHTML = lyrics.lines.map((line, index) => lyricLineHtml(line, index, { granular: true })).join("");
  state.focusLyricsLineElements = [...els.focusLyricsList.querySelectorAll(".lyric-line")];
  for (const element of state.focusLyricsLineElements) element.style.setProperty("--line-opacity", ".08");
  updateFocusLyricsActive();
  updateLyricsSyncButtonVisibility();
}

function updateFocusLyricsActive() {
  const result = state.lyrics;
  if (!result?.synced || !usesAudioTimeline()) return;
  const lines = result.lines || [];
  if (!lines.length) return;

  const now = lyricsTimelineNow();
  const playback = lyricPlaybackState(lines, now);
  const activeIndex = playback.targetIndex;
  const changed = activeIndex !== state.focusActiveLyricIndex;
  const playbackSignature = `${[...playback.active].join(",")}|${[...playback.visibleBackground].join(",")}`;
  const presentationChanged = changed || playbackSignature !== state.focusLyricsPlaybackSignature;
  state.focusLyricsPlaybackSignature = playbackSignature;
  state.focusActiveLyricIndex = activeIndex;
  if (presentationChanged) {
    const previouslyActive = state.focusLyricsActiveDomIndexes || new Set();
    const currentlyActive = new Set([...playback.active, ...playback.visibleBackground]);
    const touchedIndexes = new Set([...previouslyActive, ...currentlyActive]);
    for (const center of [state.focusLyricsLastPresentationIndex, activeIndex]) {
      if (center < 0) continue;
      for (let index = Math.max(0, center - 6); index <= Math.min(lines.length - 1, center + 6); index += 1) {
        touchedIndexes.add(index);
      }
    }
    for (const lineIndex of touchedIndexes) {
      const element = state.focusLyricsLineElements?.[lineIndex];
      if (!element) continue;
      const backgroundActive = playback.visibleBackground.has(lineIndex);
      const active = playback.active.has(lineIndex);
      element.classList.toggle("active", active);
      element.classList.toggle("background-active", backgroundActive);
      element.style.setProperty("--line-opacity", String(active
        ? 1
        : Math.max(0.08, 0.3 - Math.abs(lineIndex - activeIndex) * 0.055)));
      if (active || backgroundActive) updateWordHighlights(element, now);
      else if (previouslyActive.has(lineIndex)) resetLyricWordHighlights(element);
      if (lineIndex === activeIndex && state.focusLyricsAutoSync && changed) scrollFocusLyricIntoView(element);
    }
    state.focusLyricsActiveDomIndexes = currentlyActive;
    state.focusLyricsLastPresentationIndex = activeIndex;
    return;
  }
  for (const lineIndex of new Set([...playback.active, ...playback.visibleBackground])) {
    const element = state.focusLyricsLineElements?.[lineIndex];
    if (element) updateWordHighlights(element, now);
  }
}

// ── Desktop Lyrics Widget ──
function scrollFocusLyricIntoView(element) {
  const list = els.focusLyricsList;
  if (!list || !element) return;
  const target = element.offsetTop - list.clientHeight * 0.35 + element.offsetHeight / 2;
  state.focusLyricsProgrammaticScroll = true;
  window.clearTimeout(state.focusLyricsProgrammaticTimer);
  animateLyricScroll(list, target, "focusLyricsScrollAnimationFrame");
  state.focusLyricsProgrammaticTimer = window.setTimeout(() => {
    state.focusLyricsProgrammaticScroll = false;
  }, 780);
}

function focusActiveLyricElement() {
  if (state.focusActiveLyricIndex < 0) return null;
  return state.focusLyricsLineElements?.[state.focusActiveLyricIndex] || null;
}

function setFocusLyricsAutoSync(enabled) {
  state.focusLyricsAutoSync = Boolean(enabled);
  if (!state.focusLyricsAutoSync) {
    if (state.focusLyricsScrollAnimationFrame) cancelAnimationFrame(state.focusLyricsScrollAnimationFrame);
    state.focusLyricsScrollAnimationFrame = 0;
    window.clearTimeout(state.focusLyricsProgrammaticTimer);
    state.focusLyricsProgrammaticScroll = false;
  }
  updateLyricsSyncButtonVisibility();
}

let lyricWidgetActive = false;

async function toggleLyricWidget() {
  try {
    const res = await window.metro.toggleLyricWindow();
    lyricWidgetActive = res.active;
    updateLyricWidgetButtonState();
    syncLyricWidget();
  } catch (err) {
    console.error("Failed to toggle lyric widget:", err);
  }
}

function updateLyricWidgetButtonState() {
  const btn = els.lyricWidgetButton;
  if (!btn) return;
  btn.classList.toggle("active", lyricWidgetActive);
}

function syncLyricWidget() {
  if (!lyricWidgetActive) return;
  const widgetSettings = {
    opacity: state.settings.desktopLyricsOpacity,
    font: state.settings.desktopLyricsFont
  };

  const result = state.lyrics;
  if (!result || !result.found || !result.lines?.length) {
    const trackTitle = state.currentTrack?.title || "";
    window.metro.updateLyricText({
      trackId: state.currentTrack?.id || "",
      trackTitle,
      position: currentPlaybackSeconds(),
      playing: state.playing,
      playbackRate: els.audio.playbackRate || 1,
      sentAt: Date.now(),
      lines: [],
      currentLine: trackTitle || "Auralane",
      nextLine: state.currentTrack ? (state.currentTrack.subtitle || state.currentTrack.artist || "") : "",
      themeColor: getThemeColorHex(),
      settings: widgetSettings
    });
    return;
  }

  const activeIndex = state.activeLyricIndex;
  const lines = result.lines;

  const currentLine = activeIndex >= 0 ? lines[activeIndex].text : (state.currentTrack?.title || "Auralane");
  const translation = activeIndex >= 0 ? translatedTextForLine(activeIndex) : "";
  const nextLine = translation || ((activeIndex + 1 < lines.length) ? lines[activeIndex + 1].text : "");

  window.metro.updateLyricText({
    trackId: state.currentTrack?.id || "",
    trackTitle: state.currentTrack?.title || "",
    position: lyricsTimelineNow(),
    playing: state.playing,
    playbackRate: els.audio.playbackRate || 1,
    sentAt: Date.now(),
    lines: lines.map((line, index) => {
      const alignedWords = alignedTimedLyricSegments(line);
      return {
        key: `${state.currentTrack?.id || "lyrics"}:${index}:${line.time ?? ""}`,
        time: line.time,
        text: line.text,
        words: alignedWords.map((word) => ({
          text: word.displayText || word.text,
          start: word.start,
          end: word.end,
          prefix: word.prefix,
          suffix: word.suffix
        })),
        translation: translatedTextForLine(index),
        romanization: romanizedTextForLine(index)
      };
    }),
    currentLine,
    nextLine,
    themeColor: getThemeColorHex(),
    settings: widgetSettings
  });
}

function getThemeColorHex() {
  const color = getComputedStyle(document.documentElement).getPropertyValue("--theme-color").trim();
  const rgb = color.split(",").map((value) => Number(value.trim()));
  return rgbToHex(rgb);
}

// Listen to widget close events from main process
window.metro.onLyricWidgetClosed(() => {
  lyricWidgetActive = false;
  updateLyricWidgetButtonState();
});

// ── Sleep Timer ──
let sleepTimer = null;
let sleepTimeRemaining = 0;
let originalVolumeBeforeFade = 1.0;

function toggleSleepMenu() {
  const menu = document.getElementById("sleepMenu");
  if (menu) menu.classList.toggle("hidden");
}

function updateSleepButtonState() {
  const btn = els.sleepButton;
  const countdownEl = document.getElementById("sleepCountdown");
  if (!btn) return;

  if (sleepTimeRemaining > 0) {
    btn.classList.add("active");
    if (countdownEl) {
      countdownEl.classList.remove("hidden");
      const mins = Math.floor(sleepTimeRemaining / 60);
      const secs = sleepTimeRemaining % 60;
      countdownEl.textContent = `剩餘時間：${mins}:${secs.toString().padStart(2, "0")}`;
    }
  } else {
    btn.classList.remove("active");
    if (countdownEl) countdownEl.classList.add("hidden");
  }
}

function setSleepTimer(minutes) {
  if (sleepTimer) {
    clearInterval(sleepTimer);
    sleepTimer = null;
  }

  const options = document.querySelectorAll(".sleep-option");
  options.forEach(opt => {
    opt.classList.toggle("active", Number(opt.dataset.time) === minutes);
  });

  if (minutes === 0) {
    sleepTimeRemaining = 0;
    updateSleepButtonState();
    toast("睡眠定時已關閉 🌙");
    return;
  }

  sleepTimeRemaining = minutes * 60;
  originalVolumeBeforeFade = els.volumeBar ? Number(els.volumeBar.value) : 1.0;
  updateSleepButtonState();
  toast(`已設定 ${minutes} 分鐘後自動暫停 🌙`);

  sleepTimer = setInterval(() => {
    if (sleepTimeRemaining > 0) {
      sleepTimeRemaining--;

      // Update countdown UI
      updateSleepButtonState();

      // Fade out volume in the last 5 seconds
      if (sleepTimeRemaining <= 5 && state.playing && state.playbackMode !== "embed") {
        const volumeFactor = sleepTimeRemaining / 5; // smooth factor from 1.0 down to 0
        els.audio.volume = originalVolumeBeforeFade * volumeFactor;
      }

      if (sleepTimeRemaining === 0) {
        clearInterval(sleepTimer);
        sleepTimer = null;

        // Pause playback
        if (state.playing) {
          if (state.playbackMode === "embed") {
            stopEmbedPlayer();
            state.playing = false;
            state.playbackMode = "idle";
            renderNow();
          } else {
            els.audio.pause();
          }
        }

        // Restore volume
        els.audio.volume = originalVolumeBeforeFade;
        if (els.volumeBar) els.volumeBar.value = originalVolumeBeforeFade;

        updateSleepButtonState();
        toast("睡眠時間到，已自動停止播放 🌙");
      }
    }
  }, 1000);
}

// ── NEW: DSP (Web Audio API) ──
let audioCtx = null;
let sourceNode = null;
let eqNodes = [];
let compressorNode = null;
let analyserNode = null;
let visualizerData = null;
let visualizerTimeData = null;
let visualizerReq = null;
let visualizerLastFrameAt = 0;
let visualizerIdleReset = false;
let smoothedBass = 0;
let squareCoverLoudness = 0;
let squareCoverSway = 0;
let squareCoverSwayTarget = 0;
let squareCoverSwayDirection = 1;
let squareCoverLastBeatAt = 0;
let squareCoverBeatPulse = 0;
let squareCoverSnarePulse = 0;
let squareCoverHighPulse = 0;
let squareCoverPreviousSpectrum = null;
let squareCoverAnalysisTrackId = "";
let squareCoverAnalysisFrameAt = 0;
let squareCoverBeatIntervals = [];
let squareCoverBeatPeriod = 0;
let squareCoverBeatConfidence = 0;
let squareCoverBandState = null;
let vinylWaveCanvas = null;
let lastVinylWaveDrawAt = 0;
let vinylWaveTrackId = "";
let vinylWaveEnergyLow = null;
let vinylWaveEnergyHigh = null;
let vinylWaveEnvelope = 0;
let vinylWaveShape = null;
let vinylWavePreviousSpectrum = null;

function resetSquareCoverAnalysis(trackId = "") {
  squareCoverAnalysisTrackId = String(trackId || "");
  squareCoverPreviousSpectrum = null;
  squareCoverAnalysisFrameAt = 0;
  squareCoverBeatIntervals = [];
  squareCoverBeatPeriod = 0;
  squareCoverBeatConfidence = 0;
  squareCoverLastBeatAt = 0;
  squareCoverBeatPulse = 0;
  squareCoverSnarePulse = 0;
  squareCoverHighPulse = 0;
  squareCoverBandState = {
    low: { energy: 0, fluxMean: .002, fluxDeviation: .001 },
    mid: { energy: 0, fluxMean: .002, fluxDeviation: .001 },
    high: { energy: 0, fluxMean: .002, fluxDeviation: .001 }
  };
}

function medianNumber(values = []) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function analyseSquareCoverSpectrum(spectrum, now) {
  if (!analyserNode || !audioCtx || !spectrum?.length) return null;
  const trackId = state.currentTrack?.id || "";
  if (squareCoverAnalysisTrackId !== String(trackId) ||
      !squareCoverBandState || squareCoverPreviousSpectrum?.length !== spectrum.length) {
    resetSquareCoverAnalysis(trackId);
  }

  const previous = squareCoverPreviousSpectrum;
  squareCoverPreviousSpectrum = Uint8Array.from(spectrum);
  const elapsed = squareCoverAnalysisFrameAt ? Math.min(80, Math.max(8, now - squareCoverAnalysisFrameAt)) : 16.7;
  squareCoverAnalysisFrameAt = now;
  if (!previous) return { low: { energy: 0, onset: 0 }, mid: { energy: 0, onset: 0 }, high: { energy: 0, onset: 0 }, elapsed };

  const nyquist = audioCtx.sampleRate / 2;
  const hzPerBin = nyquist / spectrum.length;
  const ranges = {
    low: [35, 180],
    mid: [180, 2200],
    high: [2200, Math.min(10000, nyquist)]
  };
  const result = { elapsed };
  for (const [name, [minimumHz, maximumHz]] of Object.entries(ranges)) {
    const first = Math.max(1, Math.floor(minimumHz / hzPerBin));
    const last = Math.min(spectrum.length - 1, Math.ceil(maximumHz / hzPerBin));
    let power = 0;
    let positiveFlux = 0;
    let bins = 0;
    for (let index = first; index <= last; index += 1) {
      const current = Number(spectrum[index] || 0) / 255;
      const before = Number(previous[index] || 0) / 255;
      power += current * current;
      // Half-wave rectification ignores decays and keeps actual attacks.
      positiveFlux += Math.max(0, current - before);
      bins += 1;
    }
    const rawEnergy = bins ? Math.sqrt(power / bins) : 0;
    const flux = bins ? positiveFlux / bins : 0;
    const band = squareCoverBandState[name];
    band.energy += (rawEnergy - band.energy) * (rawEnergy > band.energy ? .32 : .075);
    const baseline = band.fluxMean;
    const deviation = Math.max(.0008, band.fluxDeviation);
    const threshold = baseline + deviation * 1.45;
    const onset = Math.max(0, Math.min(1, (flux - threshold) / (deviation * 5 + .0035)));
    const difference = Math.abs(flux - baseline);
    band.fluxMean += (flux - band.fluxMean) * (flux > band.fluxMean ? .025 : .075);
    band.fluxDeviation += (difference - band.fluxDeviation) * .055;
    result[name] = { energy: band.energy, flux, onset };
  }
  return result;
}

function updateSquareCoverBeatClock(onsetStrength, now) {
  if (onsetStrength < .2 || now - squareCoverLastBeatAt < 120) return false;
  if (squareCoverLastBeatAt) {
    const interval = now - squareCoverLastBeatAt;
    if (interval >= 240 && interval <= 1200) {
      squareCoverBeatIntervals.push(interval);
      if (squareCoverBeatIntervals.length > 10) squareCoverBeatIntervals.shift();
      const period = medianNumber(squareCoverBeatIntervals);
      const averageError = squareCoverBeatIntervals.reduce((total, value) =>
        total + Math.min(1, Math.abs(value - period) / Math.max(1, period)), 0) /
        squareCoverBeatIntervals.length;
      squareCoverBeatPeriod = period;
      squareCoverBeatConfidence = Math.max(0, Math.min(1, 1 - averageError * 2.4));
    }
  }
  squareCoverLastBeatAt = now;
  return true;
}

function fillPlaybackFallbackSpectrum(target) {
  const data = target?.length ? target : new Uint8Array(128);
  const clock = Math.max(performance.now() / 1000, currentPlaybackSeconds());
  for (let index = 0; index < data.length; index += 1) {
    const frequencyFalloff = 1 - index / Math.max(1, data.length) * .58;
    const primary = (Math.sin(clock * 6.8 + index * .73) + 1) * .5;
    const secondary = (Math.sin(clock * 11.7 - index * .39) + 1) * .5;
    data[index] = Math.round((42 + primary * 92 + secondary * 48) * frequencyFalloff);
  }
  return data;
}

function fillPlaybackFallbackWaveform(target) {
  const data = target?.length ? target : new Uint8Array(256);
  const clock = Math.max(performance.now() / 1000, currentPlaybackSeconds());
  for (let index = 0; index < data.length; index += 1) {
    const phase = index / data.length * Math.PI * 2;
    const sample = Math.sin(phase * 5 + clock * 7.1) * .52 +
      Math.sin(phase * 11 - clock * 4.3) * .3 +
      Math.sin(phase * 19 + clock * 2.7) * .18;
    data[index] = Math.max(0, Math.min(255, Math.round(128 + sample * 78)));
  }
  return data;
}

function updateVinylWave(data = null, waveform = null) {
  if (!vinylWaveCanvas) vinylWaveCanvas = document.querySelector("canvas.lyrics-vinyl-wave");
  const canvas = vinylWaveCanvas;
  if (!canvas || !state.lyricsExpanded || state.settings.lyricsFullscreenCover !== "vinyl") return;
  const now = performance.now();
  if (data && now - lastVinylWaveDrawAt < 40) return;
  lastVinylWaveDrawAt = now;
  // Use stable layout dimensions. A transformed bounding box changes with the
  // beat and would resize the canvas again on the following frame.
  const rect = { width: canvas.offsetWidth, height: canvas.offsetHeight };
  if (rect.width < 2 || rect.height < 2) return;
  const dpr = 1;
  const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
  const pixelHeight = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  const context = canvas.getContext("2d");
  if (!context) return;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const canvasRadius = Math.min(rect.width, rect.height) / 2;
  const coverWidth = canvas.parentElement?.offsetWidth || rect.width;
  const coverHeight = canvas.parentElement?.offsetHeight || rect.height;
  const baseRadius = Math.max(12, Math.min(coverWidth, coverHeight) / 2 + 2);
  const availableAmplitude = Math.max(8, canvasRadius - baseRadius - 5);
  const activeTrackId = state.currentTrack?.id || "";
  if (vinylWaveTrackId !== activeTrackId) {
    vinylWaveTrackId = activeTrackId;
    vinylWaveEnergyLow = null;
    vinylWaveEnergyHigh = null;
    vinylWaveEnvelope = 0;
    vinylWaveShape = null;
    vinylWavePreviousSpectrum = null;
  }
  const rawEnergy = data?.length
    ? data.reduce((total, value) => total + value, 0) / data.length / 255
    : 0;
  if (vinylWaveEnergyLow == null || vinylWaveEnergyHigh == null) {
    vinylWaveEnergyLow = rawEnergy;
    vinylWaveEnergyHigh = rawEnergy;
  } else {
    // Catch new extremes quickly, then let the window drift slowly so quieter
    // and louder song sections continue to use the full visual range.
    vinylWaveEnergyLow = rawEnergy < vinylWaveEnergyLow
      ? rawEnergy
      : vinylWaveEnergyLow * .997 + rawEnergy * .003;
    vinylWaveEnergyHigh = rawEnergy > vinylWaveEnergyHigh
      ? rawEnergy
      : vinylWaveEnergyHigh * .994 + rawEnergy * .006;
  }
  const adaptiveRange = Math.max(.055, vinylWaveEnergyHigh - vinylWaveEnergyLow);
  const targetEnvelope = Math.max(0, Math.min(1, (rawEnergy - vinylWaveEnergyLow) / adaptiveRange));
  vinylWaveEnvelope += (targetEnvelope - vinylWaveEnvelope) * (targetEnvelope > vinylWaveEnvelope ? .55 : .18);
  context.beginPath();
  context.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
  context.strokeStyle = "rgba(255,255,255,.5)";
  context.lineWidth = 1.5;
  context.stroke();

  const pointCount = 432;
  const points = [];
  // Build a non-mirrored audio ring. Low, mid and high bins are deliberately
  // interleaved around the circle, so frequency order cannot produce one large
  // bass side and one nearly-flat treble side. Every lobe still comes from a
  // real spectrum bin and retains its own attack/release envelope.
  const spectrumValues = data?.length ? data : new Uint8Array(128);
  const previousSpectrum = vinylWavePreviousSpectrum?.length === spectrumValues.length
    ? vinylWavePreviousSpectrum
    : spectrumValues;
  vinylWavePreviousSpectrum = Uint8Array.from(spectrumValues);
  const waveformValues = waveform?.length ? waveform : new Uint8Array(256).fill(128);
  const lobeCount = 144;
  const rawLobes = new Float32Array(lobeCount);
  const usefulLastBin = Math.max(8, Math.floor(spectrumValues.length * .72));
  const bandRanges = [
    [1, Math.max(3, Math.floor(usefulLastBin * .09))],
    [Math.max(3, Math.floor(usefulLastBin * .09)), Math.max(6, Math.floor(usefulLastBin * .34))],
    [Math.max(6, Math.floor(usefulLastBin * .34)), usefulLastBin]
  ];
  for (let lobe = 0; lobe < lobeCount; lobe += 1) {
    const bandIndex = lobe % bandRanges.length;
    const [bandStart, bandEnd] = bandRanges[bandIndex];
    const sequenceIndex = Math.floor(lobe / bandRanges.length);
    // Golden-ratio stepping prevents mirrored/repeating shapes while remaining
    // deterministic enough that the ring does not look randomly shuffled.
    const position = (sequenceIndex * .61803398875 + bandIndex * .217 + .083) % 1;
    const spectrumIndex = Math.min(spectrumValues.length - 1,
      bandStart + Math.floor(position * Math.max(1, bandEnd - bandStart)));
    let energy = 0;
    let flux = 0;
    let samples = 0;
    for (let offset = -1; offset <= 1; offset += 1) {
      const index = Math.max(0, Math.min(spectrumValues.length - 1, spectrumIndex + offset));
      const current = Number(spectrumValues[index] || 0) / 255;
      const before = Number(previousSpectrum[index] || 0) / 255;
      energy += current;
      flux += Math.max(0, current - before);
      samples += 1;
    }
    const waveformIndex = Math.floor(((lobe * 67) % lobeCount) / lobeCount * waveformValues.length);
    const waveformAccent = Math.abs((Number(waveformValues[waveformIndex] || 128) - 128) / 128);
    const bandGain = bandIndex === 0 ? .82 : bandIndex === 1 ? 1 : 1.18;
    rawLobes[lobe] = ((energy / samples) * .7 + (flux / samples) * 2.25 + waveformAccent * .13) * bandGain;
  }

  const orderedLobes = [...rawLobes].sort((left, right) => left - right);
  const shapeLow = orderedLobes[Math.floor(orderedLobes.length * .12)] || 0;
  const shapeHigh = orderedLobes[Math.floor(orderedLobes.length * .9)] || shapeLow + .01;
  const shapeRange = Math.max(.025, shapeHigh - shapeLow);
  const contrastedTargets = new Float32Array(lobeCount);
  for (let index = 0; index < lobeCount; index += 1) {
    const normalized = Math.max(0, Math.min(1, (rawLobes[index] - shapeLow) / shapeRange));
    // Expand local differences without forcing the entire ring to maximum size.
    contrastedTargets[index] = Math.max(0, Math.min(1, (Math.pow(normalized, .82) - .38) * 1.48 + .38));
  }
  if (!vinylWaveShape || vinylWaveShape.length !== lobeCount) vinylWaveShape = new Float32Array(lobeCount);
  for (let index = 0; index < lobeCount; index += 1) {
    const previousIndex = (index - 1 + lobeCount) % lobeCount;
    const nextIndex = (index + 1) % lobeCount;
    // Only a slight circular blend removes the first/last seam; most of each
    // peak remains independent so neighbouring waves keep visible contrast.
    const target = contrastedTargets[index] * .88 +
      contrastedTargets[previousIndex] * .06 + contrastedTargets[nextIndex] * .06;
    vinylWaveShape[index] += (target - vinylWaveShape[index]) *
      (target > vinylWaveShape[index] ? .56 : .17);
  }
  for (let index = 0; index < pointCount; index += 1) {
    const phase = index / pointCount;
    const angle = phase * Math.PI * 2 - Math.PI / 2;
    const sourcePosition = phase * lobeCount;
    const sourceIndex = Math.floor(sourcePosition) % lobeCount;
    const sourceNextIndex = (sourceIndex + 1) % lobeCount;
    const sourceMix = sourcePosition - Math.floor(sourcePosition);
    const strength = vinylWaveShape[sourceIndex] * (1 - sourceMix) +
      vinylWaveShape[sourceNextIndex] * sourceMix;
    const expandedEnvelope = Math.max(0, Math.min(1, (vinylWaveEnvelope - .1) * 1.65));
    const visualStrength = Math.max(0, Math.min(1, strength * (.28 + expandedEnvelope * .72)));
    const amplitude = Math.min(availableAmplitude, 2 + visualStrength * availableAmplitude * .94);
    const radius = baseRadius + amplitude;
    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  }
  const first = points[0];
  const last = points[points.length - 1];
  context.beginPath();
  context.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);
  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const next = points[(index + 1) % points.length];
    context.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
  }
  context.closePath();
  context.fillStyle = "rgba(255,255,255,.22)";
  context.fill();
  context.strokeStyle = "rgba(255,255,255,.78)";
  context.lineWidth = 2.4;
  context.lineJoin = "round";
  context.shadowColor = "rgba(255,255,255,.16)";
  context.shadowBlur = 4;
  context.stroke();
}

function restoreSkipSilenceRate() {
  state.skipSilenceStartedAt = 0;
  if (!state.skipSilenceBoosted) return;
  state.skipSilenceBoosted = false;
  els.audio.playbackRate = state.settings.dspSpeed || 1.0;
}

function updateSkipSilence() {
  if (!state.settings.skipSilence || !state.playing || state.seeking || !visualizerData || (els.audio.currentTime || 0) < 1) {
    restoreSkipSilenceRate();
    return;
  }
  const energy = visualizerData.reduce((sum, value) => sum + value, 0) / Math.max(1, visualizerData.length);
  if (energy > 3) {
    restoreSkipSilenceRate();
    return;
  }
  const now = performance.now();
  if (!state.skipSilenceStartedAt) state.skipSilenceStartedAt = now;
  if (!state.skipSilenceBoosted && now - state.skipSilenceStartedAt >= 1200) {
    state.skipSilenceBoosted = true;
    const baseSpeed = state.settings.dspSpeed || 1.0;
    els.audio.playbackRate = Math.min(4, Math.max(baseSpeed, baseSpeed * 3));
  }
}

function initDSP() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioCtx.createMediaElementSource(els.audio);

    // Create 10 EQ bands
    const frequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    eqNodes = frequencies.map((freq) => {
      const filter = audioCtx.createBiquadFilter();
      filter.type = "peaking";
      filter.frequency.value = freq;
      filter.Q.value = 1.0;
      filter.gain.value = 0;
      return filter;
    });

    // Create Compressor for Normalization
    compressorNode = audioCtx.createDynamicsCompressor();
    compressorNode.threshold.value = -24;
    compressorNode.knee.value = 30;
    compressorNode.ratio.value = 12;
    compressorNode.attack.value = 0.003;
    compressorNode.release.value = 0.25;

    // Create Analyser for Visualizer
    analyserNode = audioCtx.createAnalyser();
    // 2048 samples provide enough real frequency resolution to distinguish
    // sub/bass attacks from mid percussion. Lower analyser smoothing preserves
    // transients; visual smoothing is handled independently below.
    analyserNode.fftSize = 2048;
    analyserNode.smoothingTimeConstant = .28;
    analyserNode.maxDecibels = -10; // Prevent clipping at high volumes
    analyserNode.minDecibels = -90;
    visualizerData = new Uint8Array(analyserNode.frequencyBinCount);
    visualizerTimeData = new Uint8Array(analyserNode.fftSize);

    // Connect: source -> EQ1 -> ... -> EQ10 -> Compressor -> Analyser -> Destination
    let currentNode = sourceNode;
    for (const node of eqNodes) {
      currentNode.connect(node);
      currentNode = node;
    }

    currentNode.connect(compressorNode);
    compressorNode.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);

    applySelectedAudioOutput().catch((error) => {
      if (state.settings.debugLogs) console.warn("Audio output sink failed after DSP init", error);
    });
    if (!visualizerReq) updateVisualizer();
  } catch (error) {
    if (state.settings.debugLogs) console.error("DSP Init failed:", error);
  }
}

function updateVisualizer(timestamp = performance.now()) {
  visualizerReq = requestAnimationFrame(updateVisualizer);
  if (!state.playing || !els.nowArt) {
    // A paused player used to rewrite all reactive-cover styles on every RAF.
    // Reset once, then leave the main thread free for menus and scrolling.
    if (visualizerIdleReset) return;
    visualizerIdleReset = true;
    visualizerLastFrameAt = timestamp;
    restoreSkipSilenceRate();
    if (els.nowArt) els.nowArt.style.transform = `scale(1)`;
    if (els.focusArt) els.focusArt.style.setProperty("--focus-art-scale", "1");
    const bgGlow = document.getElementById("bgGlow");
    if (bgGlow) {
      bgGlow.style.opacity = 1;
      bgGlow.style.transform = `scale(1)`;
    }
    const focusBg = document.querySelector(".focus-bg");
    if (focusBg) {
      focusBg.style.transform = `scale(1)`;
      focusBg.style.opacity = 0.65;
    }
    if (els.lyricsFullscreenCoverArt) {
      els.lyricsFullscreenCoverArt.style.setProperty("--cover-beat-scale", "1");
      els.lyricsFullscreenCoverArt.style.setProperty("--cover-beat-brightness", "1");
      els.lyricsFullscreenCoverArt.style.setProperty("--cover-shake-x", "0px");
      els.lyricsFullscreenCoverArt.style.setProperty("--cover-shake-y", "0px");
      els.lyricsFullscreenCoverArt.style.setProperty("--cover-shake-rotate", "0deg");
      els.lyricsFullscreenCoverArt.style.setProperty("--cover-reactive-glow", "0");
      els.lyricsFullscreenCoverArt.style.setProperty("--cover-glow-blur", "8px");
      els.lyricsFullscreenCoverArt.style.setProperty("--cover-glow-alpha", ".04");
      els.lyricsFullscreenCoverArt.style.removeProperty("transform");
    }
    updateVinylWave();
    smoothedBass = 0;
    squareCoverLoudness = 0;
    squareCoverSway = 0;
    squareCoverSwayTarget = 0;
    resetSquareCoverAnalysis();
    if (state.lyricsTimelineEditing) drawLyricsTimelineWaveform();
    return;
  }
  visualizerIdleReset = false;
  const lyricsSourceMenuOpen = Boolean(
    state.lyricsExpanded && els.lyricsVersionMenu &&
    !els.lyricsVersionMenu.classList.contains("hidden")
  );
  // Fullscreen cover analysis is intentionally capped below display refresh.
  // While the source picker is open, favour pointer/hover response and retain
  // a lightweight 15 fps ambient animation behind the menu.
  const visualizerFrameInterval = lyricsSourceMenuOpen ? 66 : state.lyricsExpanded ? 33 : 16;
  if (timestamp - visualizerLastFrameAt < visualizerFrameInterval) return;
  visualizerLastFrameAt = timestamp;

  let hasAnalyserSpectrum = Boolean(analyserNode && visualizerData);
  if (hasAnalyserSpectrum) {
    analyserNode.getByteFrequencyData(visualizerData);
    if (!visualizerTimeData || visualizerTimeData.length !== analyserNode.fftSize) {
      visualizerTimeData = new Uint8Array(analyserNode.fftSize);
    }
    analyserNode.getByteTimeDomainData(visualizerTimeData);
  }
  if (!visualizerData?.length) visualizerData = new Uint8Array(128);
  if (!hasAnalyserSpectrum || !visualizerData.some((value) => value > 2)) {
    visualizerData = fillPlaybackFallbackSpectrum(visualizerData);
    visualizerTimeData = fillPlaybackFallbackWaveform(visualizerTimeData);
    hasAnalyserSpectrum = false;
  }
  updateVinylWave(visualizerData, visualizerTimeData);
  if (hasAnalyserSpectrum) updateSkipSilence();
  else restoreSkipSilenceRate();

  // Calculate Bass (low frequencies, e.g. bins 0 to 2)
  let bass = 0;
  for (let i = 0; i < 3; i++) {
    bass += visualizerData[i];
  }
  bass = bass / 3;

  // Smoothing: fast attack, slow release
  if (bass > smoothedBass) {
    smoothedBass = smoothedBass * 0.2 + bass * 0.8; // Fast attack but slightly smoothed to prevent harsh jitter
  } else {
    smoothedBass = smoothedBass * 0.85 + bass * 0.15; // Smooth release
  }

  // Normalize bass to a 0-1 range (saturate at 220)
  // Since we set maxDecibels to -10, it will rarely hit 255 constantly.
  const normalizedBass = Math.min(1, smoothedBass / 220);
  const duration = Number(els.audio.duration || 0);
  if (duration > 0 && state.lyricsWaveformPeaks?.length) {
    const peakIndex = Math.min(
      state.lyricsWaveformPeaks.length - 1,
      Math.max(0, Math.floor((els.audio.currentTime / duration) * state.lyricsWaveformPeaks.length))
    );
    const average = visualizerData.reduce((total, value) => total + value, 0) / Math.max(1, visualizerData.length * 255);
    state.lyricsWaveformPeaks[peakIndex] = Math.max(state.lyricsWaveformPeaks[peakIndex] || 0, average);
  }
  if (state.lyricsTimelineEditing) drawLyricsTimelineWaveform();

  // Scale Album Art (up to 1.1x for strong bass)
  const scale = 1 + normalizedBass * 0.1;
  els.nowArt.style.transform = `scale(${scale})`;

  // Pulse Background Glow
  const bgGlow = document.getElementById("bgGlow");
  if (bgGlow) {
    bgGlow.style.opacity = 0.5 + normalizedBass * 0.4;
    bgGlow.style.transform = `scale(${1 + normalizedBass * 0.05})`;
  }

  // Pulse Focus Mode Album Art & Glow Backdrop
  if (els.focusMode && !els.focusMode.classList.contains("hidden")) {
    if (els.focusArt) {
      els.focusArt.style.setProperty("--focus-art-scale", String(1 + normalizedBass * 0.08));
    }
    const focusBg = document.querySelector(".focus-bg");
    if (focusBg) {
      focusBg.style.transform = `scale(${1 + normalizedBass * 0.06})`;
      focusBg.style.opacity = 0.6 + normalizedBass * 0.25;
    }
  }

  // Vibrate / Pulse Lyrics Fullscreen Cover Art with the beat
  if (els.lyricsFullscreenCoverArt && state.lyricsExpanded) {
    const vinylMode = state.settings.lyricsFullscreenCover === "vinyl";
    const spectrumRms = Math.sqrt(
      visualizerData.reduce((total, value) => total + value * value, 0) /
      Math.max(1, visualizerData.length)
    ) / 255;
    const loudness = Math.max(0, Math.min(1, (spectrumRms - .055) / .42));
    squareCoverLoudness += (loudness - squareCoverLoudness) *
      (loudness > squareCoverLoudness ? .2 : .065);

    const now = performance.now();
    const analysis = hasAnalyserSpectrum ? analyseSquareCoverSpectrum(visualizerData, now) : null;
    const elapsed = analysis?.elapsed || 16.7;
    const lowOnset = analysis?.low?.onset || 0;
    const midOnset = analysis?.mid?.onset || 0;
    const highOnset = analysis?.high?.onset || 0;
    const kickStrength = lowOnset * Math.min(1, (analysis?.low?.energy || 0) * 2.2);
    const snareStrength = Math.min(1, midOnset * .72 + Math.min(midOnset, highOnset) * .55);
    const hatStrength = Math.min(1, highOnset * (1 - lowOnset * .35));
    const beatOnset = Math.max(kickStrength, snareStrength * .9);
    const beatTriggered = updateSquareCoverBeatClock(beatOnset, now);

    const kickDecay = Math.exp(-elapsed / 205);
    const snareDecay = Math.exp(-elapsed / 155);
    const highDecay = Math.exp(-elapsed / 95);
    squareCoverBeatPulse = Math.max(squareCoverBeatPulse * kickDecay, kickStrength);
    squareCoverSnarePulse = Math.max(squareCoverSnarePulse * snareDecay, snareStrength);
    squareCoverHighPulse = Math.max(squareCoverHighPulse * highDecay, hatStrength);

    // When beat intervals are consistent, preserve a subtle pulse on the beat
    // grid even if a single transient is masked by vocals or sustained bass.
    let trackedBeatPulse = 0;
    if (squareCoverBeatPeriod && squareCoverBeatConfidence > .5 && squareCoverLastBeatAt) {
      const phase = ((now - squareCoverLastBeatAt) % squareCoverBeatPeriod) / squareCoverBeatPeriod;
      trackedBeatPulse = Math.exp(-phase * 15) * squareCoverBeatConfidence;
    }

    // Mid-band attacks have the clearest side-to-side gesture. Bass attacks
    // add weight, while high-frequency events remain a small visual accent.
    if (!vinylMode && beatTriggered) {
      squareCoverSwayDirection *= -1;
      squareCoverSwayTarget += squareCoverSwayDirection *
        (kickStrength * 2.4 + snareStrength * 4.8);
    }
    squareCoverSwayTarget *= Math.exp(-elapsed / 220);
    squareCoverSway += (squareCoverSwayTarget - squareCoverSway) * Math.min(.38, elapsed / 62);

    // Loudness only supplies a restrained breathing baseline. Real low-band
    // attacks and the tracked beat produce the visible expansion.
    const rhythmicScale = Math.max(squareCoverBeatPulse, trackedBeatPulse * .48);
    const beatScale = 1 + (vinylMode
      ? normalizedBass * .035
      : Math.min(.18,
        squareCoverLoudness * .035 +
        (analysis?.low?.energy || 0) * .025 +
        rhythmicScale * .095 +
        squareCoverSnarePulse * .025));
    const beatBrightness = 1 + (vinylMode
      ? normalizedBass * .12
      : squareCoverLoudness * .045 + squareCoverHighPulse * .11);
    const shakeX = 0;
    const shakeY = 0;
    const shakeRotate = vinylMode ? 0 : squareCoverSway + squareCoverHighPulse * squareCoverSwayDirection * .22;

    els.lyricsFullscreenCoverArt.style.setProperty("--cover-beat-scale", beatScale.toFixed(4));
    els.lyricsFullscreenCoverArt.style.setProperty("--cover-beat-brightness", beatBrightness.toFixed(3));
    els.lyricsFullscreenCoverArt.style.setProperty("--cover-shake-x", `${shakeX.toFixed(3)}px`);
    els.lyricsFullscreenCoverArt.style.setProperty("--cover-shake-y", `${shakeY.toFixed(3)}px`);
    els.lyricsFullscreenCoverArt.style.setProperty("--cover-shake-rotate", `${shakeRotate.toFixed(3)}deg`);
    const reactiveGlow = vinylMode ? normalizedBass * .5 : Math.max(rhythmicScale, squareCoverHighPulse * .75);
    els.lyricsFullscreenCoverArt.style.setProperty("--cover-reactive-glow", reactiveGlow.toFixed(3));
    els.lyricsFullscreenCoverArt.style.setProperty("--cover-glow-blur", `${(8 + reactiveGlow * 28).toFixed(2)}px`);
    els.lyricsFullscreenCoverArt.style.setProperty("--cover-glow-alpha", (0.04 + reactiveGlow * .22).toFixed(3));
    if (vinylMode) {
      els.lyricsFullscreenCoverArt.style.removeProperty("transform");
    } else {
      // Match the older, pre-thumbnail-frame implementation: apply the full
      // transform directly every frame instead of relying on a CSS animation.
      els.lyricsFullscreenCoverArt.style.transform =
        `translate3d(${shakeX.toFixed(3)}px,calc(-50% + ${shakeY.toFixed(3)}px),0) ` +
        `rotate(${shakeRotate.toFixed(3)}deg) scale(${beatScale.toFixed(4)})`;
    }

    // 移除會觸發劇烈抖動動畫的強制重置部分
  }
}

// Keep cover feedback alive for embedded and proxied playback too. Those paths
// can play normally without ever producing a MediaElement analyser node.
if (!visualizerReq) updateVisualizer();

function updateDSP() {
  const s = state.settings;

  // Update EQ
  if (audioCtx) {
    const bands = s.dspEQ || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < eqNodes.length; i++) {
      if (eqNodes[i]) eqNodes[i].gain.value = bands[i];
    }

    // Update Normalize (Compressor)
    if (compressorNode) {
      if (s.dspNormalize) {
        compressorNode.threshold.value = -24;
        compressorNode.ratio.value = 12;
      } else {
        compressorNode.threshold.value = 0;
        compressorNode.ratio.value = 1;
      }
    }
  }

  // Update Speed and Pitch (Works even without audioCtx)
  els.audio.playbackRate = s.dspSpeed || 1.0;
  els.audio.preservesPitch = s.dspPreservePitch !== false;
}

if (els.settingsDSPNormalize) els.settingsDSPNormalize.addEventListener("change", (e) => applyBooleanSetting("dspNormalize", e.target.checked));
if (els.settingsSkipSilence) els.settingsSkipSilence.addEventListener("change", (event) => {
  applyBooleanSetting("skipSilence", event.target.checked);
  if (!event.target.checked) restoreSkipSilenceRate();
});
if (els.settingsDSPPreservePitch) els.settingsDSPPreservePitch.addEventListener("change", (e) => applyBooleanSetting("dspPreservePitch", e.target.checked));
if (els.settingsDSPSpeed) els.settingsDSPSpeed.addEventListener("input", (e) => {
  const speed = Number(e.target.value);
  state.settings.dspSpeed = speed;
  if (els.settingsDSPSpeedValue) els.settingsDSPSpeedValue.textContent = `${speed.toFixed(2)}x`;
  updateDSP();
  saveAppearanceSettings();
});
if (els.settingsDSPEQ) els.settingsDSPEQ.addEventListener("input", (e) => {
  if (e.target.matches("input[type='range']")) {
    const sliders = els.settingsDSPEQ.querySelectorAll("input[type='range']");
    state.settings.dspEQ = Array.from(sliders).map(s => Number(s.value));
    updateDSP();
    saveAppearanceSettings();
  }
});
if (els.settingsDSPResetEQ) els.settingsDSPResetEQ.addEventListener("click", () => {
  state.settings.dspEQ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  syncSettingsControls();
  saveAppearanceSettings();
});


function applySidebarState(collapsed = state.settings.sidebarCollapsed, persist = true) {
  state.settings.sidebarCollapsed = Boolean(collapsed);
  document.body.classList.toggle("sidebar-collapsed", state.settings.sidebarCollapsed);
  const label = state.settings.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar";
  els.sidebarCollapseButton?.setAttribute("aria-label", label);
  if (els.sidebarCollapseButton) {
    els.sidebarCollapseButton.title = label;
    els.sidebarCollapseButton.innerHTML = standardIconSvg(state.settings.sidebarCollapsed ? "panel-left-open" : "panel-left-close");
  }
  if (persist) saveAppearanceSettings();
}

function applyLyricsQuickSettings(persist = true) {
  document.body.dataset.lyricsBackground = state.settings.lyricsFullscreenBackground || "song";
  document.body.dataset.lyricsAlign = state.settings.lyricsFullscreenAlign || "auto";
  document.body.dataset.lyricsDisplay = state.settings.lyricsFullscreenDisplay || "scroll";
  document.body.dataset.lyricsCover = state.settings.lyricsFullscreenCover || "square";
  if (els.lyricsQuickBackground) els.lyricsQuickBackground.value = state.settings.lyricsFullscreenBackground || "song";
  if (els.lyricsQuickAlign) els.lyricsQuickAlign.value = state.settings.lyricsFullscreenAlign || "auto";
  if (els.lyricsQuickDisplay) els.lyricsQuickDisplay.value = state.settings.lyricsFullscreenDisplay || "scroll";
  if (els.lyricsQuickCover) els.lyricsQuickCover.value = state.settings.lyricsFullscreenCover || "square";
  if (els.lyricsQuickScale) els.lyricsQuickScale.value = String(state.settings.lyricsScale || 100);
  updateExpandedLyricsBackdrop();
  if (persist) saveAppearanceSettings();
}

function renderQualityBadge() {
  if (!els.nowQualityButton) return;
  if (!state.currentTrack) {
    els.nowQualityButton.textContent = String(state.settings.quality || "auto").replace("data-saver", "Saver");
    return;
  }
  if (state.currentTrack.local) {
    els.nowQualityButton.textContent = `${state.currentTrack.codec || "Local"}${state.currentTrack.bitrate ? ` ${Math.round(state.currentTrack.bitrate / 1000)}k` : ""}`;
  } else {
    const labels = { auto: "Auto", high: "High", balanced: "Balanced", "data-saver": "Saver" };
    els.nowQualityButton.textContent = `${labels[state.settings.quality] || "Auto"}${state.currentTrack.playbackBitrate ? ` · ${Math.round(state.currentTrack.playbackBitrate / 1000)}k` : ""}`;
  }
}

function renderUpdateEvent(event = {}) {
  if (!els.updateStatus) return;
  const type = event.type || "status";
  const messages = {
    checking: "Checking GitHub Releases…",
    available: `Version ${event.version || ""} is available.`,
    current: "Auralane is up to date.",
    downloaded: `Version ${event.version || ""} is ready to install.`,
    error: event.message || "Update check failed."
  };
  els.updateStatus.textContent = messages[type] || (type === "progress" ? `Downloading ${Math.round(event.percent || 0)}%` : "Updates are downloaded from GitHub Releases.");
  els.updateDownloadButton?.classList.toggle("hidden", type !== "available");
  els.updateInstallButton?.classList.toggle("hidden", type !== "downloaded");
  els.updateProgress?.classList.toggle("hidden", type !== "progress");
  if (type === "progress" && els.updateProgress) els.updateProgress.value = Number(event.percent || 0);
  if (type === "available") setAvailableUpdateVersion(event.version || "new");
  if (type === "current") setAvailableUpdateVersion("");
}

let availableUpdateVersion = "";
let settingsNavVisible = false;

function updateNoticeDismissalKey(version = availableUpdateVersion) {
  return version ? `auralane:update-notice-dismissed:${version}` : "";
}

function updateNoticeWasDismissed() {
  const key = updateNoticeDismissalKey();
  if (!key) return false;
  try { return localStorage.getItem(key) === "1"; } catch { return false; }
}

function renderSidebarUpdateNotice() {
  const available = Boolean(availableUpdateVersion);
  els.settingsNav?.classList.toggle("update-available", available);
  if (els.sidebarReleaseVersion) {
    els.sidebarReleaseVersion.textContent = availableUpdateVersion && availableUpdateVersion !== "new"
      ? `v${availableUpdateVersion}`
      : "";
  }
  const showNotice = available && !settingsNavVisible && !updateNoticeWasDismissed();
  els.sidebarReleaseNotice?.classList.toggle("hidden", !showNotice);
}

function setAvailableUpdateVersion(version = "") {
  availableUpdateVersion = String(version || "").replace(/^v/i, "");
  renderSidebarUpdateNotice();
}

function measureSettingsNavVisibility() {
  if (!els.sidebar || !els.settingsNav) return;
  const root = els.sidebar.getBoundingClientRect();
  const target = els.settingsNav.getBoundingClientRect();
  settingsNavVisible = target.top >= root.top && target.bottom <= root.bottom;
  renderSidebarUpdateNotice();
}

function setupSidebarUpdateNotice() {
  if (!els.sidebar || !els.settingsNav) return;
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      settingsNavVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.8);
      renderSidebarUpdateNotice();
    }, { root: els.sidebar, threshold: [0, 0.8, 1] });
    observer.observe(els.settingsNav);
  }
  els.sidebar.addEventListener("scroll", measureSettingsNavVisibility, { passive: true });
  window.addEventListener("resize", measureSettingsNavVisibility, { passive: true });
  requestAnimationFrame(measureSettingsNavVisibility);
}

els.sidebarCollapseButton?.addEventListener("click", () => applySidebarState(!state.settings.sidebarCollapsed));
els.sidebarReleaseDismiss?.addEventListener("click", (event) => {
  event.stopPropagation();
  const key = updateNoticeDismissalKey();
  if (key) {
    try { localStorage.setItem(key, "1"); } catch {}
  }
  renderSidebarUpdateNotice();
});
els.sidebarReleaseOpen?.addEventListener("click", () => {
  switchView("settings");
  showSettingsCategory("general");
  els.settingsNav?.scrollIntoView({ behavior: "smooth", block: "center" });
  requestAnimationFrame(() => els.githubUpdatesCard?.scrollIntoView({ behavior: "smooth", block: "center" }));
});
document.addEventListener("pointerdown", (event) => {
  if (!els.lyricsQuickSettings?.open) return;
  if (event.target.closest("#lyricsQuickSettings")) return;
  els.lyricsQuickSettings.open = false;
});
for (const [element, key, allowed] of [
  [els.lyricsQuickBackground, "lyricsFullscreenBackground", ["song", "theme", "plain"]],
  [els.lyricsQuickAlign, "lyricsFullscreenAlign", ["auto", "left", "center"]],
  [els.lyricsQuickDisplay, "lyricsFullscreenDisplay", ["scroll", "single"]],
  [els.lyricsQuickCover, "lyricsFullscreenCover", ["square", "vinyl"]]
]) element?.addEventListener("change", () => { if (allowed.includes(element.value)) state.settings[key] = element.value; applyLyricsQuickSettings(); });
els.lyricsQuickScale?.addEventListener("input", () => { applyLyricsScale(Number(els.lyricsQuickScale.value)); applyLyricsQuickSettings(); });

els.nowQualityButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!els.qualityMenu) return;
  const rect = els.nowQualityButton.getBoundingClientRect();
  els.qualityMenu.style.left = `${Math.max(12, rect.left)}px`;
  els.qualityMenu.style.bottom = `${window.innerHeight - rect.top + 7}px`;
  els.qualityMenu.classList.toggle("hidden");
});
els.qualityMenu?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-quality]");
  if (!button) return;
  const next = button.dataset.quality;
  if (!["auto", "high", "balanced", "data-saver"].includes(next)) return;
  const resumeAt = Number(els.audio.currentTime || 0);
  state.settings.quality = next;
  saveAppearanceSettings();
  syncSettingsControls();
  els.qualityMenu.classList.add("hidden");
  renderQualityBadge();
  if (state.currentTrack && !state.currentTrack.local && state.playbackMode !== "offline") await playTrack(state.currentTrack, { startTime: resumeAt });
});

els.localMusicSearchInput?.addEventListener("input", () => { state.localMusicQuery = els.localMusicSearchInput.value; renderLocalMusic(); });
els.localMusicSortSelect?.addEventListener("change", () => { state.localMusicSort = els.localMusicSortSelect.value; renderLocalMusic(); });
els.localMusicFolderSelect?.addEventListener("change", () => { state.localMusicFolder = els.localMusicFolderSelect.value; renderLocalMusic(); });
els.localMusicFolderButton?.addEventListener("click", () => scanLocalMusicFolder(true).catch((error) => toast(error.message, true)));
els.localMusicRescanButton?.addEventListener("click", () => scanLocalMusicFolder(false).catch((error) => toast(error.message, true)));
els.localMusicClearButton?.addEventListener("click", async () => {
  const hasLocalMusic = Boolean(state.localMusicData?.tracks?.length || state.localMusicData?.folders?.length);
  if (!hasLocalMusic || !window.metro?.clearLocalMusic) return;
  const confirmed = window.confirm("Clear all local music from Auralane? Your original audio files will not be deleted.");
  if (!confirmed) return;
  els.localMusicClearButton.disabled = true;
  try {
    state.localMusicData = await window.metro.clearLocalMusic();
    state.localMusicFolder = "";
    state.localMusicQuery = "";
    if (els.localMusicSearchInput) els.localMusicSearchInput.value = "";
    renderLocalMusic();
    toast("Local music cleared. Your original files were not deleted.");
  } catch (error) {
    toast(error.message || "Could not clear local music.", true);
  } finally {
    els.localMusicClearButton.disabled = false;
  }
});
els.localMusicLayoutButton?.addEventListener("click", () => { state.localMusicLayout = state.localMusicLayout === "grid" ? "list" : "grid"; renderLocalMusic(); });
els.localMusicPlayButton?.addEventListener("click", () => addToQueue(visibleLocalTracks({ ignoreSearch: true }), true, queueSource("local-music", "Local Music")));
els.localMusicLocateButton?.addEventListener("click", () => {
  const target = document.getElementById(`local-track-${state.currentTrack?.id || ""}`);
  if (!target) return;
  const container = target.closest(".main") || document.querySelector(".main") || target.closest(".view");
  scrollElementIntoContainerView(container, target, { smooth: true, block: "center" });
});
els.localMusicResults?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-local-play]");
  const track = els.localMusicResults._items?.[Number(button?.dataset.localPlay)];
  if (track) playTrackFromContext(track, els.localMusicResults._playbackItems || visibleLocalTracks({ ignoreSearch: true }), queueSource("local-music", "Local Music"));
});
window.metro?.onLocalMusicProgress?.((progress) => { if (els.localMusicStatus) els.localMusicStatus.textContent = `Scanning ${progress.current || 0} / ${progress.total || 0} · ${progress.title || ""}`; });

function closeMusicRecognitionDialog() {
  if (cancelMusicRecognitionCapture) cancelMusicRecognitionCapture();
  els.musicRecognitionDialog?.classList.add("hidden");
}

els.musicRecognizeButton?.addEventListener("click", () => els.musicRecognitionDialog?.classList.remove("hidden"));
els.recognitionCloseButton?.addEventListener("click", closeMusicRecognitionDialog);
els.musicRecognitionDialog?.addEventListener("click", (event) => {
  if (event.target === els.musicRecognitionDialog) closeMusicRecognitionDialog();
});

els.downloadedFolderButton?.addEventListener("click", async () => {
  try {
    const result = await window.metro.openCacheFolder();
    if (result?.error) throw new Error(result.error);
  } catch (error) {
    showToast(error?.message || "Could not open the downloads folder.");
  }
});
document.querySelectorAll("[data-recognition-source]").forEach((button) => button.addEventListener("click", () => {
  state.recognitionSource = button.dataset.recognitionSource;
  document.querySelectorAll("[data-recognition-source]").forEach((item) => item.classList.toggle("active", item === button));
  if (els.recognitionStatus && !cancelMusicRecognitionCapture) {
    els.recognitionStatus.textContent = state.recognitionSource === "system"
      ? "System audio captures audio shared by a window or screen."
      : "Microphone listens for music playing near this computer.";
  }
}));
els.recognitionStartButton?.addEventListener("click", () => recognizeMusicFromMicrophone(state.recognitionSource));
els.recognitionCandidates?.addEventListener("click", (event) => {
  const index = Number(event.target.closest("[data-recognition-play]")?.dataset.recognitionPlay);
  const track = state.recognitionCandidates[index];
  if (track) playTrackFromContext(track, state.recognitionCandidates, queueSource("recognition", "Recognized songs"));
});

els.shortcutSaveButton?.addEventListener("click", async () => {
  const value = await window.metro.setShortcuts({ playPause: els.shortcutPlayPause?.value, next: els.shortcutNext?.value, previous: els.shortcutPrevious?.value, showMain: els.shortcutShowMain?.value });
  if (els.shortcutStatus) els.shortcutStatus.textContent = "Global shortcuts saved and active.";
  return value;
});
els.updateCheckButton?.addEventListener("click", async () => {
  try {
    renderUpdateEvent({ type: "checking" });
    const result = await window.metro.checkForUpdates(els.updateRepository?.value);
    if (!result.packaged) renderUpdateEvent({ type: "error", message: "Update checks run in the installed build; the repository setting was saved." });
  } catch (error) { renderUpdateEvent({ type: "error", message: error.message }); }
});
els.updateDownloadButton?.addEventListener("click", () => {
  renderUpdateEvent({ type: "progress", percent: 0 });
  window.metro.downloadUpdate(true).catch((error) => renderUpdateEvent({ type: "error", message: error.message }));
});
els.updateInstallButton?.addEventListener("click", () => window.metro.installUpdate());
window.metro?.onUpdateEvent?.(renderUpdateEvent);

function setupCollectionToolbarEnhancements() {
  try {
    state.collectionLayout = localStorage.getItem("auralane:layout:collectionView") === "grid" ? "grid" : "list";
    state.likedLayout = localStorage.getItem("auralane:layout:likedView") === "grid" ? "grid" : "list";
  } catch {}
  setIconButton(els.likedLayoutButton, state.likedLayout === "grid" ? "list" : "grid", state.likedLayout === "grid" ? "List view" : "Grid view");
  for (const toolbar of document.querySelectorAll(".view .collection-toolbar")) {
    const view = toolbar.closest(".view");
    const controls = toolbar.querySelector(".collection-controls") || toolbar;
    if (!view || view.id === "localMusicView" || controls.querySelector("[data-collection-layout]")) continue;
    const locate = view.querySelector("[data-collection-follow]") || document.createElement("button");
    if (!locate.hasAttribute("data-collection-follow")) {
      locate.className = "secondary icon-only collection-locate-button collection-follow-button";
      locate.type = "button";
      locate.dataset.collectionFollow = "";
      locate.innerHTML = els.queueFollowButton?.innerHTML || standardIconSvg("locate");
      const search = controls.querySelector(".collection-search");
      const trailingControl = search?.nextElementSibling || null;
      controls.insertBefore(locate, trailingControl);
    }
    locate.innerHTML = els.queueFollowButton?.innerHTML || standardIconSvg("locate");
    locate.addEventListener("click", () => {
      applyBooleanSetting("collectionFollowPlaying", !state.settings.collectionFollowPlaying);
      updateCollectionFollowButtons();
      if (state.settings.collectionFollowPlaying) followCurrentTrackInCollection({ force: true });
      toast(state.settings.collectionFollowPlaying ? "Collection follows the playing song." : "Collection follow is off.");
    });
    if (view.id === "likedView") continue;
    const layout = document.createElement("button");
    layout.className = "secondary icon-only collection-layout-button";
    layout.type = "button";
    layout.dataset.collectionLayout = "list";
    layout.title = "Grid";
    layout.setAttribute("aria-label", "Grid");
    layout.innerHTML = standardIconSvg("grid");
    layout.addEventListener("click", () => {
      const grid = layout.dataset.collectionLayout !== "grid";
      layout.dataset.collectionLayout = grid ? "grid" : "list";
      const label = grid ? "List" : "Grid";
      layout.title = label;
      layout.setAttribute("aria-label", label);
      layout.innerHTML = standardIconSvg(grid ? "list" : "grid");
      view.classList.toggle("collection-grid-view", grid);
      try { localStorage.setItem(`auralane:layout:${view.id}`, grid ? "grid" : "list"); } catch {}
    });
    const search = controls.querySelector(".collection-search");
    const trailingControl = search?.nextElementSibling || null;
    controls.insertBefore(layout, trailingControl);
    try {
      if (localStorage.getItem(`auralane:layout:${view.id}`) === "grid") layout.click();
    } catch {}
  }
  updateCollectionFollowButtons();
}

async function init() {
  console.log("[boot-ui] step 1/14: init() started");
  try {
    upgradeInterfaceIcons();
    if (els.sidebarReleaseDismiss) els.sidebarReleaseDismiss.innerHTML = standardIconSvg("close");
    new MutationObserver(() => upgradeInterfaceIcons()).observe(document.body, {
      childList: true,
      subtree: true
    });
    initializeComponentI18n();
    setupCollectionToolbarEnhancements();
    console.log("[boot-ui] step 2/14: appearance & i18n setup");
    loadAppearanceSettings();
    applySidebarState(state.settings.sidebarCollapsed, false);
    setupSidebarUpdateNotice();
    applyLyricsQuickSettings(false);
    console.log("[boot-ui] step 3/14: fetching shortcut settings via IPC");
    const shortcutSettings = await window.metro.getShortcuts?.();
    if (els.shortcutPlayPause) els.shortcutPlayPause.value = shortcutSettings?.playPause || "Ctrl+Alt+Space";
    if (els.shortcutNext) els.shortcutNext.value = shortcutSettings?.next || "Ctrl+Alt+Right";
    if (els.shortcutPrevious) els.shortcutPrevious.value = shortcutSettings?.previous || "Ctrl+Alt+Left";
    if (els.shortcutShowMain) els.shortcutShowMain.value = shortcutSettings?.showMain || "Ctrl+Alt+M";
    console.log("[boot-ui] step 4/14: fetching updater status");
    const updaterState = await window.metro.updateStatus?.();
    if (els.updateRepository) els.updateRepository.value = updaterState?.repository || "";
    if (els.updateStatus) els.updateStatus.textContent = `Auralane ${updaterState?.version || ""} · GitHub Releases`;
    console.log("[boot-ui] step 5/14: local playlists + audio output");
    loadLocalPlaylists();
    state.audioOutputDeviceId = normalizeAudioOutputDeviceId(state.settings.audioOutputDeviceId);
    renderAudioOutputControl();
    refreshAudioOutputDevices({ apply: true }).catch((error) => {
      state.audioOutputError = error?.message || "Could not refresh output devices.";
      renderAudioOutputControl();
    });
    console.log("[boot-ui] step 6/14: media session + search UI");
    loadQueueMemory();
    setupMediaSession();
    renderSearchTabs(state.searchFilter);
    renderSearchFilterControls();
    console.log("[boot-ui] step 7/14: authStatus IPC -> renderAuth");
    renderAuth(await window.metro.authStatus());
    console.log("[boot-ui]   auth rendered, signedIn=", Boolean(state.auth?.signedIn));
    loadAppearanceSettings();
    const durablePreferences = await window.metro.getPreferences?.();
    if (typeof durablePreferences?.lyricsAutoTranslate === "boolean") {
      state.settings.lyricsAutoTranslate = durablePreferences.lyricsAutoTranslate;
      saveAppearanceSettings();
      syncSettingsControls();
    }
    loadQueueMemory();
    console.log("[boot-ui] step 8/14: playback session + queue hydration");
    const playbackSession = await window.metro.getPlaybackSession?.();
    state.queue = await window.metro.getQueue();
    state.queueHydrated = true;
    console.log("[boot-ui] step 9/14: offline cache refresh");
    await refreshOfflineCache();
    console.log("[boot-ui] step 10/14: restoring playback session");
    const restoredPlayback = restorePlaybackSession(playbackSession);
    renderQueue();
    if (!restoredPlayback) renderNow();
    // Ctrl+R restores the track metadata without calling playTrack(). Restart
    // the lyrics state machine explicitly so saved lyrics appear immediately
    // and provider refresh continues in the background after a renderer reload.
    if (restoredPlayback && state.currentTrack?.id) {
      void loadLyricsForTrack(state.currentTrack);
    }
    console.log("[boot-ui] step 11/14: lyric widget + mini player state");
    const lyricWindowStatus = await window.metro?.lyricWindowStatus?.();
    lyricWidgetActive = Boolean(lyricWindowStatus?.active);
    updateLyricWidgetButtonState();
    if (lyricWidgetActive) syncLyricWidget();
    if (state.auth?.signedIn) {
      refreshLikedDataInPlace()
        .then(() => renderCurrentTrackActions())
        .catch(() => renderCurrentTrackActions());
    }
    const miniStatus = await window.metro?.miniPlayerStatus?.();
    if (miniStatus?.active) {
      setMiniPlayerButtonActive(true);
      await syncMiniPlayer({ force: true });
    }
    console.log("[boot-ui] step 12/14: restore session view");
    await restoreSessionView(playbackSession || {});
    if (restoredPlayback) {
      renderQueue();
      renderRestoredProgress(playbackSession || {});
    }
    console.log("[boot-ui] step 13/14: starting outbox + download schedulers");
    processSyncOutbox();
    processDownloadQueue();
    window.setInterval(() => processSyncOutbox(), 60000);
    schedulePlaybackSessionSave({ force: true });
    console.log("[boot-ui] step 14/14: init() completed successfully.");
  } catch (error) {
    console.error("[boot-ui] FATAL: init() threw an uncaught exception:", error?.message || error, error?.stack || "");
    els.homeStatus.textContent = "UI initialization failed: " + (error?.message || String(error));
    els.homeFallbackActions.classList.remove("hidden");
  }
}

/* --- Mini-Games Implementation --- */

// Heardle Game State
const heardleState = {
  roundFinished: false,
  session: [],
  sessionLength: 5,
  currentTrack: null,
  catalog: [],
  currentChunkIndex: 0,
  chunks: [1, 2, 4, 7, 11, 15],
  streak: 0,
  score: 0,
  isPlaying: false,
  timer: null,
  selectedGuessId: "",
  attempts: [],
  playedIds: new Set(),
  previewStart: 0,
  audio: null,
  directAudio: null,
  outputAudio: null,
  playerSnapshot: null,
  sourceUrl: "",
  sourceKind: "",
  loadToken: 0
};

function heardlePlayer() {
  if (heardleState.audio) return heardleState.audio;
  // Heardle deliberately borrows the regular player. This keeps the exact
  // same WebAudio graph, selected output device and Electron media path that
  // the user has already verified works for ordinary playback.
  const audio = els.audio;
  if (!audio) return null;
  heardleState.playerSnapshot = {
    src: audio.currentSrc || audio.src || "",
    currentTime: Number(audio.currentTime || 0),
    crossOrigin: audio.getAttribute("crossorigin"),
    playbackMode: state.playbackMode
  };
  audio.preload = "auto";
  audio.autoplay = false;
  audio.dataset.gamePlayer = "heardle";
  heardleState.audio = audio;
  return audio;
}

function stopHeardleAudio() {
  heardleState.audio?.pause();
  heardleState.directAudio?.pause();
  clearTimeout(heardleState.timer);
  heardleState.isPlaying = false;
}

function disposeHeardleDirectAudio() {
  const audio = heardleState.directAudio;
  if (audio) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
  heardleState.directAudio = null;
  heardleState.outputAudio = null;
}

function restoreHeardlePlayer() {
  const audio = heardleState.audio;
  const snapshot = heardleState.playerSnapshot;
  if (!audio || !snapshot) return;
  audio.pause();
  disposeHeardleDirectAudio();
  delete audio.dataset.gamePlayer;
  if (snapshot.crossOrigin == null) audio.removeAttribute("crossorigin");
  else audio.setAttribute("crossorigin", snapshot.crossOrigin);
  if (snapshot.src) {
    const restoreTime = () => {
      try { audio.currentTime = snapshot.currentTime; } catch {}
      audio.removeEventListener("loadedmetadata", restoreTime);
      updateProgress();
    };
    audio.addEventListener("loadedmetadata", restoreTime, { once: true });
    audio.src = snapshot.src;
    audio.load();
  } else {
    audio.removeAttribute("src");
    audio.load();
  }
  state.playbackMode = snapshot.playbackMode || "idle";
  state.playing = false;
  heardleState.audio = null;
  heardleState.playerSnapshot = null;
  heardleState.sourceUrl = "";
  updateProgress();
  renderNow();
}

async function heardleCatalog() {
  await refreshOfflineCache({ silent: true });
  if (!(state.localMusicData?.tracks || []).length) {
    try { state.localMusicData = await window.metro.localMusic(); } catch { state.localMusicData = { folders: [], tracks: [] }; }
  }
  if (state.auth?.signedIn && !state.likedData) {
    try { state.likedData = mergeLikedData(await window.metro.likedSongs()); } catch {}
  }
  const local = (state.localMusicData?.tracks || []).map((track) => ({ ...track, local: true, heardleSource: "local" }));
  const downloaded = (state.offlineCache?.tracks || []).map((track) => ({ ...track, heardleSource: "downloaded", offlineCached: true, cached: true }));
  const liked = likedRawTracks().map((track) => ({ ...track, heardleSource: "liked" }));
  const seen = new Set();
  return uniqueTracks([...local, ...downloaded, ...liked]).filter((track) => {
    const id = String(track?.id || "");
    const duration = itemDurationSeconds(track);
    if (!id || seen.has(id) || (duration > 0 && duration < 30)) return false;
    seen.add(id);
    return true;
  });
}

// Keep Heardle on the exact same source-selection path as regular playback.
// This deliberately uses cachedTrackForPlayback(), offline mode rules and the
// same InnerTube playback request instead of maintaining a game-only URL list.
async function resolveHeardlePlaybackSource(track) {
  if (!track?.id) return null;
  if (track.local || track.heardleSource === "local") {
    return { url: `${window.location.origin}/local-music-audio/${encodeURIComponent(track.id)}`, kind: "local" };
  }
  const cached = await cachedTrackForPlayback(track).catch(() => null);
  if (cached?.streamUrl || cached?.fileUrl) return { url: offlineStreamUrl(cached), kind: "downloaded" };
  const offlineOnly = isOfflineQueueSource() || track.offlineOnly || state.settings.offlineMode;
  if (offlineOnly) return null;
  const cachedStream = cachedPlaybackStream(track.id);
  let playback = cachedStream;
  let lastError;
  for (let attempt = 0; !playback && attempt <= state.playbackRetryLimit; attempt += 1) {
    try {
      playback = await window.metro.playback({
        videoId: track.id,
        playlistId: track.playlistId,
        quality: state.settings.quality
      });
    } catch (error) {
      lastError = error;
      if (attempt < state.playbackRetryLimit) await sleep(350);
    }
  }
  if (!playback?.streamUrl || playback?.mode === "webview") {
    if (lastError && state.settings.debugLogs) console.warn("Heardle playback resolution failed", lastError);
    return null;
  }
  rememberPlaybackStream(track.id, playback);
  return { url: playback.streamUrl, kind: "liked" };
}

async function prepareHeardleAudio(track) {
  const token = heardleState.loadToken;
  const audio = heardlePlayer();
  if (!audio || !track?.id) return false;
  stopHeardleAudio();
  disposeHeardleDirectAudio();
  let source;
  try { source = await resolveHeardlePlaybackSource(track); } catch { return false; }
  if (!source?.url || token !== heardleState.loadToken || state.activeGame !== "heardle") return false;
  heardleState.sourceUrl = source.url;
  heardleState.sourceKind = source.kind;
  if (source.kind === "local" || source.kind === "downloaded") audio.removeAttribute("crossorigin");
  else audio.crossOrigin = "anonymous";
  audio.src = source.url;
  audio.muted = false;
  audio.volume = els.audio?.volume ?? 1;
  // Output selection should never make a game round unplayable. If a stale
  // device id fails, the browser's current system output remains usable.
  await applySelectedAudioOutput().catch(() => {});
  // Do not reject a real source before the user gesture. Some YouTube and
  // local-network streams delay their media handshake until play() is called.
  // The actual preview below verifies time progression and replaces failures.
  audio.load();
  return true;
}

async function initHeardleGame() {
  if (heardleState.session.length >= heardleState.sessionLength) {
    showHeardleSessionResult();
    return;
  }
  const loadToken = ++heardleState.loadToken;
  heardleState.roundFinished = false;
  heardleState.currentTrack = null;
  document.getElementById("heardleSessionProgress").textContent = `Song ${heardleState.session.length + 1} / ${heardleState.sessionLength}`;
  clearTimeout(heardleState.timer);
  stopHeardleAudio();
  heardleState.isPlaying = false;
  document.getElementById("heardleScore").textContent = `${heardleState.score} pts · ${heardleState.streak} streak`;
  document.getElementById("heardleResult").classList.add("hidden");
  document.getElementById("heardleNextButton").classList.add("hidden");
  document.getElementById("heardleSearchInput").value = "";
  document.getElementById("heardleSearchInput").disabled = false;
  document.getElementById("heardleSubmitButton").disabled = true;
  document.getElementById("heardleSkipButton").disabled = true;
  document.getElementById("heardlePlayButton").disabled = true;
  document.getElementById("heardleSuggestions").replaceChildren();
  document.getElementById("heardleSuggestions").classList.add("hidden");
  heardleState.selectedGuessId = "";
  heardleState.attempts = [];
  document.getElementById("heardleAttempts")?.replaceChildren();
  const revealArt = document.getElementById("heardleRevealArt");
  if (revealArt) revealArt.style.backgroundImage = "";

  document.getElementById("heardleTimeDisplay").textContent = "Loading your music sources…";
  const tracks = await heardleCatalog();
  if (loadToken !== heardleState.loadToken) return;
  if (tracks.length === 0) {
    document.getElementById("heardleTimeDisplay").textContent = "Add liked, local, or downloaded songs to play Heardle.";
    return;
  }
  heardleState.catalog = tracks;
  let candidates = tracks.filter((track) => !heardleState.playedIds.has(String(track.id)));
  if (!candidates.length) {
    heardleState.playedIds.clear();
    candidates = [...tracks];
  }
  candidates.sort(() => Math.random() - .5);
  heardleState.currentTrack = null;
  for (const candidate of candidates.slice(0, 20)) {
    if (loadToken !== heardleState.loadToken) return;
    if (await prepareHeardleAudio(candidate)) {
      if (loadToken !== heardleState.loadToken) return;
      heardleState.currentTrack = candidate;
      break;
    }
  }
  if (!heardleState.currentTrack) {
    document.getElementById("heardleTimeDisplay").textContent = "No playable audio was found in your music sources.";
    document.getElementById("heardlePlayButton").disabled = true;
    return;
  }
  heardleState.currentChunkIndex = 0;
  heardleState.isPlaying = false;
  heardleState.previewStart = 0;
  heardleState.playedIds.add(String(heardleState.currentTrack.id));
  document.getElementById("heardleGame")?.style.removeProperty("--heardle-stage-art");

  updateHeardleUI();
  document.getElementById("heardleHint").textContent = "Name that song";
  document.getElementById("heardleSubHint").textContent = "Six chances. One familiar melody.";
  const sourceLabels = { local: "Local library", downloaded: "Downloaded", liked: "Liked Songs" };
  document.getElementById("heardleSourceLabel").textContent = sourceLabels[heardleState.sourceKind] || "Your music";
  document.getElementById("heardlePlayButton").disabled = false;
  document.getElementById("heardleSkipButton").disabled = false;
  renderHeardleAttempts();
}

function updateHeardleUI() {
  const timeAllowed = heardleState.chunks[heardleState.currentChunkIndex];
  document.getElementById("heardleRound").textContent = `Round ${heardleState.currentChunkIndex + 1} / ${heardleState.chunks.length}`;
  document.getElementById("heardleTimeDisplay").textContent = `Preview ${heardleState.currentChunkIndex + 1} · ${timeAllowed}s`;

  const chunks = document.querySelectorAll(".heardle-chunk");
  chunks.forEach((chunk, index) => {
    const label = chunk.querySelector("b");
    if (label) label.textContent = `${heardleState.chunks[index] || ""}s`;
    if (index < heardleState.currentChunkIndex) {
      chunk.className = "heardle-chunk missed";
    } else if (index === heardleState.currentChunkIndex) {
      chunk.className = "heardle-chunk active";
    } else {
      chunk.className = "heardle-chunk";
    }
  });
}

function renderHeardleSuggestions(query) {
  const suggestions = document.getElementById("heardleSuggestions");
  if (!suggestions) return;
  const normalized = String(query || "").trim().toLocaleLowerCase();
  if (!normalized) {
    suggestions.replaceChildren();
    suggestions.classList.add("hidden");
    return;
  }
  const usedIds = new Set(heardleState.attempts.map((attempt) => String(attempt.track?.id || "")));
  const matches = heardleState.catalog
    .filter((track) => !usedIds.has(String(track.id)) && `${track.title || ""} ${track.artist || ""}`.toLocaleLowerCase().includes(normalized))
    .slice(0, 6);
  suggestions.innerHTML = matches.map((track) => `
    <button class="game-search-result" type="button" data-heardle-id="${escapeText(track.id || "")}">
      <span><strong>${escapeText(track.title || "Untitled")}</strong><small>${escapeText(track.artist || "Unknown artist")}</small></span>
    </button>
  `).join("");
  suggestions.classList.toggle("hidden", matches.length === 0);
}

function heardlePreviewStart(track, duration) {
  if (!Number.isFinite(duration) || duration <= 24) return 0;
  let hash = 2166136261;
  for (const char of String(track?.id || track?.title || "heardle")) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const safeStart = duration > 55 ? 8 : 3;
  const safeEnd = Math.max(safeStart, duration - Math.max(...heardleState.chunks) - 3);
  if (safeEnd <= safeStart) return safeStart;
  return safeStart + ((hash >>> 0) / 4294967295) * (safeEnd - safeStart);
}

function waitForHeardleMedia(audio, timeoutMs = 6500) {
  if (audio.readyState >= HTMLMediaElement.HAVE_METADATA && Number.isFinite(audio.duration)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      audio.removeEventListener("loadedmetadata", ready);
      audio.removeEventListener("canplay", ready);
      audio.removeEventListener("error", failed);
    };
    const ready = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("The selected audio source could not be loaded.")); };
    const timer = setTimeout(() => { cleanup(); reject(new Error("Audio loading timed out.")); }, timeoutMs);
    audio.addEventListener("loadedmetadata", ready, { once: true });
    audio.addEventListener("canplay", ready, { once: true });
    audio.addEventListener("error", failed, { once: true });
  });
}

async function waitForHeardlePlaybackAdvance(audio, startTime, timeoutMs = 2600) {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    if (!audio.paused && Number(audio.currentTime || 0) > Number(startTime || 0) + 0.06) return true;
    await sleep(90);
  }
  throw new Error("The audio stream started but its playback clock did not advance.");
}

async function heardleDspHasAudioEnergy() {
  if (!audioCtx || !analyserNode || !visualizerData) return true;
  try {
    if (audioCtx.state === "suspended") await audioCtx.resume();
    for (let attempt = 0; attempt < 6; attempt += 1) {
      analyserNode.getByteFrequencyData(visualizerData);
      if (visualizerData.some((value) => value > 0)) return true;
      await sleep(90);
    }
  } catch {
    return true;
  }
  return false;
}

async function startHeardleDirectOutput(sourceAudio, startTime) {
  sourceAudio.pause();
  disposeHeardleDirectAudio();
  const direct = new Audio();
  direct.preload = "auto";
  direct.autoplay = false;
  // This path intentionally bypasses WebAudio when a remote media server lets
  // playback run but denies CORS audio samples, which otherwise yields silence.
  direct.src = heardleState.sourceUrl;
  direct.volume = Math.max(0, Math.min(1, Number(els.volumeBar?.value ?? sourceAudio.volume ?? 1)));
  direct.muted = false;
  if (typeof direct.setSinkId === "function") {
    await direct.setSinkId(selectedAudioOutputId()).catch(() => {});
  }
  heardleState.directAudio = direct;
  await waitForHeardleMedia(direct);
  direct.currentTime = startTime;
  await direct.play();
  await waitForHeardlePlaybackAdvance(direct, startTime);
  heardleState.outputAudio = direct;
  return direct;
}

document.getElementById("heardlePlayButton")?.addEventListener("click", async () => {
  if (!heardleState.currentTrack || heardleState.isPlaying || heardleState.roundFinished) return;
  const token = heardleState.loadToken;
  heardleState.isPlaying = true;
  const timeAllowed = heardleState.chunks[heardleState.currentChunkIndex];
  const audio = heardleState.audio;
  if (!audio?.src) {
    document.getElementById("heardleTimeDisplay").textContent = "Audio source is no longer available. Loading another song…";
    await initHeardleGame();
    return;
  }
  clearTimeout(heardleState.timer);
  const playButton = document.getElementById("heardlePlayButton");
  playButton.disabled = true;
  audio.muted = false;
  audio.volume = els.audio?.volume ?? 1;
  try {
    await applySelectedAudioOutput().catch(() => {});
    await waitForHeardleMedia(audio);
    heardleState.previewStart = heardlePreviewStart(heardleState.currentTrack, Number(audio.duration));
    if (token !== heardleState.loadToken || heardleState.roundFinished) return;
    audio.currentTime = heardleState.previewStart;
    await audio.play();
    await waitForHeardlePlaybackAdvance(audio, heardleState.previewStart);
    const hasDspEnergy = await heardleDspHasAudioEnergy();
    const dspCannotRouteSelectedDevice = selectedAudioOutputId() !== "default" &&
      audioCtx && typeof audioCtx.setSinkId !== "function";
    heardleState.outputAudio = hasDspEnergy && !dspCannotRouteSelectedDevice
      ? audio
      : await startHeardleDirectOutput(audio, heardleState.previewStart);
    document.getElementById("heardleTimeDisplay").textContent = `Listening · ${timeAllowed}s preview`;
  } catch (error) {
    if (token !== heardleState.loadToken) return;
    heardleState.isPlaying = false;
    document.getElementById("heardleTimeDisplay").textContent = `Audio could not be played: ${playbackFailureMessage(error)}`;
    heardleState.sourceUrl = "";
    audio.removeAttribute("src");
    audio.load();
    if (await prepareHeardleAudio(heardleState.currentTrack)) {
      document.getElementById("heardleTimeDisplay").textContent = "Audio source refreshed. Press play again.";
      playButton.disabled = false;
    } else {
      document.getElementById("heardleTimeDisplay").textContent = "This song is currently unavailable. Choose Next Song to continue.";
      document.getElementById("heardleNextButton").classList.remove("hidden");
    }
    return;
  }
  if (token !== heardleState.loadToken || heardleState.roundFinished) { stopHeardleAudio(); return; }
  heardleState.isPlaying = true;
  const output = heardleState.outputAudio || audio;
  const stopAt = heardleState.previewStart + timeAllowed;
  const watchPreview = () => {
    if (token !== heardleState.loadToken || heardleState.roundFinished) return;
    if (output.currentTime >= stopAt || output.ended || output.paused) {
      output.pause();
      heardleState.isPlaying = false;
      playButton.disabled = false;
      updateHeardleUI();
    } else heardleState.timer = setTimeout(watchPreview, 20);
  };
  watchPreview();
});

document.getElementById("heardleSkipButton")?.addEventListener("click", () => {
  if (!heardleState.currentTrack || heardleState.roundFinished) return;
  stopHeardleAudio();
  heardleState.attempts.push({ track: null, correct: false });
  renderHeardleAttempts();
  document.getElementById("heardlePlayButton").disabled = false;
  if (heardleState.currentChunkIndex < heardleState.chunks.length - 1) {
    heardleState.currentChunkIndex++;
    updateHeardleUI();
  } else {
    finishHeardle(false);
  }
});

document.getElementById("heardleSubmitButton")?.addEventListener("click", () => {
  if (heardleState.roundFinished) return;
  const guessed = heardleState.catalog.find((track) => String(track.id) === heardleState.selectedGuessId);
  if (!guessed) return;
  stopHeardleAudio();
  document.getElementById("heardlePlayButton").disabled = false;
  const correct = window.AuralaneGameRules.sameSong(guessed, heardleState.currentTrack);
  heardleState.attempts.push({ track: guessed, correct });
  renderHeardleAttempts();
  if (correct) {
    finishHeardle(true);
  } else {
    if (heardleState.currentChunkIndex < heardleState.chunks.length - 1) {
      heardleState.currentChunkIndex++;
      updateHeardleUI();
      document.getElementById("heardleSearchInput").value = "";
      heardleState.selectedGuessId = "";
      document.getElementById("heardleSubmitButton").disabled = true;
    } else {
      finishHeardle(false);
    }
  }
});

document.getElementById("heardleSearchInput")?.addEventListener("input", (event) => {
  heardleState.selectedGuessId = "";
  document.getElementById("heardleSubmitButton").disabled = true;
  renderHeardleSuggestions(event.target.value);
});

document.getElementById("heardleSearchInput")?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && heardleState.selectedGuessId) {
    event.preventDefault();
    document.getElementById("heardleSubmitButton")?.click();
  }
});

document.getElementById("heardleSuggestions")?.addEventListener("click", (event) => {
  const choice = event.target.closest("[data-heardle-id]");
  if (!choice) return;
  const input = document.getElementById("heardleSearchInput");
  const track = heardleState.catalog.find((item) => String(item.id) === String(choice.dataset.heardleId));
  if (!track) return;
  heardleState.selectedGuessId = String(track.id);
  document.getElementById("heardleSubmitButton").disabled = false;
  input.value = `${track.title || "Untitled"} — ${track.artist || "Unknown artist"}`;
  renderHeardleSuggestions("");
});

function renderHeardleAttempts() {
  const host = document.getElementById("heardleAttempts");
  if (!host) return;
  host.innerHTML = Array.from({ length: 6 }, (_, index) => {
    const attempt = heardleState.attempts[index];
    if (!attempt) return `<div class="heardle-attempt pending"><b>${index + 1}</b><span></span><small>${heardleState.chunks[index]}s</small></div>`;
    return `
    <div class="heardle-attempt ${attempt.correct ? "correct" : "wrong"}"><b>${index + 1}</b><span><strong>${escapeText(attempt.track?.title || "Skipped")}</strong><small>${escapeText(attempt.track?.artist || "")}</small></span><em>${attempt.correct ? "Correct" : "Try again"}</em></div>`;
  }).join("");
}

function finishHeardle(success) {
  if (heardleState.roundFinished || !heardleState.currentTrack) return;
  heardleState.roundFinished = true;
  const scoreBefore = heardleState.score;
  clearTimeout(heardleState.timer);
  stopHeardleAudio();
  heardleState.isPlaying = false;

  const resEl = document.getElementById("heardleResult");
  const revealArt = document.getElementById("heardleRevealArt");
  const revealCopy = document.getElementById("heardleRevealCopy");
  resEl.classList.remove("hidden", "success", "fail");
  if (revealArt) revealArt.style.backgroundImage = thumbnailBackground(heardleState.currentTrack);

  if (success) {
    const previewSeconds = heardleState.chunks[heardleState.currentChunkIndex] || 15;
    const earned = Math.max(120, 1200 - previewSeconds * 45 - Math.max(0, heardleState.attempts.length - 1) * 140);
    heardleState.score += earned;
    heardleState.streak++;
    resEl.classList.add("success");
    if (revealCopy) revealCopy.innerHTML = `<strong>Correct!</strong><span>${escapeText(heardleState.currentTrack.title || "Untitled")}</span><small>${escapeText(heardleState.currentTrack.artist || "Unknown artist")}</small>`;
  } else {
    heardleState.streak = 0;
    resEl.classList.add("fail");
    if (revealCopy) revealCopy.innerHTML = `<strong>Song revealed</strong><span>${escapeText(heardleState.currentTrack.title || "Untitled")}</span><small>${escapeText(heardleState.currentTrack.artist || "Unknown artist")}</small>`;
  }

  document.getElementById("heardleScore").textContent = `${heardleState.score} pts · ${heardleState.streak} streak`;
  document.getElementById("heardleHint").textContent = `${heardleState.currentTrack.artist || "Unknown artist"} · ${heardleState.currentTrack.title || "Untitled"}`;
  document.getElementById("heardleSearchInput").disabled = true;
  document.getElementById("heardleSubmitButton").disabled = true;
  document.getElementById("heardleSkipButton").disabled = true;
  document.getElementById("heardlePlayButton").disabled = true;
  document.getElementById("heardleNextButton").classList.remove("hidden");
  heardleState.session.push({ track: heardleState.currentTrack, success, seconds: heardleState.chunks[heardleState.currentChunkIndex], score: heardleState.score - scoreBefore });
  document.getElementById("heardleNextButton").textContent = heardleState.session.length >= heardleState.sessionLength ? "Session results" : "Next Song";
}

async function startHeardleSession() {
  heardleState.score = 0;
  heardleState.streak = 0;
  heardleState.session = [];
  heardleState.playedIds.clear();
  document.getElementById("heardleSessionResult").classList.add("hidden");
  await initHeardleGame();
}

function showHeardleSessionResult() {
  stopHeardleAudio();
  document.getElementById("heardleSessionScore").textContent = `${heardleState.score} pts`;
  document.getElementById("heardleSessionSongs").innerHTML = heardleState.session.map((round) => `<div><span>${escapeText(round.track.title)}</span><b>${round.success ? `${round.seconds}s / ${round.score}` : "Missed"}</b></div>`).join("");
  document.getElementById("heardleSessionResult").classList.remove("hidden");
}

document.getElementById("heardleNextButton")?.addEventListener("click", () => {
  document.getElementById("heardleSearchInput").value = "";
  initHeardleGame();
});

// Rhythm Master charts are generated only from decoded audio features. Lyrics are
// never used as timing data and there is no synthetic fallback chart.
const rhythmState = {
  running: false,
  paused: false,
  starting: false,
  runToken: 0,
  loadToken: 0,
  rawChart: [],
  pressedLanes: new Set(),
  chart: [],
  score: 0,
  combo: 0,
  maxCombo: 0,
  perfect: 0,
  great: 0,
  good: 0,
  missed: 0,
  life: 100,
  lastJudgement: "Ready",
  canvasCtx: null,
  animationId: 0,
  ready: false,
  pressedLane: -1,
  pressedUntil: 0,
  bpm: 0,
  confidence: 0,
  hitBursts: [],
  heldNotes: new Map()
};
const RHYTHM_ANALYSIS_CACHE_KEY = "auralane:rhythmAudioAnalysis";
const RHYTHM_ANALYSIS_VERSION = 5;

function rhythmAnalysisKey(track, audio) {
  return `${RHYTHM_ANALYSIS_VERSION}:${track?.id || track?.videoId || ""}:${Math.round(Number(audio?.duration || track?.lengthSeconds || 0))}`;
}

function rhythmAverage(values) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

function rhythmMedian(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function rhythmPercentile(values, percentile) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * percentile)))];
}

// Decode the real audio, measure low/mid/high-band changes, find transients, estimate
// a tempo grid, and map musical roles to comfortable lanes.
async function analyzeRhythmAudio(track, audio) {
  const key = rhythmAnalysisKey(track, audio);
  const stored = readStoredObject(RHYTHM_ANALYSIS_CACHE_KEY, {})[key];
  if (stored?.version === RHYTHM_ANALYSIS_VERSION && stored?.chart?.length >= 18 && Number.isFinite(stored?.bpm)) return stored;
  const response = await fetch(audio.currentSrc || audio.src);
  if (!response.ok) throw new Error(`Audio analysis request failed (${response.status}).`);
  const bytes = await response.arrayBuffer();
  const context = new (window.AudioContext || window.webkitAudioContext)();
  let buffer;
  try { buffer = await context.decodeAudioData(bytes.slice(0)); } finally { void context.close?.(); }
  const frameSize = 2048;
  const hop = 1024;
  const frames = [];
  const channels = Array.from({ length: buffer.numberOfChannels }, (_, channel) => buffer.getChannelData(channel));
  let lowPass = 0;
  let previousSample = 0;
  for (let start = 0; start + frameSize < buffer.length; start += hop) {
    let energySquare = 0;
    let lowSquare = 0;
    let midSquare = 0;
    let highSquare = 0;
    for (let index = start + 1; index < start + frameSize; index += 1) {
      let value = 0;
      for (const samples of channels) value += samples[index];
      value /= Math.max(1, channels.length);
      lowPass += 0.018 * (value - lowPass);
      const high = value - previousSample;
      const mid = value - lowPass - high * 0.22;
      energySquare += value * value;
      lowSquare += lowPass * lowPass;
      midSquare += mid * mid;
      highSquare += high * high;
      previousSample = value;
    }
    frames.push({
      time: start / buffer.sampleRate,
      energy: Math.sqrt(energySquare / frameSize),
      low: Math.sqrt(lowSquare / frameSize),
      mid: Math.sqrt(midSquare / frameSize),
      high: Math.sqrt(highSquare / frameSize)
    });
  }
  const flux = frames.map((frame, index) => {
    const previous = frames[index - 1] || frame;
    const lowFlux = Math.max(0, frame.low - previous.low);
    const midFlux = Math.max(0, frame.mid - previous.mid);
    const highFlux = Math.max(0, frame.high - previous.high);
    return { total: lowFlux * 1.3 + midFlux + highFlux * .72, low: lowFlux, mid: midFlux, high: highFlux };
  });
  const raw = [];
  for (let index = 2; index < flux.length - 2; index += 1) {
    const windowStart = Math.max(0, index - 18);
    const history = flux.slice(windowStart, index).map((entry) => entry.total);
    const localMean = rhythmAverage(history);
    const localDeviation = Math.sqrt(rhythmAverage(history.map((value) => (value - localMean) ** 2)));
    const threshold = localMean + localDeviation * .82;
    if (flux[index].total > threshold && flux[index].total >= flux[index - 1].total && flux[index].total > flux[index + 1].total) {
      raw.push({ ...frames[index], ...flux[index], strength: flux[index].total });
    }
  }
  const onsets = raw.filter((entry, index) => !index || entry.time - raw[index - 1].time >= .095);
  const tempoBins = new Map();
  for (let index = 0; index < onsets.length; index += 1) {
    for (let next = index + 1; next < Math.min(onsets.length, index + 9); next += 1) {
      const interval = onsets[next].time - onsets[index].time;
      if (interval < .24 || interval > 2.1) continue;
      let bpm = 60 / interval;
      while (bpm < 78) bpm *= 2;
      while (bpm > 188) bpm /= 2;
      const bin = Math.round(bpm);
      tempoBins.set(bin, (tempoBins.get(bin) || 0) + Math.sqrt(onsets[index].strength * onsets[next].strength) / Math.max(1, next - index));
    }
  }
  const rankedTempos = [...tempoBins.entries()].sort((a, b) => b[1] - a[1]);
  const bpm = rankedTempos[0]?.[0] || 0;
  const beatInterval = bpm ? 60 / bpm : 0;
  const tempoWeight = rankedTempos.slice(0, 8).reduce((sum, entry) => sum + entry[1], 0);
  const tempoConfidence = tempoWeight ? (rankedTempos[0]?.[1] || 0) / tempoWeight : 0;
  const onsetConfidence = Math.min(1, onsets.length / Math.max(24, buffer.duration * .55));
  const confidence = Math.min(1, tempoConfidence * 1.65) * onsetConfidence;
  if (onsets.length < 18 || !beatInterval || confidence < .32) throw new Error("The audio did not contain a reliable beat pattern.");

  const phaseCandidates = onsets.slice(0, 48).map((entry) => entry.time % beatInterval);
  let phase = phaseCandidates[0] || 0;
  let phaseScore = Number.POSITIVE_INFINITY;
  for (const candidate of phaseCandidates) {
    const score = onsets.slice(0, 180).reduce((sum, entry) => {
      const position = ((entry.time - candidate) % beatInterval + beatInterval) % beatInterval;
      return sum + Math.min(position, beatInterval - position) * entry.strength;
    }, 0);
    if (score < phaseScore) { phase = candidate; phaseScore = score; }
  }

  const maxStrength = Math.max(...onsets.map((entry) => entry.strength), 0.0001);
  const strengthGate = rhythmPercentile(onsets.map((entry) => entry.strength), .34);
  const chart = [];
  let outerSide = 0;
  let innerSide = 1;
  for (const onset of onsets) {
    if (onset.strength < strengthGate) continue;
    const nearestBeat = phase + Math.round((onset.time - phase) / beatInterval) * beatInterval;
    const timing = Math.abs(nearestBeat - onset.time) <= Math.min(.085, beatInterval * .19) ? nearestBeat : onset.time;
    if (chart.length && timing - chart[chart.length - 1].time < .105) continue;
    const intensity = onset.strength / maxStrength;
    let lane;
    if (onset.low >= onset.mid * .78 && onset.low >= onset.high * 1.1) {
      lane = outerSide ? 3 : 0;
      outerSide = 1 - outerSide;
    } else {
      lane = innerSide ? 2 : 1;
      innerSide = 1 - innerSide;
    }
    const previous = chart[chart.length - 1];
    if (previous && previous.lane === lane && timing - previous.time < .34) lane = lane === 0 ? 1 : lane === 3 ? 2 : lane === 1 ? 2 : 1;
    const onsetFrame = Math.max(0, Math.min(frames.length - 1, Math.round(onset.time * buffer.sampleRate / hop)));
    const onsetEnergy = Math.max(.00001, frames[onsetFrame]?.energy || 0);
    let sustainedFrames = 0;
    const maxSustainFrames = Math.round(1.25 * buffer.sampleRate / hop);
    for (let frameIndex = onsetFrame + 1; frameIndex < Math.min(frames.length, onsetFrame + maxSustainFrames); frameIndex += 1) {
      if ((frames[frameIndex]?.energy || 0) < onsetEnergy * .52) break;
      sustainedFrames += 1;
    }
    const sustainDuration = sustainedFrames * hop / buffer.sampleRate;
    const holdDuration = intensity > .56 && sustainDuration >= .48 ? Math.min(1.15, sustainDuration) : 0;
    const note = {
      time: Math.max(.35, timing), lane, state: "pending", intensity,
      type: holdDuration ? "hold" : intensity > .76 ? "accent" : "tap",
      duration: holdDuration
    };
    chart.push(note);
    if (onset.high > onset.mid * 1.18 && intensity > .82 && (!previous || timing - previous.time > .36)) {
      chart.push({ ...note, lane: lane < 2 ? lane + 2 : lane - 2, chord: true });
    }
  }
  chart.sort((a, b) => a.time - b.time || a.lane - b.lane);
  if (chart.length < 18) throw new Error("The analyzed audio did not produce enough playable notes.");
  const result = { version: RHYTHM_ANALYSIS_VERSION, bpm: Math.round(bpm), confidence, duration: buffer.duration, chart };
  const store = readStoredObject(RHYTHM_ANALYSIS_CACHE_KEY, {});
  store[key] = result;
  writeStoredObject(RHYTHM_ANALYSIS_CACHE_KEY, store);
  return result;
}

function updateRhythmHud() {
  document.getElementById("rhythmScore").textContent = `Score ${rhythmState.score}`;
  document.getElementById("rhythmCombo").textContent = `Combo ${rhythmState.combo}`;
  const judged = rhythmState.perfect + rhythmState.great + rhythmState.good + rhythmState.missed;
  const accuracy = judged ? Math.round(((rhythmState.perfect + rhythmState.great * .75 + rhythmState.good * .45) / judged) * 100) : 0;
  const accuracyEl = document.getElementById("rhythmAccuracy");
  const judgementEl = document.getElementById("rhythmJudgement");
  const progressEl = document.getElementById("rhythmProgress");
  const lifeEl = document.getElementById("rhythmLife");
  const rankEl = document.getElementById("rhythmRank");
  if (accuracyEl) accuracyEl.textContent = `Accuracy ${judged ? `${accuracy}%` : "—"}`;
  if (judgementEl) judgementEl.textContent = rhythmState.lastJudgement;
  if (progressEl) progressEl.textContent = `${judged} / ${rhythmState.chart.length}`;
  if (lifeEl) lifeEl.textContent = String(Math.max(0, Math.round(rhythmState.life)));
  if (rankEl) {
    const rank = accuracy >= 98 ? "S" : accuracy >= 92 ? "A" : accuracy >= 82 ? "B" : accuracy >= 70 ? "C" : judged ? "D" : "C";
    rankEl.textContent = rank;
    rankEl.dataset.rank = rank;
  }
}

function setRhythmFeedback(text, color = "") {
  const feedback = document.getElementById("rhythmFeedback");
  if (!feedback) return;
  feedback.textContent = text;
  feedback.style.color = color;
  feedback.animate([{ transform: "translateY(3px)", opacity: .45 }, { transform: "translateY(0)", opacity: 1 }], { duration: 150, easing: "ease-out" });
}

async function initRhythmGame(track = state.lyricFillTrack) {
  stopRhythmGame();
  const loadToken = ++rhythmState.loadToken;
  rhythmState.rawChart = [];
  document.getElementById("rhythmResult").classList.add("hidden");
  document.getElementById("rhythmStartButton").disabled = true;
  rhythmState.chart = [];
  rhythmState.score = 0;
  rhythmState.combo = 0;
  rhythmState.maxCombo = 0;
  rhythmState.perfect = 0;
  rhythmState.great = 0;
  rhythmState.good = 0;
  rhythmState.missed = 0;
  rhythmState.life = 100;
  rhythmState.bpm = 0;
  rhythmState.confidence = 0;
  rhythmState.hitBursts = [];
  rhythmState.heldNotes.clear();
  rhythmState.lastJudgement = "Ready";
  rhythmState.ready = false;
  updateRhythmHud();
  const canvas = document.getElementById("rhythmCanvas");
  if (canvas) rhythmState.canvasCtx = canvas.getContext("2d");
  const art = document.getElementById("rhythmTrackArt");
  const title = document.getElementById("rhythmTrackTitle");
  const artist = document.getElementById("rhythmTrackArtist");
  const game = document.getElementById("rhythmGame");
  if (!track?.id) {
    if (art) art.style.backgroundImage = "";
    if (game) game.style.removeProperty("--rhythm-stage-art");
    title.textContent = "Choose a song to build the chart";
    artist.textContent = "Choose a playable song. Its real audio creates the chart.";
    setRhythmFeedback("Search and select a song first.");
    drawRhythmChart();
    return;
  }
  if (art) art.style.backgroundImage = thumbnailBackground(track);
  if (game) game.style.setProperty("--rhythm-stage-art", thumbnailBackground(track) || "none");
  title.textContent = track.title || "Untitled";
  artist.textContent = track.subtitle || track.artist || "Preparing song data…";
  setRhythmFeedback("Decoding real audio and measuring beats…");
  stopLyricsGameVideo();
  try {
    const source = await resolveHeardlePlaybackSource(track);
    if (loadToken !== rhythmState.loadToken || state.activeGame !== "rhythm") return;
    if (!source?.url) throw new Error("No direct, downloaded, or local audio source is available.");
    if (source.kind === "local" || source.kind === "downloaded") els.lyricsGameAudio.removeAttribute("crossorigin");
    else els.lyricsGameAudio.crossOrigin = "anonymous";
    els.lyricsGameAudio.src = source.url;
    els.lyricsGameAudio.volume = els.audio?.volume ?? 1;
    els.lyricsGameAudio.load();
    await applySelectedAudioOutput().catch(() => {});
    const analysis = await analyzeRhythmAudio(track, els.lyricsGameAudio);
    if (loadToken !== rhythmState.loadToken || state.activeGame !== "rhythm") return;
    rhythmState.rawChart = analysis.chart;
    rhythmState.chart = window.AuralaneGameRules.chartForLevel(analysis.chart, document.getElementById("rhythmDifficulty").value);
    rhythmState.bpm = analysis.bpm;
    rhythmState.confidence = analysis.confidence;
    rhythmState.ready = Boolean(els.lyricsGameAudio?.src);
    document.getElementById("rhythmStartButton").disabled = !rhythmState.ready;
    setRhythmFeedback(`${rhythmState.chart.length} real audio notes · ${analysis.bpm} BPM · confidence ${Math.round(analysis.confidence * 100)}%`, "#82e5a8");
  } catch (error) {
    if (loadToken !== rhythmState.loadToken) return;
    rhythmState.ready = false;
    setRhythmFeedback(`Audio analysis is unavailable: ${playbackFailureMessage(error)}`, "#ff9ba7");
  }
  drawRhythmChart();
}

async function startRhythmRun() {
  if (rhythmState.running || rhythmState.starting) return;
  if (!rhythmState.ready || !els.lyricsGameAudio?.src) {
    setRhythmFeedback("Choose a song whose real audio can be decoded first.", "#ff9ba7");
    return;
  }
  document.getElementById("rhythmResult")?.classList.add("hidden");
  document.getElementById("rhythmPauseMenu").classList.add("hidden");
  rhythmState.chart = window.AuralaneGameRules.chartForLevel(rhythmState.rawChart, document.getElementById("rhythmDifficulty").value);
  if (!rhythmState.chart.length) return;
  rhythmState.paused = false;
  rhythmState.starting = true;
  const token = ++rhythmState.runToken;
  document.getElementById("rhythmGame").classList.add("is-live");
  document.getElementById("rhythmStartButton").disabled = true;
  document.getElementById("rhythmStopButton").classList.remove("hidden");
  rhythmState.score = 0;
  rhythmState.combo = 0;
  rhythmState.maxCombo = 0;
  rhythmState.perfect = 0;
  rhythmState.great = 0;
  rhythmState.good = 0;
  rhythmState.missed = 0;
  rhythmState.life = 100;
  rhythmState.hitBursts = [];
  rhythmState.heldNotes.clear();
  rhythmState.lastJudgement = "Go!";
  updateRhythmHud();
  const countdown = document.getElementById("rhythmCountdown");
  if (countdown) {
    countdown.classList.remove("hidden");
    for (const label of ["3", "2", "1", "GO"]) {
      if (token !== rhythmState.runToken) return;
      countdown.textContent = label;
      countdown.animate([{ transform: "scale(1.35)", opacity: .2 }, { transform: "scale(1)", opacity: 1 }], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" });
      await sleep(label === "GO" ? 360 : 620);
    }
    countdown.classList.add("hidden");
  }
  if (token !== rhythmState.runToken) return;
  try { els.lyricsGameAudio.currentTime = 0; } catch {}
  const started = await playLyricsGameAudio();
  if (token !== rhythmState.runToken) { els.lyricsGameAudio?.pause(); return; }
  rhythmState.starting = false;
  if (!started) {
    stopRhythmGame();
    setRhythmFeedback("Direct audio is unavailable for this song.", "#ff9ba7");
    return;
  }
  rhythmState.running = true;
  document.getElementById("rhythmStartButton").classList.add("hidden");
  document.getElementById("rhythmStopButton").classList.remove("hidden");
  setRhythmFeedback("Go! Match D · F · J · K as notes reach the line.", "#d9c8ff");
  rhythmLoop();
}

document.getElementById("rhythmStartButton")?.addEventListener("click", startRhythmRun);
document.getElementById("rhythmReplayButton")?.addEventListener("click", startRhythmRun);

document.getElementById("rhythmStopButton")?.addEventListener("click", pauseRhythmRun);

function stopRhythmGame() {
  rhythmState.runToken += 1;
  rhythmState.starting = false;
  rhythmState.paused = false;
  rhythmState.running = false;
  rhythmState.heldNotes.clear();
  rhythmState.pressedLanes.clear();
  document.getElementById("rhythmGame")?.classList.remove("is-live");
  document.getElementById("rhythmCountdown")?.classList.add("hidden");
  document.getElementById("rhythmPauseMenu")?.classList.add("hidden");
  document.getElementById("rhythmStartButton").disabled = !rhythmState.ready;
  cancelAnimationFrame(rhythmState.animationId);
  document.getElementById("rhythmStartButton")?.classList.remove("hidden");
  document.getElementById("rhythmStopButton")?.classList.add("hidden");
  if (state.activeGame === "rhythm") els.lyricsGameAudio?.pause();
}

function rhythmClock() {
  const offset = Math.max(-300, Math.min(300, Number(document.getElementById("rhythmOffset").value) || 0));
  return (els.lyricsGameAudio?.currentTime || 0) - offset / 1000;
}

function pauseRhythmRun() {
  if (!rhythmState.running && !rhythmState.starting) return;
  if (rhythmState.starting) {
    stopRhythmGame();
    return;
  }
  rhythmState.running = false;
  rhythmState.paused = true;
  rhythmState.runToken += 1;
  rhythmState.pressedLanes.clear();
  els.lyricsGameAudio.pause();
  cancelAnimationFrame(rhythmState.animationId);
  document.querySelectorAll(".rhythm-keys-hint span").forEach((key) => key.classList.remove("is-down"));
  document.getElementById("rhythmPauseMenu").classList.remove("hidden");
}

async function resumeRhythmRun() {
  if (!rhythmState.paused || rhythmState.starting) return;
  rhythmState.starting = true;
  const token = ++rhythmState.runToken;
  const countdown = document.getElementById("rhythmCountdown");
  document.getElementById("rhythmPauseMenu").classList.add("hidden");
  countdown.classList.remove("hidden");
  for (const label of ["3", "2", "1"]) {
    if (token !== rhythmState.runToken) return;
    countdown.textContent = label;
    await sleep(600);
  }
  if (token !== rhythmState.runToken) return;
  countdown.classList.add("hidden");
  const started = await playLyricsGameAudio();
  if (token !== rhythmState.runToken) { els.lyricsGameAudio.pause(); return; }
  rhythmState.starting = false;
  if (!started) { document.getElementById("rhythmPauseMenu").classList.remove("hidden"); return; }
  rhythmState.paused = false;
  rhythmState.running = true;
  rhythmLoop();
}

function drawRhythmChart() {
  const ctx = rhythmState.canvasCtx;
  if (!ctx) return;
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const topY = 26;
  const hitY = height - 98;
  const topLeft = width * .425;
  const topRight = width * .575;
  const bottomLeft = width * .035;
  const bottomRight = width * .965;
  const now = rhythmClock();
  const lookAhead = Math.max(2.4, Math.min(4.4, Number(document.getElementById("rhythmSpeedSelect")?.value || 3.25)));
  const laneBounds = (depth, lane) => {
    const left = topLeft + (bottomLeft - topLeft) * depth;
    const right = topRight + (bottomRight - topRight) * depth;
    const laneWidth = (right - left) / 4;
    return [left + lane * laneWidth, left + (lane + 1) * laneWidth];
  };
  ctx.clearRect(0, 0, width, height);

  const sky = ctx.createRadialGradient(width * .5, topY, 10, width * .5, topY, height * .95);
  sky.addColorStop(0, "rgba(125,217,255,.22)");
  sky.addColorStop(.48, "rgba(101,79,180,.08)");
  sky.addColorStop(1, "rgba(5,7,16,.12)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const trackGradient = ctx.createLinearGradient(0, topY, 0, hitY);
  trackGradient.addColorStop(0, "rgba(34,46,72,.38)");
  trackGradient.addColorStop(.48, "rgba(20,24,45,.62)");
  trackGradient.addColorStop(1, "rgba(8,10,23,.9)");
  ctx.beginPath();
  ctx.moveTo(topLeft, topY); ctx.lineTo(topRight, topY); ctx.lineTo(bottomRight, hitY); ctx.lineTo(bottomLeft, hitY); ctx.closePath();
  ctx.fillStyle = trackGradient; ctx.fill();
  ctx.strokeStyle = "rgba(160,231,255,.56)";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (rhythmState.bpm) {
    const beatInterval = 60 / rhythmState.bpm;
    const firstBeat = Math.ceil(now / beatInterval) * beatInterval;
    for (let beat = firstBeat; beat <= now + lookAhead; beat += beatInterval) {
      const rawDepth = 1 - (beat - now) / lookAhead;
      const depth = Math.pow(Math.max(0, Math.min(1, rawDepth)), .72);
      const y = topY + (hitY - topY) * depth;
      const [left] = laneBounds(depth, 0);
      const [, right] = laneBounds(depth, 3);
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y);
      ctx.strokeStyle = `rgba(183,225,255,${.05 + depth * .16})`;
      ctx.lineWidth = 1 + depth;
      ctx.stroke();
    }
  }

  for (let lane = 0; lane < 4; lane += 1) {
    const pressed = rhythmState.pressedLanes.has(lane);
    const [topStart, topEnd] = laneBounds(0, lane);
    const [bottomStart, bottomEnd] = laneBounds(1, lane);
    ctx.beginPath();
    ctx.moveTo(topStart, topY); ctx.lineTo(topEnd, topY); ctx.lineTo(bottomEnd, hitY); ctx.lineTo(bottomStart, hitY); ctx.closePath();
    const laneColors = ["255,103,171", "108,172,255", "100,235,215", "255,207,102"];
    ctx.fillStyle = pressed ? `rgba(${laneColors[lane]},.32)` : (lane % 2 ? "rgba(255,255,255,.018)" : "rgba(255,255,255,.045)");
    ctx.fill();
    ctx.strokeStyle = "rgba(215,235,255,.17)"; ctx.lineWidth = 1; ctx.stroke();
  }

  ctx.save();
  ctx.shadowColor = "rgba(104,229,255,.95)";
  ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.moveTo(bottomLeft, hitY - 5); ctx.lineTo(bottomRight, hitY - 5); ctx.lineTo(bottomRight - 6, hitY + 8); ctx.lineTo(bottomLeft + 6, hitY + 8); ctx.closePath();
  const judgeGradient = ctx.createLinearGradient(bottomLeft, hitY, bottomRight, hitY);
  judgeGradient.addColorStop(0, "#ff73b5"); judgeGradient.addColorStop(.5, "#8cecff"); judgeGradient.addColorStop(1, "#72f0ca");
  ctx.fillStyle = judgeGradient; ctx.fill();
  ctx.restore();

  const colors = ["#ff7396", "#79a7ff", "#70e4c0", "#ffca72"];
  for (const note of rhythmState.chart) {
    if (note.state !== "pending" && note.state !== "holding") continue;
    const rawDepth = 1 - (note.time - now) / lookAhead;
    if (rawDepth < -.05 || rawDepth > 1.1) continue;
    const depth = Math.pow(Math.max(0, Math.min(1, rawDepth)), .72);
    const y = topY + (hitY - topY) * depth;
    const [start, end] = laneBounds(depth, note.lane);
    const noteHeight = 4 + depth * 10;
    const noteColor = note.type === "hold" ? "#8cf0b0" : note.type === "accent" ? "#ffe084" : "#b2f6ff";
    const inset = 2 + (1 - depth) * 3;
    if (note.type === "hold" && note.duration) {
      const endRawDepth = 1 - (note.time + note.duration - now) / lookAhead;
      const endDepth = Math.pow(Math.max(0, Math.min(1, endRawDepth)), .72);
      const endY = topY + (hitY - topY) * endDepth;
      const [tailStart, tailEnd] = laneBounds(endDepth, note.lane);
      ctx.save();
      ctx.globalAlpha = note.state === "holding" ? .88 : .55;
      ctx.beginPath();
      ctx.moveTo(start + inset, y); ctx.lineTo(end - inset, y);
      ctx.lineTo(tailEnd - 3, endY); ctx.lineTo(tailStart + 3, endY); ctx.closePath();
      const tailGradient = ctx.createLinearGradient(0, y, 0, endY);
      tailGradient.addColorStop(0, "#8cf0b0"); tailGradient.addColorStop(1, "rgba(140,240,176,.12)");
      ctx.fillStyle = tailGradient; ctx.fill();
      ctx.restore();
    }
    const gradient = ctx.createLinearGradient(start, y, end, y + noteHeight);
    gradient.addColorStop(0, "#fff"); gradient.addColorStop(.2, noteColor); gradient.addColorStop(1, noteColor);
    ctx.save();
    ctx.shadowColor = noteColor;
    ctx.shadowBlur = 4 + depth * 8;
    ctx.beginPath();
    ctx.moveTo(start + inset, y); ctx.lineTo(end - inset, y); ctx.lineTo(end - inset * .55, y + noteHeight); ctx.lineTo(start + inset * .55, y + noteHeight); ctx.closePath();
    ctx.fillStyle = gradient; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.86)"; ctx.stroke();
    ctx.restore();
  }

  const timestamp = performance.now();
  rhythmState.hitBursts = rhythmState.hitBursts.filter((burst) => timestamp - burst.startedAt < 360);
  for (const burst of rhythmState.hitBursts) {
    const age = (timestamp - burst.startedAt) / 360;
    const [start, end] = laneBounds(1, burst.lane);
    const center = (start + end) / 2;
    ctx.save();
    ctx.globalAlpha = 1 - age;
    ctx.strokeStyle = colors[burst.lane];
    ctx.lineWidth = 5 * (1 - age);
    ctx.beginPath();
    ctx.arc(center, hitY, 22 + age * 72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function rhythmRunSummary() {
  const judged = rhythmState.perfect + rhythmState.great + rhythmState.good + rhythmState.missed;
  const accuracy = judged ? Math.round(((rhythmState.perfect + rhythmState.great * .75 + rhythmState.good * .45) / judged) * 100) : 0;
  const rank = accuracy >= 98 ? "S" : accuracy >= 92 ? "A" : accuracy >= 82 ? "B" : accuracy >= 70 ? "C" : "D";
  return { judged, accuracy, rank };
}

function showRhythmResult() {
  const summary = rhythmRunSummary();
  const panel = document.getElementById("rhythmResult");
  const rank = document.getElementById("rhythmResultRank");
  const stats = document.getElementById("rhythmResultStats");
  if (rank) rank.textContent = summary.rank;
  if (stats) stats.innerHTML = `
    <span><b>${summary.accuracy}%</b><small>Accuracy</small></span>
    <span><b>${rhythmState.maxCombo}</b><small>Max combo</small></span>
    <span><b>${rhythmState.score}</b><small>Score</small></span>
  `;
  panel?.classList.remove("hidden");
}

function rhythmLoop() {
  if (!rhythmState.running) return;
  const now = rhythmClock();
  for (const [lane, note] of rhythmState.heldNotes) {
    if (now >= note.time + note.duration) {
      note.state = "hit";
      rhythmState.heldNotes.delete(lane);
      rhythmState.score += 500 + rhythmState.combo * 8;
      rhythmState.life = Math.min(100, rhythmState.life + 1.2);
      rhythmState.lastJudgement = "Hold clear";
      rhythmState.hitBursts.push({ lane, startedAt: performance.now() });
      setRhythmFeedback("Hold clear", "#8cf0ff");
    }
  }
  for (const note of rhythmState.chart) {
    if (note.state === "pending" && now - note.time > window.AuralaneGameRules.windows.good) {
      note.state = "missed";
      rhythmState.combo = 0;
      rhythmState.missed += 1;
      rhythmState.life = Math.max(0, rhythmState.life - 7);
      rhythmState.lastJudgement = "Miss";
      setRhythmFeedback("Miss", "#ff8d9a");
    }
  }
  drawRhythmChart();
  updateRhythmHud();
  if (rhythmState.life <= 0 || els.lyricsGameAudio?.ended) {
    rhythmState.running = false;
    els.lyricsGameAudio?.pause();
    document.getElementById("rhythmStartButton").classList.remove("hidden");
    document.getElementById("rhythmStopButton").classList.add("hidden");
    document.getElementById("rhythmStartButton").disabled = false;
    document.getElementById("rhythmGame").classList.remove("is-live");
    const judged = rhythmState.perfect + rhythmState.great + rhythmState.good + rhythmState.missed;
    const accuracy = judged ? Math.round(((rhythmState.perfect + rhythmState.great * .75 + rhythmState.good * .45) / judged) * 100) : 0;
    rhythmState.lastJudgement = rhythmState.life <= 0 ? "Failed" : "Complete";
    updateRhythmHud();
    setRhythmFeedback(
      rhythmState.life <= 0 ? `Run failed · ${accuracy}% · Max combo ${rhythmState.maxCombo}` : `Run complete · ${accuracy}% · Score ${rhythmState.score}`,
      rhythmState.life <= 0 ? "#ff8d9a" : "#82e5a8"
    );
    showRhythmResult();
    return;
  }
  rhythmState.animationId = requestAnimationFrame(rhythmLoop);
}

document.addEventListener("keydown", (event) => {
  if (!rhythmState.running || event.repeat) return;
  if (/INPUT|TEXTAREA|SELECT/.test(event.target?.tagName || "")) return;
  const lane = ({ d: 0, f: 1, j: 2, k: 3 })[event.key.toLowerCase()];
  if (lane === undefined) return;
  event.preventDefault();
  rhythmState.pressedLanes.add(lane);
  if (rhythmState.heldNotes.has(lane)) return;
  rhythmState.pressedLane = lane;
  rhythmState.pressedUntil = performance.now() + 125;
  const keyEl = document.querySelectorAll(".rhythm-keys-hint span")[lane];
  if (keyEl) {
    keyEl.classList.remove("is-down");
    void keyEl.offsetWidth;
    keyEl.classList.add("is-down");
    window.setTimeout(() => keyEl.classList.remove("is-down"), 125);
  }
  const now = rhythmClock();
  const note = rhythmState.chart.filter((entry) => entry.state === "pending" && entry.lane === lane)
    .sort((left, right) => Math.abs(left.time - now) - Math.abs(right.time - now))[0];
  if (!note) {
    rhythmState.lastJudgement = "Empty";
    setRhythmFeedback("No note", "#8f97ad");
    updateRhythmHud();
    return;
  }
  const signedDelta = note.time - now;
  const delta = Math.abs(signedDelta);
  const judgement = window.AuralaneGameRules.judge(delta);
  if (judgement === "perfect") {
    note.state = note.type === "hold" ? "holding" : "hit"; rhythmState.score += 1000 + rhythmState.combo * 10; rhythmState.combo += 1; rhythmState.perfect += 1; rhythmState.life = Math.min(100, rhythmState.life + .8); rhythmState.lastJudgement = note.type === "hold" ? "Hold" : "Perfect"; setRhythmFeedback(note.type === "hold" ? "Hold" : "Perfect", "#82e5a8");
  } else if (judgement === "great") {
    note.state = note.type === "hold" ? "holding" : "hit"; rhythmState.score += 600 + rhythmState.combo * 6; rhythmState.combo += 1; rhythmState.great += 1; rhythmState.life = Math.min(100, rhythmState.life + .35); rhythmState.lastJudgement = note.type === "hold" ? "Hold" : "Great"; setRhythmFeedback(note.type === "hold" ? "Hold" : "Great", "#ffd47d");
  } else if (judgement === "good") {
    note.state = note.type === "hold" ? "holding" : "hit"; rhythmState.score += 300; rhythmState.combo += 1; rhythmState.good += 1; rhythmState.lastJudgement = note.type === "hold" ? "Hold" : "Good"; setRhythmFeedback(note.type === "hold" ? "Hold" : "Good", "#93b7ff");
  } else {
    rhythmState.lastJudgement = signedDelta > 0 ? "Early" : "Late";
    setRhythmFeedback(signedDelta > 0 ? "Early" : "Late", "#aab2c8");
    updateRhythmHud();
    return;
  }
  rhythmState.maxCombo = Math.max(rhythmState.maxCombo, rhythmState.combo);
  if (note.state === "holding") rhythmState.heldNotes.set(lane, note);
  note.headJudgement = judgement;
  rhythmState.hitBursts.push({ lane, startedAt: performance.now() });
  updateRhythmHud();
});

document.addEventListener("keydown", (event) => {
  if (state.activeGame !== "heardle" || event.repeat) return;
  if (event.code !== "Space" || /INPUT|TEXTAREA|SELECT/.test(event.target?.tagName || "")) return;
  event.preventDefault();
  document.getElementById("heardlePlayButton")?.click();
});

document.addEventListener("keyup", (event) => {
  const lane = ({ d: 0, f: 1, j: 2, k: 3 })[event.key.toLowerCase()];
  if (lane === undefined) return;
  rhythmState.pressedLanes.delete(lane);
  if (!rhythmState.running) return;
  const held = rhythmState.heldNotes.get(lane);
  if (held && rhythmClock() < held.time + held.duration - .1) {
    held.state = "missed";
    rhythmState.heldNotes.delete(lane);
    rhythmState.combo = 0;
    rhythmState.missed += 1;
    if (held.headJudgement) rhythmState[held.headJudgement] = Math.max(0, rhythmState[held.headJudgement] - 1);
    rhythmState.life = Math.max(0, rhythmState.life - 6);
    rhythmState.lastJudgement = "Hold break";
    setRhythmFeedback("Hold break", "#ff8d9a");
    updateRhythmHud();
  }
  document.querySelectorAll(".rhythm-keys-hint span")[lane]?.classList.remove("is-down");
});

function stopArcadeSessions() {
  heardleState.loadToken += 1;
  rhythmState.loadToken += 1;
  stopHeardleAudio();
  restoreHeardlePlayer();
  stopRhythmGame();
  stopLyricsGameVideo();
  state.lyricFillLyricsRequest += 1;
}

function chooseArcadeSong() {
  stopRhythmGame();
  rhythmState.loadToken += 1;
  stopLyricsGameVideo();
  showLyricsGameStage("search");
  renderLyricsGameSearchPrompt();
  els.lyricsGameSearchInput?.focus();
}

document.getElementById("lyricsReplayButton").addEventListener("click", () => startLyricsChoiceGame(state.lyricFillLevel));
document.getElementById("lyricsChooseButton").addEventListener("click", chooseArcadeSong);
document.getElementById("heardleNewSessionButton").addEventListener("click", startHeardleSession);
document.getElementById("heardleSessionReplay").addEventListener("click", startHeardleSession);
document.getElementById("rhythmChooseButton").addEventListener("click", chooseArcadeSong);
document.getElementById("rhythmQuitButton").addEventListener("click", chooseArcadeSong);
document.getElementById("rhythmResultChooseButton").addEventListener("click", chooseArcadeSong);
document.getElementById("rhythmResumeButton").addEventListener("click", resumeRhythmRun);
document.getElementById("rhythmRestartButton").addEventListener("click", () => { stopRhythmGame(); void startRhythmRun(); });
document.getElementById("rhythmDifficulty").addEventListener("change", () => {
  if (rhythmState.running || rhythmState.starting) return;
  rhythmState.chart = window.AuralaneGameRules.chartForLevel(rhythmState.rawChart, document.getElementById("rhythmDifficulty").value);
  updateRhythmHud();
  drawRhythmChart();
});
document.addEventListener("keydown", (event) => {
  if (state.activeGame !== "lyrics" || event.repeat || /INPUT|TEXTAREA|SELECT/.test(event.target?.tagName || "")) return;
  const index = Number(event.key) - 1;
  if (index >= 0 && index < 4) {
    const button = els.lyricsGameOptions?.querySelectorAll("button")[index];
    if (button && document.getElementById("lyricsResult").classList.contains("hidden")) { event.preventDefault(); button.click(); }
  }
});
window.addEventListener("blur", () => {
  if (state.activeGame === "rhythm") pauseRhythmRun();
  if (state.activeGame === "lyrics" && state.lyricFillStage === "play" && state.lyricFillGame && !state.lyricFillGame.finished) setLyricsGamePauseMenu(true);
  if (state.activeGame === "heardle") { stopHeardleAudio(); document.getElementById("heardlePlayButton").disabled = !heardleState.currentTrack || heardleState.roundFinished; }
});

window.addEventListener("error", (event) => {
  console.error("[ui] window.onerror:", event.message, "at", event.filename, event.lineno, event.colno, event.error?.stack || "");
});
window.addEventListener("unhandledrejection", (event) => {
  console.error("[ui] window.unhandledrejection:", event.reason?.message || event.reason, event.reason?.stack || "");
});

init().catch((error) => {
  console.error("[boot-ui] top-level init() rejected:", error?.message || error, error?.stack || "");
  try {
    els.homeStatus.textContent = "Fatal UI init failure: " + (error?.message || String(error));
    els.homeFallbackActions?.classList.remove("hidden");
  } catch {}
});
