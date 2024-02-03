import style from "./style.module.scss";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Button";
const AdminWrittenConsent = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [staffId, setStaffId] = useState("");
  const [currentYear, setCurrentYear] = useState();
  const [currentMonth, setCurrentMonth] = useState();
  const [currentDay, setCurrentDay] = useState();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [age, setAge] = useState("");
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

  const navigate = useNavigate();
  //   const currentDate = new Date().toLocaleString("en-US", {
  //     timeZone: "Asia/Tokyo",
  //   });
  const handlePrint = () => {
    window.print();
  };
  const handleBack = () => {
    navigate(`../admin_customer_detail/${customerId}`);
  };
  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

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

        let birthDate = new Date(res.data.customerInfo.formatted_birthday);
        console.log(birthDate);

        // 現在の日付を取得し、日本のタイムゾーンに変換
        let currentDate = new Date();
        currentDate = new Date(
          currentDate.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
        );

        // 年齢計算
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        let m = currentDate.getMonth() - birthDate.getMonth();
        setCurrentYear(currentDate.getFullYear());
        setCurrentMonth(currentDate.getMonth() + 1);
        setCurrentDay(currentDate.getDate());
        if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
          age--;
        }

        setAge(age);
        setYear(birthDate.getFullYear());
        setMonth(birthDate.getMonth() + 1);
        setDay(birthDate.getDate());
      })
      .catch((err) => {
        console.error("登録エラー:", err);
        window.location.href = "http://localhost:3000/admin_login";
      });
  }, [customerId]);

  //   useEffect(() => {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };
  //     // JSON形式でデータを送信
  //     axios
  //       .post(
  //         "/customerDetail",
  //         JSON.stringify({
  //           customerId,
  //         }),
  //         config
  //       )
  //       .then((res) => {
  //         console.log(res);
  //         setCustomerData(res.data);
  //         // console.log("aaaaaaaaaa" + res.data.userId);
  //         let date = new Date(res.data.customerInfo.formatted_birthday);

  //         // let date_aray = date.split("-");
  //         // const date = new Date();
  //         console.log(date);
  //         console.log(currentDate);
  //         // 年齢計算
  //         var age = currentDate.getFullYear() - date.getFullYear();
  //         var m = currentDate.getMonth() - date.getMonth();

  //         // 今年の誕生日がまだ来ていない場合、年齢から1を引く
  //         if (m < 0 || (m === 0 && currentDate.getDate() < date.getDate())) {
  //           age--;
  //         }
  //         setAge(age);

  //         // if (date_aray[0].charAt(0) == 0) {
  //         //   //二文字目挿入
  //         //   setYear(date_aray[0].charAt(1));
  //         // } else {
  //         setYear(date.getFullYear());
  //         console.log(year);
  //         setMonth(String(date.getMonth() + 1).padStart(2, "0"));
  //         setDay(String(date.getDate()).padStart(2, "0"));
  //         setMonth(String(parseInt(String(date.getMonth() + 1), 10)));
  //         setDay(String(parseInt(String(date.getDate()), 10)));

  //         // }

  //         console.log("ログイン成功");
  //       })
  //       .catch((err) => {
  //         console.error("登録エラー:", err);
  //       });
  //   }, [customerId]);
  useEffect(() => {
    console.log(year);
  }, [year]);

  if (!customerData) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className={style.noPrint}>
        <div className={style.staffUi}>
          <Button onClick={handleBack} type="back">
            戻る
          </Button>
          <Button onClick={handlePrint}>印刷</Button>
        </div>
      </div>
      <div className={style.writtenConsentWrap}>
        <div className={style.print_table}>
          <h1 className={style.consentTitle}>買　取　承　諾　書</h1>
          <h2 className={style.consentH2}>[身分証明書について]</h2>
          <ul className={style.consentUl}>
            <li>
              ・18歳以上の方は運転免許証、保険証、パスポート等の身分証をお持ちください。
            </li>
            <li>
              ・18歳未満の方(高校生を含む)は保護者記入欄の記入、認印が必要です。
              <br />
              それに加えて本人であることが確認できる身分証明書をお持ちください。
              <br />
              また、買取時に保護者様へ電話をさせていただきますのでご了承ください。
            </li>
            <li>
              ・小学生以下の方は保護者の同伴がない限り、買取をお受けできません。
              <br />
              またその際保護者の身分証明書が必要となりますのでお持ちください。
            </li>
          </ul>
          <div className={style.buyConsent}>
            <h2 className={style.consentH2}>[買取について]</h2>
            <p className={style.consentP}>※必ずお読みください。</p>
          </div>
          <ul className={style.consentUl}>
            <li>
              トレカについては可能な限りスリーブからはずしてお持ちください。
            </li>
            <li>買取には本人確認書類のコピーが必要です。</li>
            <li>一度お売りになった商品の返品は一切できません。</li>
            <li>査定を依頼されたご本人様以外にはお受けできません。</li>
            <li>
              当店の作成している(ガチャ・自販機・くじなど)から抽出された商品は買取査定に含まれないようお願いします。
            </li>
          </ul>
          <div className={style.consentCheckWrap}>
            <div className={style.square}></div>
            <p>上記の注意事項を全て確認し同意します。</p>
          </div>
          {/* <p className={style.consentP}>
          [買取承諾書]買取ご希望のご来店者様直筆でご記入お願い致します。
        </p> */}
          <div className={style.customerConsentTableTitle}>
            <p>
              ※上記事項をお読みにの上、ご同意いただけた場合にのみ必要事項をご記入ください
            </p>
            <p>
              買取日　{currentYear}年{currentMonth}月{currentDay}日
            </p>
          </div>
          <table className={style.customerConsentTable}>
            <tr>
              <th rowspan="6" className={style.customerConsentTitle}>
                お客様ご記入欄
              </th>
              <th className={style.customerConsentFurigana}>フリガナ</th>
              <td className={style.customerFontsize}>
                {customerData.customerInfo.furigana_last_name}　
                {customerData.customerInfo.furigana_first_name}
              </td>
            </tr>
            <tr>
              <th className={style.customerConsentName}>お名前</th>
              <td className={style.customerFontsizeName}>
                {" 　"}
                {customerData.customerInfo.last_name}　
                {customerData.customerInfo.first_name}
              </td>
            </tr>
            <tr>
              <th className={style.customerConsentAddress}>住所</th>
              <td className={style.overflow_hidden}>
                〒　{customerData.customerInfo.postal_code}
                <br />
                <div className={style.customerAddressWrap}>
                  {customerData.customerInfo.address}
                </div>
              </td>
            </tr>
            <tr>
              <th className={style.customerConsentPhone}>電話番号</th>
              <td className={style.customerFontsize}>
                {customerData.customerInfo.phone_number}
              </td>
            </tr>
            <tr>
              <th className={style.customerConsentBirth}>生年月日</th>
              <td className={style.customerFontsize}>
                <span className={style.customerConsentSeireki}>西暦</span>
                {year}
                <span className={style.customerConsentYear}>年</span>
                {month}
                <span className={style.customerConsentYear}>月</span>
                {day}
                <span className={style.customerConsentYear}>日</span>
                <span>　</span>
                {age}
                <span className={style.customerConsentAge}>歳</span>
              </td>
            </tr>
            <tr>
              <th>職業</th>

              <td className={style.jobCheckWrap}>
                <div className={style.square}>
                  {customerData.customerInfo.occupation == "会社員" ? (
                    <div className={style.checkItem}></div>
                  ) : (
                    <></>
                  )}
                </div>
                会社員　
                <div className={style.square}>
                  {customerData.customerInfo.occupation == "公務員" ? (
                    <div className={style.checkItem}></div>
                  ) : (
                    <></>
                  )}
                </div>
                公務員　
                <div className={style.square}>
                  {customerData.customerInfo.occupation == "自営業" ? (
                    <div className={style.checkItem}></div>
                  ) : (
                    <></>
                  )}
                </div>
                自営業　
                <div className={style.square}>
                  {customerData.customerInfo.occupation == "主婦" ? (
                    <div className={style.checkItem}></div>
                  ) : (
                    <></>
                  )}
                </div>
                主婦　
                <div className={style.square}>
                  {customerData.customerInfo.occupation == "学生" ? (
                    <div className={style.checkItem}></div>
                  ) : (
                    <></>
                  )}
                </div>
                学生　
                <div className={style.square}>
                  {customerData.customerInfo.occupation == "その他" ? (
                    <div className={style.checkItem}></div>
                  ) : (
                    <></>
                  )}
                </div>
                {"その他("}　
              </td>
            </tr>
          </table>
          <p className={style.consentP}>
            [保護者様同意書]保護者様直筆でご記入と同意欄にチェックをお願いします。
          </p>
          <ul className={style.consentUl}>
            <li>上記の者が商品の買取申込・売却することに同意します。</li>
            <li>保護者同意書に記載がある本人が直筆で記入しました。</li>
          </ul>
          <div className={style.consentCheckWrap}>
            <div className={style.square}></div>
            <p>保護者同意欄に記載されている内容で間違いありません。</p>
          </div>
          <table className={style.customerConsentTable}>
            <tr>
              <th rowspan="2" className={style.customerGuardianTitle}>
                保護者
                <br />
                記入欄
              </th>
              <th className={style.customerGuardianName}>保護者名</th>
              <td className={style.customerGuardianNameTd}>
                <span className={style.customerGuardianNameIn}>印</span>
              </td>
              <th className={style.customerGuardianAge}>年齢</th>
              <td className={style.customerGuardianAgeTd}></td>
              <th className={style.customerGuardianRelationship}>続柄</th>
              <td className={style.customerGuardianRelationshipTd}></td>
            </tr>
            <tr>
              <th>保護者連絡先</th>
              <td className={style.guardianContact}>
                <span className={style.guardianTel}>TEL</span>
              </td>
            </tr>
          </table>
          <table
            className={`${style.customerConsentTable} ${style.staffTable}`}
          >
            <tr>
              <th rowspan="2" className={style.customerConsentTitleNeo}>
                従業員記入欄
              </th>
              <th className={style.documentTitle}>確認書類</th>
              <td className={style.documentCheckWrap}>
                <div className={style.square}></div>運転免許証　
                <div className={style.square}></div>
                住民基本台帳カード(写真付き)　
                <div className={style.square}></div>保険証(社・国)　
                <div className={style.square}></div>パスポート　
                <div className={style.square}></div>外国人登録証　
                <div className={style.square}></div>写真付き学生証　
                <div className={style.square}></div>その他　
              </td>
            </tr>
            <tr className={style.trheght}>
              <th>証明書No</th>
              <td></td>
            </tr>
          </table>
          <p className={style.consentP}>[買取同意書]</p>
          <ul className={style.consentUl}>
            <li>上記事項に同意の上、金額を確かに徴収しました。</li>
            <li>買取商品の返却請求書は全て放棄します。</li>
            <li>買取商品の所有権は全て放棄します。</li>
          </ul>
          <table className={style.signTable}>
            <tr>
              <th>御署名</th>
              <td></td>
            </tr>
            <tr>
              <td colspan="2">
                <span>承諾書に関する個人情報の取り扱いについて</span>
                <br />
                当店ではお客様の個人情報を適切に保存する為に、次の方針でお取り扱いさせていただきます。
                <br />
                本承諾書は法令に基づいてお客様にご記入いただくものであり、ここに記入された内容をそれ以外の目的で使用することはありません。
                <br />
                ご記入いただいた個人情報は、厳正な管理の下で安全に備蓄、保管します。
                <br />
                ご記入いただいた個人情報は、法令に基づいて個人情報の提供を求められた場合を除き、第三者に提供する事はありません。
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};
export default AdminWrittenConsent;
