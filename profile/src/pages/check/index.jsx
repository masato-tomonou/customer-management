import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import axios from "axios";
import style from "./style.module.scss";
const Check = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const customerData = location.state.customerData;
  console.log(customerData);
  const { birthday, occupation } = customerData;
  const last_name = customerData.lastName;
  console.log(customerData.lastName);
  const first_name = customerData.firstName;
  const furigana_last_name = customerData.kanaLastName;
  const furigana_first_name = customerData.kanaFirstName;
  const phoneNumber = customerData.phone;
  const email = customerData.mail;
  const postalCode = customerData.zipcode;
  const address =
    customerData.address1 + customerData.address2 + customerData.address3;

  //   console.log(customerData);
  const customerData2 = customerData;

  const handleBack = () => {
    navigate("../", { state: { customerData2 } });
  };

  //API接続
  axios.defaults.baseURL = "http://localhost:9000/";
  axios.defaults.withCredentials = true;
  const handleRegister = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // JSON形式でデータを送信
    axios
      .post(
        "/register",
        JSON.stringify({
          last_name,
          first_name,
          furigana_last_name,
          furigana_first_name,
          birthday,
          phoneNumber,
          email,
          postalCode,
          address,
          occupation,
        }),
        config
      )
      .then((res) => {
        console.log(res);
        // console.log("aaaaaaaaaa" + res.data.userId);
        console.log("ログイン成功");
        // setErrorLoginMessage("");
        const customerId = res.data.customerId;
        navigate("../complete", { state: { customerId: customerId } });
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          alert(err.response.data.message); // または別のUI要素を使用してメッセージを表示
        } else {
          console.error("登録エラー:", err);
          navigate("../error");
        }
      });
  };

  return (
    <>
      <div className={style.checkWrap}>
        <h1 className={style.h1style}>ご登録内容確認</h1>
        <table className={style.checkTableWrap}>
          <tr>
            <th>お名前</th>
            <td>
              {customerData.lastName}　{customerData.firstName}様
            </td>
          </tr>
          <tr>
            <th>お名前(カナ)</th>
            <td>
              {customerData.kanaLastName}　{customerData.kanaFirstName}
            </td>
          </tr>
          <tr>
            <th>お誕生日</th>
            <td>{customerData.birthday}</td>
          </tr>
          <tr>
            <th>お電話番号</th>
            <td>{customerData.phone}</td>
          </tr>
          <tr>
            <th>メールアドレス</th>
            <td>{customerData.mail}</td>
          </tr>
          <tr>
            <th>郵便番号</th>
            <td>{customerData.zipcode}</td>
          </tr>
          <tr>
            <th>ご住所</th>
            <td>
              {customerData.address1}　{customerData.address2}
              {customerData.address3}
            </td>
          </tr>
          <tr>
            <th>ご職業</th>
            <td>{customerData.occupation}</td>
          </tr>
          <tr>
            <td className={style.registerBackButton}>
              <Button type="registerBack" onClick={handleBack}>
                修正
              </Button>
            </td>
            <td className={style.registerButton}>
              <Button type="register" onClick={handleRegister}>
                登録
              </Button>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};
export default Check;
