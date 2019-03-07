import { Document } from 'mongoose';
import { IsAuditable, PageableQuery, SortableQuery, PageableResult, HasModificationAuditInfo, HasCreationAuditInfo } from '../../../../core/interfaces';

export interface IQuizzScoreBoard extends Document, IsAuditable {
    quizId: string;
    userId: string;
    points: number;
    username: string;
    firstSubmittedAt: Date;
    profileImgUrl: string;
}

export interface IFindQuizzScoreBoardQuery extends PageableQuery, SortableQuery {
    quizId: string;
    userId: string;
    firstSubmittedAt: Date;
}

export interface IFindQuizzScoreBoardDetail {
    _id: string;
    quizId: string;
    userId: string;
    points: number;
    username: string;
    firstSubmittedAt: Date;
    profileImgUrl: string;
}

export interface IFindQuizzScoreBoardResult extends PageableResult<IFindQuizzScoreBoardDetail> { }

export interface ICreateQuizzScoreBoardInput extends HasCreationAuditInfo {
    quizId: string;
    userId: string;
    points: number;
    username: string;
    firstSubmittedAt: Date;
    profileImgUrl: string;
}

export interface IUpdateQuizzScoreBoardInput extends HasModificationAuditInfo {
    _id: string;
    quizId: string;
    userId: string;
    points: number;
    username: string;
    profileImgUrl: string;
}

export interface ICheckUserScoreboardParms {
    quizId: string;
    userId: string;
}
