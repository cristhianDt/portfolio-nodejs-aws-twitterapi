/**
 * {"Id":{"$oid":"62411e8a54155a5b4f06e55f"},"description":"Fighter machines","experienceSummary":"I have been training my hole life, since I was a kid, my caretaker, Rost, taught me how to fight, how to stay one step ahead of machines in order to deal with them. I am very capable to accomplishing differents goals either with a team or alone.","imageUrl":null,"lastNames":"Hoekstra 2","names":"Aloy","tittle":"The anointed","twitterUserId":"1504634529276903424","twitterUserName":"Aloy Hoekstra","userId":"116","address":"Nora Lands","email":"aloy@gmail.com","experience":"7 years","imagePath":"profilePicture.png","name":"Aloy Hoekstra","phone":"1547269854","twitterUser":"@AloyHoekstra75","zipCode":"81658","title":"The anointed"}
 */
const mongoose = require('mongoose')
const { Schema } = mongoose;

const PortfolioSchema = new Schema({
  description: String,
  experienceSummary: String,
  imageUrl: String,
  lastNames: String,
  names: String,
  userId: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  address: String,
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  experience: String,
  name: String,
  phone: String,
  twitterUserId: String,
  twitterUser: String,
  twitterUserName: String,
  zipCode: String,
  title: String
}, { collection: 'Portfolio' });

module.exports = {
  Portfolio: PortfolioSchema
}

