import request from "../request";

interface registerValue {
  phone: string;
  password: string;
  confirm_password: string;
  valid: string;
  adult_status: boolean;
  gender: string;
  hobby: string[];
}

const postRegisterValue = async (props: registerValue): Promise<registerValue> => {
  return await request.post("api/register", props);
};

export { type registerValue, postRegisterValue };
