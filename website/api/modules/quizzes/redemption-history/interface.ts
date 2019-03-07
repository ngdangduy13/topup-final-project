import { HasCreationAuditInfo, IsAuditable, PageableResult, PageableQuery, SortableQuery, HasActive, HasModificationAuditInfo } from '../../../core/interfaces';
import { Document } from 'mongoose';

export interface IRedemptionHistory extends IsAuditable, Document, HasActive {
    _id: string;
    userId: string;
    points: number;
    reason: string;
}

export interface ICreateRedemptionHistoryInput extends HasCreationAuditInfo, HasActive {
    userId: string;
    points: number;
    reason: string;
}

export interface IFindRempHistoryDetail extends HasActive {
    _id: string;
    userId: string;
    points: number;
    reason: string;
    createdAt: Date;
}

export interface IFindRempHistoryResult extends PageableResult<IFindRempHistoryDetail> { }

export interface IFindRempHistoryQuery extends PageableQuery, SortableQuery, HasActive {
    userId?: string;
    searchTerm?: string;
}
export interface ICancelRedeemPoints extends HasModificationAuditInfo {
    redemptionId: string;
    userId: string;
}
