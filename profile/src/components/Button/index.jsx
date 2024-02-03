import React from "react";
import styles from "./style.module.scss";

const Button = (props) => {
  let buttonStyle = styles.button;

  switch (props.type) {
    case "next":
      buttonStyle += ` ${styles.next}`;
      break;
    case "back":
      buttonStyle += ` ${styles.back}`;
      break;
    case "delete":
      buttonStyle += ` ${styles.delete}`;
      break;
    case "register":
      buttonStyle += ` ${styles.register}`;
      break;
    case "registerBack":
      buttonStyle += ` ${styles.registerBack}`;
      break;

    default:
      buttonStyle += ` ${styles.next}`;
      break;
  }

  return (
    <button
      className={buttonStyle}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
