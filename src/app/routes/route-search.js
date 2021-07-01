import React from "react";
import AppConsts from "src/app/AppConsts";
import Util from "src/core/Util";
import {NewUIPage} from "src/app/base/NewUIPage";
import {NewSearchResult} from "src/app/pages/dashboard/NewSearchResult";

/**
 * Entry point to display search results. This is equivalent
 * of Twitter's /search?q=<queryTerm>.
 * We won't submit query here and will leave that to the actual
 * rendering component: SearchResultFeed.
 * For SEO purpose, we need to extract the query terms and
 * add to keywords to HTML header.
 */

export const NewSearchResults = ({location}) => {
  const query = new URLSearchParams(location.search).get("q");
  const tab = new URLSearchParams(location.search).get("tab");
  const title = Util.StringIsEmpty(query) ? "Search" : "Results for: " + query;
  const description = `${AppConsts.APP_NAME}: ${title}`;

  return (
    <NewUIPage id="search" title={title} description={description}>
      <NewSearchResult
        query={query}
        tab={tab}
        searchString={location.search.split("&")[0]}
      />
    </NewUIPage>
  );
};
