import Ajv from 'ajv';
import express, { Request, Response, NextFunction } from 'express';
import { createGenerator } from 'ts-json-schema-generator';
import path from 'path';
import { Person } from "./types";

const repoRoot = process.cwd();
const configType = "Person";
const config = {
  path: path.join(repoRoot, "src", "types.ts"),
  tsconfig: path.join(repoRoot, "tsconfig.json"),
  type: configType,
};
const schema = createGenerator(config).createSchema(configType);
const app = express();
app.use(express.json());

// Middleware to validate incoming payload against JSON Schema
const validatePayload = (req: Request, res: Response, next: NextFunction) => {
  const ajv = new Ajv();
  const validateFn = ajv.compile(schema);

  if (!validateFn(req.body)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  next();
};

// Endpoint that accepts User payloads
app.post('/users', validatePayload, (req: Request, res: Response) => {
  const newUser = req.body as Person;
  // Do something with newUser
  res.json(newUser);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
