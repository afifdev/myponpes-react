import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from "recharts";
import rupiah from "../../../utils/Rupiah";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="py-2 px-4 rounded-lg bg-blue-600 text-white">
        <p className="label">{rupiah(payload[0].value)}</p>
      </div>
    );
  }

  return null;
};

const ChartLine = ({ data, isBalance }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="10" vertical={false} />
        <Tooltip content={<CustomTooltip />} />
        <YAxis axisLine={false} orientation={"right"} />
        <XAxis axisLine={false} />
        <defs>
          <linearGradient id="linear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3482F6" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="linearhehe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#3482F6" />
            <stop offset="75%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={isBalance ? "balance" : "amount"}
          stroke="url(#linearhehe)"
          fill="url(#linear)"
          strokeWidth={3}
          fillOpacity={1}
          activeDot={{ r: 8 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ChartLine;
