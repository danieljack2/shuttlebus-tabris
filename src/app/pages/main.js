var config = require('./../../config.js').config;
var itemListComponent = require('./../components/item_list');
var feedShowcase = require('./../components/feed_showcase');
var updateUIColors = require('./../styles/theme').updateUIColors;
var getThemeStyle = require('./../styles/theme').getThemeStyle;

function init() {
    // Ok we need a page to contain all the application UI
    var page = tabris.create("Page", { title: config.appName , topLevel : true}) ;


    /**********************
     *   Tabs
     ******************/
    // So we need a Tab Container
    //var TabFolder = tabris.create('TabFolder', { left: 0, top: 0, right: 0, bottom:0 , elevation: 8 , tabBarLocation: "top", paging: true} ).appendTo(page);
    //page.set("_tabs", TabFolder);
    //
    //// Now we will create a tab per source and add to the container
    //config.feeds.forEach(function( feed ){
    //    var tab = tabris.create( 'Tab', { title: feed.name, background: 'white', _feed: feed} ).appendTo(TabFolder);
    //    itemListComponent( feed , tab ).appendTo(tab);
    //});
    //
    //// When the user changes the tab, change the app visuals
    //TabFolder.on("change:selection", function(widget, tab) {
    //    colorUpdates (tab.get('_feed').color , TabFolder);
    //});
    //
    //// Update the UI based on the theme and active tab.
    //colorUpdates (config.feeds[0].color , TabFolder);


	/**********************
     *   Showcase
     ******************/
    var container = tabris.create("ScrollView", { left: 0, right: 0, top: 0, bottom: 0 , direction:"vertical"}).appendTo(page);

    // Now we will create a tab per source and add to the container
    config.feeds.forEach(function( feed ){
        feedShowcase( feed , container ).appendTo(container);
    });

    // Update the UI based on the theme and active tab.
    colorUpdates (config.feeds[0].color);

    return page;
}

function open(){
    var p = init();
    return p.open();
}

module.exports = {
    init: init,
    open: open
}


function colorUpdates(color,  TabFolder){
    var styles = getThemeStyle(color);
    updateUIColors(color);
    if(TabFolder){
        TabFolder.set(styles.tabs);
    }
}
