new tabris.Drawer().append(new tabris.PageSelector());

var routeListPage = createRouteListPage("Shuttle Bus");

routeListPage.open();

function createRouteListPage(title) {
    return new tabris.Page({
        title: title,
        topLevel: true,
        style: ["FULLSCREEN"]
    }).append(displayRouteListPage());
}

function createRoutePage(title, routeId) {
    return new tabris.Page({
        title: title,
        topLevel: false,
        style: ["FULLSCREEN"]
    }).append(displayRoutePage(routeId));
}

function displayRoutePage(routeId) {
    var composite = new tabris.Composite({
        background: "white",
    });

    composite.append(displayHeader());

    // Create loading indicator
    var activityIndicator = new tabris.ActivityIndicator({centerX: 0, centerY: 0}).appendTo(composite);

    // Run async remote request with fetch
    fetch("https://qutvirtual4.qut.edu.au/delegate/shuttleBusServices/routes/" + routeId).then(function(response) {
        return response.json();
    }).catch(function(err) {

        // On error show want went wrong and reload button.
        composite.append(createTextView("Failure: " + err || "Error loading shuttle bus routes"));
    }).then(function(json) {

        // Dispose of the activity loader via direct reference
        activityIndicator.dispose();
        var nextTimes = "";
        composite.append(createTextView(json.title));
        for (i = 0; i < json.times.length; i++) {
            if (i === 0) {
                composite.append(createTextView("Next: " + json.times[i].departDate));
            } else {
                if (i === 1) {
                    composite.append(createNextTextView("Then:"));
                }
                var colour = 808080;
                composite.append(createNextTimeView(json.times[i].departDate, "#" + (colour + (i + 10))))
            }
        }
    });

    return composite;
}

function displayRouteListPage() {
    var composite = new tabris.Composite({
        background: "white"
    });

    composite.append(displayHeader());

    // Create loading indicator
    var activityIndicator = new tabris.ActivityIndicator({centerX: 0, centerY: 0}).appendTo(composite);

    // Run async remote request with fetch
    fetch("https://qutvirtual4.qut.edu.au/delegate/shuttleBusServices/routes").then(function(response) {
        return response.json();
    }).catch(function(err) {

        // On error show want went wrong and reload button.
        composite.append(createTextView("Failure: " + err || "Error loading shuttle bus routes"));
    }).then(function(json) {

        // Dispose of the activity loader via direct reference
        activityIndicator.dispose();

        var view = new tabris.CollectionView({
            layoutData: {left: 0, right: 0, top: "prev()", bottom: 0},
            itemHeight: 72,
            items: json.routes,
            initializeCell: function(cell) {
                var titleTextView = new tabris.TextView({
                    layoutData: {left: 16, right: 16, top: 16},
                    font: "16px Arial, sans-serif"
                }).appendTo(cell);
                var border = new tabris.Composite({
                    layoutData: {left: 0, bottom: 0, right: 0, height: 1},
                    background: "#e3e3e3"
                }).appendTo(cell);
                cell.on("change:item", function(widget, route) {
                    titleTextView.set("text", route.title);
                });
            }
        }).on("select", function(target, value) {
            createRoutePage(value.title, value.id).open();
        });
        composite.append(view);
        /*for (i = 0; i < json.routes.length; i++) {
         composite.append(createRouteButton(json.routes[i].title, json.routes[i].id));
         }*/
    });

    return composite;
}

function displayHeader() {
    var composite = new tabris.Composite({
        layoutData: {left: 0, top: 0, right: 0, height:50},
        background: "#114A81",
        opacity: 1
    });

    composite.append(new tabris.ImageView({
        image: "images/dw-logo-large.png"
    }));

    return composite;
}

function createNextTimeView(text, colour) {
    return new tabris.TextView({
        text: text,
        layoutData: {left: "prev() 12", top: 124},
        background: colour
    });
}

function createNextTextView(text) {
    return new tabris.TextView({
        text:text,
        layoutData: {left: 16, top: "prev() 12"}
    })
}

function createTextView(text) {
    return new tabris.TextView({
        text: text,
        markupEnabled: true,
        layoutData: {left: 16, top: "prev() 12"},
    });
}

function createRouteButton(title, routeId) {
    return new tabris.Button({
        layoutData: {left: 10, top: "prev() 12"},
        text: title,
        id: "routeButton" + routeId
    }).on("select", function() {
        createRoutePage(title, routeId).open();
    });
}