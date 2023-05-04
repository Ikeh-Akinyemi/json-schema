import Ajv from 'ajv';
import { createGenerator } from 'ts-json-schema-generator';
import path from 'path';

const repoRoot = process.cwd();

const config = {
  path: path.join(repoRoot, "src", "types.ts"),
  tsconfig: path.join(repoRoot, "tsconfig.json"),
  type: "Person",
};

const schema = createGenerator(config).createSchema("Person")

const validate = (data: any) => {
  const ajv = new Ajv();
  const validateFn = ajv.compile(schema);
  return validateFn(data);
};

const person = {
  firstName: 'Alice',
  lastName: 'Chapman',
  age: 30,
  socials: ['github', 'twitter']
};

console.log(validate(person));
