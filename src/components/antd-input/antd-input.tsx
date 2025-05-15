import React, { useState } from "react";
import { Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { AntDInputProps } from "../../utils/Interfaces";

const AntDInput: React.FC<AntDInputProps> = ({
  label,
  placeholder,
  size = "middle",
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  type = "text",
  prefix,
  ...restProps
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const getInputType = () => {
    if (type === "password") {
      return isPasswordVisible ? "text" : "password";
    }
    return type;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <Form.Item
      label={label}
      validateStatus={error ? "error" : undefined}
      help={error} // Displays the error message below the input
      required={required} // Adds an asterisk if the field is required
    >
      <Input
        type={getInputType()}
        placeholder={placeholder}
        size={size}
        value={value}
        onChange={(e) => onChange?.(e.target.value)} // Call onChange if provided
        disabled={disabled}
        prefix={prefix} // Add prefix to the input
        suffix={
          type === "password" && (
            <span
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {isPasswordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          )
        } // Add eye icon to toggle password visibility
        {...restProps} // Pass other props to Antd Input
      />
    </Form.Item>
  );
};

export default AntDInput;
