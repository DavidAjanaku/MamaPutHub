import React, { useState, useEffect } from "react";
import { account, databases } from "../../services/appwriteConfig";

const LoadingSkeleton = () => (
  <div className="w-full  mx-auto pt-10 mb-5 bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const ProfileTag = () => {
  const [profileDetails, setProfileDetails] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await account.get();
        setUserDetails(response);
        await filterUserDetailsById(response.$id);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const filterUserDetailsById = async (userId) => {
    try {
      const response = await databases.listDocuments(
        "64773737337f23de254d",
        "647b7649a8bd0a7073be",
        []
      );
      const filteredUsers = response.documents.filter(
        (user) => user.userId === userId
      );
      setProfileDetails(filteredUsers);
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full  mb-5 mx-auto pt-10 space-y-4 ">
      <h1 className="text-2xl font-semibold">Profile</h1>
      
      {userDetails && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-4">
              {profileDetails[0]?.photo && (
                <img
                  src={profileDetails[0].photo}
                  alt={`${userDetails.name}'s profile`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                />
              )}
              
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  {userDetails.name}
                </h4>
                {profileDetails[0]?.bio && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {profileDetails[0].bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {profileDetails[0]?.email && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Email Address</span>
              <span className="font-medium text-gray-900">
                {profileDetails[0].email}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTag;