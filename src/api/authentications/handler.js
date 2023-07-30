const autoBind = require('auto-bind');
// const handleError = require("../../exceptions/handleError");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    autoBind(this); // mem-bind nilai this untuk seluruh method sekaligus
  }
  async postAuthenticationHandler(request, h) {
    // try {
      this._validator.validatePostAuthenticationPayload(request.payload);
      const { username, password } = request.payload;
      const userId = await this._usersService.verifyUserCredential(username, password);
      const accessToken = this._tokenManager.generateAccessToken({ id: userId });
      const refreshToken = this._tokenManager.generateRefreshToken({ id: userId });
      await this._authenticationsService.addRefreshToken(refreshToken);
      const response = h.response({
        status: "success",
        message: "Authentication berhasil ditambahkan",
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    // } catch (error) {
    //   return handleError(error, h);
    // }
  }
  async putAuthenticationHandler(request) {
    // try {
      this._validator.validatePutAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id: userId } = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ id: userId });
      return {
        status: "success",
        message: "Access Token berhasil diperbarui",
        data: { accessToken },
      };
    // } catch (error) {
    //   return handleError(error, h);
    // }
  }
  async deleteAuthenticationHandler(request) {
    // try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);
      return {
        status: "success",
        message: "Refresh token berhasil dihapus",
      };
    // } catch (error) {
    //   return handleError(error, h);
    // }
  }
}

module.exports = AuthenticationsHandler;
