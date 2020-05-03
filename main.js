let myp5, startButton, answer, yes, no, next, eval;
let currentPage = 0;

document.addEventListener("DOMContentLoaded", function(event) {
  let startButton = document.getElementById('start');
  let answer = document.getElementById('answer');
  let yes = document.getElementById('yes');
  let no = document.getElementById('no');
  let next = document.getElementById('next');
});

let testTemplates = [
  {
    id: "1.1",
    target: {
      shape: "rect",
      color: '#e63946',
      width: 30,
      height: 30
    },
    distractorCount: 20,
    distractors: [{
        shape: "circle",
        color: 'rgba(0,0,255,1)',
        width: 30,
        height: 30,
      },
      {
        shape: "circle",
        color: 'rgba(255,127,127,1)',
        stroke: 'rgba(255,0,0,1)',
        width: 30,
        height: 30,
      },
      {
        shape: "rect",
        color: '#a8dadc',
        width: 40,
        height: 40,
      },
      {
        shape: "rect",
        color: 'rgba(0,127,255,1)',
        width: 60,
        height: 5,
      },
      {
        shape: "rect",
        color: 'rgba(255,255,255,1)',
        stroke: '#e76f51',
        width: 60,
        height: 30,
      },
      {
        shape: "rect",
        color: '#264653',
        width: 60,
        height: 30,
      },
      {
        shape: "rect",
        color: '#e9c46a',
        width: 5,
        height: 60,
      },
      {
        shape: "circle",
        color: 'rgba(255,127,180,1)',
        width: 50,
        height: 50,
      },
      {
        shape: "rect",
        color: 'rgba(255,255,255,1)',
        stroke: '#2a9d8f',
        width: 40,
        height: 40,
      }
    ],
    timeout: 100,
    question: "Hast du ein rotes Quadrat gesehen?"
  },
  {
    id: "2.1",
    target: {
      shape: "circle",
      color: 'rgba(255,255,255,1)',
      stroke: 'rgba(0,0,0,1)',
      width: 40,
      height: 40
    },
    distractorCount: 50,
    distractors: [{
        shape: "rect",
        color: 'rgba(255,255,255,1)',
        stroke: 'rgba(0,0,0,1)',
        width: 30,
        height: 30,
      },
      {
        shape: "rect",
        color: 'rgba(255,255,255,1)',
        stroke: 'rgba(0,0,0,1)',
        width: 50,
        height: 25,
      },
      {
        shape: "rect",
        color: 'rgba(255,255,255,1)',
        stroke: 'rgba(0,0,0,1)',
        width: 25,
        height: 50,
      }
    ],
    timeout: 100,
    question: "Hast du einen Kreis gesehen?"
  },
  {
    id: "3.1",
    target: {
      shape: "circle",
      color: '#3a86ff',
      stroke: '#ff006e',
      width: 40,
      height: 40
    },
    distractorCount: 30,
    distractors: [{
        shape: "circle",
        color: '#ff006e',
        width: 30,
        height: 30,
      },
      {
        shape: "circle",
        color: '#3a86ff',
        width: 30,
        height: 30,
      },
      {
        shape: "rect",
        color: '#3a86ff',
        stroke: '#ff006e',
        width: 30,
        height: 30,
      },
      {
        shape: "circle",
        color: '#3a86ff',
        stroke: '#ffbe0b',
        width: 40,
        height: 40,
      }
    ],
    timeout: 100,
    question: "Hast du einen blauen Kreis \nmit roter Umrandung gesehen?"
  }
]

// CREATE MULTIPLE TESTS FROM TEMPLATES
let tests = [];
for (var i = 0; i < testTemplates.length; i++) {
  let t = JSON.parse(JSON.stringify(testTemplates[i]))
  tests.push(t);
  for (var j = 1; j < 4; j++) {
    let t = JSON.parse(JSON.stringify(testTemplates[i]))
    t.id = (i + 1) + "." + (j + 1)
    t.timeout = (j == 3) ? 1000 : 250 * j;
    tests.push(t);
  }
}

// SHUFFLE TESTS
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#2450976
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
shuffleArray(tests);

let canvasWidth = 600
let canvasHeight = 500

// n equals test#
function startSketch(n) {
  let sketch = function(p) {
    p.setup = function() {
      let test = tests[n];
      console.log(test);

      let overlapping = false;
      let protection = 0;
      let shapes = [];

      p.createCanvas(canvasWidth + 100, canvasHeight + 100);
      while (shapes.length < test.distractorCount) {
        if (test.distractorCount - shapes.length == 1) {
          // TARGET SHAPE
          var shape = {
            x: p.random(canvasWidth),
            y: p.random(canvasHeight),
            w: test.target.width,
            h: test.target.height,
          }
        } else {
          // DISTRACTOR SHAPE
          let j = Math.floor(p.random(test.distractors.length));
          var shape = {
            index: j,
            x: p.random(canvasWidth),
            y: p.random(canvasHeight),
            w: test.distractors[j].width,
            h: test.distractors[j].height,
          }
        }
        overlapping = false;

        // CHECK OVERLAPPING
        for (let i = 0; i < shapes.length; i++) {
          let other = shapes[i];
          let d = p.dist(shape.x, shape.y, other.x, other.y);
          let shapeR = Math.max(shape.w, shape.h);
          let otherR = Math.max(other.w, other.h);
          if (d < shapeR + otherR) {
            overlapping = true;
            break;
          }
        }
        if (!overlapping)
          shapes.push(shape);

        protection++
        if (protection > 2000) {
          break;
        }
      }

      for (let i = 0; i < shapes.length; i++) {
        if (i == shapes.length - 1) {
          // LAST ITERATION
          // DRAW TARGET SHAPE
          p.fill(test.target.color);
          p.strokeWeight(4);
          if (test.target.stroke) p.stroke(test.target.stroke);
          else p.noStroke();
          switch (test.target.shape) {
            case "rect":
              p.rect(shapes[i].x, shapes[i].y, test.target.width, test.target.height);
              break;
            case "circle":
              p.ellipse(shapes[i].x, shapes[i].y, test.target.width, test.target.height);
              break;
          }
          break;
        }

        // DRAW DISTRACTOR SHAPE
        let dis = test.distractors[shapes[i].index];
        p.fill(dis.color);
        p.strokeWeight(4);
        if (dis.stroke) p.stroke(dis.stroke);
        else p.noStroke();
        switch (dis.shape) {
          case "rect":
            p.rect(shapes[i].x, shapes[i].y, dis.width, dis.height);
            break;
          case "circle":
            p.ellipse(shapes[i].x, shapes[i].y, dis.width, dis.height);
            break;
        }
      }
      setTimeout(function() {
        clearCanvas(p);
      }, test.timeout);
    }
  };
  myp5 = new p5(sketch, 'container');
}

function toggleAnswer(el) {
  if (el.classList.contains("selected")) {
    el.classList.remove("selected");
    this.next.classList.add("hide");
  } else {
    this.yes.classList.remove("selected");
    this.no.classList.remove("selected");
    el.classList.add("selected");
    this.next.classList.remove("hide");
  }
}

function start() {
  document.getElementById('answer').classList.add('hide');
  document.getElementById('container').classList.remove('hide');
  document.getElementsByClassName('landing')[0].classList.add('hide');
  this.next.classList.add('hide');
  startSketch(0);
}

function clearCanvas() {
  myp5.clear();
  myp5.noStroke();
  myp5.textSize(32);
  myp5.fill(1, 1, 1);
  myp5.textAlign(myp5.CENTER, myp5.CENTER);
  myp5.text(tests[currentPage].question, 350, 300);
  this.answer.classList.remove('hide');
}

function nextTest() {
  //SAVE RESULT
  let results;
  if (currentPage == 0) {
    results = {}
  } else {
    results = JSON.parse(window.localStorage.getItem("results"));
  }
  let t = tests[currentPage].id;
  results[t] = document.getElementsByClassName("selected")[0].id;
  window.localStorage.setItem("results", JSON.stringify(results));

  this.yes.classList.remove("selected");
  this.no.classList.remove("selected");
  this.next.classList.add('hide');
  this.answer.classList.add('hide');
  if (currentPage == tests.length - 1) {
    showEvaluation();
  } else {
    currentPage++;
    myp5.remove();
    startSketch(currentPage);
  }
}

function showEvaluation() {
  myp5.remove();
  this.answer.classList.add("hide");
  this.next.classList.add("hide");
  //SHOW EVAL
  let eval = document.getElementsByClassName('evaluation')[0];
  eval.classList.remove("hide");

  // FILL TABLE
  let results = JSON.parse(window.localStorage.getItem("results"));
  console.log(results)

  Object.keys(results).forEach(function(key,index) {
    let td = document.getElementById(key)
    if(results[key] == "yes") td.classList.add("yes")
    else td.classList.add("no")
});
}
