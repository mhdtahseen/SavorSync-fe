//@ts-nocheck
import { Option, Select } from "@material-tailwind/react";
import React from "react";

interface OptionType {
  _id?: string;
  item_name?: string;
  table_number?: string;
  value?: string | number;
  label?: string;
}

interface MTSelectProps {
  label?: string;
  variant?: 'standard' | 'outlined' | 'static';
  size?: 'sm' | 'md' | 'lg';
  value?: string | number | null;
  disabled?: boolean;
  error?: boolean;
  isMenu?: boolean;
  options?: OptionType[];
  handleChange?: (value: string | undefined) => void;
}

export const MTSelect: React.FC<MTSelectProps> = ({
  label,
  variant = 'outlined',
  size = 'md',
  value = null,
  disabled = false,
  error = false,
  isMenu = false,
  options = [],
  handleChange,
}) => {
  return (
    <Select
      label={label}
      variant={variant}
      size={size}
      value={value || ''}
      disabled={disabled}
      error={error}
      onChange={handleChange}
      className="w-full"
    >
      {isMenu
        ? options.map((item) => (
            <Option
              key={item?._id || item?.value}
              value={item?._id || item?.value}
            >
              {item?.item_name || item?.table_number || item?.label}
            </Option>
          ))
        : options.map((option, index) => (
            <Option key={index} value={option}>
              {String(option)}
            </Option>
          ))}
    </Select>
  );
};
