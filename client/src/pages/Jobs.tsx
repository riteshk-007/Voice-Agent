import React, { useState, useEffect } from "react";
import { jobsApi } from "@/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  created_at: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsApi.getAll();
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      requirements: "",
    });
    setCurrentJob(null);
    setFormMode("create");
    setShowForm(false);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formMode === "create") {
        await jobsApi.create(formData);
        toast({
          title: "Success",
          description: "Job created successfully",
        });
      } else {
        if (currentJob) {
          await jobsApi.update(currentJob.id, formData);
          toast({
            title: "Success",
            description: "Job updated successfully",
          });
        }
      }

      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          formMode === "create" ? "create" : "update"
        } job`,
        variant: "destructive",
      });
    }
  };

  const handleEditJob = (job: Job) => {
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
    });
    setCurrentJob(job);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDeleteJob = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await jobsApi.delete(id);
        toast({
          title: "Success",
          description: "Job deleted successfully",
        });
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        toast({
          title: "Error",
          description: "Failed to delete job",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </>
          )}
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
          <h2 className="mb-4 text-lg font-medium">
            {formMode === "create" ? "Create New Job" : "Edit Job"}
          </h2>

          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
                rows={5}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
                rows={5}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {formMode === "create" ? "Create Job" : "Update Job"}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm">
          <p className="mb-4 text-center text-gray-500">
            No jobs available yet
          </p>
          <Button onClick={() => setShowForm(true)}>Create First Job</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    Created on {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditJob(job)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <Trash className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div>
                  <h4 className="text-sm font-medium">Description:</h4>
                  <p className="text-sm">{job.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Requirements:</h4>
                  <p className="text-sm">{job.requirements}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
