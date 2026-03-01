import { useState, useCallback } from 'react';

const DEFAULT_BILLING_INFO = {
  company:  'Acme Corp',
  email:    'billing@acmecorp.com',
  country:  'BD',
  taxId:    '',
  address1: '',
  address2: '',
  city:     '',
  state:    '',
  zip:      '',
};

export default function useCheckout() {
  const [step,        setStep]        = useState(1);
  const [billing,     setBilling]     = useState('annual');
  const [billingInfo, setBillingInfo] = useState(DEFAULT_BILLING_INFO);
  const [isProcessing,setIsProcessing]= useState(false);

  const goNext = useCallback(() => setStep(s => Math.min(s + 1, 4)), []);
  const goBack = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const updateBillingInfo = useCallback((field, val) => {
    setBillingInfo(prev => ({ ...prev, [field]: val }));
  }, []);

  // Mocks 1.5s payment processing, then advances to step 4
  const startPayment = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
    }, 1500);
  }, []);

  // Reset everything (call when checkout closes/reopens)
  const reset = useCallback(() => {
    setStep(1);
    setBilling('annual');
    setBillingInfo(DEFAULT_BILLING_INFO);
    setIsProcessing(false);
  }, []);

  return {
    step, setStep,
    billing, setBilling,
    billingInfo, updateBillingInfo,
    isProcessing,
    goNext, goBack,
    startPayment,
    reset,
  };
}
