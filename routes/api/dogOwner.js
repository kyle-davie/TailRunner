import express from 'express';
import { GetAllPetOwners, GetPetOwnerById, AddPetOwner, UpdatePetOwner, DeletePetOwner } from '../../database.js';

const router = express.Router();

const dogOwners = [
  {id:1,firstName:'John', lastName:'Doe', dogs:['Rex', 'Spot']},
  {id:2,firstName:'Jane', lastName:'Smith', dogs:['Rover']}
]

import debug from 'debug';
const debugDogOwner = debug('app:DogOwner');

// Get All Pet Owners
router.get('', (req, res) => {
  GetAllPetOwners().then((owners)=> {
    res.status(200).json(owners);
  }).catch((error) => {
    res.status(500).send(error);
})});

// Get Pet Owner by ID
router.get('/:id',async (req, res) => {
  const id = req.params.id;
  try {
    const owner = await GetPetOwnerById(id);
    if (JSON.stringify(owner) === '{}' || owner === null) {
      res.status(404).send("Owner not found")
    } else {
      res.status(200).json(owner);
    }
  } catch(error) {
    res.status(500).send(error);
  }});

  // Add Pet Owner
router.post('',async (req,res)=>{
  const owner = req.body;
  if(!owner || !owner.firstName || !owner.lastName || !owner.dogs) {
    res.status(400).json({message:"Invalid Request"});
  } else {
    try {
      const result = await AddPetOwner(owner);
      res.status(201).json({message: "New Owner Added"});
    } catch(error){
      res.status(500).send(error);
    }
  }
});

// Update Pet Owner
router.patch('/:id',async (req,res)=>{
  const id = req.params.id;
  const currentOwner = await GetPetOwnerById(id);
  if (JSON.stringify(currentOwner) === '{}' || currentOwner === null) {
    res.status(404).send('Owner not found');
  } else {
    const updatedOwner = req.body;
    if(updatedOwner.dogs){
      if(Array.isArray(updatedOwner.dogs)){
        updatedOwner.dogs.forEach((dog) => {
          currentOwner.dogs.push(dog);
      });
    } else {
      currentOwner.dogs.push(updatedOwner.dogs)
    }
  }
    if (updatedOwner.firstName){
      currentOwner.firstName = updatedOwner.firstName;
    }
    if (updatedOwner.lastName){
      currentOwner.lastName = updatedOwner.lastName;
    }
    try {
      const result = await UpdatePetOwner(currentOwner);
      res.status(200).json({message:'Owner Updated'});
    }catch(error){
      res.status(500).send(error);
    }
  }
});

// Delete Pet Owner
router.delete('/:id',async (req,res)=>{
  const id = req.params.id;
  try {
    const result = await DeletePetOwner(id);
    if(result.deletedCount === 0){
      res.status(404).send('Owner not found');
    } else {
      res.status(200).json({message:'Owner Deleted'});
    }
  } catch(error) {
    res.status(500).send(error);
  }
});


export {router as dogOwnerRouter};