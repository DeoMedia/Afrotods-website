export function ReturnsRefunds() {
  const baloo = "'Baloo 2', cursive";

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-[#2D0A6B] to-[#5A1F9F] text-white">
        <div className="max-w-[1140px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: baloo }}>
            Returns &amp; Refunds Policy
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
                1. Your 14-Day Right to Cancel (UK)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you are a UK consumer, the Consumer Contracts Regulations 2013 give you the right to cancel your
                order for any reason within <strong>14 days of receiving your goods</strong> and receive a full
                refund, including our standard delivery charge.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Email Supportafro@deomedia.net with your order number (e.g. AFR-XXXXXXXX) within 14 days of delivery</li>
                <li>Return the goods to us within 14 days of telling us you wish to cancel</li>
                <li>Return postage is your responsibility, unless the item is faulty or we sent the wrong item</li>
                <li>We refund within 14 days of receiving the goods back (or proof of postage), to your original payment method</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Please return items unused and in their original packaging where possible. We may reduce your refund
                to reflect any reduction in value caused by handling beyond what is needed to inspect the goods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                2. Faulty, Damaged, or Incorrect Items
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under the Consumer Rights Act 2015, our goods must be of satisfactory quality, fit for purpose, and
                as described. If something arrives faulty, damaged, or isn't what you ordered:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Contact us within 30 days for a full refund, or ask for a repair or replacement</li>
                <li>We cover the return postage for faulty or incorrect items</li>
                <li>Photos of the problem help us resolve things faster, so attach them to your email if you can</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                3. South African Customers
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Where the Consumer Protection Act 2008 or the Electronic Communications and Transactions Act 2002
                applies, you may cancel an electronic purchase within 7 days of delivery (return postage at your
                cost) and you have full remedies for defective goods. We honour these rights in full.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                4. How Refunds Are Paid
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Refunds are issued to your original payment method via our payment processors (Stripe or Paystack)
                in the currency you paid. Depending on your bank, refunds usually appear within 5–10 business days
                of being issued.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#2D0A6B] mt-12 mb-4" style={{ fontFamily: baloo }}>
                5. Contact Us
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
