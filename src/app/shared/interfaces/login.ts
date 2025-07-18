export interface LoginRequest {
      email: string
  password: string
}
export interface LoginSuccessResponse {
    userId: number
  userName: string
    token: string
  email: string
  role: string
  imageUrl: any
}