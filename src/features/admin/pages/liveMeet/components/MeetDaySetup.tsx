import React, { useState } from 'react';
import { Play, Settings, Users, Clock, Check, AlertTriangle, Radio } from 'lucide-react';

interface Flight {
  id: string;
  name: string;
  time: string;
  status: 'ready' | 'in-progress' | 'completed';
}

interface MeetDaySetupProps {
  meetId: string;
  onStartMeet: () => void;
}

const mockFlights: Flight[] = [
  { id: '1', name: 'Flight A - Male 59kg', time: '09:00 AM', status: 'ready' },
  { id: '2', name: 'Flight B - Male 66kg', time: '11:00 AM', status: 'ready' },
  { id: '3', name: 'Flight C - Female 57kg', time: '01:00 PM', status: 'ready' }
];

export const MeetDaySetup: React.FC<MeetDaySetupProps> = ({ meetId, onStartMeet }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('platform1');
  const [flightOrder, setFlightOrder] = useState<Flight[]>(mockFlights);
  const [equipmentCheck, setEquipmentCheck] = useState({
    platform: true,
    racks: true,
    bars: true,
    plates: true,
    timer: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'completed': return 'text-gray-400';
      default: return 'text-slate-400';
    }
  };

  const allEquipmentChecked = Object.values(equipmentCheck).every(check => check);
  const allFlightsReady = flightOrder.every(flight => flight.status === 'ready');

  const handleMoveFlight = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...flightOrder];
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < flightOrder.length - 1)
    ) {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      setFlightOrder(newOrder);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Settings className="mr-2" size={20} />
          Meet Day Setup
        </h3>
        <button 
          onClick={onStartMeet}
          disabled={!allEquipmentChecked || !allFlightsReady}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            allEquipmentChecked && allFlightsReady
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Radio className="h-4 w-4" />
          <span>Start Live Meet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Equipment Check */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-white mb-4 flex items-center">
              <Check className="mr-2" size={16} />
              Equipment Check
            </h4>
            <div className="space-y-3">
              {Object.entries(equipmentCheck).map(([item, checked]) => (
                <div key={item} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <span className="text-white capitalize">{item}</span>
                  <div 
                    onClick={() => setEquipmentCheck(prev => ({ ...prev, [item]: !prev[item as keyof typeof prev] }))}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      checked 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {checked && <Check size={12} className="text-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <h4 className="font-medium text-white mb-4">Platform Configuration</h4>
            <div className="grid grid-cols-2 gap-3">
              {['platform1', 'platform2', 'platform3', 'platform4'].map(platform => (
                <div
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPlatform === platform
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-white font-medium capitalize">
                      {platform.replace('platform', 'Platform ')}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {selectedPlatform === platform ? 'Selected' : 'Available'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flight Order */}
        <div>
          <h4 className="font-medium text-white mb-4 flex items-center">
            <Users className="mr-2" size={16} />
            Flight Order
          </h4>
          <div className="space-y-3">
            {flightOrder.map((flight, index) => (
              <div key={flight.id} className="p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-white">{flight.name}</div>
                      <div className={`text-sm ${getStatusColor(flight.status)}`}>
                        {flight.status.replace('-', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-400 mt-1">
                      <Clock className="mr-1" size={14} />
                      {flight.time}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 ml-3">
                    <button
                      onClick={() => handleMoveFlight(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded ${
                        index === 0 
                          ? 'text-slate-700 cursor-not-allowed' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveFlight(index, 'down')}
                      disabled={index === flightOrder.length - 1}
                      className={`p-1 rounded ${
                        index === flightOrder.length - 1 
                          ? 'text-slate-700 cursor-not-allowed' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Summary */}
          <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-400 mt-0.5 mr-2" size={18} />
              <div>
                <div className="font-medium text-white mb-1">Ready to Go Live</div>
                <div className="text-sm text-slate-400">
                  {allEquipmentChecked && allFlightsReady
                    ? 'All equipment checked and flights are ready. You can start the live meet.'
                    : 'Complete equipment check and ensure all flights are ready before starting the live meet.'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};