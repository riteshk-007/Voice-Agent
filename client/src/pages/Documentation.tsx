import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

const Documentation: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Documentation</h1>
        <p className="text-gray-500">
          Complete guide to setup, API endpoints, and database schema
        </p>
      </motion.div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="api">API Endpoints</TabsTrigger>
          <TabsTrigger value="schema">Database Schema</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Setup Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Prerequisites</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Node.js (v16.x or higher)</li>
                  <li>PostgreSQL (v14.x)</li>
                  <li>Git</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Project Repository</h3>
                <p className="pb-1">
                  The complete source code is available on GitHub:
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <a
                    href="https://github.com/riteshk-007/Voice-Agent"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://github.com/riteshk-007/Voice-Agent
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Client Setup</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm">
                    <code>
                      {`# Clone the repository
git clone https://github.com/riteshk-007/Voice-Agent.git
cd Voice-Agent/client

# Install dependencies
npm install

# Start development server
npm run dev`}
                    </code>
                  </pre>
                </div>
                <p className="text-sm text-gray-600">
                  The client will run on <code>http://localhost:5173</code> by
                  default.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Server Setup</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm">
                    <code>
                      {`# Navigate to server directory
cd ../server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your database credentials

# Start development server
npm run dev`}
                    </code>
                  </pre>
                </div>
                <p className="text-sm text-gray-600">
                  The server will run on <code>http://localhost:5000</code> by
                  default.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Database Setup</h3>
                <p>
                  The application uses Sequelize ORM and will automatically
                  create the required tables when the server starts for the
                  first time. PostgreSQL is used due to compatibility issues
                  encountered with MySQL. Make sure your database credentials in
                  the
                  <code> .env</code> file are correct.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm">
                    <code>
                      {`# Sample .env file
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=voice_agent_db
DB_DIALECT=postgres
PORT=5000`}
                    </code>
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <ul className="list-none space-y-1">
                  <li>Ritesh</li>
                  <li>Phone: +91 8882304322</li>
                  <li>
                    Email:{" "}
                    <a
                      href="mailto:rk0001945@gmail.com"
                      className="text-blue-600 hover:underline"
                    >
                      rk0001945@gmail.com
                    </a>
                  </li>
                  <li>
                    Portfolio:{" "}
                    <a
                      href="https://my-portfolio-rk.vercel.app"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://my-portfolio-rk.vercel.app
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Production Deployment</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm">
                    <code>
                      {`# Build client
cd client
npm run build

# Start production server
cd ../server
npm start`}
                    </code>
                  </pre>
                </div>
                <p className="text-sm text-gray-600">
                  For production deployment, consider using services like
                  Vercel, Netlify, or AWS.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Jobs API</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/api/jobs</TableCell>
                      <TableCell>Get all jobs</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/api/jobs/:id</TableCell>
                      <TableCell>Get job by ID</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/api/jobs</TableCell>
                      <TableCell>Create a new job</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PUT</TableCell>
                      <TableCell>/api/jobs/:id</TableCell>
                      <TableCell>Update a job</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DELETE</TableCell>
                      <TableCell>/api/jobs/:id</TableCell>
                      <TableCell>Delete a job</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Candidates API</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/api/candidates</TableCell>
                      <TableCell>Get all candidates</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/api/candidates/:id</TableCell>
                      <TableCell>Get candidate by ID</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/api/candidates</TableCell>
                      <TableCell>Create a new candidate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PUT</TableCell>
                      <TableCell>/api/candidates/:id</TableCell>
                      <TableCell>Update a candidate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DELETE</TableCell>
                      <TableCell>/api/candidates/:id</TableCell>
                      <TableCell>Delete a candidate</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appointments API</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/api/appointments</TableCell>
                      <TableCell>Get all appointments</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/api/appointments/:id</TableCell>
                      <TableCell>Get appointment by ID</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/api/appointments</TableCell>
                      <TableCell>Create a new appointment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PUT</TableCell>
                      <TableCell>/api/appointments/:id</TableCell>
                      <TableCell>Update an appointment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DELETE</TableCell>
                      <TableCell>/api/appointments/:id</TableCell>
                      <TableCell>Delete an appointment</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Voice Agent API</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/api/voice-agent/start</TableCell>
                      <TableCell>
                        Start a new voice agent conversation
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/api/voice-agent/process</TableCell>
                      <TableCell>Process a voice agent response</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/api/voice-agent/simulate</TableCell>
                      <TableCell>
                        Simulate a complete voice agent call
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conversations API</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/api/conversations</TableCell>
                      <TableCell>Get all conversations</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/api/conversations/:id</TableCell>
                      <TableCell>Get conversation by ID</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>
                        /api/conversations/candidate/:candidateId
                      </TableCell>
                      <TableCell>Get conversations for a candidate</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/api/conversations</TableCell>
                      <TableCell>Create a new conversation</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PUT</TableCell>
                      <TableCell>/api/conversations/:id</TableCell>
                      <TableCell>Update a conversation</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DELETE</TableCell>
                      <TableCell>/api/conversations/:id</TableCell>
                      <TableCell>Delete a conversation</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Job Model</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>Integer</TableCell>
                      <TableCell>Primary key, auto-increment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>title</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Job title</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>company</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Company name</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>description</TableCell>
                      <TableCell>Text</TableCell>
                      <TableCell>Job description</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>location</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Job location</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>skills</TableCell>
                      <TableCell>JSON</TableCell>
                      <TableCell>Required skills (array)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>status</TableCell>
                      <TableCell>Enum</TableCell>
                      <TableCell>Open, Closed, Archived</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>createdAt</TableCell>
                      <TableCell>DateTime</TableCell>
                      <TableCell>Record creation timestamp</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>updatedAt</TableCell>
                      <TableCell>DateTime</TableCell>
                      <TableCell>Record update timestamp</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Candidate Model</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>Integer</TableCell>
                      <TableCell>Primary key, auto-increment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>name</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Candidate's full name</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>email</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Candidate's email address</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>phone</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Candidate's phone number</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>skills</TableCell>
                      <TableCell>JSON</TableCell>
                      <TableCell>Candidate's skills (array)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>experience</TableCell>
                      <TableCell>Integer</TableCell>
                      <TableCell>Years of experience</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>status</TableCell>
                      <TableCell>Enum</TableCell>
                      <TableCell>Active, Inactive, Hired</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>createdAt</TableCell>
                      <TableCell>DateTime</TableCell>
                      <TableCell>Record creation timestamp</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>updatedAt</TableCell>
                      <TableCell>DateTime</TableCell>
                      <TableCell>Record update timestamp</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appointment Model</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>Integer</TableCell>
                      <TableCell>Primary key, auto-increment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>candidateId</TableCell>
                      <TableCell>Integer</TableCell>
                      <TableCell>Foreign key to Candidate model</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>jobId</TableCell>
                      <TableCell>Integer</TableCell>
                      <TableCell>Foreign key to Job model</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>scheduledDate</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Date of the appointment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>scheduledTime</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Time of the appointment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>status</TableCell>
                      <TableCell>Enum</TableCell>
                      <TableCell>
                        Scheduled, Completed, Cancelled, Rescheduled
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>notes</TableCell>
                      <TableCell>Text</TableCell>
                      <TableCell>Additional notes</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>createdAt</TableCell>
                      <TableCell>DateTime</TableCell>
                      <TableCell>Record creation timestamp</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>updatedAt</TableCell>
                      <TableCell>DateTime</TableCell>
                      <TableCell>Record update timestamp</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conversation Model</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>Integer</TableCell>
                      <TableCell>Primary key, auto-increment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>candidateId</TableCell>
                      <TableCell>Integer</TableCell>
                      <TableCell>Foreign key to Candidate model</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>jobId</TableCell>
                      <TableCell>Integer</TableCell>
                      <TableCell>Foreign key to Job model</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>transcript</TableCell>
                      <TableCell>JSON</TableCell>
                      <TableCell>Array of conversation messages</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>extractedData</TableCell>
                      <TableCell>JSON</TableCell>
                      <TableCell>
                        Extracted information from conversation
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>status</TableCell>
                      <TableCell>Enum</TableCell>
                      <TableCell>Active, Completed, Failed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>createdAt</TableCell>
                      <TableCell>DateTime</TableCell>
                      <TableCell>Record creation timestamp</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>updatedAt</TableCell>
                      <TableCell>DateTime</TableCell>
                      <TableCell>Record update timestamp</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="text-lg font-medium">Database Relationships</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">One-to-Many:</span> Job to
                    Appointments (One job can have many appointments)
                  </li>
                  <li>
                    <span className="font-medium">One-to-Many:</span> Candidate
                    to Appointments (One candidate can have many appointments)
                  </li>
                  <li>
                    <span className="font-medium">One-to-Many:</span> Job to
                    Conversations (One job can have many conversations)
                  </li>
                  <li>
                    <span className="font-medium">One-to-Many:</span> Candidate
                    to Conversations (One candidate can have many conversations)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
