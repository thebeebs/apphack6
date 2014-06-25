// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=392286
(function () {
    "use strict";
    
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var Notifications = Windows.UI.Notifications;
 
    //var symbolArray = [
    //        { unicode: "e071", html: "&#9822", unicodeJS: "\ue071" },
    //        { unicode: "E002", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E003", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E004", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E2A8", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E287", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E173", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E2A8", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E287", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E173", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E2A8", html: "&#9822", unicodeJS: "\uE173" },
    //        { unicode: "E287", html: "&#9822", unicodeJS: "\uE173" }
    //];


    WinJS.Namespace.define("Symbol", {
        data: new WinJS.Binding.List([])
    })

    function copyToClipBoard(value) {
        var dataPackage = new Windows.ApplicationModel.DataTransfer.DataPackage();
        dataPackage.requestedOperation = Windows.ApplicationModel.DataTransfer.DataPackageOperation.copy;
        dataPackage.setText(value);
        Windows.ApplicationModel.DataTransfer.Clipboard.setContent(dataPackage)
        var notificationManager = Notifications.ToastNotificationManager;
        var doc = new Windows.Data.Xml.Dom.XmlDocument;
        doc.loadXml("<toast><visual><binding template=\"ToastText01\"><text id=\"1\">"+ value+ "</text></binding></visual></toast>");
        var toast = new Windows.UI.Notifications.ToastNotification(doc);
        notificationManager.createToastNotifier().show(toast);

    }

    app.onactivated = function (args) {

        Microsoft.ApplicationInsights.Telemetry.WindowsStore.ClientAnalyticsSession.default.start("bc087ca7-6770-4c17-a2a2-32a3e89f5e7c");

        if (args.detail.kind === activation.ActivationKind.launch) {


            args.setPromise(WinJS.UI.processAll());
            btnCopyHTML.winControl.onclick = function () {
                copyToClipBoard("HTML Copied")
            }

            btnCopyCSS.winControl.onclick = function () {
                copyToClipBoard("CSS Copied")
            }

            btnCopyHEX.winControl.onclick = function () {
                copyToClipBoard("HEX Copied")
            }

            var appBarDiv = document.getElementById("appBar");
            var appBarControl = document.getElementById('appBar').winControl;
            var listView = document.getElementById("symbolList").winControl;
            listView.onselectionchanged = function (args) {
                
                if (listView.selection.count() > 0) {
                    appBarControl.show();
                    appBarControl.sticky = true;
                }
                else {
                    appBarControl.hide();
                }
            }
            
            
            var url = new Windows.Foundation.Uri("ms-appx:///data/segoeUnicodePrivateArea.json");
            Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {
                Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
                    var symbolArray = JSON.parse(text);
                    for (var i = 0; i < symbolArray.length; i++) {
                        
                        //str = String.fromCharCode(str.substring(3, str.length))
                        //symbolArray[i].name = str;
                        symbolArray[i].html = symbolArray[i].html
                        var code = symbolArray[i].code
                        code = "&#" + parseInt(code.substring(2, code.length),16) + ";";
                        symbolArray[i].symbol = code;
                        symbolArray[i].html = "&#" + parseInt(code.substring(2, code.length),16) ;
                        Symbol.data.push(symbolArray[i]);
                    }
                });
            }, function (e) {
                var i = e;
            });

        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();

