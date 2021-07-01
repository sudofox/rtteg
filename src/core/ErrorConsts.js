

export const SYS_NOTIMPL = 'E_SYS_NOTIMPL';
export const SYS_DB_CONN = 'E_SYS_DB_CONN';    // no database connection
export const SYS_DB_REQ = 'E_SYS_DB_REQ';

export const SYS_BAD_ARGS = 'E_BAD_ARGS';
export const SYS_BAD_DATA = 'E_BAD_DATA';
export const SYS_INIT = 'E_INIT';
export const SYS_NETERR = 'E_NETERR';
export const SYS_ERR = 'E_SYSERR';

export const API_OK = 'OK';
export const API_NO_OP = 'W_NO_OP';
export const API_ERROR = 'E_API_ERROR';
export const API_BAD_PARAMS = 'E_BAD_PARAMS';
export const API_BAD_DATA = 'E_BAD_DATA';

export const SVC_ERROR = 'E_SVC_ERROR';

export const USER_EXISTS = 'E_USER_EXISTS';
export const USER_INVALID = 'E_USER_INVALID';
export const USER_SUSPENDED = 'E_USER_SUSPENDED';
export const USER_NOTFOUND = 'E_USER_NOTFOUND';
export const USER_DELETED = 'E_USER_DELETED'; // Deleted is different than not found as there is still a record in database
export const USER_BAD_INPUT = 'E_BAD_INPUT';
export const USER_BAD_TOKEN = 'E_BAD_TOKEN';
export const USER_BAD_REQUEST = 'E_BAD_REQ';
export const USER_BAD_AUTH = 'E_AUTH';
export const USER_NOT_ALLOWED = 'E_NOT_ALLOWED';
export const USER_OVER_LIMIT = 'E_METER_LIMIT_EXCEEDED';
export const USER_BAD_USERNAME = 'E_BAD_USERNAME';
export const USER_BAD_DEVICEID = 'E_BAD_DEVICEID';
export const USER_BAD_DIGEST = 'E_BAD_DIGEST';
export const USER_BAD_VCODE = 'E_BAD_VCODE';

export const PASS_BAD_PWD = 'E_PWD_BAD';
export const PASS_TOO_SHORT = 'E_PWD_SHORT';
export const PASS_BAD_CHARS = 'E_PWD_CHARS';
export const PASS_INCL_NAME = 'E_PWD_ICLDN';
export const PASS_NONE = 'E_PWD_NONE';

export const EMAIL_EXISTS = 'E_EMAIL_EXISTS';

export const INVALID_ACTION = 'E_BAD_ACTION';   // action already done, can't do it again

export const RES_NOTFOUND = 'E_RES_NOTFOUND';
export const RES_NOACCESS = 'E_RES_NOACCESS';
export const RES_OVERLIMIT = 'E_RES_OVERLIMIT';
export const RES_ERROR = 'E_RES_ERROR';
export const TAG_NOTFOUND = 'E_TAG_NOTFOUND';

export const CONFIRMED_ALREADY = 'E_CFRM_PRV';
export const COMPLETED_ALREADY = 'E_DONE_PRV';

export const HTTP_CLIENT_ERROR = 400;
export const HTTP_CLIENT_AUTH = 401;
export const HTTP_CLIENT_NOTFOUND = 404;
export const HTTP_TOO_MANY_REQUESTS = 429;

export const HTTP_SERVER_ERROR = 500;   // internal server error
export const HTTP_SERVER_NOTIMPL = 501;   // not implemented
export const HTTP_SERVER_NOTAVL = 503;   // service unavailable
