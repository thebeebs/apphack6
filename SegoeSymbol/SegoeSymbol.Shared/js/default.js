/// <reference path="applicationInsightsService.js" />
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=392286
(function () {
    "use strict";
    
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var Notifications = Windows.UI.Notifications;
 
    WinJS.Namespace.define("Symbol", {
        data: new WinJS.Binding.List([])
    })

    function copyToClipBoard(value, type) {
        var dataPackage = new Windows.ApplicationModel.DataTransfer.DataPackage();
        dataPackage.requestedOperation = Windows.ApplicationModel.DataTransfer.DataPackageOperation.copy;
        dataPackage.setText(value);
        Windows.ApplicationModel.DataTransfer.Clipboard.setContent(dataPackage)
        var notificationManager = Notifications.ToastNotificationManager;
        var doc = new Windows.Data.Xml.Dom.XmlDocument;
        doc.loadXml("<toast><visual><binding template=\"ToastText01\"><text id=\"1\">The "+ type + " value was copied your your clipboard</text></binding></visual></toast>");
        var toast = new Windows.UI.Notifications.ToastNotification(doc);
        notificationManager.createToastNotifier().show(toast);

        // Send notification to App Insights that a copy was made.
        ApplicationInsightsService.postClipboardCopy(value, type);

    }

    function createTiles(value) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var ctx, imgData;
        canvas.width = 200;
        canvas.height = 200;

        ctx.font = "italic 36px/2 Unknown Font, sans-serif";
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText(value, canvas.width / 2, canvas.height * .8);
        var blob = canvas.msToBlob();
        // Verify that we are currently not snapped, or that we can unsnap to open the picker
        var currentState = Windows.UI.ViewManagement.ApplicationView.value;
        if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
            !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
            // Fail silently if we can't unsnap
            return;
        }
        
        var folderPicker = new Windows.Storage.Pickers.FolderPicker;
        folderPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.desktop;
        folderPicker.fileTypeFilter.replaceAll([".png"]);
        folderPicker.commitButtonText = "Save Tiles here";
      
        folderPicker.pickSingleFolderAsync()
            .then(function (folder) {
                Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.addOrReplace("PickedFolderToken", folder);
                return folder.createFileAsync("TILE200x200.png")
            })
            .then(function (file) {
                return file.openAsync(Windows.Storage.FileAccessMode.readWrite);
            })
            .then(function (stream) {                
                imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);            
                return Windows.Graphics.Imaging.BitmapEncoder.createAsync(Windows.Graphics.Imaging.BitmapEncoder.pngEncoderId, stream);
            })
            .then(function (encoder) {
                //Set the pixel data in the encoder
                encoder.setPixelData(Windows.Graphics.Imaging.BitmapPixelFormat.rgba8, Windows.Graphics.Imaging.BitmapAlphaMode.straight,
                    canvas.width, canvas.height, 96, 96, new Uint8Array(imgData.data));
                //Go do the encoding
                
                return encoder.flushAsync();
            })
            .done(function (returnfs) {

            }, function (error) { })
}

function getSelection() {
    var listView = document.getElementById("symbolList").winControl;

    return listView.selection.getItems().then(function (items) {
        return items[0].data;
    }); 
}

app.onactivated = function (args) {

    Microsoft.ApplicationInsights.Telemetry.WindowsStore.ClientAnalyticsSession.default.start("bc087ca7-6770-4c17-a2a2-32a3e89f5e7c");
    
    if (args.detail.kind === activation.ActivationKind.launch) {

        args.setPromise(WinJS.UI.processAll());

        btnCreateTiles.winControl.onclick = function () {
            getSelection().done(
                function (value) {
                    createTiles(value.code);
                })

        }

        btnCopyHTML.winControl.onclick = function () {
            getSelection().done(
                function (value){
                    copyToClipBoard(value.html, "HTML")
                })
                
        }

        btnCopyCSS.winControl.onclick = function () {
            getSelection().done(
                function (value) {
                    copyToClipBoard(value.css, "CSS")
                })

        }

        btnCopyHEX.winControl.onclick = function () {
            getSelection().done(
                function (value) {
                    copyToClipBoard(value.code, "HEX")
                })

        }

        var appBarDiv = document.getElementById("appBar");
        var appBarControl = document.getElementById('appBar').winControl;
        var listView = document.getElementById("symbolList").winControl;
        listView.onselectionchanged = function (args,ui,oioi) {
                
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

