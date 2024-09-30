require('dotenv').config();
const axios = require("axios");
const express = require("express");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5789;
const main_Url = process.env.URL

app.use(express.static("public"));

app.post("/data", async (req, res) => {
  try {
    const Video_Json = JSON.parse(req.body.videoData);
    const Note_Json = JSON.parse(req.body.noteData);
    const Dpp_Json = JSON.parse(req.body.dppData);

    const url = main_Url + req.body.subject;
    const chapter = Video_Json.data[0].tags[0].name;

    var video_data = [];
    var note_data = [];
    var dpp_data = [];

    await axios
      .post(url, { name: chapter })
      .then((res) => {
        var chapterSlug = "/" + res.data.slug;
        console.log("Chapter Created:", res.data.slug);

        Video_Json.data.slice().forEach(function (item, index) {
          let entry = {
            index: 1 + index,
            contentType: "video",
            name: item.topic
              .replace(/[^a-zA-Z0-9\s-]/g, "")
              .replace(/\s+/g, " ")
              .trim(),
            image: item.videoDetails.image,
            contentUrl: item.videoDetails.videoUrl.replace("master.mpd", "hls/480/main.m3u8"),
          };

          video_data.push(entry);
        });

        axios.post(url + chapterSlug, video_data).then((res) => {
          console.log("Videos Added", res.data.success);
        });

        // ---------------N_O_T_E_S------------------

        Note_Json.data.slice().forEach(function (item, index) {
          let entry = {
            index: 1 + index,
            contentType: "note",
            name: item.homeworkIds[0].topic
              .replace(/[^a-zA-Z0-9\s-]/g, "")
              .replace(/\s+/g, " ")
              .trim(),
            contentUrl:
              item.homeworkIds[0].attachmentIds[0].baseUrl +
              item.homeworkIds[0].attachmentIds[0].key,
          };

          note_data.push(entry);
        });

        axios.post(url + chapterSlug, note_data).then((res) => {
          console.log("Note Added", res.data.success);
        });

        // ---------------D_P_P------------------

        Dpp_Json.data.slice().forEach(function (item, index) {
          let entry = {
            index: 1 + index,
            contentType: "dpp",
            name: item.homeworkIds[0].topic
              .replace(/[^a-zA-Z0-9\s-]/g, "")
              .replace(/\s+/g, " ")
              .trim(),
            contentUrl:
              item.homeworkIds[0].attachmentIds[0].baseUrl +
              item.homeworkIds[0].attachmentIds[0].key,
          };

          dpp_data.push(entry);
        });

        axios.post(url + chapterSlug, dpp_data).then((res) => {
          console.log("Dpp Added", res.data.success);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });

    res.send("Chapter Added Sucessfully.");
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

app.listen(PORT, () => {
  console.log("Port", PORT);
});
