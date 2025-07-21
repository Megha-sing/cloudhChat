import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    profilePic: "",
  });

  // Prefill data when authUser is loaded
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        profilePic: authUser.profilePic || "",
      });
      setSelectedImg(authUser.profilePic || null);
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setFormData((prev) => ({
        ...prev,
        profilePic: base64Image,
      }));
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleDeleteProfilePic = () => {
  setSelectedImg(null); 
  setFormData((prev) => ({
    ...prev,
    profilePic: "",
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({
      fullName: formData.fullName ,
      email: formData.email ,
      profilePic: formData.profilePic,
    });
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <form onSubmit={handleSubmit} className="bg-base-200 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4 text-sm font-medium text-gray-900">
            <div className="relative">
              {selectedImg ? (
                <img
                  src={selectedImg}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
              ) : (
                <div className="size-32 rounded-full border-4 bg-pink-600 flex items-center justify-center text-4xl text-white font-semibold">
                  {authUser?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-white border border-pink-600 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-pink-600" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
   
            </div>

            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
{selectedImg && (
  <button
    type="button"
    onClick={handleDeleteProfilePic}
    className="btn btn-soft btn-secondary mt-2"
  >
    Delete Profile Picture
  </button>
)}




          </div>

          {/* Editable Fields */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Fullname
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="btn btn-secondary w-full"
            >
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Account Info */}
          <div className="mt-6 bg-base-200 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
