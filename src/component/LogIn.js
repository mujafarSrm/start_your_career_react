import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LogIn.css";

const LogIn = ({ onClose }) => {
  const [decodedPayload, setDecodedPayload] = useState(null);
  // const [userId, setUserId] = useState("");
  var userId ;
  const navigate = useNavigate();

  useEffect(()=>{
    if (localStorage.getItem("userToken")) {
      console.log(
        "--------line 145",
        isThereToken,
        localStorage.getItem("userToken"),
        localStorage.getItem("userId")
      );
    }
  }, [])
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    console.log(token + "Line 12 Token");
    if (token) {
      try {
        const [, payloadBase64] = token.split(".");
        const normalizedPayloadBase64 = payloadBase64
          .replace(/-/g, "+")
          .replace(/_/g, "/");
        const decodedPayloadString = atob(normalizedPayloadBase64);
        const decodedPayloadObject = JSON.parse(decodedPayloadString);
        setDecodedPayload(decodedPayloadObject);
        console.log(decodedPayloadObject + "Line 22 DPO");
        // setUserId(decodedPayloadObject.userId);
        userId = decodedPayloadObject.userId;
        console.log(decodedPayloadObject.userId);
        localStorage.setItem("userId", decodedPayloadObject.userId);
      } catch (error) {
        console.error("Error decoding JWT token:", error.message);
      }
    }
    console.log("------line 27 for payload ", decodedPayload, userId);
  }, []);
  const [loginMessage, setLoginMessage] = useState("");
  const [randomAnimation, setRandomAnimation] = useState(getRandomAnimation());
  const [logIn, setLogIn] = useState(true);
  const [signIn, setSignIn] = useState("");
  const [loginFormData, setLoginFormData] = useState({
    Email: "",
    Password: "",
  });
  const [isThereToken, setIsThereToken] = useState(false);
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
    PasswordConfirm: "",
    FirstName: "",
    LastName: "",
    Gender: "",
    Role: true,
  });

  const handleRoleChange = (e) => {
    const value = e.target.value === "true"; 
    setFormData({ ...formData, Role: value });
  };

  const handleLoginInputChanges = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
    console.log("Login Form Data:", loginFormData);
  };

  const handleRegisterInputChanges = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("Register Form Data:", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("----line38");
    try {
      const response = await fetch(`http://localhost:5000/Register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.Email,
          Password: formData.Password,
          PasswordConfirm: formData.PasswordConfirm,
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Gender: formData.Gender,
          Role: formData.Role,
        }),
        // body:JSON.stringify(formData)
      });

      console.log("Register Form Data:", formData);
      console.log("Server Response:", response.body);
      const errorData = await response.text();
      console.log("Response Content:", errorData);

      if (response.ok) {
        console.log("Registration successful");
        alert("Registration successful");
        setFormData({
          Email: "",
          Password: "",
          PasswordConfirm: "",
          FirstName: "",
          LastName: "",
          Gender: "",
          Role: false,
        });
        onClose();
        navigate('/home');
      } else {
        console.error("Registration failed");
        const errorData = await response.json();
        alert("Enter Correct Details");
        console.log("Error:", errorData.message || "Registration failed");
      }
    } catch (error) {
      alert("Enter Correct Details");
      console.error("Error during registration:", error);
      console.error("Error during registration:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/Login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: loginFormData.Email,
          Password: loginFormData.Password,
        }),
      });

      const response1 = await response.json();
      const userToken = response1.token;
      if (userToken) {
        setIsThereToken(true);
      }
      // localStorage.clear();
      // localStorage.removeItem('userToken');
      localStorage.setItem("userToken", userToken);
      console.log("--------line 103 in login", response1, userToken);

      if (response.ok) {
        console.log("Login successful");
        alert("Login Successful");
        console.log(
          "----------line 105 in log in",
          response.body,
          response.ok,
          response.data
        );
        setLoginFormData({
          Email: "",
          Password: "",
        });
        console.log("befor navigating to home");
        onClose();
        navigate('/home');
        console.log("after navigating");
        return response;
      } else {
        console.error("Login failed");
        const errorData = await response.json();
        alert("Enter Correct Details");
        console.log("Error:", errorData.message || "Login failed");
      }
    } catch (error) {
      alert("Enter Correct Details");
      console.error("Error during login:", error);
    }
  };

  function getRandomAnimation() {
    const animationNames = [
      "flipIn",
      "slideUp",
      "flipIn",
      "bounceIn",
      "fadeIn",
    ];
    const randomIndex = Math.floor(Math.random() * animationNames.length);
    return animationNames[randomIndex];
  }

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      console.log(
        "--------line 145",
        isThereToken,
        localStorage.getItem("userToken"),
        localStorage.getItem("userId")
      );
    }
  }, []);

  return (
    <div className="login-page-alert">
      {logIn && (
        <div className={`login-alert ${randomAnimation}`}>
          <h1 className="login-header">USER LOGIN</h1>
          <div className="alert-content">
            <p className="">{loginMessage}</p>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <div className="form-group-title">
                  <label htmlFor="Email">Email:</label>
                </div>
                <div>
                  <input
                    type="text"
                    id="Email"
                    name="Email"
                    value={loginFormData.Email}
                    onChange={handleLoginInputChanges}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-group-title">
                  <label htmlFor="Password">PASSWORD:</label>
                </div>
                <div>
                  <input
                    type="Password"
                    id="Password"
                    name="Password"
                    value={loginFormData.Password}
                    onChange={handleLoginInputChanges}
                    required
                  />
                </div>
              </div>
              <div
                onClick={() => {
                  setLogIn(false);
                  setSignIn(true);
                }}
              >
                <p>
                  Create New Accout /<strong> SignIn</strong>{" "}
                </p>
              </div>

              <div className="form-group-buttons">
                <div>
                  <button type="button" onClick={onClose}>
                    Cancel
                  </button>
                </div>
                <div>
                  <button type="submit">LogIn</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {signIn && (
        <div className={`login-alert ${randomAnimation} signIn`}>
          <h1 className="login-header">USER SIGNIN</h1>
          <div className="alert-content sign">
            <form className="login-form sign" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="sign form-group-title">
                  <label htmlFor="Email">EMAIL:</label>
                </div>
                <div>
                  <input
                    type="text"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleRegisterInputChanges}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="sign form-group-title">
                  <label htmlFor="Password">PASSWORD:</label>
                </div>
                <div>
                  <input
                    type="Password"
                    id="Password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleRegisterInputChanges}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="sign-csc form-group-title">
                  <label htmlFor="PasswordConfirm ">CONFIRM PASSWORD:</label>
                </div>
                <div>
                  <input
                    type="Password"
                    id="PasswordConfirm"
                    name="PasswordConfirm"
                    value={formData.PasswordConfirm}
                    onChange={handleRegisterInputChanges}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="sign-cs form-group-title">
                  <label htmlFor="FirstName">FIRST NAME:</label>
                </div>
                <div>
                  <input
                    type="text"
                    id="FirstName"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleRegisterInputChanges}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="sign-cs form-group-title">
                  <label htmlFor="LastName">LAST NAME:</label>
                </div>
                <div>
                  <input
                    type="text"
                    id="LastName"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleRegisterInputChanges}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="sign-cs form-group-title">
                  <label htmlFor="Gender">GENDER:</label>
                </div>
                <div>
                  <input
                    type="text"
                    id="Gender"
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleRegisterInputChanges}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="sign-cs form-group-title">
                  <label htmlFor="Role">ROLE:</label>
                </div>
                <div>
                  <select
                    id="Role"
                    name="Role"
                    value={formData.Role.toString()}
                    onChange={handleRoleChange}
                  >
                    <option value="true">Recruiter</option>
                    <option value="false">Student</option>
                  </select>
                </div>
              </div>

              <div
                onClick={() => {
                  setLogIn(true);
                  setSignIn(false);
                }}
              >
                <p>
                  Already have an account /<strong> LogIn</strong>{" "}
                </p>
              </div>

              <div className="form-group-buttons signin">
                <div>
                  <button type="button" onClick={onClose}>
                    Cancel
                  </button>
                </div>
                <div>
                  <button type="submit">SignIn</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogIn;
