// Initialisation des variables
var balle = $("<div/>");
var v_down = 1;
var v_right = 10;
var p_top = 10;
var p_left = 10;
var rebond_ratio = 2/3;
var apesenteur = 7/4;
var interval;
var mouse_begin_x;
var mouse_begin_y;
var mouse_end_x;
var mouse_end_y;
var change = false;

var max_right = 500;
var max_bot = 500;

var context;
var canvas;

var canDraw = false;
var mode = 1;
$(document).ready(function(){
        //Redéfinition de la grandeur de la page
        max_right = $(window).width();
        max_bot = $(window).height();
        //On récupère le canvas
        canvas = $("#canvas");
        context = canvas.get(0).getContext("2d");
        //On définni le css de notre balle
        balle.attr("id","balle")
            .css({
                "width" : "50px",
                "height" : "50px",
                "background-color" : "blue",
                "background-size" : "cover",
                "border-radius" : "50%",
                "position" : "absolute",
                "top" : p_top+'px',
                "left" : p_left+'px',
                "transition" : "all 0.001s" // ça fait moins mal aux yeux
            });

        // On ajoute la balle au body (ne pas oublié de set le body et le HTML à width=100%)
        $("body").append(balle);

        //Si on commence à cliquer on prend les positions de la souris et on attend la fin du click et on bloque la balle
        balle.mousedown(function(event){
            event.preventDefault();
            mouse_begin_x = event.pageX;
            mouse_begin_y = event.pageY;
            balle.css({
                    "background-color" : balle.css("background-color")
            });
            change = true;
        });

        //Si on fini de clicker
        $("body").mouseup(function(event){
            event.preventDefault();
            //Si on avait cliquer sur la balle on change les vitesses avec celle de la souris
            if(change){
                mouse_end_x = event.pageX;
                mouse_end_y = event.pageY;
                v_down =  mouse_end_y - mouse_begin_y;
                v_right = mouse_end_x - mouse_begin_x;

                balle.css({
                        "background-color" : balle.css("background-color")
                });
                change = false;
            }
        });

        interval = setInterval(function(){
                //On bouge la balle toutes les 30ms
                move();
        },30);

        context.canvas.width  = max_right;
        context.canvas.height = max_bot;
});

function next(){
    $("#select").next().select();
}

function move(){
        //Si on ne change pas la vitesse de la balle
        if(!change){
            //On redéfinit la taille de la fenêtre 
                max_right = $(window).width();
                max_bot = $(window).height();

                //------- Canvas draw (Utile pour certains modes: laise un tracé derrière la balle) -------------
                if (canDraw){
                    if (mode == 18){
                        context.canvas.width  = max_right;
                        context.canvas.height = max_bot;
                        context.moveTo(p_left+25,p_top+25);
                        context.lineTo(p_left+v_right*(-4)+25,p_top+v_down*(-4)+25);
                        context.stroke();
                    }
                    if (mode == 19 || mode == 21){
                        context.lineTo(p_left+v_right+25,p_top+v_down+25);
                        context.stroke();
                    }
                    
                }else{
                    context.clearRect(0,0,max_right,max_bot);
                }
                //---------------------------------

                //La position de la balle est augmentée par celle de la vitesse
                p_top = p_top + v_down;
                p_left = p_left + v_right;
                
                //On change la vitesse pour que la balle soit attiré vers le bas
                // Si la balle est trop basse et que son rebond est faible, on stoppe les rebonds
                if(v_down <= 1 && v_down >= -1 && p_top >= ($(window).height() - 53) ){
                        v_down = 0;
                        p_top = $(window).height() - 50;
                        // On fraine la balle quand elle est au sol
                        v_right = v_right * 42/43; // Parce que c'est joli
                }else{
                        v_down = v_down + apesenteur;
                }

                // Ci-dessous les rebond_ratio servent à ralentir la balle au fur et à mesure de ses rebonds
                //Si on est tout en bas on fait rebondir la balle
                if(p_top + v_down + 50 > max_bot){
                        v_down = - v_down * rebond_ratio;
                        p_top = $(window).height() - 50;
                }
                //Si on est tout à droite on fait rebondir la balle
                if(p_left + v_right + 50 > max_right){
                        v_right = - v_right * rebond_ratio;
                        p_left = $(window).width() - 50;
                }
                //Si on est tout en haut on fait rebondir encore
                if(p_top + v_down < 0){
                        v_down = - v_down * rebond_ratio;
                        p_top = 0;
                }
                //Si on est tout à gauche on rebondit aussi
                if(p_left + v_right < 0){
                        v_right = - v_right * rebond_ratio;
                        p_left = 0;
                }
                
                
                //On change la position au niveau du css
                balle.css({
                        "top" : p_top+'px',
                        "left" : p_left+'px'
                });



        }
}


// Redéfinitions des variables selon les modes -------------------------------------------

$('#select').on('change', function() {
    mode = this.value;
    switch (this.value){
        case '1': //Normal
            $("body").css("background-image","none");
            $("#balle").css("background-image","none")
                .css("background-color","black");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '2': //Bambi
            $("body").css("background-image","url('image/bg_2.jpeg')");
            $("#balle").css("background-image","url('image/balle_2.jpg')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 0.75;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '3': //Sonic
            $("body").css("background-image","url('image/bg_3.png')");
            $("#balle").css("background-image","url('image/balle_3.gif')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '4': //Basket
            $("body").css("background-image","url('image/bg_4.jpg')");
            $("#balle").css("background-image","url('image/balle_4.gif')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 0.955;
                apesenteur = 15;
                canDraw = false;
            break;
        case '5': //Metroid
            $("body").css("background-image","url('image/bg_5.png')");
            $("#balle").css("background-image","url('image/balle_5.gif-c200')");
                rebond_ratio = 2/3;
                apesenteur = 2.5;
                canDraw = false;
            break;
        case '6': //IE
            $("body").css("background-image","url('image/bg_6.jpg')");
            $("#balle").css("background-image","url('image/balle_6.png')");
                rebond_ratio = 2/3;
                apesenteur = -0.75;
                canDraw = false;
            break;
        case '7': //Pokemon
            $("body").css("background-image","url('image/bg_7.jpg')");
            $("#balle").css("background-image","url('image/balle_7.png')");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '8': //Pokemon 2
            $("body").css("background-image","url('image/bg_8.jpg')");
            $("#balle").css("background-image","url('image/balle_8.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '9': //TMNT
            $("body").css("background-image","url('image/bg_9.jpg')");
            $("#balle").css("background-image","url('image/balle_9.jpg')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '10': //DBZ
            $("body").css("background-image","url('image/bg_10.jpg')");
            $("#balle").css("background-image","url('image/balle_10.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '11': //Spaaaace
            $("body").css("background-image","url('image/bg_11.jpg')");
            $("#balle").css("background-image","url('image/balle_11.jpg')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 1/3;
                apesenteur = 0;
                canDraw = false;
            break;
        case '12': //Spaghetti
            $("body").css("background-image","url('image/bg_12.jpg')");
            $("#balle").css("background-image","url('image/balle_12.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '13': //Greed
            $("body").css("background-image","url('image/bg_13.jpg')");
            $("#balle").css("background-image","url('image/balle_13.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '14': //IUT
            $("body").css("background-image","url('image/bg_14.jpg')");
            $("#balle").css("background-image","url('image/balle_14.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = false;
            break;
        case '15': //Wheel
            $("body").css("background-image","url('image/bg_15.jpg')");
            $("#balle").css("background-image","url('image/balle_15.gif')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 0;
                apesenteur = 0;
                canDraw = false;
            break;
        case '16': //Billard
            $("body").css("background-image","url('image/bg_16.png')");
            $("#balle").css("background-image","url('image/balle_16.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 1/3;
                apesenteur = 0;
                canDraw = false;
            break;
        case '17': //Bug
            $("body").css("background-image","url('image/bg_17.jpg')");
            $("#balle").css("background-image","url('image/balle_17.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 0;
                apesenteur = 0;
                canDraw = false;
            break;
        case '18': //Tail star
            $("body").css("background-image","none");
            $("#balle").css("background-image","url('image/balle_18.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 1/3;
                apesenteur = 0;
                canDraw = true;
            break;
        case '19': //Pen
            $("body").css("background-image","none");
            $("#balle").css("background-image","url('image/balle_19.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 2/3;
                apesenteur = 7/4;
                canDraw = true;
            break;
        case '20': //Balloon
            $("body").css("background-image","url('image/bg_20.jpg')");
            $("#balle").css("background-image","url('image/balle_20.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 2/3;
                apesenteur = -0.75 ;
                canDraw = false;
            break;
        case '21': //SpacePen
            $("body").css("background-image","none");
            $("#balle").css("background-image","url('image/balle_19.png')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 1/3;
                apesenteur = 0;
                canDraw = true;
            break;
        case '22': //Mouche
            $("body").css("background-image","url('image/bg_22.png')");
            $("#balle").css("background-image","url('image/balle_22.gif')")
                .css("background-color","rgba(0,0,0,0)");
                rebond_ratio = 1;
                apesenteur = 0;
                canDraw = false;
            break;
    }
    

});