export interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export interface InterviewAnswers {
  origin?: string;
  pivot?: string;
  struggle?: string;
  superpower?: string;
  soft_heart?: string;
  compliment?: string;
  friction?: string;
  customer?: string;
  forefront?: string;
  legacy?: string;
  [key: string]: string | undefined;
}

export interface ReportData {
  title: string;
  narrative_thread: string;
  unfair_advantage: string;
  confluation_thesis: string;
  immediate_vision: string;
  market_analysis?: string; // For the live research tab
}

export interface Question {
  id: keyof InterviewAnswers;
  text: string;
}
