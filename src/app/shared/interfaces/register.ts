export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  telephoneNumber?: string;
  dateOfBirth?: string;
  genderName: string;
  roleName: string;
  profileImage?: File;
}

export interface RegisterResponse {
  message: string;
}
