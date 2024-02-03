import React, { useState, useEffect } from "react";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import style from "./style.module.scss";
const AdminCustomerDetail = () => {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteDealReason, setDeleteDealReason] = useState("");

  const { customerId } = useParams();
  const [staffId, setStaffId] = useState("");
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountValidate, setAmountValidate] = useState(false);

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
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [addressValidate, setAddressValidate] = useState(false);

  //職業選択
  const [occupation, setOccupation] = useState("");

  const occupations = ["会社員", "公務員", "自営業", "主婦", "学生", "その他"];

  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [transactionId, setTransactionId] = useState();

  axios.defaults.baseURL = "http://localhost:9000/";
  axios.defaults.withCredentials = true;

  /**
   * ログインチェック
   */
  useEffect(() => {
    // if (nowUrl !== "/login" && nowUrl !== "/adminLogin") {
    // JSON形式でデータを送信
    axios
      .get("/authtoken")
      .then((res) => {
        console.log("ログイン成功");
        console.log(res);
        setStaffId(res.data.staff_id);
      })
      .catch((err) => {
        console.log("ログインしてません");
        window.location.href = "http://localhost:3000/admin_login";
      });
    // }
  }, []);

  const handleDisabled = () => {
    return amountValidate;
  };

  const handleBack = () => {
    navigate("../admin_top");
  };
  const handleWrittenConcent = () => {
    navigate(`../admin_written_consent/${customerId}`);
  };
  const handleBuyPrice = (value) => {
    if (value == "") {
      setAmountValidate(false);
    }
    setAmountValidate(true);
    setAmount(value);
  };
  const handleOpenModal = () => {
    setEditModalIsOpen(true);
  };
  const handleCloseModal = () => {
    setEditModalIsOpen(false);
  };
  const handleDeleteModalIsOpen = () => {
    setDeleteModalIsOpen(true);
  };
  const handleDeleteModalIsClose = () => {
    setDeleteModalIsOpen(false);
  };
  const handleAddBuyPrice = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // JSON形式でデータを送信
    axios
      .post(
        "/addTransaction",
        JSON.stringify({
          customerId,
          staffId,
          amount,
        }),
        config
      )
      .then((res) => {
        console.log(res);
        // setCustomerData(res.data);
        // console.log("aaaaaaaaaa" + res.data.userId);
        console.log("ログイン成功");
        setEditModalIsOpen(false);
        // JSON形式でデータを送信
        axios
          .post(
            "/customerDetail",
            JSON.stringify({
              customerId,
            }),
            config
          )
          .then((res) => {
            console.log(res);
            setCustomerData(res.data);

            // console.log("aaaaaaaaaa" + res.data.userId);
            console.log("ログイン成功");
          })
          .catch((err) => {
            console.error("登録エラー:", err);
            window.location.href = "http://localhost:3000/admin_login";
          });
      })
      .catch((err) => {
        console.error("登録エラー:", err);
        window.location.href = "http://localhost:3000/admin_login";
      });
  };
  const handleUpdateCustomerInfoModal = () => {
    setUpdateModalIsOpen(true);
  };
  const handleBackUpdate = () => {
    setUpdateModalIsOpen(false);
  };
  const handleLastNameValidate = () => {
    if (!lastName) {
      setLastNameError("姓を入力してください");
      return false;
    } else {
      setLastNameError("");
      return true;
    }
  };
  const handleFirstNameValidate = () => {
    if (!firstName) {
      setFirstNameError("名を入力してください");
      return false;
    } else {
      setFirstNameError("");
      return true;
    }
  };

  const handleKanaLastNameValidate = () => {
    if (!kanaLastName) {
      setKanaLastNameError("セイを入力してください");
      return false;
    } else if (!kanaLastName.match(/^[ァ-ヶー　]+$/)) {
      setKanaLastNameError("カタカナで入力してください");
      return false;
    } else {
      setKanaLastNameError("");
      return true;
    }
  };
  const handleKanaFirstNameValidate = () => {
    if (!kanaFirstName) {
      setKanaFirstNameError("メイを入力してください");
      return false;
    } else if (!kanaFirstName.match(/^[ァ-ヶー　]+$/)) {
      setKanaFirstNameError("カタカナで入力してください");
      return false;
    } else {
      setKanaFirstNameError("");
      return true;
    }
  };
  const handleBirthdayValidate = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const inputDate = new Date(birthday);
    inputDate.setHours(0, 0, 0, 0);

    if (!birthday) {
      setBirthdayError("誕生日を入力してください");
      return false;
    } else if (inputDate > currentDate) {
      setBirthdayError("正しい誕生日を入力してください");
      return false;
    } else {
      setBirthdayError("");
      return true;
    }
  };
  const handlePhoneValidate = () => {
    const phoneRegex = /^0\d{9,10}$/;
    if (!phone) {
      setPhoneError("電話番号を入力してください");
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("正しい電話番号を入力してください");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };
  const handleMailValidate = () => {
    const patternMail =
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!mail) {
      setMailError("メールアドレスを入力してください");
      return false;
    } else if (!patternMail.test(mail)) {
      setMailError("正しい形式でメールアドレスを入力してください");
      return false;
    } else {
      setMailError("");
      return true;
    }
  };
  const handleZipcodeValidate = () => {
    const zipcodeRegex = /^\d{7}$/;
    if (!zipcode) {
      setZipcodeError("郵便番号を入力してください");
      return false;
    } else if (!zipcodeRegex.test(zipcode)) {
      setZipcodeError("正しい郵便番号を入力してください");
      return false;
    } else {
      setZipcodeError("");
      return true;
    }
  };
  const handleAddressValidate = () => {
    if (!address) {
      setAddressError("住所を入力してください");
      return false;
    } else {
      setAddressError("");
      return true;
    }
  };
  const handleUpdateCustomerInfo = () => {
    const isLValid = handleLastNameValidate();
    const isFValid = handleFirstNameValidate();
    const isKlValid = handleKanaLastNameValidate();
    const isKfValid = handleKanaFirstNameValidate();
    const isBValid = handleBirthdayValidate();
    const isPValid = handlePhoneValidate();
    const isZValid = handleZipcodeValidate();
    const isMValid = handleMailValidate();
    const isAValid = handleAddressValidate();
    if (
      isLValid &&
      isFValid &&
      isKlValid &&
      isKfValid &&
      isBValid &&
      isPValid &&
      isZValid &&
      isMValid &&
      isAValid
      //   occupation
    ) {
      const customer_id = customerId;
      const last_name = lastName;
      const first_name = firstName;
      const furigana_last_name = kanaLastName;
      const furigana_first_name = kanaFirstName;
      // const birthday = birthday;
      const phoneNumber = phone;
      const email = mail;
      const postalCode = zipcode;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios
        .post(
          "/updateCustomer",
          JSON.stringify({
            customer_id,
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
          setUpdateModalIsOpen(false);
        })
        .catch((err) => {
          console.error("登録エラー:", err);
          window.location.href = "http://localhost:3000/admin_login";
        });
    } else {
      return;
    }
  };
  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // JSON形式でデータを送信
    axios
      .post(
        "/customerDetail",
        JSON.stringify({
          customerId,
        }),
        config
      )
      .then((res) => {
        console.log(res);
        setCustomerData(res.data);

        setLastName(res.data.customerInfo.last_name);
        setFirstName(res.data.customerInfo.first_name);
        setKanaLastName(res.data.customerInfo.furigana_last_name);
        setKanaFirstName(res.data.customerInfo.furigana_first_name);
        setMail(res.data.customerInfo.email);
        setBirthday(res.data.customerInfo.formatted_birthday);
        setPhone(res.data.customerInfo.phone_number);
        setZipcode(res.data.customerInfo.postal_code);
        setAddress(res.data.customerInfo.address);
        setOccupation(res.data.customerInfo.occupation);
        // console.log("aaaaaaaaaa" + res.data.userId);
        console.log("ログイン成功");
      })
      .catch((err) => {
        console.error("登録エラー:", err);
        window.location.href = "http://localhost:3000/admin_login";
      });
  }, [customerId]);
  const handleDeleteDeal = (value) => {
    setDeleteDealReason(value);
  };
  const handleDeleteDealApi = () => {
    if (deleteDealReason) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const transaction_id = selectedTransactionId;
      const delete_note = deleteDealReason;
      axios
        .post(
          "/deleteTransaction",
          JSON.stringify({
            transaction_id,
            delete_note,
          }),
          config
        )
        .then((res) => {
          console.log(res);
          // console.log("aaaaaaaaaa" + res.data.userId);
          console.log("ログイン成功");
          axios
            .post(
              "/customerDetail",
              JSON.stringify({
                customerId,
              }),
              config
            )
            .then((res) => {
              console.log(res);
              setCustomerData(res.data);

              // console.log("aaaaaaaaaa" + res.data.userId);
              console.log("ログイン成功");
            })
            .catch((err) => {
              console.error("登録エラー:", err);
              window.location.href = "http://localhost:3000/admin_login";
            });
          setDeleteModalIsOpen(false);
        })
        .catch((err) => {
          console.error("登録エラー:", err);
          window.location.href = "http://localhost:3000/admin_login";
        });
    }
  };

  const handleLastNameChange = (value) => {
    setLastName(value);
  };
  const handleFirstNameChange = (value) => {
    setFirstName(value);
  };
  const handleKanaLastNameChange = (value) => {
    setKanaLastName(value);
  };
  const handleKanaFirstNameChange = (value) => {
    setKanaFirstName(value);
  };
  const handleMailChange = (value) => {
    setMail(value);
  };
  const handleBirthdayChange = (value) => {
    setBirthday(value);
  };
  const handlePhoneChange = (value) => {
    setPhone(value);
  };
  const handleZipcodeChange = (value) => {
    setZipcode(value);
  };
  const handleAddressChange = (value) => {
    setAddress(value);
  };
  const handleOccupationChange = (value) => {
    setOccupation(value.target.value);
  };

  if (
    !customerData &&
    !lastName &&
    !firstName &&
    !kanaFirstName &&
    !kanaLastName &&
    !mail &&
    !birthday &&
    !phone &&
    !zipcode &&
    !address &&
    !occupation
  ) {
    return <div>Loading...</div>; // または他のインジケーター
  }
  return (
    <>
      <div>
        <p className={style.loginStaffId}>
          スタッフID 　{staffId}　 ログイン中
        </p>
        <h1 className={style.h1style}>従業員画面</h1>
        <div className={style.staffUi}>
          <Button onClick={handleBack} type="back">
            戻る
          </Button>
          <Button onClick={handleWrittenConcent}>承諾書作成</Button>
        </div>
        <div className={style.addBuyConte}>
          <InputText
            label={"今回の買取金額"}
            onChange={handleBuyPrice}
            type="number"
            value={amount}
          />
          <div className={style.addBuyButton}>
            <Button onClick={handleOpenModal} disabled={!handleDisabled()}>
              取引履歴追加
            </Button>
          </div>
        </div>
        <div className={style.customerDetailWrap}>
          <h2 className={style.h2Style}>顧客詳細</h2>
          <div className={style.transactionInfoWrap}>
            <p>買取回数　{customerData.customerStats.totalTransactions}回</p>
            <p>
              合計買取金額　
              {Number(customerData.customerStats.totalAmount).toLocaleString()}
              円
            </p>
          </div>
          <div className={style.editButton}>
            <Button onClick={handleUpdateCustomerInfoModal}>
              顧客情報編集
            </Button>
          </div>
          <table className={style.customerDetailTable}>
            <tr>
              <th>会員番号</th>
              <td>{customerData.customerInfo.customer_id}</td>
            </tr>
            <tr>
              <th>氏名</th>
              <td>
                {lastName}　{firstName}
              </td>
            </tr>
            <tr>
              <th>氏名(カナ)</th>
              <td>
                {kanaLastName}　{kanaFirstName}
              </td>
            </tr>
            <tr>
              <th>メールアドレス</th>
              <td>{mail}</td>
            </tr>
            <tr>
              <th>生年月日</th>
              <td>{birthday}</td>
            </tr>
            <tr>
              <th>職業</th>
              <td>{occupation}</td>
            </tr>
            <tr>
              <th>電話番号</th>
              <td>{phone}</td>
            </tr>
            <tr>
              <th>郵便番号</th>
              <td>{zipcode}</td>
            </tr>
            <tr>
              <th>住所</th>
              <td>{address}</td>
            </tr>
          </table>

          <div>
            {customerData.transactionData !== "取引情報なし" ? (
              <table className={style.customerTransactionTable}>
                <tr>
                  <th>買取日付</th>
                  <th>買取金額</th>
                  <th>担当スタッフID</th>
                  <th>操作</th>
                </tr>
                {customerData.transactionData.map((key) => (
                  <tr key={key.id}>
                    {" "}
                    {/* keyの値は一意でなければなりません */}
                    <td className={style.transactionTableDate}>
                      {key.formatted_transaction_date}
                    </td>
                    <td className={style.transactionTablePrice}>
                      {Number(key.amount).toLocaleString()}円
                    </td>
                    <td className={style.transactionTableId}>{key.staff_id}</td>
                    <td>
                      {/* <p onClick={handleDeleteModalIsOpen}>削除</p> */}
                      <button
                        onClick={() => {
                          setSelectedTransactionId(key.transaction_id);
                          handleDeleteModalIsOpen();
                        }}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </table>
            ) : (
              <p className={style.noneTransaction}>買取情報がありません。</p>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={editModalIsOpen}>
        <h2 className={style.h2StylePriceAdd}>買取金額追加</h2>
        <p className={style.addPriceP}>{Number(amount).toLocaleString()}円</p>
        <div className={style.staffUi}>
          <Button type="back" onClick={handleCloseModal}>
            取り消し
          </Button>
          <Button type="next" onClick={handleAddBuyPrice}>
            お取引追加
          </Button>
        </div>
      </Modal>
      <Modal isOpen={updateModalIsOpen}>
        <h2 className={style.h2Style}>顧客情報更新</h2>
        {/* 更新に必要なフォームやボタンをここに配置 */}
        {/* <Button onClick={handleCloseUpdateModal}>閉じる</Button> */}
        <table className={style.customerDetailTable}>
          <tr>
            <th>会員番号</th>
            <td>{customerData.customerInfo.customer_id}</td>
          </tr>
          <tr>
            <th>氏名</th>
            <td>
              <InputText
                value={lastName}
                onChange={handleLastNameChange}
                label="姓"
              />
              {lastNameError && <p>{lastNameError}</p>}
              {"　"}
              <InputText
                value={firstName}
                onChange={handleFirstNameChange}
                label="名"
              />
              {firstNameError && <p>{firstNameError}</p>}
            </td>
          </tr>
          <tr>
            <th>氏名(カナ)</th>
            <td>
              <InputText
                value={kanaLastName}
                onChange={handleKanaLastNameChange}
                label="セイ"
              />
              {kanaLastNameError && <p>{kanaLastNameError}</p>}
              {"　"}
              <InputText
                value={kanaFirstName}
                onChange={handleKanaFirstNameChange}
                label="メイ"
              />
              {kanaFirstNameError && <p>{kanaFirstNameError}</p>}
            </td>
          </tr>
          <tr>
            <th>メールアドレス</th>
            <td>
              <InputText value={mail} onChange={handleMailChange} />
            </td>
            {mailError && <p>{mailError}</p>}
          </tr>
          <tr>
            <th>生年月日</th>
            <td>
              <InputText
                type="date"
                value={birthday}
                onChange={handleBirthdayChange}
              />
            </td>
            {birthdayError && <p>{birthdayError}</p>}
          </tr>
          <tr>
            <th>電話番号</th>
            <td>
              <InputText
                type="number"
                value={phone}
                onChange={handlePhoneChange}
              />
            </td>
            {phoneError && <p>{phoneError}</p>}
          </tr>
          <tr>
            <th>郵便番号</th>
            <td>
              <InputText
                type="number"
                value={zipcode}
                onChange={handleZipcodeChange}
              />
            </td>
            {zipcodeError && <p>{zipcodeError}</p>}
          </tr>
          <tr>
            <th>住所</th>
            <td>
              <InputText
                type="text"
                value={address}
                onChange={handleAddressChange}
              />
            </td>
            {addressError && <p>{addressError}</p>}
          </tr>
          <tr>
            <th>職業</th>
            <td>
              {/* <InputText value={customerData.customerInfo.occupation} /> */}
              <select
                id="occupation"
                value={occupation}
                onChange={handleOccupationChange}
              >
                {/* <option value="">選択してください</option> */}
                {occupations.map((job, index) => (
                  <option key={index} value={job}>
                    {job}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </table>
        <div className={style.staffUi}>
          <Button onClick={handleBackUpdate} type="back">
            キャンセル
          </Button>
          <Button onClick={handleUpdateCustomerInfo}>更新する</Button>
        </div>
      </Modal>
      <Modal isOpen={deleteModalIsOpen}>
        <h2 className={style.h2StylePriceAdd}>取引履歴削除</h2>
        <div className={style.deleteWrap}>
          <InputText
            onChange={handleDeleteDeal}
            label="削除理由(必須)"
            placeholder="例)間違って登録したため"
          />
        </div>
        <div className={style.staffUi}>
          <Button type="back" onClick={handleDeleteModalIsClose}>
            取り消し
          </Button>
          <Button type="delete" onClick={handleDeleteDealApi}>
            削除
          </Button>
        </div>
      </Modal>
    </>
  );
};
export default AdminCustomerDetail;
