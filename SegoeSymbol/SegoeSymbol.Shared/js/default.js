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
        if (type == "COPY") {
            doc.loadXml("<toast><visual><binding template=\"ToastText01\"><text id=\"1\">The Symbol was copied to your clipboard, when you paste you'll need to set the font to Segoe UI Symbol in the target document</text></binding></visual></toast>");
        } else {
            doc.loadXml("<toast><visual><binding template=\"ToastText01\"><text id=\"1\">The "+ type + " value was copied your your clipboard</text></binding></visual></toast>");
        }var toast = new Windows.UI.Notifications.ToastNotification(doc);
        notificationManager.createToastNotifier().show(toast);

        // Send notification to App Insights that a copy was made.
        ApplicationInsightsService.postClipboardCopy(value, type);

    }
    function createWindowsTiles(value) {
        var tiles = [
            { w: 30, h: 30, n: 'SmallLogo'},
            { w: 70, h: 70, n: 'Square'},
            { w: 150, h: 150, n: 'Logo'},
            { w: 310, h: 150, n: 'Wide'},
            { w: 310, h: 310, n: 'Square'},
            { w: 50, h: 50, n: 'Store'},
            { w: 24, h: 24, n: 'Badge'},
            { w: 620, h: 300, n: 'SplashScreen'}
        ]

        var sizes = [80, 100, 140, 160, 180];
        createTiles(value, "windows", sizes, tiles);
    }

    function createWindowsPhoneTiles(value) {
        var tiles = [
                { w: 44, h: 44, n: 'Tiny'},
                { w: 71, h: 71, n: 'Small'},
                { w: 71, h: 71, n: 'Medium'},
                { w: 50, h: 50, n: 'Store'},
                { w: 24, h: 24, n: 'Badge'},
                { w: 768, h: 1280, n: 'SplashScreen'}
        ]
        var sizes = [100, 140, 160, 180, 200, 220, 240, 300, 400];
        createTiles(value, "phone", sizes, tiles);
    }

    function xcreateWindowsTiles(value) {
        var tiles = [
                { w: 44, h: 44, n: 'Tiny' }

        ]
        var sizes = [100];
        createTiles(value, "phone", sizes, tiles);
    }

    function createTiles(value, type, sizes, tiles) {
        
        var folderPicker = new Windows.Storage.Pickers.FolderPicker;
        folderPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.desktop;
        folderPicker.fileTypeFilter.replaceAll([".png"]);
        folderPicker.commitButtonText = "Save Tiles here";        

        folderPicker.pickSingleFolderAsync()
        .done(function (folder) {
            Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.addOrReplace("PickedFolderToken", folder);

            for (var i = 0; i < tiles.length; i++) {
                produceTile(tiles[i].n, folder, tiles[i].w, tiles[i].h, "#000000", value, sizes);
            }
        })
    }
   
    function produceTile(name, folder, width, height, colour, value, sizes) {        
        var newname;
        for (var i = 0; i < sizes.length; i++) {

            width = ((width / 100) * sizes[i]) | 0;
            height = ((height / 100) * sizes[i]) | 0;
            newname = name + width + "x" + height +".scale-" + sizes[i] + ".png"
            
            folder.createFileAsync(newname, Windows.Storage.CreationCollisionOption.replaceExisting)
                .then(function (file) {
                    return file.openAsync(Windows.Storage.FileAccessMode.readWrite);
                })
                .done(function (stream) {
                    var canvas = generateCanvasTile(width, height, value, colour);
                    var blob = canvas.msToBlob();
                    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    Windows.Graphics.Imaging.BitmapEncoder.createAsync(Windows.Graphics.Imaging.BitmapEncoder.pngEncoderId, stream)
                        .done(function (encoder) {
                            //Set the pixel data in the encoder
                            encoder.setPixelData(Windows.Graphics.Imaging.BitmapPixelFormat.rgba8, Windows.Graphics.Imaging.BitmapAlphaMode.straight,
                                width, height, 96, 96, new Uint8Array(imgData.data));
                            //Go do the encoding
                            encoder.flushAsync().done(function () {
                                stream.close()
                            });
                        }
                        )
                })
        }
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
            confirmFlyout.winControl.show(btnCreateTiles, "top");
        }


        var confirmFunc = function () {
            getSelection().done(
                function (value) {
                    createWindowsTiles(value.code);
                })
        }

        document.getElementById("btnConfirm").addEventListener("click", confirmFunc, false);

        btnCopyHTML.winControl.onclick = function () {
            getSelection().done(
                function (value){
                    copyToClipBoard(value.html, "HTML")
                })
                
        }

        

        btnCopy.winControl.onclick = function () {
            getSelection().done(
                function (value) {
                    copyToClipBoard(String.fromCharCode(value.code), "COPY")
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
                    symbolArray[i].html = "&#" + parseInt(code.substring(2, code.length), 16);
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

