//@ts-nocheck
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { DynamicIcon } from "lucide-react/dynamic";
import React from "react";

export const ProfileMenu = ({ handler = null, menuItemsList, placement }) => {
  return (
    <Menu placement={placement || "bottom-end"}>
      <MenuHandler>
        {handler ? (
          handler
        ) : (
          <Avatar
            variant="circular"
            alt="tania andrew"
            size="sm"
            className="cursor-pointer"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
        )}
      </MenuHandler>
      <MenuList>
        {menuItemsList.map((item, index) => {
          return item.type === "menu" ? (
            <MenuItem
              className="flex items-center gap-3"
              onClick={item.clickHandler}
              key={item.name}
            >
              <DynamicIcon name={item.icon} color="#90A4AE" size={24} />
              <Typography variant="small" className="font-medium">
                {item.name}
              </Typography>
            </MenuItem>
          ) : (
            <hr key={index} className="my-2 border-blue-gray-50" />
          );
        })}
      </MenuList>
    </Menu>
  );
};

/*

menuList{
handler ,
menuItemsList : {
type : "menu" || "divider",
icon : "",
name : 
}

}

*/
