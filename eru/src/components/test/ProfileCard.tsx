import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getProfileInfo,
  postProfileInfo,
  type ProfileInfo,
} from "../../api/profile/profileApi";
import Name from "../base/Name";
import styles from "./ProfileCard.module.css";

interface ProfileCardProps extends ProfileInfo {
  onProfileChange?: (profile: ProfileCardProps) => void;
}

const defaultProfile: ProfileCardProps = {
  name: "未知",
  age: 0,
  gender: "未知",
  id: "未知",
  like: 0,
  avatarUrl: "src/assets/default.png",
};

const ProfileCard: React.FC<ProfileCardProps> = (
  props: ProfileCardProps | null,
) => {
  const [profile, setProfile] = useState<ProfileCardProps>(() => ({
    ...defaultProfile,
    ...props,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const [avatarError, setAvatarError] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!nameRef.current || !ageRef.current || !genderRef.current) return;

      const radioGender =
        genderRef.current?.querySelectorAll<HTMLInputElement>(
          "input[type='radio']",
        ) || "other";
      let selectedGender = profile.gender;
      for (const radio of radioGender) {
        if (radio.checked) {
          selectedGender = radio.value;
          break;
        }
      }

      const updatedProfile = {
        ...profile,
        name: nameRef.current?.value || "未知",
        age: Number(ageRef.current?.value) || 0,
        gender: selectedGender,
      };

      try {
        await postProfileInfo(
          profile.id || "",
          updatedProfile.name,
          updatedProfile.age,
          updatedProfile.gender || "unknown",
        );
        setProfile(updatedProfile);
        props?.onProfileChange?.(updatedProfile);
        setIsEditMode(false);
      } catch (err) {
        setError("保存失败，请重试");
        console.error("Failed to save profile:", err);
      }
    },
    [profile, props],
  );

  const handleCancel = useCallback(() => {
    setIsEditMode(false);
    setError(null);
  }, []);

  const handleAvatarError = useCallback(() => {
    setAvatarError(true);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      const response = await getProfileInfo("123456");
      setProfile((prev) => ({
        ...prev,
        ...response.data,
        avatarUrl: response.data.avatarUrl || defaultProfile.avatarUrl,
      }));
      setIsLoading(false);
    };
    fetchProfileData();
  }, []);

  if (isLoading) {
    return (
      <div className={`${styles.profileCard} ${styles.profileCardLoading}`}>
        <div className="loading-spinner" />
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileCard}>
      {error && (
        <div className={styles.profileCard__error} role="alert">
          {error}
          <button onClick={() => setError(null)}>关闭</button>
        </div>
      )}

      {isEditMode ? (
        <Fragment>
          <form onSubmit={handleSubmit} className={styles.profileCard__form}>
            <fieldset>
              <legend>编辑个人资料</legend>

              <div className={styles.inputGroup}>
                <label htmlFor="name-input">名字</label>
                <input
                  type="text"
                  id="name-input"
                  defaultValue={profile.name}
                  ref={nameRef}
                  maxLength={20}
                  placeholder="请输入名字"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="age-input">
                  年龄<span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="number"
                  id="age-input"
                  required
                  min={1}
                  max={120}
                  step={1}
                  defaultValue={profile.age || ""}
                  ref={ageRef}
                  aria-required="true"
                  placeholder="1-120"
                />
              </div>

              <div className={styles.inputGroup} ref={genderRef}>
                <label>
                  性别<span className={styles.requiredMark}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  <input
                    type="radio"
                    id="radio-male"
                    name="gender"
                    value="male"
                    defaultChecked={profile.gender === "male"}
                  />
                  <label htmlFor="radio-male">男</label>
                  <input
                    type="radio"
                    id="radio-female"
                    name="gender"
                    value="female"
                    defaultChecked={profile.gender === "female"}
                  />
                  <label htmlFor="radio-female">女</label>
                  <input
                    type="radio"
                    id="radio-other"
                    name="gender"
                    value="other"
                    defaultChecked={profile.gender === "other"}
                  />
                  <label htmlFor="radio-other">其他</label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.btnPrimary}>
                  保存
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.btnSecondary}
                >
                  取消
                </button>
              </div>
            </fieldset>
          </form>
        </Fragment>
      ) : (
        <Fragment>
          <div className={styles.headChange}>
            <strong>ProfileCard</strong>
            <button onClick={() => setIsEditMode(true)} className={styles.btnEdit}>
              编辑
            </button>
          </div>
          <img
            id="avatar"
            src={avatarError ? defaultProfile.avatarUrl : profile.avatarUrl}
            alt={`${profile.name}的头像`}
            onError={handleAvatarError}
            className={styles.profileCard__avatar}
          />
          <Name
            name={profile.name || "未知"}
            id={profile.id || "未知"}
            like={profile.like || 0}
          />
          <div className={styles.ageGender}>
            <p>年龄: {profile.age || "未知"}</p>
            <p>性别: {profile.gender || "未知"}</p>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ProfileCard;
