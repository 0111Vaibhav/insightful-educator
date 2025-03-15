
import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

type AnalyticsChartProps = {
  data: any[];
  type: 'line' | 'bar' | 'scatter';
  title: string;
  dataKeys: string[];
  colors?: string[];
};

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  data, 
  type, 
  title, 
  dataKeys,
  colors = ['#0A84FF', '#34C759', '#FF9F0A', '#FF3B30']
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#86868B' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#86868B' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
                animationBegin={index * 300}
              />
            ))}
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#86868B' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#86868B' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={index * 300}
              />
            ))}
          </BarChart>
        );
      
      case 'scatter':
        return (
          <ScatterChart
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
            <XAxis 
              dataKey={dataKeys[0]} 
              name={dataKeys[0]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#86868B' }}
            />
            <YAxis 
              dataKey={dataKeys[1]} 
              name={dataKeys[1]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#86868B' }}
            />
            {dataKeys.length > 2 && (
              <ZAxis dataKey={dataKeys[2]} range={[50, 400]} name={dataKeys[2]} />
            )}
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Scatter 
              name={title} 
              data={data} 
              fill={colors[0]}
              animationDuration={1500}
            />
          </ScatterChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`educator-card transition-all duration-500 overflow-hidden animate-fade-up ${
      isExpanded ? 'h-[500px]' : 'h-80'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">{title}</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-educator-blue text-sm font-medium hover:underline"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <div className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
