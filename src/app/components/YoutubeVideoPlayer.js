import {createContext, useContext, useEffect, useRef, useState} from "react";
import {v4 as uuidv4} from "uuid";
import YouTube from "react-youtube";
import {VideoPlayerContext} from "./VideoPlayer";

export const YoutubePlayerContext = createContext({
  youtubePlayers: [],
});

export const YoutubeVideoPlayer = ({id, className}) => {
  const {youtubePlayers} = useContext(YoutubePlayerContext);
  const {currentPlayer} = useContext(VideoPlayerContext);
  const [uuid, setUuid] = useState(null);
  const [active, _setActive] = useState(false);
  const activeRef = useRef(active); // so active is visible in the event listener
  const ref = useRef(null);

  const setActive = (isActive) => {
    activeRef.current = isActive;
    _setActive(isActive);
  };

  useEffect(() => {
    const initPlayer = () => {
      const _uuid = uuidv4();
      setUuid(_uuid);
      youtubePlayers.push({
        id: _uuid,
        pauseVideo: ref.current?.internalPlayer.pauseVideo,
      });

      document.addEventListener("fullscreenchange", handleFullScreen);
    };

    const destroyPlayer = () => {
      document.removeEventListener("fullscreenchange", handleFullScreen);
      ref.current?.internalPlayer.destroy();
    };

    const handleFullScreen = async () => {
      const isChrome = navigator.userAgent.indexOf("Chrome") !== -1;

      if (!isChrome) {
        return;
      }

      const iframe = await ref.current?.internalPlayer.getIframe();

      if (iframe?.getBoundingClientRect().width === window.innerWidth) {
        setActive(true);
        return;
      }

      if (activeRef.current) {
        window.scrollTo(
          0,
          iframe?.getBoundingClientRect().y - window.innerHeight / 2 + 200, // centered
        );
        setActive(false);
      }
    };

    initPlayer();

    return () => destroyPlayer();
  }, []);

  return (
    <>
      <YouTube
        videoId={id}
        className={className}
        ref={ref}
        opts={{
          playerVars: {
            autoplay: 1,
          },
        }}
        onPlay={() => {
          if (typeof currentPlayer.player?.pause === "function") {
            currentPlayer.player.pause();
          }

          for (const {id, pauseVideo} of youtubePlayers) {
            if (id !== uuid) {
              pauseVideo();
            }
          }
        }}
      />
    </>
  );
};
