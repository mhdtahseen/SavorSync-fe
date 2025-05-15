//@ts-nocheck
import { Button, Step, Stepper, Typography } from "@material-tailwind/react";
import { DynamicIcon } from "lucide-react/dynamic";
import React, { useContext, useState } from "react";
import MTInput from "../../components/input/MTInput";
import useApiRequest from "../../utils/hooks/useApi";
import { addRestaurant, tables } from "../../utils/endpoints";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/context/authContext";

export const WelcomePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [data, setData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    menu: [{ item_name: "", price: "", description: "", is_available: true }],
  });
  const navigate = useNavigate();
  const { apiRequest } = useApiRequest();
  const { assignRestaurant } = useContext(AuthContext);
  const [tableData, setTableData] = useState([
    {
      table_number: "",
    },
  ]);

  //   const addNewMenuItem = (type = "restaurant") => {
  //     if (type === "restaurant") {
  //       setData({
  //         ...data,
  //         menu: [
  //           ...data.menu,
  //           { item_name: "", price: "", description: "", is_available: true },
  //         ],
  //       });
  //     } else {
  //       setTableData([
  //         ...tableData,
  //         {
  //           table_number: "",
  //         },
  //       ]);
  //     }
  //   };

  const addNewMenuItem = (type: string) => {
    if (type === "restaurant") {
      setData((prevData) => ({
        ...prevData,
        menu: [
          ...prevData.menu,
          { item_name: "", price: "", description: "", is_available: true },
        ],
      }));
    } else if (type === "table") {
      setTableData((prevTableData) => [
        ...prevTableData,
        {
          table_number: "",
        },
      ]);
    }
  };

  const handleInput = (key, value, index = null, type = "restaurant") => {
    if (index !== null) {
      if (type === "restaurant") {
        const updatedMenu = [...data.menu];
        updatedMenu[index] = { ...updatedMenu[index], [key]: value };
        setData((prevData) => ({
          ...prevData,
          menu: updatedMenu,
        }));
      } else {
        const updatedTables = [...tableData];
        updatedTables[index] = { ...updatedTables[index], [key]: value };
        setTableData(updatedTables);
      }
    } else {
      setData((prevData) => {
        return {
          ...prevData,
          [key]: value,
        };
      });
    }
  };

  const handleDelete = (index: any, type = "restaurant") => {
    if (type === "restaurant") {
      const updatedData = data.menu.filter((_, i) => i !== index);
      setData((prevData) => ({ ...prevData, menu: updatedData }));
    } else {
      const updatedTableData = tableData.filter((_, i) => i !== index);
      setTableData(updatedTableData);
    }
  };

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
  const handleSubmit = async () => {
    const newRestaurant = await apiRequest("POST", addRestaurant, data);
    if (newRestaurant?.restaurant?._id) {
      const restaurantId = newRestaurant?.restaurant?._id;
      const userId = localStorage.getItem("userId");

      const tableResponse = await apiRequest(
        "POST",
        `${tables}/${restaurantId}`,
        tableData
      );
      if (tableResponse) {
        assignRestaurant(userId, restaurantId);
      }
    }
  };

  const steps = ["Restaurant Details", "Menu Details", "Table Details"];
  const stepIcons = ["building", "salad", "armchair"];
  return (
    <div className="p-4 h-full w-full">
      Welcome
      <div className="p-5 flex flex-col justify-between gap-4">
        <Stepper
          className="mb-12"
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
        >
          {steps.map((step: any, index) => (
            <Step key={index} onClick={() => setActiveStep(index)}>
              {/* <MTTooltip content={steps[index]} placement={"top"}> */}
              <DynamicIcon name={stepIcons[index]} size={"24"} />
              {/* </MTTooltip> */}
              <div className="absolute -bottom-[3.6rem] text-center">
                {/* <Typography
                  variant="h6"
                  color={activeStep === 0 ? "blue-gray" : "gray"}
                >
                  Step {index + 1}
                </Typography> */}
                <Typography
                  variant="h6"
                  color={activeStep === 0 ? "blue-gray" : "gray"}
                  className="font-normal"
                >
                  {steps[index]}
                </Typography>
              </div>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <div className="mt-4 container flex flex-col gap-3">
            <MTInput
              label={"Restaurant Name"}
              value={data.name}
              handleChange={(e: any) => {
                handleInput("name", e?.target?.value);
              }}
            />
            <MTInput
              label={"Address"}
              value={data.address}
              handleChange={(e: any) => {
                handleInput("address", e?.target?.value);
              }}
            />
            <div className="flex gap-4">
              <MTInput
                label={"Phone"}
                type="tel"
                value={data.phone}
                handleChange={(e: any) => {
                  handleInput("phone", e?.target?.value);
                }}
              />
              <MTInput
                label={"Email"}
                type="email"
                value={data.email}
                handleChange={(e: any) => {
                  handleInput("email", e?.target?.value);
                }}
              />
            </div>
          </div>
        )}

        {/* Adding Menu */}
        {activeStep === 1 && (
          <div className="mt-4 container flex flex-col gap-3">
            {data.menu.map((menuItem, index) => (
              <div key={index} className="flex gap-3">
                <MTInput
                  label={"Item Name"}
                  value={menuItem.item_name}
                  handleChange={(e) =>
                    handleInput("item_name", e?.target.value, index)
                  }
                />
                <MTInput
                  label={"Price"}
                  value={menuItem.price}
                  handleChange={(e) =>
                    handleInput("price", e?.target.value, index)
                  }
                />
                <MTInput
                  label={"Description"}
                  value={menuItem.description}
                  handleChange={(e) =>
                    handleInput("description", e?.target.value, index)
                  }
                />
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleDelete(index)}
                >
                  <DynamicIcon name="trash-2" color="red" size={"18"} />
                </div>
              </div>
            ))}
            <div className="self-end mt-6">
              <Button
                color="green"
                key={"menuAddButton"}
                onClick={() => addNewMenuItem("restaurant")}
              >
                <div className="flex items-center justify-center gap-2">
                  <DynamicIcon name="plus" color="white" size={"20"} />
                  <span>Add Another</span>
                </div>
              </Button>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="mt-4 container flex flex-col gap-3">
            {tableData.map((table, index) => (
              <div key={index} className="flex gap-3">
                <MTInput
                  label={"Table Number"}
                  value={table.table_number}
                  handleChange={(e) =>
                    handleInput("table_number", e?.target.value, index, "table")
                  }
                />
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => handleDelete(index, "table")}
                >
                  <DynamicIcon name="trash-2" color="red" size={"18"} />
                </div>
              </div>
            ))}
            <div className="self-end mt-6">
              <Button
                key={"tableAddButton"}
                color="green"
                onClick={() => addNewMenuItem("table")}
              >
                <div className="flex items-center justify-center gap-2">
                  <DynamicIcon name="plus" color="white" size={"20"} />
                  <span>Add Another</span>
                </div>
              </Button>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-between">
          <Button onClick={handlePrev} disabled={isFirstStep}>
            Prev
          </Button>
          {
            <Button onClick={isLastStep ? handleSubmit : handleNext}>
              {isLastStep ? "Submit" : "Next"}
            </Button>
          }
        </div>
      </div>
    </div>
  );
};
