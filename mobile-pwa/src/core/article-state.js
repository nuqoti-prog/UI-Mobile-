export class ArticleState {
  constructor() {
    this.status = 'draft';
    this.lastSyncedAt = null;
  }

  setStatus(status) {
    this.status = status;
  }

  markSynced() {
    this.lastSyncedAt = new Date().toISOString();
  }
}
