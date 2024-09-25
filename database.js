import {MongoClient, ObjectId} from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';
const debugDb = debug('app:Database');

let _db = null;

async function connectToDatabase() {
  if(!_db) {
    const connectionString = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;

    const client = await MongoClient.connect(connectionString);
    _db = client.db(dbName);
  }
  return _db;
}

async function ping() {
  const db = await connectToDatabase();
  const pong = await db.command({ping: 1});
}

async function GetAllPetOwners() {
  const db = await connectToDatabase();
  return await db.collection('PetOwners').find({}).toArray();
}

async function GetPetOwnerById(id) {
  const db = await connectToDatabase();
  if(id.length !== 24) {
    return {};
  } else {
    const user = await db.collection('PetOwners').findOne({_id: new ObjectId(id)});
    return user;
  }
}

async function AddPetOwner(owner) {
  const db = await connectToDatabase();
  return await db.collection('PetOwners').insertOne(owner);
}

async function UpdatePetOwner(updatedOwner) {
  const db = await connectToDatabase();
  const dbResult = await db.collection('PetOwners').updateOne({_id: new ObjectId(updatedOwner._id)}, {$set: updatedOwner});
  return dbResult;
}

ping();

export{GetAllPetOwners, GetPetOwnerById, AddPetOwner, UpdatePetOwner}