import React, { forwardRef } from "react";
import Typography from "@mui/material/Typography";
import { makeStyles, styled } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import IconButton from "@mui/material/IconButton";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FullScreenIcon from "@mui/icons-material/Fullscreen";
import Popover from "@mui/material/Popover";

const useStyles = makeStyles({
  controlsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1,
  },

  controlIcons: {
    color: "#777!important",
    fontSize: 50,
    transform: "scale(1.3)",
    "&:hover": {
      color: "#fff!important",
      transform: "scale(1.5)",
    },
  },

  bottomIcons: {
    color: "#999!important",
    "&:hover": {
      color: "#fff!important",
    },
  },

  volumeSlider: {
    width: `100px!important`,
  },
});

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default forwardRef(
  (
    {
      playing,
      onPlayPause,
      onRewind,
      onFastForward,
      muted,
      onMute,
      onVolumeChange,
      onVolumeSeekUp,
      volume,
      playbackRate,
      onPlaybackRateChange,
      onToggleFullScreen,
      played,
      onSeek,
      onSeekMouseDown,
      onSeekMouseUp,
      elapsedTime,
      totalDuration,
      onChangeDisplayFormat,
      onBookmark,
    },
    ref
  ) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopover = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "playbackrate-popover" : undefined;

    return (
      <div className={classes.controlsWrapper} ref={ref}>
        {/* Top controls */}
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          style={{ padding: 16 }}
        >
          <Grid item>
            <Typography variant="h5" style={{ color: "#fff" }}>
              Video Title
            </Typography>
          </Grid>

          <Grid item>
            <Button
              onClick={onBookmark}
              variant="contained"
              color="primary"
              startIcon={<BookmarkIcon />}
            >
              Bookmark
            </Button>
          </Grid>
        </Grid>

        {/* Middle controls */}
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            onClick={onRewind}
            className={classes.controlIcons}
            aria-label="rewind"
          >
            <FastRewindIcon fontSize="inherit" />
          </IconButton>

          <IconButton
            onClick={onPlayPause}
            className={classes.controlIcons}
            aria-label="rewind"
          >
            {playing ? (
              <PauseIcon fontSize="inherit" />
            ) : (
              <PlayArrowIcon fontSize="inherit" />
            )}
          </IconButton>

          <IconButton
            onClick={onFastForward}
            className={classes.controlIcons}
            aria-label="rewind"
          >
            <FastForwardIcon fontSize="inherit" />
          </IconButton>
        </Grid>

        {/* Bottom controls */}
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ padding: 16 }}
        >
          <Grid item xs={12}>
            <PrettoSlider
              min={0}
              max={100}
              value={played * 100}
              valueLabelDisplay="auto"
              slots={{
                valueLabel: (props) => (
                  <ValueLabelComponent {...props} value={elapsedTime} />
                ),
              }}
              onChange={onSeek}
              onMouseDown={onSeekMouseDown}
              onChangeCommitted={onSeekMouseUp}
            />
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <IconButton onClick={onPlayPause} className={classes.bottomIcons}>
                {playing ? (
                  <PauseIcon fontSize="large" />
                ) : (
                  <PlayArrowIcon fontSize="large" />
                )}
              </IconButton>

              <IconButton onClick={onMute} className={classes.bottomIcons}>
                {muted ? (
                  <VolumeOffIcon fontSize="large" />
                ) : (
                  <VolumeUpIcon fontSize="large" />
                )}
              </IconButton>

              <Slider
                size="small"
                min={0}
                max={100}
                value={volume * 100}
                className={classes.volumeSlider}
                onChange={onVolumeChange}
                onChangeCommitted={onVolumeSeekUp}
              />

              <Button
                onClick={onChangeDisplayFormat}
                variant="text"
                style={{ color: "#fff", marginLeft: 16 }}
              >
                <Typography>
                  {elapsedTime} / {totalDuration}
                </Typography>
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              onClick={handlePopover}
              variant="text"
              className={classes.bottomIcons}
            >
              <Typography>{playbackRate}X</Typography>
            </Button>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Grid container direction="column-reverse">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <Button
                    onClick={() => onPlaybackRateChange(rate)}
                    variant="text"
                  >
                    <Typography
                      color={rate === playbackRate ? "primary" : "grey"}
                    >
                      {rate}x
                    </Typography>
                  </Button>
                ))}
              </Grid>
            </Popover>

            <IconButton
              onClick={onToggleFullScreen}
              className={classes.bottomIcons}
            >
              <FullScreenIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    );
  }
);
