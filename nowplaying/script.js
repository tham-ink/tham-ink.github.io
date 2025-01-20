const apiUrl = "https://spotify-now-playing-ten-indol.vercel.app/now-playing";

let currentProgress = 0;
let currentDuration = 0;
let timerInterval;
let isFetching = false;

// Fetch Now Playing Data
const fetchNowPlaying = async () => {
    if (isFetching) return;
    isFetching = true;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            console.log("Fetched Data:", data);

            // Always update recent tracks whether there's a song or not
            updateRecentTracks(data.recent_tracks);

            // If there *is* a song playing
            if (data.now_playing && data.now_playing.song) {
                const currentSongName = document.getElementById("song-name").textContent.trim();
                const currentArtistName = document.getElementById("artist-name").textContent.trim();
                const newSongName = data.now_playing.song.trim();
                const newArtistName = data.now_playing.artist.trim();
                const isNewSong = newSongName !== currentSongName || newArtistName !== currentArtistName;

                console.log(`Is New Song: ${isNewSong}`);
                updateNowPlaying(data.now_playing);

                if (isNewSong) {
                    // If it's a new song, reset the timer
                    resetTimer();
                }
            } else {
                // No song playing
                updateNowPlaying(null);
            }

        } else {
            console.error("Failed to fetch now playing data.");
            updateNowPlaying(null);
        }
    } catch (error) {
        console.error("Error fetching now playing data:", error);
        updateNowPlaying(null);
    } finally {
        isFetching = false;
    }
};

// Update Recent Tracks
const updateRecentTracks = (tracks) => {
    const recentTracksList = document.getElementById("recent-tracks");
    recentTracksList.innerHTML = "";
    if (!tracks) return; // Just in case

    tracks.forEach(track => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${track.album_cover}" alt="Album cover">
            <div class="track-info">
                <strong>${track.song}</strong>
                <span>${track.artist}</span>
            </div>
            <a href="${track.link}" target="_blank">Listen</a>
        `;
        recentTracksList.appendChild(li);
    });
};


    // Update Now Playing Section
    const updateNowPlaying = (song) => {
        if (!song || !song.song) {
            // If no song is playing, set a default title
            document.title = "nothings playing";
            // Optionally, you can also clear or set default values for other elements
            document.getElementById("song-name").textContent = "No song playing";
            document.getElementById("artist-name").textContent = "";
            document.getElementById("album-name").textContent = "";
            document.getElementById("album-art").src = "album.png";
            document.getElementById("elapsed-time").textContent = "0:00";
            document.getElementById("total-duration").textContent = "0:00";
            document.getElementById("progress-bar").style.width = `0%`;
            return;
        }

        // Update song details
        document.getElementById("song-name").textContent = song.song;
        document.getElementById("artist-name").textContent = song.artist;
        document.getElementById("album-name").textContent = song.album;
        document.getElementById("album-art").src = song.album_cover || "album.png";

        // Update playlist info
        const playlistElement = document.getElementById("playlist-name");
        if (song.playlist && song.playlist.name) {
            playlistElement.innerHTML = `Listening to: <a href="${song.playlist.link}" target="_blank">${song.playlist.name}</a>`;
        } else {
            playlistElement.textContent = "";
        }

        // Update webpage title to the song's name in lowercase
        document.title = song.song.toLowerCase();

        // Update timer and progress bar
        currentProgress = parseTime(song.progress);
        currentDuration = parseTime(song.duration);
        console.log(`Current Progress (seconds): ${currentProgress}`); // Debugging
        console.log(`Current Duration (seconds): ${currentDuration}`); // Debugging
        document.getElementById("elapsed-time").textContent = formatTime(currentProgress);
        document.getElementById("total-duration").textContent = formatTime(currentDuration);
        updateProgressBar();
        updateTimeInfo(); // Update elapsed time display
        // Start the timer (will clear any existing timer)
        startTimer();
    };

    // Parse time in "MM:SS" format to seconds
    const parseTime = (time) => {
        if (!time) return 0;
        const [minutes, seconds] = time.split(":").map(Number);
        const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
        console.log(`Parsed Time - Minutes: ${minutes}, Seconds: ${seconds}, Total Seconds: ${totalSeconds}`); // Debugging
        return totalSeconds;
    };

    // Format seconds to "M:SS" format
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, "0")}`;
    };

    // Start the timer
    const startTimer = () => {
        clearInterval(timerInterval); // Clear any existing timer
        timerInterval = setInterval(() => {
            currentProgress++;
            if (currentProgress >= currentDuration) {
                // Song ended, fetch new data
                clearInterval(timerInterval);
                fetchNowPlaying();
                return;
            }
            updateProgressBar();
            updateTimeInfo();
        }, 1000);
    };

    // Update Progress Bar
    const updateProgressBar = () => {
        const progressPercent = currentDuration ? (currentProgress / currentDuration) * 100 : 0;
        console.log(`Progress Percent: ${progressPercent}%`); // Debugging
        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = `${progressPercent}%`;
    };

    // Update Time Information
    const updateTimeInfo = () => {
        document.getElementById("elapsed-time").textContent = formatTime(currentProgress);
        document.getElementById("total-duration").textContent = formatTime(currentDuration);
    };

    // Reset the timer (without resetting currentProgress)
    const resetTimer = () => {
        clearInterval(timerInterval);
        updateProgressBar();
        updateTimeInfo();
        startTimer();
    };

    // Initial fetch and set interval to refresh every 20 seconds
    setInterval(fetchNowPlaying, 5000);
    fetchNowPlaying();