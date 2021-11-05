const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const bodyParser = require('body-parser');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const routes = require('./routes');
const app = express();

const PORT = 3000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'Session',
    keys: ['321sdsd', '2131fsdsds'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'MeetUps';

app.use(express.static(path.join(__dirname, './static')));

app.use(async (req, res, next) => {
  try {
    const names = await speakersService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (error) {
    return next(error);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

// app.use((req, res, next) => {
//   return next();
// });

//Error handler middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Express server lsitening on ${PORT}`);
});
