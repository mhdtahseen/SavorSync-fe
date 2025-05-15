import { useContext, useEffect, useState } from "react";
import { mainLogo } from "../../utils/imports";
import { Button, Form, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import AntDInput from "../../components/antd-input/antd-input";
// import useApiRequest from "../../utils/hooks/useApi";
// import { login } from "../../utils/endpoints";
// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/context/authContext";

const { Text } = Typography;

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useContext(AuthContext);

  // const { apiRequest, response } = useApiRequest();
  // const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
    } else {
      setError(null);
      // console.log("Submitted:", { username, password });
      // await apiRequest("POST", login, { email: username, password: password });
      login({ email: username, password: password });
    }
  };

  // useEffect(() => {
  //   if (response) {
  //     localStorage.setItem("authToken", response.token);
  //     navigate("/home");
  //   }
  // }, [response]);
  return (
    <div className="w-full h-full flex justify-center items-center bg-slate-50 relative">
      <div className="w-1/2 p-6 rounded-sm shadow-md bg-white flex flex-col items-center gap-5">
        <img src={mainLogo} alt="" className="w-10 h-10" />
        <Form layout="vertical" className="w-full">
          <AntDInput
            label="Email"
            placeholder="Enter your Email Address"
            prefix={<UserOutlined />}
            value={username}
            onChange={setUsername}
            error={error && !username ? "Username is required" : undefined}
            required
          />
          <AntDInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={setPassword}
            error={error && !password ? "Password is required" : undefined}
            required
          />
          <Form.Item className="flex justify-center items-center">
            <Button type="primary" onClick={handleSubmit}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div>
          <Space direction="horizontal">
            <Text>Dont Have an Account Yet?</Text>
            <Link to="/signup">Sign Up!</Link>
          </Space>
        </div>
      </div>
    </div>
  );
};
