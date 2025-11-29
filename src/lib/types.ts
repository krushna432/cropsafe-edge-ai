export interface Classification {
  [key: string]: number;
}

export interface DetectionApiResponse {
  result: {
    classification: Classification;
  };
  timing: unknown;
}

export type DiseaseInfo = {
  description: string;
  symptoms: string[];
  cause: string;
};

export interface AnalysisResult {
  disease: string;
  confidence: number;
  info?: DiseaseInfo;
  treatment?: string;
  imageUrl: string;
}

export interface FormState {
  result?: AnalysisResult;
  error?: string;
  success: boolean;
}
