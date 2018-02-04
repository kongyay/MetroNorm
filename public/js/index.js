"use strict";

var $ = require('jquery');

// Options
// var sqNum = 2;
// var instruments = 3;
// var tocctime = 1000;
var maxInstruments = 25;
// Var
var round;
var score;
var width;
var height;
var instrumentsList;
var toccEvent;
var k;
var val;
var rightval;
var subAudio;
var revealing;
var mute;

$(document).ready(function () {

    setup();

    function setup() {
        round = 0;
        score = 0;
        width = 100 / sqNum;
        height = 10;
        instrumentsList = [];
        k = -1;
        val = [];
        rightval = [];
        subAudio = [];
        revealing = false;
        mute = false;
        if (instruments > maxInstruments || instruments < 1) {
            $('#round').html('Instrument value has to be 1-'+maxInstruments);
            $('#start').hide();
            return;
        }

        $('#round').html('Press Start to listen...');
        $('#data').html(`${Math.round(1000/tocctime*100)/100} BPS | ${instruments} Instruments | ${sqNum} Loop Beats`);
        $('#squareZone').html('');

        for(var j=0;j<maxInstruments;j++) {
            instrumentsList.push(j);
        }
        instrumentsList = shuffle(instrumentsList);
        
        for (let i = 0; i < sqNum; i++) {
            val.push(0);
            rightval.push(instrumentsList[Math.floor(Math.random() * instruments)]);
            subAudio.push(document.createElement('audio'));

            $('#squareZone').append(`<div id='square${i}' class='square'> </canvas>`);
            resizeAll();
            $('#square' + i).css('left', width * i + '%');

            $('#square' + i).click(function () {
                if (revealing) return;
                val[i] = (val[i] + 1) % instruments;

                subAudio[i].setAttribute('src', `/music/${instrumentsList[val[i]]}.wav`);
                subAudio[i].currentTime = 0;
                subAudio[i].play();

                var height = $(window).height() / instruments * (val[i] + 1);
                $(this).css('height', height + 'px');

            });

        }

       
    }




    var toccing = function () {
        if (!mute)
            audioElement.play();
        console.log('Tocc');


        $('#square' + k).removeClass('tocc');
        $('#square' + k).removeClass('right');
        if (k < sqNum - 1) {
            k++;

        } else {
            if(revealing)
                $('#back-reveal').click();
            k = 0;
            score = 0;
        }

        subAudio[k].currentTime = 0;
        subAudio[k].play();
        
        $('#round').html(++round);

        if (revealing) {
            $('#square' + k).addClass('right');
            return;
        }

        if (instrumentsList[val[k]] == rightval[k]) {

            score++;
            if (score == sqNum) {
                $('#pause').click();
                $('#round').html('Congrats, You won within: ' + round + ' beats');
                console.log('Congrats');
                $('#play').hide();
                $('#reveal').hide();
                $('#replay').show();
                clearInterval(toccEvent);

            }
            $('#square' + k).addClass('right');
        } else {
            $('#square' + k).addClass('tocc');
        }

    };

    $('#start').click(function () {
        $('#pause').show();
        $(this).hide();
        $('#reveal').click();
        toccEvent = setInterval(toccing, tocctime);

    });

    $('#play').click(function () {
        $('#pause').show();
        $(this).hide();
        toccEvent = setInterval(toccing, tocctime);

    });

    $('#pause').click(function () {
        $('#play').show();
        $(this).hide();
        clearInterval(toccEvent);
    });

    $('#replay').click(function () {
        tocctime = (tocctime>100)? tocctime-50:tocctime;
        instruments = (instruments<maxInstruments)? instruments+1:maxInstruments;
        sqNum = (sqNum<100)? sqNum+1:100;

        setup();
        $('#start').show();
        $('#replay').hide();

    });

    $('#reveal').click(function () {
        $('#back-reveal').show();
        $(this).hide();
        score = 0;
        revealing = true;
        k = -1;
        for (let i = 0; i < sqNum; i++) {
            $('#square' + i).height(1);
            $('#square' + i).removeClass('tocc');
            subAudio[i].setAttribute('src', `/music/${rightval[i]}.wav`);
        }
    });
    $('#back-reveal').click(function () {
        $('#reveal').show();
        $(this).hide();
        revealing = false;
        resizeAll();
        for (let i = 0; i < sqNum; i++) {
            subAudio[i].setAttribute('src', `/music/${instrumentsList[val[i]]}.wav`);
        }
    });

    $('#mute').click(function () {
        mute = !mute;
        console.log('mute wood:' + mute);
    });

    $('#howto').click(function () {
        alert('Listen to the challenge sound.\nClick a rectangle on bottom the screen to change your sound.\nMatch them with the sound you heard.\nLess beats passed = Better score');
    });

    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '/music/woodblock.ogg');

    audioElement.addEventListener('ended', function () {
        //this.play();
        audioElement.currentTime = 0;
    }, false);



    $(window).on('resize', function () {
        resizeAll();
    });

    function resizeAll() {
        $('#squareZone').width($(window).width()+20);
        var width = 100 / sqNum;
        for (var i = 0; i < sqNum; i++) {
            var height = $(window).height() / instruments * (val[i] + 1);
            $('#square' + i).css('width', width + '%');
            $('#square' + i).css('height', height + 'px');
        }
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
});


