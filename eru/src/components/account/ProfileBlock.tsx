interface defaultProfileProps {
  name: string;
  age: number;
  gender: string;
  avatarUrl: string;
}
const defaultProfile: defaultProfileProps = {
  avatarUrl: "src/assets/default.png",
  name: "None",
  gender: "male",
  age: 20,
};
export const ProfileBlock = () => {
  return (
    <div>
      <strong>Profile</strong>
      <img
        id="avatar"
        src={defaultProfile.avatarUrl}
        alt={defaultProfile.name}
      />
      
    </div>
  );
};
