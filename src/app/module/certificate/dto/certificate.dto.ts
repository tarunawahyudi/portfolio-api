export interface CreateCertificateRequest {
  userId: string;
  title: string;
  organization?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CertificateResponse {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  certificateImage: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
}
