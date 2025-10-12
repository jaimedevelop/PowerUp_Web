// meets/components/dashboardTabs/flightsTab/components/FlightValidationAlert.tsx

import React from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import { FlightValidationIssue } from '../types/flight-types';

interface FlightValidationAlertProps {
  issues: FlightValidationIssue[];
  onDismiss?: () => void;
}

export const FlightValidationAlert: React.FC<FlightValidationAlertProps> = ({
  issues,
  onDismiss,
}) => {
  if (issues.length === 0) return null;

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  return (
    <div className="space-y-2">
      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-300 mb-2">
                  Critical Issues Found ({errors.length})
                </h4>
                <ul className="space-y-1">
                  {errors.map((issue, idx) => (
                    <li key={idx} className="text-sm text-red-200">
                      • {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="ml-2 p-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-yellow-300 mb-2">
                  Warnings ({warnings.length})
                </h4>
                <ul className="space-y-1">
                  {warnings.map((issue, idx) => (
                    <li key={idx} className="text-sm text-yellow-200">
                      • {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="ml-2 p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};