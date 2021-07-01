import {Helmet} from "react-helmet";
import {useLocation} from "react-router";
import Global from "src/system/Global";

export const NewUIPage = ({children}) => {
  const location = useLocation();
  const SITE_URL = Global.GetSiteURL();

  const metaTags = [
    {property: "og:title", content: "GETTR - The Marketplace of Ideas"},
    {
      property: "description",
      content:
        "GETTR is a non-bias social network for people all over the world. GETTR tried the best to provide best software quality to the users, allow anyone to express their opinion freely.",
    },
    {
      property: "og:description",
      content:
        "GETTR is a non-bias social network for people all over the world. GETTR tried the best to provide best software quality to the users, allow anyone to express their opinion freely.",
    },
    {property: "og:type", content: "website"},
    {property: "og:url", content: SITE_URL + location.pathname},
  ];

  return (
    <>
      <Helmet
        link={[
          {
            rel: "canonical",
            href: SITE_URL + location.pathname,
          },
        ]}
        title="GETTR - The Marketplace of Ideas"
        meta={metaTags}
      />
      {children}
    </>
  );
};
