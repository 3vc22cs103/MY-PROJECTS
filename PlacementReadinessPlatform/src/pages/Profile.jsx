import React from 'react';

const Profile = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-primary text-3xl font-bold">
                        ST
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Student Name</h2>
                        <p className="text-gray-500">student@example.com</p>
                        <button className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
