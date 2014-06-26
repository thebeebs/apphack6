var ApplicationInsightsService = {

    postClipboardCopy: function (symbol, buttonName) {
        var clientAnalyticsChannel = Microsoft.ApplicationInsights.Telemetry.WindowsStore.ClientAnalyticsChannel.default;
        var properties = new Windows.Foundation.Collections.PropertySet();
        properties["symbol"] = symbol;
        properties["buttonName"] = buttonName;
        clientAnalyticsChannel.logEvent("ClipboardCopy", properties);        
    }
}