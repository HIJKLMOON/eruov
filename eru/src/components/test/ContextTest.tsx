import ContextSubTest from "./ContextSubTest";
import ThemeContextProvider from "../../contexts/ThemeContextProvider";

const ContextTest = () => {
  return (
    <ThemeContextProvider>
      <ContextSubTest />
    </ThemeContextProvider>
  );
};

export default ContextTest;
