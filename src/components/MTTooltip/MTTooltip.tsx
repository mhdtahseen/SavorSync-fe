import { Tooltip } from "@material-tailwind/react";
import React from "react";

export const MTTooltip = (props: any) => {
  if (!props?.content) return props?.children || null;

  return (
    <Tooltip
      content={props?.content}
      placement={props?.placement || "right-end"}
    >
      {props?.children}
    </Tooltip>
  );
};
