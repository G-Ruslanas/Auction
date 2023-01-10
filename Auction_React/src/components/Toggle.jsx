import { useState } from "react";
import "../pages/css/Toggle.css";

export const Toggle = ({ label, toggled, onClick }) => {
  const [isToggled, toggle] = useState(toggled);

  const callback = () => {
    toggle(!isToggled);
    onClick(!isToggled);
  };

  return (
    <label className="toggleLabel">
      <input
        type="checkbox"
        className="toggleInput"
        defaultChecked={isToggled}
        onClick={callback}
      />
      <span className="toggleSpan" />
      <strong className="toggleStrong">{label}</strong>
    </label>
  );
};
