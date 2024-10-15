"use strict";

import HttpStatusCode from "./http-code";

export default {
  /**
   * E_1XX: Authentication
   */
  E_101_INVALID_CREDENTIALS: {
    status: HttpStatusCode.BAD_REQUEST_400,
    code: "E_101",
    error: "INVALID_CREDENTIALS",
    message: "Maklumat diisi tidak sah. Sila semak kembali",
  },
  E_102_SESSION_TIMEOUT: {
    status: HttpStatusCode.REQUEST_TIMEOUT_408,
    code: "E_102",
    error: "SESSION_TIMEOUT",
    message: "Sesi telah tamat. Sila log masuk semula",
  },
  E_103_ACCOUNT_SUSPENDED: {
    status: HttpStatusCode.UNAUTHORIZED_401,
    code: "E_103",
    error: "ACCOUNT_SUSPENDED",
    message:
      "Akaun anda telah digantung. Sila hubungi admin untuk maklumat lanjut",
  },
  E_104_SIGNIN_ATTEMPT_EXPIRED: {
    status: HttpStatusCode.NOT_ACCEPTABLE_406,
    code: "E_104",
    error: "SIGNIN_ATTEMPT_EXPIRED",
    message: "Cubaan log masuk tamat tempoh. Sila log masuk semula",
  },
  E_105_OAUTH_SIGNIN_FAILED: {
    status: HttpStatusCode.BAD_REQUEST_400,
    code: "E_105",
    error: "OAUTH_SIGNIN_FAILED",
    message: "Cubaan log masuk gagal. Sila log masuk semula",
  },

  /**
   * E_2XX: Authorization
   */
  E_201_NOT_AUTHORIZED: {
    status: HttpStatusCode.UNAUTHORIZED_401,
    code: "E_201",
    error: "NOT_AUTHORIZED",
    message: "Tidak dibenarkan.",
  },
  E_202_INVALID_RESOURCE_OWNERSHIP: {
    status: HttpStatusCode.UNAUTHORIZED_401,
    code: "E_202",
    error: "INVALID_RESOURCE_OWNERSHIP",
    message: "Tidak dibenarkan.",
  },

  /**
   * E_3XX: Common CRUD Errors
   */
  E_301_RESOURCE_NOT_FOUND: {
    status: HttpStatusCode.NOT_FOUND_404,
    code: "E_301",
    error: "RESOURCE_NOT_FOUND",
    message: "Sumber tidak dijumpai",
  },
  E_302_VALIDATION_ERROR: {
    status: HttpStatusCode.UNPROCESSABLE_ENTITY_422,
    code: "E_302",
    error: "VALIDATION_ERROR",
    message: "Ralat dijumpai pada input. Sila semak semula",
  },
  E_303_INSUFFICIENT_INPUT: {
    status: HttpStatusCode.UNPROCESSABLE_ENTITY_422,
    code: "E_303",
    error: "INSUFFICIENT_INPUT",
    message: "Ralat dijumpai pada input. Sila semak semula",
  },
  E_304_CONFLICT_ERROR: {
    status: HttpStatusCode.CONFLICT_409,
    code: "E_304",
    error: "CONFLICT_ERROR",
    message:
      "Terdapat percanggahan data. Sila muat semula halaman dan cuba lagi",
  },
  E_305_INTERNAL_SERVER_ERROR: {
    status: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
    code: "E_305",
    error: "INTERNAL_SERVER_ERROR",
    message: "Ralat di server. Sila hubungi pihak admin",
  },
  E_306_DUPLICATE_ENTRY: {
    status: HttpStatusCode.BAD_REQUEST_400,
    code: "E_305",
    error: "BAD_REQUEST",
    message: "Data telah wujud dalam pangkalan data",
  },
} as const;
