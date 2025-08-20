// Empty State Component - Pure UI component
import React from 'react';

interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  icon = "📊"
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-2" style={{ fontSize: '2rem' }}>
          {icon}
        </div>
        <div className="text-gray-500 font-medium mb-2">
          {message}
        </div>
        {description && (
          <div className="text-gray-400 text-sm">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};