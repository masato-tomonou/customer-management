import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import style from "./style.module.scss";
const RegisterComplete = () => {
  const location = useLocation();
  const customerId = location.state.customerId;
  return (
    <>
      <div className={style.registerCompWrap}>
        <h1 className={style.h1style}>登録完了</h1>

        <p className={style.idTitle}>あなたの会員ID</p>
        <p className={style.yourId}>{customerId}</p>
        <p className={style.idSentence}>上記IDをお控えください。</p>
        <p className={style.idSentence}>
          またこちらの画面をスタッフにお見せください。
        </p>
      </div>
    </>
  );
};
export default RegisterComplete;
