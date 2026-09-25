import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { CheckCircle2, AlertCircle, RotateCw } from 'lucide-react';
import { verifyEmail } from '../../api/auth.api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Missing verification token.');
      return;
    }

    const performVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          navigate('/login?verified=true', { replace: true });
        }, 1500);
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message || 'Invalid or expired verification token. Please request a new link.'
        );
      }
    };

    performVerification();
  }, [token, navigate]);

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-[#FFFAF3] p-6 antialiased">
      <div className="w-full max-w-md bg-white border border-[#EFE4D6] rounded-2xl p-8 text-center shadow-lg shadow-black/5">
        {status === 'loading' && (
          <div className="py-8 space-y-4">
            <RotateCw className="w-10 h-10 text-[#F62440] animate-spin mx-auto" />
            <h2 className="font-poppins text-xl font-semibold text-[#1f1b18]">Verifying your email...</h2>
            <p className="font-inter text-sm text-neutral-600">Please wait while we activate your workspace.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-poppins text-xl font-semibold text-[#1f1b18]">Email verified!</h2>
            <p className="font-inter text-sm text-neutral-600">Redirecting you to sign in...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 rounded-2xl text-[#F62440] border border-red-200 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="font-poppins text-xl font-semibold text-[#1f1b18]">Verification failed</h2>
            <p className="font-inter text-sm text-neutral-600 leading-relaxed">{errorMessage}</p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#F62440] hover:bg-[#D81B34] text-white font-inter text-sm font-medium transition-all shadow-md shadow-[#F62440]/20"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
