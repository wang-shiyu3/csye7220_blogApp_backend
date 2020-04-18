const mongoose = require('mongoose')
//const config = require('config')
const db = 'mongodb://amogh:omsairam@cluster0-shard-00-00-skobn.mongodb.net:27017,cluster0-shard-00-01-skobn.mongodb.net:27017,cluster0-shard-00-02-skobn.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    console.log('MongoDB Connected...')
  } catch (err) {
    console.error(err.message)
    //Exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB
