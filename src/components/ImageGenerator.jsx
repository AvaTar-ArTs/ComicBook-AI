import React, { useState } from "react";
import axios from "axios";
import download from "downloadjs";

import "./ImageGenerator.css";

function ImageGenerator() {
  const [prompt, setPrompt] = useState("A cute baby sea otter");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateImages() {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/generate-image", {
        prompt,
        n: 2,
        size: "256x256",
      });
      setGeneratedImages(response.data.data || []);
    } catch (requestError) {
      console.error("Error generating images:", requestError);
      setError(
        requestError.response?.data?.error ||
          "Image generation is not configured. Add a server-side image-generation route."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function downloadImage(url, filename) {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      download(response.data, filename, "image/png");
    } catch (downloadError) {
      console.error("Error downloading image:", downloadError);
      setError("The generated image could not be downloaded.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <label htmlFor="prompt">Enter a Prompt: </label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <button
        onClick={generateImages}
        disabled={isLoading || !prompt.trim()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isLoading ? "Generating..." : "Generate Images"}
      </button>
      {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}
      {isLoading && <p className="mt-4 text-gray-600">Loading...</p>}
      {generatedImages.length > 0 && (
        <div className="mt-4">
          {generatedImages.map((image, index) => (
            <div key={image.url || index} className="mt-4">
              <img
                src={image.url}
                alt={\`Generated Image \${index + 1}\`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <button onClick={() => downloadImage(image.url, \`image\${index}.png\`)}>
                Download Image
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
