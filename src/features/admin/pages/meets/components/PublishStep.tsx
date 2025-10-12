// src/admin/components/meets/PublishStep.tsx
import React, { useState } from 'react';
import { Check, Calendar, MapPin, DollarSign, Users, Weight, Shirt, Clock, Eye, Save } from 'lucide-react';
import { MeetStatus, StepComponentProps } from '../../../../../types/admin/meet-types';
import { BaseMeetData } from '../../../../../firebase';

export const PublishStep: React.FC<StepComponentProps> = ({
  data,
  updateData,
  onPrev,
  isSubmitting,
  onSubmit,
}) => {
  const [publishStatus, setPublishStatus] = useState<MeetStatus>('draft');
  const [checklistItems, setChecklistItems] = useState<boolean[]>([
    false, // Meet details are accurate and complete
    false, // Weight classes and divisions are properly configured
    false, // Registration fees and deadlines are set correctly
    false, // Venue information has been verified
    false, // Equipment categories match your meet format
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleChecklistChange = (index: number, checked: boolean) => {
    const updatedItems = [...checklistItems];
    updatedItems[index] = checked;
    setChecklistItems(updatedItems);
  };

  const allItemsChecked = checklistItems.every(item => item);

  // FIXED: Pass status directly to onSubmit instead of trying to update state first
  const handlePublish = (status: MeetStatus) => {
    console.log('=== DEBUG: PublishStep handlePublish ===');
    console.log('1. Button clicked with status:', status);
    console.log('2. Current data.status before submit:', data.status);
    
    setPublishStatus(status);
    
    // Pass the status directly to onSubmit so it can be included in the save operation
    if (onSubmit) {
      console.log('3. Calling onSubmit with status override:', status);
      onSubmit(status);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Review & Publish</h2>
        <p className="text-slate-400">
          Review all meet details before publishing. You can save as draft or publish immediately.
        </p>
      </div>
      
      {/* Meet Overview */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">{data.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar size={20} className="text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium">Competition Date</div>
                <div className="text-slate-300">{formatDate(data.date)}</div>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin size={20} className="text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium">Location</div>
                <div className="text-slate-300">
                  {data.location.venue}<br />
                  {data.location.address && `${data.location.address}<br />`}
                  {data.location.city}, {data.location.state}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <Users size={20} className="text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium">Federation</div>
                <div className="text-slate-300">{data.federation}</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <DollarSign size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium">Registration Fee</div>
                <div className="text-slate-300">
                  {formatCurrency(data.registrationFee)}
                  {data.earlyBirdDeadline && data.earlyBirdFee && (
                    <span className="text-green-400 text-sm ml-2">
                      (Early Bird: {formatCurrency(data.earlyBirdFee)})
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <Clock size={20} className="text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium">Registration Deadline</div>
                <div className="text-slate-300">{formatDate(data.registrationDeadline)}</div>
                {data.earlyBirdDeadline && (
                  <div className="text-yellow-400 text-sm">
                    Early Bird: {formatDate(data.earlyBirdDeadline)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-start">
              <Users size={20} className="text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium">Max Participants</div>
                <div className="text-slate-300">{data.maxParticipants} athletes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Competition Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Weight size={16} className="mr-2" />
            Weight Classes ({data.weightClasses.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.weightClasses.map((weightClass) => (
              <div key={weightClass} className="text-slate-300 text-sm">
                {weightClass}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Users size={16} className="mr-2" />
            Divisions ({data.divisions.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.divisions.map((division) => (
              <div key={division} className="text-slate-300 text-sm">
                {division}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Shirt size={16} className="mr-2" />
            Equipment ({data.equipment.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.equipment.map((equipment) => (
              <div key={equipment} className="text-slate-300 text-sm">
                {equipment}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pre-publish Checklist */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
        <h3 className="text-white font-bold mb-4">Pre-publish Checklist</h3>
        <div className="space-y-3">
          {[
            'Meet details are accurate and complete',
            'Weight classes and divisions are properly configured',
            'Registration fees and deadlines are set correctly',
            'Venue information has been verified',
            'Equipment categories match your meet format',
          ].map((item, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                checked={checklistItems[index]}
                onChange={(e) => handleChecklistChange(index, e.target.checked)}
                className="mr-3 h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
              />
              <span className="text-slate-300">{item}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Current Status Display */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <div className="text-white font-medium mb-2">Current Status</div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          data.status === 'published' 
            ? 'bg-green-900 text-green-300' 
            : 'bg-yellow-900 text-yellow-300'
        }`}>
          {data.status === 'published' ? 'Published' : 'Draft'}
        </div>
      </div>
      
      {/* Publish Options */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handlePublish('draft')}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center px-6 py-4 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} className="mr-2" />
          {isSubmitting && publishStatus === 'draft' ? 'Saving Draft...' : 'Save as Draft'}
        </button>
        
        <button
          onClick={() => handlePublish('published')}
          disabled={isSubmitting || !allItemsChecked}
          className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye size={20} className="mr-2" />
          {isSubmitting && publishStatus === 'published' ? 'Publishing Meet...' : 'Publish Meet'}
        </button>
      </div>
      
      <div className="text-center text-sm text-slate-400">
        <p>
          <strong>Draft:</strong> Save your progress. Meet will not be visible to athletes.<br />
          <strong>Publish:</strong> Make meet public and open for registration.
        </p>
        {!allItemsChecked && (
          <p className="mt-2 text-yellow-400">
            Please complete all checklist items before publishing.
          </p>
        )}
      </div>
    </div>
  );
};