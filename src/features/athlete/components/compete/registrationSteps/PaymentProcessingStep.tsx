// src/features/athlete/components/compete/registrationSteps/PaymentProcessingStep.tsx
import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { RegistrationFormData } from '../../../../../services/athlete/registration';
import { MeetData } from '../../../../../firebase/database';

interface PaymentProcessingStepProps {
  formData: RegistrationFormData;
  meet: MeetData;
  calculateRegistrationFee: () => number;
  paymentCompleted: boolean;
  setPaymentCompleted: (completed: boolean) => void;
}

export const PaymentProcessingStep: React.FC<PaymentProcessingStepProps> = ({
  formData,
  meet,
  calculateRegistrationFee,
  paymentCompleted,
  setPaymentCompleted,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingZip: '',
  });

  const registrationFee = calculateRegistrationFee();

  const handlePaymentInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value,
    }));
    setPaymentError(null);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validatePaymentForm = (): boolean => {
    if (paymentMethod === 'card') {
      return !!(
        paymentData.cardNumber.replace(/\s/g, '').length >= 13 &&
        paymentData.expiryDate.length === 5 &&
        paymentData.cvv.length >= 3 &&
        paymentData.cardholderName.trim() &&
        paymentData.billingZip.trim()
      );
    }
    return true; // For bank transfer, we'll handle validation differently
  };

  const handlePaymentSubmit = async () => {
    if (!validatePaymentForm()) {
      setPaymentError('Please fill in all required payment fields');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Simulate payment processing with Stripe
      // In real implementation, this would integrate with Stripe Elements
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      setPaymentCompleted(true);
      console.log('Payment processed successfully');
    } catch (error) {
      setPaymentError('Payment processing failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentCompleted) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
          <h3 className="text-xl font-semibold text-white mb-2">Payment Successful!</h3>
          <p className="text-slate-400">Your registration fee has been processed</p>
        </div>

        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
          <div className="text-center">
            <h4 className="font-semibold text-green-300 mb-2">Payment Confirmation</h4>
            <div className="space-y-2 text-sm text-green-200">
              <div>Amount Paid: <span className="font-medium">${registrationFee}</span></div>
              <div>Payment Method: <span className="font-medium">****{paymentData.cardNumber.slice(-4)}</span></div>
              <div>Transaction ID: <span className="font-medium">REG-{Date.now()}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Ready to Complete Registration</p>
              <p>Your payment has been processed successfully. Click "Complete Registration" to finalize your meet registration.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CreditCard className="mx-auto h-12 w-12 text-purple-500 mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">Payment Processing</h3>
        <p className="text-slate-400">Complete your registration with secure payment</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-3">Payment Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Registration Fee:</span>
            <span className="text-white">${meet.registrationFee}</span>
          </div>
          {meet.earlyBirdFee && meet.earlyBirdDeadline && new Date() < new Date(meet.earlyBirdDeadline) && (
            <div className="flex justify-between">
              <span className="text-green-400">Early Bird Discount:</span>
              <span className="text-green-400">-${meet.registrationFee - meet.earlyBirdFee}</span>
            </div>
          )}
          <div className="border-t border-slate-700 pt-2 flex justify-between font-semibold">
            <span className="text-white">Total:</span>
            <span className="text-white text-lg">${registrationFee}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h4 className="font-medium text-white">Payment Method</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'card' 
              ? 'border-purple-500 bg-purple-900/20' 
              : 'border-slate-600 bg-slate-800'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value as 'card')}
              className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600"
            />
            <CreditCard className="w-5 h-5 text-slate-400 mx-3" />
            <span className="text-white">Credit/Debit Card</span>
          </label>
          
          <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'bank' 
              ? 'border-purple-500 bg-purple-900/20' 
              : 'border-slate-600 bg-slate-800'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === 'bank'}
              onChange={(e) => setPaymentMethod(e.target.value as 'bank')}
              className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600"
            />
            <Lock className="w-5 h-5 text-slate-400 mx-3" />
            <span className="text-white">Bank Transfer</span>
          </label>
        </div>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <div className="bg-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center mb-4">
            <Lock className="w-4 h-4 text-green-400 mr-2" />
            <span className="text-sm text-green-400">Secured by Stripe</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => handlePaymentInputChange('cardNumber', formatCardNumber(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                value={paymentData.expiryDate}
                onChange={(e) => handlePaymentInputChange('expiryDate', formatExpiryDate(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                CVV *
              </label>
              <input
                type="text"
                value={paymentData.cvv}
                onChange={(e) => handlePaymentInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="123"
                maxLength={4}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={paymentData.cardholderName}
                onChange={(e) => handlePaymentInputChange('cardholderName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Name as it appears on card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Billing ZIP Code *
              </label>
              <input
                type="text"
                value={paymentData.billingZip}
                onChange={(e) => handlePaymentInputChange('billingZip', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="12345"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer Instructions */}
      {paymentMethod === 'bank' && (
        <div className="bg-slate-800 rounded-lg p-4">
          <h4 className="font-medium text-white mb-3">Bank Transfer Instructions</h4>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Please transfer the registration fee to the following account:</p>
            <div className="bg-slate-700 p-3 rounded mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><strong>Account Name:</strong> PowerUp Competitions</div>
                <div><strong>Account Number:</strong> 1234567890</div>
                <div><strong>Routing Number:</strong> 021000021</div>
                <div><strong>Amount:</strong> ${registrationFee}</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Include your name and "Meet Registration - {meet.name}" in the transfer description.
              Registration will be confirmed within 2-3 business days after payment verification.
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {paymentError && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-300 text-sm">{paymentError}</span>
          </div>
        </div>
      )}

      {/* Process Payment Button */}
      {paymentMethod === 'card' && (
        <button
          onClick={handlePaymentSubmit}
          disabled={!validatePaymentForm() || isProcessing}
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Pay ${registrationFee} Securely
            </>
          )}
        </button>
      )}

      {paymentMethod === 'bank' && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Bank Transfer Processing</p>
              <p>After initiating the bank transfer, your registration will be pending approval until payment is verified. You'll receive a confirmation email once payment is processed.</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center">
          <Lock className="w-4 h-4 text-green-400 mr-2" />
          <span className="text-sm text-slate-300">
            Your payment information is encrypted and secure. We use industry-standard SSL encryption and never store your complete card details.
          </span>
        </div>
      </div>
    </div>
  );
};