"use client";

import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown, 
  TrendingUp,
  Activity,
  ShieldAlert,
  Gavel,
  Briefcase
} from "lucide-react";

import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const financeData = {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Revenue (₹ Cr)",
        data: [45, 50, 42, 55, 48],
        borderColor: "hsl(153 60% 53%)", // emerald
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Debt (₹ Cr)",
        data: [10, 15, 25, 20, 22],
        borderColor: "hsl(346 87% 60%)", // rose
        backgroundColor: "rgba(225, 29, 72, 0.1)",
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="space-y-6 animate-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Risk Snapshot</h1>
          <p className="text-slate-400 mt-1">Acme Corp Ltd. (GST: 27AADCB2230M1Z2)</p>
        </div>
        <div className="px-5 py-2 rounded-full glass-card border-accent-warning/30 bg-accent-warning/10 text-accent-warning font-semibold flex items-center gap-2">
          <AlertTriangle size={18} />
          APPROVE WITH CAUTION
        </div>
      </header>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Requested Limit" 
          value="₹4.5 Crore" 
          change="Suggested: 11.75%" 
          icon={<Activity />} 
          positive={true} 
        />
        <MetricCard 
          title="Revenue (TTM)" 
          value="₹48.0 Crore" 
          change="-12% vs last yr" 
          icon={<TrendingDown />} 
          positive={false} 
        />
        <MetricCard 
          title="Debt to Equity" 
          value="1.8x" 
          change="Above avg. 1.2" 
          icon={<ShieldAlert />} 
          positive={false} 
        />
        <MetricCard 
          title="Trust Score" 
          value="63 / 100" 
          change="Moderate Risk Tier" 
          icon={<CheckCircle />} 
          positive={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Breakdown */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShieldAlert size={18} className="text-accent-secondary" />
            Risk Heatmap
          </h3>
          <div className="space-y-4 mt-2">
            <RiskBar label="Financial Health" level={60} color="bg-accent-warning" status="Moderate" />
            <RiskBar label="Litigation Risk" level={80} color="bg-accent-danger" status="High" />
            <RiskBar label="Sector Risk" level={50} color="bg-accent-warning" status="Moderate" />
            <RiskBar label="Promoter Risk" level={20} color="bg-accent-primary" status="Low" />
            <RiskBar label="GST Consistency" level={10} color="bg-accent-primary" status="Strong" />
          </div>
        </div>

        {/* Financial Timeline Graph */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-accent-primary" />
            Financial Risk Timeline
          </h3>
          <div className="h-64 w-full">
            <Line 
              data={financeData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: { grid: { color: "rgba(255,255,255,0.05)" } },
                  x: { grid: { color: "rgba(255,255,255,0.05)" } }
                },
                plugins: {
                  legend: { labels: { color: "rgba(255,255,255,0.7)" } }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Key Findings List */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gavel size={18} className="text-slate-300" />
          Key Findings & AI Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Risk Flags</h4>
            <ul className="space-y-2">
              <FindingItem text="3 active litigation cases found (e-Courts)" type="danger" />
              <FindingItem text="Revenue declined 12% in the last 2 years" type="danger" />
              <FindingItem text="Debt-to-equity slightly above industry average" type="warning" />
              <FindingItem text="Sector demand currently weakening" type="warning" />
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Positive Indicators</h4>
            <ul className="space-y-2">
              <FindingItem text="Promoter background clean (No network risks)" type="success" />
              <FindingItem text="GST flows highly consistent with bank deposits" type="success" />
              <FindingItem text="15-year operational history" type="success" />
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

function FindingItem({ text, type }: { text: string; type: "success" | "warning" | "danger" }) {
  const iconMap = {
    success: <CheckCircle size={16} className="text-accent-primary mt-0.5 shrink-0" />,
    warning: <AlertTriangle size={16} className="text-accent-warning mt-0.5 shrink-0" />,
    danger: <ShieldAlert size={16} className="text-accent-danger mt-0.5 shrink-0" />,
  };
  return (
    <li className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5 shadow-sm">
      {iconMap[type]}
      <span className="text-sm text-slate-200">{text}</span>
    </li>
  );
}

function MetricCard({ title, value, change, icon, positive }: any) {
  return (
    <div className="glass-card p-5 group hover:bg-white/5 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
        </div>
        <div className={`p-2 rounded-lg 
          ${positive ? 'bg-accent-primary/10 text-accent-primary' : 'bg-accent-danger/10 text-accent-danger'}
        `}>
          {icon}
        </div>
      </div>
      <p className={`text-xs mt-3 font-medium ${positive ? 'text-accent-primary' : 'text-accent-danger'}`}>
        {change}
      </p>
    </div>
  );
}

function RiskBar({ label, level, color, status }: { label: string; level: number; color: string; status: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold">{status}</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_10px_currentColor] opacity-80`} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}
