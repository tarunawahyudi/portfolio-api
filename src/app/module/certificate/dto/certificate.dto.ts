export interface CertificateDisplay {
  type: 'icon' | 'upload' | 'default';
  value: string;
  backgroundColor?: string;
  color?: string;
}

export interface CreateCertificateRequest {
  userId: string;
  title: string;
  organization?: string;
  issueDate?: string;
  expirationDate?: string | null;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  display?: CertificateDisplay;
}

export interface UpdateCertificateRequest {
  title?: string;
  organization?: string;
  issueDate?: string;
  expirationDate?: string | null;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  display?: CertificateDisplay;
  certificateImage?: string | null;
}

export interface CertificateResponse {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  expirationDate: string | null;
  credentialId: string;
  credentialUrl: string;
  certificateImage: string | null;
  description: string;
  display: CertificateDisplay;
}
