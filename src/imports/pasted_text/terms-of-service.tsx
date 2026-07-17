import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onNavigate: (page: 'landing') => void;
}

export function TermsOfService({ onNavigate }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('landing')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          <p className="text-white/80 mt-2">Last updated: February 3, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using THE AFROTODS mobile application and services ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the App.
            </p>
            <p className="text-gray-700 leading-relaxed">
              THE AFROTODS is intended for use by children ages 4-8 under the supervision of a parent or legal guardian. By using this App, you represent that you are a parent or legal guardian, or that you have obtained permission from a parent or legal guardian.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">License to Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Download and install the App on devices you own or control</li>
              <li>Access and view the content you have purchased</li>
              <li>Use the App for personal, non-commercial purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content and Purchases</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>THE AFROTODS Festival Time</strong> is offered as one complete story delivered in four connected parts. When you purchase the full story, you receive access to all four parts as a single purchase.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
              <li>Parts are not sold separately</li>
              <li>Purchases are final unless otherwise stated in our Refund Policy</li>
              <li>Content is licensed, not sold, and remains our intellectual property</li>
              <li>You may download content for offline viewing on your authorized devices</li>
              <li>You may not share, distribute, or publicly display purchased content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              All purchases are processed through secure third-party payment processors. By making a purchase, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate and complete payment information</li>
              <li>Pay all applicable fees and taxes</li>
              <li>Comply with the terms of the payment processor</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Prices are subject to change, but changes will not affect purchases already completed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use the App for any unlawful purpose</li>
              <li>Attempt to circumvent any content protection mechanisms</li>
              <li>Copy, modify, distribute, or create derivative works from our content</li>
              <li>Reverse engineer, decompile, or disassemble the App</li>
              <li>Remove or modify any copyright, trademark, or proprietary notices</li>
              <li>Use the App in any way that could damage or impair our services</li>
              <li>Share your account access with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content, features, and functionality of the App, including but not limited to text, graphics, logos, animations, videos, audio, and software, are the exclusive property of <strong>Deo Media Limited UK</strong> (Company Number: 15426752) or its licensors and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              THE AFROTODS name, logo, and all related names, logos, and designs are trademarks of Deo Media Limited UK. You may not use these trademarks without our prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive to provide high-quality educational content appropriate for children ages 4-8, we recommend parental supervision during use. Parents and guardians are responsible for determining whether the content is appropriate for their child.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your access to the App at any time, with or without notice, for violation of these Terms or for any other reason. Upon termination, your license to use the App will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimers and Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ONE MEDIA LUMPS LK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless One Media Lumps LK and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the App or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by updating the "Last updated" date and, where appropriate, through in-app notification. Your continued use of the App after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising from these Terms or use of the App shall be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms, please contact us at:
            </p>
            <div className="bg-purple-50 p-6 rounded-xl mt-4">
              <p className="text-gray-900 font-semibold">Deo Media Limited UK</p>
              <p className="text-gray-700">Company Number: 15426752</p>
              <p className="text-gray-700">Address: Springhead Road, Northfleet, Kent, DA11 8HN, UK</p>
              <p className="text-gray-700 mt-2">Email: Technicalafro@deomedia.net</p>
              <p className="text-gray-700">Support: Supportafro@deomedia.net</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </p>
          </section>
        </div>
      </div>

      <footer className="bg-purple-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-white/70">
          <p>THE AFROTODS © {new Date().getFullYear()} • Property of Deo Media Limited UK</p>
        </div>
      </footer>
    </div>
  );
}