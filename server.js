
const express = require('express');
const app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const PORT = process.env.PORT || 7000;
// options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);
//let serviceBuilder = new chrome.ServiceBuilder(process.env.CHROME_DRIVER_PATH);

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
// options.addArguments("--headless");
// options.addArguments("--disable-gpu");
//options.addArguments("--ignore-certificate-errors");
//options.addArguments("--no-sandbox");
const serviceAccountAuth = new JWT({
    // env var values here are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    email: 'scoop-coupon-api@scoopcoupon.iam.gserviceaccount.com',
    key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCcbNsuzE3lYY73\nQVwc/L/nea0++K6qDhbuRbahBlVXI9ooPEGCA5Rnt8q0lFbmsCI4H+awpVo5eQcA\nH3Pb/rDU5C/VmwM1Y30Ycx8FBSewmMfYPBspcuOe9eYV528lVS3xEBKy3Tu+8vnf\n01nktEUxaharEFMu+mdGU2AK1ILr8/lxNKtGOSVJiUEMBM3DqxNLJM8K8/6khQoV\nokndfJL+8nZi4N2N68IgmJgmyQpGkt5fjv4GrfB/PnWmcTZSsVrcrF64PXX6nos3\neKJOqSaqEdF2H37+iq9+flRuT/5AtZk5ephjziZGSKcOO1Bx34Gg3WjyNtQEB6WL\nUf69gbKXAgMBAAECggEAEfOIH9HAar+MaaGtkYIL/+N910kwukFNrmB/ufEBIDP0\nGEP5/JKumEyGTbzsUCMMekZm8gS32vqhrAjwAeIzpurc9nWIo7rcI08q0yepS2Ht\nJUqYj2Qo7RgpJIBfx/gDgrOmgbJT5fD6bg5SNaXefvI+0bjY4v5HldGBpxyGPc+e\n2nE5o906ouyY3F8lVIuAYrBLnV+TZEYebmSlULY+cdRcPe9LBepo78tpRpVuo4H/\no+Eom5ID79glMwTGCDfVvJV4EU1j0w0l8Z7N0U5LW+946AQf8uTtwuImsnmpBgX+\nGJz8LEfjNrFJyudumVeTkyARmV/Ims/0XYGAEeyJcQKBgQDWLLgMz8ANocuahIUx\nvwRhL7CMOVJ+Y2tFD6LP3H0MpDUnyNzM9ebrwNRBOFKfLlsg58EE3s2i9euYFpfK\n34eQ7px0PQhahsrv90d6DergWTknT4Fv8GLO6PSUJDes+NmCKiH/eJPc7u96QlpM\nI2MLlkNVwbu1CrFiEcjTYGqxXwKBgQC6+Q5Mh7wYoxqML1b6aohexpL8rYKRhEY7\nuwspWwsxzS6VSd9FaeqqzGeMrX5xmRBjGeaIOhC4ws+lu+U6rHQp1bfNqKqrlqX+\n40+ShBERCdlIYIPZyP6iiglFmFYUXQfkmE/1fkUYABd/xkoBy6NV2gH36OuD6RTw\nRSfnNH7xyQKBgGcMuz3G1AR7HcjqDGBEJWpRlOPTTOLtGRbwkAjtcOmdNMpAtiSU\nCJjUfgwnenGGz2gEunWKcmz/YG0cKcr+RG8yr+qp1xQfmRNe6nBKtAFgTMSiV4gx\npIkjw1JoHrXGQnmDpjoSnSqHeIhd1q6dtDFGCn3/qj5Qt8qU/gjecleHAoGAX7xp\nAuy5dlAFpuQSgDSOUSESYEkjwwjcwXbblzhj+gMaqBxkM3GxU/VHzDOFu/ro9iVr\n8jLxHvm5Qx57mFh3PniNHcQQZ73Cj0mrE9WFu5i0ZiftO1V8dJODfdwrr0+XXAhV\nYNlf3ZMmdSl9+X9gyfPP8DWWajutmf1/Gha6LWkCgYAatMUX9gtXxxq8LqJV41QU\n5K3JBPsat0CcW4ycX1ZppTsppTyIKkcNw6Q7WT5GMxB8OdNNKaPMZX3m6vMoSYCd\nx8kybcA+kayCNqZgSXxfHXnuCSYFZZkDfrw8ERg9BGpubkyLslz/r+BjQR1QSfTv\nYyc7WzIbzTIl+tdVw/7OdQ==\n-----END PRIVATE KEY-----\n",
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});


app.post('/submit', async (req, response) => {
    const doc = new GoogleSpreadsheet(req.body.sheetID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    var rows = await sheet.getRows();
    var i = req.body.i;
    var text = req.body.text;
    var old_keywords = rows[i].get('keywords')
    var keywords = old_keywords + "\n" + text;
    rows[i].assign({ keywords: keywords });
    await rows[i].save();
    return response.status(200).json({
        "success": true
    });
});


app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});