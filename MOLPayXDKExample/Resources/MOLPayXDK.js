var isInternalDebugging=!0,moduleId="molpay-mobile-xdk-titanium",wrapperVersion="0",molpaySdkUrl="molpay-mobile-xdk-www/index.html",mpopenmolpaywindow="mpopenmolpaywindow://",mptransactionresults="mptransactionresults://",mpcloseallwindows="mpcloseallwindows://",mprunscriptonpopup="mprunscriptonpopup://",mppinstructioncapture="mppinstructioncapture://",molpaynbepayurl="MOLPay/nbepay.php",molpayPaymentDetails,transactionResultCallback,molpayDiv,mainUiFrame,bankUiWindow,extraBankUiWindow,isClosingMolpay=!1,toast=function(a,b){if("iphone"===Ti.Platform.osname){indWin=Titanium.UI.createWindow();var c=Titanium.UI.createView({height:150,width:250,borderRadius:10,backgroundColor:"#bbb",opacity:.8});indWin.add(c);var d=Titanium.UI.createLabel({text:a?a:L("please_wait"),color:"#fff",width:"auto",height:"auto",textAlign:"center",font:{fontSize:14,fontWeight:"bold"}});c.add(d),indWin.open(),b=b?b:2500,setTimeout(function(){indWin.close({opacity:0,duration:1e3})},b)}if("android"===Ti.Platform.osname){var e=Ti.UI.createNotification({message:a?a:L("please_wait")});e.duration=Ti.UI.NOTIFICATION_DURATION_SHORT,e.show()}},writeImageToDevice=function(a){var b=Ti.Utils.base64decode(a.base64ImageUrlData);if("android"===Ti.Platform.osname)Ti.Media.saveToPhotoGallery(b,{success:function(a){isInternalDebugging&&Ti.API.info("saveImageToDevice saveToPhotoGallery success"),toast("Image saved",1e3)},error:function(a){isInternalDebugging&&Ti.API.info("saveImageToDevice saveToPhotoGallery error = ",a.error),toast("Image not saved",1e3)}});else{var c=Ti.UI.createImageView({image:b});Ti.Media.saveToPhotoGallery(c.toImage(),{success:function(a){isInternalDebugging&&Ti.API.info("saveImageToDevice saveToPhotoGallery success"),toast("Image saved",1e3)},error:function(a){isInternalDebugging&&Ti.API.info("saveImageToDevice saveToPhotoGallery error = ",a.error),toast("Image not saved",1e3)}})}},saveImageToDevice=function(a){isInternalDebugging&&Ti.API.info("saveImageToDevice imageDataJsonString = "+a);var b=JSON.parse(a);if(b)if("android"===Ti.Platform.osname){var c="android.permission.WRITE_EXTERNAL_STORAGE",d=Ti.Android.hasPermission(c);d?writeImageToDevice(b):Ti.Android.requestPermissions([c],function(a){a.success?writeImageToDevice(b):isInternalDebugging&&Ti.API.info("requestPermissions error = ",a.error)})}else writeImageToDevice(b)};Ti.App.addEventListener("app:fromMolpay",function(a){var b,c,d=a.data;if(String(d)&&String(d).indexOf(mpopenmolpaywindow)>-1)c=new RegExp(mpopenmolpaywindow,"g"),b=String(d).replace(c,""),b&&b.length>0&&(isInternalDebugging&&Ti.API.info("inAppCallback base64HtmlString = "+b),createBankUiWindow(b));else if(String(d)&&String(d).indexOf(mptransactionresults)>-1){if(c=new RegExp(mptransactionresults,"g"),b=String(d).replace(c,""),b&&b.length>0){var e=Ti.Utils.base64decode(b).toString(),f=JSON.stringify(JSON.parse(e));transactionResultCallback(f),isClosingMolpay&&(molpayDiv.remove(mainUiFrame),bankUiWindow&&molpayDiv.remove(bankUiWindow),extraBankUiWindow&&molpayDiv.remove(extraBankUiWindow),isClosingMolpay=!1)}}else if(String(d)&&String(d).indexOf(mpcloseallwindows)>-1)bankUiWindow&&molpayDiv.remove(bankUiWindow),extraBankUiWindow&&molpayDiv.remove(extraBankUiWindow);else if(String(d)&&String(d).indexOf(mprunscriptonpopup)>-1){if(isInternalDebugging&&Ti.API.info("mprunscriptonpopup, String(data) = "+String(d)),c=new RegExp(mprunscriptonpopup,"g"),b=String(d).replace(c,""),b&&b.length>0){var g=Ti.Utils.base64decode(b).toString();isInternalDebugging&&Ti.API.info("mprunscriptonpopup, jsString = "+g),extraBankUiWindow?(extraBankUiWindow.hide(),extraBankUiWindow.evalJS(g)):bankUiWindow&&(bankUiWindow.hide(),bankUiWindow.evalJS(g))}}else if(String(d)&&String(d).indexOf(mppinstructioncapture)>-1&&(isInternalDebugging&&Ti.API.info("mppinstructioncapture, String(data) = "+String(d)),c=new RegExp(mppinstructioncapture,"g"),b=String(d).replace(c,""),b&&b.length>0)){var h=Ti.Utils.base64decode(b).toString();isInternalDebugging&&Ti.API.info("mppinstructioncapture, dataString = "+h),saveImageToDevice(h)}});var inAppCallback=function(a){Ti.App.fireEvent("app:fromMolpay",{data:a})},nativeWebRequestUrlUpdates=function(a){isInternalDebugging&&console.log("nativeWebRequestUrlUpdates, url = "+a);var b={};b.requestPath=a;var c=JSON.stringify(b);mainUiFrame.evalJS("nativeWebRequestUrlUpdates('"+c+"');")},nativeWebRequestUrlUpdatesOnFinishLoad=function(a){isInternalDebugging&&console.log("nativeWebRequestUrlUpdatesOnFinishLoad, url = "+a);var b={};b.requestPath=a;var c=JSON.stringify(b);mainUiFrame.evalJS("nativeWebRequestUrlUpdatesOnFinishLoad('"+c+"');")},createBankUiWindow=function(a){if(Ti.API.info("createBankUiWindow base64HtmlString = "+a),molpayDiv){var b="data:text/html;base64,"+a;bankUiWindow=Ti.UI.createWebView({url:b,disableBounce:!0,loading:!0}),bankUiWindow.onCreateWindow=function(a){return extraBankUiWindow=Ti.UI.createWebView({disableBounce:!0,loading:!0}),molpayDiv.add(extraBankUiWindow),extraBankUiWindow.addEventListener("load",function(a){isInternalDebugging&&console.log("extraBankUiWindow load, e.url = "+a.url);String(a.url)&&nativeWebRequestUrlUpdates(a.url)}),extraBankUiWindow},bankUiWindow.addEventListener("load",function(a){isInternalDebugging&&console.log("bankUiWindow load, e.url = "+a.url);String(a.url)&&String(a.url).indexOf(molpaynbepayurl)>-1?bankUiWindow.evalJS("popout = function(){document.getElementsByTagName('form')[0].submit()};"):String(a.url)&&nativeWebRequestUrlUpdates(a.url)}),molpayDiv.add(bankUiWindow)}},mainUiFrameOnloadHandler=function(a){mainUiFrame.evalJS("updateSdkData('"+JSON.stringify(molpayPaymentDetails)+"',"+inAppCallback+");"),mainUiFrame.removeEventListener("load",mainUiFrameOnloadHandler)};exports.setMolpayView=function(a){molpayDiv=a},exports.startMolpay=function(a,b){isClosingMolpay=!1;try{molpayPaymentDetails=JSON.parse(a)}catch(c){molpayPaymentDetails=a}molpayPaymentDetails.module_id=moduleId,molpayPaymentDetails.wrapper_version=wrapperVersion,isInternalDebugging&&console.log("MOLPay startmolpay paymentDetails = "+JSON.stringify(a)+", callback = "+b),transactionResultCallback=b,mainUiFrame=Ti.UI.createWebView({url:molpaySdkUrl,disableBounce:!0,loading:!0}),mainUiFrame.addEventListener("load",mainUiFrameOnloadHandler),molpayDiv&&molpayDiv.add(mainUiFrame)},exports.closeMolpay=function(){isClosingMolpay=!0,mainUiFrame.evalJS("transactionRequest();")},exports.transactionRequest=function(a,b){isClosingMolpay=!0;try{molpayPaymentDetails=JSON.parse(a)}catch(c){molpayPaymentDetails=a}molpayPaymentDetails.module_id=moduleId,molpayPaymentDetails.wrapper_version=wrapperVersion,isInternalDebugging&&console.log("MOLPay transactionRequest paymentDetails = "+JSON.stringify(a,null,"")),transactionResultCallback=b,mainUiFrame=Ti.UI.createWebView({url:molpaySdkUrl,disableBounce:!0}),mainUiFrame.addEventListener("load",mainUiFrameOnloadHandler),molpayDiv&&molpayDiv.add(mainUiFrame)};