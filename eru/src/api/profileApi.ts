import request from "./request";
const getProfileInfo = () => {
    const res = request.get("/api/profiles/info");
    return res;
}

export {
    getProfileInfo,
}