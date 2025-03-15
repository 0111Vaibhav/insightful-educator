
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ClassStats: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/student-data.json');
        const data = await response.json();
        setClasses(data.classes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching class data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="educator-card animate-pulse h-64 flex items-center justify-center">
        <p className="text-educator-muted">Loading class statistics...</p>
      </div>
    );
  }

  // Generate grade distribution data for pie chart
  const gradeRanges = [
    { name: 'A (90-100)', range: [90, 100], color: '#34C759' },
    { name: 'B (80-89)', range: [80, 89], color: '#0A84FF' },
    { name: 'C (70-79)', range: [70, 79], color: '#FF9F0A' },
    { name: 'D (60-69)', range: [60, 69], color: '#FF3B30' },
    { name: 'F (<60)', range: [0, 59], color: '#8E8E93' }
  ];

  // Compile all student grades
  const allGrades = classes.flatMap(cls => 
    cls.students.flatMap(student => 
      student.grades.map((g: any) => g.score)
    )
  );
  
  // Count grades in each range
  const gradeDistribution = gradeRanges.map(range => {
    const count = allGrades.filter(
      grade => grade >= range.range[0] && grade <= range.range[1]
    ).length;
    
    return {
      name: range.name,
      value: count,
      color: range.color
    };
  });

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-100 rounded-md shadow-sm">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value} students`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="educator-card animate-fade-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Grade Distribution</h2>
        <span className="text-educator-blue text-sm font-medium">
          Total: {allGrades.length} Grades
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gradeDistribution}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1500}
              animationBegin={300}
            >
              {gradeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {classes.map((cls, index) => (
          <div key={index} className="flex flex-col p-3 border border-gray-100 rounded-lg">
            <span className="text-sm text-educator-muted mb-1">{cls.name}</span>
            <span className="text-lg font-medium">{cls.students.length} Students</span>
            <div className="mt-2">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-educator-blue rounded-full h-2"
                  style={{ width: `${cls.averageGrade}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-educator-muted mt-1">
                <span>Average: {cls.averageGrade}%</span>
                <span>Highest: {Math.max(...cls.students.flatMap((s: any) => s.grades.map((g: any) => g.score)))}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassStats;
