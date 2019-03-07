export interface HasCreationAuditInfo {
  createdBy: string;
  createdAt: Date;
}

export interface HasModificationAuditInfo {
  lastModifiedBy: string;
  lastModifiedAt: Date;
}

export interface IsAuditable
  extends HasCreationAuditInfo,
    HasModificationAuditInfo {}
