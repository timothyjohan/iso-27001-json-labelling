import { useState, useRef } from "react";
import axios from "axios";

function TestModel() {
  const [pdfText, setPdfText] = useState("");
  const [selectedControls, setSelectedControls] = useState([]);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  const responseRef = useRef(null);

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
    formData.append("file", e.target.files[0]);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData
      );
      setPdfText(res.data.text);
    } catch (error) {
      console.error(error);
      alert("Failed to extract document text.");
    }
  };

  const handleTest = async () => {
    if (selectedControls.length === 0) {
      alert("Please select at least one control first!");
      return;
    }
    if (!pdfText.trim()) {
      alert("Please upload and extract a document first!");
      return;
    }

    const controlsText = selectedControls
      .map((id) => {
        const found = allControls.find((c) => c.id === id);
        return found ? `${found.id} ${found.title}` : id;
      })
      .join(", ");

    const prompt = `(control ${controlsText}) ${pdfText}`;

    setGeneratedPrompt(prompt);
    setShowPromptPreview(true); // 🔥 Show the preview first
  };

  const sendPrompt = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model:
            "ft:gpt-4o-mini-2024-07-18:feha-prod:timothy-iso-jsonv1-1:BR0paFtD",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that analyzes ISO/IEC 27001 control mappings and provides validation in structured JSON format. Always respond with valid, minified JSON in the following structure:
  
  {
    "result": "Valid" | "Invalid",
    "details": [
      {
        "control": "A.5.1",
        "issue": "..."
      },
      ...
    ]
  }
  
  If the result is 'Valid', return an empty array for details. Do not include any explanations outside the JSON.`,
            },
            {
              role: "user",
              content: generatedPrompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const assistantContent = result.data.choices[0].message.content;

      // try to parse the JSON content
      let parsedResponse = {};
      try {
        parsedResponse = JSON.parse(assistantContent);
      } catch (e) {
        console.error("Failed to parse assistant content", e);
        alert("Model response was not valid JSON.");
        return;
      }

      setResponse(parsedResponse); // <--- now it's clean JSON object
      setShowPromptPreview(false);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error?.message || "Unknown error occurred.";
      alert("OpenAI Error: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">🚀 Test Fine-Tuned Model</h1>

        {/* File Upload */}
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleUpload}
          className="mb-4"
        />

        {/* Extracted Document Preview */}
        <label className="block font-semibold mb-1">
          Extracted Document Text:
        </label>
        <textarea
          value={pdfText}
          readOnly
          rows={10}
          className="w-full border p-2 mb-6 rounded resize-none"
        />

        {showPromptPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <h2 className="text-xl font-bold mb-4">📄 Prompt Preview</h2>
              <textarea
                className="w-full border p-2 rounded h-64 resize-none mb-4"
                value={generatedPrompt}
                readOnly
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPromptPreview(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={sendPrompt}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ✅ Confirm and Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Control Selector */}
        <label className="block font-semibold mb-1">
          Select Affected Controls:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6 max-h-64 overflow-y-auto">
          {allControls.map((control) => (
            <button
              key={control.id}
              type="button"
              onClick={() => {
                setSelectedControls((prev) =>
                  prev.includes(control.id)
                    ? prev.filter((c) => c !== control.id)
                    : [...prev, control.id]
                );
              }}
              className={`text-sm text-left px-3 py-2 border rounded transition ${
                selectedControls.includes(control.id)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              <span className="block font-medium">{control.id}</span>
              <span className="block text-xs">{control.title}</span>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? "🔄 Testing..." : "✅ Test Model"}
        </button>

        {/* Model Response */}
        {response && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">🎯 Model Result</h2>

            {response.result === "Valid" ? (
              <div className="bg-green-100 text-green-800 p-4 rounded font-semibold text-center">
                ✅ Document is VALID
              </div>
            ) : (
              <div className="bg-red-100 text-red-800 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">
                  ❌ Document is INVALID
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {response.details.map((detail, idx) => (
                    <li key={idx}>
                      <strong>{detail.control}</strong>: {detail.issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestModel;
