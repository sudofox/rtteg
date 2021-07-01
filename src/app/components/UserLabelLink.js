import {Link} from "react-router-dom";
import {GTwemoji} from "src/styles/components/GTwemoji";

export const UserLabelLink = ({userId, nickname, onClick}) => {
  return (
    <Link
      to={`/user/${userId}`}
      onClick={(e) => {
        e.stopPropagation();
        if (typeof onClick === "function") {
          onClick();
        }
      }}
    >
      <GTwemoji text={nickname ?? userId} />
    </Link>
  );
};
