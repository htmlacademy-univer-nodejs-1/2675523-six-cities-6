export interface DocumentOwnerCheckInterface {
  getOwnerId(documentId: string): Promise<string | null>;
}
