import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { account, storage, databases } from "../services/appwriteConfig";

const Settings = () => {
  const [formData, setFormData] = useState({
    photo: "",
    email: "",
    bio: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await account.get();
        const response = await databases.listDocuments(
          "64773737337f23de254d",
          "647b7649a8bd0a7073be",
          []
        );
        
        const userProfile = response.documents.find(
          (doc) => doc.userId === user.$id
        );
        
        if (userProfile) {
          setDocumentId(userProfile.$id);
          setFormData({
            photo: userProfile.photo || "",
            email: userProfile.email || "",
            bio: userProfile.bio || "",
          });
          if (userProfile.photo) {
            setPreviewUrl(userProfile.photo);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.photo;
      
      if (formData.photo instanceof File) {
        const fileId = uuidv4();
        await storage.createFile(
          "647e6735532e8f214235",
          fileId,
          formData.photo
        );
        imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/647e6735532e8f214235/files/${fileId}/view?project=64676cf547e8830694b8&mode=admin`;
      }

      const user = await account.get();
      const profileData = {
        userId: user.$id,
        photo: imageUrl,
        email: formData.email,
        bio: formData.bio,
      };

      if (documentId) {
        await databases.updateDocument(
          "64773737337f23de254d",
          "647b7649a8bd0a7073be",
          documentId,
          profileData
        );
      } else {
        await databases.createDocument(
          "64773737337f23de254d",
          "647b7649a8bd0a7073be",
          uuidv4(),
          profileData
        );
      }

      navigate("/myprofile");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <button 
            onClick={handleSubmit}
            className="p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                className="w-full min-h-[100px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;