// Code by Maddie Kahlon

window.onload = function() {
        var x;
        var count = 0;

        $(".box2").on("click", function() {
                $(".box2").not(box).removeClass("show-tooltip");
                box.addClass("show-tooltip");

                setTimeout(function() {
                        box.removeClass("show-tooltip");
                }, 1500);
        });

        $(".box1").click(function() {
                $(this).addClass("blue");
                $(this).siblings().removeClass("blue");
                x = $(this).children(":first").html();
                $("#x").html(x);
        });

        $(".box2").click(function() {
                if ($(this).children(":first").html() == x) {
                        $(this).addClass("red");
                        count += 1;
                        x = 0;
                        $("#x").html(x);
                        $("#counter").html(count);
                        $(".blue").hide();
                        $(this).children(":nth-child(3)").addClass("seeme");
                        $(this).children(":nth-child(4)").hide();
                } else {
                        $(this).children(":nth-child(4)").animate({
                                opacity: "0.3"
                        }, 200);

                        $(this).children(":nth-child(4)").animate({
                                opacity: "0"
                        }, 200);
                }
        });

        $(".wrong").click(function() {
                if (count == 48) {
                        $("#lcsa").hide();

                        $("#latin").animate({
                                marginRight: "130px"
                        }, 1000);

                        $("#desc").html(
                                '100! Félicitations! <a href="http://scriptest.github.io/sp/LCSA">Rejouer?</a>'
                        );
                }
        });
};
