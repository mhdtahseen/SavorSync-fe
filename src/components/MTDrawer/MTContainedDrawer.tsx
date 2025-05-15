//@ts-nocheck
import React from "react";
import { Drawer, Typography, IconButton } from "@material-tailwind/react";

export function MTContainedDrawer(props) {
  return (
    <>
      <Drawer
        open={props?.isOpen}
        onClose={props?.onClose}
        className="p-4 z-[9999]"
        placement={props?.placement || "right"}
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            {props?.title}
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={props?.onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <div>{props?.children}</div>
      </Drawer>
    </>
  );
}
