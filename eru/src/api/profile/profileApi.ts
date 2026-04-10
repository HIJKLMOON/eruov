import request from "../request";

export interface ProfileInfo {
  id?: string;
  name: string;
  age: number;
  gender: string;
  avatarUrl?: string;
  like?: number;
  update_time?: string;
  create_time?: string;
  is_delete?: number;
}

const getProfileInfo = async (id: string): Promise<{ data: ProfileInfo }> => {
  if (!id) {
    return Promise.reject(new Error("用户ID不能为空"));
  }

  // const data = 'abcdefg';
  // const encoder = new TextEncoder();
  // const encoded = encoder.encode(data);
  // const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  // const hashArray = new Uint8Array(hashBuffer);
  // const array = Array.from(hashArray);
  // const result = array.map(b => b.toString(16).padStart(2, "0")).join("");
  // console.log(`encoded: ${encoded}\nhashBuffer: ${hashBuffer}\nhashArray: ${hashArray}\narray: ${array}\nresult: ${result}`)

  // hash_crypto('abcdefg').then(console.log)

  return await request.get(`/api/profiles/${id}/info`);
};

const postProfileInfo = (
  id: string,
  name: string,
  age: number,
  gender: string,
): Promise<ProfileInfo> => {
  if (!id) {
    return Promise.reject(new Error("用户ID不能为空"));
  }
  if (!name || name.trim().length === 0) {
    return Promise.reject(new Error("姓名不能为空"));
  }
  if (age < 1 || age > 120) {
    return Promise.reject(new Error("年龄应在1-120之间"));
  }
  const validGenders = ["male", "female", "other"];
  if (!validGenders.includes(gender)) {
    return Promise.reject(new Error("性别参数无效"));
  }

  return request.post(`/api/profiles/${id}/info`, { id, name, age, gender });
};

export { getProfileInfo, postProfileInfo };
