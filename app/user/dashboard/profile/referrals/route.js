"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, Users } from "lucide-react";

const ReferralList = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem("user"));
        const response = await fetch("/api/user/wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        setReferrals(result.referrals || []);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-lg">
      <div className="mb-6 text-xl font-semibold text-center flex items-center justify-center gap-2">
        <Users className="w-6 h-6 text-blue-400" />
        <span>Your Referrals</span>
      </div>

      {loading && (
        <div className="text-center text-gray-400">Loading referrals...</div>
      )}

      {!loading && referrals.length === 0 && (
        <div className="text-center text-gray-500 italic">
          No referrals found.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {referrals.map((referral, index) => (
          <div
            key={index}
            className="relative bg-gray-900 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-2 right-2 text-xs text-gray-500">
              #{index + 1}
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-semibold text-white">
                {referral.name}
              </h3>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{referral.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <Phone className="w-4 h-4 text-green-400" />
                <span>{referral.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferralList;
