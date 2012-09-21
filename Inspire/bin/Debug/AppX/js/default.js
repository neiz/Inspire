// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var articlesList;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            var articlelistElement = document.getElementById("articlelist");
            articlelistElement.addEventListener("iteminvoked", itemInvoked);
            backbutton.addEventListener("click", backButtonClick);

            articlesList = new WinJS.Binding.List();
            var publicMembers = { ItemList: articlesList };
            WinJS.Namespace.define("C9Data", publicMembers);


            args.setPromise(WinJS.UI.processAll().then(downloadC9BlogFeed));
        }
    };

    function backButtonClick(e) {
        articlecontent.style.display = "none";
        articlelist.style.display = "";
        WinJS.UI.Animation.enterPage(articlelist);
    }

    function itemInvoked(e) {
        var currentArticle = articlesList.getAt(e.detail.itemIndex);
        WinJS.Utilities.setInnerHTMLUnsafe(articlecontent, currentArticle.content);
        articlelist.style.display = "none";
        articlecontent.style.display = "";
        WinJS.UI.Animation.enterPage(articlecontent);
    }

    function get_random_color() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }

    function downloadC9BlogFeed() {
        WinJS.xhr({ url: "http://rss.slashdot.org/Slashdot/slashdotLinux" }).then(function (rss) {
                var items = rss.responseXML.querySelectorAll("item");

            var n = Math.round(Math.random(items.length) * items.length)
            var article = {};
            if (items[n] != null) {
                article.title = items[n].querySelector("title").textContent;
                var thumbs = items[n].querySelector("description").textContent;
                if (thumbs.length > 1) {
                    article.content = items[n].textContent;
                    articlesList.length = 0;
                    articlesList.push(article);
                    document.body.style.background = get_random_color();
                }
            }
        }).done(function () { setTimeout(downloadC9BlogFeed, 2000); });
    }

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
