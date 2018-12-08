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

// the sleep function works only with an asynchronous function
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function flip(element){
    $(element).toggleClass('open show card').toggleClass('card');
}

async function match(){
    console.log('First: ' + pair[0] + ' id: ' + openings[0]);
    console.log('Second: ' + pair[1] + ' id: ' + openings[1]);
    console.log('EQUALS');
    
    $('#'+ openings[0]).toggleClass('match card').toggleClass('card');
    $('#'+ openings[1]).toggleClass('match card').toggleClass('card');

    clicks = -1;
}

async function notFound(){
    console.log('First: ' + pair[0] + ' id: ' + openings[0]);
    console.log('Second: ' + pair[1] + ' id: ' + openings[1]);
    console.log('DIFFERENT');

    await sleep(1000);    

    flip('#'+ openings[0]);
    flip('#'+ openings[1]);

    clicks = 0;
}

$('.deck').on('click', 'li', function(){

    console.log(clicks);

    // limits opening of only two cards
    if(clicks < 2 && $(this).attr('class') != 'open show card') {
        
        openings[clicks] = $(this).attr('id');

        pair[clicks] = $(this).children().attr('class');

        flip($(this));
        
        if(pair.length == 2 && clicks == 1) {
            if(pair[0] == pair[1]){
                match();
            }

            if(pair[0] != pair[1]){
                notFound();
            }
        }
        
        clicks++;
    }
});