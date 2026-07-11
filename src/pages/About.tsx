import React from 'react';
import { ArrowLeft, Server, Database, Brain, Bell, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#e0f2fe_0%,#f8fafc_40%,#eef2ff_100%)] pb-20">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 border-b border-gray-200 px-8 py-4 flex items-center sticky top-0 z-40 shadow-sm">
        <button
          onClick={() => navigate('/userDashboard')}
          className="p-2 mr-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          About <span className="text-blue-600">LogStream</span>
        </h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">System Architecture</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            LogStream is a fully decoupled, event-driven microservices platform designed to ingest, process, cluster, and alert on system logs at massive scale using Machine Learning models.
          </p>
        </div>

        {/* Architecture Link */}
        <div className="mb-20 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Server className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Detailed Architecture</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            To view the complete, high-resolution system architecture and data flow diagrams, please visit our official GitHub repository.
          </p>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            <Code className="w-5 h-5" />
            View on GitHub
          </a>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-indigo-200 via-orange-200 to-emerald-200 transform -translate-x-1/2 rounded-full"></div>

          <div className="space-y-16">
            {/* 1. Ingestion Service */}
            <div className="relative flex flex-col lg:flex-row items-center lg:justify-between group">
              <div className="lg:w-5/12 mb-6 lg:mb-0 text-right pr-0 lg:pr-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">1. Ingestion Service</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  The robust entry point of the data pipeline. It is responsible for buffering high-velocity incoming logs to prevent database throttling and securely routing them to downstream workers.
                </p>
                <ul className="text-sm text-slate-600 space-y-2 mb-4 list-none text-right">
                  <li><strong className="text-slate-800">Buffer Layer:</strong> Uses Amazon SQS to queue thousands of logs seamlessly.</li>
                  <li><strong className="text-slate-800">Pipeline Consumer:</strong> AWS Lambda polls the SQS queue and bulk-inserts valid raw records into the PostgreSQL `logs` table.</li>
                  <li><strong className="text-slate-800">Batch Processor:</strong> A secondary Lambda monitors the database, groups unclustered error/warning logs into 500-item batches, and safely triggers the downstream ML container.</li>
                </ul>
                <div className="flex justify-end gap-2 text-xs font-semibold text-blue-700">
                  <span className="px-3 py-1 bg-blue-100 rounded-full border border-blue-200">AWS Lambda</span>
                  <span className="px-3 py-1 bg-blue-100 rounded-full border border-blue-200">Amazon SQS</span>
                  <span className="px-3 py-1 bg-blue-100 rounded-full border border-blue-200">Node.js</span>
                </div>
              </div>
              <div className="hidden lg:flex w-14 h-14 bg-white border-4 border-blue-200 rounded-full absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10 group-hover:scale-110 group-hover:border-blue-400 transition-all duration-300 shadow-md">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <div className="lg:w-5/12 pl-0 lg:pl-10"></div>
            </div>

            {/* 2. Processing Service */}
            <div className="relative flex flex-col lg:flex-row items-center lg:justify-between group">
              <div className="lg:w-5/12 order-2 lg:order-1 pr-0 lg:pr-10"></div>
              <div className="hidden lg:flex w-14 h-14 bg-white border-4 border-indigo-200 rounded-full absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10 group-hover:scale-110 group-hover:border-indigo-400 transition-all duration-300 shadow-md">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="lg:w-5/12 order-1 lg:order-2 mb-6 lg:mb-0 text-left pl-0 lg:pl-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">2. Processing Service</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  The heavy-lifting Machine Learning engine. It operates statelessly within ephemeral ECS Fargate containers, waking up only when a log batch is ready for processing.
                </p>
                <ul className="text-sm text-slate-600 space-y-2 mb-4 list-none">
                  <li><strong className="text-slate-800">Semantic Parsing:</strong> Generates semantic text embeddings for each log payload using PyTorch and Sentence-Transformers.</li>
                  <li><strong className="text-slate-800">Clustering:</strong> Groups logs into logical incident clusters using the <strong className="text-indigo-600">DenStream</strong> algorithm.</li>
                  <li><strong className="text-slate-800">Anomaly Detection:</strong> Analyzes cluster volumes against historical benchmarks using <strong className="text-indigo-600">Isolation Forest</strong>. If a volume spike is detected, it formally generates an Incident in the database.</li>
                </ul>
                <div className="flex justify-start gap-2 text-xs font-semibold text-indigo-700">
                  <span className="px-3 py-1 bg-indigo-100 rounded-full border border-indigo-200">Python 3.10</span>
                  <span className="px-3 py-1 bg-indigo-100 rounded-full border border-indigo-200">ECS Fargate</span>
                  <span className="px-3 py-1 bg-indigo-100 rounded-full border border-indigo-200">PyTorch</span>
                </div>
              </div>
            </div>

            {/* 3. Query Service */}
            <div className="relative flex flex-col lg:flex-row items-center lg:justify-between group">
              <div className="lg:w-5/12 mb-6 lg:mb-0 text-right pr-0 lg:pr-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">3. Query Service</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  The robust backend API for the user-facing application. It securely exposes data to clients while enforcing strict permissions and caching strategies.
                </p>
                <ul className="text-sm text-slate-600 space-y-2 mb-4 list-none text-right">
                  <li><strong className="text-slate-800">RBAC Backend:</strong> An Express.js query service that enforces strict Role-Based Access Control (RBAC) by unpacking secure JWT tokens to authorize routes.</li>
                  <li><strong className="text-slate-800">Database Layer:</strong> Interfaces directly with PostgreSQL to power complex joins (e.g. mapping internal UUIDs to human-readable assignee names).</li>
                  <li><strong className="text-slate-800">Caching Engine:</strong> Utilizes a <strong className="text-blue-600">Redis Client</strong> to cache frequently accessed incident lists, drastically reducing database load and latency.</li>
                </ul>
                <div className="flex justify-end gap-2 text-xs font-semibold text-emerald-700">
                  <span className="px-3 py-1 bg-emerald-100 rounded-full border border-emerald-200">Express.js</span>
                  <span className="px-3 py-1 bg-emerald-100 rounded-full border border-emerald-200">PostgreSQL</span>
                  <span className="px-3 py-1 bg-emerald-100 rounded-full border border-emerald-200">Redis</span>
                </div>
              </div>
              <div className="hidden lg:flex w-14 h-14 bg-white border-4 border-emerald-200 rounded-full absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10 group-hover:scale-110 group-hover:border-emerald-400 transition-all duration-300 shadow-md">
                <Database className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="lg:w-5/12 pl-0 lg:pl-10"></div>
            </div>

            {/* 4. Frontend Service */}
            <div className="relative flex flex-col lg:flex-row items-center lg:justify-between group">
              <div className="lg:w-5/12 order-2 lg:order-1 pr-0 lg:pr-10"></div>
              <div className="hidden lg:flex w-14 h-14 bg-white border-4 border-cyan-200 rounded-full absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10 group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300 shadow-md">
                <Code className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="lg:w-5/12 order-1 lg:order-2 mb-6 lg:mb-0 text-left pl-0 lg:pl-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">4. Frontend Service</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  The command center for administrators and site reliability engineers. It provides an intuitive, high-performance web interface to manage tickets and view clustering metrics.
                </p>
                <ul className="text-sm text-slate-600 space-y-2 mb-4 list-none">
                  <li><strong className="text-slate-800">React SPA:</strong> A blazing-fast Single Page Application (SPA) providing seamless navigation without full-page reloads.</li>
                  <li><strong className="text-slate-800">Type Safety:</strong> Built with robust <strong className="text-cyan-600">TypeScript</strong> to ensure reliable and bug-free data fetching from the Query Service.</li>
                  <li><strong className="text-slate-800">Modern Styling:</strong> Styled with TailwindCSS and Lucide Icons to provide an elegant and dynamic user experience.</li>
                </ul>
                <div className="flex justify-start gap-2 text-xs font-semibold text-cyan-700">
                  <span className="px-3 py-1 bg-cyan-100 rounded-full border border-cyan-200">React</span>
                  <span className="px-3 py-1 bg-cyan-100 rounded-full border border-cyan-200">TypeScript</span>
                  <span className="px-3 py-1 bg-cyan-100 rounded-full border border-cyan-200">TailwindCSS</span>
                </div>
              </div>
            </div>

            {/* 5. Alerting Service */}
            <div className="relative flex flex-col lg:flex-row items-center lg:justify-between group">
              <div className="lg:w-5/12 mb-6 lg:mb-0 text-right pr-0 lg:pr-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">5. Alerting Service</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  The external notification bus. Built using a strict decoupled philosophy, this service never directly queries the database. Instead, it relies purely on event streaming to notify users.
                </p>
                <ul className="text-sm text-slate-600 space-y-2 mb-4 list-none text-right">
                  <li><strong className="text-slate-800">Event Capturing:</strong> Listens to a custom AWS EventBridge bus (`Logstream-alert-bus`) for `VolumeAnomalyDetected` payloads fired by the ML Processor.</li>
                  <li><strong className="text-slate-800">SNS Publisher:</strong> An AWS Lambda intercepts the anomaly payload, formats a detailed HTML/Text alert report, and pushes it to an Amazon SNS topic.</li>
                  <li><strong className="text-slate-800">Subscription API:</strong> Provides an API Gateway integration for users to securely subscribe their emails to the SNS topic without exposing internal AWS ARNs.</li>
                </ul>
                <div className="flex justify-end gap-2 text-xs font-semibold text-orange-700">
                  <span className="px-3 py-1 bg-orange-100 rounded-full border border-orange-200">EventBridge</span>
                  <span className="px-3 py-1 bg-orange-100 rounded-full border border-orange-200">Amazon SNS</span>
                  <span className="px-3 py-1 bg-orange-100 rounded-full border border-orange-200">AWS SAM</span>
                </div>
              </div>
              <div className="hidden lg:flex w-14 h-14 bg-white border-4 border-orange-200 rounded-full absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10 group-hover:scale-110 group-hover:border-orange-400 transition-all duration-300 shadow-md">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
              <div className="lg:w-5/12 pl-0 lg:pl-10"></div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
