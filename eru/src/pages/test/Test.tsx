import { Fragment } from "react";
import ReducerTest from "../../components/test/ReducerTest";
import ProfileCard from "../../components/test/ProfileCard";
import RegisterForm from "../../components/test/RegisterForm";
import ContextTest from "../../components/test/ContextTest";

const Test = () => {
  return (
    <Fragment>
      <ReducerTest />
      <ProfileCard />
      <RegisterForm />
      <ContextTest />
    </Fragment>
  );
};

export default Test;
