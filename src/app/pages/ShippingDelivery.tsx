export function ShippingDelivery() {
  const baloo = "'Baloo 2', cursive";

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-[#2D0A6B] to-[#5A1F9F] text-white">
        <div className="max-w-[1140px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: baloo }}>
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-lg text-white/80">Last updated: July 17, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                1. Where We Ship
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We currently ship within the <strong>United Kingdom</strong>, delivered by <strong>Royal Mail</strong>.
                Delivery to Europe and the rest of the world is <strong>coming soon</strong> — follow us on social
                media or email Supportafro@deomedia.net to hear when your country opens.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                2. Shipping Costs
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Shipping is charged as a flat rate per order, shown clearly at checkout before you pay, in your
                order currency. The exact amount depends on the currency/region you order in.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                3. Dispatch and Delivery Times
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Orders are dispatched within 2–3 business days of payment</li>
                <li>Royal Mail delivery typically takes 2–5 business days after dispatch</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                These are estimates, not guarantees — carrier delays can happen outside our control. If your order
                hasn't arrived within 30 days, contact us and we'll investigate with Royal Mail.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                4. Tracking Your Order
              </h2>
              <p className="text-gray-700 leading-relaxed">
                When your order ships, we add the carrier and tracking number to your order. You can check progress
                any time at{' '}
                <a href="/track" className="text-[#F97316] font-bold hover:underline">
                  afrotods.com/track
                </a>{' '}
                using your order number and email address.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                5. Customs and Import Duties
              </h2>
              <p className="text-gray-700 leading-relaxed">
                International orders may be subject to import duties, taxes, or customs fees levied by the
                destination country. These are the recipient's responsibility and are not included in our prices or
                shipping charges.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                6. Contact Us
              </h2>
              <div className="bg-purple-50 p-6 rounded-xl mt-4">
                <p className="text-gray-900 font-semibold">Deo Media Limited UK</p>
                <p className="text-gray-700">Company Number: 15426752</p>
                <p className="text-gray-700">Address: Springhead Road, Northfleet, Kent, DA11 8HN, UK</p>
                <p className="text-gray-700 mt-2">Support: Supportafro@deomedia.net</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
