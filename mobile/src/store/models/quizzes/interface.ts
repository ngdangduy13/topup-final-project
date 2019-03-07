
export interface QuizzesState {
    allQuizzesPublished: GeneralQuiz[];
    allQuizzesDraft: GeneralQuiz[];
    allQuizzesRemoved: GeneralQuiz[];
    allQuizzesSearched: GeneralQuiz[];
    allQuizzesBeacon: GeneralQuiz[];
    questionToCreate: Question[];
    quizToCreate: QuizToCreate;
    quizIsPlaying: SingleQuiz;
    questionAnswer: QuestionAnswer[];
    questionResult: QuestionResult;
    questionChecklist: QuestionChecklist;
    endOfList: EndList;
}

export interface QuestionChecklist {
    isHavingCoverUrl: boolean[];
    isHavingQuestion: boolean[];
}

export interface EndList {
    PUBLISHED: boolean;
    DRAFT: boolean;
    REMOVED: boolean;
    SEARCHED: boolean;
}
type QuizzState = 'DRAFT' | 'PUBLISHED' | 'REMOVED';
type CoverType = 'IMAGE' | 'VIDEO';

export interface GeneralQuiz {
    coverImageUrl: string;
    title: string;
    _id: string;
    createdAt: string;
    questionCount: number;
    state: string;
}

export interface QuestionResult {
    correctAnswerCount: number;
    points: number;
}

export interface SingleQuiz {
    _id: string;
    coverImageUrl: string;
    title: string;
    description: string;
    state: QuizzState;
    createdAt: number;
    questionCount: number;
    beacon: Beacon;
    questions: Question[];
}

export interface QuizToCreate {
    _id: string;
    coverType: string;
    coverImageUrl: string;
    description: string;
    state: QuizzState;
    createdAt: string;
    title: string;
    beacon: Beacon;
}

export interface Question {
    id: number;
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

export interface QuestionAnswer {
    questionId: number;
    answerId: number;
}

export interface Beacon {
    isActive: boolean;
    uuid: string;
    major: string;
    minor: string;
}

export interface CreateQuizParams {
    coverImageUrl: string;
    title: string;
    description: string;
    state: QuizzState;
    beacon: Beacon;
}

export interface UpdateQuizParams {
    currentState: string;
    stateUpdate: string;
}

export interface UpdateAnswerParams {
    answer: string;
    indexQuestion: number;
    indexAnswer: number;
}

export interface UpdateIsCorrectParams {
    indexQuestion: number;
    indexAnswer: number;
}

export interface UpdateQuizToCreateParam {
    title?: string;
    description?: string;
    state?: string;
    isActive?: boolean;
    uuid?: string;
    major?: string;
    minor?: string;
    coverImageUrl?: string;
    _id?: string;
}
