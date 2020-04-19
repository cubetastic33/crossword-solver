$("#board td").click(function() {
    if ($(this).hasClass("unavailable")) {
        $(this).animate({
            "backgroundColor": "#444444"
        }, 200, function() {
            $(this).attr("class", "available");
        });
    } else if ($(this).hasClass("available")) {
        $(this).animate({
            "backgroundColor": "#121212"
        }, 200, function() {
            $(this).attr("class", "unavailable");
        });
    }
});

$("#solve").click(function(e) {
    e.preventDefault();
    if ($("#letters").val() === "") {
        $("#error").text("Please specify the letters to use");
        $("#error").show();
        return;
    }
    $("#error").hide();
    var available = 0;
    var board = [];
    $("#board td").each(function(index) {
        if (board[Math.floor(index / 10)] === undefined) {
            board[Math.floor(index / 10)] = [];
        }
        if ($(this).hasClass("available")) {
            available++;
        }
        board[Math.floor(index / 10)][index % 10] = $(this).hasClass("available") ? 1 : 0
    });
    if (available < $("#letters").val().length) {
        $("#error").text("Too few boxes are marked available");
        $("#error").show();
        return;
    }
    $.post("/solve", {
        board: JSON.stringify(board),
        letters: $("#letters").val().toUpperCase(),
    }).done(function(result) {
        console.log(result);
    });
});
