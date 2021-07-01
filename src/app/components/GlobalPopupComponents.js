import {useLocation} from "react-router-dom";
import {CommentComposerNew} from "src/app/components/post/comps/CommentComposerNew";
import {RepostComposerNew} from "src/app/components/post/comps/RepostComposerNew";
import {PopupImages} from "src/app/components/post/comps/PopupImages";

export const GlobalPopupComponents = () => {
  const location = useLocation();
  const path = location.pathname.split("/");
  const isApp = path[1].endsWith("-app");

  return !isApp ? (
    <>
      {/^(\/user\/)/.test(location.pathname) ? (
        <>
          <CommentComposerNew isPopup />
          <RepostComposerNew isPopup />
        </>
      ) : null}
      {location.pathname === "/" || /^(\/user\/)/.test(location.pathname) ? (
        <PopupImages />
      ) : null}
    </>
  ) : null;
};
