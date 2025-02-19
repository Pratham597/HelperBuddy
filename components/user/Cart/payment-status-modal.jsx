"use client";

import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PaymentStatusModal = ({ 
  isOpen, 
  onClose, 
  status, 
  onComplete 
}) => {
  const getContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-500 text-center">Please wait while we confirm your payment...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center p-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-bounce">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-green-500 animate-ping" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Order Successful!</h3>
            <p className="text-gray-500 text-center mb-4">Your order has been confirmed.</p>
            
          </div>
        );
      
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center p-6">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4 animate-shake">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Order Failed</h3>
            <p className="text-gray-500 text-center mb-4">Something went wrong with your Order. Please try again.</p>
            <Button 
              onClick={onClose}
              variant="outline"
              className="border-2 border-red-500 text-red-500 hover:bg-red-50"
            >
              Close
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Order Status</DialogTitle>
        </DialogHeader>
        {getContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentStatusModal;