import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobsApi, candidatesApi } from "@/api";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { MicIcon, PhoneCallIcon, PhoneOffIcon } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
}

type ChatMessage = {
  sender: "system" | "user";
  text: string;
  timestamp: Date;
};

type FaqItem = {
  question: string;
  answer: string;
};

// All the conversation steps in the flow
type ConversationStep =
  | "greeting"
  | "interest_check"
  | "notice_period"
  | "ctc_discussion"
  | "interview_availability"
  | "confirm_booking"
  | "faq"
  | "completion";

const VoiceSimulation: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | "">("");
  const [selectedCandidate, setSelectedCandidate] = useState<number | "">("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<ConversationStep>("greeting");
  const [isRecording, setIsRecording] = useState(false);
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [interviewTime, setInterviewTime] = useState<string>("");
  const [extractedData, setExtractedData] = useState<Record<string, string>>(
    {}
  );
  const [availableDates] = useState<string[]>([
    "2025-05-01",
    "2025-05-02",
    "2025-05-03",
    "2025-05-04",
    "2025-05-05",
  ]);
  const [availableTimes] = useState<string[]>([
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
  ]);
  const [faqs] = useState<FaqItem[]>([
    {
      question: "What's the role about?",
      answer:
        "The role involves developing web applications using modern frameworks.",
    },
    {
      question: "Is it remote?",
      answer:
        "Yes, it's a fully remote position with occasional office visits.",
    },
    {
      question: "What's the interview process?",
      answer:
        "The process includes a technical assessment and two rounds of interviews.",
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsResponse, candidatesResponse] = await Promise.all([
        jobsApi.getAll(),
        candidatesApi.getAll(),
      ]);
      setJobs(jobsResponse.data);
      setCandidates(candidatesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load simulation data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getNextPrompt = (step: ConversationStep): string => {
    const job = jobs.find((j) => j.id === Number(selectedJob));
    const candidate = candidates.find(
      (c) => c.id === Number(selectedCandidate)
    );
    const companyName = job?.company || "Our Company";
    const candidateName = candidate?.name || "there";
    const jobTitle = job?.title || "the position";

    switch (step) {
      case "greeting":
        return `Hello ${candidateName}, this is ${companyName} regarding a ${jobTitle} opportunity.`;
      case "interest_check":
        return "Are you interested in this role?";
      case "notice_period":
        return "What is your current notice period?";
      case "ctc_discussion":
        return "Can you share your current and expected CTC?";
      case "interview_availability":
        return `When are you available for an interview next week? We have openings on ${availableDates
          .slice(0, 3)
          .join(", ")} at various times.`;
      case "confirm_booking":
        return `We've scheduled your interview on ${interviewDate} at ${interviewTime}. Is that correct?`;
      case "faq":
        return "Do you have any questions about the role or the company?";
      case "completion":
        return "Thank you for your time. We look forward to speaking with you soon!";
      default:
        return "What would you like to know?";
    }
  };

  const startConversation = async () => {
    if (!selectedJob || !selectedCandidate) {
      toast({
        title: "Error",
        description: "Please select both a job and a candidate",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // In a real implementation, this would call the backend API
      // const response = await voiceAgentApi.startConversation({
      //   candidate_id: Number(selectedCandidate),
      //   job_id: Number(selectedJob),
      // });

      // For simulation, we'll mock the response
      const conversationId = Math.floor(Math.random() * 1000);
      setConversationId(conversationId);
      setCurrentStep("greeting");
      setActiveConversation(true);

      // Initialize with greeting message
      const greeting = getNextPrompt("greeting");
      setChatMessages([
        {
          sender: "system",
          text: greeting,
          timestamp: new Date(),
        },
      ]);

      // Automatically move to interest check after greeting
      setTimeout(() => {
        const interestCheck = getNextPrompt("interest_check");
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text: interestCheck,
            timestamp: new Date(),
          },
        ]);
        setCurrentStep("interest_check");
      }, 2000);
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const extractEntities = (text: string): Record<string, string> => {
    const entities: Record<string, string> = {};

    // Extract notice period (e.g., "2 months", "30 days", "1 week")
    const noticePeriodMatch = text.match(
      /(\d+)\s*(day|days|week|weeks|month|months)/i
    );
    if (noticePeriodMatch) {
      entities.noticePeriod = noticePeriodMatch[0];
    }

    // Extract CTC (e.g., "10 LPA", "₹15 lakhs", "20,000 per month")
    const ctcMatch = text.match(
      /(\d+[\d,.]*)\s*(lpa|lakhs|k|thousand|lac|million|per\s*month|per\s*annum)/i
    );
    if (ctcMatch) {
      entities.ctc = ctcMatch[0];
    }

    // Extract expected CTC
    const expectedCtcMatch = text.match(
      /expect(?:ing|ed)?\s*(?:a|to|is|of)?\s*(\d+[\d,.]*\s*(?:lpa|lakhs|k|thousand|lac|million|per\s*month|per\s*annum))/i
    );
    if (expectedCtcMatch) {
      entities.expectedCtc = expectedCtcMatch[1];
    }

    // Look for dates (simple implementation)
    const dateMatch = text.match(
      /(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)|(?:next|this)\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday))/i
    );
    if (dateMatch) {
      entities.date = dateMatch[0];
    }

    // Look for times
    const timeMatch = text.match(
      /(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))/i
    );
    if (timeMatch) {
      entities.time = timeMatch[0];
    }

    return entities;
  };

  const findFaqAnswer = (question: string): string | null => {
    // Very simple implementation - in a real app, you'd use better NLP here
    const lowerQuestion = question.toLowerCase();

    for (const faq of faqs) {
      if (lowerQuestion.includes(faq.question.toLowerCase())) {
        return faq.answer;
      }

      // Check if the question contains key phrases
      if (
        (faq.question.toLowerCase().includes("role") &&
          lowerQuestion.includes("role")) ||
        (faq.question.toLowerCase().includes("remote") &&
          lowerQuestion.includes("remote")) ||
        (faq.question.toLowerCase().includes("interview") &&
          lowerQuestion.includes("interview"))
      ) {
        return faq.answer;
      }
    }

    return null;
  };

  const processUserResponse = (
    userText: string
  ): { nextStep: ConversationStep; systemReply: string } => {
    const entities = extractEntities(userText);
    const lowerText = userText.toLowerCase();

    // Update extracted data with new entities
    setExtractedData((prev) => ({ ...prev, ...entities }));

    switch (currentStep) {
      case "interest_check":
        if (
          lowerText.includes("yes") ||
          lowerText.includes("interested") ||
          lowerText.includes("sure")
        ) {
          return {
            nextStep: "notice_period",
            systemReply: getNextPrompt("notice_period"),
          };
        } else {
          return {
            nextStep: "completion",
            systemReply:
              "Thank you for your time. We'll keep your profile for future opportunities.",
          };
        }

      case "notice_period":
        if (entities.noticePeriod) {
          return {
            nextStep: "ctc_discussion",
            systemReply: getNextPrompt("ctc_discussion"),
          };
        } else {
          return {
            nextStep: "notice_period",
            systemReply:
              "I couldn't understand your notice period. Could you please specify it in weeks or months?",
          };
        }

      case "ctc_discussion":
        if (entities.ctc || entities.expectedCtc) {
          return {
            nextStep: "interview_availability",
            systemReply: getNextPrompt("interview_availability"),
          };
        } else {
          return {
            nextStep: "ctc_discussion",
            systemReply:
              "I couldn't understand your CTC details. Could you please specify your current and expected CTC?",
          };
        }

      case "interview_availability":
        if (entities.date || entities.time) {
          // Simplified date/time handling for the simulation
          setInterviewDate(entities.date || availableDates[0]);
          setInterviewTime(entities.time || availableTimes[0]);

          return {
            nextStep: "confirm_booking",
            systemReply: `We've scheduled your interview on ${entities.date || availableDates[0]
              } at ${entities.time || availableTimes[0]}. Is that correct?`,
          };
        } else {
          return {
            nextStep: "interview_availability",
            systemReply:
              "I couldn't understand your availability. Could you please provide a specific date and time next week?",
          };
        }

      case "confirm_booking":
        if (
          lowerText.includes("yes") ||
          lowerText.includes("correct") ||
          lowerText.includes("confirm")
        ) {
          return {
            nextStep: "faq",
            systemReply: getNextPrompt("faq"),
          };
        } else {
          return {
            nextStep: "interview_availability",
            systemReply:
              "Let's try again. When are you available for an interview next week?",
          };
        }

      case "faq":
        // Check if this is a question
        if (
          lowerText.includes("?") ||
          lowerText.includes("what") ||
          lowerText.includes("how") ||
          lowerText.includes("where") ||
          lowerText.includes("when") ||
          lowerText.includes("why")
        ) {
          const faqAnswer = findFaqAnswer(userText);
          if (faqAnswer) {
            return {
              nextStep: "faq", // Stay in FAQ mode
              systemReply: faqAnswer,
            };
          } else {
            return {
              nextStep: "faq",
              systemReply:
                "I don't have that information right now. Any other questions I can help with?",
            };
          }
        } else if (
          lowerText.includes("no") ||
          lowerText.includes("that's all") ||
          lowerText.includes("nothing")
        ) {
          return {
            nextStep: "completion",
            systemReply: getNextPrompt("completion"),
          };
        } else {
          return {
            nextStep: "faq",
            systemReply:
              "Do you have any specific questions about the role or company?",
          };
        }

      case "completion":
        return {
          nextStep: "completion",
          systemReply: "The conversation has ended. Thank you!",
        };

      default:
        return {
          nextStep: currentStep,
          systemReply: "I'm not sure how to respond to that.",
        };
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !conversationId) return;

    // Add user message to chat
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userInput,
        timestamp: new Date(),
      },
    ]);

    const message = userInput;
    setUserInput("");

    try {
      setLoading(true);

      // In a real implementation, we would call the API
      // const response = await voiceAgentApi.processResponse({
      //   conversation_id: conversationId,
      //   response: message,
      //   current_step: currentStep,
      // });

      // For simulation, we'll process the response locally
      const { nextStep, systemReply } = processUserResponse(message);

      // Slight delay to simulate processing
      setTimeout(() => {
        // Add system response
        setChatMessages((prev) => [
          ...prev,
          { sender: "system", text: systemReply, timestamp: new Date() },
        ]);

        setCurrentStep(nextStep);

        // Check if conversation is complete
        if (nextStep === "completion") {
          setActiveConversation(false);
          toast({
            title: "Success",
            description: "Conversation completed successfully",
          });
        }

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error processing response:", error);
      toast({
        title: "Error",
        description: "Failed to process your response",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleRecording = () => {
    // Placeholder for voice recording functionality
    setIsRecording(!isRecording);

    if (isRecording) {
      // Stop recording and process
      toast({
        title: "Info",
        description: "Voice recording stopped (placeholder for speech-to-text)",
      });
      setUserInput("Yes, I'm interested in the role."); // Placeholder response
    } else {
      // Start recording
      toast({
        title: "Info",
        description: "Recording started... speak now",
      });
    }
  };

  const endConversation = () => {
    if (window.confirm("Are you sure you want to end this conversation?")) {
      setActiveConversation(false);
      setConversationId(null);
      setChatMessages([]);
      setCurrentStep("greeting");
      setExtractedData({});
      toast({
        title: "Info",
        description: "Conversation ended",
      });
    }
  };

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold">Voice Agent Simulation</h1>

        {activeConversation && (
          <Button
            variant="destructive"
            onClick={endConversation}
            disabled={loading}
          >
            <PhoneOffIcon className="mr-2 h-4 w-4" /> End Call
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - Simulation controls */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="data" disabled={!activeConversation}>
                Extracted Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="setup">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!activeConversation ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="job">Select Job</Label>
                        <Select
                          value={selectedJob.toString()}
                          onValueChange={(value) =>
                            setSelectedJob(value === "" ? "" : Number(value))
                          }
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a job" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobs.map((job) => (
                              <SelectItem
                                key={job.id}
                                value={job.id.toString()}
                              >
                                {job.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Label htmlFor="candidate">Select Candidate</Label>
                        <Select
                          value={selectedCandidate.toString()}
                          onValueChange={(value) =>
                            setSelectedCandidate(
                              value === "" ? "" : Number(value)
                            )
                          }
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a candidate" />
                          </SelectTrigger>
                          <SelectContent>
                            {candidates.map((candidate) => (
                              <SelectItem
                                key={candidate.id}
                                value={candidate.id.toString()}
                              >
                                {candidate.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={itemVariants} className="pt-2">
                        <Button
                          className="w-full"
                          onClick={startConversation}
                          disabled={
                            loading || !selectedJob || !selectedCandidate
                          }
                        >
                          <PhoneCallIcon className="mr-2 h-4 w-4" /> Start Voice
                          Simulation
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Current Step:</h3>
                        <p className="text-sm">
                          {currentStep.replace("_", " ").toLocaleUpperCase()}
                        </p>
                      </div>

                      {selectedJob &&
                        jobs.find((j) => j.id === Number(selectedJob)) && (
                          <div>
                            <h3 className="font-medium">Job:</h3>
                            <p className="text-sm">
                              {
                                jobs.find((j) => j.id === Number(selectedJob))
                                  ?.title
                              }
                            </p>
                          </div>
                        )}

                      {selectedCandidate &&
                        candidates.find(
                          (c) => c.id === Number(selectedCandidate)
                        ) && (
                          <div>
                            <h3 className="font-medium">Candidate:</h3>
                            <p className="text-sm">
                              {
                                candidates.find(
                                  (c) => c.id === Number(selectedCandidate)
                                )?.name
                              }
                            </p>
                          </div>
                        )}

                      <div className="pt-2">
                        <Button
                          variant={isRecording ? "destructive" : "default"}
                          className="w-full"
                          onClick={toggleRecording}
                          disabled={loading || currentStep === "completion"}
                        >
                          <MicIcon className="mr-2 h-4 w-4" />
                          {isRecording ? "Stop Recording" : "Start Voice Input"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.keys(extractedData).length > 0 ? (
                      Object.entries(extractedData).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-1 border-b border-gray-100"
                        >
                          <span className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span>{value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No data extracted yet
                      </p>
                    )}

                    {interviewDate && interviewTime && (
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="font-medium">
                          Interview Scheduled:
                        </span>
                        <span>
                          {interviewDate} at {interviewTime}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Chat interface */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <div
                ref={chatContainerRef}
                className="h-[500px] overflow-y-auto p-4 space-y-4"
              >
                {chatMessages.length > 0 ? (
                  chatMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === "system"
                        ? "justify-start"
                        : "justify-end"
                        }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === "system"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-500 text-white"
                          }`}
                      >
                        <div className="text-sm font-medium">
                          {message.sender === "system" ? "Agent" : "You"}
                        </div>
                        <div>{message.text}</div>
                        <div className="text-xs opacity-70 text-right mt-1">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">
                      {activeConversation
                        ? "Loading conversation..."
                        : "Start a new conversation to begin"}
                    </p>
                  </div>
                )}
              </div>

              {/* Input area */}
              {activeConversation && currentStep !== "completion" && (
                <div className="p-4 border-t flex space-x-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your response..."
                    className="flex-grow min-h-[60px]"
                    disabled={loading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !userInput.trim()}
                    className="self-end"
                  >
                    Send
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceSimulation;
