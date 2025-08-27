// src/pages/DriverSummary.jsx
import React, { useEffect, useState } from 'react';
import { fetchDriverStats } from '../../../Services/DriverService/driverReservationService';
import {
  Calendar,
  DollarSign,
  UserCheck,
  BarChart3,
  TrendingUp,
  Activity,
  Loader2
} from 'lucide-react';

function DriverSummary() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      key: 'totalReservations',
      label: 'Total Rides',
      color: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      icon: Calendar,
      description: 'All reservations assigned to you',
    },
    {
      key: 'assignedCount',
      label: 'Assigned Rides',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      icon: UserCheck,
      description: 'Trips waiting for action',
    },
    {
      key: 'completedCount',
      label: 'Completed Rides',
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      icon: BarChart3,
      description: 'Successfully finished trips',
    },
    {
      key: 'totalEarnings',
      label: 'Earnings ($)',
      color: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      icon: DollarSign,
      description: 'Total earnings from rides',
    },
    {
      key: 'driverRatingCount',
      label: 'Ratings Received',
      color: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      icon: Activity,
      description: 'Number of reviews given to you',
    },
  ];

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const data = await fetchDriverStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch driver stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" />
          <p className="text-blue-600 font-medium">Loading driver summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Driver Summary</h1>
        </div>
        <p className="text-gray-600 flex items-center space-x-2">
          <Activity className="h-4 w-4" />
          <span>Overview of your driving activity</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const IconComponent = card.icon;
          const isHovered = hoveredCard === card.key;
          const value = stats?.[card.key] ?? 0;
          return (
            <div
              key={card.key}
              className={`relative rounded-2xl p-4 border-2 transition-all duration-300 cursor-pointer
                ${card.color} ${card.borderColor} ${isHovered ? 'transform -translate-y-2 shadow-xl border-opacity-100' : 'shadow-sm hover:shadow-lg border-opacity-50'}`}
              onMouseEnter={() => setHoveredCard(card.key)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${isHovered ? 'bg-white bg-opacity-80 shadow-md' : 'bg-white bg-opacity-50'}`}>
                  <IconComponent className={`h-5 w-5 ${card.iconColor} ${isHovered ? 'scale-110' : ''}`} />
                </div>
                <TrendingUp className="h-3 w-3 text-green-500 opacity-60" />
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline space-x-4">
                  <span className={`text-2xl font-bold ${isHovered ? 'text-gray-800' : 'text-gray-700'}`}>
                    {card.key === 'totalEarnings' ? value.toFixed(2) : value.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">total</span>
                </div>
                <h3 className="text-base font-semibold text-gray-800 leading-tight">{card.label}</h3>
                <p className={`text-xs text-gray-600 ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'} overflow-hidden transition-all duration-300`}>{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DriverSummary;