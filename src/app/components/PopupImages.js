import React, {useEffect, useState} from "react";
import {makeStyles, useMediaQuery, useTheme} from "@material-ui/core";
import Popup from "reactjs-popup";
import {scrollHelper} from "src/util/scrollUtils";
import {PostStatLine} from "../pages/dashboard/PostStatLine";
import {CommentStatLine} from "../pages/dashboard/CommentStatLine";
import {ReactComponent as IconCancel} from "src/assets/icons/icon_circlefull_close.svg";
import {ReactComponent as IconPrev} from "src/assets/icons/icon_swiper_prev_39.svg";
import {ReactComponent as IconNext} from "src/assets/icons/icon_swiper_next_39.svg";
import FastAverageColor from "fast-average-color";
import {zoomImage, handleMediaUrl} from "src/util/imageUtils";
// import Swiper core and required components
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Lazy,
} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
// Import Swiper styles
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";
import "swiper/components/lazy/lazy.scss";
import Global from "src/system/Global";
// install Swiper components
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Lazy]);

const useStyles = makeStyles((theme) => ({
  rootPopup: {
    "& > .popup-overlay": {
      overflow: "hidden",
      "& > .popup-content": {
        width: "100% !important",
        margin: ({isAvatarImage}) =>
          isAvatarImage ? "auto" : "0 auto !important",
        backgroundColor: "transparent !important",
        border: "none !important",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        "& > div > .header": {
          borderBottom: "none",
          padding: 0,
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          zIndex: 10,
          "& .info": {
            opacity: 0.9,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            top: "16px",
            left: "28px",
            position: "absolute",
            color: "#fff",
            fontSize: "12px",
            borderRadius: "20px",
            padding: "5px 20px",
            [theme.breakpoints.only("xs")]: {
              left: "12px",
              top: "10px",
            },
          },
          "& .cancel": {
            opacity: 0.9,
            backgroundColor: "transparent",
            width: "48px",
            height: "48px",
            top: "25px",
            right: "25px",
            marginRight: 0,
            position: "absolute",
            "& svg": {
              fill: "rgba(95, 95, 95, 0.3)",
              stroke: "#fff",
            },
            "&:hover": {
              "& svg": {
                fill: "rgba(95, 95, 95, 0.7)",
              },
            },
            [theme.breakpoints.only("xs")]: {
              width: "38px",
              height: "38px",
              right: "25px",
            },
          },
        },
        "& > div > .content": {
          padding: "0",
          display: "block",
          textAlign: "center",
          height: "calc(100vh - 45px)",
          width: "100vw",
          "& .regular-hover": {
            // backgroundColor: "transparent !important",
          },
          "& img": {
            objectFit: "contain",
            width: "auto",
            height: "100%",
            verticalAlign: "top",
            [theme.breakpoints.only("xs")]: {
              width: "100%",
            },
          },
          [theme.breakpoints.only("xs")]: {
            padding: "0 38px",
          },
        },
        "& .stats-line": {
          maxWidth: "600px !important",
          margin: "0 auto !important",
          justifyContent: "space-between",
          [theme.breakpoints.only("xs")]: {
            paddingRight: 0,
            margin: "0 auto !important",
          },
          "& .post-feed-item-button.white": {
            "& .count": {
              color: "#fff",
            },
            "& .icon": {
              "& svg": {
                "&.solid": {
                  fill: "#fff !important",
                  stroke: "#fff !important",
                },
                "&.hollow": {
                  fill: "transparent !important",
                  stroke: "#fff",
                },
                "&.hollow-fill": {
                  fill: "#fff !important",
                  stroke: "transparent !important",
                },
              },
            },
            "&:hover": {
              "& .count": {
                color: "#fff",
              },
              "& .icon": {
                // backgroundColor: "transparent !important",
              },
            },
          },
          "& .dropdown": {
            "& .white .icon": {
              "&:hover": {
                // backgroundColor: "transparent !important",
              },
              "& svg": {
                "&.solid": {
                  fill: "#fff !important",
                  stroke: "#fff !important",
                },
                "&.hollow": {
                  fill: "transparent !important",
                  stroke: "#fff",
                },
              },
            },
          },
        },
      },
    },
  },
  rootSwiper: {
    width: "100%",
    "& .swiper-container": {
      "& .swiper-slide": {
        display: "flex",
        height: "auto",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "auto",
        "& > div": {
          height: "calc(100vh - 45px)",
        },
      },
    },
    "& .swiper-scrollbar": {
      display: "none",
    },
    "& .swiper-button-prev, & .swiper-button-next": {
      display: "none",
    },
    "& .icon-swiper-button-prev": {
      position: "absolute",
      left: "28px",
      top: "50%",
      marginTop: "-64px",
      fill: "rgba(95,95,95,.3)",
      opacity: 0.9,
      zIndex: 100,
      "&:hover": {
        fill: "rgba(95,95,95,.7)",
      },
      [theme.breakpoints.only("xs")]: {
        left: "6px",
        width: "30px !important",
      },
    },
    "& .icon-swiper-button-next": {
      position: "absolute",
      right: "28px",
      top: "50%",
      marginTop: "-64px",
      fill: "rgba(95,95,95,.3)",
      opacity: 0.9,
      zIndex: 100,
      "&:hover": {
        fill: "rgba(95,95,95,.7)",
      },
      [theme.breakpoints.only("xs")]: {
        right: "6px",
        width: "30px !important",
      },
    },
    "& .swiper-pagination-bullet": {
      background: theme.palette.background.default,
      opacity: 0.5,
    },
    "& .swiper-pagination-bullet-active": {
      background: theme.blue.secondary,
      opacity: 1,
    },
  },
  statsLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    margin: "0 20%",
  },
}));

export const PopupImages = ({
  open,
  onClose,
  item = null,
  postId = null,
  sharedObj,
  imageURLs,
  headerContent,
  currentIndex: propCurrentIndex,
  type = "post",
  xStats = null,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [averageColors, setAverageColors] = useState(null);
  const [mobileVh, setMobileVh] = useState(null);
  const theme = useTheme();
  const tabletMatches = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles({isAvatarImage: type === "avatar"});
  const api = Global.GetPortal().getAppService();

  const isGif = /giphy|gif/.test(imageURLs[0]);
  const isDefault = imageURLs[0]?.startsWith("/avatars//");

  useEffect(() => {
    return () => scrollHelper.unlock("popupImages");
  }, []);

  useEffect(() => {
    if (isGif || isDefault) {
      return;
    }
    const fac = new FastAverageColor();

    if (imageURLs?.length && Array.isArray(imageURLs) && imageURLs[0]) {
      const promises = imageURLs.map((url) => {
        const image = new Image();
        image.crossOrigin = "anonymous";

        image.src =
          process.env.REACT_APP_MEDIA_BASE + "/" + zoomImage(url, 500, 0);

        return new Promise((resolve) => {
          image.onload = () => {
            const {value, isLight} = fac.getColor(image);
            return resolve({
              color: `rgba(${value[0]},${value[1]},${value[2]},0.9)`,
              isLight,
            });
          };

          // cors issue handling
          image.onerror = () => {
            return resolve(null);
          };
        });
      });

      const resolvePromisesToState = async () => {
        const colors = await Promise.all(promises);
        setAverageColors(colors);
      };

      resolvePromisesToState();
    }
  }, [imageURLs]);

  useEffect(() => {
    const handleMobileViewport = () => {
      setMobileVh(window.innerHeight);
    };

    if (open && tabletMatches) {
      setMobileVh(window.innerHeight);
      window.addEventListener("resize", handleMobileViewport);

      return () => window.removeEventListener("resize", handleMobileViewport);
    }
  }, [open]);

  const getDetailLink = () => {
    let detailLink = window.location.origin;
    if (postId) {
      detailLink += api.getUrlPostPage(postId);
    }
    return detailLink;
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={classes.rootPopup}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Popup
        open={open}
        onClose={() => {
          if (onClose) {
            onClose();
          }
          scrollHelper.unlock();
        }}
        onOpen={() => {
          scrollHelper.lock(61, "popupImages");
        }}
        overlayStyle={{
          background:
            averageColors && averageColors[currentIndex - 1]
              ? averageColors[currentIndex - 1].color
              : null,
        }}
        closeOnDocumentClick
        closeOnEscape
        modal
        resetScroll
        repositionOnResize
        lockScroll={false}
        position="top center"
      >
        {(close) => {
          return (
            <div>
              <div className="header">
                {headerContent ? (
                  <div className="title">{headerContent}</div>
                ) : null}
                {imageURLs.length > 1 ? (
                  <span className="info">
                    {currentIndex} / {imageURLs.length}
                  </span>
                ) : null}
                <span className="icon cancel" onClick={close}>
                  <IconCancel className="hollow" style={{width: "100%"}} />
                </span>
              </div>

              <div
                className="content"
                onClick={close}
                style={
                  mobileVh
                    ? {
                        height: mobileVh - 45,
                      }
                    : null
                }
              >
                {imageURLs.length > 1 ? (
                  <div className={classes.rootSwiper}>
                    <IconPrev
                      className="icon-swiper-button-prev"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Swiper
                      loop
                      spaceBetween={0}
                      slidesPerView={1}
                      navigation={{
                        prevEl: ".icon-swiper-button-prev",
                        nextEl: ".icon-swiper-button-next",
                      }}
                      pagination={{clickable: true}}
                      scrollbar={{hide: true}}
                      initialSlide={propCurrentIndex}
                      onSlideChange={(swiper) =>
                        setCurrentIndex(swiper.realIndex + 1)
                      }
                      onPaginationRender={(e) => {
                        e.$el[0]
                          .getElementsByClassName("swiper-pagination")[0]
                          .removeEventListener("click", stopPropagation);
                        e.$el[0]
                          .getElementsByClassName("swiper-pagination")[0]
                          .addEventListener("click", stopPropagation);
                      }}
                    >
                      {imageURLs?.length &&
                        Array.isArray(imageURLs) &&
                        imageURLs.map((item) => (
                          <SwiperSlide key={item}>
                            <div className={classes.imgWrapper}>
                              <img
                                src={handleMediaUrl(
                                  process.env.REACT_APP_MEDIA_BASE,
                                  item,
                                )}
                                onClick={(e) => e.stopPropagation()}
                                onError={(event) =>
                                  event.target.classList.add("error")
                                }
                                alt=""
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                    </Swiper>
                    <IconNext
                      className="icon-swiper-button-next"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  imageURLs?.length &&
                  Array.isArray(imageURLs) && (
                    <img
                      src={handleMediaUrl(
                        imageURLs[0].startsWith("https://") ||
                          imageURLs[0].startsWith("http://")
                          ? ""
                          : process.env.REACT_APP_MEDIA_BASE,
                        imageURLs[0] || "",
                      )}
                      onClick={(e) => e.stopPropagation()}
                      onError={(event) => event.target.classList.add("error")}
                      alt="img"
                    />
                  )
                )}
                {item && type === "comment" && (
                  <div
                    className={classes.statsLine}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <CommentStatLine
                      item={item}
                      type={type}
                      xStats={xStats}
                      skin={
                        averageColors &&
                        averageColors[currentIndex - 1] &&
                        averageColors[currentIndex - 1].isLight
                          ? "dark"
                          : "white"
                      }
                      tooltip="top"
                    />
                  </div>
                )}
                {item && type === "post" && (
                  <PostStatLine
                    detailLink={getDetailLink()}
                    item={item}
                    skin={
                      averageColors &&
                      averageColors[currentIndex - 1] &&
                      averageColors[currentIndex - 1].isLight
                        ? "dark"
                        : "white"
                    }
                    tooltip="top"
                    postId={postId}
                    sharedObj={sharedObj}
                    isImagePopup={true}
                  />
                )}
              </div>
            </div>
          );
        }}
      </Popup>
    </div>
  );
};
