const SHARES_POST = "shares_pst";
const SHARES_COMMENT = "shares_cm";
const OTHER_SHARES_COMMENT = "cm_sharedby";
const OTHER_SHARES_POST = "pst_sharedby";

export const parsePostFeed = (list, aux) => {
  if (!list?.length || !aux?.post) {
    return null;
  }

  return list.map((item) => {
    const auxData = aux.post[item.activity?.tgt_id];
    const statsData = aux.s_pst[item.activity?.tgt_id];
    const embedPost = aux.post[item.activity?.rpstIds];

    let data = {
      cdate:
        item.activity.action === SHARES_POST
          ? auxData.cdate
          : item.activity.cdate,
      action: item.activity.action,
      type: item.activity.tgt_type,
      id: item.activity.tgt_id,
      uid: parseUserID(item),
      originUser:
        item.activity.action === SHARES_COMMENT
          ? item.activity.tgt_oid
          : item.activity.opuid ?? auxData?.puid,
      replyingTo: item.activity.opuid ?? auxData?.puid,
      embedPost,
      embedUser: item.activity.rusrIds,
      txt: auxData?.txt,
      ttl: auxData?.ttl,
      previmg: auxData?.previmg,
      prevsrc: auxData?.prevsrc,
      dsc: auxData?.dsc,
      tags: auxData?.htgs,
      mentions: auxData?.utgs,
      imgs: auxData?.imgs,
      vid: auxData?.vid,
      ovid: auxData?.ovid,
      main: auxData?.main,
      vid_dur: auxData?.vid_dur,
      vid_hgt: auxData?.vid_hgt,
      vid_wid: auxData?.vid_wid,
      twt_rtpst: auxData?.twt_rtpst,
      meta: auxData?.meta,
      likes: statsData?.lkbpst ?? statsData?.lkbcm,
      comments: statsData?.cm,
      reposts: statsData?.shbpst ?? statsData?.shbcm,
    };

    if (data.type === "cmt") {
      delete data.embedId;
    }

    Object.keys(data).forEach((k) => {
      if (data[k] == null) {
        delete data[k];
      }
    });

    return data;
  });
};

export const parseUser = (aux) => {
  if (!aux?.uinf) {
    return null;
  }

  let userSet = {};

  Object.keys(aux?.uinf).forEach((user) => {
    const userData = aux.uinf[user];

    let data = {
      cdate: userData.cdate,
      id: userData._id,
      nickname: userData.nickname,
      username: userData.username,
      ousername: userData.ousername,
      dsc: userData.dsc,
      status: userData.status,
      pin: userData.pinpsts,
      lang: userData.lang,
      infl: userData.infl,
      ico: userData.ico,
      bgimg: userData.bgimg,
      location: userData.location,
      birthdate: userData.birthdate,
      flw: userData.flw,
      flg: userData.flg,
    };

    Object.keys(data).forEach((k) => {
      if (data[k] == null) {
        delete data[k];
      }
    });

    userSet[userData._id] = data;
  });

  return userSet;
};

export const getUserName = (user) => {
  return user?.ousername ? user.ousername : user?.username;
};

export const getDisplayName = (user) => {
  return user?.nickname ? user.nickname : getUserName(user);
};

export const parsePinnedPostID = (userInfo) => {
  try {
    const ID = JSON.parse(userInfo?.data?.pinpsts);
    return Array.isArray(ID) ? ID[0] : null;
  } catch (err) {
    return null;
  }
};

export const parsePost = (post, aux) => {
  const {
    rpstIds: embedId = null,
    rusrIds: embedUser = null,
    acl,
    udate,
    _id: id,
    ...rest
  } = post;
  const {cm: comments, lkbpst: likes, shbpst: reposts} = aux?.s_pst ?? {};
  const {shrdpst: embeddedPost = null} = aux ?? {};

  const data = {
    comments,
    id,
    likes,
    reposts,
    embedId,
    embedUser,
    embeddedPost,
    ...rest,
  };

  Object.keys(data).forEach((k) => {
    if (data[k] === null || data[k] === undefined) {
      delete data[k];
    }
  });

  return data;
};

export const parseTimelineFeed = (list, aux) => {
  if (!list?.length || !aux?.post) {
    return null;
  }

  return list.map((item) => {
    const auxData = aux.post[item.activity.pstid];
    const statsData = aux.s_pst[item.activity.pstid];
    const embedPost = aux.post[item.activity.rpstIds];

    const data = {
      cdate: item.activity.cdate,
      action: item.activity.action,
      type: item.activity.tgt_type,
      id: item.activity.pstid,
      uid: parseUserID(item, "timeline"),
      originUser: parseOriginUser(item, auxData),
      replyingTo: item.activity.opuid ?? auxData?.puid,
      embedPost,
      embedUser: item.activity.rusrIds,
      txt: auxData?.txt,
      ttl: auxData?.ttl,
      previmg: auxData?.previmg,
      prevsrc: auxData?.prevsrc,
      dsc: auxData?.dsc,
      tags: auxData?.htgs,
      mentions: auxData?.utgs,
      imgs: auxData?.imgs,
      vid: auxData?.vid,
      ovid: auxData?.ovid,
      main: auxData?.main,
      vid_dur: auxData?.vid_dur,
      vid_hgt: auxData?.vid_hgt,
      vid_wid: auxData?.vid_wid,
      twt_rtpst: auxData?.twt_rtpst,
      meta: auxData?.meta,
      likes: statsData?.lkbpst ?? statsData?.lkbcm,
      comments: statsData?.cm,
      reposts: statsData?.shbpst ?? statsData?.shbcm,
    };

    Object.keys(data).forEach((k) => {
      if (data[k] === null || data[k] === undefined) {
        delete data[k];
      }
    });

    if (
      data.action === SHARES_COMMENT ||
      data.action === OTHER_SHARES_COMMENT
    ) {
      // can't have embed on comment
      delete data.embedPost, delete data.embedUser;
    }

    return data;
  });
};

export const parseCommentFeed = (list, aux) => {
  if (!list?.length) {
    return null;
  }

  return list.map((comment) => {
    const {
      acl,
      pid,
      puid: originUser,
      udate,
      _id: id,
      _t: type,
      ...rest
    } = comment;
    const statsData = aux?.s_cmst[id];

    const data = {
      id,
      type,
      originUser,
      likes: statsData?.lkbcm,
      comments: statsData?.cm,
      reposts: statsData?.shbcm,
      ...rest,
    };

    Object.keys(data).forEach((k) => {
      if (data[k] === null || data[k] === undefined) {
        delete data[k];
      }
    });

    return data;
  });
};

export const getIsShared = (action) =>
  action === SHARES_COMMENT ||
  action === SHARES_POST ||
  action === OTHER_SHARES_COMMENT ||
  action === OTHER_SHARES_POST;

export const isResponseOk = (res) =>
  res.data?.rc === "OK" && res?.data?.result?.data && res?.data?.result?.aux;

const parseOriginUser = (item, auxData) => {
  switch (item.activity.action) {
    case SHARES_COMMENT:
      return item.activity.tgt_oid;
    case OTHER_SHARES_COMMENT:
      return item.activity.src_oid;
    default:
      return item.activity.opuid ?? auxData?.puid;
  }
};

const parseUserID = (item, scene) => {
  switch (item.activity.action) {
    case SHARES_COMMENT:
      return item.activity.init_id;
    case SHARES_POST:
      return item.activity.src_id;
    case OTHER_SHARES_COMMENT:
      return item.activity.tgt_id;
    case OTHER_SHARES_POST:
      return item.activity.tgt_id;
    default:
      return scene === "timeline"
        ? item.activity.uid
        : item.activity.tgt_oid ?? item.activity.init_id;
  }
};
