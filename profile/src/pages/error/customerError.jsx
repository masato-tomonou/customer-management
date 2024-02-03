import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import { useLocation, Link, useNavigate } from "react-router-dom";
const CustomerError = () => {
  const navigate = useNavigate();
  const handleRegister = () => {
    navigate("../");
  };
  return (
    <>
      <div>
        <p>登録中にエラーが発生しました。</p>
        <p>お手数ですがもう一度やり直してください。</p>
        <Button onClick={handleRegister}>戻る</Button>
      </div>
    </>
  );
};
export default CustomerError;
