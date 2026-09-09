import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { CheckCircle2, Clock, FolderGit2, Target } from 'lucide-react';
import ChartCard from '../components/analytics/ChartCard';
import ActivityFeed from '../components/analytics/ActivityFeed';
import {
  getAnalyticsSummary,
  getTasksByStatus,
  getWeeklyProgress,
  getTeamWorkload,
  getProjectHealth,
  fetchNotifications,
} from '../services/analyticsService';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: null,
    tasksByStatus: [],
    weeklyProgress: [],
    teamWorkload: [],
    projectHealth: [],
    recentActivity: [],
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [
          summary,
          tasksByStatus,
          weeklyProgress,
          teamWorkload,
          projectHealth,
          { notifications },
        ] = await Promise.all([
          getAnalyticsSummary(),
          getTasksByStatus(),
          getWeeklyProgress(),
          getTeamWorkload(),
          getProjectHealth(),
          fetchNotifications(),
        ]);
        setData({ summary, tasksByStatus, weeklyProgress, teamWorkload, projectHealth, recentActivity: notifications });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getHealthColor = (status) => {
    switch (status) {
      case 'on-track':  return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'at-risk':   return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'completed': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      default:          return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getProgressBarColor = (health) => {
    if (health >= 80) return 'bg-emerald-500';
    if (health >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-950 min-h-screen text-slate-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Analytics Dashboard</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks',    value: data.summary?.totalTasks    || 0, icon: Target,      color: 'text-indigo-500' },
          { label: 'Completed',      value: data.summary?.completedTasks || 0, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Overdue',        value: data.summary?.overdueTasks   || 0, icon: Clock,        color: 'text-red-500' },
          { label: 'Active Projects',value: data.summary?.activeProjects || 0, icon: FolderGit2,   color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-slate-800/50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              {loading ? (
                <div className="h-7 w-16 bg-slate-800 rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-slate-100">{stat.value}</h3>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Pie Chart */}
        <ChartCard title="Task Distribution" loading={loading} className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.tasksByStatus} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {data.tasksByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} itemStyle={{ color: '#e2e8f0' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly Progress */}
        <ChartCard title="Weekly Progress" subtitle="Tasks created vs completed" loading={loading} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="week" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
              <Legend iconType="circle" />
              <Bar dataKey="created" name="Created" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Team Workload */}
        <ChartCard title="Team Workload" loading={loading} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.teamWorkload} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
              <Legend iconType="circle" />
              <Bar dataKey="assigned" name="Assigned" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={16} />
              <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Activity Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Recent Activity</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-slate-800 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ActivityFeed notifications={data.recentActivity} />
          )}
        </div>
      </div>

      {/* Project Health Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100">Project Health</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Project Name</th>
                <th className="px-6 py-4 font-medium">Health Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-500">Loading projects...</td></tr>
              ) : data.projectHealth.map((project) => (
                <tr key={project._id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{project.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full max-w-[150px] bg-slate-800 rounded-full h-2">
                        <div className={`h-2 rounded-full ${getProgressBarColor(project.health)}`} style={{ width: `${project.health}%` }} />
                      </div>
                      <span className="text-slate-400 font-medium w-8">{project.health}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium border rounded-full ${getHealthColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



