import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/login/login";
import { SignUp } from "./pages/sign-up/sign-up";
import { AuthProvider } from "./utils/context/authContext";
import { PrivateRoute } from "./pages/Home/privateRoute/privateRoute";
import { Billing } from "./pages/Home/Billing/billing";
import { LandingPage } from "./pages/Home/landing/landing";
import { useSelector } from "react-redux";
import { WelcomePage } from "./pages/Welcome/welcome";
import { useEffect, useState } from "react";
import { BillingProvider } from "./utils/context/billingContext";
import { ManageResources } from "./pages/Home/ManageResources/ManageResources";

function App() {
  const userInfo = useSelector((state: any) => state?.user);

  useEffect(() => {
    // setRouteKey((prevKey) => prevKey + 1); // Increment the key to force re-render
    console.log("App.tsx - Redux State Updated:", userInfo);
  }, [userInfo]);

  return (
    <div className="w-screen h-screen">
      <Router>
        <AuthProvider>
          <BillingProvider>
            <Routes>
              {/* <Route path="/" element={<Navigate to="/login" />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<PrivateRoute />}>
                <Route index element={<LandingPage />} />
                <Route
                  path="/billing"
                  element={
                    userInfo?.restaurantId ? <Billing /> : <WelcomePage />
                  }
                />
                <Route path="/resources" element={<ManageResources />} />
              </Route>
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </BillingProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
