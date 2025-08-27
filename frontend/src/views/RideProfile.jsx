import React from "react";

import { ArrowLeftCircle, Mail, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AccountInfo = () => {
  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Account Info</h2>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 mb-4 bg-gray-200" />
          <h3 className="text-xl font-semibold">Basic Info</h3>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div className="text-sm">
              <p className="text-gray-600">Name</p>
              <p className="font-medium">Iragena Egide</p>
            </div>
            <span className="text-gray-400">&gt;</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-600" />
              <div className="text-sm">
                <p className="text-gray-600">Phone number</p>
                <p className="font-medium">+250798555420</p>
              </div>
            </div>
            <span className="text-gray-400">&gt;</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-green-600" />
              <div className="text-sm">
                <p className="text-gray-600">Email</p>
                <p className="font-medium">iragenaegide205@gmail.com</p>
              </div>
            </div>
            <span className="text-gray-400">&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
