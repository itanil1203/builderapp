import express from "express";
import cors from "cors";
import { join } from "node:path";
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from "@angular/ssr/node";

const app = express();
const angularApp = new AngularNodeAppEngine();

// ✅ CORS FIRST
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// ✅ JSON body parser
app.use(express.json());

const browserDistFolder = join(import.meta.dirname, "../browser");

app.post("/api/login", (req, res) => {
  if (
    req.body.username === "srinivas@gmail.com" &&
    req.body.password === "srinivas"
  ) {
    res.status(200).json({ data: "" });
  } else {
    res.status(401).json({ error: "Incorrect email or password" });
  }
});

// app.post("/api/register", (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Basic validation
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         error: "Name, email, and password are required",
//       });
//     }

//     // Email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         error: "Please provide a valid email address",
//       });
//     }

//     // Password length validation
//     if (password.length < 6) {
//       return res.status(400).json({
//         error: "Password must be at least 6 characters long",
//       });
//     }

//     // Check if user already exists (in a real app, you'd check a database)
//     if (email === "srinivas@gmail.com") {
//       return res.status(409).json({
//         error: "User with this email already exists",
//       });
//     }

//     // In a real application, you would:
//     // 1. Hash the password
//     // 2. Store user in database
//     // 3. Send verification email, etc.

//     console.log("New user registration:", { name, email });

//     res.status(201).json({
//       data: "User registered successfully",
//       message: "Account created successfully. You can now login.",
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({
//       error: "Internal server error. Please try again later.",
//     });
//   }
// });

app.get("/api/profile", (req, res) => {
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
      address: "123 Main Street, New York, NY 10001",
    };
    res.json(defaultUserProfile); // ✅ return object, not raw JSON string
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// ✅ Serve Angular static files
app.use(
  express.static(browserDistFolder, {
    maxAge: "1y",
    index: false,
    redirect: false,
  }),
);

// ✅ Handle Angular app rendering
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
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
app.get("/users/current-user/profile", (req, res) => {
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
      address: "123 Main Street, New York, NY 10001",
    };
    res.json(defaultUserProfile); // ✅ return object, not raw JSON string
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export const reqHandler = createNodeRequestHandler(app);
