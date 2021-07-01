import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {getLang} from "src/i18n/utils";

const grecaptchaObject = window.grecaptcha; // You must provide access to the google grecaptcha object.
const APIKEY = process.env.REACT_APP_GOOGLE_RECAPTCHA_KEY;

export const ReCaptcha = ({recaptchaRef}) => {
  return (
    <div style={{visibility: "hidden"}}>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={APIKEY}
        size="invisible"
        hl={getLang()}
      />
    </div>
  );
};

export default ReCaptcha;
