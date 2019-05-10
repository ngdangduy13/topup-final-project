import { IFindQuizzResult } from '../../../../../api/modules/quizzes/interface';

export interface QuizzPageState {
  listQuizz: IFindQuizzResult;
  currentQuiz: SingleQuiz;
  questionToCreate: Question[];

  quizzListPageIndex: string;
  quizzListPageOrientation: boolean;
  pageSize: number;
  sortBy: string;

  isQuizzListNextDisabled: boolean;
  isQuizzListPrevDisabled: boolean;
  quizzListFirstPage: boolean;

  isBusy: boolean;
  errorMessage: string;
}

export interface SingleQuiz {
  _id: string;
  coverImageUrl: string;
  title: string;
  description: string;
  state: string;
  createdAt: number;
  questionCount: number;
  questions: Question[];
}

export interface Question {
  id?: number;
  coverType: string;
  coverUrl: string;
  description: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  description: string;
  isCorrect: boolean;
}
