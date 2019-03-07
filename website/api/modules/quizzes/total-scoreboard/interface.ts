import { Document } from 'mongoose';
import { IsAuditable, PageableQuery, SortableQuery, PageableResult, HasModificationAuditInfo, HasCreationAuditInfo } from '../../../core/interfaces';

export interface ITotalScoreBoard extends Document, IsAuditable {
    userId: string;
    points: number;
    username: string;
    profileImgUrl: string;
    quizId: string[];
}

export interface IFindTotalScoreBoardQuery extends PageableQuery, SortableQuery {
    userId?: string;
    quizId?: string;
}

export interface IFindTotalScoreBoardDetail {
    _id: string;
    userId: string;
    points: number;
    username: string;
    profileImgUrl: string;
    quizId: string[];
}

export interface IFindTotalScoreBoardResult extends PageableResult<IFindTotalScoreBoardDetail> { }

export interface ICreateTotalScoreBoardInput extends HasCreationAuditInfo {
    userId: string;
    points: number;
    username: string;
    profileImgUrl: string;
    quizId: string[];
}

export interface IUpdateTotalScoreBoardInput extends HasModificationAuditInfo {
    _id: string;
    userId: string;
    points: number;
    username: string;
    profileImgUrl: string;
    quizId: string;
}
