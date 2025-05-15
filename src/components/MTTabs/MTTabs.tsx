//@ts-nocheck
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import React from "react";

export const MTTabs = (props: any) => {
  const [activeTab, setActiveTab] = React.useState(props.tabData[0].value);
  return (
    <Tabs value={activeTab} className="h-full">
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
        }}
      >
        {props?.tabData.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => setActiveTab(value)}
            className={activeTab === value ? "text-gray-900" : ""}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {props?.tabData.map(({ value, component: Component, desc }) => (
          <TabPanel key={value} value={value}>
            {Component ? <Component /> : desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};
