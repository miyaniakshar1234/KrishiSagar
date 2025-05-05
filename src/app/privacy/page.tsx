import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-green-800 mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p>Last Updated: {new Date().toLocaleDateString()}</p>
              
              <p>
                Krishi Sagar ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Krishi Sagar.
              </p>
              
              <h2>Information We Collect</h2>
              <p>
                We collect personal information that you voluntarily provide to us when you register on the Service, express an interest in obtaining information about us or our products and Services, or otherwise contact us.
              </p>
              <p>
                The personal information that we collect depends on the context of your interactions with us and the Service, the choices you make and the products and features you use. The personal information we collect may include the following:
              </p>
              <ul>
                <li>Name and Contact Data: We collect your first and last name, email address, postal address, phone number, and other similar contact data.</li>
                <li>Credentials: We collect passwords, password hints, and similar security information used for authentication and account access.</li>
                <li>Payment Data: We collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.</li>
                <li>Location Data: We collect your geolocation data to provide location-specific services.</li>
                <li>Farm Data: We collect information about your farm, crops, farming practices, and other agriculture-related data to provide personalized services.</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect in various ways, including to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our Service;</li>
                <li>Improve, personalize, and expand our Service;</li>
                <li>Understand and analyze how you use our Service;</li>
                <li>Develop new products, services, features, and functionality;</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service, and for marketing and promotional purposes;</li>
                <li>Process your transactions;</li>
                <li>Send you text messages and push notifications;</li>
                <li>Find and prevent fraud;</li>
                <li>For compliance purposes, including enforcing our Terms of Service, or other legal rights, or as may be required by applicable laws and regulations or requested by any judicial process or governmental agency.</li>
              </ul>
              
              <h2>How We Share Your Information</h2>
              <p>
                We may share the information we collect in various ways, including the following:
              </p>
              <ul>
                <li>With Service Providers: We may share your information with our vendors, consultants, and other service providers who need access to such information to carry out their work for us.</li>
                <li>Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                <li>With Your Consent: We may share your personal information for any other purpose with your consent.</li>
              </ul>
              
              <h2>Your Choices</h2>
              <p>
                You have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
              </p>
              
              <h2>Data Retention</h2>
              <p>
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.
              </p>
              
              <h2>Security</h2>
              <p>
                We use appropriate technical and organizational measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
              </p>
              
              <h2>International Data Transfers</h2>
              <p>
                Your information may be transferred to, and maintained on, computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction.
              </p>
              
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Email: privacy@krishisagar.com<br />
                Address: Ahmedabad, Gujarat, India
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 