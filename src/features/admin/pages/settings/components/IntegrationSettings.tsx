
// src/admin/components/settings/IntegrationSettings.tsx
import React from 'react';
import { Link, Mail, CreditCard, Wifi } from 'lucide-react';
import { Card } from '../../../../shared/ui/Card';
import { Button } from '../../../../shared/ui/Button';

export const IntegrationSettings: React.FC = () => {
  const integrations = [
    {
      name: 'EmailJS',
      description: 'Send automated emails to participants',
      icon: Mail,
      connected: true,
      status: 'Active'
    },
    {
      name: 'Stripe',
      description: 'Process registration payments',
      icon: CreditCard,
      connected: false,
      status: 'Not Connected'
    },
    {
      name: 'USAPL Database',
      description: 'Sync with federation records',
      icon: Link,
      connected: true,
      status: 'Syncing'
    },
    {
      name: 'Live Streaming',
      description: 'Broadcast meets online',
      icon: Wifi,
      connected: false,
      status: 'Not Connected'
    }
  ];

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <Link size={24} className="text-purple-400" />
        <h3 className="text-xl font-bold text-white">External Integrations</h3>
      </div>

      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-slate-800 rounded-lg">
                <integration.icon size={20} className="text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">{integration.name}</h4>
                <p className="text-sm text-slate-400">{integration.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm px-2 py-1 rounded-full ${
                integration.connected 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {integration.status}
              </span>
              <Button 
                variant={integration.connected ? "outline" : "primary"} 
                size="sm"
              >
                {integration.connected ? 'Configure' : 'Connect'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};