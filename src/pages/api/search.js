import dbConnect from '../../utils/mongo'
import Apartment from '../../models/Apartment'

export default async function handler(req, res) {
   const { method } = req

   dbConnect()

   if (method === 'POST') {
      try {

         const search = new RegExp(req.body.search, "i")

         const results = await Apartment.find({
            $or: [
               { title: search },
               { 'address.city': search }
            ]
         })

         const cities = results.map(({ address }) => address.city)
         res.status(200).json({ results, cities: [...new Set(cities)] })
      } catch (error) {
         res.status(500).json(error)
      }
   }
}