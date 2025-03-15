
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronUp } from 'lucide-react';

const PerformanceCard: React.FC = () => {
  const [performance, setPerformance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/student-data.json');
        const data = await response.json();
        setPerformance(data.performance);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="educator-card animate-pulse h-64 flex items-center justify-center">
        <p className="text-educator-muted">Loading performance data...</p>
      </div>
    );
  }

  // Find the difference between this month and last month
  const latestMonth = performance.monthly[performance.monthly.length - 1];
  const previousMonth = performance.monthly[performance.monthly.length - 2];
  const difference = latestMonth.average - previousMonth.average;
  const percentChange = ((difference / previousMonth.average) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-100 rounded-md shadow-sm">
          <p className="text-sm font-medium">{`${label}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="educator-card animate-fade-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Performance Trends</h2>
        <span className={`flex items-center text-sm font-medium ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {difference >= 0 ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronUp className="h-4 w-4 mr-1 transform rotate-180" />}
          {Math.abs(difference)}% ({percentChange}%)
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={performance.monthly}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#86868B' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#86868B' }}
              domain={[60, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
            <Bar 
              dataKey="average" 
              fill="rgba(10, 132, 255, 0.8)" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {performance.classComparison.map((item: any, index: number) => {
          const diff = item.thisMonth - item.lastMonth;
          return (
            <div key={index} className="flex flex-col p-3 border border-gray-100 rounded-lg">
              <span className="text-sm text-educator-muted mb-1">{item.class}</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{item.thisMonth}%</span>
                <span className={`text-xs ${diff >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {diff >= 0 ? '+' : ''}{diff}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceCard;
