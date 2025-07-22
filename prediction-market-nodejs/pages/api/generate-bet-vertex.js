import { NextApiRequest, NextApiResponse } from 'next';
import { PredictionServiceClient } from '@google-cloud/aiplatform';

// TODO: Replace with your project details
const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = 'us-central1'; // e.g., 'us-central1'
const endpointId = process.env.VERTEX_AI_ENDPOINT_ID; // Your Vertex AI Endpoint ID

const clientOptions = {
  apiEndpoint: `${location}-aiplatform.googleapis.com`,
};

const client = new PredictionServiceClient(clientOptions);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const instances = [{ content: JSON.stringify({ user_id: userId }) }];
  const parameters = {
    confidenceThreshold: 0.5,
    maxPredictions: 5,
  };

  const request = {
    endpoint: `projects/${project}/locations/${location}/endpoints/${endpointId}`,
    instances,
    parameters,
  };

  try {
    const [response] = await client.predict(request);
    const predictions = response.predictions;
    // Assuming the prediction is in the first prediction object
    const predictionResult = predictions[0].structValue.fields.output.stringValue;
    res.status(200).json(JSON.parse(predictionResult));
  } catch (error) {
    console.error('Error calling Vertex AI:', error);
    res.status(500).json({ error: 'Failed to get prediction from Vertex AI' });
  }
}