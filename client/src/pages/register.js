import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../redux/actions/authAction";
import TextBrand from "../images/text-logo.png";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const Register = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialState = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    cf_password: "",
    gender: "male",
  };

  const [userData, setUserData] = useState(initialState);
  const { firstName, lastName, username, email, password, cf_password } = userData;
  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);
  const [message, setMessage] = useState("");

  const validate = () => {
    const msg = {};

    if (!firstName) {
      msg.firstName = "Please enter your first name.";
    }

    if (!lastName) {
      msg.lastName = "Please enter your last name.";
    }

    if (!username) {
      msg.username = "Please enter your username.";
    }

    if (!email) {
      msg.email = "Please enter your email address.";
      // eslint-disable-next-line no-useless-escape
    } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      msg.email = "Email is not valid.";
    }

    if (!password) {
      msg.password = "Please enter your password.";
    } else if (password.length < 6) {
      msg.password = "Password must be at least 6 characters long.";
    } else if (password.match(/^(?=.*\s)/)) {
      msg.password = "Password must not contain any spaces.";
    } else if (
      !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
    ) {
      msg.password =
        "Password must be contain uppercase letters, lowercase letters and numbers ";
    }

    if (!cf_password) {
      msg.cf_password = "Please enter your confirm password";
    } else if (cf_password !== password) {
      msg.cf_password = "Confirm password did not match.";
    }

    setMessage(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  useEffect(() => {
    if (auth.token) navigate("/");
  }, [auth.token, navigate]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    dispatch(register(userData));

    setUserData(initialState);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Link to='/'>
          <div className="p-b-49">
            <img
              src={TextBrand}
              alt="vyviegram_logo"
              style={{
                width: "50%",
                height: "50px",
                objectFit: "contain",
                display: "block",
                margin: "auto",
              }}
            />
          </div>
        </Link>
        <div
          className="tab-pane fade show active"
          id="pills-register"
          role="tabpanel"
          aria-labelledby="tab-register"
        >
          <form onSubmit={handleSubmit}>
            <div data-mdb-input-init className="form-outline mb-4 row">
              <div className="col-md-6 col-sm-12">

                <label className="form-label" htmlFor="registerName">
                  First name
                </label>
                <input
                  type="text"
                  id="registerName"
                  className="form-control"
                  name="firstName"
                  placeholder="First name"
                  value={firstName}
                  onChange={handleChangeInput}
                  style={{ background: `${message.firstName ? "#fd2d6a14" : ""}` }}
                />
                <small className="alert-input form-text text-danger">
                  {message.firstName}
                </small>
              </div>
              <div className="col-md-6 col-sm-12">
                <label className="form-label" htmlFor="registerName">
                  Last name
                </label>
                <input
                  type="text"
                  id="registerName"
                  className="form-control"
                  name="lastName"
                  placeholder="Last name"
                  value={lastName}
                  onChange={handleChangeInput}
                  style={{ background: `${message.lastName ? "#fd2d6a14" : ""}` }}
                />
                <small className="alert-input form-text text-danger">
                  {message.lastName}
                </small>
              </div>
            </div>

            <div data-mdb-input-init className="form-outline mb-4 row">
              <div className="col-md-6 col-sm-12">
                <label className="form-label" htmlFor="registerUsername">
                  Username
                </label>
                <input
                  type="text"
                  id="registerUsername"
                  className="form-control"
                  name="username"
                  placeholder="Username"
                  value={username.toLowerCase().replace(/ /g, "")}
                  onChange={handleChangeInput}
                  style={{ background: `${message.username ? "#fd2d6a14" : ""}` }}
                />
                <small className="alert-input form-text text-danger">
                  {message.username}
                </small>
              </div>
              <div className="col-md-6 col-sm-12">
                <label className="form-label" htmlFor="registerEmail">
                  Email address
                </label>
                <input
                  type="email"
                  id="registerEmail"
                  className="form-control"
                  placeholder="Email address"
                  name="email"
                  value={email}
                  onChange={handleChangeInput}
                  style={{ background: `${message.email ? "#fd2d6a14" : ""}` }}
                />
                <small className="alert-input form-text text-danger">
                  {message.email}
                </small>
              </div>
            </div>

            <div data-mdb-input-init className="form-outline mb-4">
             
            </div>

            <div data-mdb-input-init className="form-outline mb-4 row">
              <div className="col-md-6 col-sm-12 position-relative">
                <label className="form-label" htmlFor="registerPassword">
                  Password
                </label>
                <input
                  id="registerPassword"
                  className="form-control"
                  type={typePass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChangeInput}
                  style={{ background: `${message.password ? "#fd2d6a14" : ""}` }}
                />

                <small onClick={() => setTypePass(!typePass)} className="hide-show-pass-btn">
                  {typePass ? (
                    <BsEyeFill size={20} />
                  ) : (
                    <BsEyeSlashFill size={20} />
                  )}
                </small>
                <small className="alert-input form-text text-danger">
                  {message.password}
                </small>
              </div>
              <div className="col-md-6 col-sm-12 position-relative">
                <label className="form-label" htmlFor="registerRepeatPassword">
                  Repeat password
                </label>
                <input
                  id="registerRepeatPassword"
                  className="form-control"
                  type={typeCfPass ? "text" : "password"}
                  name="cf_password"
                  placeholder="Repeat password"
                  value={cf_password}
                  onChange={handleChangeInput}
                  style={{
                    background: `${message.cf_password ? "#fd2d6a14" : ""}`,
                  }}
                />
                <small onClick={() => setTypeCfPass(!typeCfPass)} className="hide-show-pass-btn">
                  {typeCfPass ? (
                    <BsEyeFill size={20} />
                  ) : (
                    <BsEyeSlashFill size={20} />
                  )}
                </small>
                <small className="alert-input form-text text-danger">
                  {message.cf_password}
                </small>
              </div>
            </div>

            <div data-mdb-input-init className="form-outline mb-4">
              <label className="form-label" htmlFor="#">
                Gender
              </label>
              <div className="form-check gender-box-container">
                <label htmlFor="male">
                  Male:{" "}
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    defaultChecked
                    onChange={handleChangeInput}
                  />
                </label>

                <label htmlFor="female">
                  Female:{" "}
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    onChange={handleChangeInput}
                  />
                </label>

                <label htmlFor="other">
                  Other:{" "}
                  <input
                    type="radio"
                    id="other"
                    name="gender"
                    value="other"
                    onChange={handleChangeInput}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              data-mdb-button-init
              data-mdb-ripple-init
              className="auth-submit-btn btn btn-block mb-3"
            >
              Sign up
            </button>
          </form>
          <div className="text-right p-t-8 p-b-31">
            <p>
              You already have an account?{" "}
              <Link to="/login" style={{ color: "crimson" }}>
                Login Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
