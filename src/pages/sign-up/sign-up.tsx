import { useEffect, useState } from "react";
import { mainLogo } from "../../utils/imports";
import { Space, Typography } from "antd";
import { Link } from "react-router-dom";
import MTInput from "../../components/input/MTInput";
import MTButton from "../../components/MTButton/MTButton";
import useApiRequest from "../../utils/hooks/useApi";
import { signup } from "../../utils/endpoints";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

export const SignUp = () => {
  const [data, setData] = useState<any>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const resetForm = () => {
    console.log();
    setData({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    });
  };

  const navigate = useNavigate();

  const isFormValid = Object.values(data).every(
    (field: any) => field.trim() !== ""
  );

  const handleChange = (key: any, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const { apiRequest, response } = useApiRequest();

  const handleSubmit = async () => {
    // console.log(data);
    await apiRequest("POST", signup, data);
    console.log(response);
  };

  useEffect(() => {
    if (response) {
      console.log("API Response:", response); // This is where you can access the response
      console.log(response?.token);
      localStorage.setItem("authToken", JSON.stringify(response.token));
      navigate("/home");
    }
  }, [response]);

  return (
    <div className="w-full h-full flex justify-center items-center bg-slate-50 relative">
      <div className="w-1/2 p-6 rounded-sm shadow-md bg-white flex flex-col items-center ">
        <div className="flex flex-col gap-2 justify-center items-center">
          <img src={mainLogo} alt="" className="w-10 h-10" />
          <Title level={4}>Create Account!</Title>
        </div>
        <div className="w-full p-5 grid grid-cols-2 gap-x-2 gap-y-4 place-items-center">
          <MTInput
            label={"Full Name"}
            value={data.name}
            handleChange={(e: any) => handleChange("name", e?.target?.value)}
          ></MTInput>
          <MTInput
            label={"Email"}
            type={"email"}
            value={data.email}
            handleChange={(e: any) => {
              handleChange("email", e?.target?.value);
            }}
          ></MTInput>
          <MTInput
            label={"Password"}
            type={"password"}
            helperText={"Sometext"}
            value={data.password}
            handleChange={(e: any) => {
              handleChange("password", e?.target?.value);
            }}
          ></MTInput>
          <MTInput
            label={"Phone"}
            type={"tel"}
            value={data.phone}
            handleChange={(e: any) => {
              handleChange("phone", e?.target?.value);
            }}
          ></MTInput>
          <div className="col-span-2 w-full">
            <MTInput
              label={"Address"}
              value={data.address}
              handleChange={(e: any) => {
                handleChange("address", e?.target?.value);
              }}
              // className={"col-span-2"}
            ></MTInput>
          </div>
          <div className="col-span-2 flex gap-3">
            <MTButton
              label={"Reset"}
              variant="outlined"
              handleClick={resetForm}
            ></MTButton>
            <MTButton
              label={"Proceed"}
              disabled={!isFormValid}
              handleClick={handleSubmit}
            ></MTButton>
          </div>
        </div>

        <div>
          <Space direction="horizontal">
            <Text>Already have an account?</Text>
            <Link to="/login">Login!</Link>
          </Space>
        </div>
      </div>
    </div>
  );
};
