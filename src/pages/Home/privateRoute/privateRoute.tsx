// @ts-nocheck
import { useContext, useState } from "react";
import { AuthContext } from "../../../utils/context/authContext";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  FilePenLine,
  HelpCircle,
  Home,
  Settings,
  Users,
} from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { MTTooltip } from "../../../components/MTTooltip/MTTooltip";
import { useSelector } from "react-redux";
import { ProfileMenu } from "../../../templates/profileMenu";

export const PrivateRoute = () => {
  const auth = useContext(AuthContext);
  const userInfo = useSelector((state: any) => state.user.state);

  // console.log("Auth status:", auth?.isAuthenticated);
  // const global = useSelector((state: any) => state.billing.role);

  const [isMenuOpen, setMenuOpen] = useState(false);

  const ProfileMenuList = {
    handler: {},
    menuItemsList: [
      {
        type: "menu",
        icon: "circle-user-round",
        name: "My Profile",
        clickHandler: "",
      },
      {
        type: "menu",
        icon: "settings",
        name: "Edit Profile",
        clickHandler: "",
      },
      {
        type: "menu",
        icon: "settings-2",
        name: "Update Business",
        clickHandler: "",
      },
      {
        type: "divider",
        icon: "",
        name: "",
      },
      {
        type: "menu",
        icon: "log-out",
        name: "Sign Out",
        clickHandler: () => {
          logout();
        },
      },
    ],
  };

  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/" },
    { icon: <CreditCard size={20} />, label: "Billing", path: "/billing" },
    // { icon: <Users size={20} />, label: "Team", path: "/team" },
    // { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
    {
      icon: <FilePenLine size={20} />,
      label: "Manage Resources",
      path: "/resources",
    },
    // { icon: <HelpCircle size={20} />, label: "Help", path: "/help" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useContext(AuthContext);

  if (!auth) return null;
  return auth.isAuthenticated ? (
    <>
      <div>
        {/* Top NAV */}
        <div className="w-screen h-12 shadow flex px-4 py-2 justify-between">
          <div className="flex justify-center items-center align-middle p-2 rounded-full cursor-pointer transition-all duration-300 ">
            <DynamicIcon
              name={`${isMenuOpen ? "chevron-left" : "menu"}`}
              color="black"
              size={28}
              onClick={() => {
                setMenuOpen(!isMenuOpen);
              }}
            />
          </div>
          {/* <div>{global}</div> */}
          <ProfileMenu
            menuItemsList={ProfileMenuList.menuItemsList}
            placement={"bottom-end"}
          ></ProfileMenu>
        </div>
        <div className="flex w-full h-[calc(100vh-64px)]">
          <div className="flex h-full">
            <div
              className={`fixed h-full shadow-lg transition-all duration-300 ease-in-out ${
                isMenuOpen ? "w-64" : "w-20"
              }`}
            >
              <div className="flex flex-col mt-4 px-4">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <MTTooltip
                      key={index}
                      content={!isMenuOpen ? item.label : ""}
                    >
                      <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 w-full text-left ${
                          isActive
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        <div className="min-w-[18px]">{item.icon}</div>
                        <span
                          className={`whitespace-nowrap transition-all duration-300 ${
                            isMenuOpen ? "opacity-100" : "opacity-0 w-0"
                          } `}
                        >
                          {item.label}
                        </span>
                      </button>
                    </MTTooltip>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className={`ml-${
              isMenuOpen ? "64" : "20"
            } transition-all duration-300 w-full h-full overflow-auto`}
            style={{ paddingLeft: isMenuOpen ? "16rem" : "5rem" }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  ) : (
    <Navigate to={"/login"} replace></Navigate>
  );
};
