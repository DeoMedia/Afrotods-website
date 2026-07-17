import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigate: (page: 'landing') => void;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
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
          <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-white/80 mt-2">Last updated: February 3, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none space-y-8">
          {/* Important Notice - Highlighted */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Important Notice to Parents</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              THE AFROTODS is a children's app designed for ages 4-8. We take your child's privacy very seriously.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 font-semibold">
              <li>✅ We do NOT collect personal information from children</li>
              <li>✅ We do NOT use advertising or tracking</li>
              <li>✅ We do NOT share your child's information with third parties</li>
              <li>✅ Purchase information is handled securely by Google Play</li>
            </ul>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. About Us</h2>
            <p className="text-gray-700 leading-relaxed">
              THE AFROTODS is owned and operated by <strong>Deo Media Limited UK</strong> (Company Number: 15426752), a company registered in England and Wales.
            </p>
            <div className="bg-purple-50 p-4 rounded-xl mt-3">
              <p className="text-gray-900 font-semibold">Deo Media Limited UK</p>
              <p className="text-gray-700">Company Number: 15426752</p>
              <p className="text-gray-700">Address: Springhead Road, Northfleet, Kent, DA11 8HN, United Kingdom</p>
              <p className="text-gray-700 mt-2">Email: privacyafro@deomedia.net</p>
              <p className="text-gray-700">Support: Supportafro@deomedia.net</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect from Children: NONE</h2>
            <p className="text-gray-700 leading-relaxed font-semibold mb-3">
              We do NOT collect, store, or share any personal information from children.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>❌ Names</li>
              <li>❌ Email addresses</li>
              <li>❌ Phone numbers</li>
              <li>❌ Physical addresses</li>
              <li>❌ Photos or videos</li>
              <li>❌ Voice recordings</li>
              <li>❌ Geolocation data</li>
              <li>❌ Device identifiers, cookies, or advertising IDs</li>
              <li>❌ Any other personal information as defined by COPPA and GDPR</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
              Your child can enjoy our app without creating an account, logging in, or providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Purchase Information (Handled by Google Play Only)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When a parent or guardian makes a purchase, we collect payment information processed securely through third-party payment processors. We do not store payment card information.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Payment Processors:</strong> We use Google Play for secure transaction handling.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the limited information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide and deliver the content you have purchased</li>
              <li>Process transactions and send purchase confirmations</li>
              <li>Improve and optimize our app and content</li>
              <li>Respond to support requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. COPPA Compliance</h2>
            <p className="text-gray-700 leading-relaxed">
              In accordance with COPPA, we:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Do not collect personal information from children without verifiable parental consent</li>
              <li>Do not require children to provide more information than reasonably necessary to use our app</li>
              <li>Allow parents to review, delete, or refuse further collection of their child's information</li>
              <li>Do not enable behavioral advertising or third-party tracking</li>
              <li>Do not include social sharing features or external links without parental controls</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect information from unauthorized access, alteration, disclosure, or destruction. All data transmission is encrypted using industry-standard SSL/TLS protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              We use carefully selected third-party service providers who are also COPPA compliant:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Payment processors for secure transaction handling</li>
              <li>Cloud storage providers for content delivery</li>
              <li>Analytics services for app performance monitoring (anonymized data only)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These providers are contractually obligated to use information only for providing services to us and in compliance with applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. No Advertising</h2>
            <p className="text-gray-700 leading-relaxed">
              THE AFROTODS does not display any advertisements, including behavioral advertising. We do not collect information for advertising purposes or share information with advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Parental Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Parents and guardians have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Review any personal information collected about their child</li>
              <li>Request deletion of their child's personal information</li>
              <li>Refuse further collection or use of their child's information</li>
              <li>Contact us with questions about our privacy practices</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at privacy@afrotods.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain purchase and account information only as long as necessary to provide services and comply with legal obligations. Usage analytics data is anonymized and aggregated, with no personally identifiable information retained.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Users</h2>
            <p className="text-gray-700 leading-relaxed">
              If you are accessing our app from outside the country where our servers are located, your information may be transferred across borders. We ensure that such transfers comply with applicable data protection laws, including GDPR where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify users of any material changes by updating the "Last updated" date and, where appropriate, by in-app notification or email. Continued use of the app after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-purple-50 p-6 rounded-xl mt-4">
              <p className="text-gray-900 font-semibold">Deo Media Limited UK</p>
              <p className="text-gray-700">Company Number: 15426752</p>
              <p className="text-gray-700">Address: Springhead Road, Northfleet, Kent, DA11 8HN, UK</p>
              <p className="text-gray-700 mt-2">Email: privacyafro@deomedia.net</p>
              <p className="text-gray-700">Support: Supportafro@deomedia.net</p>
            </div>
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