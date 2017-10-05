import dotenv from "dotenv";
import { run } from './server';

dotenv.config({ silent: true });

run(process.env);