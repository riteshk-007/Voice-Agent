import React, { useState, useEffect } from "react";
import { appointmentsApi, jobsApi, candidatesApi } from "@/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalendarX, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";

interface Job {
  id: number;
  title: string;
}

interface Candidate {
  id: number;
  name: string;
}

interface Appointment {
  id: number;
  job_id: number;
  candidate_id: number;
  date_time: string;
  status: "scheduled" | "completed" | "cancelled";
  job?: Job;
  candidate?: Candidate;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    job_id: "",
    candidate_id: "",
    date_time: "",
    status: "scheduled",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, jobsRes, candidatesRes] = await Promise.all([
        appointmentsApi.getAll(),
        jobsApi.getAll(),
        candidatesApi.getAll(),
      ]);

      setAppointments(appointmentsRes.data);
      setJobs(jobsRes.data);
      setCandidates(candidatesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      job_id: "",
      candidate_id: "",
      date_time: "",
      status: "scheduled",
    });
    setShowForm(false);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const appointmentData = {
        job_id: parseInt(formData.job_id),
        candidate_id: parseInt(formData.candidate_id),
        date_time: new Date(formData.date_time).toISOString(),
        status: formData.status,
      };

      await appointmentsApi.create(appointmentData);
      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      });

      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: "scheduled" | "completed" | "cancelled"
  ) => {
    try {
      await appointmentsApi.update(id, { status });
      toast({
        title: "Success",
        description: `Appointment marked as ${status}`,
      });
      fetchData();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await appointmentsApi.delete(id);
        toast({
          title: "Success",
          description: "Appointment deleted successfully",
        });
        fetchData();
      } catch (error) {
        console.error("Error deleting appointment:", error);
        toast({
          title: "Error",
          description: "Failed to delete appointment",
          variant: "destructive",
        });
      }
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Schedule Appointment"}
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-medium">Schedule New Appointment</h2>

          <form onSubmit={handleCreateAppointment} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select Job
                </label>
                <select
                  name="job_id"
                  value={formData.job_id}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select a job</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select Candidate
                </label>
                <select
                  name="candidate_id"
                  value={formData.candidate_id}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select a candidate</option>
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="date_time"
                  value={formData.date_time}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">Schedule</Button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm">
          <p className="mb-4 text-center text-gray-500">
            No appointments scheduled yet
          </p>
          <Button onClick={() => setShowForm(true)}>
            Schedule First Appointment
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Candidate
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Job
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Date & Time
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <motion.tr
                    key={appointment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {appointment.candidate?.name || "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {appointment.job?.title || "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {formatDate(appointment.date_time)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        {appointment.status === "scheduled" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(appointment.id, "completed")
                              }
                              className="h-8 px-2 text-xs"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Complete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(appointment.id, "cancelled")
                              }
                              className="h-8 px-2 text-xs"
                            >
                              <CalendarX className="mr-1 h-3 w-3" />
                              Cancel
                            </Button>
                          </>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                          className="h-8 px-2 text-xs"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
