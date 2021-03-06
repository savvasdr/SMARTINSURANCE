let sandbox = require("./bill-sandbox.json");
const uuidv4 = require('uuid/v4');

var request = require("request");

let ids = [
    "37752202351003166010",
    "68671644254254080000",
    "74564751478256340000",
    "42656347522716600000",
    "55451471862352200000",
    "30655285811706200000",
    "43236881816180500000",
    "84887551807072600000",
    "50642631548016300000",
    "31321304642358500000"
];

let transaction_template = {
    "id": "9cb93365-b498-403d-ae2e-dfe788e25b71",
    "txId": "a76b579d-ed50-4d2b-a053-628247140593",
    "instrId": "38450793-1d68-4a60-bed1-313538a1bb01",
    "endToEndId": "90773001121420176229",
    "paymentCode": "69d6ffc8-cc65-4130-a172-d2fa16b6cbe8",
    "ccy": "EUR",
    "amount": 17,
    "method": "ACCT",
    "creditorBankBIC": "ETHNGRAA",
    "creditorBankName": "ΕΘΝΙΚΗ",
    "creditorBankIBAN": "GR41498760953239760",
    "debtorName": "ΠΑΠΑΔΟΠΟΥΛΟΣ ΓΙΩΡΓΟΣ",
    "debtorTelephone": "2101234567",
    "paymentType": "NBG",
    "debitAccount": "GR7816570557954408",
    "branch": "001",
    "userId": "acd77e31-a637-48b6-a070-ffc5d1d68e63",
    "sendCutOffTime": "2019-02-09T18:00:00.000Z",
    "commNBG": 0.2,
    "commUltimateDebtor": 0.1,
    "commThirdParty": 0.4,
    "commOther": 0,
    "clearSysRef": "66666666666666666666",
    "status": "PENDING",
    "failureReason": null,
    "timestamp": "2019-02-09T13:56:28.032Z",
    "subBranch": "01",
    "impersonator": null,
    "commSubAgent": 0.03,
    "spotMachineTransactionDetails": [
        {
            "fieldKey": "PAYMENT_CODE",
            "fieldValue": "90773"
        }
    ]
}

function rand(min,max){
    return Math.floor(Math.random() * (max-min)) + min  
}
function rand20(){
    let str = "";
    for (let i=0;i<20;i++){
        str += rand(0,9);
    }
    return str;
}

function generateSandbox(){
    
    sandbox.networks[0].spots[0].spotMachines[0].spotMachineTransactions = [];

    for (let i=0;i<10;i++){
        let tmp = Object.assign({},transaction_template);
        tmp.id = uuidv4();
        tmp.txId = uuidv4();
        tmp.instrId = uuidv4();
        tmp.clearSysRef = ids[i];
        tmp.endToEndId = rand20();
        tmp.amount = rand(10,100);
        sandbox.networks[0].spots[0].spotMachines[0].spotMachineTransactions.push(tmp);
    }
    console.log(JSON.stringify(sandbox))
    return sandbox; 

}

function push(sandbox,callback){

    var options = {
        url: "https://apis.nbg.gr/public/sandbox/billpayments/v2/sandbox/hackathon_insurance_sb",
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-ibm-client-id": "449fbd72-6ff2-4406-9663-668346c3b7ab",
            "Authorization" : "Bearer fba4700dcba22a8342858c4f0b81fb38981e27a789f9f4937f818b44f0281606"
        },
        body : JSON.stringify(sandbox)
    };

    console.log("pushing");

    request(options, function (error, response, body) {
        if (error) {
            callback(error);
            return;
        }
        console.log("success");
        callback(body);
    })

}

function setStatus(id,status,callback){

    var options = {
        url: "https://apis.nbg.gr/public/sandbox/billpayments/v2/sandbox/hackathon_insurance_sb/transactions",
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-ibm-client-id": "449fbd72-6ff2-4406-9663-668346c3b7ab",
            "Authorization" : "Bearer fba4700dcba22a8342858c4f0b81fb38981e27a789f9f4937f818b44f0281606"
        },
        body : JSON.stringify({
            "paymentIdentification": {
                "clrSysRef": id
            },
            "status": status
        })
    };

    console.log("pushing for payment");

    request(options, function (error, response, body) {
        if (error) {
            callback(error);
            return;
        }
        console.log("success");
        callback(body);
    })

}



function getSandbox(sandbox,callback){

    var options = {
        url: "https://apis.nbg.gr/public/sandbox/billpayments/v2/sandbox/hackathon_insurance_sb",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-ibm-client-id": "449fbd72-6ff2-4406-9663-668346c3b7ab",
            "Authorization" : "Bearer fba4700dcba22a8342858c4f0b81fb38981e27a789f9f4937f818b44f0281606"
        },
        body : JSON.stringify(sandbox)
    };

    console.log("pushing");

    request(options, function (error, response, body) {
        if (error) {
            callback(error);
            return;
        }
        console.log("success");
        callback(body);
    })

}


function getStatus(id,callback){
    
    var options = {
        url: "https://apis.nbg.gr/public/sandbox/billpayments/v2/Payments/status",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-ibm-client-id": "449fbd72-6ff2-4406-9663-668346c3b7ab",
            "Authorization" : "Bearer fba4700dcba22a8342858c4f0b81fb38981e27a789f9f4937f818b44f0281606",
            "sandbox_id" : "hackathon_insurance_sb",
            "application_id" : "5c5eb1e4e4b08673622af6bc",
            "user_id" : "37730fbd-96f9-4d0e-8198-dbe6788c6987",
            "username" : "smart_insurance",
            "provider_id" : "NBG.gr",
            "provider" : "NBG"
        },
        body : JSON.stringify({
            "header": {
              "ID": uuidv4(),
              "application": "449fbd72-6ff2-4406-9663-668346c3b7ab",
              "channel": "tpp"
            },
            "payload": {
              "userId": "37730fbd-96f9-4d0e-8198-dbe6788c6987",
              "PaymentIdentification": {
                  "clrSysRef": id
              }
            }
          })
    };

    console.log("pushing");

    request(options, function (error, response, body) {
        if (error) {
            callback(error);
            return;
        }
        console.log("success");
        callback(body);
    })
}

function pay(id,cb){
    setStatus(id,"COMPLETED",cb)
}
function cancel(id,cb){
    setStatus(id,"PENDING",cb)
}



module.exports = {
    generate : generateSandbox,
    push : push,
    getPaymentStatus : getStatus,
    pay : pay,
    cancel : cancel,
    getSandbox : getSandbox
}

