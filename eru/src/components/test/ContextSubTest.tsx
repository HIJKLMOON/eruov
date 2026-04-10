import { useContext } from "react";
import ThemeContext from "../../contexts/ThemeContext";

const ContextSubTest = () => {
  const theme = useContext(ThemeContext);
  return (
    <div>
      <h2>Context Sub Test</h2>
      <p>{theme.theme}</p>
      <button onClick={theme.toggleTheme}>CHANGE</button>
    </div>
  );
};

export default ContextSubTest;
