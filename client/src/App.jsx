import { useState } from "react";
import axios from "axios";

function App() {
  const [pdfText, setPdfText] = useState("");
  const [result, setResult] = useState("Invalid");
  const [problems, setProblems] = useState([{ control: "", issue: "" }]);

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]); // name must be 'file'
    const res = await axios.post("http://localhost:3001/upload", formData);
    setPdfText(res.data.text);
  };

  const handleProblemChange = (index, field, value) => {
    const newProblems = [...problems];
    newProblems[index][field] = value;
    setProblems(newProblems);
  };

  const addProblem = () => {
    setProblems([...problems, { control: "", issue: "" }]);
  };

  const jsonOutput = {
    messages: [
      {
        role: "user",
        content: `(control ${problems
          .map((p) => p.control)
          .join(", ")}) ${pdfText}`,
      },
      {
        role: "assistant",
        content: {
          result,
          problems,
        },
      },
    ],
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

        {/* Problems List */}
        {problems.map((p, i) => (
          <div key={i} className="mb-4 border p-4 rounded bg-gray-50">
            <input
              type="text"
              placeholder="Control (e.g. A.5.4)"
              value={p.control}
              onChange={(e) =>
                handleProblemChange(i, "control", e.target.value)
              }
              className="block w-full mb-2 border p-2 rounded"
            />
            <textarea
              placeholder="Issue description"
              value={p.issue}
              onChange={(e) => handleProblemChange(i, "issue", e.target.value)}
              className="block w-full border p-2 rounded resize-none"
            />
          </div>
        ))}
        <button
          onClick={addProblem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Problem
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

export default App;
