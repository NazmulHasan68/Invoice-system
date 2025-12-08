

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-6 bg-white shadow-sm">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
          Create Professional Invoices in Minutes  
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Fast, simple & secure invoicing for freelancers, startups, and .
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-black text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition">
            Create Invoice 
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-900 rounded-xl text-lg font-semibold hover:bg-gray-300 transition">
            Sign Up Free 
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features sd</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[ 
            "Create Invoice Easily",
            "Download PDF",
            "Send Invoice by Email",
            "Payment Tracking",
            "Client Management",
            "Templates (Dark/Light)",
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">✔ {feature}</h3>
              <p className="text-gray-600 text-sm">
                Easily manage and dfgd create smooth, professional invoices within seconds. 
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We are committed to providing a fast, simple, and reliable invoicing solution
            for freelancers, startups, and growing businesses. Our goal is to help you save
            time, stay organized, and manage yourasdf  billing effortlessly. fgh fgh fgh fg sdf sd
          </p>
        </div>
      </section>

      {/* Client Reviews */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Aminul Islam",
              text: "This invoicing tool saved me hours every week. Super easy to use!",
            },
            {
              name: "Sarah Rahman",
              text: "Clean design, fast performance, and perfect for my small business.",
            },
            {
              name: "Rakib Hasan",
              text: "The PDF download and email feature is amazing. Highly recommended!",
            },
          ].map((review, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
            >
              <p className="text-gray-700 italic mb-4">“{review.text}”</p>
              <h4 className="text-lg font-semibold text-gray-900">- {review.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Create Your Invoice? </h2>
        <p className="text-gray-600 mb-8">
          Start creating fully professional invoices at zero cost.
        </p>
        <button className="px-8 py-3 bg-black text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition">
          Get Started
        </button>
      </section>
    </div>
  );
}
