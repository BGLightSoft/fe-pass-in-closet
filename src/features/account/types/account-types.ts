export interface AccountParameter {
  id: string;
  accountId: string;
  name: string;
  data: {
    value: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Account {
  id: string;
  isActive: boolean;
  isRegistered: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  accountParameters: AccountParameter[];
}

export interface GetMyAccountResponse {
  id: string;
  email: string;
  isActive: boolean;
  isFrozen: boolean;
  registrationStatus: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  accountParameters?: Record<string, string>;
}

export interface UpdateAccountRequest {
  isActive?: boolean;
  accountParameters?: Array<{
    name: string;
    data: {
      value: string;
    };
  }>;
}

export interface UpdateAccountResponse {
  id: string;
  isActive: boolean;
  message: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export interface DeleteAccountResponse {
  message: string;
}
