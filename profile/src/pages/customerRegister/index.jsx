import style from "./style.module.scss";
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
const CustomerRegister = () => {
  const location = useLocation();
  //   const navigate = useNavigate();

  //   console.log(customerData);
  //氏名
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [firstNameValidate, setFirstNameValidate] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [lastNameValidate, setLastNameValidate] = useState(false);
  //カナ
  const [kanaFirstName, setKanaFirstName] = useState("");
  const [kanaLastName, setKanaLastName] = useState("");
  const [kanaFirstNameError, setKanaFirstNameError] = useState("");
  const [kanaLastNameError, setKanaLastNameError] = useState("");
  const [kanaFirstNameValidate, setKanaFirstNameValidate] = useState(false);
  const [kanaLastNameValidate, setKanaLastNameValidate] = useState(false);
  //誕生日
  const [birthday, setBirthday] = useState();
  const [birthdayError, setBirthdayError] = useState();
  const [birthdayValidate, setBirthdayValidate] = useState(false);
  //電話番号
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneValidate, setPhoneValidate] = useState(false);
  //メールアドレス
  const [mail, setMail] = useState("");
  const [mailError, setMailError] = useState("");
  const [mailValidate, setMailValidate] = useState(false);
  //郵便番号
  const [zipcode, setZipcode] = useState("");
  const [zipcodeError, setZipcodeError] = useState("");
  const [zipcodeValidate, setZipcodeValidate] = useState(false);
  // 住所
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [address1Error, setAddress1Error] = useState("");
  const [address2Error, setAddress2Error] = useState("");
  const [address3Error, setAddress3Error] = useState("");
  const [addressError, setAddressError] = useState("");
  const [addressValidate1, setAddressValidate1] = useState(false);
  const [addressValidate2, setAddressValidate2] = useState(false);
  const [addressValidate3, setAddressValidate3] = useState(false);

  //職業選択
  const [occupation, setOccupation] = useState("");

  const occupations = ["会社員", "公務員", "自営業", "主婦", "学生", "その他"];

  const navigate = useNavigate();
  const customerData2 = location.state ? location.state.customerData2 : {};
  useEffect(() => {
    if (customerData2 && Object.keys(customerData2).length > 0) {
      setLastName(customerData2.lastName || "");
      setFirstName(customerData2.firstName || "");
      setKanaLastName(customerData2.kanaLastName || "");
      setKanaFirstName(customerData2.kanaFirstName || "");
      setBirthday(customerData2.birthday || "");
      setPhone(customerData2.phone || "");
      setMail(customerData2.mail || "");
      setZipcode(customerData2.zipcode || "");
      setAddress1(customerData2.address1 || "");
      setAddress2(customerData2.address2 || "");
      setAddress3(customerData2.address3 || "");
      setLastNameValidate(!!customerData2.lastName);
      setFirstNameValidate(!!customerData2.firstName);
      setKanaLastNameValidate(!!customerData2.kanaLastName);
      setKanaFirstNameValidate(!!customerData2.kanaFirstName);
      setBirthdayValidate(!!customerData2.birthday);
      setPhoneValidate(!!customerData2.phone);
      setMailValidate(!!customerData2.mail);
      setZipcodeValidate(!!customerData2.zipcode);
      setAddressValidate1(!!customerData2.address1);
      setAddressValidate2(!!customerData2.address2);
      setAddressValidate3(!!customerData2.address3);
      setOccupation(customerData2.occupation || "");
    }
  }, [customerData2]);

  const handleFirstNameChange = (value) => {
    setFirstName(value.trim());
  };
  const handleLastNameChange = (value) => {
    setLastName(value.trim());
  };
  const handleLastNameValidate = () => {
    if (!lastName) {
      setLastNameError("姓を入力してください");
      setLastNameValidate(false);
    } else {
      setLastNameError("");
      setLastNameValidate(true);
    }
  };
  const handleFirstNameValidate = () => {
    if (!firstName) {
      setFirstNameError("名を入力してください");
      setFirstNameValidate(false);
    } else {
      setFirstNameError("");
      setFirstNameValidate(true);
    }
  };

  const handleKanaFirstNameChange = (value) => {
    setKanaFirstName(value.trim());
  };
  const handleKanaLastNameChange = (value) => {
    setKanaLastName(value.trim());
  };

  const handleKanaLastNameValidate = () => {
    if (!kanaLastName) {
      setKanaLastNameError("セイを入力してください");
      setKanaLastNameValidate(false);
    } else if (!kanaLastName.match(/^[ァ-ヶー　]+$/)) {
      setKanaLastNameError("カタカナで入力してください");
      setKanaLastNameValidate(false);
    } else {
      setKanaLastNameError("");
      setKanaLastNameValidate(true);
    }
  };
  const handleKanaFirstNameValidate = () => {
    if (!kanaFirstName) {
      setKanaFirstNameError("メイを入力してください");
      setKanaFirstNameValidate(false);
    } else if (!kanaFirstName.match(/^[ァ-ヶー　]+$/)) {
      setKanaFirstNameError("カタカナで入力してください");
      setKanaFirstNameValidate(false);
    } else {
      setKanaFirstNameError("");
      setKanaFirstNameValidate(true);
    }
  };

  const handleBirthdayChange = (value) => {
    setBirthday(value);
  };
  const handleBirthdayValidate = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const inputDate = new Date(birthday);
    inputDate.setHours(0, 0, 0, 0);

    if (!birthday) {
      setBirthdayError("誕生日を入力してください");
      setBirthdayValidate(false);
    } else if (inputDate > currentDate) {
      setBirthdayError("正しい誕生日を入力してください");
      setBirthdayValidate(false);
    } else {
      setBirthdayError("");
      setBirthdayValidate(true);
    }
  };
  const handlePhoneChange = (value) => {
    setPhone(value.trim());
  };
  const handlePhoneValidate = () => {
    const phoneRegex = /^0\d{9,10}$/;
    if (!phone) {
      setPhoneError("電話番号を入力してください");
      setPhoneValidate(false);
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("正しい電話番号を入力してください");
      setPhoneValidate(false);
    } else {
      setPhoneError("");
      setPhoneValidate(true);
    }
  };
  const handleMailChange = (value) => {
    setMail(value.trim());
  };
  const handleMailValidate = () => {
    const patternMail =
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!mail) {
      setMailError("メールアドレスを入力してください");
      setMailValidate(false);
    } else if (!patternMail.test(mail)) {
      setMailError("正しい形式でメールアドレスを入力してください");
      setMailValidate(false);
    } else {
      setMailError("");
      setMailValidate(true);
    }
  };
  const handleZipcodeChange = (value) => {
    setZipcode(value.trim());
  };
  const handleZipcodeValidate = () => {
    const zipcodeRegex = /^\d{7}$/;
    if (!zipcode) {
      setZipcodeError("郵便番号を入力してください");
      setZipcodeValidate(false);
    } else if (!zipcodeRegex.test(zipcode)) {
      setZipcodeError("正しい郵便番号を入力してください");
      setZipcodeValidate(false);
    } else {
      setZipcodeError("");
      setZipcodeValidate(true);
    }
  };
  const handleAddressChange1 = (value) => {
    setAddress1(value.trim());
  };
  const handleAddressChange2 = (value) => {
    setAddress2(value.trim());
  };
  const handleAddressChange3 = (value) => {
    setAddress3(value.trim());
  };

  const handleAddressValidate1 = () => {
    if (!address1) {
      setAddress1Error("都道府県をご入力ください");
      setAddressValidate1(false);
    } else {
      setAddress1Error("");
      setAddressValidate1(true);
    }
  };
  const handleAddressValidate2 = () => {
    if (!address2) {
      setAddress2Error("市町村区をご入力ください");
      setAddressValidate2(false);
    } else {
      setAddress2Error("");
      setAddressValidate2(true);
    }
  };
  const handleAddressValidate3 = () => {
    if (!address3) {
      setAddress3Error("必須事項です");
      setAddressValidate3(false);
    } else {
      setAddress3Error("");
      setAddressValidate3(true);
    }
  };

  const searchAddress = async () => {
    if (zipcode) {
      try {
        const response = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
        );
        const data = await response.json();
        if (data && data.results) {
          setAddress1(data.results[0].address1);
          setAddress2(data.results[0].address2 + data.results[0].address3);
        } else {
          setAddressError("住所が見つかりません");
        }
      } catch (error) {
        setAddressError(
          "住所の検索中にエラーが発生しました もう一度お試しください"
        );
      }
    } else {
      setAddressError("");
    }
  };

  const handleOccupationChange = (event) => {
    setOccupation(event.target.value);
  };

  const handleAddressDisabled = () => {
    return zipcodeValidate;
  };

  const handleDisabled = () => {
    return (
      lastNameValidate &&
      firstNameValidate &&
      kanaLastNameValidate &&
      kanaFirstNameValidate &&
      birthdayValidate &&
      phoneValidate &&
      zipcodeValidate &&
      mailValidate &&
      (addressValidate1 || address1) &&
      (addressValidate2 || address2) &&
      (addressValidate3 || address3) &&
      occupation
    );
  };

  const handleNextPage = () => {
    const customerData = {
      lastName,
      firstName,
      kanaLastName,
      kanaFirstName,
      birthday,
      phone,
      mail,
      zipcode,
      address1,
      address2,
      address3,
      occupation,
    };

    navigate("../check", { state: { customerData } });
  };

  return (
    <>
      <div className={style.box1}>
        <div className={style.registerWrap}>
          {/* <div className={style.widthSize}> */}
          <h1 className={style.h1style}>会員登録</h1>
          <div className={style.nameWrap}>
            <div>
              <InputText
                label="姓"
                type="text"
                onChange={handleLastNameChange}
                onBlur={handleLastNameValidate}
                placeholder="山田"
                value={lastName}
              />
              {lastNameError && <p>{lastNameError}</p>}
            </div>
            <div>
              <InputText
                label="名"
                type="text"
                onChange={handleFirstNameChange}
                onBlur={handleFirstNameValidate}
                placeholder="太郎"
                value={firstName}
              />
              {firstNameError && <p>{firstNameError}</p>}
            </div>
          </div>
          <div className={style.nameWrap}>
            <div>
              <InputText
                label="セイ"
                type="text"
                onChange={handleKanaLastNameChange}
                onBlur={handleKanaLastNameValidate}
                placeholder="ヤマダ"
                value={kanaLastName}
              />
              {kanaLastNameError && <p>{kanaLastNameError}</p>}
            </div>
            <div>
              <InputText
                label="メイ"
                type="text"
                onChange={handleKanaFirstNameChange}
                onBlur={handleKanaFirstNameValidate}
                placeholder="タロウ"
                value={kanaFirstName}
              />
              {kanaFirstNameError && <p>{kanaFirstNameError}</p>}
            </div>
          </div>
          {/* <div className={style.inputWidth}> */}
          <InputText
            label="誕生日"
            type="date"
            onChange={handleBirthdayChange}
            onBlur={handleBirthdayValidate}
            value={birthday}
          />
          {birthdayError && <p>{birthdayError}</p>}
          <InputText
            label="電話番号 ハイフンなし"
            type="number"
            placeholder="例:0612345678"
            onChange={handlePhoneChange}
            onBlur={handlePhoneValidate}
            value={phone}
          />
          {phoneError && <p>{phoneError}</p>}
          <InputText
            label="メールアドレス"
            type="email"
            placeholder="example@google.com"
            onChange={handleMailChange}
            onBlur={handleMailValidate}
            value={mail}
          />
          {mailError && <p>{mailError}</p>}
          <div className={style.zipcodeWrap}>
            <div>
              <InputText
                label="郵便番号 ハイフンなし"
                type="number"
                placeholder="例:5560005"
                onChange={handleZipcodeChange}
                onBlur={handleZipcodeValidate}
                value={zipcode}
              />
              {zipcodeError && <p>{zipcodeError}</p>}
            </div>

            {/* </div> */}
            <Button
              onClick={searchAddress}
              disabled={!handleAddressDisabled()}
              type="register"
            >
              郵便番号から住所検索
            </Button>
          </div>
          {/* </div> */}
          <div className={style.inputBox}>
            <div className={style.inputWidth}>
              <InputText
                label="住所 都道府県"
                type="text"
                placeholder="大阪府"
                onChange={handleAddressChange1}
                onBlur={handleAddressValidate1}
                value={address1}
              />
              {address1Error && <p>{address1Error}</p>}
              <InputText
                label="市町村区"
                type="text"
                placeholder="大阪市浪速区日本橋"
                onChange={handleAddressChange2}
                onBlur={handleAddressValidate2}
                value={address2}
              />
              {address2Error && <p>{address2Error}</p>}
              <InputText
                label="丁目 番地 号 ハイフン綴りでご入力ください"
                type="text"
                placeholder="例:4-16-15"
                onChange={handleAddressChange3}
                onBlur={handleAddressValidate3}
                value={address3}
              />
              {address3Error && <p>{address3Error}</p>}
              <div className={style.selectbox}>
                <label htmlFor="occupation">ご職業</label>
                <select
                  id="occupation"
                  value={occupation}
                  onChange={handleOccupationChange}
                >
                  <option value="">選択してください</option>
                  {occupations.map((job, index) => (
                    <option key={index} value={job}>
                      {job}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={style.nextButton}>
            <Button
              onClick={handleNextPage}
              disabled={!handleDisabled()}
              type="register"
            >
              確認画面へ
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CustomerRegister;
