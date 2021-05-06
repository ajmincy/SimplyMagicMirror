/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
  address: "localhost", // Address to listen on, can be:
  // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
  // - another specific IPv4/6 to listen on a specific interface
  // - "0.0.0.0", "::" to listen on any interface
  // Default, when address config is left out or empty, is "localhost"
  port: 8080,
  ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
  // or add a specific IPv4 of 192.168.1.5 :
  // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
  // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
  // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

  useHttps: false, // Support HTTPS or not, default "false" will use HTTP
  httpsPrivateKey: "", // HTTPS private key path, only require when useHttps is true
  httpsCertificate: "", // HTTPS Certificate path, only require when useHttps is true

  language: "en",
  timeFormat: 24,
  units: "metric",
  // serverOnly:  true/false/"local" ,
  // local for armv6l processors, default
  //   starts serveronly and then starts chrome browser
  // false, default for all  NON-armv6l devices
  // true, force serveronly mode, because you want to.. no UI on this device

  modules: [
    {
      module: "alert",
    },
    {
      module: "updatenotification",
      position: "top_bar",
    },
    {
      module: "clock",
      position: "top_left",
    },
    {
      module: "compliments",
      position: "lower_third",
    },
    {
      module: "currentweather",
      position: "top_right",
      config: {
        location: "New York",
        locationID: "", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
        appid: "YOUR_OPENWEATHER_API_KEY",
      },
    },
    {
      module: "calendar",
      position: "top_left", // This can be any of the regions. Best results in left or right regions.
      config: {
        colored: false,
        coloredSymbolOnly: false,
        calendars: [
          {
            url: "http://www.calendarlabs.com/templates/ical/US-Holidays.ics",
          },
          {
            url:
              "https://calendar.google.com/calendar/ical/jamell.mincy%40gmail.com/private-ef6ddd63fb011bc4f609fe84da7b60f9/basic.ics",
            auth: {
              user: "jamell.mincy@gmail.com",
              pass: "@RemiStacy4Ever!",
              method: "basic",
            },
          },
        ],
      },
    },
    {
      module: "weatherforecast",
      position: "top_right",
      header: "Weather Forecast",
      config: {
        location: "New York",
        locationID: "5128581", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
        appid: "YOUR_OPENWEATHER_API_KEY",
      },
    },
    {
      module: "newsfeed",
      position: "bottom_bar",
      config: {
        feeds: [
          {
            title: "New York Times",
            url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml",
          },
          {
            title: "Laker Nation",
            url: "https://www.nba.com/lakers/rss.xml",
          },
          {
            title: "IGN",
            url: "https://feeds.ign.com/ign/games-all ",
          },
        ],
        showSourceTitle: true,
        showPublishDate: true,
        broadcastNewsFeeds: true,
        broadcastNewsUpdates: true,
      },
    },
    {
      module: "MMM-cryptocurrency",
      position: "top_right",
      config: {
        apikey: '79bb149a-0a91-4d2f-8dce-034809bc0898',
        currency: ['ethereum', 'bitcoin', 'litecoin', 'chainlink', 'dogecoin'],
        conversion: 'USD',
        headers: ['change24h', 'change1h', 'change7d'],
        displayLongNames: true,
        maximumFractionDigits: 2,
        displayType: 'detail',
        showGraphs: true
      }
    },
  ],
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
