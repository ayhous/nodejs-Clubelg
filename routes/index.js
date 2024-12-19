const personnRoute = require("./personnRoutes");
const clubRoute = require("./clubRoutes");
const playerRoute = require("./playerRoutes");
const categoryRoute = require("./categoryRoutes");
const ParentRoute = require("./ParentRoutes");
const matchRoute = require("./matchRoutes");
const seasonRoute = require("./seasonRoutes");
const engagmentRoute = require("./engagmentRoutes");
const selectedTeamRoute = require("./selectedTeamRoutes");
const resultMatchRoute = require("./resultMatchRoutes");
const trainingRoute = require("./trainingRoutes");
const terrainRoute = require("./terrainRoutes");
const presentMatchRoute = require("./presentMatchRoutes");
const rulesRoute = require("./rulesRoutes");
const eventRoute = require("./eventRoutes");
const feedBackPlayer = require("./feedBackPlayerRoutes");
const postRoute = require("./postsRoutes");
const notificationRoute = require("./notificationRoutes");
const followerRoute = require("./followerRoutes");
const actionRuleRoute = require("./actionRulesRoutes");
const storeRoute = require("./storeRoutes");
const storeCategoryRoute = require("./storeCategoryRoutes");

const router = (app) => {
  app.use("/api/v1/personn", personnRoute);
  app.use("/api/v1/club", clubRoute);
  app.use("/api/v1/player", playerRoute);
  app.use("/api/v1/catgory", categoryRoute);
  app.use("/api/v1/parent", ParentRoute);
  app.use("/api/v1/match", matchRoute);
  app.use("/api/v1/season", seasonRoute);
  app.use("/api/v1/engagment", engagmentRoute);
  app.use("/api/v1/selectedTeam", selectedTeamRoute);
  app.use("/api/v1/resultMatch", resultMatchRoute);
  app.use("/api/v1/trainingRoute", trainingRoute);
  app.use("/api/v1/terrainRoute", terrainRoute);
  app.use("/api/v1/presentMatch", presentMatchRoute);
  app.use("/api/v1/rulesRoute", rulesRoute);
  app.use("/api/v1/event", eventRoute);
  app.use("/api/v1/feedBack", feedBackPlayer);
  app.use("/api/v1/post", postRoute);
  app.use("/api/v1/notification", notificationRoute);
  app.use("/api/v1/follower", followerRoute);
  app.use("/api/v1/actionRules", actionRuleRoute);
  app.use("/api/v1/product", storeRoute);
  app.use("/api/v1/store-category", storeCategoryRoute);
};

module.exports = router;
