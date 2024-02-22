import express, { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../schemas/user.model';
import Token from "../schemas/tokens.model";

const router = express.Router();
const renSecretKey = "asdfghjkllkjgfdssdfghj";

router.post('/signup', async (req: Request, res: Response) => {

    try {
        const { name, username, password, email } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            // console.log(existingUser);
            let {username}=existingUser;
            console.log("there username : ",username);
            return res.status(400).json({ message: 'Username already exists' });
        }

        let user: any = await User.create({ username, password,email });
        let { _id,  } = user
        let payload ={
           _id:_id,
           username:username,
        }
        // console.log(username)

        let token = jwt.sign(payload, renSecretKey, { expiresIn: '365d' });
       
        let userToken = await Token.create({ _id, username, token, });
        
        res.status(201).json({ message: 'User registered successfully', generatedToken: userToken.token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get("/signout", async (req:Request,res:Response)=>{
 

    try{
        const { username } = req.query;
        
        // console.log("Entered password ",enteredPassword);
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            // console.log(existingUser);
            
            let {_id}=existingUser;
            // console.log(password);
            
                Token.deleteOne({ _id:_id })
                .then(function(){
                    res.status(201).json({ message: 'User signout successfully', username}); 
                 })
                 .catch(function(error){
                    console.log("User token not deleted ",error); 
                 });
            }
            else{
            return res.status(400).json({ message: 'User not found!' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get("/signin", async (req:Request,res:Response)=>{
 

    try{
        const { username, password } = req.query;
        let enteredPassword=password;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            let {_id,password,}=existingUser;
            let payload={
                _id:_id,
                username:username,
            }
            let token = jwt.sign(payload, renSecretKey, { expiresIn: '365d' });
            if(password===enteredPassword){
                const existingToken = await Token.findOne({_id});
                if(existingToken){
                    res.status(200).json({message:"You are already signed in !",existingToken})
                }
                else{
                Token.create({_id,username,token})
                .then(function(){
                    res.status(201).json({ message: 'User signin successfully', token }); 
                 })
                 .catch(function(error){
                    console.log("User not signin ",error); 
                 });
                }
            }
            else{
                console.log("Enter correst password")
                return res.status(400).json({ message: 'Enter correct password!' });
            }
        }
        else{
            return res.status(400).json({ message: 'User not found!' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;