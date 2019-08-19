"use babel";

const js = `import React from "react";
import s from "./style.module.css";

const $NAME = () => {
  const text = "$NAME";
  
  return (
    <div className={s.wrap}>
      <h2>{text}</h2>
    </div>
  );
}

export default $NAME;
`;

const css = `.wrap {

}
`;

export default { js, css };
