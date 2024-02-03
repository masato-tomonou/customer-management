import style from "./style.module.scss";
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import axios from "axios";

const AdminTop = () => {
  //   const { customerId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInfo, setSearchInfo] = useState(Array);
  const [staffId, setStaffId] = useState("");
  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
  };

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
  const handleSearch = () => {
    axios
      .post(
        "/search",
        JSON.stringify({
          searchTerm,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setSearchInfo(res.data);
        console.log("成功");
      })
      .catch((err) => {
        console.error("ログインエラー:", err);
        window.location.href = "http://localhost:3000/admin_login";
      });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/admin_login";
  };
  return (
    <>
      <div className={style.box}>
        <div className={style.backTop}>
          <Button type="delete" onClick={handleLogout}>
            トップへ戻る
          </Button>
        </div>
        <p className={style.loginStaffId}>
          スタッフID 　{staffId}　 ログイン中
        </p>
        <h1 className={style.h1style}>従業員画面</h1>
        <div>
          <h2 className={style.h2style}>顧客検索</h2>
          <div className={style.searchFormWrap}>
            <InputText
              label="会員番号か氏名を入力"
              type="text"
              placeholder="例)1"
              onChange={handleSearchTermChange}
              // onBlur={handlePhoneValidate}
              value={searchTerm}
            />
            <Button onClick={handleSearch}>検索</Button>
          </div>
          <h3 className={style.adminTopH3}>検索結果</h3>
          <table className={style.adminTopTable}>
            <tr>
              <th className={style.adminTopTh}>会員番号</th>
              <th className={style.adminTopTh}>氏名</th>
              <th className={style.adminTopTh}>電話番号</th>
              <th className={style.adminTopTh}>最終買取日</th>
              <th className={style.adminTopTh}>詳細ページへ</th>
            </tr>
            {searchInfo.length ? (
              searchInfo.map((key) => (
                <tr>
                  <td className={style.adminTopTdId}>{key.customer_id}</td>
                  <td className={style.adminTopTdName}>{key.customer_name}</td>
                  <td className={style.adminTopTdPhone}>{key.phone_number}</td>
                  <td className={style.adminTopTdDate}>
                    {key.latest_transaction_date}
                  </td>
                  <td className={style.adminTopTdLink}>
                    <Link to={`../admin_customer_detail/${key.customer_id}`}>
                      詳細
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <p>顧客情報がありません。</p>
            )}
          </table>
        </div>
      </div>
    </>
  );
};
export default AdminTop;
