import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#ffc107", "#198754", "#dc3545"];

const AdminDashboardCharts = ({ stats }) => {
  console.log("Chart Stats:", stats);
  const data = [
    {
      name: "Pending",
      value: stats?.pendingAppointments || 0,
    },
    {
      name: "Completed",
      value: stats?.completedJobs || 0,
    },
    {
      name: "Cancelled",
      value: stats?.cancelledAppointments || 0,
    },
  ];

  return (
<div className="row align-items-center">
  <div className="col-md-7">
    <ResponsiveContainer width="100%" height={210}>
      <PieChart>
        <Pie data={data} dataKey="value" outerRadius={70} label>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="col-md-5">
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between">
        <span className="fw-semibold text-success">Completed</span>

        <span className="badge bg-success">{stats.completedJobs}</span>
      </div>

      <div className="d-flex justify-content-between">
        <span className="fw-semibold text-danger">Cancelled</span>

        <span className="badge bg-danger">{stats.cancelledAppointments}</span>
      </div>

      <div className="d-flex justify-content-between">
        <span className="fw-semibold text-warning">Pending</span>

        <span className="badge bg-warning text-dark">
          {stats.pendingAppointments}
        </span>
      </div>
    </div>
  </div>
</div>
  );
};

export default AdminDashboardCharts;


