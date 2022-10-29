import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator'
import { firestoreDb } from '../service/firebaseService'
import { TicketDto } from '../dto/ticketDto'
import { v4 as uuidv4 } from "uuid";
import { BadRequestError } from "../errors/bad-request-error"
import { RequestValidationError } from '../errors/request-validation-error'
import { TicketResponseDto } from '../dto/ticketResponseDto';

const router = express.Router()

// this.uuid = uuidv4();

router.post('/api/users/ticket', 
    [
        body('name')
        .isLength({min: 8, max: 36})
        .withMessage('Ticket Name must be between 12 and 36 '),
        body('description')
        .trim()
        .isLength({min: 10, max: 100})
        .withMessage('Description must be long')
    ],
    async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array())
    }  
    console.log('We are Here')  
   
    try{
      const {name, description, numberOfTickets, userId, expiredDate } = req.body
      
      // const randonNum = Math.floor(Math.random() * 10) + 1
      const firestoreDocRef = firestoreDb()?.collection('tickets').doc(`${userId}`)

      const newTicket: TicketDto = {
          name,
          userId,
          description,
          numberOfTickets,
          expiredDate,
          isActive: true
      }
      
      await firestoreDocRef?.set(newTicket)
      
      return res.status(201).send({ success: true, message: "New Ticket Created"})
    }catch(err){
      throw new BadRequestError('Service Error, try again')
    }

})


router.get('/api/users/ticket/:userId', async (req: Request, res: Response) => {
    try {
      const firestoreTicketDocRef = firestoreDb()?.collection('tickets').doc(`${req.params.userId}`)
      const response = await firestoreTicketDocRef?.get();
      if(!response?.data()){
        return res.status(404).send({ success: false, message: "Ticket Not Found"})
      }
      // const typdata: TicketResponseDto = response?.data()
      // console.log(typdata)
      return res.status(200).send({ success: true, data: response?.data(), message: "User ticket fetch successfully"})
    } catch(err) {
        throw new BadRequestError('fail to fetch data')
    }
  });
 // collection
 // [{id: doc}, {id: docs}]
 // document
 // {id:doc}
  router.get('/api/users/tickets', async (req: Request, res: Response) => {
    try {
      const firestoreTicketDocRef = firestoreDb()?.collection('tickets')
      const response = await firestoreTicketDocRef?.get();

      const responseData =  response?.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))!;

      return res.status(200).send({ success: true, data: responseData, message: "User ticket fetch successfully"})
    } catch(err) {
        throw new BadRequestError('Fail to fetch data')
    }
  });


  router.put('/api/users/ticket/:userId', async(req: Request, res: Response) => {
    try {
      const {  description, numberOfTickets, expiredDate } = req.body
      const firestoreTicketDocRef = firestoreDb()?.collection('tickets').doc(`${req.params.userId}`)  
    .set({
        description,
        numberOfTickets,
        expiredDate
      }, {merge: true}); // update if the doc exist, if not create one
      return res.status(200).send({ success: true, message: "Ticket Details updated "})
      
    } catch(error) {
        throw new BadRequestError('fail to update ticket details')
    }
  });  

  router.delete('/api/users/ticket/:userId', async(req: Request, res: Response) => {
    try {
      firestoreDb()?.collection('tickets').doc(`${req.params.userId}`).delete() 
     return res.status(200).send({ success: true, message: "Ticket Deleted "})
  } catch(error) {
      throw new BadRequestError('fail to delete ticket ')
  }
  });  




export { router as ticketRouter}

