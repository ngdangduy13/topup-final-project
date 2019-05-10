import { Document } from 'mongoose';
import { IsAuditable, HasCreationAuditInfo, SortableQuery, PageableQuery, HasActive, PageableResult } from 'core/interfaces';

export interface IVoucher extends Document, IsAuditable {
  pointForExchange: number;
  name: string;
  description: string;
  coverUrl: string;
  code: string;
}

export interface IFindVoucher {
  pointForExchange: number;
  name: string;
  description: string;
  coverUrl: string;
  code: string;
}

export interface ICreateVoucher extends HasCreationAuditInfo {
  pointForExchange: number;
  name: string;
  description: string;
  coverUrl: string;
  code: string;
}

export interface IFindVoucherQuery extends PageableQuery, SortableQuery, HasActive {
    searchTerm?: string;
}

export interface IFindVoucherResult extends PageableResult<IFindVoucher[]> { }
