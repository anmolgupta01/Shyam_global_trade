import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';
import ContactHero from '../components/contact/ContactHero';

const ContactUs = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Shyam International</title>
        <meta name="description" content="Get in touch with Shyam International for product consultation, custom solutions, and expert support" />
        <meta name="keywords" content="contact, support, consultation, Shyam International" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Page Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our products or need assistance? We're here to help you 
              find the perfect solution for your needs.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Contact Form */}
            <div className="order-2 lg:order-1">
              <ContactForm variant="full" showContactInfo={true} />
            </div>

            {/* Right Side - Contact Info */}
            <div className="order-1 lg:order-2">
              <ContactInfo />
            </div>
          </div>
          <ContactHero/>
        </main>

        <Footer />
      </div>
    </>
  );
});

ContactUs.displayName = 'ContactUs';

export default ContactUs;
