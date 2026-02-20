import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '../services/supabaseClient';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, avgMood: 0, totalEntries: 0 });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: logs } = await supabase
        .from('mood_logs')
        .select('created_at, value, tags');

      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (logs) {
        processChartData(logs);
        const avg = logs.reduce((acc, curr) => acc + curr.value, 0) / (logs.length || 1);
        setStats({
          totalUsers: count || 0,
          avgMood: parseFloat(avg.toFixed(1)),
          totalEntries: logs.length
        });
      }
    } catch (error) {
      console.error("Admin fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (logs: any[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const grouped = days.map(day => ({ name: day, Mood: 0, count: 0, Stress: 0 }));

    logs.forEach(log => {
      const date = new Date(log.created_at);
      const dayIndex = date.getDay();

      grouped[dayIndex].Mood += log.value;
      grouped[dayIndex].count += 1;

      if (log.value <= 2) {
        grouped[dayIndex].Stress += (5 - log.value) * 20;
      }
    });

    const finalData = grouped.map(item => ({
      name: item.name,
      Mood: item.count ? parseFloat((item.Mood / item.count).toFixed(1)) * 20 : 0,
      Stress: item.count ? parseFloat((item.Stress / item.count).toFixed(1)) : 0,
      Entries: item.count
    }));

    setChartData(finalData);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24 md:pb-6 space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Admin Analytics</h2>
      {/* Your UI remains unchanged */}
    </div>
  );
};

export default Admin;
