const express = require("express");
const router = express.Router();
const axios = require("axios");
const request = require("request");
const config = require("config");
const auth = require("../../middleware/auth");
const { body, validateResult, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route GET api/profile/me
// @desc  Get Current Users Profile
// @access Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no Profile for this User" });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/profile/me
// @desc  Create or Update User Profile
// @access Private

router.post(
  "/",
  [
    auth,
    body("status", "Status is required").not().isEmpty(),
    body("skills", "Skills is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    // Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET api/profile
// @desc  GET all profiles
// @access Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/user/:user_id
// @desc  GET profile by userId
// @access Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route Delete  api/profile
// @desc  Delete profile, User & posts
// @access Private

router.delete("/", auth, async (req, res) => {
  try {
    //  Remove the Users Posts
    await Post.deleteMany({ user: req.user.id });
    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove the User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ mse: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT  api/profile/experience
// @desc  Add Profile Experience
// @access Private

router.put(
  "/experience",
  [
    auth,
    body("title", "Title is required").not().isEmpty(),
    body("company", "Company is required").not().isEmpty(),
    body("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json({ profile });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE  api/profile/experience/:exp_id
// @desc  Delete exp from Profile
// @access Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });
    //  Get Remove Index
    const removeIdex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIdex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT  api/profile/education
// @desc  Add Profile education
// @access Private

router.put(
  "/education",
  [
    auth,
    body("school", "school is required").not().isEmpty(),
    body("degree", "degree is required").not().isEmpty(),
    body("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
    body("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEducation);
      await profile.save();
      res.json({ profile });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE  api/profile/education/:edu_id
// @desc  Delete education from Profile
// @access Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });
    //  Get Remove Index
    const removeIdex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIdex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET  api/profile/github/:username
// @desc  Get User repos from Github
// @access Public

router.get("/github/:username", async (req, res) => {
  try {
    // const options = {
    //   uri: `https://api.github.com/users/${
    //     req.params.username
    //   }/repos?per_page=5&sort=create:asc&client_id=${config.get(
    //     "githubclientId"
    //   )}&client_secret=${config.get("githubclientSecret")}`,
    //   method: "GET",
    //   headers: { "user-agent": "node.js" },
    // };
    // request(options, (err, response, body) => {
    //   if (err) console.err(err);
    //   if (response.statusCode !== 200) {
    //     return res.status(404).json({ msg: "No Github Profile Found" });
    //   }
    //   res.json(JSON.parse(body));
    // });
    const URI = `https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=create:asc&client_id=${config.get(
      "githubclientId"
    )}&client_secret=${config.get("githubclientSecret")}`;

    const reqData = await axios.get(URI, {
      method: "GET",
      headers: { "user-agent": "node.js" },
    });
    // console.log(reqData.data);
    res.json(reqData.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
