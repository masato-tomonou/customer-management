import React from "react";
import style from "./style.module.scss";
// interface Props {
//   value: string;
//   onChange: (value: string) => void;
//   onBlur?: () => void;
//   type?: "text" | "email" | "password" | "number" | "date" | "time";
//   label?: string;
//   placeholder?: string;
// }

const TextInput = (props) => {
  const onChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <div className={style.inputWrap}>
      {/* When there is a label */}
      {props.label ? (
        <label className={style.label}>
          {props.label}
          <input
            className={style.input}
            type={props.type}
            value={props.value}
            placeholder={props.placeholder}
            onChange={onChange}
            onBlur={props.onBlur}
            onKeyDown={props.onKeyDown}
          />
        </label>
      ) : (
        // When there is no label
        <input
          className={style.input}
          type={props.type}
          value={props.value}
          placeholder={props.placeholder}
          onChange={onChange}
          onBlur={props.onBlur}
          onKeyDown={props.onKeyDown}
        />
      )}
    </div>
  );
};

export default TextInput;
