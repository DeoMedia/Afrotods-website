import { CheckCircle2, XCircle } from 'lucide-react';

export function PrivacyPolicy() {
  const baloo = "'Baloo 2', cursive";

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-[#2D0A6B] to-[#5A1F9F] text-white">
        <div className="max-w-[1140px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: baloo }}>
            Privacy Policy
          </h1>
          <p className="text-lg text-white/80">Last updated: July 17, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="prose prose-lg max-w-none space-y-8">
            {/* Important Notice - Highlighted */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Important Notice to Parents</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                THE AFROTODS is a children's app designed for ages 4-8. We take your child's privacy very seriously.
              </p>
              <ul className="list-none space-y-1 text-gray-700 font-semibold">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-green-600" /> We do NOT collect personal information from children</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-green-600" /> We do NOT use advertising or tracking</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-green-600" /> We do NOT share your child's information with third parties</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-green-600" /> In-app purchase information is handled securely by Google Play</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Our <strong>online shop</strong> (merchandise, toys, and books) is designed for <strong>adult
                purchasers only</strong>. When an adult places an order we collect the information described in
                section 3 below. We never knowingly collect personal information from children, in the app or in
                the shop.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                1. About Us
              </h2>
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
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                2. Information We Collect from Children: NONE
              </h2>
              <p className="text-gray-700 leading-relaxed font-semibold mb-3">
                We do NOT collect, store, or share any personal information from children.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                This includes:
              </p>
              <ul className="list-none space-y-2 text-gray-700">
                <li className="flex items-start gap-2"><XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" /> Names</li>
                <li className="flex items-start gap-2"><XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" /> Email addresses</li>
                <li className="flex items-start gap-2"><XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" /> Phone numbers</li>
                <li className="flex items-start gap-2"><XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" /> Physical addresses</li>
                <li className="flex items-start gap-2"><XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" /> Photos or videos</li>
                <li className="flex items-start gap-2"><XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" /> Voice recordings</li>
                <li className="flex items-start gap-2"><XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" /> Geolocation data</li>
                <li className="flex items-start gap-2"><XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" /> Device identifiers, cookies, or advertising IDs</li>
                <li className="flex items-start gap-2"><XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" /> Any other personal information as defined by COPPA and GDPR</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                Your child can enjoy our app without creating an account, logging in, or providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                3. Purchase Information (App and Online Shop)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>App purchases:</strong> in-app purchases are processed securely by Google Play. We do not
                receive or store payment card information from app purchases.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Online shop orders:</strong> when an adult places an order for physical merchandise at our
                shop, we collect the information needed to fulfil that order:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your name and email address (for order confirmation and tracking)</li>
                <li>Your shipping address and, optionally, a phone number (for delivery)</li>
                <li>Your order details (items, amounts, currency, and order status)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>We never see or store your card details.</strong> Payment is completed on the secure hosted
                pages of our payment processors — <strong>Stripe</strong> (GBP/USD) and <strong>Paystack</strong>{' '}
                (NGN/ZAR). Order data is stored with <strong>Supabase</strong> (our database provider) and processed
                on <strong>Railway</strong> (our hosting provider); order confirmation emails are sent via{' '}
                <strong>Resend</strong>. These processors act on our instructions and are bound by data-processing
                agreements.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Order lookups require both your order number and your email address, so your order details cannot be
                viewed by someone who only has one of them. We retain order records for as long as required for tax,
                accounting, and consumer-law purposes, then delete or anonymise them. You can exercise your UK GDPR
                / POPIA rights (access, correction, deletion, objection) by emailing privacyafro@deomedia.net.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                4. How We Use Information
              </h2>
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
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                5. COPPA Compliance
              </h2>
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
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                6. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect information from unauthorized access, alteration, disclosure, or destruction. All data transmission is encrypted using industry-standard SSL/TLS protocols.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                7. Third-Party Services
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We use carefully selected third-party service providers who are also COPPA compliant:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Google Play — in-app purchase handling</li>
                <li>Stripe and Paystack — shop payment processing (card details never reach our servers)</li>
                <li>Supabase — database hosting for shop orders</li>
                <li>Railway — application hosting for the shop backend</li>
                <li>Resend — transactional order emails</li>
                <li>Cloud storage providers for content delivery</li>
                <li>Analytics services for app performance monitoring (anonymized data only)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                These providers are contractually obligated to use information only for providing services to us and in compliance with applicable privacy laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                8. No Advertising
              </h2>
              <p className="text-gray-700 leading-relaxed">
                THE AFROTODS does not display any advertisements, including behavioral advertising. We do not collect information for advertising purposes or share information with advertisers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                9. Parental Rights
              </h2>
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
                To exercise these rights, please contact us at privacyafro@deomedia.net.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                10. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We retain purchase and account information only as long as necessary to provide services and comply with legal obligations. Usage analytics data is anonymized and aggregated, with no personally identifiable information retained.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                11. International Users
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you are accessing our app from outside the country where our servers are located, your information may be transferred across borders. We ensure that such transfers comply with applicable data protection laws, including GDPR where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                12. Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify users of any material changes by updating the "Last updated" date and, where appropriate, by in-app notification or email. Continued use of the app after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                13. Contact Us
              </h2>
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
      </section>
    </div>
  );
}