//@ts-nocheck
import { Button, Input } from "@material-tailwind/react";
import React, { useState } from "react";

const MTInput = (props: any) => {
  const [errorText, setErrorText] = useState("");

  const validateInput = (value: string) => {
    if (props.type === "email") {
      // Email validation logic
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setErrorText("Please Enter a valid email address.");
      } else {
        setErrorText("");
      }
    }
    // else if (props.type === "password") {
    //   // Password validation logic
    //   if (value.length < 8) {
    //     setErrorText("Password must be at least 8 characters long.");
    //   } else {
    //     setErrorText("");
    //   }
    // }
    else if (props.type === "tel") {
      // Phone number validation logic
      const phoneRegex = /^[0-9]{10}$/; // Allows only digits with a length of 10-15
      if (!phoneRegex.test(value)) {
        setErrorText("Please enter a valid phone number");
      } else {
        setErrorText("");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (props?.handleChange) {
      props.handleChange(e); // Call parent onChange handler if provided
    }
    validateInput(value); // Perform validation
  };

  return (
    <div
      className={`${errorText && " relative flex w-full flex-col"} 
      ${props?.className}}`}
    >
      <Input
        label={props?.label}
        value={props?.value}
        placeholder={props?.placeholder}
        onChange={handleChange}
        variant={props?.variant || "outlined"}
        size={props?.size || "md"}
        disabled={props?.disabled}
        color={props?.color}
        // error={props?.error || false}
        error={!!errorText || props?.error}
        type={props?.type}
        className={`${props?.className}`}
      />
      {errorText && <span className="text-red-500 text-xs">{errorText}</span>}
      {/* {props?.helperText && (
        <Typography
          variant="small"
          color="gray"
          className="mt-2 flex items-center gap-1 font-normal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="-mt-px h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
          {props?.helperText}
        </Typography>
      )} */}
      {props?.btnIcon && props?.btnName && (
        <Button
          size="sm"
          color={props?.value ? "gray" : "blue-gray"}
          disabled={!props?.value}
          onClick={props?.handleButtonClick}
          className="!absolute right-1 top-1 rounded"
        >
          {props?.btnName}
        </Button>
      )}
    </div>
  );
};

export default MTInput;
