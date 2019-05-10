import { IsAuditable, PageableResult, PageableQuery, SortableQuery, HasCreationAuditInfo, HasModificationAuditInfo, HasActive } from '../../core/interfaces';
import { Document } from 'mongoose';

export type QuizzState = 'DRAFT' | 'PUBLISHED' | 'REMOVED';
export type CoverType = 'IMAGE' | 'VIDEO';

export interface IQuizz extends Document, IsAuditable {
    coverImageUrl: string;
    title: string;
    description: string;
    state: QuizzState;
    beacon: {
        isActive: boolean;
        uuid: string;
        major: number;
        minor: number;
    };
    questions: [{
        id: number;
        coverType: CoverType;
        coverUrl: string;
        description: string;
        answers: [{
            id: number;
            description: string;
            isCorrect: boolean;
        }]
    }];
    questionCount: number;
}

export interface IFindQuizzDetail {
    _id: string;
    coverImageUrl: string;
    title: string;
    description: string;
    state: QuizzState;
    beacon: {
        isActive: boolean;
        uuid: string;
        major: number;
        minor: number;
    };
    questions: [{
        id: number;
        coverType: CoverType;
        coverUrl: string;
        description: string;
        answers: [{
            id: number;
            description: string;
            isCorrect: boolean;
        }]
    }];
    questionCount: number;
}

export interface IFindQuizzResult extends PageableResult<IFindQuizzDetail[]> { }

export interface IFindQuizzQuery extends PageableQuery, SortableQuery, HasActive {
    searchTerm?: string;
    state?: QuizzState;
}

export interface ICreateQuizzInput extends HasCreationAuditInfo {
    coverImageUrl: string;
    title: string;
    description: string;
    state: QuizzState;
    beacon: {
        isActive: boolean;
        uuid: string;
        major: number;
        minor: number;
    };
    questions: [{
        id: number;
        coverType: CoverType;
        coverUrl: string;
        description: string;
        answers: [{
            id: number;
            description: string;
            isCorrect: boolean;
        }]
    }];
    questionCount: number;
}

export interface IDeactivateQuizz extends HasModificationAuditInfo {
    id: string;
}
export interface IActivateQuizz extends HasModificationAuditInfo {
    id: string;
}

export interface IUpdateQuizzInput extends HasModificationAuditInfo {
    _id: string;
    coverImageUrl: string;
    title: string;
    description: string;
    state: QuizzState;
    questions: [{
        id: number;
        coverType: CoverType;
        coverUrl: string;
        description: string;
        answers: [{
            id: number;
            description: string;
            isCorrect: boolean;
        }]
    }];
    questionCount: number;
}

export interface ISubmitAnswersInput {
    userId: string;
    quizId: string;
    answers: [{
        questionId: number;
        answerId: number;
    }];
}

export interface ISubmitAnswersResult {
    correctAnswerCount: number;
    points: number;
    rewardPoints: number;
}
