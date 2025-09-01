import React, { useState } from 'react';
import { Users, Clock, Edit, Plus, Trash2, MoveVertical } from 'lucide-react';

interface Flight {
  id: string;
  name: string;
  time: string;
  weightClass: string;
  athletes: Athlete[];
}

interface Athlete {
  id: string;
  name: string;
  lotNumber: number;
  team?: string;
}

const mockFlights: Flight[] = [
  {
    id: '1',
    name: 'Flight A - Male 59kg',
    time: '09:00 AM',
    weightClass: 'Male 59kg',
    athletes: [
      { id: '1', name: 'John Smith', lotNumber: 1, team: 'Powerlifting Gym' },
      { id: '2', name: 'Mike Johnson', lotNumber: 2, team: 'Iron Warriors' },
      { id: '3', name: 'David Wilson', lotNumber: 3, team: 'Strength Academy' }
    ]
  },
  {
    id: '2',
    name: 'Flight B - Male 66kg',
    time: '11:00 AM',
    weightClass: 'Male 66kg',
    athletes: [
      { id: '4', name: 'Robert Brown', lotNumber: 1, team: 'Powerlifting Gym' },
      { id: '5', name: 'James Davis', lotNumber: 2, team: 'Lifters United' }
    ]
  }
];

interface FlightOrganizationProps {
  meetId: string;
}

export const FlightOrganization: React.FC<FlightOrganizationProps> = ({ meetId }) => {
  const [flights, setFlights] = useState<Flight[]>(mockFlights);
  const [selectedFlight, setSelectedFlight] = useState<string>(mockFlights[0]?.id || '');

  const handleAddFlight = () => {
    const newFlight: Flight = {
      id: `${flights.length + 1}`,
      name: `Flight ${String.fromCharCode(65 + flights.length)}`,
      time: '12:00 PM',
      weightClass: 'New Weight Class',
      athletes: []
    };
    setFlights([...flights, newFlight]);
  };

  const handleDeleteFlight = (flightId: string) => {
    setFlights(flights.filter(flight => flight.id !== flightId));
    if (selectedFlight === flightId && flights.length > 1) {
      setSelectedFlight(flights[0].id);
    }
  };

  const selectedFlightData = flights.find(flight => flight.id === selectedFlight);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Users className="mr-2" size={20} />
          Flight Organization
        </h3>
        <button 
          onClick={handleAddFlight}
          className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Add Flight</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flight List */}
        <div className="lg:col-span-1">
          <div className="space-y-3">
            {flights.map((flight) => (
              <div 
                key={flight.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedFlight === flight.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedFlight(flight.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">{flight.name}</h4>
                    <div className="flex items-center text-sm text-slate-400 mt-1">
                      <Clock size={14} className="mr-1" />
                      {flight.time}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFlight(flight.id);
                    }}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  {flight.weightClass} • {flight.athletes.length} athletes
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flight Details */}
        <div className="lg:col-span-2">
          {selectedFlightData ? (
            <div className="space-y-6">
              {/* Flight Header */}
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                <div>
                  <h4 className="font-semibold text-white">{selectedFlightData.name}</h4>
                  <div className="flex items-center text-sm text-slate-400 mt-1">
                    <Clock size={14} className="mr-1" />
                    {selectedFlightData.time} • {selectedFlightData.weightClass}
                  </div>
                </div>
                <button className="flex items-center space-x-2 text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                  <Edit size={14} />
                  <span>Edit Flight</span>
                </button>
              </div>

              {/* Athletes List */}
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <h5 className="font-medium text-white">Athletes</h5>
                  <button className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    <Plus size={14} />
                    <span>Add Athlete</span>
                  </button>
                </div>
                
                {selectedFlightData.athletes.length > 0 ? (
                  <div className="divide-y divide-slate-800">
                    {selectedFlightData.athletes.map((athlete, index) => (
                      <div key={athlete.id} className="p-4 flex items-center">
                        <div className="flex items-center text-slate-400 mr-3">
                          <MoveVertical size={16} />
                        </div>
                        <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1 text-center font-mono text-white">
                            {athlete.lotNumber}
                          </div>
                          <div className="col-span-6">
                            <div className="font-medium text-white">{athlete.name}</div>
                            {athlete.team && (
                              <div className="text-sm text-slate-400">{athlete.team}</div>
                            )}
                          </div>
                          <div className="col-span-4 text-sm text-slate-400">
                            {/* Additional athlete info could go here */}
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <button className="text-slate-500 hover:text-red-400 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <Users size={24} className="mx-auto mb-2 text-slate-600" />
                    <p>No athletes assigned to this flight</p>
                    <p className="text-sm mt-1">Add athletes to get started</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <Users size={24} className="mx-auto mb-2 text-slate-600" />
              <p>Select a flight to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};