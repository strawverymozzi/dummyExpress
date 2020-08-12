var fs = require('fs');

class Service {

    static language = {
        "ko-KR": "한국어",
        "en-US": "영어",
        // "zn-CN": "중국어",
        // "ja-JP": "일본어",
        // "vi-VN": "베트남어",
        // "id-ID": "인니어"
    };
    static lang = 'ko-KR';

    static fiddleDataSource(filePath, taskfunction) {
        let rs;
        return new Promise((res, rej) => {
            const data = fs.readFileSync(filePath, 'utf8', function readFileCallback(err, data) {});
            const jsonDB = JSON.parse(data); //now it an object
            rs = taskfunction(jsonDB); //add some data
            fs.writeFileSync(filePath, JSON.stringify(jsonDB, null, "\t"), 'utf8', function () {}); // write it back 
            res(rs);
        })
    }

    static setLangKey(key) {
        this.lang = this.language[key] ? key : 'ko-KR';
    }

    static getAllRCV(target) {
        const task = (jsonDB) => {
            return {
                "success": true,
                "code": 0,
                "msg": "성공하였습니다.",
                "list": jsonDB[target]
            };
        }
        return this.fiddleDataSource(`./${this.lang}/$rcvDB.json`, task);
    }

    static changeRCV(data, target) {

        const task = (jsonDB) => {
            const insert = () => {
                // data["uid"] = data["uid"] ? data["uid"] : this.getNewUID();
                data["uid"] = this.getNewUID();
                jsonDB[target].push(data);
                return {
                    "success": true,
                    "code": 0,
                    "msg": target == "listRcv" ? "마스터 INSERT 성공하였습니다." : "디테일 INSERT 성공하였습니다.",
                    "list": [data]
                };
            }
            const update = () => {
                const list = jsonDB[target];
                for (let idx in list) {
                    if (list[idx]["uid"] == data["uid"]) {
                        for (let key of Object.keys(data)) {
                            list[idx][key] = data[key]
                        }
                        return {
                            "success": true,
                            "code": 0,
                            "msg": target == "listRcv" ? "마스터 UPDATE 성공하였습니다." : "디테일 UPDATE 성공하였습니다.",
                            "list": [data]
                        };
                    }
                }

            }

            return this.hasID(jsonDB[target], data["uid"]) ? update() : insert();
        }

        return this.fiddleDataSource(`./${this.lang}/$rcvDB.json`, task);
    }

    static changeRCVDetail(detailList) {

        const promiseChain = [];
        for (let detail of detailList) {
            promiseChain.push(this.changeRCV(detail, 'listRcvDetail'));
        }

        return Promise.all(promiseChain)
            .then((results) => {
                return results;
            })
            .catch((e) => {});

    }

    static deleteRCV(body, target) {
        const task = (jsonDB) => {
            const list = jsonDB[target];
            let cnt = 0;
            for (let key of body) {
                for (let idx in list) {
                    if (list[idx]["uid"] == key) {
                        jsonDB[target].splice(idx, 1);
                        cnt++;
                    }
                }
            }
            return {
                "success": true,
                "code": 0,
                "msg": `DELETE ${cnt}건 성공하였습니다.`,
                "list": [0]
            };
        }

        return this.fiddleDataSource(`./${this.lang}/$rcvDB.json`, task);
    }

    static changeAll(data) {
        const master = data["rcvMasterDto"];
        const detailList = data["rcvDetailDtoList"] //array

        const promiseChain = [this.changeRCV(master, 'listRcv')];
        for (let detail of detailList) {
            promiseChain.push(this.changeRCV(detail, 'listRcvDetail'));
        }

        return Promise.all(promiseChain)
            .then((results) => {
                return results;
            })
            .catch((e) => {});
    }

    static getNewUID() {
        const date = new Date();
        return (`${date.toUTCString()}${date.getMilliseconds()}`).replace(/[A-Za-z\s,:]/g, '');
    }

    static hasID(list, uid) {
        if (uid) {
            for (let obj of list) {
                if (obj.uid == uid) {
                    return true;
                }
            }
        }
        return false;
    }

    static getMenu() {
        return {
            "success": true,
            "code": 0,
            "msg": "성공하였습니다.",
            "transationTime": "2020-07-25T19:33:14.6371888",
            "list": [{
                    "uid": 10000,
                    "tenant": "1000",
                    "title": "MENU1",
                    "icon": "home-outline",
                    "menuPath": "10000",
                    "appUid": null,
                    "url": null,
                    "link": null,
                    "windowName": null,
                    "children": [{
                        "uid": 10002,
                        "tenant": "1000",
                        "title": "MENU3",
                        "icon": "home-outline",
                        "menuPath": "10000|10002",
                        "appUid": 90003,
                        // "url": "http://www.jflab.co.kr:18001/api/v1/rec/receive",
                        //"url": "https://aqueous-sierra-56466.herokuapp.com/api/v1/rec/receive",
						"url": "http://localhost:3001/api/v1/rec/receive",
                        "link": "/adminPages/CM/application3",
                        "windowName": "rcv",
                        "children": [],
                        "insFlg": "I3bf0faZOdYKsS5EhYGUStkWhWiBV8gBC5p1FG8xz5U=",
                        "updFlg": "LkhF1x2Eva7i9SYNof0fetkWhWiBV8gBC5p1FG8xz5U=",
                        "delFlg": ""
                    }],
                    "insFlg": null,
                    "updFlg": null,
                    "delFlg": null
                },
                {
                    "uid": 10001,
                    "tenant": "1000",
                    "title": "MENU2",
                    "icon": "home-outline",
                    "menuPath": "10001",
                    "appUid": 90001,
                    "url": "/CM/APP",
                    "link": "/CM/APP",
                    "windowName": null,
                    "children": [],
                    "insFlg": "02W4Lc/aYBMcIVioXkTauRnoFbEk1cqa4/mCe/vGkl8=",
                    "updFlg": "hmxY0gurkbZKWgPc6/F2T2S6MlbNlnG3Vit+rhh3swk=",
                    "delFlg": "POa4BMjxP1K9uqzyh5Sfbw40bL2g90IdSu66IniFxK4="
                }
            ],
        }
    }

    static getRCVInit() {
        return {
            "success": true,
            "code": 0,
            "msg": "성공하였습니다.",
            "transationTime": "2020-07-25T19:52:09.6114747",
            "data": {
                "dictionary": {},
                "RCVSTATUS": {
                    200: "입고예정",
                    300: "입고접수",
                    400: "적치완료",
                    600: "입고확정",
                    900: "입고승인"
                },
                "RCVTYPE": {
                    200: "입고예정",
                    300: "입고접수",
                    400: "적치완료",
                    600: "입고확정",
                    900: "입고승인"
                }
            }
        }
    }

    static getToken() {
        return {
            "token": {
                "expires_in": 1595672636282,
                "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMDAwMCIsInRlbmFudCI6IjEwMDAiLCJ1c2VySWQiOiJURVNUX1VTRVIiLCJmdWxsTmFtZSI6Iu2FjOyKpO2KuOycoOyggCIsInBhZ2VSb2xlIjp7InVwZEZsZyI6IiIsImluZkZsZyI6IiIsImRlbEZsZyI6IiJ9LCJwcm9ncmFtaWQiOiIiLCJpYXQiOjE1OTU2NjkwMzYsImV4cCI6MTU5NTY3MjYzNn0.2i4AM02cRrSSw9haLIAeqor_KbAuRzCUYncyp-vPJOI",
                "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMDAwMCIsInRlbmFudCI6IjEwMDAiLCJ1c2VySWQiOiJURVNUX1VTRVIiLCJmdWxsTmFtZSI6Iu2FjOyKpO2KuOycoOyggCIsInBhZ2VSb2xlIjp7InVwZEZsZyI6IiIsImluZkZsZyI6IiIsImRlbEZsZyI6IiJ9LCJwcm9ncmFtaWQiOiIiLCJpYXQiOjE1OTU2NjkwMzYsImV4cCI6MTU5ODI2MTAzNn0.FkVc0I3U4G_Ecz2BoHMPUT0KXwzoSviynWhYt7AR47M"
            }
        }

    }

    static getSearchHelp(key) {
        const task = (jsonDB) => {
            return jsonDB[key] || {}
        }
        return this.fiddleDataSource(`./${this.lang}/$searchHelpDB.json`, task);
    }

    static getPageInit(pageID) {
        const task = (jsonDB) => {
            return jsonDB[pageID]
        }
        return this.fiddleDataSource(`./${this.lang}/$commonDB.json`, task);
    }
}

module.exports = Service;