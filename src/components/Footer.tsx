import React, { useState } from 'react';
import { Shield, FileText, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Clean Metadata */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-bold text-neutral-900 dark:text-white">OmniConvert Studio</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>Digital Media Engineering Matrix</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>5 Golden Rules Compliant</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>Auto-Clean Temporary Storage</span>
        </div>

        {/* AdSense Mandatory Legal Links */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setModalType('privacy')}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline underline-offset-4 transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <button
            type="button"
            onClick={() => setModalType('terms')}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline underline-offset-4 transition-colors"
          >
            Terms of Service
          </button>
        </div>

        {/* Technical standards */}
        <div className="text-xs text-neutral-400 font-mono">
          Sharp (libvips) · Potrace · pdf-lib · Web Audio API
        </div>
      </div>

      {/* Mandatory AdSense Compliance Policy Modal */}
      {modalType && (
        <div
          onClick={() => setModalType(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-dropdown rounded-3xl p-6 sm:p-8 max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl text-left border border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-5">
              <div className="flex items-center gap-2.5">
                {modalType === 'privacy' ? (
                  <Shield className="w-5 h-5 text-indigo-500" />
                ) : (
                  <FileText className="w-5 h-5 text-indigo-500" />
                )}
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {modalType === 'privacy' ? 'Privacy Policy & Data Security' : 'Terms of Service'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalType === 'privacy' ? (
              <div className="space-y-4 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white mb-1">1. User File Privacy & Zero Storage Retention</h4>
                  <p>
                    OmniConvert Studio prioritizes user confidentiality. All media processing (conversion, transcoding, and rasterization) happens transiently in temporary system memory (RAM) or client-side within your browser. <strong>We do not save, inspect, archive, or sell any of your uploaded files or personal media.</strong> Temporary buffers are purged immediately upon delivery.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white mb-1">2. Google AdSense & Advertising Cookies</h4>
                  <p>
                    This website may use Google AdSense and third-party advertising partners to serve ads. Google uses cookies, including the DoubleClick DART cookie, to serve ads based on prior visits to our website or other sites on the Internet.
                  </p>
                  <p className="mt-1">
                    Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="underline text-indigo-500">Google Ads Settings</a> or through the Network Advertising Initiative.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white mb-1">3. Analytics & Telemetry</h4>
                  <p>
                    We do not collect personal identities, telemetry logs, or biometric information. Standard web server access logs (IP addresses, user agents) may be temporarily reviewed solely for operational health, security, and denial-of-service prevention.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white mb-1">4. Contact & Inquiries</h4>
                  <p>
                    For privacy inquiries or compliance questions regarding OmniConvert Studio, please contact the site operator at <code>alianila520@gmail.com</code>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white mb-1">1. Acceptance of Terms</h4>
                  <p>
                    By accessing or utilizing OmniConvert Studio, you acknowledge that you agree to these Terms of Service and applicable intellectual property laws.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white mb-1">2. Permitted Use & Copyright Ownership</h4>
                  <p>
                    You retain 100% intellectual property ownership of all files you upload and convert. You agree not to upload malware, copyrighted materials without authorization, or prohibited digital content.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white mb-1">3. Technical Limitation & Disclaimer of Warranty</h4>
                  <p>
                    OmniConvert Studio enforces the 5 Golden Rules of Media Physics (e.g. irreversible camera sensor physics and vector mathematical scaling). Services are provided on an "as is" and "as available" basis without warranties of any kind.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
