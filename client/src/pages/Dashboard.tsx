import React, { useEffect, useState } from "react";
import { jobsApi, candidatesApi, appointmentsApi } from "@/api";
import { Calendar, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface Candidate {
  name: string;
}

interface Job {
  title: string;
}

interface Appointment {
  id: string | number;
  candidate?: Candidate;
  job?: Job;
  date_time: string;
  status?: string;
}

interface DashboardStats {
  totalJobs: number;
  totalCandidates: number;
  totalAppointments: number;
  recentAppointments: Appointment[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalCandidates: 0,
    totalAppointments: 0,
    recentAppointments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [jobsRes, candidatesRes, appointmentsRes] = await Promise.all([
          jobsApi.getAll(),
          candidatesApi.getAll(),
          appointmentsApi.getAll(),
        ]);

        setStats({
          totalJobs: jobsRes.data.length,
          totalCandidates: candidatesRes.data.length,
          totalAppointments: appointmentsRes.data.length,
          recentAppointments: appointmentsRes.data
            .sort(
              (a: { date_time: string | number | Date; }, b: { date_time: string | number | Date; }) =>
                new Date(b.date_time).getTime() -
                new Date(a.date_time).getTime()
            )
            .slice(0, 5),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // In a real app, show error message to user
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex items-center rounded-lg bg-white p-6 shadow-sm"
              variants={itemVariants}
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Total Jobs
                </h2>
                <p className="text-2xl font-bold">{stats.totalJobs}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center rounded-lg bg-white p-6 shadow-sm"
              variants={itemVariants}
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Total Candidates
                </h2>
                <p className="text-2xl font-bold">{stats.totalCandidates}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center rounded-lg bg-white p-6 shadow-sm"
              variants={itemVariants}
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Total Appointments
                </h2>
                <p className="text-2xl font-bold">{stats.totalAppointments}</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="rounded-lg bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="mb-4 text-lg font-medium">Recent Appointments</h2>

            {stats.recentAppointments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No appointments scheduled yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left font-medium text-gray-500">
                        Candidate
                      </th>
                      <th className="pb-2 text-left font-medium text-gray-500">
                        Job
                      </th>
                      <th className="pb-2 text-left font-medium text-gray-500">
                        Date & Time
                      </th>
                      <th className="pb-2 text-left font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b">
                        <td className="py-3">
                          {appointment.candidate?.name || "N/A"}
                        </td>
                        <td className="py-3">
                          {appointment.job?.title || "N/A"}
                        </td>
                        <td className="py-3">
                          {formatDate(appointment.date_time)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium 
                            ${appointment.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : appointment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                          >
                            {(appointment.status || "Unknown").charAt(0).toUpperCase() +
                              (appointment.status || "Unknown").slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
