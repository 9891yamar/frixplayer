import "./style.css";

// DOM要素の型定義
interface PlayerElements {
    video: HTMLVideoElement;
    playPauseBtn: HTMLButtonElement;
    playPauseIcon: HTMLElement;
    rewindBtn: HTMLButtonElement;
    fastForwardBtn: HTMLButtonElement;
    progressBar: HTMLElement;
    progressFill: HTMLElement;
    currentTimeDisplay: HTMLElement;
    durationTimeDisplay: HTMLElement;
    volumeControl: HTMLInputElement;
    volumeIcon: HTMLElement;
    volumeProgress: HTMLElement;
    fullscreenBtn: HTMLButtonElement;
    fullscreenIcon: HTMLElement;
    controlsContainer: HTMLElement;
    playerContainer: HTMLElement;
}

// プレイヤーの状態
interface PlayerState {
    hideControlsTimeout: number | null;
    isUserSeeking: boolean;
}

// 要素取得のヘルパー関数
const getElement = <T extends HTMLElement>(selector: string): T => {
    console.log(`Looking for element: ${selector}`);
    const element = document.querySelector<T>(selector);
    if (!element) {
        console.error(`Element not found: ${selector}`);
        throw new Error(`Element not found: ${selector}`);
    }
    console.log(`Found element: ${selector}`, element);
    return element;
};

// DOM要素を取得する関数
const getPlayerElements = (): PlayerElements => ({
    video: getElement<HTMLVideoElement>("#main-video"),
    playPauseBtn: getElement<HTMLButtonElement>("#play-pause-btn"),
    playPauseIcon: getElement<HTMLElement>("#play-pause-btn i"),
    rewindBtn: getElement<HTMLButtonElement>("#rewind-btn"),
    fastForwardBtn: getElement<HTMLButtonElement>("#fast-forward-btn"),
    progressBar: getElement<HTMLElement>("#progress-bar"),
    progressFill: getElement<HTMLElement>("#progress-fill"),
    currentTimeDisplay: getElement<HTMLElement>("#current-time"),
    durationTimeDisplay: getElement<HTMLElement>("#duration-time"),
    volumeControl: getElement<HTMLInputElement>("#volume-control"),
    volumeIcon: getElement<HTMLElement>("#volume-container i"),
    volumeProgress: getElement<HTMLElement>("#volume-progress"),
    fullscreenBtn: getElement<HTMLButtonElement>("#fullscreen-btn"),
    fullscreenIcon: getElement<HTMLElement>("#fullscreen-btn i"),
    controlsContainer: getElement<HTMLElement>("#controls-container"),
    playerContainer: getElement<HTMLElement>("#player-container"),
});

// 初期状態を作成する関数
const createInitialState = (): PlayerState => ({
    hideControlsTimeout: null,
    isUserSeeking: false,
});

// 時間を分:秒形式にフォーマットする関数
const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// 時間表示を更新する関数
const updateTimeDisplay = (elements: PlayerElements) => () => {
    const currentTime = elements.video.currentTime;
    const duration = elements.video.duration;

    elements.currentTimeDisplay.textContent = formatTime(currentTime);
    elements.durationTimeDisplay.textContent = formatTime(duration);
};

// 再生/一時停止を切り替える関数
const togglePlayPause = (elements: PlayerElements) => () => {
    console.log("togglePlayPause called, video paused:", elements.video.paused);

    try {
        if (elements.video.paused) {
            const playPromise = elements.video.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.error("Play failed:", error);
                });
            }
        } else {
            elements.video.pause();
        }
    } catch (error) {
        console.error("Error in togglePlayPause:", error);
    }
};

// 再生/一時停止アイコンを更新する関数
const updatePlayPauseIcon = (elements: PlayerElements) => () => {
    if (elements.video.paused) {
        elements.playPauseIcon.className = "fas fa-play";
    } else {
        elements.playPauseIcon.className = "fas fa-pause";
    }
};

// シーク機能
const seek = (elements: PlayerElements) => (seconds: number) => {
    const newTime = elements.video.currentTime + seconds;
    elements.video.currentTime = Math.max(
        0,
        Math.min(newTime, elements.video.duration)
    );
};

// プログレスバークリック処理
const handleProgressBarClick =
    (elements: PlayerElements) => (e: MouseEvent) => {
        const rect = elements.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * elements.video.duration;

        if (isFinite(newTime)) {
            elements.video.currentTime = newTime;
        }
    };

// プログレス更新
const updateProgress = (elements: PlayerElements, state: PlayerState) => () => {
    if (!state.isUserSeeking && elements.video.duration) {
        const percentage =
            (elements.video.currentTime / elements.video.duration) * 100;
        elements.progressFill.style.width = `${percentage}%`;
    }

    // 時間表示も更新
    updateTimeDisplay(elements)();
};

// 音量初期化
const initializeVolume = (elements: PlayerElements) => () => {
    const volume = parseInt(elements.volumeControl.value) / 100;
    elements.video.volume = volume;
    updateVolumeIcon(elements)();
    updateVolumeProgress(elements)();
};

// プレイヤー初期化時の時間表示設定
const initializeTimeDisplay = (elements: PlayerElements) => () => {
    updateTimeDisplay(elements)();
};

// 音量更新
const updateVolume = (elements: PlayerElements) => () => {
    const volume = parseInt(elements.volumeControl.value) / 100;
    elements.video.volume = volume;

    if (volume > 0) {
        elements.video.muted = false;
    }

    updateVolumeProgress(elements)();
};

// ミュート切り替え
const toggleMute = (elements: PlayerElements) => () => {
    elements.video.muted = !elements.video.muted;

    if (elements.video.muted) {
        elements.volumeControl.value = "0";
    } else {
        elements.volumeControl.value = String(
            Math.round(elements.video.volume * 100)
        );
    }

    updateVolumeProgress(elements)();
};

// 音量アイコン更新
const updateVolumeIcon = (elements: PlayerElements) => () => {
    const volume = elements.video.muted ? 0 : elements.video.volume;

    if (volume === 0) {
        elements.volumeIcon.className = "fas fa-volume-mute";
    } else if (volume < 0.5) {
        elements.volumeIcon.className = "fas fa-volume-down";
    } else {
        elements.volumeIcon.className = "fas fa-volume-up";
    }
};

// 音量プログレス更新（赤色で表示）
const updateVolumeProgress = (elements: PlayerElements) => () => {
    const volume = parseInt(elements.volumeControl.value);
    elements.volumeProgress.style.width = `${volume}%`;
    elements.volumeProgress.style.backgroundColor = "#e50914"; // Netflix赤色
};

// フルスクリーン切り替え
const toggleFullscreen = (elements: PlayerElements) => () => {
    if (!document.fullscreenElement) {
        elements.playerContainer.requestFullscreen().catch((err) => {
            console.error("フルスクリーンエラー:", err);
        });
    } else {
        document.exitFullscreen().catch((err) => {
            console.error("フルスクリーン終了エラー:", err);
        });
    }
};

// フルスクリーンアイコン更新
const updateFullscreenIcon = (elements: PlayerElements) => () => {
    if (document.fullscreenElement) {
        elements.fullscreenIcon.className = "fas fa-compress";
    } else {
        elements.fullscreenIcon.className = "fas fa-expand";
    }
};

// キーボード処理
const handleKeyPress = (elements: PlayerElements) => (e: KeyboardEvent) => {
    // 入力フィールドにフォーカスがある場合はスキップ
    if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
    ) {
        return;
    }

    switch (e.code) {
        case "Space":
            e.preventDefault();
            togglePlayPause(elements)();
            break;
        case "ArrowRight":
            e.preventDefault();
            seek(elements)(10);
            break;
        case "ArrowLeft":
            e.preventDefault();
            seek(elements)(-10);
            break;
        case "KeyF":
            e.preventDefault();
            toggleFullscreen(elements)();
            break;
    }
};

// 動画エリアクリック処理
const handleVideoClick = (elements: PlayerElements) => (e: MouseEvent) => {
    // コントロールボタンがクリックされた場合は無視
    if (
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLInputElement ||
        (e.target as HTMLElement).closest("#controls-container")
    ) {
        return;
    }

    // 動画エリアをクリックした場合のみ再生/一時停止を切り替え
    e.preventDefault();
    togglePlayPause(elements)();
};

// コントロール一時表示
const showControlsTemporarily =
    (elements: PlayerElements, state: PlayerState) => () => {
        // コントロールを表示
        elements.controlsContainer.style.opacity = "1";
        elements.controlsContainer.style.visibility = "visible";
        elements.playerContainer.style.cursor = "default";

        // 既存のタイマーをクリア
        if (state.hideControlsTimeout) {
            clearTimeout(state.hideControlsTimeout);
        }

        // ビデオが再生中の場合のみ自動非表示タイマーを設定
        if (!elements.video.paused) {
            state.hideControlsTimeout = window.setTimeout(() => {
                hideControls(elements, state)();
            }, 3000);
        }
    };

// コントロール非表示
const hideControls = (elements: PlayerElements, state: PlayerState) => () => {
    if (!elements.video.paused) {
        elements.controlsContainer.style.opacity = "0";
        elements.controlsContainer.style.visibility = "hidden";
        elements.playerContainer.style.cursor = "none";
    }

    if (state.hideControlsTimeout) {
        clearTimeout(state.hideControlsTimeout);
        state.hideControlsTimeout = null;
    }
};

// イベントリスナーをセットアップする関数
const setupEventListeners = (elements: PlayerElements, state: PlayerState) => {
    console.log("Setting up event listeners...");

    // 再生/一時停止ボタン
    elements.playPauseBtn.addEventListener("click", (e) => {
        console.log("Play/pause button clicked", e);
        togglePlayPause(elements)();
    });

    // 早送り/巻き戻しボタン
    elements.rewindBtn.addEventListener("click", () => seek(elements)(-10));
    elements.fastForwardBtn.addEventListener("click", () => seek(elements)(10));

    // プログレスバー
    elements.progressBar.addEventListener(
        "click",
        handleProgressBarClick(elements)
    );
    elements.progressBar.addEventListener(
        "mousedown",
        () => (state.isUserSeeking = true)
    );
    elements.progressBar.addEventListener(
        "mouseup",
        () => (state.isUserSeeking = false)
    );

    // 音量コントロール
    elements.volumeControl.addEventListener("input", updateVolume(elements));
    elements.volumeIcon.addEventListener("click", toggleMute(elements));

    // フルスクリーンボタン
    elements.fullscreenBtn.addEventListener(
        "click",
        toggleFullscreen(elements)
    );

    // ビデオイベント
    elements.video.addEventListener("play", updatePlayPauseIcon(elements));
    elements.video.addEventListener("pause", updatePlayPauseIcon(elements));
    elements.video.addEventListener(
        "timeupdate",
        updateProgress(elements, state)
    );
    elements.video.addEventListener(
        "loadedmetadata",
        updateProgress(elements, state)
    );
    elements.video.addEventListener("volumechange", updateVolumeIcon(elements));

    // キーボードショートカット
    document.addEventListener("keydown", handleKeyPress(elements));

    // 動画エリアクリック（再生/一時停止切り替え）
    elements.playerContainer.addEventListener(
        "click",
        handleVideoClick(elements)
    );

    // マウス移動とコントロール自動非表示
    elements.playerContainer.addEventListener(
        "mousemove",
        showControlsTemporarily(elements, state)
    );
    elements.playerContainer.addEventListener(
        "mouseleave",
        hideControls(elements, state)
    );

    // フルスクリーン変更イベント
    document.addEventListener(
        "fullscreenchange",
        updateFullscreenIcon(elements)
    );
};

// プレイヤー初期化関数
const initializePlayer = (elements: PlayerElements) => {
    console.log("Initializing player...");

    // ネイティブコントロールを無効化
    elements.video.removeAttribute("controls");

    // 動画の読み込み状態をチェック
    elements.video.addEventListener("loadstart", () => {
        console.log("Video loading started");
    });

    elements.video.addEventListener("canplay", () => {
        console.log("Video can start playing");
    });

    elements.video.addEventListener("error", (e) => {
        console.error("Video error:", e);
        console.error("Video error details:", elements.video.error);
    });

    console.log("Player initialization complete");
};

// メイン初期化関数
const createNetflixPlayer = (): void => {
    try {
        console.log("Initializing Netflix Player...");

        const elements = getPlayerElements();
        const state = createInitialState();

        initializePlayer(elements);
        setupEventListeners(elements, state);
        initializeVolume(elements)();
        initializeTimeDisplay(elements)();

        console.log("Netflix Player initialized successfully");
    } catch (error) {
        console.error("Failed to initialize Netflix Player:", error);
    }
};

// DOMの準備状態に応じて初期化
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createNetflixPlayer);
} else {
    createNetflixPlayer();
}
