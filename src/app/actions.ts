'use server';

import type {FormState, DetectionApiResponse, DiseaseInfo} from '@/lib/types';
import {generateTreatmentGuidance} from '@/ai/flows/generate-treatment-guidance';
import {getDiseaseInfo} from '@/ai/flows/get-disease-info';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export async function detectDisease(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const imageFile = formData.get('image') as File | null;

  if (!imageFile || imageFile.size === 0) {
    return {
      success: false,
      error: 'Please select an image file to analyze.',
    };
  }

  if (imageFile.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size should be less than 5MB.`,
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
    return {
      success: false,
      error: 'Only .jpg, .jpeg, and .png formats are supported.',
    };
  }

  // Create a new FormData and append the file with the correct field name 'file'
  const apiFormData = new FormData();
  apiFormData.append('file', imageFile);

  let data: DetectionApiResponse;
  try {
    const response = await fetch('https://edge-ai-crop-rakshak.loca.lt/api/image', {
      method: 'POST',
      body: apiFormData,
      headers: {
        'Bypass-Tunnel-Reminder': 'true',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error:', response.status, response.statusText, errorBody);
      return {
        success: false,
        error: `Failed to analyze image. The service returned an error: ${response.statusText}`,
      };
    }
    data = await response.json();
  } catch (error) {
    console.error('Network or fetch error:', error);
    if (error instanceof TypeError && error.message.includes('fetch failed')) {
      return {
        success: false,
        error:
          'Could not connect to the analysis service. Please check your network connection and try again.',
      };
    }
    return {success: false, error: 'An unexpected network error occurred.'};
  }

  if (!data.result || !data.result.classification) {
    return {
      success: false,
      error:
        'Analysis failed: The service returned an invalid response format.',
    };
  }

  const classification = data.result.classification;
  let detectedDisease = 'Unknown';
  let maxConfidence = 0;

  for (const [disease, confidence] of Object.entries(classification)) {
    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      detectedDisease = disease;
    }
  }

  if (detectedDisease === 'Unknown') {
    return {
      success: false,
      error: 'Could not identify the disease from the image.',
    };
  }

  let treatment: string | undefined = undefined;
  let info: DiseaseInfo | undefined = undefined;

  if (detectedDisease !== 'Healthy') {
    try {
      const diseaseName = detectedDisease.replace(/_/g, ' ');
      const [guidanceResult, infoResult] = await Promise.all([
        generateTreatmentGuidance({disease: diseaseName}),
        getDiseaseInfo({disease: diseaseName}),
      ]);
      treatment = guidanceResult.treatmentGuidance;
      info = infoResult;
    } catch (aiError) {
      console.error('AI generation failed:', aiError);
      treatment =
        'Could not generate AI treatment guidance at this time. Please consult a local agricultural expert.';
      info = {
        description: 'Information not available.',
        symptoms: [],
        cause: 'Not available.',
      };
    }
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const imageUrl = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

  return {
    success: true,
    result: {
      disease: detectedDisease,
      confidence: maxConfidence,
      info,
      treatment,
      imageUrl,
    },
  };
}
