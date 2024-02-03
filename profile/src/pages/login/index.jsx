import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import InputText from "../../components/InputText";
import style from "./style.module.scss";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [errorId, setErrorId] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [idValid, setIdValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [errorLoginMessage, setErrorLoginMessage] = useState("");

  useEffect(() => {
    console.log(passwordValid);
  }, [passwordValid]);

  useEffect(() => {
    console.log(idValid);
  }, [idValid]);

  const handleIdChange = (value) => {
    setId(value);
  };

  const handleValidId = () => {
    if (!id) {
      setErrorId("IDを入力してください");
      setIdValid(false);
    } else {
      setErrorId("");
      setIdValid(true);
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleValidPassword = () => {
    const patternPassword = /^[a-zA-Z0-9]*$/;
    if (!password) {
      setErrorPassword("パスワードを入力してください");
      setPasswordValid(false);
    } else if (password.length < 8 || password.length > 16) {
      setErrorPassword("パスワードは8桁以上16桁以内で入力してください");
      setPasswordValid(false);
    } else if (!patternPassword.test(password)) {
      setErrorPassword("パスワードは半角英数字で入力してください");
      setPasswordValid(false);
    } else {
      setErrorPassword("");
      setPasswordValid(true);
    }
  };

  const handleDisabled = () => {
    return passwordValid && idValid;
  };

  axios.defaults.baseURL = "http://localhost:9000/";
  axios.defaults.withCredentials = true;

  const handleLogin = () => {
    const staff_id = id;
    axios
      .post(
        "/login",
        JSON.stringify({
          staff_id,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        console.log("ログイン成功");
        setErrorLoginMessage("");
        navigate("../admin_top");
      })
      .catch((err) => {
        console.error("ログインエラー:", err);
        setErrorLoginMessage("IDかパスワードが正しくありません");
      });
  };

  return (
    <>
      <div className={style.bodyLogin}>
        <h1 className={style.h1Title}>従業員ログイン</h1>

        <div className={style.loginInput}>
          {errorLoginMessage && (
            <p className={style.errorMsg}>{errorLoginMessage}</p>
          )}
          <InputText
            value={id}
            onChange={handleIdChange}
            onBlur={handleValidId}
            label="従業員ID"
            // placeholder="従業員idをご入力ください"
          />
          {errorId && <p className={style.errorMsg}>{errorId}</p>}
        </div>

        <div className={style.loginInput}>
          <InputText
            value={password}
            onChange={handlePasswordChange}
            onBlur={handleValidPassword}
            label="パスワード"
            type="password"
            // placeholder=""
          />
          {errorPassword && <p className={style.errorMsg}>{errorPassword}</p>}
        </div>

        <Button onClick={handleLogin} disabled={!handleDisabled()}>
          ログイン
        </Button>
      </div>
    </>
  );
};

export default AdminLogin;
