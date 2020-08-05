/* global Log, Module, moment */

/* Magic Mirror
 * Module: Compliments
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("compliments", {
  // Module config defaults.
  defaults: {
    compliments: {
      anytime: [
        "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.\n ~Roy T. Bennett",
        "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.\n ~ Winston Churchill",
        "You learn more from failure than from success. Don’t let it stop you. Failure builds character.",
        "It’s not whether you get knocked down, it’s whether you get up.\n ~Vince Lombardi",
        "More smiling, less worrying. More compassion, less judgment. More blessed, less stressed. More love, less hate.\n ~Roy T. Bennett",
        "Failure will never overtake me if my determination to succeed is strong enough.\n ~Og Mandino",
        "We may encounter many defeats but we must not be defeated.\n ~Maya Angelou",
        "Do not fear failure but rather fear not trying.\n ~Roy T. Bennett",
        "We generate fears while we sit. We overcome them by action.\n ~Dr. Henry Link",
        "Accept yourself, love yourself, and keep moving forward. If you want to fly, you have to give up what weighs you down.\n ~Roy T. Bennett",
        "Creativity is intelligence having fun.\n ~Albert Einstein",
        "What you lack in talent can be made up with desire, hustle and giving 110% all the time.\n ~Don Zimmer",
        "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.\n ~Roy T. Bennett",
      ],
      morning: [
        "Stacy's last weigh in was 134lbs\n July 1st,2020",
        "Antoine's last weigh in was 165lbs\n July 1st,2020",
        "Let's get to work!",
      ],
      afternoon: [
        "Have you done something you enjoyed yet?",
        "Do not forget to workout"
      ],
      evening: [
        "If you haven't already, get that workout in today?",
        "Mincy's never give up",
        "Remember you are someone",
      ],
      "....-01-01": ["Happy new year!"],
	  "....-09-10": ["Happy Birthday Antoine. Do something special."],
	  "....-12-23": ["Happy Birthday Stacy. Mommy would be so proud of you."],
	  "2021-01-12": ["Happy Birthday Remi. You are 5 WOW!"],
	  "2022-01-12": ["Happy Birthday Remi. You are 6 can you read this now?"],
	  "....-08-21": ["It is momma green's birthday. Love her like there is no tomorrow."],
	  "....-02-23": ["Happy Anniversary. Look how far you have come as union."],

    },
    updateInterval: 30000,
    remoteFile: null,
    fadeSpeed: 4000,
    morningStartTime: 3,
    morningEndTime: 12,
    afternoonStartTime: 12,
    afternoonEndTime: 17,
    random: true,
    mockDate: null,
  },
  lastIndexUsed: -1,
  // Set currentweather from module
  currentWeatherType: "",

  // Define required scripts.
  getScripts: function () {
    return ["moment.js"];
  },

  // Define start sequence.
  start: function () {
    Log.info("Starting module: " + this.name);

    this.lastComplimentIndex = -1;

    var self = this;
    if (this.config.remoteFile !== null) {
      this.complimentFile(function (response) {
        self.config.compliments = JSON.parse(response);
        self.updateDom();
      });
    }

    // Schedule update timer.
    setInterval(function () {
      self.updateDom(self.config.fadeSpeed);
    }, this.config.updateInterval);
  },

  /* randomIndex(compliments)
   * Generate a random index for a list of compliments.
   *
   * argument compliments Array<String> - Array with compliments.
   *
   * return Number - Random index.
   */
  randomIndex: function (compliments) {
    if (compliments.length === 1) {
      return 0;
    }

    var generate = function () {
      return Math.floor(Math.random() * compliments.length);
    };

    var complimentIndex = generate();

    while (complimentIndex === this.lastComplimentIndex) {
      complimentIndex = generate();
    }

    this.lastComplimentIndex = complimentIndex;

    return complimentIndex;
  },

  /* complimentArray()
   * Retrieve an array of compliments for the time of the day.
   *
   * return compliments Array<String> - Array with compliments for the time of the day.
   */
  complimentArray: function () {
    var hour = moment().hour();
    var date = this.config.mockDate
      ? this.config.mockDate
      : moment().format("YYYY-MM-DD");
    var compliments;

    if (
      hour >= this.config.morningStartTime &&
      hour < this.config.morningEndTime &&
      this.config.compliments.hasOwnProperty("morning")
    ) {
      compliments = this.config.compliments.morning.slice(0);
    } else if (
      hour >= this.config.afternoonStartTime &&
      hour < this.config.afternoonEndTime &&
      this.config.compliments.hasOwnProperty("afternoon")
    ) {
      compliments = this.config.compliments.afternoon.slice(0);
    } else if (this.config.compliments.hasOwnProperty("evening")) {
      compliments = this.config.compliments.evening.slice(0);
    }

    if (typeof compliments === "undefined") {
      compliments = new Array();
    }

    if (this.currentWeatherType in this.config.compliments) {
      compliments.push.apply(
        compliments,
        this.config.compliments[this.currentWeatherType]
      );
    }

    compliments.push.apply(compliments, this.config.compliments.anytime);

    for (entry in this.config.compliments) {
      if (new RegExp(entry).test(date)) {
        compliments.push.apply(compliments, this.config.compliments[entry]);
      }
    }

    return compliments;
  },

  /* complimentFile(callback)
   * Retrieve a file from the local filesystem
   */
  complimentFile: function (callback) {
    var xobj = new XMLHttpRequest(),
      isRemote =
        this.config.remoteFile.indexOf("http://") === 0 ||
        this.config.remoteFile.indexOf("https://") === 0,
      path = isRemote
        ? this.config.remoteFile
        : this.file(this.config.remoteFile);
    xobj.overrideMimeType("application/json");
    xobj.open("GET", path, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState === 4 && xobj.status === 200) {
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  },

  /* complimentArray()
   * Retrieve a random compliment.
   *
   * return compliment string - A compliment.
   */
  randomCompliment: function () {
    // get the current time of day compliments list
    var compliments = this.complimentArray();
    // variable for index to next message to display
    let index = 0;
    // are we randomizing
    if (this.config.random) {
      // yes
      index = this.randomIndex(compliments);
    } else {
      // no, sequential
      // if doing sequential, don't fall off the end
      index =
        this.lastIndexUsed >= compliments.length - 1 ? 0 : ++this.lastIndexUsed;
    }

    return compliments[index] || "";
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.className = this.config.classes
      ? this.config.classes
      : "thin xlarge bright pre-line";
    // get the compliment text
    var complimentText = this.randomCompliment();
    // split it into parts on newline text
    var parts = complimentText.split("\n");
    // create a span to hold it all
    var compliment = document.createElement("span");
    // process all the parts of the compliment text
    for (part of parts) {
      // create a text element for each part
      compliment.appendChild(document.createTextNode(part));
      // add a break `
      compliment.appendChild(document.createElement("BR"));
    }
    // remove the last break
    compliment.lastElementChild.remove();
    wrapper.appendChild(compliment);

    return wrapper;
  },

  // From data currentweather set weather type
  setCurrentWeatherType: function (data) {
    var weatherIconTable = {
      "01d": "day_sunny",
      "02d": "day_cloudy",
      "03d": "cloudy",
      "04d": "cloudy_windy",
      "09d": "showers",
      "10d": "rain",
      "11d": "thunderstorm",
      "13d": "snow",
      "50d": "fog",
      "01n": "night_clear",
      "02n": "night_cloudy",
      "03n": "night_cloudy",
      "04n": "night_cloudy",
      "09n": "night_showers",
      "10n": "night_rain",
      "11n": "night_thunderstorm",
      "13n": "night_snow",
      "50n": "night_alt_cloudy_windy",
    };
    this.currentWeatherType = weatherIconTable[data.weather[0].icon];
  },

  // Override notification handler.
  notificationReceived: function (notification, payload, sender) {
    if (notification === "CURRENTWEATHER_DATA") {
      this.setCurrentWeatherType(payload.data);
    }
  },
});
