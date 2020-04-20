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
    $(this).prop("disabled", true);
    $(this).text("Please wait...");
    if ($("#letters").val() === "") {
        $("#error").text("Please specify the letters to use");
        $("#error").show();
        $(this).text("Solve it!");
        $(this).prop("disabled", false);
        return;
    }
    $("#error").hide();
    var available = 0;
    var board = "";
    $("#board td").each(function(index) {
        if (index !== 0 && index % 10 === 0) {
            board += "\n";
        }
        if ($(this).hasClass("available")) {
            available++;
        }
        board += $(this).hasClass("available") ? 1 : 0
    });
    if (available < $("#letters").val().length) {
        $("#error").text("Too few boxes are marked available");
        $("#error").show();
        $(this).text("Solve it!");
        $(this).prop("disabled", false);
        return;
    }
    $.post("/solve", {
        board: board,
        letters: $("#letters").val().toLowerCase(),
    }).done(result => {
        var solutions = JSON.parse(result);
        console.log(solutions);
        if (solutions.length === 0) {
            $("#error").text("No solutions found");
            $("#error").show();
            $("#solve").text("Solve it!");
            $("#solve").prop("disabled", false);
            return;
        }
        var board = [];
        $("#board td").each(function(index) {
            if (board[Math.floor(index / 10)] === undefined) {
                board[Math.floor(index / 10)] = [];
            }
            board[Math.floor(index / 10)].push($(this).hasClass("available") ? 1 : 0);
        });
        for (var i = 0; i < solutions.length; i++) {
            console.log(solutions[i]);
            let letters_by_word = [];
            let indexed_board = [];
            $("#solutions").append(`<table id="solution${i}"></solution>`);
            for (var j = 0; j < 10; j++) {
                var table_row = "<tr>";
                for (var k = 0; k < 10; k++) {
                    table_row += `<td class="cell${j * 10 + k} ${board[j][k] === 0 ? "un" : ""}available"></td>`;
                    indexed_board.push([j * 10 + k, board[j][k]]);
                }
                $(`#solution${i}`).append(`${table_row}</tr>`);
            }
            for (var n = 0; n < indexed_board.length; n += 10) {
                let in_word = false;
                let pairs = indexed_board.slice(n, n + 10);
                for (var m = Math.floor(n / 10); m <= 90 + Math.floor(n / 10); m += 10) {
                    pairs.push(indexed_board[m]);
                }
                for (var pair = 0; pair < pairs.length; pair++) {
                    let index = pairs[pair][0];
                    let letter = pairs[pair][1];
                    if (letter ===  0 && in_word) {
                        in_word = false;
                        if (letters_by_word[letters_by_word.length - 1].length === 1) {
                            letters_by_word.pop();
                        }
                    } else if (letter === 1 && !in_word) {
                        in_word = true;
                        letters_by_word.push([index]);
                    } else if (letter === 1) {
                        letters_by_word[letters_by_word.length - 1].push(index);
                    }
                }
            }
            for (var word = 0; word < letters_by_word.length; word++) {
                for (var letter = 0; letter < solutions[i][word].length; letter++) {
                    $(`#solution${i} .cell${letters_by_word[word][letter]}`).text(solutions[i][word][letter].toUpperCase());
                }
            }
        }
        $("#board, form").hide();
        $("#solutions, #controls").show();
        $("#controls p:first-child").text(`1 / ${solutions.length}`);
        $("#controls p:last-child").text($("#letters").val().toUpperCase());
        if (solutions.length === 1) {
            $("#controls button").prop("disabled", true);
        }
        $("#solution0").show();
    });
});

$("#next").click(() => {
    let num_solutions = $("#solutions table").length;
    for (var i = 0; i < num_solutions; i++) {
        if ($(`#solution${i}`).css("display") !== "none") {
            $(`#solution${i}`).hide();
            $(`#solution${i + 1 < num_solutions ? i + 1 : 0}`).show();
            $("#controls p:first-child").text(`${i + 1 < num_solutions ? i + 2 : 1} / ${num_solutions}`);
            return;
        }
    }
});

$("#previous").click(() => {
    let num_solutions = $("#solutions table").length;
    for (var i = 0; i < num_solutions; i++) {
        if ($(`#solution${i}`).css("display") !== "none") {
            $(`#solution${i}`).hide();
            $(`#solution${i - 1 >= 0 ? i - 1 : num_solutions - 1}`).show();
            $("#controls p:first-child").text(`${i +- 1 >= 0 ? i : num_solutions} / ${num_solutions}`);
            return;
        }
    }
});
