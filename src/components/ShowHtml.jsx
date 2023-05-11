import React from "react";
import parse from "html-react-parser";

export const ShowHtml = ({ htmlText }) => {
  const changeHtmlData = (htmlText) => {
    return parse(htmlText, {
      replace: (node) => {
        if (node.name === "table") {
          node.attribs.class +=
            " table table-bordered table-striped table-hover";
          return node;
        } else {
          return node;
        }
      },
    });
  };

  return <>{changeHtmlData(htmlText)}</>;
};
