

const EC = {
    NO_ERROR : 0,
    UNKNOWN_ERROR : 1,
    SYS_ERROR : 2,
    AUTH_FAILED: 11
}

const EM_EN = [ ];

EM_EN[EC.NO_ERROR] = "No Error";
EM_EN[EC.UNKNOWN_ERROR] = "Unknown Error";
EM_EN[EC.SYS_ERROR] = "System Error";

EM_EN[EC.AUTH_FAILED] = "Login Incorrect";


export class Error {


    /**
     * Represents an error state
     * 
     * @constructor
     * @param props outside (configuration) properties to use
     */
    constructor(code, ...args) {
    
        this.code = code;

        this.args = args;
    }

    getCode() {
        return this.code;
    }

    getMessageTemplate() {
        let msgTpl = EM_EN[this.code];
        return msgTpl ? msgTpl : EM_EN[EC.UNKNOWN_ERROR];
    }

    getMessage() {
        return this.getMessageTemplate();    // for now
    }

    toString() {
        return "ERROR[" + this.code + "]: " + this.getMessage();
    }


    // *************************************************************
    //
    // Class methods. Any methods that can be used as helper
    // for generic JSON data structure should be implemented here
    // and called by instance methods.
    //
    // *************************************************************

    static AUTH_FAILED(...args) {
        return new Error(EC.AUTH_FAILED, args);
    }

}

export default Error;

