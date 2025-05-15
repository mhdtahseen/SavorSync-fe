//@ts-nocheck
import React from "react";
import { ButtonGroup, Button } from "@material-tailwind/react";

export const MTButtonGroup = (props: any) => {
  return (
    <ButtonGroup
      size={props.size || "md"}
      variant={props?.variant || "outlined"}
      className={props?.className}
    >
      {props.buttons.map((button) => (
        <Button onClick={button?.handleClick}>{button.label}</Button>
      ))}
    </ButtonGroup>
  );
};
