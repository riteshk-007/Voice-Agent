import React, { useState, useEffect } from "react";
import { candidatesApi } from "@/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Edit, Trash, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Candidate {
  id: number;
  name: string;
  phone: string;
  current_ctc?: number;
  expected_ctc?: number;
  notice_period?: number;
  experience?: number;
  createdAt?: string;
}

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    current_ctc: "",
    expected_ctc: "",
    notice_period: "",
    experience: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await candidatesApi.getAll();
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to load candidates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      current_ctc: "",
      expected_ctc: "",
      notice_period: "",
      experience: "",
    });
    setCurrentCandidate(null);
    setFormMode("create");
    setShowForm(false);
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert numeric fields
      const candidateData = {
        name: formData.name,
        phone: formData.phone,
        current_ctc: formData.current_ctc
          ? parseFloat(formData.current_ctc)
          : undefined,
        expected_ctc: formData.expected_ctc
          ? parseFloat(formData.expected_ctc)
          : undefined,
        notice_period: formData.notice_period
          ? parseInt(formData.notice_period)
          : undefined,
        experience: formData.experience
          ? parseFloat(formData.experience)
          : undefined,
      };

      if (formMode === "create") {
        await candidatesApi.create(candidateData);
        toast({
          title: "Success",
          description: "Candidate created successfully",
        });
      } else {
        if (currentCandidate) {
          await candidatesApi.update(currentCandidate.id, candidateData);
          toast({
            title: "Success",
            description: "Candidate updated successfully",
          });
        }
      }

      resetForm();
      fetchCandidates();
    } catch (error) {
      console.error("Error saving candidate:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          formMode === "create" ? "create" : "update"
        } candidate`,
        variant: "destructive",
      });
    }
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setFormData({
      name: candidate.name,
      phone: candidate.phone,
      current_ctc: candidate.current_ctc?.toString() || "",
      expected_ctc: candidate.expected_ctc?.toString() || "",
      notice_period: candidate.notice_period?.toString() || "",
      experience: candidate.experience?.toString() || "",
    });
    setCurrentCandidate(candidate);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDeleteCandidate = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await candidatesApi.delete(id);
        toast({
          title: "Success",
          description: "Candidate deleted successfully",
        });
        fetchCandidates();
      } catch (error) {
        console.error("Error deleting candidate:", error);
        toast({
          title: "Error",
          description: "Failed to delete candidate",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
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
            {formMode === "create" ? "Add New Candidate" : "Edit Candidate"}
          </h2>

          <form onSubmit={handleCreateCandidate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Current CTC (in LPA)
                </label>
                <input
                  type="number"
                  name="current_ctc"
                  value={formData.current_ctc}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  step="0.1"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Expected CTC (in LPA)
                </label>
                <input
                  type="number"
                  name="expected_ctc"
                  value={formData.expected_ctc}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  step="0.1"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Notice Period (in days)
                </label>
                <input
                  type="number"
                  name="notice_period"
                  value={formData.notice_period}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Experience (in years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  step="0.1"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {formMode === "create" ? "Add Candidate" : "Update Candidate"}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm">
          <p className="mb-4 text-center text-gray-500">
            No candidates available yet
          </p>
          <Button onClick={() => setShowForm(true)}>Add First Candidate</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{candidate.name}</h3>
                  <p className="text-sm text-gray-500">{candidate.phone}</p>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                {candidate.current_ctc !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current CTC:</span>
                    <span>{candidate.current_ctc} LPA</span>
                  </div>
                )}

                {candidate.expected_ctc !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expected CTC:</span>
                    <span>{candidate.expected_ctc} LPA</span>
                  </div>
                )}

                {candidate.notice_period !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Notice Period:</span>
                    <span>{candidate.notice_period} days</span>
                  </div>
                )}

                {candidate.experience !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Experience:</span>
                    <span>{candidate.experience} years</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCandidate(candidate)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCandidate(candidate.id)}
                  className="flex-1"
                >
                  <Trash className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Candidates;
