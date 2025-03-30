"use client";
import { useState, useEffect } from "react";
import { Copy, X, CheckCircle, Gift } from "lucide-react";
import Image from "next/image";
import RefferalImg from "@/app/assets/referral.png"

const ReferralPopup = ({ isOpen, onClose }) => {
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setReferralCode(userData.referralCode || "N/A");
        } else {
            setReferralCode("N/A");
        }
      setTimeout(() => {
        // setReferralCode("FRIEND100");
        setLoading(false);
      }, 800);
    }
    
    setCopied(false);
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto my-auto overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-3 -my-2 -mx-2 right-3 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>
        
        <div className="bg-gray-50 p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Refer and get free bonus</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Invite and get ₹100*</p>
          </div>
          <div className="flex-shrink-0">
            <Gift size={32} className="text-blue-500" />
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-700 mb-2 text-sm sm:text-base">Share your referral code with friends:</p>
            
            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  readOnly
                  value={loading ? "Loading..." : referralCode}
                  className="w-full border border-gray-300 py-2 sm:py-3 px-3 sm:px-4 rounded-l-md bg-gray-50 focus:outline-none font-medium text-base sm:text-lg"
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <button
                onClick={copyToClipboard}
                disabled={loading}
                className={`flex items-center justify-center h-10 sm:h-12 px-3 sm:px-4 rounded-r-md transition-colors ${
                  copied 
                    ? "bg-green-100 text-green-600 border border-green-200" 
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>
            
            {copied && (
              <p className="text-green-600 text-xs sm:text-sm mt-2 flex items-center">
                <CheckCircle size={14} className="mr-1" />
                Copied to clipboard!
              </p>
            )}
          </div>
          
          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">How it works:</h4>
            <ol className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2 pl-5 list-decimal">
              <li>Share your unique code with friends</li>
              <li>They get ₹100 off their first service</li>
              <li>You get ₹100 in your wallet when they complete their first booking</li>
            </ol>
            <p className="text-xs text-gray-500 mt-2 sm:mt-3">*Terms and conditions apply</p>
          </div>
          
          <div className="mt-4 sm:mt-6 flex justify-center">
            <Image
              src={RefferalImg}
              alt="Gifts illustration"
              className="object-contain opacity-80 max-h-32 sm:max-h-40 w-auto"
              width={440} 
              height={160}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated ReferralButton with tooltip message
const ReferralButton = () => {
  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Hide tooltip after user clicks or after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000); // Hide after 10 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClick = () => {
    setShowReferralPopup(true);
    setShowTooltip(false); // Hide tooltip after click
  };
  
  return (
    <>
      <div className="fixed bottom-16 sm:bottom-20 my-4 right-4 sm:right-6 z-30 flex flex-col items-end space-y-2">
        {/* Tooltip */}
        {showTooltip && (
          <div className="bg-white text-gray-800 p-2 rounded-lg shadow-md max-w-xs animate-bounce-gentle relative">
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-medium">Refer friends & earn rewards!</span>
              <button 
                onClick={() => setShowTooltip(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        
        {/* Button */}
        <button
          onClick={handleClick}
          className="bg-blue-600 text-white rounded-full p-3 sm:p-3 shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Gift size={20} className="sm:hidden" />
          <Gift size={24} className="hidden sm:block" />
        </button>
      </div>
      
      <ReferralPopup 
        isOpen={showReferralPopup} 
        onClose={() => setShowReferralPopup(false)} 
      />
    </>
  );
};

export { ReferralPopup, ReferralButton };