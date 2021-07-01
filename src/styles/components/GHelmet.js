import {Helmet} from "react-helmet";
import {useLocation} from "react-router";
import AppConsts from "src/app/AppConsts";
import VisualConsts from "src/core/model/VisualConsts";
import Global from "src/system/Global";
import {handleMediaUrl, zoomImage} from "src/util/imageUtils";

export const GHemlmet = ({
  description,
  imageURL,
  originalUsername,
  type,
  ...props
}) => {
  const title = originalUsername
    ? `${originalUsername} on ${AppConsts.APP_WEB_NAME}`
    : AppConsts.APP_WEB_NAME;

  const location = useLocation();
  const SITE_URL = Global.GetSiteURL();

  const _description =
    description?.length > 155
      ? `${description?.substring(0, 155)}...`
      : description;

  const og = [
    {property: "og:title", content: title},
    {property: "og:type", content: type},
    {property: "og:url", content: SITE_URL + location.pathname},
    {property: "og:description", content: _description},
    {property: "description", content: _description},
  ];

  const ogImage = [
    ...(imageURL
      ? [
          {
            property: "og:image",
            content: handleMediaUrl(
              process.env.REACT_APP_MEDIA_BASE,
              zoomImage(imageURL, 500, 0),
            ),
          },
          {
            property: "og:image:width",
            content: `${VisualConsts.DEFAULT_THUMBNAIL_WIDTH}`,
          },
          {
            property: "og:image:height",
            content: `${VisualConsts.DEFAULT_THUMBNAIL_HEIGHT}`,
          },
        ]
      : []),
  ];

  return <Helmet title={title} meta={[...og, ...ogImage]} {...props} />;
};
