import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { fetchClasses, GradeData } from '@/services/firebaseService';
import { useQuery } from '@tanstack/react-query';

const GradingOverview: React.FC = () => {
  const isMobile = useIsMobile();
  
  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses
  });

  if (isLoading) {
    return (
      <div className="educator-card animate-pulse h-64 flex items-center justify-center">
        <p className="text-educator-muted">Loading grading overview...</p>
      </div>
    );
  }
  
  if (error || !classes) {
    return (
      <div className="educator-card h-64 flex items-center justify-center">
        <p className="text-red-500">Error loading data. Please try again later.</p>
      </div>
    );
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-500';
    if (grade >= 80) return 'text-blue-500';
    if (grade >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (index: number) => {
    // Just for demonstration purposes
    if (index === 0) return <Check className="h-4 w-4 text-green-500" />;
    if (index === 1) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="educator-card animate-fade-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Real-time Grading Overview</h2>
        <span className="text-educator-blue text-sm font-medium">Last updated: Just now</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div 
            key={classItem.id} 
            className="border border-gray-100 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">{classItem.name}</h3>
              <span className={`font-medium ${getGradeColor(classItem.averageGrade)}`}>
                {classItem.averageGrade}%
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-educator-muted mb-2">Recent Assignments</p>
              {classItem.recentAssignments.map((assignment, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center">
                    {getStatusIcon(idx)}
                    <span className="ml-2">{assignment}</span>
                  </div>
                  <span className="text-xs bg-educator-gray px-2 py-1 rounded-full">
                    {idx === 0 ? 'New' : idx === 1 ? 'In Progress' : 'Needs Review'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-educator-muted">
                {classItem.students.length} Students
              </span>
              <button className="text-educator-blue text-sm font-medium hover:underline">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradingOverview;
