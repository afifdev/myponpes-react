import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

const ChartBar = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip cursorStyle={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="attend" fill="#3482F6" />
        <Bar dataKey="not_attend" fill="#6d28d9" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBar;
