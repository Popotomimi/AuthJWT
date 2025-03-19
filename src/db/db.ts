import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const DatabaseModule = MongooseModule.forRoot(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zkgcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
);
