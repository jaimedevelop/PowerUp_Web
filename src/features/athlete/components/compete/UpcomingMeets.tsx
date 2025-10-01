import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Trophy, Users } from 'lucide-react';
import { tw, getButtonClass } from '../../../../styles/theme';

// @ts-ignore - Ignore TypeScript checking for this import
import { getUpcomingMeets } from '../../../../firebase/database';

export const UpcomingMeets: React.FC = () => {
  const navigate = useNavigate();
  const [upcomingMeets, setUpcomingMeets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        setLoading(true);
        const meets = await getUpcomingMeets();
        
        // Transform the data to match the component's expected format
        const transformedMeets = meets.map(meet => {
          // Calculate days until the meet
          const meetDate = new Date(meet.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const diffTime = meetDate.getTime() - today.getTime();
          const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Format date to "Month Day, Year"
          const formattedDate = meetDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          // Determine status display
          let statusDisplay = 'Registration Open';
          if (meet.status === 'published') {
            statusDisplay = 'Published';
          } else if (meet.status === 'registration-closed') {
            statusDisplay = 'Registration Closed';
          }
          
          return {
            id: meet.id,
            name: meet.name,
            date: formattedDate,
            location: meet.location.venue,
            city: `${meet.location.city}, ${meet.location.state}`,
            federation: meet.federation,
            weightClass: meet.weightClasses ? meet.weightClasses.join(', ') : 'TBD',
            status: statusDisplay,
            daysUntil: daysUntil > 0 ? daysUntil : 0,
            flightTime: 'TBD' // We don't have this field in Firebase
          };
        });
        
        setUpcomingMeets(transformedMeets);
      } catch (err) {
        console.error('Error fetching meets:', err);
        setError('Failed to load upcoming meets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeets();
  }, []);

  if (loading) {
    return (
      <div className={`${tw.glassCard} ${tw.glassCardHover} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-[var(--action-green-to)] mr-3" />
            <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">Upcoming Meets</h3>
          </div>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-[color:var(--text-secondary)]">Loading meets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${tw.glassCard} ${tw.glassCardHover} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-[var(--action-green-to)] mr-3" />
            <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">Upcoming Meets</h3>
          </div>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-[var(--action-red-from)]">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${tw.glassCard} ${tw.glassCardHover} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="w-6 h-6 text-[var(--action-green-to)] mr-3" />
          <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">Upcoming Meets</h3>
        </div>
        <button className={`text-[var(--action-green-to)] hover:text-[var(--action-green-hover)] text-sm font-medium transition-colors`}>
          View All
        </button>
      </div>
      
      {upcomingMeets.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-[color:var(--text-secondary)]">No upcoming meets found</div>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingMeets.map((meet) => (
            <div key={meet.id} className={`${tw.glassCard} p-4 hover:border-[color:var(--glass-border-hover)] transition-colors`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-[color:var(--text-primary)]">{meet.name}</h4>
                  <p className="text-sm text-[color:var(--text-secondary)]">{meet.federation} • {meet.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[var(--action-green-to)]">{meet.daysUntil}</p>
                  <p className="text-xs text-[color:var(--text-tertiary)]">days</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="flex items-center text-[color:var(--text-secondary)]">
                  <MapPin className="w-4 h-4 text-[color:var(--text-tertiary)] mr-2" />
                  <span>{meet.location}</span>
                </div>
                <div className="flex items-center text-[color:var(--text-secondary)]">
                  <Clock className="w-4 h-4 text-[color:var(--text-tertiary)] mr-2" />
                  <span>{meet.flightTime}</span>
                </div>
                <div className="flex items-center text-[color:var(--text-secondary)]">
                  <Trophy className="w-4 h-4 text-[color:var(--text-tertiary)] mr-2" />
                  <span>{meet.weightClass}</span>
                </div>
                <div className="flex items-center text-[color:var(--text-secondary)]">
                  <Users className="w-4 h-4 text-[color:var(--text-tertiary)] mr-2" />
                  <span className={
                    meet.status === 'Registered'
                      ? 'text-[var(--action-green-to)]'
                      : meet.status === 'Registration Open'
                      ? 'text-[var(--action-yellow-to)]'
                      : 'text-[color:var(--text-tertiary)]'
                  }>
                    {meet.status}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/compete/meet/${meet.id}`)}
                className={`w-full ${getButtonClass('yellow')} py-2 px-4 rounded-lg font-medium`}
              >
                View Meet Details
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-[color:var(--glass-border)]">
        <div className="grid grid-cols-2 gap-3">
          <button className={` ${getButtonClass('red')} text-white py-2 px-4 rounded-lg font-medium text-sm`}>
            Find More Meets
          </button>
          <button className={` ${getButtonClass('green')} text-white py-2 px-4 rounded-lg font-medium text-sm`}>
            Meet History
          </button>
        </div>
      </div>
    </div>
  );
};