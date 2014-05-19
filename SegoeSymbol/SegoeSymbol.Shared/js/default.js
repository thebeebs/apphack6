// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=392286
(function () {
    "use strict";
    
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

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

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {


            args.setPromise(WinJS.UI.processAll());
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

