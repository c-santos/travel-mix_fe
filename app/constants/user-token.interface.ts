export default interface IUserToken {
  accessToken: string | undefined;
  expires: string | undefined;
  refreshToken: string | undefined;
}
