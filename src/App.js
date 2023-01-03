import React, { useState, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ReactPlayer from "react-player";
import { makeStyles, styled } from "@mui/styles";
import Grid from "@mui/material/Grid";
import PlayerControls from "./components/PlayerControls";
import screenfull from "screenfull";
import Paper from "@mui/material/Paper";

const useStyles = makeStyles({
  playerWrapper: {
    width: "100%",
    height: "480px",
    position: "relative",
  },
});

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes().toString().padStart(2, "0");
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm}:${ss}`;
  }

  return `${mm}:${ss}`;
};

let count = 0;

function App() {
  const classes = useStyles();

  const [state, setState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
  });

  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const [bookmarks, setBookmarks] = useState([]);

  const { playing, muted, volume, playbackRate, played, seeking } = state; // state.playing = playing

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleVolumeChange = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };
  const handleVolumeSeekUp = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const handlePlaybackRateChange = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const toggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current);
  };
  
  const handleProgress = (changeState) => {
    // console.log(changeState);

    if (count > 1) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility === "visible") {
      count++;
    }

    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };
  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  };

  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat === "normal" ? "remaining" : "normal"
    );
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;

    const ctx = canvas.getContext("2d");
    // console.log(ctx)

    const player = playerRef.current.getInternalPlayer();
    // console.log(player);
    player.onload = () =>
      ctx.drawImage(player, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;

    setBookmarks([
      ...bookmarks,
      { time: currentTime, display: elapsedTime, image: imageUrl },
    ]);
  };

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapsedTime =
    timeDisplayFormat === "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;
  const totalDuration = format(duration);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">React Video Player</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="md">
        <div
          ref={playerContainerRef}
          className={classes.playerWrapper}
          onMouseMove={handleMouseMove}
        >
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="100%"
            // url="https://www.youtube.com/watch?v=lsfV8rmcu9k&ab_channel=LeoTwins"
            url="https://streamable.com/ztdhak"
            controls={false}
            muted={muted}
            playing={playing}
            volume={volume}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            config={{
              file: {
                attributes: {
                  crossorigin: "anonymous",
                },
              },
            }}
          />

          <PlayerControls
            ref={controlsRef}
            onPlayPause={handlePlayPause}
            playing={playing}
            onRewind={handleRewind}
            onFastForward={handleFastForward}
            muted={muted}
            onMute={handleMute}
            volume={volume}
            onVolumeChange={handleVolumeChange}
            onVolumeSeekUp={handleVolumeSeekUp}
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlaybackRateChange}
            onToggleFullScreen={toggleFullScreen}
            played={played}
            onSeek={handleSeekChange}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
            elapsedTime={elapsedTime}
            totalDuration={totalDuration}
            onChangeDisplayFormat={handleChangeDisplayFormat}
            onBookmark={addBookmark}
          />
        </div>

        <Grid container style={{ marginTop: 20 }} spacing={3}>
          {bookmarks.map((bookmark, index) => (
            <Grid item key={index}>
              <Paper onClick={() => playerRef.current.seekTo(bookmark.time)}>
                <img crossOrigin="anonymous" src={bookmark.image} />
                <Typography style={{textAlign:"center"}}>Bookmark at {bookmark.display}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <canvas ref={canvasRef} />
      </Container>
    </>
  );
}

export default App;
