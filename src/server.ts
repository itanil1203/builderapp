import express from 'express';
import cors from 'cors';
import { join } from 'node:path';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

const app = express();
const angularApp = new AngularNodeAppEngine();

// ✅ CORS FIRST
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ JSON body parser
app.use(express.json());

const browserDistFolder = join(import.meta.dirname, '../browser');


app.post('/api/login',(req,res)=>{
  if(req.body.username=== 'srinivas@gmail.com' && req.body.password==='srinivas'){
    res.status(200).json({'data': ''})
  }else{
    res.status(401).json({'error':'Incorrect email or password'})
  }
});

app.get('/api/profile', (req, res) => {
  try {
    console.log("Received server call");
    const defaultUserProfile = {
      firstName: "Srinivas",
      lastName: "Lyagala",
      email: "srinivas@gmail.com",
      profilePicture: "https://example.com/default-profile.png",
      dob: "1990-01-01",
      gender: "Male",
      phone: "+1-555-123-4567",
      address: "123 Main Street, New York, NY 10001"
    };
    res.json(defaultUserProfile); // ✅ return object, not raw JSON string
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});


// ✅ Serve Angular static files
app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false,
  redirect: false,
}));

// ✅ Handle Angular app rendering
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then(response =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = 4000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

// ✅ Example route
app.get('/users/current-user/profile', (req, res) => {
  try {
    console.log("Received server call");
    const defaultUserProfile = {
      firstName: "srinivas",
      lastName: "lyagala",
      email: "srinivas@example.com",
      profilePicture: "https://example.com/default-profile.png",
      dob: "1990-01-01",
      gender: "Male",
      contactNumber: "+1-555-123-4567",
      address: "123 Main Street, New York, NY 10001"
    };
    res.json(defaultUserProfile); // ✅ return object, not raw JSON string
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export const reqHandler = createNodeRequestHandler(app);
