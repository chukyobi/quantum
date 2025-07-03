import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileTextIcon } from 'lucide-react';
import Image from 'next/image';

const SettingsPage = () => {
  return (
    <div className="p-8 bg-zinc-900 text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-lg text-gray-400">
          View legal licenses and other important information.
        </p>
      </div>

      {/* License Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Legal Licenses</h2>
        <Card className="p-6 bg-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <FileTextIcon className="w-6 h-6 text-green-500" />
            <span className="text-lg">SEC License</span>
          </div>
          <p className="text-gray-300">
            Goldman X operates under the regulations set by the U.S. Securities and Exchange Commission (SEC). This ensures our platform follows the necessary compliance standards for trading and investment operations.
          </p>
          <div className="mt-4">
            <Button size="lg" variant="outline" className="w-full">
              View SEC License Details
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 bg-zinc-800 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileTextIcon className="w-6 h-6 text-green-500" />
            <span className="text-lg">FCA License</span>
          </div>
          <p className="text-gray-300">
            We are authorized and regulated by the Financial Conduct Authority (FCA), ensuring that Goldman X is a trustworthy platform for investment and trading.
          </p>
          <div className="mt-4">
            <Button size="lg" variant="outline" className="w-full">
              View FCA License Details
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-zinc-800 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileTextIcon className="w-6 h-6 text-green-500" />
            <span className="text-lg">Other Legal Certifications</span>
          </div>
          <p className="text-gray-300">
            Goldman X complies with all local regulations and holds the necessary certifications to operate legally in multiple jurisdictions. These include compliance with anti-money laundering (AML) standards and Know Your Customer (KYC) regulations.
          </p>
          <div className="mt-4">
            <Button size="lg" variant="outline" className="w-full">
              View Legal Certifications
            </Button>
          </div>
        </Card>
      </section>

    
    </div>
  );
};

export default SettingsPage;
