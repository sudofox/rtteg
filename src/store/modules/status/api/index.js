import {getBlockedUsers} from "./getBlockedUsers";
import {currentUserBlockedUser} from "./currentUserBlockedUser";
import {currentUserMutesUser} from "./currentUserMutesUser";
import {currentUserFollowsUser} from "./currentUserFollowsUser";
import {toggleMute} from "./toggleMute";
import {toggleFollowing} from "./toggleFollowing";
import {toggleBlock} from "./toggleBlock";

export const StatusApi = {
  currentUserBlockedUser,
  currentUserFollowsUser,
  currentUserMutesUser,
  getBlockedUsers,
  toggleMute,
  toggleFollowing,
  toggleBlock,
};
