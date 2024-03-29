import { Request, Response } from "express";
const numeral = require("numeral");

/*jshint node:true, esversion: 6 */
require("dotenv").config();
let jose = require("node-jose");
let express = require("express");
let app = express();
let jwt = require("jsonwebtoken");
let svgCaptcha = require("svg-captcha");
let winston = require("winston");
const ipRangeCheck = require("ip-range-check");

// requires for audio support
let lame = require("lame");
let wav = require("wav");
import text2wav = require("text2wav");
let streamifier = require("streamifier");
let arrayBufferToBuffer = require("arraybuffer-to-buffer");

const AUTHORIZED_RESOURCE_SERVER_IP_RANGE_LIST =
  process.env.AUTHORIZED_RESOURCE_SERVER_IP_RANGE_LIST || "127.0.0.1";
let LISTEN_IP = process.env.LISTEN_IP || "0.0.0.0";
let HOSTNAME = require("os").hostname();
let CAPTCHA_SIGN_EXPIRY: number =
  (process.env.CAPTCHA_SIGN_EXPIRY && +process.env.CAPTCHA_SIGN_EXPIRY) || 30; // In minutes
let JWT_SIGN_EXPIRY = process.env.JWT_SIGN_EXPIRY || "30"; // In minutes
let SECRET = process.env.SECRET || "defaultSecret";
let PRIVATE_KEY = process.env.PRIVATE_KEY
  ? JSON.parse(process.env.PRIVATE_KEY)
  : {
      kty: "oct",
      kid: "gBdaS-G8RLax2qObTD94w",
      use: "enc",
      alg: "A256GCM",
      k: "FK3d8WvSRdxlUHs4Fs_xxYO3-6dCiUarBwiYNFw5hv8",
    };
let LOG_LEVEL = process.env.LOG_LEVEL || "debug";
let SERVICE_PORT = process.env.SERVICE_PORT || 8080;
let WINSTON_HOST = process.env.WINSTON_HOST;
let WINSTON_PORT = process.env.WINSTON_PORT;
let AUDIO_ENABLED = process.env.AUDIO_ENABLED || "true";

// Prevent default keys going into production
if (process.env.NODE_ENV == "production") {
  if (SECRET == "defaultSecret" || PRIVATE_KEY.kid == "gBdaS-G8RLax2qObTD94w") {
    winston.info(
      "You MUST change SECRET and PRIVATE_KEY before running in a production environment."
    );
    process.exit(1);
  }
}

if (
  process.env.NODE_ENV != "production" ||
  process.env.CORS_ALLOW_ALL == "true"
) {
  app.use(function (req: Request, res: Response, next: Function) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
}

////////////////////////////////////////////////////////
/*
 * Logger init
 */
////////////////////////////////////////////////////////
winston.level = LOG_LEVEL;
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  timestamp: true,
});
if (process.env.WINSTON_PORT) {
  winston.add(winston.transports.Syslog, {
    host: WINSTON_HOST,
    port: WINSTON_PORT,
    protocol: "udp4",
    localhost: HOSTNAME,
  });
}

////////////////////////////////////////////////////////
/*
 * App Startup
 */
////////////////////////////////////////////////////////

// create the Encoder instance
let encoder = new lame.Encoder({
  // input
  channels: 1, // 1 channels
  bitDepth: 16, // 16-bit samples
  sampleRate: 44100, // 44,100 Hz sample rate

  // output
  bitRate: 128,
  outSampleRate: 22050,
  mode: lame.MONO, // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO
});

// init app
app.use(express.json());

let args = process.argv;
if (args.length == 3 && args[2] == "server") {
  let server = app.listen(SERVICE_PORT, LISTEN_IP, function () {
    let host = server.address().address;
    let port = server.address().port;
    winston.info(`MyGov Captcha Service listening at http://${host}:${port}`);
    winston.info(`Log level is at: ${LOG_LEVEL}`);
  });
}

////////////////////////////////////////////////////////
/*
 * Encryption Routines
 */
////////////////////////////////////////////////////////
async function decrypt(body: object, private_key: object) {
  winston.debug(`to decrypt body: ` + JSON.stringify(body));
  return jose.JWK.asKey(private_key, "json")
    .then((res: any) => {
      return jose.JWE.createDecrypt(res)
        .decrypt(body)
        .then((decrypted: any) => {
          let decryptedObject = JSON.parse(
            decrypted.plaintext.toString("utf8")
          );
          winston.debug("decrypted object: " + JSON.stringify(decryptedObject));
          return decryptedObject;
        });
    })
    .catch((e: Error) => {
      winston.error(`err: ` + JSON.stringify(e));
      throw e;
    });
}

async function encrypt(body: object) {
  winston.debug(`encrypt: ` + JSON.stringify(body));
  let buff = Buffer.from(JSON.stringify(body));
  return jose.JWE.createEncrypt(PRIVATE_KEY)
    .update(buff)
    .final()
    .then((cr: JSON) => {
      winston.debug(`encrypted: ` + JSON.stringify(cr));
      return cr;
    })
    .catch((e: Error) => {
      winston.error(`err: ` + JSON.stringify(e));
      throw e;
    });
}

////////////////////////////////////////////////////////
/*
 * Get a new captcha
 */
////////////////////////////////////////////////////////
interface GetCaptchaRequest {
  nonce: string;
}

interface UnencryptedValidation {
  nonce: string;
  answer: string;
  expiry: number;
}

export interface ValidCaptchaResponse {
  nonce: string;
  captcha: string;
  validation: object;
}

export interface InvalidCaptchaResponse {
  valid: boolean;
}

let getCaptcha = async function (
  payload: GetCaptchaRequest
): Promise<ValidCaptchaResponse | InvalidCaptchaResponse> {
  //winston.debug(`getCaptcha: ${payload.nonce}`)
  let captcha = svgCaptcha.create({
    size: 6, // size of random string
    ignoreChars: "0o1il", // filter out some characters like 0o1i
    noise: 2, // number of lines to insert for noise
  });
  if (!captcha || (captcha && !captcha.data)) {
    // Something bad happened with Captcha.
    return {
      valid: false,
    };
  }
  //winston.debug(`captcha generated: ${captcha.text}`)

  // prep captcha string for good reading by putting spaces between letters
  let captchaAudioText = "Type in the text box the following: " + captcha.text;

  // add answer, nonce and expiry to body
  let body: UnencryptedValidation = {
    nonce: payload.nonce,
    answer: captcha.text,
    expiry: Date.now() + CAPTCHA_SIGN_EXPIRY * 60000,
  };
  return encrypt(body)
    .then((validation) => {
      if (validation === "") {
        // Error
        winston.error(`Validation Failed`);
        return {
          valid: false,
        };
      } else {
        winston.debug(`validation: ` + JSON.stringify(validation));
        // create basic response
        let responseBody = {
          nonce: payload.nonce,
          captcha: captcha.data,
          validation: validation,
        };
        // ****uncomment to output memory usage info ****/
        // const { rss, heapTotal, external } = process.memoryUsage();
        // winston.debug(
        //   "******** rss " +
        //     numeral(rss).format(`0.0 ib`) +
        //     ` heapTotal ` +
        //     numeral(heapTotal).format(`0.0 ib`) +
        //     ` external ` +
        //     numeral(external).format(`0.0 ib`)
        // );
        // ****uncomment to output memory usage info ****/
        return responseBody;
      }
    })
    .catch ((err) => {
      winston.error(err);
      return {
        valid: false,
      };
    });
};
exports.getCaptcha = getCaptcha;

app.post("/captcha", async function (req: Request, res: Response) {
  getCaptcha(req.body).then((captcha) => {
    winston.debug(`returning: ` + JSON.stringify(captcha));
    res.send(captcha);
  });
});

////////////////////////////////////////////////////////
/*
 * Verify a captcha against it's encrypted response.
 * If successful, return a signed jwt by us.
 */
////////////////////////////////////////////////////////
interface VerifyCaptchaRequest {
  answer: string;
  nonce: string;
  validation: object;
}

export interface VerifyCaptchaValidResponse {
  valid: boolean;
  jwt: string;
}

export interface VerifyCaptchaInvalidResponse {
  valid: boolean;
}

let verifyCaptcha = async function (
  payload: VerifyCaptchaRequest
): Promise<VerifyCaptchaInvalidResponse | VerifyCaptchaValidResponse> {
  winston.debug(`incoming payload: ` + JSON.stringify(payload));
  let validation = payload.validation;
  let answer = payload.answer;
  let nonce = payload.nonce;

  // Captcha by-pass for automated testing in dev/test environments
  if (
    process.env.BYPASS_ANSWER &&
    process.env.BYPASS_ANSWER.length > 0 &&
    process.env.BYPASS_ANSWER === answer
  ) {
    // Passed the captcha test
    winston.debug(`Captcha bypassed! Creating JWT.`);

    let token = jwt.sign(
      {
        data: {
          nonce: nonce,
        },
      },
      SECRET,
      {
        expiresIn: JWT_SIGN_EXPIRY + "m",
      }
    );
    return {
      valid: true,
      jwt: token,
    };
  }

  // Normal mode, decrypt token
  return decrypt(validation, PRIVATE_KEY).then((body) => {
    winston.debug(`verifyCaptcha decrypted: ` + JSON.stringify(body));
    if (body !== null) {
      // Check answer
      if (body.answer.toLowerCase() === answer.toLowerCase()) {
        if (body.nonce === nonce) {
          // Check expiry
          if (body.expiry > Date.now()) {
            // Passed the captcha test
            winston.debug(`Captcha verified! Creating JWT.`);

            let token = jwt.sign(
              {
                data: {
                  nonce: nonce,
                },
              },
              SECRET,
              {
                expiresIn: JWT_SIGN_EXPIRY + "m",
              }
            );
            return {
              valid: true,
              jwt: token,
            };
          } else {
            // incorrect answer
            winston.debug(
              `Captcha expired: ` + body.expiry + "; now: " + Date.now()
            );
            return {
              valid: false,
            };
          }
        } else {
          // incorrect nonce
          winston.debug(
            `nonce incorrect, expected: ` + body.nonce + "; provided: " + nonce
          );
          return {
            valid: false,
          };
        }
      } else {
        // incorrect answer
        winston.debug(
          `Captcha answer incorrect, expected: ` +
            body.answer +
            "; provided: " +
            answer
        );
        return {
          valid: false,
        };
      }
    } else {
      // Bad decryption
      winston.error(`Captcha decryption failed`);
      return {
        valid: false,
      };
    }
  });
};
exports.verifyCaptcha = verifyCaptcha;

app.post("/verify/captcha", async function (req: Request, res: Response) {
  verifyCaptcha(req.body).then((ret) => {
    res.send(ret);
  });
});

////////////////////////////////////////////////////////
/*
 * Get Audio
 */
////////////////////////////////////////////////////////
interface GetAudioRequestBody {
  validation: object;
  translation?: string | boolean;
}

const voicePromptLanguageMap: { [index: string]: string } = {
  en: "Please type in following letters or numbers", // english
  fr: "Veuillez saisir les lettres ou les chiffres suivants", // french
  pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੇਠ ਲਿਖੇ ਅੱਖਰ ਜਾਂ ਨੰਬਰ ਟਾਈਪ ਕਰੋ", // punjabi
  zh: "请输入以下英文字母或数字", // mandarin chinese
};

let getAudio = async function (body: GetAudioRequestBody, req?: Request) {
  winston.debug(`getting audio for`, body);
  // Ensure audio is enabled.
  if (!AUDIO_ENABLED || AUDIO_ENABLED !== "true") {
    winston.error("audio disabled but user attempted to getAudio");
    return {
      error: "audio disabled",
    };
  }

  // pull out encrypted answer
  let validation = body.validation;

  // decrypt payload to get captcha text
  return decrypt(validation, PRIVATE_KEY)
    .then((decryptedBody) => {
      winston.debug("get audio decrypted body", body);

      // Insert leading text and commas to slow down reader
      let captchaCharArray = decryptedBody.answer.toString().split("");
      let language = "en";
      if (body.translation) {
        if (typeof body.translation == "string") {
          if (voicePromptLanguageMap.hasOwnProperty(<string>body.translation)) {
            language = <string>body.translation;
          }
        } else if (
          body.translation === true &&
          req &&
          req.headers["accept-language"]
        ) {
          let lang = (<string>req.headers["accept-language"])
            .split(",")
            .map((e) => e.split(";")[0].split("-")[0])
            .find((e) => voicePromptLanguageMap.hasOwnProperty(e));
          if (lang) {
            language = lang;
          }
        }
      }
      let spokenCatpcha = voicePromptLanguageMap[language] + ": ";
      for (let i = 0; i < captchaCharArray.length; i++) {
        spokenCatpcha += captchaCharArray[i] + ", ";
      }
      return getMp3DataUriFromText(spokenCatpcha, language)
        .then((audioDataUri) => {
          return {
            audio: audioDataUri,
          };
        })
        .catch((e) => {
          winston.error("Error getting audio(getMp3DataUriFromText):" + JSON.stringify(e));
          throw e;
        });
    })
    .catch((e) => {
      winston.error("Error getting audio(decrypt):" + JSON.stringify(e));

      return {
        error: "unknown",
      };
    });
};
exports.getAudio = getAudio;

app.post("/captcha/audio", async function (req: Request, res: Response) {
    getAudio(req.body, req)
      .then((ret) => {
        winston.debug("Audio sent successfully")
        res.send(ret);
      })
      .catch((e) => {
        winston.error("Error getting audio(app.post):" + JSON.stringify(e));
      });
});

////////////////////////////////////////////////////////
/*
 * Verify a JWT generated by us.
 */
////////////////////////////////////////////////////////
export interface VerifyJWTResponse {
  valid: boolean;
}
let verifyJWT = async function (
  token: string,
  nonce: string
): Promise<VerifyJWTResponse> {
  winston.debug(`verifying: ${token} against ${nonce}`);
  try {
    let decoded = jwt.verify(token, SECRET);
    winston.debug(`decoded: ` + JSON.stringify(decoded));
    if (decoded.data && decoded.data.nonce === nonce) {
      winston.debug(`Captcha Valid`);
      return {
        valid: true,
      };
    } else {
      winston.debug(`Captcha Invalid!`);
      return {
        valid: false,
      };
    }
  } catch (e) {
    winston.error(`Token/ResourceID Verification Failed: ` + JSON.stringify(e));
    return {
      valid: false,
    };
  }
};
exports.verifyJWT = verifyJWT;

app.post("/verify/jwt", async function (req: Request, res: Response) {
  let ipRangeArr = AUTHORIZED_RESOURCE_SERVER_IP_RANGE_LIST.split(",");
  let allowed = false;
  for (let ipRange of ipRangeArr) {
    if (ipRangeCheck(req.ip, ipRange.trim())) {
      allowed = true;
      break;
    }
  }
  if (!allowed) {
    winston.debug(`Unauthorized access to /verify/jwt from ip ${req.ip}.`);
    res.status(403).end();
    return;
  }
  verifyJWT(req.body.token, req.body.nonce).then((ret) => {
    res.send(ret);
  });
});

////////////////////////////////////////////////////////
/*
 * Audio routines
 */
////////////////////////////////////////////////////////
function getMp3DataUriFromText(text: string, language: string = "en") {
  winston.debug("Starting audio generation...");
  return new Promise(async function (resolve, reject) {
    // init wave reader, used to convert WAV to PCM
    let reader = new wav.Reader();

    // we have to wait for the "format" event before we can start encoding
    reader.on("format", function (format: object) {
      // init encoder
      winston.debug("Init mp3 encoder");
      let encoder = new lame.Encoder(format);

      // Pipe Wav reader to the encoder and capture the output stream
      winston.debug("Pipe WAV reader to MP3 encoder");

      // As the stream is encoded, convert the mp3 array buffer chunks into base64 string with mime type
      let dataUri: string | undefined = "data:audio/mp3;base64,";
      encoder.on("data", function (arrayBuffer: Buffer) {
        if (!dataUri) {
          return;
        }
        winston.debug(
          "Encoder output received chunk of bytes, convert to base64 string"
        );
        dataUri += arrayBuffer.toString("base64");
        // by observation encoder hung before finish due to event loop being empty
        // setTimeout injects an event to mitigate the issue
        setTimeout(() => {}, 0);
      });

      // When encoding is complete, callback with data uri
      encoder.on("finish", function () {
        winston.debug("Finished converting to MP3");
        resolve(dataUri);
        dataUri = undefined;
      });
      reader.pipe(encoder);
    });

    

      // Generate audio, Base64 encoded WAV in DataUri format including mime type header
      winston.debug("Generate speech as WAV in ArrayBuffer");
      
      //t2w function created as a workaround to eliminate await statement
      //without this workaround typescript fails due to incorrect return type
      //from text2wav package
      let t2w = async (txt : string, lang : string) : Promise<Uint8Array> => {
	      winston.debug("Audio Requested: Converting Text");
        return text2wav(txt, { voice: lang })
      }

      t2w(text, language)
        .then((audioArrayBuffer) =>{

          // convert to buffer
          winston.debug("Convert arraybuffer to buffer");
          let audioBuffer = arrayBufferToBuffer(audioArrayBuffer);      

          // Convert ArrayBuffer to Streamable type for input to the encoder
          winston.debug("Streamify our buffer");
          let audioStream = streamifier.createReadStream(audioBuffer);

          // once all events setup we can the pipeline
          winston.debug("Pipe audio stream to WAV reader");
          audioStream.pipe(reader);
        })
        .catch((e)=>{
          winston.error("Error getting audio(text2wav):" + JSON.stringify(e));
        })
  });
}

// health and readiness check
app.get(/^\/(hello)?$/, function (req: Request, res: Response) {
  res.status(200).end();
});

app.get(/^\/(status)?$/, function (req: Request, res: Response) {
  res.send("OK");
});
