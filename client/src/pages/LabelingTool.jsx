import { useState } from "react";
import axios from "axios";

function LabelingTool() {
  const [pdfText, setPdfText] = useState("");
  const [result, setResult] = useState("Invalid");
  const [details, setDetails] = useState([{ control: "", issue: "" }]);
  const [affectedControls, setAffectedControls] = useState([]);

  const allControls = [
    // A.5 Organizational Controls
    { id: "A.5.1", title: "Policies for information security" },
    { id: "A.5.2", title: "Information security roles and responsibilities" },
    { id: "A.5.3", title: "Segregation of duties" },
    { id: "A.5.4", title: "Management responsibilities" },
    { id: "A.5.5", title: "Contact with authorities" },
    { id: "A.5.6", title: "Contact with special interest groups" },
    { id: "A.5.7", title: "Threat intelligence" },
    { id: "A.5.8", title: "Information security in project management" },
    {
      id: "A.5.9",
      title: "Inventory of information and other associated assets",
    },
    {
      id: "A.5.10",
      title: "Acceptable use of information and other associated assets",
    },
    { id: "A.5.11", title: "Return of assets" },
    { id: "A.5.12", title: "Classification of information" },
    { id: "A.5.13", title: "Labelling of information" },
    { id: "A.5.14", title: "Information transfer" },
    { id: "A.5.15", title: "Access control" },
    { id: "A.5.16", title: "Identity management" },
    { id: "A.5.17", title: "Authentication information" },
    { id: "A.5.18", title: "Access rights" },
    { id: "A.5.19", title: "Information security in supplier relationships" },
    {
      id: "A.5.20",
      title: "Addressing information security within supplier agreements",
    },
    {
      id: "A.5.21",
      title: "Managing information security in the ICT supply chain",
    },
    {
      id: "A.5.22",
      title: "Monitoring, review and change management of supplier services",
    },
    { id: "A.5.23", title: "Information security for use of cloud services" },
    {
      id: "A.5.24",
      title:
        "Information security incident management planning and preparation",
    },
    {
      id: "A.5.25",
      title: "Assessment and decision on information security events",
    },
    { id: "A.5.26", title: "Response to information security incidents" },
    { id: "A.5.27", title: "Learning from information security incidents" },
    { id: "A.5.28", title: "Collection of evidence" },
    { id: "A.5.29", title: "Information security during disruption" },
    { id: "A.5.30", title: "ICT readiness for business continuity" },
    {
      id: "A.5.31",
      title: "Legal, statutory, regulatory and contractual requirements",
    },
    { id: "A.5.32", title: "Intellectual property rights" },
    { id: "A.5.33", title: "Protection of records" },
    { id: "A.5.34", title: "Privacy and protection of PII" },
    { id: "A.5.35", title: "Independent review of information security" },
    {
      id: "A.5.36",
      title:
        "Compliance with policies, rules and standards for information security",
    },
    { id: "A.5.37", title: "Documented operating procedures" },

    // A.6 People Controls
    { id: "A.6.1", title: "Screening" },
    { id: "A.6.2", title: "Terms and conditions of employment" },
    {
      id: "A.6.3",
      title: "Information security awareness, education and training",
    },
    { id: "A.6.4", title: "Disciplinary process" },
    {
      id: "A.6.5",
      title: "Responsibilities after termination or change of employment",
    },
    { id: "A.6.6", title: "Confidentiality or non-disclosure agreements" },
    { id: "A.6.7", title: "Remote working" },
    { id: "A.6.8", title: "Information security event reporting" },

    // A.7 Physical Controls
    { id: "A.7.1", title: "Physical security perimeters" },
    { id: "A.7.2", title: "Physical entry" },
    { id: "A.7.3", title: "Securing offices, rooms and facilities" },
    { id: "A.7.4", title: "Physical security monitoring" },
    {
      id: "A.7.5",
      title: "Protecting against physical and environmental threats",
    },
    { id: "A.7.6", title: "Working in secure areas" },
    { id: "A.7.7", title: "Clear desk and clear screen" },
    { id: "A.7.8", title: "Equipment siting and protection" },
    { id: "A.7.9", title: "Security of assets off-premises" },
    { id: "A.7.10", title: "Storage media" },
    { id: "A.7.11", title: "Supporting utilities" },
    { id: "A.7.12", title: "Cabling security" },
    { id: "A.7.13", title: "Equipment maintenance" },
    { id: "A.7.14", title: "Secure disposal or re-use of equipment" },

    // A.8 Technological Controls
    { id: "A.8.1", title: "User endpoint devices" },
    { id: "A.8.2", title: "Privileged access rights" },
    { id: "A.8.3", title: "Information access restriction" },
    { id: "A.8.4", title: "Access to source code" },
    { id: "A.8.5", title: "Secure authentication" },
    { id: "A.8.6", title: "Capacity management" },
    { id: "A.8.7", title: "Protection against malware" },
    { id: "A.8.8", title: "Management of technical vulnerabilities" },
    { id: "A.8.9", title: "Configuration management" },
    { id: "A.8.10", title: "Information deletion" },
    { id: "A.8.11", title: "Data masking" },
    { id: "A.8.12", title: "Data leakage prevention" },
    { id: "A.8.13", title: "Information backup" },
    { id: "A.8.14", title: "Redundancy of information processing facilities" },
    { id: "A.8.15", title: "Logging" },
    { id: "A.8.16", title: "Monitoring activities" },
    { id: "A.8.17", title: "Clock synchronization" },
    { id: "A.8.18", title: "Use of privileged utility programs" },
    { id: "A.8.19", title: "Installation of software on operational systems" },
    { id: "A.8.20", title: "Networks security" },
    { id: "A.8.21", title: "Security of network services" },
    { id: "A.8.22", title: "Segregation of networks" },
    { id: "A.8.23", title: "Web filtering" },
    { id: "A.8.24", title: "Use of cryptography" },
    { id: "A.8.25", title: "Secure development life cycle" },
    { id: "A.8.26", title: "Application security requirements" },
    {
      id: "A.8.27",
      title: "Secure system architecture and engineering principles",
    },
    { id: "A.8.28", title: "Secure coding" },
    { id: "A.8.29", title: "Security testing in development and acceptance" },
    { id: "A.8.30", title: "Outsourced development" },
    {
      id: "A.8.31",
      title: "Separation of development, test and production environments",
    },
    { id: "A.8.32", title: "Change management" },
    { id: "A.8.33", title: "Test information" },
    {
      id: "A.8.34",
      title: "Protection of information systems during audit and testing",
    },
  ];

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]); // name must be 'file'
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData);
    setPdfText(res.data.text);
  };

  const handleProblemChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const addProblem = () => {
    setDetails([...details, { control: "", issue: "" }]);
  };
  const normalizedPdfText = pdfText.replace(/[‘’]/g, "'");
  const jsonOutput = {
    messages: [
      {
        role: "user",
        content: `(control ${affectedControls.join(", ")}) ${normalizedPdfText}`,
      },
      {
        role: "assistant",
        content: JSON.stringify({ result, details }, null, 2) // ✅ this is the key line
      }
    ]
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">PDF Reviewer Interface</h1>

        {/* File Upload */}
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleUpload}
          className="mb-4"
        />

        {/* Extracted Text */}
        <label className="block font-semibold mb-1">Extracted PDF Text</label>
        <textarea
          value={pdfText}
          readOnly
          rows={10}
          className="w-full border p-2 mb-6 rounded resize-none"
        />

        {/* Affected Controls */}
        <label className="block font-semibold mb-1">
          Select Affected Controls:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4 max-h-64 overflow-y-auto">
          {allControls.map((control) => (
            <button
              key={control.id}
              type="button"
              onClick={() => {
                setAffectedControls((prev) =>
                  prev.includes(control.id)
                    ? prev.filter((c) => c !== control.id)
                    : [...prev, control.id]
                );
              }}
              className={`text-sm text-left px-3 py-2 border rounded transition ${
                affectedControls.includes(control.id)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              <span className="block font-medium">{control.id}</span>
              <span className="block text-xs">{control.title}</span>
            </button>
          ))}
        </div>

        {/* Assistant Response */}
        <h2 className="text-xl font-semibold mb-2">Assistant's Response</h2>
        <label className="block mb-2">
          Result:
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="ml-2 border p-1 rounded"
          >
            <option value="Invalid">Invalid</option>
            <option value="Valid">Valid</option>
          </select>
        </label>

        {/* Details List */}
        {details.map((p, i) => (
          <div key={i} className="mb-4 border p-4 rounded bg-gray-50 relative">
            <label className="block font-semibold mb-1">Control</label>
            <select
              value={p.control}
              onChange={(e) =>
                handleProblemChange(i, "control", e.target.value)
              }
              className="block w-full mb-2 border p-2 rounded"
            >
              <option value="">-- Select control --</option>
              {allControls
                .filter((c) => affectedControls.includes(c.id))
                .map((control) => (
                  <option key={control.id} value={control.id}>
                    {control.id} – {control.title}
                  </option>
                ))}
            </select>

            <label className="block font-semibold mb-1">Issue</label>
            <textarea
              placeholder="Issue description"
              value={p.issue}
              onChange={(e) => handleProblemChange(i, "issue", e.target.value)}
              className="block w-full border p-2 rounded resize-none"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() =>
                setDetails((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
            >
              Remove ✖
            </button>
          </div>
        ))}

        <button
          onClick={addProblem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Problem
        </button>

        <br />
        {/* Submit Button */}
        <button
          onClick={async () => {
            // Validation checks
            if (affectedControls.length === 0) {
              alert("Please select at least one affected control.");
              return;
            }

            if (!pdfText.trim()) {
              alert("Please upload and extract a PDF or Word document first.");
              return;
            }

            if (result === "Invalid") {
              const validDetails = details.filter(
                (p) => p.control && p.issue.trim()
              );
              if (validDetails.length === 0) {
                alert(
                  "Please provide at least one valid problem if the result is Invalid."
                );
                return;
              }
            }

            const normalizedPdfText = pdfText.replace(/[‘’]/g, "'");
            // Build JSON
            const jsonOutput = {
              messages: [
                {
                  role: "user",
                  content: `(control ${affectedControls.join(", ")}) ${normalizedPdfText}`,
                },
                {
                  role: "assistant",
                  content: JSON.stringify({ result, details }, null, 2) // ✅ this is the key line
                }
              ]
            };
            

            // Submit to backend
            try {
                const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/submit`,
                jsonOutput
                );
              if (res.data.success) {
                alert("Submitted successfully!");

                // Clear form after submit
                setPdfText("");
                setAffectedControls([]);
                setDetails([{ control: "", issue: "" }]);
                setResult("Invalid");
              } else {
                alert("Submission failed.");
              }
            } catch (err) {
              console.error(err);
              alert("Error submitting data.");
            }
          }}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Submit to Dataset
        </button>

        {/* JSON Output */}
        <h2 className="text-xl font-semibold mt-8 mb-2">JSON Preview</h2>
        <pre className="bg-gray-900 text-green-200 p-4 rounded overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(jsonOutput, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default LabelingTool;
