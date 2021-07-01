import React, {useState, useEffect, useRef, useContext} from "react";
import {makeStyles} from "@material-ui/core";
import {debounce} from "lodash";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import clsx from "clsx";
import {t} from "src/i18n/utils";
import {scrollHelper} from "src/util/scrollUtils";
import {useHistory} from "react-router-dom";
import {YoutubePlayerContext} from "./YoutubeVideoPlayer";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100%",
  },
  wayPoint: {
    position: "relative",
    top: "130px",
  },
  verticalVideo: {
    "& > .video-js.vjs-16-9": {
      paddingTop: "100%",
    },
  },
  transcodingTips: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.1)",
    border: "1px solid rgba(0,0,0,.1)",
    borderRadius: 10,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  hiddenVideo: {
    opacity: 0,
  },
}));

const isInViewPort = (element) => {
  if (!element.current) return false;
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const {
    top,
    // right,
    bottom,
    // left,
  } = element.current?.getBoundingClientRect();

  return top >= 0 && bottom <= viewHeight;
};

export const VideoPlayerContext = React.createContext({
  arrPlayer: new Array(),
  arrPlayerId: new Array(),
  currentPlayer: {
    vid: 0,
    player: null,
  },
});

export const VideoPlayer = ({options, postObj, _isVertical}) => {
  const classes = useStyles();
  const history = useHistory();
  const playerRef = useRef(null);
  const vpContext = useContext(VideoPlayerContext);
  const {youtubePlayers} = useContext(YoutubePlayerContext);
  const [isVertical, setIsVertical] = useState(false);
  const [isMov, setIsMov] = useState(false);
  let timer = null;

  useEffect(() => {}, [playerRef]);

  const setCurrentPlayer = (video) => {
    vpContext.currentPlayer.vid = video?.options_.id;
    vpContext.currentPlayer.player = video;
  };

  const resetCurrentPlayer = () => {
    vpContext.currentPlayer.vid = 0;
    vpContext.currentPlayer.player = null;
  };

  const listenToScroll = debounce((e) => {
    if (playerRef?.current) {
      scrollEvent(playerRef);
    }
  }, 50);

  const scrollEvent = (player, direction = "up") => {
    if (isInViewPort(player)) {
      setPlay(player);
    } else {
      setPause(player);
    }
  };

  const setPause = (player) => {
    const video = getInstanceVideo(player);
    if (video && vpContext.currentPlayer.vid === video?.options_.id) {
      video?.pause()?.catch(() => {});
      video?.muted(true);
      resetCurrentPlayer();
    }
  };

  const pauseYoutubeVideos = () =>
    youtubePlayers.forEach(({pauseVideo}) => pauseVideo());

  const doPlay = (video, unmute = false) => {
    if (
      vpContext.currentPlayer.player &&
      vpContext.currentPlayer.vid !== video?.options_.id
    ) {
      vpContext.currentPlayer.player.pause()?.catch(() => {});
      vpContext.currentPlayer.player.muted(true);
    }
    video?.play()?.catch(() => {});
    if (unmute) {
      pauseYoutubeVideos();
      video?.muted(false);
    }
    setCurrentPlayer(video);
  };

  const setPlay = (player) => {
    const video = getInstanceVideo(player);

    if (!video) return;
    if (vpContext.currentPlayer.vid !== video?.options_.id) {
      doPlay(video);
    }
  };

  const pushArr = (player) => {
    if (vpContext.arrPlayerId.indexOf(player.current.id) === -1) {
      const video = videojs(player.current, options, () => {});
      vpContext.arrPlayerId.push(player.current.id);
      vpContext.arrPlayer.push(video);
    }
  };

  const getInstanceVideo = (player) => {
    let index = vpContext.arrPlayerId.indexOf(player.current.id);
    return index > -1 ? vpContext.arrPlayer[index] : null;
  };

  const initPlay = (player) => {
    pushArr(player);
    if (isInViewPort(player) && !vpContext.currentPlayer.vid) {
      setPlay(player);
    }
  };

  useEffect(() => {
    if (playerRef) {
      initPlay(playerRef);
    }

    history.listen((location, action) => {
      // Exit picture in picture mode
      if (playerRef && document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    });
  }, []);

  const getVideo = (children) => {
    // const parentElement = children;
    for (let i = 0; i < 4; i++) {
      if (children.classList?.contains("vjs-control-bar")) {
        return children.parentElement.children[0];
      }
      children = children.parentElement;
    }
  };

  useEffect(() => {
    if (postObj) {
      const vidWidth = postObj.data.vid_wid;
      const videHeight = postObj.data.vid_hgt;
      setIsVertical(videHeight / vidWidth >= 1.5);
    }
  }, []);

  useEffect(() => {
    let isFirst = true;
    if (playerRef) {
      const player = getInstanceVideo(playerRef);
      // const player = videojs(playerRef.current, options, () => {});
      // vpContext.videoPlayers.set(playerRef.current.id, playerRef.current);
      // vpContext.arrPlayer.push(playerRef.current.id);
      window.addEventListener("scroll", (e) => listenToScroll(e));
      if (!player) {
        return;
      }

      player.on("error", () => {
        // console.info("player.on(error)");
        if (player.currentSrc().endsWith(".m3u8")) {
          if (!/.mov$/i.test(options.sources[1].src)) {
            player.src(options.sources[1].src);
          } else {
            setIsMov(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
              player.src(options.sources[0].src);
            }, 30 * 1000);
          }
        }
      });

      player.on("click", (e) => {
        // console.info("click");
        // console.info(e.target);
        let target = e.target;
        //three conditions
        //1 control bar
        let isControlBar =
          e.target.classList?.contains("vjs-control-bar") ||
          e.target.parentElement.classList?.contains("vjs-control-bar") ||
          e.target.classList?.contains("vjs-control") ||
          e.target.parentElement.classList?.contains("vjs-control");

        let isBigPlayButton = e.target.parentElement.classList?.contains(
          "vjs-big-play-button",
        );
        if (isControlBar) {
          target = getVideo(e.target);
        }
        //2 big play button
        if (isBigPlayButton) {
          target = e.target.parentElement.parentElement.children[0];
        }
        let isVolumeControl =
          e.target.classList?.contains("vjs-volume-control") ||
          e.target.parentElement.classList?.contains("vjs-mute-control");
        //3 the loading
        let isLoadingIco = e.target.classList?.contains("vjs-loading-spinner");
        if (isLoadingIco) {
          target = e.target.parentElement.children[0];
        }
        let p = {current: target};
        const video = getInstanceVideo(p);
        if (!isVolumeControl) {
          pauseYoutubeVideos();
          if (isFirst && !isControlBar && video.muted()) {
            isFirst = false;
            video.muted(false);
            doPlay(video, true);
            return;
          } else {
            if (!video.muted()) {
              pauseYoutubeVideos();
              return;
            } else {
              doPlay(video, video.muted());
              return;
            }
          }

          // if (video && vpContext.currentPlayer.vid === video?.options_.id) {
          //   video.muted(false);
          // } else {
          //   doPlay(video, true);
          // }
        } else {
          if (!video.muted()) {
            pauseYoutubeVideos();
          }
        }
      });

      // scroll back to the target elem when full screen closed
      player.on("fullscreenchange", (e) => {
        setTimeout(() => {
          const isFullScreen = player.hasClass("vjs-fullscreen");

          if (!isFullScreen) {
            // const element = e.currentTarget.parentElement;

            // window.scrollTo(
            //   0,
            //   element.getBoundingClientRect().y - window.innerHeight / 2 + 200,
            // );

            // setTimeout(() => {
            //   player.pause();
            // }, 300);
            scrollHelper.unlock();
          } else {
            setTimeout(() => {
              const paused = player.paused();
              if (paused) {
                player.play()?.catch(() => {});
              }
            }, 600);
            scrollHelper.lock();
          }
        }, 64);
      });

      player.on("mouseover", (e) => {
        if (/vjs-fullscreen-control/.test(e.target.parentElement.className)) {
          scrollHelper.setPreScrollY();
        }
      });

      player.on("mouseleave", (e) => {
        scrollHelper.resetPreScrollY();
      });

      player.on("ended", () => {
        player?.play();
      });

      return () => {
        if (player && player.dispose) {
          player.dispose()?.catch(() => {});
        }
        timer && clearTimeout(timer);
        vpContext.arrPlayerId.length = 0;
        vpContext.arrPlayer.length = 0;
        vpContext.currentPlayer.vid = 0;
        vpContext.currentPlayer.player = null;
        window.removeEventListener("scroll", listenToScroll);
      };
    }
  }, []);

  return (
    <div className={classes.root}>
      {isMov && (
        <div className={classes.transcodingTips}>
          <span>{t("getter_fe.post.tips.video_transcoding_tips")}</span>
        </div>
      )}
      <div
        className={clsx(isMov && classes.hiddenVideo)}
        style={{height: "100%"}}
      >
        <div
          className={clsx(
            isVertical || _isVertical ? classes.verticalVideo : "",
          )}
          style={{height: "100%"}}
        >
          <div data-vjs-player>
            {
              <video
                ref={playerRef}
                className="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
                playsInline={true}
                muted={true}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};
