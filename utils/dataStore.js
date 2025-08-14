const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../test-data/customer.json');

exports.saveCustomerData = (customerData) => {
    fs.writeFileSync(filePath, JSON.stringify({ customerData }));
};

exports.getCustomerData = () => {
    const data = JSON.parse(fs.readFileSync(filePath));
    return data.customerData;
};
