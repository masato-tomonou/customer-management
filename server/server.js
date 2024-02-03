// server.js

import express from "express";
import jwt from "jsonwebtoken";
import mysql from "mysql2";
import passport from "passport";
import LocalStrategy from "passport-local";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
);
console.log(process.env.DB_HOST);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const connectionConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: "Asia/Tokyo",
};

const connection = mysql.createConnection(connectionConfig);
connection.connect((error) => {
  if (error) {
    console.error("Error connecting: " + error.stack);
    return;
  }
  console.log("Database OK!");
});

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("No token provided");
  }
  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) {
      console.error(err.message);
      return next(err.message);
    }
    req.decoded = decoded;
    next();
  });
};

app.get("/authtoken", auth, (req, res) => {
  if (req.decoded && req.decoded.staff_id) {
    res.json({
      staff_id: req.decoded.staff_id,
    });
  } else {
    res.status(500).send("Token decoding failed");
  }
});

app.post("/addTransaction", auth, (req, res, next) => {
  try {
    const { customerId, staffId, amount } = req.body;

    // 現在の日付を取得し、年-月-日形式にフォーマット
    const currentDate = new Date().toISOString().split("T")[0];

    // トランザクションデータを追加するクエリ
    const addTransactionQuery = `
      INSERT INTO transactions (customer_id, staff_id, transaction_date, amount)
      VALUES (?, ?, ?, ?)
    `;

    connection.query(
      addTransactionQuery,
      [customerId, staffId, currentDate, amount],
      (error, results) => {
        if (error) {
          console.error("データベースのクエリエラー: " + error.stack);
          return res.status(500).send("データベースエラー");
        }

        // トランザクションデータを追加した後、来店回数と合計金額を取得するクエリ
        const getTransactionInfoQuery = `
          SELECT COUNT(*) AS totalTransactions, SUM(amount) AS totalAmount
          FROM transactions
          WHERE customer_id = ?
        `;

        connection.query(
          getTransactionInfoQuery,
          [customerId],
          (queryError, queryResults) => {
            if (queryError) {
              console.error("データベースのクエリエラー: " + queryError.stack);
              return res.status(500).send("データベースエラー");
            }

            const responseData = {
              message: "トランザクションが追加され、データが取得されました。",
              totalTransactions: queryResults[0]
                ? queryResults[0].totalTransactions
                : 0,
              totalAmount: queryResults[0] ? queryResults[0].totalAmount : 0,
            };

            res.status(201).json(responseData);
          }
        );
      }
    );
  } catch (error) {
    console.error("/addTransaction エンドポイントでエラー: " + error.stack);
    res.status(500).send("内部サーバーエラー");
  }
});

app.use(passport.initialize());
passport.use(
  new LocalStrategy(
    {
      usernameField: "staff_id",
      passwordField: "password",
    },
    function (staff_id, password, done) {
      const values = [staff_id, password]; // Fix: Corrected variable names
      connection.query(
        "SELECT * FROM staff WHERE staff_id = ? AND password = ?",
        values,
        (error, results) => {
          console.log(results);
          console.log("aaa");
          if (error) {
            console.log("Error connecting: " + error.stack);
            return done(error);
          }
          const count = results.length;
          if (count === 0) {
            return done(null, false);
          } else {
            const user = { staff_id: results[0].staff_id };
            console.log(user);
            return done(null, user);
          }
        }
      );
    }
  )
);

app.post("/login", (req, res, next) => {
  console.log("Received login request with body:", req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send("Invalid credentials"); // Fix: Improved error message
    }

    const token = jwt.sign({ staff_id: user.staff_id }, SECRET_KEY, {
      expiresIn: "5h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).send({ staff_id: user.staff_id });
  })(req, res, next);
});

app.post("/updateCustomer", auth, (req, res, next) => {
  const {
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
  } = req.body;

  const updateQuery =
    "UPDATE customers SET last_name = ?, first_name = ?, furigana_last_name = ?, furigana_first_name = ?, birthday = ?, phone_number = ?, email = ?, postal_code = ?, address = ?, occupation = ? WHERE customer_id = ?";
  connection.query(
    updateQuery,
    [
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
      customer_id,
    ],
    (updateError, updateResults) => {
      if (updateError) {
        console.error("Error updating database: " + updateError.stack);
        return res.status(500).send("Database error");
      }

      return res.status(200).json({
        message: "User updated successfully",
      });
    }
  );
});

app.post("/register", (req, res, next) => {
  const {
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
  } = req.body;

  // 既存のユーザーを確認するクエリ
  const checkUserQuery =
    "SELECT customer_id FROM customers WHERE email = ? OR phone_number = ?";
  connection.query(checkUserQuery, [email, phoneNumber], (error, results) => {
    if (error) {
      console.error("Error querying database: " + error.stack);
      return res.status(500).send("Database error");
    }

    if (results.length > 0) {
      // 既にユーザーが存在する場合
      //   const customerId = results[0].customer_id;
      return res.status(409).json({
        existingUserData: req.body,
        message:
          "その電話番号もしくはメールアドレスはすでに登録されております。",
      });
    } else {
      // ユーザーが存在しない場合にのみ新規登録を行う
      const insertQuery =
        "INSERT INTO customers (last_name, first_name, furigana_last_name, furigana_first_name, birthday, phone_number, email, postal_code, address, occupation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      connection.query(
        insertQuery,
        [
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
        ],
        (insertError, insertResults) => {
          if (insertError) {
            console.error(
              "Error inserting into database: " + insertError.stack
            );
            return res.status(500).send("Database error");
          }

          // 登録後に customer_id を取得するクエリ
          const customerIdQuery =
            "SELECT customer_id FROM customers WHERE email = ?";
          connection.query(
            customerIdQuery,
            [email],
            (selectError, selectResults) => {
              if (selectError) {
                console.error("Error querying database: " + selectError.stack);
                return res.status(500).send("Database error");
              }

              if (selectResults.length === 0) {
                return res.status(500).send("Failed to retrieve customer_id");
              }

              const customerId = selectResults[0].customer_id;

              // 登録後に取得した customer_id を返す
              return res.status(201).json({
                customerId: customerId,
                message: "User registered successfully",
              });
            }
          );
        }
      );
    }
  });
});

app.post("/transaction-data", auth, (req, res, next) => {
  try {
    const { customerId } = req.body;

    connection.query(
      "SELECT * FROM transactions WHERE customer_id = ?",
      [customerId],
      (error, results) => {
        if (error) {
          console.error("Error querying database: " + error.stack);
          return res.status(500).send("Database error");
        }

        res.status(200).json(results);
      }
    );
  } catch (error) {
    console.error("Error in /transaction-data endpoint: " + error.stack);
    return res.status(500).send("Internal server error");
  }
});

app.post("/search", auth, (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    connection.query(
      `
      SELECT
        customers.customer_id,
        CONCAT(customers.last_name, ' ', customers.first_name) AS customer_name,
        customers.phone_number,
        IFNULL(MAX(DATE_FORMAT(transactions.transaction_date, '%Y-%m-%d')), '取引データなし') AS latest_transaction_date
      FROM
        customers
      LEFT JOIN
        transactions ON customers.customer_id = transactions.customer_id
      WHERE
        customers.last_name LIKE ? OR
        customers.first_name LIKE ? OR
        customers.furigana_last_name LIKE ? OR
        customers.furigana_first_name LIKE ? OR
        customers.customer_id = ?
      GROUP BY
        customers.customer_id
      `,
      [
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        searchTerm,
      ],
      (error, results) => {
        if (error) {
          console.error("データベースのクエリエラー: " + error.stack);
          return res.status(500).send("データベースエラー");
        }

        res.status(200).json(results);
      }
    );
  } catch (error) {
    console.error("/searchエンドポイントでエラー: " + error.stack);
    return res.status(500).send("内部サーバーエラー");
  }
});

app.post("/customerDetail", auth, (req, res, next) => {
  try {
    const { customerId } = req.body;

    const customerInfoQuery = `
      SELECT
        customer_id,
        last_name,
        first_name,
        furigana_last_name,
        furigana_first_name,
        DATE_FORMAT(birthday, '%Y-%m-%d') AS formatted_birthday,
        phone_number,
        email,
        postal_code,
        address,
        occupation
      FROM
        customers
      WHERE
        customer_id = ?
    `;

    const transactionDataQuery = `
      SELECT
        transaction_id,
        staff_id,
        DATE_FORMAT(transaction_date, '%Y-%m-%d') AS formatted_transaction_date,
        amount,
        delete_flag,
        delete_note
      FROM
        transactions
      WHERE
        customer_id = ?
      ORDER BY
        transaction_date DESC, transaction_id DESC;
    `;

    const customerStatsQuery = `
  SELECT
    COUNT(*) AS totalTransactions,
    SUM(CASE WHEN delete_flag = false OR delete_flag IS NULL THEN amount ELSE 0 END) AS totalAmount
  FROM
    transactions
  WHERE
    customer_id = ? AND (delete_flag = false OR delete_flag IS NULL);
`;

    const customerInfoPromise = new Promise((resolve, reject) => {
      connection.query(customerInfoQuery, [customerId], (error, results) => {
        if (error) {
          reject(error);
          return;
        } else {
          resolve(results[0]);
        }
      });
    });

    const transactionDataPromise = new Promise((resolve, reject) => {
      connection.query(transactionDataQuery, [customerId], (error, results) => {
        if (error) {
          reject(error);
          return;
        } else {
          resolve(results);
        }
      });
    });

    const customerStatsPromise = new Promise((resolve, reject) => {
      connection.query(customerStatsQuery, [customerId], (error, results) => {
        if (error) {
          reject(error);
          return;
        } else {
          resolve(results[0]);
        }
      });
    });

    Promise.all([
      customerInfoPromise,
      transactionDataPromise,
      customerStatsPromise,
    ])
      .then(([customerInfo, transactionData, customerStats]) => {
        transactionData = transactionData.filter(
          (transaction) => !transaction.delete_flag
        );

        // データベースから取得した日付を年月日までにフォーマット
        transactionData.forEach((transaction) => {
          transaction.formatted_transaction_date = new Date(
            transaction.formatted_transaction_date
          )
            .toISOString()
            .split("T")[0];
        });

        // データベースから取得した誕生日を年月日までにフォーマット
        customerInfo.formatted_birthday = new Date(
          customerInfo.formatted_birthday
        )
          .toISOString()
          .split("T")[0];

        const responseData = {
          customerInfo: customerInfo,
          customerStats: customerStats,
          transactionData: transactionData,
        };

        res.status(200).json(responseData);
      })
      .catch((error) => {
        console.error("データベースのクエリエラー: " + error.stack);
        res.status(500).send("データベースエラー");
      });
  } catch (error) {
    console.error("/customerDetail エンドポイントでエラー: " + error.stack);
    res.status(500).send("内部サーバーエラー");
  }
});

app.post("/deleteTransaction", auth, (req, res, next) => {
  try {
    const { transaction_id, delete_note } = req.body;

    // Query to update transaction data using delete_flag and delete_note
    const updateTransactionQuery = `
      UPDATE transactions
      SET delete_flag = true, delete_note = ?
      WHERE transaction_id = ?
    `;

    connection.query(
      updateTransactionQuery,
      [delete_note, transaction_id],
      (error, results) => {
        if (error) {
          console.error("Database query error: " + error.stack);
          return res.status(500).send("Database error");
        }

        // Query to get transaction info after updating
        const getTransactionInfoQuery = `
          SELECT
              COUNT(*) AS totalTransactions,
              SUM(CASE WHEN delete_flag IS NULL OR delete_flag = false THEN amount ELSE 0 END) AS totalAmount
          FROM transactions
          WHERE customer_id = (
              SELECT customer_id FROM transactions WHERE transaction_id = ?
          );
        `;

        connection.query(
          getTransactionInfoQuery,
          [transaction_id],
          (queryError, queryResults) => {
            if (queryError) {
              console.error("Database query error: " + queryError.stack);
              return res.status(500).send("Database error");
            }

            const responseData = {
              message: "Transaction updated, data refreshed.",
              totalTransactions: queryResults[0]
                ? queryResults[0].totalTransactions
                : 0,
              totalAmount: queryResults[0] ? queryResults[0].totalAmount : 0,
            };

            res.status(200).json(responseData);
          }
        );
      }
    );
  } catch (error) {
    console.error("/deleteTransaction endpoint error: " + error.stack);
    res.status(500).send("Internal server error");
  }
});
// app.post("/deleteTransaction", auth, (req, res, next) => {
//   try {
//     const { transaction_id, delete_note } = req.body;

//     // Query to update transaction data using delete_flag and delete_note
//     const updateTransactionQuery = `
//       UPDATE transactions
//       SET delete_flag = true, delete_note = ?
//       WHERE transaction_id = ?
//     `;

//     connection.query(
//       updateTransactionQuery,
//       [delete_note, transaction_id],
//       (error, results) => {
//         if (error) {
//           console.error("Database query error: " + error.stack);
//           return res.status(500).send("Database error");
//         }

//         const responseData = {
//           message: "Transaction updated.",
//         };

//         res.status(200).json(responseData);
//       }
//     );
//   } catch (error) {
//     console.error("/deleteTransaction endpoint error: " + error.stack);
//     res.status(500).send("えぐい");
//   }
// });

const port = 9000;
app.listen(port, () => {
  console.log(`port ${port} :サーバー起動中`);
});
