import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Trophy, 
  Star,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getMeetById, type MeetData } from '../../../../../firebase/database';
import MeetRegistrationModal from './MeetRegistrationModal';
import { RegistrationService, MeetRegistration } from '../../../../../services/athlete/registration';
import { useAuth } from '../../../../../contexts/shared/AuthContext';
import { tw, getButtonClass, getBadgeClass } from '../../../../../styles/theme';

export const MeetDetailsPage: React.FC = () => {
  const { meetId } = useParams<{ meetId: string }>();
  const navigate = useNavigate();
  const { currentUser: user } = useAuth();
  const [meet, setMeet] = useState<MeetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRegistration, setUserRegistration] = useState<MeetRegistration | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<MeetRegistration | null>(null);

  useEffect(() => {
    if (meetId) {
      fetchMeet();
      if (user) {
        checkUserRegistration();
      }
    } else {
      setError('Meet ID not provided');
      setLoading(false);
    }
  }, [meetId, user]);

  const fetchMeet = async () => {
    if (!meetId) return;
    
    try {
      setLoading(true);
      setError(null);
      const meetData = await getMeetById(meetId);
      
      if (meetData) {
        setMeet(meetData);
      } else {
        setError('Meet not found');
      }
    } catch (err) {
      setError('Failed to load meet details. Please try again.');
      console.error('Error fetching meet:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistration = async () => {
    if (!user || !meetId) return;
    
    try {
      setCheckingRegistration(true);
      const registration = await RegistrationService.getUserRegistration(meetId, user.uid);
      setUserRegistration(registration);
    } catch (error) {
      console.error('Error checking user registration:', error);
      setUserRegistration(null);
    } finally {
      setCheckingRegistration(false);
    }
  };

  const handleOpenRegistration = () => {
    if (!user) {
      alert('Please sign in to register for meets.');
      return;
    }
    setIsRegistrationModalOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleRegistrationComplete = (registration: MeetRegistration) => {
    setRegistrationSuccess(registration);
    setUserRegistration(registration);
    setIsRegistrationModalOpen(false);
    
    alert('Registration successful! You will receive a confirmation email shortly.');
    
    if (meetId) {
      fetchMeet();
    }
  };

  const formatDate = (date: Date | any) => {
    let actualDate: Date;
    
    if (date?.toDate) {
      actualDate = date.toDate();
    } else if (date instanceof Date) {
      actualDate = date;
    } else {
      actualDate = new Date(date);
    }
    
    return actualDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date | any) => {
    let actualDate: Date;
    
    if (date?.toDate) {
      actualDate = date.toDate();
    } else if (date instanceof Date) {
      actualDate = date;
    } else {
      actualDate = new Date(date);
    }
    
    return actualDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isRegistrationOpen = () => {
    if (!meet) return false;
    const now = new Date();
    
    let deadlineDate: Date;
    if (meet.registrationDeadline?.toDate) {
      deadlineDate = meet.registrationDeadline.toDate();
    } else if (meet.registrationDeadline instanceof Date) {
      deadlineDate = meet.registrationDeadline;
    } else {
      deadlineDate = new Date(meet.registrationDeadline);
    }
    
    return now < deadlineDate && meet.status === 'published';
  };

  const spotsRemaining = () => {
    if (!meet) return 0;
    return meet.maxParticipants - (meet.registrations || 0);
  };

  const renderRegistrationCard = () => {
    return (
      <div className="space-y-4">
        {userRegistration && (
          <div className={`${tw.glassCard} p-6`}>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-1">Registration Complete!</h4>
              <p className={`${tw.textSecondary} text-sm mb-4`}>
                Why aren't you training?!
              </p>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className={tw.textTertiary}>Weight Class:</span>
                  <span className="text-white font-semibold">{userRegistration.weightClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className={tw.textTertiary}>Division:</span>
                  <span className="text-white font-semibold">{userRegistration.division}</span>
                </div>
                <div className="flex justify-between">
                  <span className={tw.textTertiary}>Equipment:</span>
                  <span className="text-white font-semibold">{userRegistration.equipment}</span>
                </div>
                <div className="flex justify-between">
                  <span className={tw.textTertiary}>Status:</span>
                  <span className={`font-semibold ${
                    userRegistration.registrationStatus === 'approved' ? 'text-green-400' :
                    userRegistration.registrationStatus === 'pending' ? 'text-yellow-400' :
                    userRegistration.registrationStatus === 'waitlisted' ? 'text-red-400' :
                    'text-white/40'
                  }`}>
                    {userRegistration.registrationStatus.charAt(0).toUpperCase() + userRegistration.registrationStatus.slice(1)}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/train')}
                className={getButtonClass('blue')}
              >
                Get Back to Training
              </button>
            </div>
          </div>
        )}

        {!userRegistration && !isRegistrationOpen() && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Registration Closed</h4>
            <p className={`${tw.textTertiary} text-sm mb-4`}>
              {meet?.status !== 'published' 
                ? 'This meet is not yet published'
                : 'The registration deadline has passed'
              }
            </p>
            <button 
              onClick={() => navigate('/compete')}
              className={`${tw.glassCard} ${tw.glassCardHover} px-4 py-2 rounded-xl transition-all duration-300`}
            >
              Find Other Meets
            </button>
          </div>
        )}

        {!userRegistration && isRegistrationOpen() && (
          <>
            {registrationSuccess && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-300 text-sm font-medium">
                    Registration submitted successfully!
                  </span>
                </div>
              </div>
            )}

            <div className={`${tw.glassCard} p-4`}>
              <div className="flex items-center justify-between">
                <span className={tw.textSecondary}>Registration Fee:</span>
                <span className="text-xl font-bold text-white">
                  ${meet?.earlyBirdDeadline && new Date() < new Date(meet.earlyBirdDeadline) 
                    ? meet.earlyBirdFee || meet.registrationFee
                    : meet?.registrationFee
                  }
                </span>
              </div>
              {meet?.earlyBirdDeadline && new Date() < new Date(meet.earlyBirdDeadline) && (
                <div className="text-sm text-green-400 mt-1">
                  Early bird pricing active!
                </div>
              )}
            </div>

            <button 
              onClick={handleOpenRegistration}
              disabled={checkingRegistration}
              className={`w-full ${getButtonClass('green')} flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {checkingRegistration ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Checking Registration...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Register Now
                </>
              )}
            </button>

            <div className={`text-xs ${tw.textTertiary} text-center`}>
              You'll receive a confirmation email after registration
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/compete')}
              className={`flex items-center ${tw.textTertiary} hover:text-white transition-colors mr-4`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Competitions
            </button>
          </div>
          <div className={`${tw.glassCard} p-8`}>
            <div className="animate-pulse">
              <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-white/10 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-48 bg-white/10 rounded"></div>
                  <div className="h-32 bg-white/10 rounded"></div>
                </div>
                <div className="h-64 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/compete')}
              className={`flex items-center ${tw.textTertiary} hover:text-white transition-colors mr-4`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Competitions
            </button>
          </div>
          <div className={`${tw.glassCard} border border-red-500/30 p-8 text-center`}>
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Meet</h2>
            <p className={`${tw.textTertiary} mb-6`}>{error}</p>
            <div className="space-x-4">
              <button 
                onClick={fetchMeet}
                className={getButtonClass('red')}
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate('/compete')}
                className={`${tw.glassCard} ${tw.glassCardHover} px-6 py-2 rounded-xl transition-all duration-300`}
              >
                Back to Competitions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!meet) {
    return null;
  }

  const meetDate = new Date(meet.date);
  const registrationDeadline = new Date(meet.registrationDeadline);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/compete')}
            className={`flex items-center ${tw.textTertiary} hover:text-white transition-colors mr-4`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Competitions
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Meet Header */}
            <div className={`${tw.glassCard} p-8`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{meet.name}</h1>
                  <div className="flex items-center mb-4">
                    <span className={`${getBadgeClass('blue')} mr-3`}>
                      {meet.federation}
                    </span>
                    <span className={getBadgeClass(
                      meet.status === 'published' ? 'green' :
                      meet.status === 'draft' ? 'yellow' : 'gray'
                    )}>
                      {meet.status.charAt(0).toUpperCase() + meet.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {spotsRemaining()}
                  </div>
                  <div className={`text-sm ${tw.textTertiary}`}>spots remaining</div>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">{formatDate(meetDate)}</div>
                    <div className={`text-sm ${tw.textTertiary}`}>{formatTime(meetDate)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">
                      {typeof meet.location === 'string' ? meet.location : meet.location.venue}
                    </div>
                    <div className={`text-sm ${tw.textTertiary}`}>
                      {typeof meet.location === 'object' && 
                        `${meet.location.city}, ${meet.location.state}`
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">
                      {meet.registrations || 0} / {meet.maxParticipants} registered
                    </div>
                    <div className={`text-sm ${tw.textTertiary}`}>Participants</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-6 h-6 text-red-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">${meet.registrationFee}</div>
                    <div className={`text-sm ${tw.textTertiary}`}>Entry Fee</div>
                  </div>
                </div>
              </div>

              {/* Registration Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${tw.textTertiary}`}>Registration Progress</span>
                  <span className={`text-sm ${tw.textTertiary}`}>
                    {Math.round(((meet.registrations || 0) / meet.maxParticipants) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((meet.registrations || 0) / meet.maxParticipants) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Competition Categories */}
            <div className={`${tw.glassCard} p-8`}>
              <h2 className="text-xl font-semibold text-white mb-6">Competition Categories</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-white mb-3 flex items-center">
                    <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                    Weight Classes
                  </h3>
                  <div className="space-y-2">
                    {meet.weightClasses.map((wc, index) => (
                      <div key={index} className={`text-sm ${tw.textSecondary} ${tw.glassCard} px-3 py-1 rounded`}>
                        {wc}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-3 flex items-center">
                    <Users className="w-5 h-5 text-blue-400 mr-2" />
                    Divisions
                  </h3>
                  <div className="space-y-2">
                    {meet.divisions.map((div, index) => (
                      <div key={index} className={`text-sm ${tw.textSecondary} ${tw.glassCard} px-3 py-1 rounded`}>
                        {div}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-3 flex items-center">
                    <Star className="w-5 h-5 text-green-400 mr-2" />
                    Equipment
                  </h3>
                  <div className="space-y-2">
                    {meet.equipment.map((eq, index) => (
                      <div key={index} className={`text-sm ${tw.textSecondary} ${tw.glassCard} px-3 py-1 rounded`}>
                        {eq}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className={`${tw.glassCard} p-8`}>
              <h2 className="text-xl font-semibold text-white mb-6">Important Dates</h2>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 ${tw.glassCard} rounded-xl`}>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-red-400 mr-3" />
                    <div>
                      <div className="font-medium text-white">Registration Deadline</div>
                      <div className={`text-sm ${tw.textTertiary}`}>Final day to register</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{formatDate(registrationDeadline)}</div>
                    <div className={`text-sm ${tw.textTertiary}`}>{formatTime(registrationDeadline)}</div>
                  </div>
                </div>
                {meet.earlyBirdDeadline && (
                  <div className={`flex items-center justify-between p-4 ${tw.glassCard} rounded-xl`}>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-3" />
                      <div>
                        <div className="font-medium text-white">Early Bird Deadline</div>
                        <div className={`text-sm ${tw.textTertiary}`}>Save ${meet.registrationFee - (meet.earlyBirdFee || 0)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        {formatDate(new Date(meet.earlyBirdDeadline))}
                      </div>
                      <div className={`text-sm ${tw.textTertiary}`}>
                        {formatTime(new Date(meet.earlyBirdDeadline))}
                      </div>
                    </div>
                  </div>
                )}
                <div className={`flex items-center justify-between p-4 ${tw.glassCard} rounded-xl`}>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-green-400 mr-3" />
                    <div>
                      <div className="font-medium text-white">Competition Date</div>
                      <div className={`text-sm ${tw.textTertiary}`}>Meet day</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{formatDate(meetDate)}</div>
                    <div className={`text-sm ${tw.textTertiary}`}>{formatTime(meetDate)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Registration */}
          <div className="space-y-6">
            <div className={`${tw.glassCard} p-6 sticky top-6`}>
              <h3 className="text-xl font-semibold text-white mb-6">Register for Meet</h3>
              {renderRegistrationCard()}
            </div>

            <div className={`${tw.glassCard} p-6`}>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className={`w-full ${tw.glassCard} ${tw.glassCardHover} py-2 px-4 rounded-xl transition-all duration-300 text-left flex items-center`}>
                  <Calendar className="w-4 h-4 mr-3" />
                  Add to Calendar
                </button>
                <button className={`w-full ${tw.glassCard} ${tw.glassCardHover} py-2 px-4 rounded-xl transition-all duration-300 text-left flex items-center`}>
                  <ExternalLink className="w-4 h-4 mr-3" />
                  Share Meet
                </button>
                <button className={`w-full ${tw.glassCard} ${tw.glassCardHover} py-2 px-4 rounded-xl transition-all duration-300 text-left flex items-center`}>
                  <Star className="w-4 h-4 mr-3" />
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {meet && user && (
        <MeetRegistrationModal
          meet={meet}
          userId={user.uid}
          isOpen={isRegistrationModalOpen}
          onClose={handleCloseRegistration}
          onRegistrationComplete={handleRegistrationComplete}
        />
      )}
    </div>
  );
};

export default MeetDetailsPage;