import { InputProps as AntdInputProps } from "antd/lib/input";
import { ReactNode } from "react";

export type AntDInputProps = {
  label?: string; // Label for the input field
  placeholder?: string; // Placeholder text inside the input
  size?: "small" | "middle" | "large"; // Input size
  value?: string; // Input value
  onChange?: (value: string) => void; // Change handler
  error?: string; // Error message
  required?: boolean; // Whether the field is required
  disabled?: boolean; // Whether the input is disabled
  type?: string; // Type of the input (e.g., "text", "password")
  prefix?: React.ReactNode; // Prefix icon or element
} & AntdInputProps;

export type TabInputData = {
  label: string;
  value: string;
  desc?: string;
  component?: ReactNode;
};

export interface MenuItem {
  item: object;
  quantity: number;
}

export interface Order {
  table_id: string; // Reference to Table model
  items: MenuItem[];
  bill_amount: number;
}
