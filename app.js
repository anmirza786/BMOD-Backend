require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();

const cors = require("cors");
app.use(
  express.json(),
  cors({
    origin: "*",
  })
);
const User = require("./model/user");
const Idea = require("./model/idea");
const Partner = require("./model/partners");
const Founder = require("./model/founders");
const Investor = require("./model/invester");
const Marketplace = require("./model/marketplace");
const File = require("./middleware/upload");
const UserDescription = require("./model/userdescription");
const auth = require("./middleware/auth");
const Query = require("./model/Query");
let multipleFields = File.fields([
  {
    name: "thumbnail",
  },
  {
    name: "legal_documentation",
  },
  {
    name: "video",
  },
]);

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
// ...

app.post("/register", File.single("profile"), async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const {
      first_name,
      last_name,
      email,
      password,
      cnic,
      phone,
      is_entreprenure,
    } = req.body;
    let profile = req.file.path;
    console.log(req.body);
    // Validate user input
    if (
      !(
        email &&
        password &&
        first_name &&
        last_name &&
        cnic &&
        phone &&
        is_entreprenure
      )
    ) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    var dt = new Date();

    dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      cnic,
      phone,
      is_entreprenure,
      profile,
      member_since: dt,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
//.
// ...

app.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.post("/idea", auth, multipleFields, async (req, res) => {
  try {
    // console.log(req.files, req.file);
    const { name, description, investment_percentage, required_investment } =
      req.body;
    if (!(name && description && investment_percentage)) {
      res.status(400).send("All input is required");
    }
    let thumbnail = req.files.thumbnail[0].path;
    let legal_documentation = req.files.legal_documentation[0].path;
    let video = req.files.video[0].path;
    console.log(thumbnail, video, legal_documentation);
    const idea = await Idea.create({
      user: req.user.user_id,
      name,
      description,
      investment_percentage,
      required_investment,
      thumbnail,
      legal_documentation,
      video,
    });
    res.status(200).json(idea);
  } catch (err) {
    console.log(err);
  }
});
// ...
app.post("/invest", auth, async (req, res) => {
  try {
    // console.log(req.body);
    const { idea, invested } = req.body;
    if (!(idea && invested)) {
      res.status(400).send("All input is required");
    }

    const invest = await Investor.create({
      user: req.user.user_id,
      idea,
      invested,
    });
    res.status(200).json(invest);
  } catch (err) {
    console.log(err);
  }
});
app.post("/founder", auth, File.single("picture"), async (req, res) => {
  try {
    // console.log(req.body);
    const { idea, name } = req.body;
    if (!(idea && name)) {
      res.status(400).send("All input is required");
    }
    let picture = req.file.path;
    const founder = await Founder.create({
      idea,
      name,
      picture,
    });
    res.status(200).json(founder);
  } catch (err) {
    console.log(err);
  }
});
app.post("/partner", auth, File.single("picture"), async (req, res) => {
  try {
    // console.log(req.body);
    const { idea, name } = req.body;
    if (!(idea && name)) {
      res.status(400).send("All input is required");
    }
    let picture = req.file.path;
    const partner = await Partner.create({
      idea,
      name,
      picture,
    });
    res.status(200).json(partner);
  } catch (err) {
    console.log(err);
  }
});
app.get("/users/me", auth, function (req, res) {
  User.findById(req.user.user_id)
    .then((u) => {
      if (!u) {
        return res.status(404).end();
      }
      return res.status(200).json(u);
    })
    .catch((err) => next(err));
});
app.get("/user/:id", auth, function (req, res) {
  User.findById(req.params.id)
    .then((u) => {
      if (!u) {
        return res.status(404).end();
      }
      return res.status(200).json(u);
    })
    .catch((err) => console.log(err));
});
app.get("/users", function (req, res) {
  User.find(function (err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  }).catch((err) => console.log(err));
});
app.get("/ideas/:id", async (req, res) => {
  Idea.findById(req.params.id)
    .then((u) => {
      if (!u) {
        return res.status(404).end();
      }
      return res.status(200).json(u);
    })
    .catch((err) => console.log(err));
});
app.patch("/updateidea/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    console.log(updatedData);
    const options = { new: true };

    const result = await Idea.findByIdAndUpdate(id, updatedData, options);

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.get("/ideas", async (req, res) => {
  try {
    // console.log(req.files, req.file);
    Idea.find(function (err, todos) {
      if (err) {
        console.log(err);
      } else {
        res.json(todos);
      }
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/founders", async (req, res) => {
  try {
    // console.log(req.files, req.file);
    Founder.find(function (err, todos) {
      if (err) {
        console.log(err);
      } else {
        console.log(map);
        res.json(todos);
      }
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/partners", async (req, res) => {
  try {
    // console.log(req.files, req.file);
    Partner.find(function (err, todos) {
      if (err) {
        console.log(err);
      } else {
        res.json(todos);
      }
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/marketplaces", auth, async (req, res) => {
  try {
    // console.log(req.files, req.file);
    Marketplace.find(function (err, todos) {
      if (err) {
        console.log(err);
      } else {
        res.json(todos);
      }
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/investors", async (req, res) => {
  try {
    // console.log(req.files, req.file);
    Investor.find(function (err, todos) {
      if (err) {
        console.log(err);
      } else {
        res.json(todos);
      }
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/marketplace", auth, async (req, res) => {
  try {
    const { market_name } = req.body;
    if (!market_name) {
      res.status(400).send("All input is required");
    }
    const market = await Marketplace.create({
      market_name,
    });
    res.status(200).json(market);
  } catch (err) {
    console.log(err);
  }
});
app.get("/uploads/:fileName", function (req, res) {
  const filePath = __dirname + "/uploads/" + req.params.fileName;
  res.sendFile(filePath);
});
app.patch(
  "/editprofile/:id",
  auth,
  File.single("profile"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const file = req.file.path;
      const updatedData = req.body;
      console.log(updatedData);
      const options = { new: true };

      const result = await User.findByIdAndUpdate(id, updatedData, options);

      res.send(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
app.delete(
  "/deleteidea/:id",
  auth,

  async (req, res) => {
    try {
      const id = req.params.id;

      const result = await Idea.findByIdAndDelete(id);

      res.send(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
app.get("/search/:key", async (req, res) => {
  try {
    console.log(req.params);

    const data = await Idea.find({
      $or: [
        {
          name: { $regex: req.params.key },
          // description: { $regex: req.params.key },
        },
      ],
    });

    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }

  // let body = JSON.stringify({
  //   key,
  // });
  // res.send(body);
});
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);
module.exports = app;
