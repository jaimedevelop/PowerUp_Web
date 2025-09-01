import React from 'react';
import { Scale, QrCode } from 'lucide-react';
import { MeetData } from '../../../../../firebase';

interface WeighInTabProps {
  meet: MeetData;
  meetId: string;
  onRefresh: () => void;
}

const WeighInTab: React.FC<WeighInTabProps> = ({ meet, meetId, onRefresh }) => {
  return (
    <div className="space-y-6">
      {/* Weigh-In Process */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Weigh-In Management</h3>
        <div className="text-slate-400 text-center py-8">
          <Scale className="h-12 w-12 mx-auto mb-4 text-slate-600" />
          <p className="text-lg mb-2">Weigh-In System Coming Soon</p>
          <p className="text-sm">Record official weights for all registered athletes</p>
          <p className="text-sm mt-1">Quick athlete lookup and weight entry</p>
        </div>
      </div>

      {/* QR Code Integration Preview */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <QrCode className="h-5 w-5 text-purple-400" />
          <h4 className="text-md font-medium text-white">Future: QR Code Integration</h4>
        </div>
        <div className="text-slate-400 text-center py-4">
          <p className="text-sm">Athletes will be able to use QR codes for quick check-in and weigh-in</p>
          <p className="text-sm mt-1">Scan to instantly access athlete records and update weights</p>
        </div>
      </div>
    </div>
  );
};

export default WeighInTab;