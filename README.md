<!--
# license: Copyright © 2011-2016 MOLPay Sdn Bhd. All Rights Reserved. 
-->

# molpay-mobile-xdk-titanium

This is the complete and functional MOLPay Titanium payment module that is ready to be implemented into Titanium project through simple copy and paste procedures. An example application project (MOLPayXDKExample) is provided for MOLPayXDK Titanium integration reference.

This plugin provides an integrated MOLPay payment module that contains a wrapper 'MOLPayXDK.js' and an upgradable core as the 'molpay-mobile-xdk-www' folder, which the latter can be separately downloaded at https://github.com/MOLPay/molpay-mobile-xdk-www and update the local version.

## Recommended configurations

    - Titanium SDK Version: 5.2.2.GA ++
    
    - Node.js Version: 5.3.0 ++
    
    - Minimum Android target version: Android 4.1
    
    - Minimum iOS target version: 7.0

## MOLPay Android Caveats

    Credit card payment channel is not available in Android 4.1, 4.2, and 4.3. due to lack of latest security (TLS 1.2) support on these Android platforms natively.

## Installation

    Step 1 - Import MOLPay modules
    Drag and drop MOLPayXDK.js and molpay-mobile-xdk-www folder into the Resources folder in the application project folder (same level as the app.js) to perform all imports. Please copy both file and folder into the project.
    
    Step 2 - Create a host container Titanium Window object
    var hostWin = Ti.UI.createWindow();
    
    Step 3 - Instantiate MOLPay object
    var molpay = require('MOLPayXDK');
    
    Step 4 - Create a view container Titanium View object for MOLPay payment UI
    var molpayView = Titanium.UI.createView();
    
    Step 5 - Add MOLPay view into the Host Window container
    hostWin.add(molpayView);

## Payment module callback

    var molpayCallback = function (transactionResult) {
        alert('molpayCallback transactionResult = '+transactionResult);
    };
    
    =========================================
    Sample transaction result in JSON string:
    =========================================
    
    {"status_code":"11","amount":"1.01","chksum":"34a9ec11a5b79f31a15176ffbcac76cd","pInstruction":0,"msgType":"C6","paydate":1459240430,"order_id":"3q3rux7dj","err_desc":"","channel":"Credit","app_code":"439187","txn_ID":"6936766"}
    
    Parameter and meaning:
    
    "status_code" - "00" for Success, "11" for Failed, "22" for *Pending. 
    (*Pending status only applicable to cash channels only)
    "amount" - The transaction amount
    "paydate" - The transaction date
    "order_id" - The transaction order id
    "channel" - The transaction channel description
    "txn_ID" - The transaction id generated by MOLPay
    
    * Notes: You may ignore other parameters and values not stated above
    
    =====================================
    * Sample error result in JSON string:
    =====================================
    
    {"Error":"Communication Error"}
    
    Parameter and meaning:
    
    "Communication Error" - Error starting a payment process due to several possible reasons, please contact MOLPay support should the error persists.
    1) Internet not available
    2) API credentials (username, password, merchant id, verify key)
    3) MOLPay server offline.

## Prepare the Payment detail object

    var paymentDetails = {
        'mp_amount' : '1.10', // Mandatory String. A value not less than '1.00'
        'mp_username' : '', // Mandatory String. Values obtained from MOLPay
        'mp_password' : '', // Mandatory String. Values obtained from MOLPay
        'mp_merchant_ID' : '', // Mandatory String. Values obtained from MOLPay
        'mp_app_name' : '', // Mandatory String. Values obtained from MOLPay
        'mp_order_ID' : '', // Mandatory String. Payment values
        'mp_currency' : 'MYR', // Mandatory String. Payment values
        'mp_country' : 'MY', // Mandatory String. Payment values
        'mp_verification_key' : '', // Mandatory String. Values obtained from MOLPay
        'mp_channel' : '', // Optional String.
        'mp_bill_description' : '', // Optional String.
        'mp_bill_name' : '', // Optional String.
        'mp_bill_email' : '', // Optional String.
        'mp_bill_mobile' : '', // Optional String.
        'mp_channel_editing' : false, // Optional String.
        'mp_editing_enabled' : false, // Optional String.
        'mp_transaction_id' : '', // For transaction request use only, do not use this on payment process
        'mp_request_type' : '' // For transaction request use only, do not use this on payment process
        //'mp_is_escrow' : '' // Optional for Escrow, put "1" to enable escrow
    };

## Start the payment module

    Step 1 - Pass the molpayview Titanium View Container to MOLPay object
    molpay.setMolpayView(molpayView);
    
    Step 2 - Start the payment UI with payment details and callback function
    molpay.startMolpay(paymentDetails, molpayCallback);
    
    Step 3 - Host open Window
    hostWin.open();

## Close the payment module UI

    molpay.closeMolpay();
    
    * Notes: closeMolpay does not close remove the UI, the host application must implement it's own mechanism to close the payment module UI, 
    
    * Example: Implementing MOLPay closing mechanism at host app
    closeButton = Titanium.UI.createButton({
        title: 'Close',
        top: 0,
        width: 100,
        height: 50,
        right: 0,
        backgroundColor: '#72529b',
        color: 'white'
    });
    
    closeButton.addEventListener('click', function () {
        molpay.closeMolpay();
        hostWin.remove(molpayView);
    });
    hostWin.add(closeButton);
    
    * The close event will also return a final result.

## Transaction status request service (optional)

    Step 1 - Create a hidden host container Titanium Window object
        var molpayView = Titanium.UI.createView({
            width: 0,
            height: 0
        });
    
    Step 2 - Repeat Installation procedures from 3 - 5.
    
    Step 3 - Start the status request procedure.
    molpay.transactionRequest(paymentDetails, molpayCallback);

## Support

Submit issue to this repository or email to our support@molpay.com

Merchant Technical Support / Customer Care : support@molpay.com<br>
Sales/Reseller Enquiry : sales@molpay.com<br>
Marketing Campaign : marketing@molpay.com<br>
Channel/Partner Enquiry : channel@molpay.com<br>
Media Contact : media@molpay.com<br>
R&D and Tech-related Suggestion : technical@molpay.com<br>
Abuse Reporting : abuse@molpay.com