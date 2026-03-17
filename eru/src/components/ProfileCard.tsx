import { useEffect, useState } from "react";
import { getProfileInfo } from "../api/profileApi";
import "./ProfileCard.css";

interface profileCardProps {
    name?: string,
    age?: number,
    gender?: string,
    id?: string,
    like?: number,
    avatarUrl?: string,
}

// const profileDefault

const ProfileCard = () => {
    const [profileData, setProfileData] = useState<profileCardProps>({
      name: "未知",
      age: 0,
      gender: "未知",
      id: "未知",
      like: 0,
      avatarUrl: "/default.png",
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response: profileCardProps = await getProfileInfo();
                setProfileData({ ...profileData, ...response, avatarUrl: response.avatarUrl || "/default.png" });
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div className="page-card profile-card">
            <img 
                src={ profileData?.avatarUrl }
                alt="Profile"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
            <div className="name-like">
                <div>
                    <strong>{profileData?.name}</strong>
                    <span className="profile-id">ID: {profileData?.id}</span>
                </div>
                <span className="like">{profileData?.like}</span>
            </div>
            <div className="age-gender">      
                <p>age:{profileData?.age}</p>
                <p>gender:{profileData?.gender}</p>
            </div>
        </div>
    )
}
export default ProfileCard;