
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card className="max-w-3xl mx-auto my-12">
        <CardHeader>
          <CardTitle>Privacy Policy for EarnX Digital</CardTitle>
          <CardDescription>
            Last updated: October 26, 2023
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>
          <p>
            We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
          </p>

          <h3 className="font-semibold text-lg text-foreground pt-4">Interpretation and Definitions</h3>
          <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
          
          <h3 className="font-semibold text-lg text-foreground pt-4">Collecting and Using Your Personal Data</h3>
          <h4 className="font-semibold text-md text-foreground">Types of Data Collected</h4>
          <p>
            <strong>Personal Data:</strong> While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number.
          </p>
           <p>
            <strong>Usage Data:</strong> Usage Data is collected automatically when using the Service. This may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
          </p>

          <h4 className="font-semibold text-md text-foreground pt-2">Use of Your Personal Data</h4>
          <p>The Company may use Personal Data for the following purposes:</p>
          <ul className="list-disc list-inside space-y-1">
              <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
              <li>To manage Your Account: to manage Your registration as a user of the Service.</li>
              <li>For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
              <li>To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
          </ul>

          <h3 className="font-semibold text-lg text-foreground pt-4">Third-Party Services</h3>
          <p>Our service uses third-party services for functionality, analytics, and advertising. These include:</p>
           <ul className="list-disc list-inside space-y-1">
              <li><strong>Firebase (Google):</strong> For authentication and database services.</li>
              <li><strong>Google AdSense:</strong> For serving advertisements.</li>
              <li><strong>CoinGecko:</strong> For providing cryptocurrency price data.</li>
          </ul>
          <p>These third parties have their own privacy policies addressing how they use such information.</p>

          <h3 className="font-semibold text-lg text-foreground pt-4">Security of Your Personal Data</h3>
          <p>
            The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
          </p>

          <h3 className="font-semibold text-lg text-foreground pt-4">Changes to this Privacy Policy</h3>
          <p>
            We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h3 className="font-semibold text-lg text-foreground pt-4">Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, You can contact us by email: support@earnxdigital.com</p>

          <div className="pt-4">
             <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
