const fs = require('fs');
const path = require('path');

const filePathCustomer = path.join(__dirname, '../test-data/customer.json');
const filePathUser = path.join(__dirname, '../test-data');

exports.saveCustomerData = (customerData) => {
    fs.writeFileSync(filePathCustomer, JSON.stringify({ customerData }));
};

exports.getCustomerData = () => {
    const data = JSON.parse(fs.readFileSync(filePathCustomer));
    return data.customerData;
};

exports.saveUserData = (userData) => {
    fs.writeFileSync(filePathUser + "/" + userData.user_type + '.json', JSON.stringify({ userData }));
};

exports.getUserData = () => {
    const data = JSON.parse(fs.readFileSync());
    return data.userData;
};
