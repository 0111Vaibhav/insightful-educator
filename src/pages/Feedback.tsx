
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FeedbackTemplate from '@/components/FeedbackTemplate';
import { useIsMobile } from '@/hooks/use-mobile';

const Feedback = () => {
  useEffect(() => {
    document.title = 'Feedback | Insightful Educator';
  }, []);

  return (
    <div className="min-h-screen bg-educator-light">
      <Navbar />
      
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 pb-12">
        <div className="mb-8 page-transition">
          <h1 className="text-3xl font-semibold text-educator-dark">Feedback Management</h1>
          <p className="text-educator-muted mt-2">Create and customize feedback templates for students</p>
        </div>
        
        <div className="mb-6">
          <FeedbackTemplate />
        </div>
        
        <div className="educator-card animate-fade-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Feedback Best Practices</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <h3 className="font-medium mb-3">Be Specific</h3>
              <p className="text-sm text-educator-muted">Provide concrete examples and specific observations rather than general comments. This helps students understand exactly what they did well or need to improve.</p>
            </div>
            
            <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <h3 className="font-medium mb-3">Balance Positive & Constructive</h3>
              <p className="text-sm text-educator-muted">Start with strengths before addressing areas for improvement. A balanced approach helps maintain student motivation and confidence.</p>
            </div>
            
            <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <h3 className="font-medium mb-3">Provide Next Steps</h3>
              <p className="text-sm text-educator-muted">Always include actionable suggestions for improvement. Give students clear guidance on what they can do to develop their skills further.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
