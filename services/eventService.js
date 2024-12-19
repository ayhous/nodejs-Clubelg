/* eslint-disable no-unused-vars */
const AsyncHandler = require("express-async-handler");
const handleFacory = require("./handleFactory");
const eventModel = require("../Models/eventModel");
const sondageEventModel = require("../Models/sondageEventModel");
const playerModel = require("../Models/playerModel");
const personnelModel = require("../Models/personnelModel");
const sendMail = require("../utils/sendEmail");

exports.addNIDToRequest = AsyncHandler(async (req, res, next) => {
  if (req.NID) req.body.NID = req.NID;
  // if (req.logger) req.body.personn = req.logger;

  next();
});

exports.createeventService = AsyncHandler(async (req, res) => {
  console.log(req.body);
  let playerEmail = null;
  let personnEmail = null;
  const emailsToSendEvent = [];

  const { category, personn } = req.body;

  const eventCreate = await eventModel.create(req.body);

  if (!eventCreate) {
    throw new Error("Error Create This event");
  }

  const sondageCreate = await sondageEventModel.create({
    eventID: eventCreate._id,
    NID: eventCreate.NID,
  });

  if (!sondageCreate) {
    throw new Error("Error Create This sondage event");
  }

  // if (category.length > 0) {
  playerEmail = await playerModel
    .find({ category: { $in: category }, state: 1, emailActive: 1 })
    .select("email first_name last_name -_id");
  // }
  // if (req.body.personn.length > 0) {
  console.log(">>>>>>>>>>>>>>>> req.body.personn", personn);
  personnEmail = await personnelModel
    .find({ rules: { $in: personn } })
    .select("email first_name last_name -_id");
  // }

  if (playerEmail.length > 0) {
    playerEmail.forEach((player) => {
      emailsToSendEvent.push({
        email: player.email,
        first_name: player.first_name,
        last_name: player.last_name,
      });
      // sendMail({
      //   email: player.email,
      //   subject: req.body.nameEvent,
      //   message: `
      //   <div style="text-align:center;">
      //     Hi Dear <b>${player.first_name} ${player.last_name}</b>  <br> <br>
      //     <p style="background-color:grey;color:white;font-size:16px;padding:10px;">
      //     Welcome to Event :
      //    ${req.body.nameEvent}
      //     </p>
      //     <p style="background-color:grey;color:white;
      //               font-size:22px;padding:10px;
      //               border-radius:10px;
      //               border-color: black;
      //               text-align:justify;">
      //     to participe to  this Event ${req.body.text}
      //     </p>
      //     <p>please visit page and accept</p>

      //     <br>
      //     Price is : Adult =  ${req.body.price.adult} | Child = ${req.body.price.kids}

      //      </div>
      //   `,
      // });
    });
  }
  // if (personnEmail.length > 0) {
  //   personnEmail.forEach((personn) => {
  //     emailsToSendEvent.push({
  //       email: personn.email,
  //       first_name: personn.first_name,
  //       last_name: personn.last_name,
  //     });
  //   });
  // }

  // //Send Email to All personn and players
  // emailsToSendEvent.forEach((mail) => {
  //   sendMail({
  //     email: mail.email,
  //     subject: req.body.nameEvent,
  //     message: `
  //       <div style="text-align:center;">
  //         Hi Dear <b>${mail.first_name} ${mail.last_name}</b>  <br> <br>
  //         <p style="background-color:grey;color:white;font-size:16px;padding:10px;">
  //         Welcome to Event :
  //        ${req.body.nameEvent}
  //         </p>
  //         <p style="background-color:grey;color:white;
  //                   font-size:22px;padding:10px;
  //                   border-radius:10px;
  //                   border-color: black;
  //                   text-align:justify;">
  //         to participe to  this Event ${req.body.text}
  //         </p>
  //         <p>please visit page and accept</p>

  //         <br>
  //         Price is : Adult =  ${req.body.price.adult} | Child = ${req.body.price.kids}

  //          </div>
  //       `,
  //   });
  // });

  console.log("====> email player =>>>>", emailsToSendEvent);

  // send email to active
  // await sendMail({
  //   email: "ayouzi86@gmail.com",
  //   subject: "Welcome To Event",
  //   message: `
  //   <div style="text-align:center;">
  //     Hi Dear <b>Houssine</b>  <br> <br>
  //     Welcome to <b style="background-color:grey;color:black;font-size:16px;">Event</b>
  //     <br><br>
  //     to participe to  this Event ${req.body.nameEvent} please visit page and accept

  //      </div>
  //   `,
  // });

  res.status(200).json({ dataEvent: eventCreate, dataSondage: sondageCreate });
});

exports.getAllevents = handleFacory.getAll(eventModel);

exports.getEventByID = handleFacory.getOne(eventModel);

exports.participeEvent = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  let sondagePlayer = "";
  let totalPrice = "";

  const event = await eventModel.findById(id);

  if (!event) {
    throw new Error("This event not Found!");
  }

  totalPrice =
    event.price.adult * req.body.price.adult +
    event.price.kids * req.body.price.kids;

  if (req.rules.includes("player")) {
    sondagePlayer = await sondageEventModel.findOneAndUpdate(
      { eventID: id },
      {
        $push: {
          responsePlayer: {
            player: req.logger,
            adult: req.body.price.adult,
            kids: req.body.price.kids,
            priceTotla: totalPrice,
          },
        },
      },
      {
        new: true,
      }
    );
  }

  if (!req.rules.includes("player")) {
    sondagePlayer = await sondageEventModel.findOneAndUpdate(
      { eventID: id },
      {
        $push: {
          responsePrsonn: {
            personn: req.logger,
            adult: req.body.price.adult,
            kids: req.body.price.kids,
            priceTotla: totalPrice,
          },
        },
      },
      {
        new: true,
      }
    );
  }

  await sendMail({
    email: "ayouzi10@gmail.com",
    subject: "Paricipation payment",
    message: `
          <div style="text-align:center;padding:14px;">
            <div style="text-align:center;padding:10px;
            font-sizee:16px;
            background-color:black;color:white;border-radius:10px;border:1px solid grey;">
            Bonjour M. Houssine ayouzi</div>
            <br>
            Event : <b>${event.nameEvent} </b>
            <p>
              Totle Price  => ${totalPrice}
              <br>
              Adult: ${req.body.price.adult} - enfant : ${req.body.price.kids} 
              <br>
              <p>
              merci de regler le payment le plus vite possible
              </p>
            </p>
          </div>
    `,
  });

  res.status(200).json({ data: sondagePlayer });
});

//player or person can be removed by him self  from this event
exports.removeParticipieFormEvent = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await sondageEventModel.findOneAndUpdate(
    { eventID: id },
    {
      $pull: {
        responsePlayer: { player: req.logger },
        responsePrsonn: { personn: req.logger },
      },
    },
    { new: true }
  );

  if (!event) {
    throw new Error("This event not Found!");
  }

  res.status(200).json({ data: event });
});
