import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React from "react";

export const MTDialog = (props: any) => {
  return (
    <Dialog
      open={props?.open}
      handler={props?.handler}
      size={props?.size || "md"}
    >
      {props?.header && (
        <DialogHeader className={props?.headerClassname}>
          {props?.header}
        </DialogHeader>
      )}
      <DialogBody className={props?.className}>{props?.children}</DialogBody>
      {props?.footer && <DialogFooter>{props?.footer}</DialogFooter>}
    </Dialog>
  );
};
