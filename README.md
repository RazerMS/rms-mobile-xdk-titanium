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
    
    Step 2 - For iOS 10 and above, add the following to the iOS plist through the tiapp.xml, this is required as the app will crash at the image save procedures if not implemented.
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Payment images</string>
    
    Step 3 - Create a host container Titanium Window object
    var hostWin = Ti.UI.createWindow();
    
    Step 4 - Instantiate MOLPay object
    var molpay = require('MOLPayXDK');
    
    Step 5 - Create a view container Titanium View object for MOLPay payment UI
    var molpayView = Titanium.UI.createView();
    
    Step 6 - Add MOLPay view into the Host Window container
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
        // Mandatory String. A value more than '1.00'
        'mp_amount' : '',
    
        // Mandatory String. Values obtained from MOLPay
        'mp_username' : '',
        'mp_password' : '',
        'mp_merchant_ID' : '',
        'mp_app_name' : '',
        'mp_verification_key' : '',  
    
        // Mandatory String. Payment values
        'mp_order_ID' : '', 
        'mp_currency' : 'MYR',
        'mp_country' : 'MY',  
            
        // Optional String.
        'mp_channel' : '', // Use 'multi' for all available channels option. For individual channel seletion, please refer to "Channel Parameter" in "Channel Lists" in the MOLPay API Spec for Merchant pdf. 
        'mp_bill_description' : '',
        'mp_bill_name' : '',
        'mp_bill_email' : '',
        'mp_bill_mobile' : '',
        'mp_channel_editing' : false, // Option to allow channel selection.
        'mp_editing_enabled' : false, // Option to allow billing information editing.
            
        // Optional for Escrow
        'mp_is_escrow' : '', // Optional for Escrow, put "1" to enable escrow
    
        // Optional for credit card BIN restrictions
        'mp_bin_lock' : ['414170', '414171'], // Optional for credit card BIN restrictions
        'mp_bin_lock_err_msg' : 'Only UOB allowed', // Optional for credit card BIN restrictions
            
        // For transaction request use only, do not use this on payment process
        'mp_transaction_id' : '', // Optional, provide a valid cash channel transaction id here will display a payment instruction screen.
        'mp_request_type' : '', // Optional, set 'Status' when performing a transactionRequest
    
        // Optional, use this to customize the UI theme for the payment info screen, the original XDK custom.css file is provided at Example project source for reference and implementation.
        'mp_custom_css_url' : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'custom.css').nativePath,
    
        // Optional, set the token id to nominate a preferred token as the default selection, set "new" to allow new card only
        'mp_preferred_token': '',
    
        // Optional, credit card transaction type, set "AUTH" to authorize the transaction
        'mp_tcctype': '',
    
        // Optional, set true to process this transaction through the recurring api, please refer the MOLPay Recurring API pdf 
        'mp_is_recurring': false,
    
        // Optional for channels restriction
        'mp_allowed_channels': ['credit', 'credit3'],
    
        // Optional for sandboxed development environment, set boolean value to enable.
        'mp_sandbox_mode': true,
    
        // Optional, required a valid mp_channel value, this will skip the payment info page and go direct to the payment screen.
        'mp_express_mode': true,
    
        // Optional, enable this for extended email format validation based on W3C standards.
        'mp_advanced_email_validation_enabled': true,
    
        // Optional, enable this for extended phone format validation based on Google i18n standards.
        'mp_advanced_phone_validation_enabled': true,
    
        // Optional, explicitly force disable billing name edit.
        'mp_bill_name_edit_disabled': true,
    
        // Optional, explicitly force disable billing email edit.
        'mp_bill_email_edit_disabled': true,
    
        // Optional, explicitly force disable billing mobile edit.
        'mp_bill_mobile_edit_disabled': true,
    
        // Optional, explicitly force disable billing description edit.
        'mp_bill_description_edit_disabled': true
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

## Cash channel payment process (How does it work?)

    This is how the cash channels work on XDK:
    
    1) The user initiate a cash payment, upon completed, the XDK will pause at the “Payment instruction” screen, the results would return a pending status.
    
    2) The user can then click on “Close” to exit the MOLPay XDK aka the payment screen.
    
    3) When later in time, the user would arrive at say 7-Eleven to make the payment, the host app then can call the XDK again to display the “Payment Instruction” again, then it has to pass in all the payment details like it will for the standard payment process, only this time, the host app will have to also pass in an extra value in the payment details, it’s the “mp_transaction_id”, the value has to be the same transaction returned in the results from the XDK earlier during the completion of the transaction. If the transaction id provided is accurate, the XDK will instead show the “Payment Instruction" in place of the standard payment screen.
    
    4) After the user done the paying at the 7-Eleven counter, they can close and exit MOLPay XDK by clicking the “Close” button again.

## XDK built-in checksum validator caveats 

    All XDK come with a built-in checksum validator to validate all incoming checksums and return the validation result through the "mp_secured_verified" parameter. However, this mechanism will fail and always return false if merchants are implementing the private secret key (which the latter is highly recommended and prefereable.) If you would choose to implement the private secret key, you may ignore the "mp_secured_verified" and send the checksum back to your server for validation. 

## Private Secret Key checksum validation formula

    chksum = MD5(mp_merchant_ID + results.msgType + results.txn_ID + results.amount + results.status_code + merchant_private_secret_key)

## Support

Submit issue to this repository or email to our support@molpay.com

Merchant Technical Support / Customer Care : support@molpay.com<br>
Sales/Reseller Enquiry : sales@molpay.com<br>
Marketing Campaign : marketing@molpay.com<br>
Channel/Partner Enquiry : channel@molpay.com<br>
Media Contact : media@molpay.com<br>
R&D and Tech-related Suggestion : technical@molpay.com<br>
Abuse Reporting : abuse@molpay.com