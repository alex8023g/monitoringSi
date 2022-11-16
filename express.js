import express from 'express';
import bodyParser from 'body-parser';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';
import mongodb from 'mongodb';
import cors from 'cors';
import path from 'node:path';
const client = new MongoClient(
  'mongodb+srv://q:q@cluster0.ijjfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
);
let ObjectId = mongodb.ObjectId;
dotenv.config();

(async () => {
  await client.connect();
})();

const app = express();
//app.set('view engine', 'html');
app.use(express.json());
app.use(express.static(path.resolve('./build')));
app.use(express.static(path.resolve('./planrabot')));
app.use(cookieParser());
app.use(cors());

const db = client.db('planrabot');
const secheniyaDb = db.collection('secheniya');
const OtDb = db.collection('ot');
const usersDb = db.collection('users');

function toHash(x) {
  let hash1 = crypto.createHash('sha256');
  hash1.update(x);
  let hash = hash1.digest('hex');
  return hash;
}

const auth = () => (req, res, next) => {
  console.log('req.cookies', req.cookies);
  if (!req.cookies?.['sessionID']) {
    console.log('нет req.cookies?.[sessionID]');
    return next();
  } else {
    console.log('req.cookies.sessionID', req.cookies.sessionID, sessionIDObj);
    // let user = DB.users.find(
    //   (item) => item.sessionID == req.cookies['sessionID']
    // );
    let sessionID = req.cookies['sessionID'];
    let user = sessionIDObj[sessionID];
    if (!user) {
      return next();
    }
    req.user = user;
    console.log('req.user', req.user);
    next();
  }
};

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

app.get('/readsech', auth(), (req, res) => {
  res.sendFile(path.resolve('./planrabot/readSech.html'));
});

app.get('/monitoringsi', (req, res) => {
  console.log(path.resolve('./build/index.html'));
  res.sendFile(path.resolve('./build/index.html'));
});

let sessionIDObj = {};
app.get('/login', (req, res) => {
  res.sendfile('login.html');
});

app.post(
  '/api/login',
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    console.log('req.body', req.body);
    const { username, password } = req.body;
    let passwordhash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    // console.log({ passwordhash });
    let users = await usersDb.find().toArray();
    console.log(users, username);
    let user = users.find((item) => item.username == username);
    console.log(user);
    // let user = usersDb.users.find((item) => item.username == username);
    if (!user) {
      res.send('нет такого пользователя');
    }
    // let hash = toHash(password);
    // if (hash != user.password) {
    if (passwordhash != user.password) {
      res.send('пароль неверный');
    }
    let sessionID = nanoid();
    sessionIDObj[sessionID] = username;
    console.log('sessionIDs', sessionIDObj);
    // user.sessionID = sessionID;
    // usersDb.sessions.push(sessionID);
    res.cookie('sessionID', sessionID).redirect('/readsech');
  }
);

app.get('/metrology', (req, res) => {
  res.sendfile('metrology.html');
});

app.post('/api/addsech', async (req, res) => {
  let resultAddsech = await secheniyaDb.insertOne(req.body);
  console.log('/api/addsech', resultAddsech);
  res.send(resultAddsech);
});

app.post('/api/addot', async (req, res) => {
  console.log('/api/addot');
  let result = await OtDb.insertMany(req.body);
  console.log('/api/addot many result', result.insertedIds);
  res.send(result.insertedIds);
  /*
req.body.forEach(async (item) => {
  let user = await OtDb
      .find({ gr: item.gr })
      .toArray();
      console.log(user)
  if (user[0]) {
    console.log('такое ОТ уже есть в БД ОТ')
    }
  else {
    OtDb.insertOne(item);
      };
});
*/
});

app.get('/api/readsech', async (req, res) => {
  let x = await secheniyaDb.find().toArray();
  //console.log('readsech=', x);
  res.send(x);
});

app.get('/api/readot', async (req, res) => {
  let x = await OtDb.find().toArray();
  //console.log('readot=', x);
  res.send(x);
});

app.post('/api/delsech', async (req, res) => {
  console.log('/api/delsech', req.body.id);

  let id = req.body.id;
  let o_id = new ObjectId(id);
  //db.test.find({_id:o_id})
  console.log('o_id', o_id);

  let result = await secheniyaDb.deleteOne({ _id: o_id });
  console.log('/api/delsech', result);
  res.send(result);
});

app.post('/api/editsech', async (req, res) => {
  console.log('/api/editsech req.body', req.body._id);
  let id = req.body._id;
  let o_id = new ObjectId(id);
  //req.body._id = o_id;
  //console.log("/api/editsech req.body", req.body._id);
  let y1 = await secheniyaDb.updateOne(
    { _id: o_id },
    {
      $set: {
        naimSechShort: req.body.naimSechShort,
        vidRabot: req.body.vidRabot,
        soglGtp: req.body.soglGtp,
        dopusk: req.body.dopusk,
        sdAs: req.body.sdAs,
        sdPas: req.body.sdPas,
        krSrokPodachi: req.body.krSrokPodachi,
        planPodachi: req.body.planPodachi,
        metrologyKomm: req.body.metrologyKomm,
        codirovkaActual: req.body.codirovkaActual,
        tipIzmCodirovki: req.body.tipIzmCodirovki,
        zaprosPerecod: req.body.zaprosPerecod,
        sogl60Dku: req.body.sogl60Dku,
        sogl60SmezhOtpr: req.body.sogl60SmezhOtpr,
        sogl60SmezhSogl: req.body.sogl60SmezhSogl,
        otprav4v: req.body.otprav4v,
        sogl4v: req.body.sogl4v,
        sverkiKomm: req.body.sverkiKomm,
        sv1: req.body.sv1,
        sv2: req.body.sv2,
        sv3: req.body.sv3,
        pi: req.body.pi,
        textOt: req.body.textOt,
        gotovnostUs: req.body.gotovnostUs,
        zakluchenie: req.body.zakluchenie,
        osobenAiis: req.body.osobenAiis,
        kolTi: req.body.kolTi,
        sobstvAiis: req.body.sobstvAiis,
        sverkiKomm: req.body.sverkiKomm,
      },
    }
  );
  console.log('сечение', y1);
  res.send(y1);
});

app.post('/api/editcell', async (req, res) => {
  console.log('/api/editcell req.body', req.body);
  let id = req.body._id;
  let o_id = new ObjectId(id);
  let field = req.body.field;
  let y2 = await secheniyaDb.updateOne(
    { _id: o_id },
    {
      $set: {
        [field]: req.body.fieldValue,
      },
    }
  );
  console.log('сечение', y2);
  res.send(y2);
});

app.post('/api/editot', async (req, res) => {
  console.log('/api/editot req.body', req.body._id);
  let id = req.body._id;
  let o_id = new ObjectId(id);
  //req.body._id = o_id;
  //console.log("/api/editsech req.body", req.body._id);
  let y2 = await OtDb.updateOne(
    { _id: o_id },
    {
      $set: {
        gr: req.body.gr,
        sdSop: req.body.sdSop,
        naimAiis1: req.body.naimAiis1,
        naimAiis2: req.body.naimAiis2,
        izmAiis: req.body.izmAiis,
        tipIzmOt: req.body.tipIzmOt,
        neobhRab: req.body.neobhRab,
        rabZaplan: req.body.rabZaplan,
        dogPlan: req.body.dogPlan,
        dogFact: req.body.dogFact,
        smrPlan: req.body.smrPlan,
        smrFact: req.body.smrFact,
        vyezdPlan: req.body.vyezdPlan,
        vyezdFact: req.body.vyezdFact,
        vniimsFact: req.body.vniimsFact,
        rstFact: req.body.rstFact,
        prikazFact: req.body.prikazFact,
        oforSopFact: req.body.oforSopFact,
        kommOt: req.body.kommOt,
      },
    }
  );
  console.log('ОТ', y2);
  res.send(y2);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
