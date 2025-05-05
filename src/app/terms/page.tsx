import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-green-800 mb-8">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none">
              <p>Last Updated: {new Date().toLocaleDateString()}</p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using Krishi Sagar ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing the Service.
              </p>
              
              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily access the materials on Krishi Sagar's website for personal, non-commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose or for any public display;</li>
                <li>Attempt to reverse engineer any software contained on Krishi Sagar's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
              
              <h2>3. Disclaimer</h2>
              <p>
                The materials on Krishi Sagar's website are provided on an 'as is' basis. Krishi Sagar makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              
              <h2>4. Limitations</h2>
              <p>
                In no event shall Krishi Sagar or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Krishi Sagar's website, even if Krishi Sagar or a Krishi Sagar authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
              
              <h2>5. Accuracy of Materials</h2>
              <p>
                The materials appearing on Krishi Sagar's website could include technical, typographical, or photographic errors. Krishi Sagar does not warrant that any of the materials on its website are accurate, complete, or current. Krishi Sagar may make changes to the materials contained on its website at any time without notice.
              </p>
              
              <h2>6. Links</h2>
              <p>
                Krishi Sagar has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Krishi Sagar of the site. Use of any such linked website is at the user's own risk.
              </p>
              
              <h2>7. Modifications</h2>
              <p>
                Krishi Sagar may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
              
              <h2>8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in Gujarat.
              </p>
              
              <h2>9. User Account</h2>
              <p>
                If you create an account on the Service, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. You must immediately notify Krishi Sagar of any unauthorized uses of your account or any other breaches of security.
              </p>
              
              <h2>10. Service Availability</h2>
              <p>
                Krishi Sagar does not warrant that the Service will be available at all times. We reserve the right to suspend or terminate the Service at any time without notice.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 