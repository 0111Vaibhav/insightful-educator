
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GradingOverview from '@/components/GradingOverview';
import PerformanceCard from '@/components/PerformanceCard';
import ClassStats from '@/components/ClassStats';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  useEffect(() => {
    document.title = 'Dashboard | Insightful Educator';
  }, []);

  return (
    <div className="min-h-screen bg-educator-light">
      <Navbar />
      
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 pb-12">
        <div className="mb-8 page-transition">
          <h1 className="text-3xl font-semibold text-educator-dark">Educator Dashboard</h1>
          <p className="text-educator-muted mt-2">Real-time insights into student performance</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GradingOverview />
          <PerformanceCard />
        </div>
        
        <div>
          <ClassStats />
        </div>
      </main>
    </div>
  );
};

export default Index;
