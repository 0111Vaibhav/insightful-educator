
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Student = {
  id: number;
  name: string;
  avatar: string;
  grades: Array<{
    assignment: string;
    score: number;
    date: string;
  }>;
  attendance: number;
  participation: number;
};

const StudentProgress: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/student-data.json');
        const data = await response.json();
        // Flatten all students from all classes
        const allStudents = data.classes.flatMap((cls: any) => cls.students);
        setStudents(allStudents);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="educator-card animate-pulse h-64 flex items-center justify-center">
        <p className="text-educator-muted">Loading student progress data...</p>
      </div>
    );
  }

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate trend for each student (comparing their latest 2 grades)
  const getStudentTrend = (student: Student) => {
    if (student.grades.length < 2) return 0;
    
    // Sort grades by date (newest first)
    const sortedGrades = [...student.grades].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sortedGrades[0].score - sortedGrades[1].score;
  };

  // Render trend indicator
  const renderTrend = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="educator-card animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium">Student Progress</h2>
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-educator-blue transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-sm font-medium text-educator-muted">STUDENT</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-educator-muted">LATEST GRADE</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-educator-muted">AVERAGE</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-educator-muted">TREND</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-educator-muted">ATTENDANCE</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              // Calculate average grade
              const avgGrade = student.grades.length > 0 
                ? student.grades.reduce((sum, g) => sum + g.score, 0) / student.grades.length 
                : 0;
              
              // Get latest grade
              const latestGrade = student.grades.length > 0 
                ? student.grades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
                : null;
              
              // Calculate trend
              const trend = getStudentTrend(student);
              
              return (
                <tr 
                  key={student.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {latestGrade ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{latestGrade.score}%</span>
                        <span className="text-xs text-educator-muted">{latestGrade.assignment}</span>
                      </div>
                    ) : (
                      <span className="text-educator-muted">No grades</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {avgGrade.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {renderTrend(trend)}
                      <span className={
                        trend > 0 ? 'text-green-500' : 
                        trend < 0 ? 'text-red-500' : 
                        'text-gray-400'
                      }>
                        {Math.abs(trend) > 0 ? `${Math.abs(trend)}%` : '–'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div 
                          className={`rounded-full h-2 ${
                            student.attendance >= 90 ? 'bg-green-500' :
                            student.attendance >= 80 ? 'bg-blue-500' :
                            student.attendance >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                      <span>{student.attendance}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredStudents.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-educator-muted">No students found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
