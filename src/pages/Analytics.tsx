
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AnalyticsChart from '@/components/AnalyticsChart';
import StudentProgress from '@/components/StudentProgress';
import { useIsMobile } from '@/hooks/use-mobile';

const Analytics = () => {
  const [chartData, setChartData] = useState<any>({
    performance: [],
    attendance: [],
    participation: [],
    correlation: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'Analytics | Insightful Educator';
    
    const fetchData = async () => {
      try {
        const response = await fetch('/student-data.json');
        const data = await response.json();
        
        // Process data for charts
        const performanceData = data.performance.monthly.map((item: any) => ({
          name: item.month,
          average: item.average
        }));
        
        // Get students data for other charts
        const allStudents = data.classes.flatMap((cls: any) => cls.students);
        
        // Attendance data by class
        const attendanceData = data.classes.map((cls: any) => {
          const result: any = { name: cls.name };
          result.attendance = cls.students.reduce((sum: number, student: any) => sum + student.attendance, 0) / cls.students.length;
          return result;
        });
        
        // Participation data for classes
        const participationData = data.classes.map((cls: any) => {
          const result: any = { name: cls.name };
          result.participation = cls.students.reduce((sum: number, student: any) => sum + student.participation, 0) / cls.students.length;
          result.grades = cls.averageGrade;
          return result;
        });
        
        // Correlation between attendance and grades
        const correlationData = allStudents.map((student: any) => {
          const avgGrade = student.grades.reduce((sum: number, g: any) => sum + g.score, 0) / student.grades.length;
          return {
            name: student.name,
            attendance: student.attendance,
            grades: avgGrade,
            participation: student.participation
          };
        });
        
        setChartData({
          performance: performanceData,
          attendance: attendanceData,
          participation: participationData,
          correlation: correlationData
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-educator-light flex items-center justify-center">
        <p className="text-educator-muted">Loading analytics data...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-educator-light">
      <Navbar />
      
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 pb-12">
        <div className="mb-8 page-transition">
          <h1 className="text-3xl font-semibold text-educator-dark">Analytics & Insights</h1>
          <p className="text-educator-muted mt-2">Detailed performance metrics and student progress</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AnalyticsChart 
            data={chartData.performance} 
            type="line" 
            title="Grade Performance Trends" 
            dataKeys={['average']}
          />
          <AnalyticsChart 
            data={chartData.attendance} 
            type="bar" 
            title="Attendance by Class" 
            dataKeys={['attendance']}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AnalyticsChart 
            data={chartData.participation} 
            type="bar" 
            title="Participation vs Grades" 
            dataKeys={['participation', 'grades']}
            colors={['#34C759', '#0A84FF']}
          />
          <AnalyticsChart 
            data={chartData.correlation} 
            type="scatter" 
            title="Attendance vs Performance Correlation" 
            dataKeys={['attendance', 'grades', 'participation']}
          />
        </div>
        
        <div className="mb-6">
          <StudentProgress />
        </div>
      </main>
    </div>
  );
};

export default Analytics;
