/**
 * MainController
 *
 * @description :: Server-side logic for managing maincontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var data = [{
    category: 'Probability & Luck',
    title: 'Three Doors',
    sub_title: 'This one is a simple game which requires luck and intellgency. You\'ll have two tries to catch the right choice, I\'ll give you hints, Can you get it done?',
    star: 3,
    image: 'trends-1024x563.jpg',
    questions: ['There\'re three doors on the left, one of them is the correct door. Choose the one that you think is right.', 'Well, the difficult part comes. Your choice is currentAnswer. I\'m gonna tell you the placeholder is a wrong answer, you can choose to whether changing your answer.'],
    options: [{
        image: './image/door_1204922_easyicon.net.svg',
    }, {
        image: './image/door_1204922_easyicon.net.svg',
    }, {
        image: './image/door_1204922_easyicon.net.svg',
    }],
    answer: 0,
    evaluation: {
        won: 'won1',
        failed: 'failed1'
    },
}, {
    category: 'Probability',
    title: 'Picking balls',
    sub_title: 'A bag contains 10 balls numbered from 0 to 9. the balls are such that the person picking a ball out of the bag is equally likely to pick anyone of them.',
    star: 5,
    image: 'headline-featured-1024x563.jpg',
    questions: ['A bag contains 10 balls numbered from 0 to 9. A person picked a ball and replaced it in the bag after noting its number. He repeated this process 2 more times. What is the probability that the ball picked first is numbered higher than the ball picked second and the ball picked second is numbered higher than the ball picked third?'],
    options: [{
        text: '72/100',
    }, {
        text: '3/25',
    }, {
        text: '4/5',
    }, {
        text: '1/6',
    }],
    answer: 1,
    evaluation: {
        won: 'won2',
        failed: 'failed2'
    },
}, {
    category: 'Probability',
    title: 'Weatherman',
    sub_title: 'When it actually rains, the weatherman correctly forecasts rain 90% of the time. When it doesn\'t rain, he incorrectly forecasts rain 10% of the time.',
    star: 4,
    image: 'featured_shutterstock-1024x563.jpg',
    questions: ['Marie is getting married tomorrow, at an outdoor ceremony in the desert. In recent years, it has rained only 5 days each year.Unfortunately, the weatherman has predicted rain for tomorrow which is 90% correct.\n What is the probability that it will rain on the day of Marie\'s wedding?'],
    options: [{
        text: '0.567',
    }, {
        text: '0.111',
    }, {
        text: '0.332',
    }, {
        text: '0.732',
    }],
    answer: 1,
    evaluation: {
        won: 'won3',
        failed: 'failed3'
    },
}];


module.exports = {
    getBriefData: function(req, res) {
        var briefData = [];

        data.forEach(function(item, i) {
            var tmp = {};
            tmp.category = item.category;
            tmp.title = item.title;
            tmp.sub_title = item.sub_title;
            tmp.star = item.star;
            tmp.image = item.image;
            briefData.push(tmp);
        });

        return res.json(briefData);
    },
    getDetailDataByIndex: function(req, res) {
        var index = req.param('index');

        return res.json({
            questions: data[index].questions,
            options: data[index].options,
            image: data[index].image,
        });
    },
    evaluation: function(req, res) {
        var count = 0;
        var response = {};

        data.forEach((item) => {
            if (item.ifCorrect) {
                count++;
            }
        });

        switch (count) {
            case 2:
                response.evaluation = 'Your Math skill is in a middle level';
                break;
            case 3:
                response.evaluation = 'Your Math skill is impressive!';
                break;
            default:
                response.evaluation = 'Not bad, you tried your best!';
        }

        return res.json(response);
    },
    check: function(req, res) {
        //check if more than one step
        var gameIndex = parseInt(req.param('gameIndex'));
        var questionIndex = parseInt(req.param('questionIndex'));
        var choice = parseInt(req.param('choice'));
        console.log('gameIndex',gameIndex,'questionIndex',questionIndex,'choice',choice,'length',data[gameIndex].questions.length);
        console.log(questionIndex !== data[gameIndex].questions.length - 1);
        if (questionIndex !== data[gameIndex].questions.length - 1) {
            var choices = [0, 1, 2];
            var rightAnswer = chooseRandomElement(choices);
            data[gameIndex].answer = rightAnswer;
            removeElement(rightAnswer, choices);
            removeElement(choice, choices);

            return res.json({
                gameIndex: gameIndex,
                questionIndex: questionIndex,
                choice: choice,
                wrongAnswer: chooseRandomElement(choices),
                move: 'change'
            });
        } else {
            var ifCorrect = (data[gameIndex].answer === choice);

            data[gameIndex].ifCorrect = ifCorrect;

            return res.json({
                rightAnswer: data[gameIndex].answer,
                move: 'finish',
                gameIndex: gameIndex,
                ifCorrect: ifCorrect,
            });
        }
    }
};

function removeElement(el, array) {
    var index = array.indexOf(el);

    if (index > -1) {
        array.splice(index, 1);
    }
}

function chooseRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
