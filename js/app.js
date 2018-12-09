/*
 * Create a list that holds all of your cards
 */
const array = 
    [
        'fa-anchor',
        'fa-anchor',
        'fa-bicycle',
        'fa-bicycle',
        'fa-bolt',
        'fa-bolt',
        'fa-bomb',
        'fa-bomb',
        'fa-cube',
        'fa-cube',
        'fa-diamond',
        'fa-diamond',
        'fa-leaf',
        'fa-leaf',
        'fa-paper-plane-o',
        'fa-paper-plane-o'
    ];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// - shuffle the list of cards using the provided "shuffle" method below
let shuffled = shuffle(array);
console.log(shuffled);

// cleaned "table"
const deck = "<ul class='deck'></ul>";
$('.score-panel').after(deck);

$.each(shuffled, function(index, value){
    // - loop through each card and create its HTML 
    let htmlString = `<li class='card' id='${index}' + ><i class='fa ${value}'></i></li>`;

    // - add each card's HTML to the page
    $('.deck').append(htmlString);

    //console.log(htmlString);
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let pair = []; // a *list* of "open" cards by value for comparison
let openings = []; // a *list* of "open" cards by id
let clicks = 0;
let moves = 0;
let stars = 3;
let pairFounds = 0;

$('.moves').html(moves); // reset moves

// the sleep function works only with an asynchronous function
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function flip(element){
    $(element).toggleClass('open show card').toggleClass('card');
}

async function error(element){
    //console.log(element);

    $(element).toggleClass('error card').toggleClass('card');

    $(element).effect('shake');

    await sleep(1000);
    
    $(element).toggleClass('error card').toggleClass('card');    
}

async function match(){
    
    $('#'+ openings[0]).toggleClass('match card').toggleClass('card').effect('highlight');
    $('#'+ openings[1]).toggleClass('match card').toggleClass('card').effect('highlight');

    clicks = -1;
}

async function notFound(){

    error('#'+ openings[0]);
    error('#'+ openings[1]);

    await sleep(1000);    

    flip('#'+ openings[0]);
    flip('#'+ openings[1]);

    clicks = 0;
}

let seconds = 0;

function timer() {
    $('.timer').html(seconds++);
    setTimeout("timer()", 1000);

    if(seconds == 60){
        $('#failed').modal('show');
    }
}

$(document).ready(timer());


$('.deck').on('click', 'li', function(){

    // limits the opening of only two cards at a time
    if(clicks < 2 && $(this).attr('class') != 'open show card' && $(this).attr('class') != 'open show match card') {
        
        openings[clicks] = $(this).attr('id');

        pair[clicks] = $(this).children().attr('class');

        flip($(this));
        
        if(pair.length == 2 && clicks == 1) {
            if(pair[0] == pair[1]){
                match();

                pairFounds++;

                if(pairFounds === shuffled.length/2){
                    $('#congrats').modal('show');
                    $('.info').html(`With ${moves} moves, in ${seconds} seconds and ${stars} stars <br>Wooooooo!`);
                }
            }

            if(pair[0] != pair[1]){
                notFound();
            }

            moves++;

            $('.moves').html(moves);

            if(moves == 10){
                $(".stars").children().children().last().removeClass().addClass('fa').addClass('fa-star-o');
                stars--;
            }

            if(moves == 15){
                $(".stars").children().next().children().removeClass().addClass('fa').addClass('fa-star-o');
                stars--;
            }

            if(moves == 18){
                $(".stars").children().children().removeClass().addClass('fa').addClass('fa-star-o');
                stars--;
            }
        }
        
        clicks++;
    }
});

$('.again').click(function(){ window.location = 'index.html'});

$('.restart').click(function(){ window.location = 'index.html'});