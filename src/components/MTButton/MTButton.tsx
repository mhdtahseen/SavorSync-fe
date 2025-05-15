import { Button } from "@material-tailwind/react";
import React from "react";

const MTButton = (props: any) => {
  const { handleClick, label, children, ...rest } = props;
  
  return (
    <Button
      size={props?.size || "md"}
      variant={props?.variant || "filled"}
      color={props?.color}
      disabled={props?.disabled}
      loading={props?.loading || false}
      className={`${props?.className}`}
      ripple={props?.ripple || true}
      onClick={handleClick}
      {...rest}
    >
      {label || children}
    </Button>
  );
};

export default MTButton;
