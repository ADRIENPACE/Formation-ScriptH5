 /**
 * H5 Script SDK sample.
 */

/**
 * Executes requests to IFS and M3 ION APIs.
 * For MUA 10.4 only.
 * 
 * No setup needed if script will be uploaded thru Admin Tools
 * During development, to run this script in any instance where an authorization server is not available,
 * you will need to set the OAuth token manually:
 *  - Acquire an OAuth token string.
 *      + Log on to Ming.le/Portal.
 *      + Open a new tab in the same browser and navigate to the Grid SAML Session Provider OAuth resource.
 *      + The Grid must be version 2.0 or later with a SAML Session Provider configured for the same IFS as Ming.le.
            Example: https://yourservernameandport/grid/rest/security/sessions/oauth
 *  - Copy the token to the script arguments.
 *  - When the token times out, you must acquire a new token and update the script arguments.
 *  - Update - 10/14/2024 - Mingle endpoints have been depricated for user ion detail apis - updated to use IFS with the same functionalities
 */
class H5SampleIonApiService {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: any;

    private readonly mingleEndpoint = "Mingle";
    private readonly ifsEndpoint= "ifsservice";
    private readonly m3Endpoint = "M3/m3api-rest/execute";
    private readonly m3EndpointV2 = "M3/m3api-rest/v2/execute";

    private ionApiService;
    private miService;
    private version;

    constructor(args: IScriptArgs) {
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
        this.version = ScriptUtil.version;

        if (this.version >= 2.0) {
            this.ionApiService = IonApiService;
            this.miService = MIService;
        } else {
            this.ionApiService = IonApiService.Current;
            this.miService = MIService.Current;
        }
    }

    /**
    * Script initialization function.
    */
    public static Init(args: IScriptArgs): void {
        new H5SampleIonApiService(args).run();
    }

    private run(): void {
        this.addMingleButton();
        this.addPostMingleButton();
        this.addPutMingleButton();
        this.addDeleteMingleButton();
        this.addM3Button();

        /* For development purposes only
        Make sure to add a valid access token as the script argument.
        See comments above or the development guide for details.
        */
        // this.ionApiService.setToken(this.args);
    }

    private addMingleButton(): void {
        const run = new ButtonElement();
        run.Name = "runguid";
        run.Value = "Get user GUID";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 8;
        run.Position.Width = 5;

        if (this.version >= 2.0) {
            run.Position.Left = 9;
        }

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click(() => {
            const request: IonApiRequest = {
                url: `${this.ionApiService.getBaseUrl()}/${this.ifsEndpoint}/usermgt/v2/users/me`,
                method: "GET"
            }

            this.ionApiService.execute(request).then((response: IonApiResponse) => {
                const data = response.data

                if(!data.ErrorList) {
                    this.controller.ShowMessage(data.response.userlist[0].id);
                }
                else {
                    for(const error of data.ErrorList) {
                        this.log.Error(error.Message);
                    }
                }
            }).catch((response: IonApiResponse) => {
                this.log.Error(response.message);
            });
        });
    }

    private addPostMingleButton(): void {
        const run = new ButtonElement();
        run.Name = "emailVerify";
        run.Value = "Post Email Verify";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 17;
        run.Position.Width = 5;

        if (this.version >= 2.0) {
            run.Position.Left = 18;
        }

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click(() => {
            const message = "Hello, check email only if received. No need to click anything from email verification, if email received, working post."
            const request: IonApiRequest = {
                url: `${this.ionApiService.getBaseUrl()}/${this.ifsEndpoint}/usermgt/v2/users/me/verify/email`,
                method: "POST",
                responseType: "json",
                data: { MessageText: message },
            }

            this.ionApiService.execute(request).then((response: IonApiResponse) => {
                console.log("myscript: success callback");
                console.log(response);
                const errorList = response.data.ErrorList;
                errorList.forEach(error => {
                    console.log("ERROR");
                    console.log(error.Message);
                });
            }).catch((response: IonApiResponse) => {
                this.log.Error(response.message);
            });
        });
    }

    private addPutMingleButton(): void {
        const run = new ButtonElement();
        run.Name = "runguid";
        run.Value = "Put user GUID";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 26;
        run.Position.Width = 5;
        if (this.version >= 2.0) {
            run.Position.Left = 27;
        }

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click(() => {
            const request: IonApiRequest = {
                url: `${this.ionApiService.getBaseUrl()}/${this.ifsEndpoint}/usermgt/v2/users/me`,
                method: "PUT"
            }

            this.ionApiService.execute(request).then((response: IonApiResponse) => {
                const data = response.data

                if(!data.ErrorList) {
                    this.controller.ShowMessage(data["UserDetailList"][0].UserGUID);
                }
                else {
                    for(const error of data.ErrorList) {
                        this.log.Error(error.Message);
                    }
                }
            }).catch((response: IonApiResponse) => {
                this.log.Error(response.message);
            });
        });
    }

    private addDeleteMingleButton(): void {
        const run = new ButtonElement();
        run.Name = "runguid";
        run.Value = "Delete user GUID";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 35;
        run.Position.Width = 5;
        if (this.version >= 2.0) {
            run.Position.Left = 36;
        }

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click(() => {
            const request: IonApiRequest = {
                url: `${this.ionApiService.getBaseUrl()}/${this.ifsEndpoint}/usermgt/v2/users/me`,
                method: "DELETE"
            }

            this.ionApiService.execute(request).then((response: IonApiResponse) => {
                const data = response.data

                if(!data.ErrorList) {
                    this.controller.ShowMessage(data["UserDetailList"][0].UserGUID);
                }
                else {
                    for(const error of data.ErrorList) {
                        this.log.Error(error.Message);
                    }
                }
            }).catch((response: IonApiResponse) => {
                this.log.Error(response.message);
            });
        });
    }

    private addM3Button() {
        const run = new ButtonElement();
        run.Name = "runemail";
        run.Value = "Get M3 user email";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 45;
        run.Position.Width = 5;

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click(() => {
            const request: IonApiRequest = {
                url: `/${this.m3Endpoint}/MNS150MI/GetUserData/`,
                method: "GET",
                record: {
                    USID: ScriptUtil.GetUserContext("USID")
                }
            }

            this.ionApiService.execute(request).then((response: IonApiResponse) => {
                const responseData = response.data.MIRecord[0];
                const firstRecord = responseData.NameValue.find(nv => nv.Name === "EMAL");

                if(firstRecord?.Value) {
                    this.controller.ShowMessage(firstRecord.Value);
                }
            }).catch((response: IonApiResponse) => {
                this.log.Error(response.message);
            });
        });
    }
}
