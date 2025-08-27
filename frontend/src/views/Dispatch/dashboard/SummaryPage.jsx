import React, { useEffect, useState } from 'react';
import statsService from '../../../Services/Dispatch/Statistic';
import ReservationNotification from '../../Dispatch/dashboard/ReservationNotification';

import {
  Loader2,
  Package,
  FileText,
  MessageSquare,
  DollarSign,
  Car,
  UserCheck,
  Users,
  BarChart3,
  TrendingUp,
  Activity,
  Calendar,
} from 'lucide-react';

function SummaryPage() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      key: 'reservationCount',
      label: 'Ride Reservations',
      color: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      icon: Calendar,
      description: 'Total reservations made',
    },
    {
      key: 'vehicleCount',
      label: 'Vehicles',
      color: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      icon: Car,
      description: 'Fleet vehicles registered',
    },
    {
      key: 'driverCount',
      label: 'Drivers',
      color: 'bg-gradient-to-br from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      iconColor: 'text-pink-600',
      icon: UserCheck,
      description: 'Licensed drivers on duty',
    },
    {
      key: 'clientCount',
      label: 'Clients',
      color: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      icon: Users,
      description: 'Registered client accounts',
    },
    {
      key: 'foundPropertyCount',
      label: 'Found Properties',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      icon: Package,
      description: 'Items recovered and catalogued',
    },
    {
      key: 'lostPropertyReportCount',
      label: 'Lost Reports',
      color: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      icon: FileText,
      description: 'Missing item reports filed',
    },
    {
      key: 'contactMessageCount',
      label: 'Messages',
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      icon: MessageSquare,
      description: 'Communication threads active',
    },
    {
      key: 'feeCategoryCount',
      label: 'Fee Categories',
      color: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      icon: DollarSign,
      description: 'Billing categories configured',
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getSystemCounts();
        setCounts(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" />
          <p className="text-blue-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return ( 
    <div className="p-2  ">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-1">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">Summary Dashboard</h1>
        </div>
        <p className="text-gray-600 flex items-center space-x-2 text-sm">
          <Activity className="h-4 w-4" />
          <span>Real-time system overview</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-3 gap-3">
        {cards.map((card) => {
          const IconComponent = card.icon;
          const isHovered = hoveredCard === card.key;
          const count = counts[card.key] ?? 0;

          return (
            <div
              key={card.key}
              className={`relative rounded-xl p-3 border transition-all duration-300 cursor-pointer
                ${card.color} ${card.borderColor}
                ${isHovered
                  ? 'transform -translate-y-1.5 shadow-lg border-opacity-100'
                  : 'shadow-sm hover:shadow-md border-opacity-50'
                }
              `}
              onMouseEnter={() => setHoveredCard(card.key)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`
                  p-1.5 rounded-lg transition-all duration-300
                  ${isHovered ? 'bg-white bg-opacity-80 shadow-sm' : 'bg-white bg-opacity-50'}
                `}>
                  <IconComponent
                    className={`h-4 w-4 ${card.iconColor} transition-transform duration-300 ${
                      isHovered ? 'scale-105' : ''
                    }`}
                  />
                </div>
                <div className="flex items-center space-x-1 opacity-50">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-baseline space-x-2">
                  <span className={`text-xl font-semibold transition-all duration-300 ${
                    isHovered ? 'text-gray-800' : 'text-gray-700'
                  }`}>
                    {count.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">total</span>
                </div>

                <h3 className="text-sm font-semibold text-gray-800 leading-snug">
                  {card.label}
                </h3>

                <p className={`text-xs text-gray-600 transition-all duration-300 ${
                  isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                } overflow-hidden`}>
                  {card.description}
                </p>
              </div>

              <div className={`
                absolute top-0 right-0 w-12 h-12 opacity-10 transition-opacity duration-300
                ${isHovered ? 'opacity-20' : ''}
              `}>
                <IconComponent className="w-full h-full" />
              </div>
            </div>
          );
        })}
      </div>

    

      <ReservationNotification />
    </div>
  );
}

export default SummaryPage;
